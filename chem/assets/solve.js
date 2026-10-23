/* ============================================================
   拍照解题 · 化学（鲁教版九年级）
   零依赖：取图 → 压缩 → 调用 OpenAI 兼容多模态接口 → 分步讲解
   图片只在内存中处理，不写入 localStorage、不上传留存
   ============================================================ */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var CFG_KEY = 'chemSolveCfg';
  var HIST_KEY = 'chemSolveHist';

  var state = { img: null, text: '', busy: false, result: null };

  /* ---------------- 接口预设 ---------------- */
  var PRESETS = {
    silicon:{ base: 'https://api.siliconflow.cn/v1',                    model: 'Qwen/Qwen2.5-VL-7B-Instruct', name: '硅基流动（注册最简单）' },
    qwen:   { base: 'https://dashscope.aliyuncs.com/compatible-mode/v1', model: 'qwen3-vl-plus', name: '通义千问（阿里云百炼）' },
    zhipu:  { base: 'https://open.bigmodel.cn/api/paas/v4',              model: 'glm-4v-plus',        name: '智谱 GLM-4V' },
    ark:    { base: 'https://ark.cn-beijing.volces.com/api/v3',          model: '',                   name: '火山方舟（需填推理接入点 ID）' },
    custom: { base: '',                                                  model: '',                   name: '自定义（OpenAI 兼容）' }
  };

  var CFG_V = 2;
  function getCfg() {
    var c = {};
    try { c = JSON.parse(localStorage.getItem(CFG_KEY)) || {}; } catch (e) { return {}; }
    /* 旧配置迁移：模型名随预设升级，保留 key 与地址 */
    if (c && c.preset && PRESETS[c.preset] && c.v !== CFG_V) {
      var p = PRESETS[c.preset];
      if (!c.model || c.model === 'qwen-vl-max-latest') c.model = p.model;
      c.v = CFG_V;
      try { localStorage.setItem(CFG_KEY, JSON.stringify(c)); } catch (e) {}
    }
    return c;
  }
  function setCfg(c) {
    try { localStorage.setItem(CFG_KEY, JSON.stringify(c)); } catch (e) {}
  }
  function hasKey() {
    var c = getCfg();
    return !!(c.key && c.base && c.model);
  }

  /* ---------------- 化学排版 ---------------- */
  var ELEM = ('H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn ' +
    'Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce W Pt Au Hg Pb Bi').split(' ');

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* 化学式：H2SO4 → H<sub>2</sub>SO<sub>4</sub>；Ca(OH)2 同理 */
  function fmtFormula(tok) {
    var parts = tok.match(/\([^()]*\)\d*|[A-Z][a-z]?\d*/g);
    if (!parts || parts.join('') !== tok) return null;
    var ok = true;
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      if (p.charAt(0) === '(') continue;
      var m = p.match(/^([A-Z][a-z]?)(\d*)$/);
      if (!m || ELEM.indexOf(m[1]) < 0) { ok = false; break; }
    }
    if (!ok) return null;
    return tok.replace(/(\d+)/g, '<sub>$1</sub>');
  }

  /* 行内化学排版：保留 **粗体**、化学式下标、反应条件箭头、↑↓ */
  function chemHTML(raw) {
    var t = esc(raw);
    t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    /* 反应条件：=△= / =点燃= / =高温= / =通电= / =催化剂= */
    t = t.replace(/=(△|点燃|高温|通电|催化剂|光照)=/g,
      function (_, c) { return '<span class="eq-arw"><em>' + c + '</em>→</span>'; });
    /* 模型偶尔直接输出 Unicode 下标（H₂SO₄），统一转成 <sub> */
    var SUB = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
    t = t.replace(/[₀-₉]+/g, function (m) {
      return '<sub>' + m.split('').map(function (c) { return SUB[c]; }).join('') + '</sub>';
    });
    /* 化学式（ASCII 写法 H2SO4） */
    t = t.replace(/[A-Z][A-Za-z0-9()]{1,24}/g, function (m) {
      if (!/\d/.test(m)) return m;
      var r = fmtFormula(m);
      return r || m;
    });
    return t;
  }

  var CN = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
  function kdLink(kd) {
    var n = parseInt(String(kd || '').split('-')[0], 10);
    if (!n || n < 1 || n > 12) return '';
    var uid = (n <= 6 ? 'U' : 'D') + n;
    return '<a class="sv-kd" href="knowledge.html#' + uid + '">相关知识点：第' +
      CN[n] + '单元 →</a>';
  }

  /* ---------------- 图片处理 ---------------- */
  function compress(file) {
    return new Promise(function (resolve, reject) {
      if (!file || !/^image\//.test(file.type)) { reject(new Error('请选择图片文件')); return; }
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        var MAX = 1600;
        var w = img.naturalWidth, h = img.naturalHeight;
        var sc = Math.min(1, MAX / Math.max(w, h));
        var cw = Math.round(w * sc), ch = Math.round(h * sc);
        var cv = document.createElement('canvas');
        cv.width = cw; cv.height = ch;
        var cx = cv.getContext('2d');
        cx.fillStyle = '#fff';
        cx.fillRect(0, 0, cw, ch);
        cx.drawImage(img, 0, 0, cw, ch);
        URL.revokeObjectURL(url);
        try {
          resolve(cv.toDataURL('image/jpeg', 0.82));
        } catch (e) { reject(new Error('图片处理失败，请换一张试试')); }
      };
      img.onerror = function () {
        URL.revokeObjectURL(url);
        reject(new Error('这张图打不开，请换一张试试'));
      };
      img.src = url;
    });
  }

  /* ---------------- 提示词 ---------------- */
  var SYS = [
    '你是初中化学老师，用的是鲁教版（2024）九年级教材。',
    '学生会发来一张化学题的照片，你要先准确读出题目，再像上课一样分步讲解。',
    '',
    '只输出一个 JSON 对象，不要输出解释文字，不要用代码块包裹。字段如下：',
    '{',
    '  "stem": "完整题干，含选项。化学式写成 H2SO4、Ca(OH)2 这样的普通文本；方程式用 = 连接，条件写成 =△=、=点燃=、=高温=、=通电=；气体↑、沉淀↓保留",',
    '  "type": "选择题/填空题/计算题/实验题/推断题/其他（选一个）",',
    '  "idea": "一句话点出这道题在考什么、从哪儿下手（30 字以内）",',
    '  "steps": [{"title": "这一步做什么（10 字以内）", "body": "具体怎么想、怎么算、得到什么", "why": "依据，一句话；没有就留空"}],',
    '  "answer": "最终答案（选择题写选项字母+内容）",',
    '  "pitfall": "本题最容易错的一点，一句话",',
    '  "kd": "对应章节号，如 7-2；拿不准就填空字符串"',
    '}',
    '',
    '要求：',
    '1. stem 只写图上真实存在的内容：图里没有 ABCD 选项就不要加选项，没有的数据不要补；实在看不清写「（图片此处不清）」；',
    '2. steps 写 2–5 步，一步只讲一件事，语言口语化，不要「首先/其次/最后」堆砌；',
    '3. 化学式、方程式必须准确，配平必须正确，条件不能漏；',
    '4. 计算题要写出代入的数据和单位；',
    '5. 如果照片不是化学题，type 写「其他」，steps 只写一条说明原因。'
  ].join('\n');

  function userContent() {
    if (state.img) {
      return [
        { type: 'text', text: '请讲解这张照片里的化学题。' },
        { type: 'image_url', image_url: { url: state.img } }
      ];
    }
    return '请讲解这道化学题：\n' + state.text;
  }

  /* ---------------- 接口调用 ---------------- */
  function callAPI() {
    var cfg = getCfg();
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, 60000);
    return fetch(cfg.base.replace(/\/+$/, '') + '/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + cfg.key
      },
      body: JSON.stringify({
        model: cfg.model,
        temperature: 0.2,
        max_tokens: 1600,
        messages: [
          { role: 'system', content: SYS },
          { role: 'user', content: userContent() }
        ]
      }),
      signal: ctrl.signal
    }).then(function (r) {
      clearTimeout(timer);
      if (!r.ok) {
        return r.text().then(function (t) {
          var msg = '接口返回 ' + r.status;
          if (r.status === 401) msg = '密钥无效，请到设置里检查';
          else if (r.status === 403) msg = '这个模型你的账号没有权限：去控制台「模型广场」开通，或换一个模型名';
          else if (r.status === 404) msg = '接口地址或模型名不对，请到设置里检查';
          else if (r.status === 429) msg = '调用太频繁或额度用完了，稍后再试';
          else if (t) msg += '：' + t.slice(0, 120);
          throw new Error(msg);
        });
      }
      return r.json();
    }).then(function (j) {
      var c = j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
      if (Array.isArray(c)) c = c.map(function (x) { return x.text || ''; }).join('');
      if (!c) throw new Error('接口没有返回内容');
      return parseJSON(c);
    }).catch(function (e) {
      clearTimeout(timer);
      if (e.name === 'AbortError') throw new Error('等太久了（60 秒），可能是网络慢或图片太大，请重试');
      throw e;
    });
  }

  function parseJSON(text) {
    var s = String(text).trim();
    s = s.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
    var a = s.indexOf('{'), b = s.lastIndexOf('}');
    if (a >= 0 && b > a) {
      try {
        var o = JSON.parse(s.slice(a, b + 1));
        if (o && (o.stem || o.steps)) return o;
      } catch (e) {}
    }
    return { stem: '', type: '其他', idea: '', steps: [{ title: '原文', body: s }], answer: '', pitfall: '', kd: '' };
  }

  /* ---------------- 渲染 ---------------- */
  function renderResult(o) {
    var host = $('#result');
    var steps = (o.steps || []).map(function (st, i) {
      return '<details class="sv-step"' + (i === 0 ? ' open' : '') + '>' +
        '<summary><span class="sv-n">' + (i + 1) + '</span>' +
        '<span class="sv-st">' + chemHTML(st.title || ('第 ' + (i + 1) + ' 步')) + '</span></summary>' +
        '<div class="sv-sb">' + chemHTML(st.body || '') + '</div>' +
        (st.why ? '<div class="sv-why"><b>依据</b>' + chemHTML(st.why) + '</div>' : '') +
        '</details>';
    }).join('');

    host.innerHTML =
      '<div class="sv-res">' +
        '<div class="sv-rhead">' +
          '<span class="sv-type">' + esc(o.type || '题目') + '</span>' +
          '<button class="sv-mini" id="btn-edit-stem" type="button">题干有误？</button>' +
        '</div>' +
        (o.stem ? '<div class="sv-stem">' + chemHTML(o.stem) + '</div>' : '') +
        '<div class="sv-stemedit" id="stem-edit" hidden>' +
          '<textarea id="stem-ta" rows="4"></textarea>' +
          '<div class="sv-row"><button class="btn" type="button" id="btn-stem-cancel">取消</button>' +
          '<button class="btn primary" type="button" id="btn-stem-redo">按改后的题干重讲</button></div>' +
        '</div>' +
        (o.idea ? '<div class="sv-idea"><b>思路</b>' + chemHTML(o.idea) + '</div>' : '') +
        '<div class="sv-steps">' + steps + '</div>' +
        (o.answer ? '<div class="sv-ans"><span class="sv-lab">答案</span><div>' + chemHTML(o.answer) + '</div></div>' : '') +
        (o.pitfall ? '<div class="sv-pit"><b>易错</b>' + chemHTML(o.pitfall) + '</div>' : '') +
        kdLink(o.kd) +
        '<div class="sv-disc">讲解由 AI 生成，仅供学习参考；发现错误请以课本和老师为准。</div>' +
      '</div>';

    var pc = $('#preview-card');
    if (pc && !pc.hidden) pc.classList.add('is-done');
    host.scrollIntoView({ behavior: 'smooth', block: 'start' });

    var ta = $('#stem-ta');
    ta.value = o.stem || '';
    $('#btn-edit-stem').addEventListener('click', function () {
      var box = $('#stem-edit');
      box.hidden = !box.hidden;
      if (!box.hidden) ta.focus();
    });
    $('#btn-stem-cancel').addEventListener('click', function () { $('#stem-edit').hidden = true; });
    $('#btn-stem-redo').addEventListener('click', function () {
      var v = ta.value.trim();
      if (!v) return;
      state.img = null;
      state.text = v;
      analyze();
    });
  }

  function renderLoading() {
    $('#result').innerHTML =
      '<div class="sv-res sv-loading">' +
        '<div class="sv-rhead"><span class="sv-type">正在读题…</span></div>' +
        '<div class="skl" style="width:88%"></div><div class="skl" style="width:72%"></div>' +
        '<div class="skl" style="width:80%"></div><div class="skl" style="width:56%"></div>' +
        '<p class="sv-load-tip">通常 5–15 秒。图片越清楚，读得越准。</p>' +
      '</div>';
    $('#result').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderError(msg) {
    $('#result').innerHTML =
      '<div class="sv-res sv-err">' +
        '<div class="sv-rhead"><span class="sv-type">没解出来</span></div>' +
        '<p class="sv-errm">' + esc(msg) + '</p>' +
        '<div class="sv-row">' +
          '<button class="btn" type="button" id="btn-retry">重试</button>' +
          '<button class="btn" type="button" id="btn-to-text">改用文字输入</button>' +
          '<button class="btn" type="button" id="btn-to-cfg">检查设置</button>' +
        '</div>' +
      '</div>';
    var r = $('#btn-retry');
    if (r) r.addEventListener('click', analyze);
    var t = $('#btn-to-text');
    if (t) t.addEventListener('click', function () { openText(); });
    var c = $('#btn-to-cfg');
    if (c) c.addEventListener('click', openCfg);
    $('#result').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------------- 主流程 ---------------- */
  function analyze() {
    if (state.busy) return;
    if (!state.img && !state.text) return;
    if (!hasKey()) { openCfg(true); return; }

    state.busy = true;
    $('#btn-analyze').disabled = true;
    renderLoading();

    callAPI().then(function (o) {
      state.result = o;
      renderResult(o);
      pushHistory(o);
    }).catch(function (e) {
      renderError(e.message || '出错了');
    }).then(function () {
      state.busy = false;
      var b = $('#btn-analyze');
      if (b) b.disabled = false;
    });
  }

  /* ---------------- 历史 ---------------- */
  function pushHistory(o) {
    if (!o || !o.stem) return;
    var h = [];
    try { h = JSON.parse(localStorage.getItem(HIST_KEY)) || []; } catch (e) {}
    h.unshift({ t: Date.now(), stem: o.stem.slice(0, 120), type: o.type || '' });
    h = h.slice(0, 10);
    try { localStorage.setItem(HIST_KEY, JSON.stringify(h)); } catch (e) {}
    renderHistory();
  }

  function renderHistory() {
    var h = [];
    try { h = JSON.parse(localStorage.getItem(HIST_KEY)) || []; } catch (e) {}
    var box = $('#sv-hist');
    if (!box) return;
    if (!h.length) { box.innerHTML = ''; box.hidden = true; return; }
    box.hidden = false;
    box.innerHTML = '<div class="sv-hhead"><span>最近讲过</span>' +
      '<button class="sv-mini" type="button" id="btn-clear-hist">清空</button></div>' +
      h.map(function (x, i) {
        return '<button class="sv-hitem" type="button" data-i="' + i + '">' +
          '<span class="sv-hd">' + (x.type || '题目') + '</span>' +
          '<span class="sv-ht">' + esc(x.stem) + '</span></button>';
      }).join('');
    $('#btn-clear-hist').addEventListener('click', function () {
      localStorage.removeItem(HIST_KEY);
      renderHistory();
    });
    Array.prototype.forEach.call(box.querySelectorAll('.sv-hitem'), function (b) {
      b.addEventListener('click', function () {
        state.img = null;
        state.text = h[+b.dataset.i].stem;
        $('#txt-input').value = state.text;
        openText();
      });
    });
  }

  /* ---------------- 界面切换 ---------------- */
  function showPreview(dataUrl) {
    state.img = dataUrl;
    state.text = '';
    $('#preview').src = dataUrl;
    $('#pick-card').hidden = true;
    $('#text-card').hidden = true;
    $('#preview-card').hidden = false;
    $('#result').innerHTML = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openText() {
    state.img = null;
    $('#pick-card').hidden = false;
    $('#preview-card').hidden = true;
    $('#text-card').hidden = false;
    $('#txt-input').focus();
  }

  function resetPick() {
    state.img = null;
    state.text = '';
    $('#preview').removeAttribute('src');
    $('#preview-card').hidden = true;
    $('#text-card').hidden = true;
    $('#pick-card').hidden = false;
    $('#result').innerHTML = '';
  }

  /* ---------------- 设置 ---------------- */
  function formCfg() {
    return {
      preset: $('#cfg-preset').value,
      base: $('#cfg-base').value.trim(),
      model: $('#cfg-model').value.trim(),
      key: $('#cfg-key').value.trim()
    };
  }
  function cfgMsg(text, kind) {
    var el = $('#cfg-msg');
    el.textContent = text || '';
    el.className = 'sv-cfg-msg' + (kind ? ' ' + kind : '');
  }

  /* 用表单里的值直接探一次，不消耗真题目、不用先保存 */
  function testConn() {
    var c = formCfg();
    if (!c.base || !c.model) { cfgMsg('接口地址和模型名不能空', 'bad'); return; }
    if (!c.key) { cfgMsg('API Key 还没填', 'bad'); return; }
    if (!/^https?:\/\//.test(c.base)) { cfgMsg('接口地址要以 https:// 开头', 'bad'); return; }

    var btn = $('#btn-cfg-test');
    btn.disabled = true;
    cfgMsg('正在连接…', '');

    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, 25000);

    fetch(c.base.replace(/\/+$/, '') + '/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + c.key },
      body: JSON.stringify({
        model: c.model,
        max_tokens: 8,
        messages: [{ role: 'user', content: '只回复两个字：正常' }]
      }),
      signal: ctrl.signal
    }).then(function (r) {
      clearTimeout(timer);
      if (r.ok) return r.json();
      return r.text().then(function (t) {
        var m = '连接失败（' + r.status + '）';
        if (r.status === 401) m += '：密钥无效，或这个 key 不属于当前服务商';
        else if (r.status === 403) m += '：key 有效，但该模型未开通权限，换个模型名试试';
        else if (r.status === 404) m += '：地址或模型名不对';
        else if (r.status === 429) m += '：额度用完或请求太频繁';
        else if (t) m += '：' + t.slice(0, 100);
        throw new Error(m);
      });
    }).then(function (j) {
      var c2 = j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
      if (Array.isArray(c2)) c2 = c2.map(function (x) { return x.text || ''; }).join('');
      cfgMsg('连接成功 · 模型回了「' + String(c2 || '').trim().slice(0, 20) + '」', 'ok');
    }).catch(function (e) {
      clearTimeout(timer);
      if (e.name === 'AbortError') cfgMsg('超时了（25 秒），检查网络或换个服务商', 'bad');
      else if (String(e.message).indexOf('Failed to fetch') >= 0) cfgMsg('请求发不出去：可能是网络或该服务不允许网页调用', 'bad');
      else cfgMsg(e.message || '连接失败', 'bad');
    }).then(function () {
      btn.disabled = false;
    });
  }

  function openCfg(focus) {
    var cfg = getCfg();
    var sel = $('#cfg-preset');
    sel.value = cfg.preset || 'qwen';
    applyPreset(sel.value, cfg);
    $('#cfg-key').value = cfg.key || '';
    cfgMsg('');
    $('#cfg-sheet').hidden = false;
    document.body.classList.add('sv-lock');
    if (focus) $('#cfg-key').focus();
  }
  function closeCfg() {
    $('#cfg-sheet').hidden = true;
    document.body.classList.remove('sv-lock');
  }
  function applyPreset(k, cfg) {
    var p = PRESETS[k] || PRESETS.qwen;
    $('#cfg-base').value = (cfg && cfg.preset === k && cfg.base) ? cfg.base : p.base;
    $('#cfg-model').value = (cfg && cfg.preset === k && cfg.model) ? cfg.model : p.model;
    $('#cfg-hint').textContent = k === 'silicon'
      ? 'cloud.siliconflow.cn 手机号注册即送额度，「API 密钥」页新建一个，复制 sk- 开头那串。'
      : k === 'qwen'
      ? '在阿里云百炼控制台创建 API Key（需实名，每模型 100 万 tokens）。'
      : k === 'zhipu' ? '在智谱开放平台创建 API Key。'
      : k === 'ark' ? '模型名填火山方舟的「推理接入点 ID」（ep- 开头）。'
      : '填任意 OpenAI 兼容服务的地址与模型名。';
  }

  /* ---------------- 事件绑定 ---------------- */
  function bind() {
    /* 取图 */
    $('#btn-camera').addEventListener('click', function () { $('#file-camera').click(); });
    $('#btn-album').addEventListener('click', function () { $('#file-album').click(); });
    $('#btn-paste').addEventListener('click', function () {
      openText();
      $('#txt-input').placeholder = '也可以在电脑上直接 Ctrl+V 粘贴截图…';
    });

    ['file-camera', 'file-album'].forEach(function (id) {
      $('#' + id).addEventListener('change', function (e) {
        var f = e.target.files && e.target.files[0];
        e.target.value = '';
        if (!f) return;
        $('#pick-card').hidden = true;
        compress(f).then(showPreview).catch(function (err) {
          alert(err.message || '图片读取失败');
          resetPick();
        });
      });
    });

    /* 粘贴 / 拖入 */
    document.addEventListener('paste', function (e) {
      var items = (e.clipboardData && e.clipboardData.items) || [];
      for (var i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') === 0) {
          var f = items[i].getAsFile();
          if (f) {
            e.preventDefault();
            compress(f).then(showPreview).catch(function () {});
            return;
          }
        }
      }
    });
    ['dragover', 'drop'].forEach(function (ev) {
      document.addEventListener(ev, function (e) { e.preventDefault(); });
    });
    document.addEventListener('drop', function (e) {
      var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (f && /^image\//.test(f.type)) {
        compress(f).then(showPreview).catch(function () {});
      }
    });

    /* 预览区动作 */
    $('#btn-repick').addEventListener('click', resetPick);
    $('#btn-analyze').addEventListener('click', analyze);

    /* 文字输入 / 返回拍照 */
    $('#btn-text-mode').addEventListener('click', resetPick);
    $('#btn-txt-analyze').addEventListener('click', function () {
      var v = $('#txt-input').value.trim();
      if (!v) { $('#txt-input').focus(); return; }
      state.img = null;
      state.text = v;
      analyze();
    });

    /* 设置 */
    $('#btn-cfg').addEventListener('click', function () { openCfg(false); });
    $('#cfg-close').addEventListener('click', closeCfg);
    $('#cfg-preset').addEventListener('change', function () {
      applyPreset(this.value, null);
    });
    $('#btn-cfg-test').addEventListener('click', testConn);
    $('#btn-cfg-save').addEventListener('click', function () {
      var c = formCfg();
      if (!c.base || !c.model) { alert('接口地址和模型名都要填'); return; }
      if (!/^https?:\/\//.test(c.base)) { alert('接口地址要以 https:// 开头'); return; }
      c.v = CFG_V;
      setCfg(c);
      var tip = $('#cfg-tip');
      if (tip) tip.hidden = true;
      closeCfg();
      if (state.img || state.text) analyze();
    });
    $('#btn-cfg-clear').addEventListener('click', function () {
      if (!confirm('清除本机保存的密钥？')) return;
      localStorage.removeItem(CFG_KEY);
      $('#cfg-key').value = '';
      closeCfg();
    });
    $('#cfg-sheet').addEventListener('click', function (e) {
      if (e.target === this) closeCfg();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !$('#cfg-sheet').hidden) closeCfg();
    });

    /* 首次进入：没配密钥就提示一次（不阻断浏览） */
    if (!hasKey()) {
      var tip = $('#cfg-tip');
      if (tip) tip.hidden = false;
    }
    renderHistory();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }

  /* 暴露给页面内联脚本（题干重解） */
  window.chemSolve = { analyze: analyze, openCfg: openCfg, openText: openText };
})();
