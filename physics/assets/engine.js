/* ============================================================
   实验引擎
   所有实验共用一套外壳：页头 / 参数栏 / 舞台 / 数据栏 / 提示 / 结论
   一个实验只需提供：svg 骨架 + draw 更新 + controls + hud + 判定
   ============================================================ */
(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* ---------- 控件渲染 ---------- */

  function ctlHTML(c, s) {
    const id = `c-${c.id}`;
    if (c.type === 'range') {
      const v = c.get(s);
      return `<div class="ctl" data-ctl="${c.id}">
        <div class="ctl-h">
          <label class="ctl-l" for="${id}">${c.label}</label>
          <span class="ctl-v" data-out="${c.id}">${c.fmt ? c.fmt(v) : v}${c.unit || ''}</span>
        </div>
        <input type="range" id="${id}" min="${c.min}" max="${c.max}" step="${c.step || 1}" value="${v}"
               ${c.disabled ? 'disabled' : ''}>
        ${c.note ? `<div class="ctl-note">${c.note}</div>` : ''}
      </div>`;
    }
    if (c.type === 'seg') {
      const v = c.get(s);
      return `<div class="ctl" data-ctl="${c.id}">
        <div class="ctl-h"><span class="ctl-l">${c.label}</span></div>
        <div class="seg" data-seg="${c.id}">
          ${c.options.map(o => `<button type="button" data-v="${o.v}" class="${o.v === v ? 'on' : ''}">${o.t}</button>`).join('')}
        </div>
        ${c.note ? `<div class="ctl-note">${c.note}</div>` : ''}
      </div>`;
    }
    if (c.type === 'steps') {
      const cur = c.get(s);
      return `<div class="ctl" data-ctl="${c.id}">
        <div class="ctl-h"><span class="ctl-l">${c.label}</span></div>
        <div class="steps">
          ${c.steps.map((t, i) => `<div class="step ${i < cur ? 'done' : ''} ${i === cur ? 'now' : ''}">
            <span class="sn">${i < cur ? '✓' : i + 1}</span><span>${t}</span></div>`).join('')}
        </div>
      </div>`;
    }
    if (c.type === 'opts') {
      const chosen = c.get(s);
      return `<div class="ctl" data-ctl="${c.id}">
        <div class="ctl-h"><span class="ctl-l">${c.label}</span></div>
        <div class="opts">
          ${c.options.map(o => {
            const st = c.state ? c.state(s, o) : (chosen === o.v ? 'on' : '');
            return `<button type="button" class="opt ${st}" data-v="${o.v}" ${c.locked && c.locked(s) ? 'disabled' : ''}>
              <span class="oi">${o.i || ''}</span><span>${o.t}</span></button>`;
          }).join('')}
        </div>
        ${c.note ? `<div class="ctl-note">${c.note}</div>` : ''}
      </div>`;
    }
    if (c.type === 'note') {
      return `<div class="ctl-note" style="margin-bottom:14px">${c.html}</div>`;
    }
    return '';
  }

  function ctrlSignature(def, s) {
    return def.controls(s).map(c => {
      let sig = c.id + ':' + (c.disabled ? ':d' : '');
      if (c.type === 'opts') {
        sig += ':' + c.options.map(o => (c.state ? c.state(s, o) : '') + o.t).join(',');
      }
      if (c.type === 'steps') sig += ':' + c.get(s);
      return sig;
    }).join('|');
  }

  /* 数字用 Bebas，单位回退正文字体，否则 mL 会显示成 ML */
  function fmtUnit(v) {
    const str = String(v);
    const m = str.match(/^(-?[\d.]+)\s*([^\d].*)$/);
    if (!m) return str;
    return `<span class="hv-n">${m[1]}</span><span class="hv-u">${m[2]}</span>`;
  }

  /* 操作按钮（开始过滤、称量、提交…） */
  function actionsHTML(def, s) {
    if (!def.actions) return '';
    const labels = def.actLabels || {};
    const keys = Object.keys(def.actions).filter(k => !def.actionHide || !def.actionHide(k, s));
    if (!keys.length) return '';
    const sec = def.secondary || [];
    return `<div class="act-box">
      ${keys.map(k => {
        const secondary = sec.includes(k) || /reset|clear|again/i.test(k);
        return `<button type="button" class="btn ${secondary ? '' : 'primary'} block"
          data-act="${k}">${labels[k] || k}</button>`;
      }).join('')}
    </div>`;
  }

  /* ---------- 主渲染 ---------- */

  function mount(def) {
    const app = $('#app');
    document.title = `${def.title} · 物理实验`;

    app.innerHTML = `
      <header class="site-head">
        <div class="wrap">
          <a class="logo" href="./index.html">
            <span class="logo-mark">物</span>
            <span class="logo-txt">物理实验</span>
          </a>
          <nav class="site-nav">
            <a href="labs.html" class="on">实验</a>
            <a href="knowledge.html">知识点</a>
            <a href="resources.html">资料</a>
            <a href="quiz.html" class="hide-sm">自测</a>
          </nav>
          <div class="head-act">
            <a class="icon-btn" href="search.html" aria-label="搜索" title="搜索">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>
              </svg>
            </a>
            <button class="icon-btn" id="theme-btn" title="切换深浅色" aria-label="切换深浅色">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main class="wrap">
        <div class="lab-head">
          <div>
            <h1><span class="code">${def.code}</span>${def.title}</h1>
            <div class="sub">${def.book || ''} · ${def.unit || ''} · ${def.kind || ''}</div>
          </div>
          <nav>
            <a class="btn sm" href="labs.html">← 实验库</a>
          </nav>
        </div>

        <div class="lab-grid">
          <section class="lab-col">
            <div class="col-h">参数与操作</div>
            <div id="controls"></div>
          </section>

          <section class="lab-col">
            <div class="stage-wrap">
              <div class="stage" id="stage"></div>
              <div class="stage-foot">
                <span id="stage-note">${def.stageNote || ''}</span>
                <span class="spacer"></span>
                <span id="stage-right">${def.stageRight || ''}</span>
              </div>
            </div>
          </section>

          <section class="lab-col">
            <div class="col-h">实时数据</div>
            <div class="hud" id="hud"></div>
            ${def.hints ? `<div class="ctl-note" style="margin-top:14px">${def.hints}</div>` : ''}
          </section>
        </div>

        <div class="lab-foot">
          <div class="say" id="say"><span class="say-i">›</span><span id="say-txt">${def.opening || '按左侧步骤开始操作。'}</span></div>
          <div id="concl"></div>
          <section class="dossier" id="dossier"></section>
          <div id="related"></div>
          <div class="lab-acts">
            <button class="btn sm" id="rep-btn">导出实验报告（可打印）</button>
          </div>
        </div>
      </main>

      <footer class="site-foot">
        <div class="wrap">
          <span class="fl">物理实验</span>
          <span>人教版八·九年级 · 教学辅助</span>
          <span class="spacer"></span>
          <span>所有数据为教学模型，不等同真实测量值</span>
        </div>
      </footer>`;

    /* 主题 */
    const saved = localStorage.getItem('theme');
    if (saved) document.documentElement.dataset.theme = saved;
    $('#theme-btn').addEventListener('click', () => {
      const cur = document.documentElement.dataset.theme
        || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      localStorage.setItem('theme', next);
    });

    const state = def.init();
    const stageEl = $('#stage');
    const controlsEl = $('#controls');
    const hudEl = $('#hud');
    const sayEl = $('#say');
    const sayTxt = $('#say-txt');
    const conclEl = $('#concl');

    stageEl.innerHTML = def.svg;
    const root = stageEl;

    let sig = '';
    let concluded = null;
    let lastConcl = null;
    let lastSay = def.opening || '';

    const api = {
      state,
      el: root,
      q: (id) => root.querySelector('#' + id),
      qa: (sel) => [...root.querySelectorAll(sel)],
      say(html, kind) {
        sayEl.className = 'say' + (kind ? ' ' + kind : '');
        sayTxt.innerHTML = html;
        lastSay = html;
      },
      conclude(title, items) {
        lastConcl = { title, items };
        if (concluded === title) return;
        concluded = title;
        conclEl.innerHTML = `<div class="concl">
          <h4>${title}</h4>
          <ul>${items.map(t => `<li>${t}</li>`).join('')}</ul>
        </div>`;
      },
      clearConcl() { concluded = null; conclEl.innerHTML = ''; },
      update,
      restart() {
        Object.assign(state, def.init());
        concluded = null;
        conclEl.innerHTML = '';
        api.say(def.opening || '按左侧步骤开始操作。');
        update();
      }
    };

    function renderControls() {
      const list = def.controls(state);
      controlsEl.innerHTML = list.map(c => ctlHTML(c, state)).join('') + actionsHTML(def, state);
      sig = ctrlSignature(def, state);
      bindControls(list);
    }

    function bindControls(list) {
      list.forEach(c => {
        if (c.type === 'range') {
          const inp = controlsEl.querySelector(`#c-${c.id}`);
          if (!inp) return;
          inp.addEventListener('input', e => {
            c.set(state, +e.target.value);
            update({ skipControls: c.id });
          });
        }
        if (c.type === 'seg') {
          const box = controlsEl.querySelector(`[data-seg="${c.id}"]`);
          if (!box) return;
          box.addEventListener('click', e => {
            const b = e.target.closest('button[data-v]');
            if (!b) return;
            c.set(state, b.dataset.v);
            update();
          });
        }
        if (c.type === 'opts') {
          const box = controlsEl.querySelector(`[data-ctl="${c.id}"]`);
          if (!box) return;
          box.addEventListener('click', e => {
            const b = e.target.closest('.opt[data-v]');
            if (!b || b.disabled) return;
            c.pick(state, b.dataset.v, api);
            def.onChange && def.onChange(c.id, b.dataset.v, state, api);
            update();
          });
        }
      });
      if (def.actions) {
        controlsEl.querySelectorAll('[data-act]').forEach(b => {
          b.addEventListener('click', () => {
            if (b.disabled) return;
            const fn = def.actions[b.dataset.act];
            if (fn) { fn(state, api); update(); }
          });
        });
      }
    }

    function update(opts = {}) {
      /* 控件：签名不变则只更新显示值，避免拖动滑块时重建 */
      const newSig = ctrlSignature(def, state);
      if (newSig !== sig) {
        renderControls();
      } else {
        def.controls(state).forEach(c => {
          if (c.type === 'range') {
            const out = controlsEl.querySelector(`[data-out="${c.id}"]`);
            const v = c.get(state);
            if (out) out.textContent = (c.fmt ? c.fmt(v) : v) + (c.unit || '');
            const inp = controlsEl.querySelector(`#c-${c.id}`);
            if (inp && opts.skipControls !== c.id && +inp.value !== v) inp.value = v;
          }
          if (c.type === 'seg') {
            const box = controlsEl.querySelector(`[data-seg="${c.id}"]`);
            const v = c.get(state);
            if (box) $$('button', box).forEach(b => b.classList.toggle('on', b.dataset.v === v));
          }
        });
      }

      def.draw(state, root, api);

      const cells = def.hud(state);
      hudEl.innerHTML = cells.map(c => `
        <div class="hud-cell ${c.hi ? 'hi' : ''}">
          <span class="hud-k">${c.label}</span>
          <span class="hud-v">${fmtUnit(c.value)}</span>
        </div>`).join('');

      if (def.after) def.after(state, api);
    }

    renderControls();
    update();

    /* 实验档案：现象 / 注意 / 考点 / 方程式 */
    const meta = (window.LAB_META || {})[def.id];
    if (meta) {
      const block = (title, arr) => arr && arr.length
        ? `<div class="dsr-col"><h5>${title}</h5><ul>${arr.map(x => `<li>${x}</li>`).join('')}</ul></div>`
        : '';
      $('#dossier').innerHTML = `
        <div class="dsr-h">
          <span class="dsr-t">实验档案</span>
          <span class="dsr-s">现象 · 注意 · 考点</span>
        </div>
        <div class="dsr-grid">
          ${block('看到什么', meta.phen)}
          ${block('要注意', meta.care)}
          ${block('怎么考', meta.exam)}
        </div>
        ${meta.eq ? `<div class="dsr-eq">
          <div class="dsr-eq-h">核心公式</div>
          ${meta.eq.map(e => `<div class="eq">${e.replace(/=([^=]{1,14})=/g, (m, c) => `<b>=${c}=</b>`)}</div>`).join('')}
        </div>` : ''}`;
    }

    /* 相关知识点 / 自测 */
    (function related() {
      const CN = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一'];
      const m = (def.unit || '').match(/第([一二三四五六七八九十]+)[单元]/);
      const box = $('#related');
      if (!m) { box.innerHTML = ''; return; }
      const n = CN.indexOf(m[1]) + 1;
      const ukey = 'C' + n;
      const QUIZ = { 1: 'unit1', 2: 'unit2', 3: 'unit3', 4: 'unit4', 5: 'unit5', 6: 'unit6', 7: 'unit7', 8: 'unit8', 9: 'unit9', 12: 'unit9', 13: 'unit10', 15: 'unit10', 16: 'unit10', 17: 'unit10', 18: 'unit10' };
      const q = QUIZ[n];
      box.innerHTML = `<div class="rel">
        <span class="rel-k">同一单元</span>
        <a class="rel-a" href="knowledge.html#${ukey}">第${m[1]}章 知识点 →</a>
        ${q ? `<a class="rel-a" href="quiz.html#${q}">第${m[1]}章 自测 →</a>` : ''}
        <a class="rel-a" href="labs.html">全部实验 →</a>
      </div>`;
    })();

    /* 导出实验报告 */
    (function exporter() {
      const btn = $('#rep-btn');
      if (!btn) return;
      btn.addEventListener('click', () => {
        const params = def.controls(state).map(c => {
          if (c.type === 'range') {
            const v = c.get(state);
            return [c.label.replace(/^[①②③④⑤⑥]\s*/, ''), (c.fmt ? c.fmt(v) : v) + (c.unit || '')];
          }
          if (c.type === 'seg') {
            const o = c.options.find(x => x.v === c.get(state));
            return [c.label.replace(/^[①②③④⑤⑥]\s*/, ''), o ? o.t : ''];
          }
          if (c.type === 'opts') {
            const cur = c.get(state);
            if (cur == null) return null;
            const o = c.options.find(x => x.v === cur);
            return o ? [c.label.replace(/^[①②③④⑤⑥]\s*/, ''), o.t] : null;
          }
          return null;
        }).filter(Boolean);

        const hud = def.hud(state);
        const meta = (window.LAB_META || {})[def.id];
        const strip = h => String(h).replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '');

        const w = window.open('', '_blank');
        if (!w) return;
        w.document.write(`<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8">
<title>${def.title} · 实验报告</title>
<style>
@page { size: A4; margin: 2.2cm 2cm; }
body { font-family: "Songti SC","SimSun",serif; color:#1a1a1a; line-height:1.75; font-size:14px; }
h1 { font-family:"Heiti SC","SimHei",sans-serif; font-size:22px; text-align:center; margin:0 0 6px; letter-spacing:.02em; }
.sub { text-align:center; color:#666; font-size:12px; margin-bottom:6px; }
.rule { border-top:2px solid #1a1a1a; margin:14px 0 18px; }
h2 { font-family:"Heiti SC","SimHei",sans-serif; font-size:15px; margin:18px 0 8px; }
table { width:100%; border-collapse:collapse; margin:6px 0 10px; font-size:13px; }
th,td { border:1px solid #bbb; padding:6px 10px; text-align:left; }
th { background:#f3f1ea; font-weight:600; width:34%; }
.d { white-space:pre-wrap; }
.eq { font-family:"Courier New",monospace; background:#f5f4ef; padding:6px 10px; margin:4px 0; }
ul { margin:6px 0 6px 20px; padding:0; }
li { margin:3px 0; }
.foot { margin-top:26px; color:#888; font-size:11px; border-top:1px solid #ccc; padding-top:8px; }
@media print { .no-print { display:none; } }
</style></head><body>
<h1>${def.title}</h1>
<div class="sub">${def.book} · ${def.unit} · ${def.kind}${def.studentExp ? ' · 学生实验 ' + def.studentExp : ''}</div>
<div class="rule"></div>
<h2>一、实验目的</h2>
<div class="d">${strip(def.opening || '')}</div>
<h2>二、实验参数</h2>
${params.length ? `<table>${params.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}</table>` : '<div>—</div>'}
<h2>三、实验数据</h2>
<table>${hud.map(c => `<tr><th>${c.label}</th><td>${strip(c.value)}</td></tr>`).join('')}</table>
<h2>四、现象与结论</h2>
<div class="d">${strip(lastSay)}</div>
${lastConcl ? `<div style="margin-top:10px;font-weight:600">${lastConcl.title}</div>
<ul>${lastConcl.items.map(x => `<li>${strip(x)}</li>`).join('')}</ul>` : '<div style="color:#888">尚未得出结论，请先在页面上完成实验。</div>'}
${meta ? `<h2>五、实验档案</h2>
${meta.phen ? `<div style="font-weight:600;margin:8px 0 4px">看到什么</div><ul>${meta.phen.map(x => `<li>${strip(x)}</li>`).join('')}</ul>` : ''}
${meta.care ? `<div style="font-weight:600;margin:8px 0 4px">要注意</div><ul>${meta.care.map(x => `<li>${strip(x)}</li>`).join('')}</ul>` : ''}
${meta.exam ? `<div style="font-weight:600;margin:8px 0 4px">怎么考</div><ul>${meta.exam.map(x => `<li>${strip(x)}</li>`).join('')}</ul>` : ''}
${meta.eq ? `<div style="font-weight:600;margin:8px 0 4px">核心公式</div>${meta.eq.map(e => `<div class="eq">${e}</div>`).join('')}` : ''}` : ''}
<div class="foot">人教版八·九年级物理 · 虚拟实验 · 本页由 ${def.code} 生成，数据为教学模型。</div>
<div class="no-print" style="margin-top:20px">
  <button onclick="print()" style="padding:8px 18px;font-size:14px;cursor:pointer">打印 / 另存为 PDF</button>
</div>
</body></html>`);
        w.document.close();
      });
    })();

    /* 上/下实验 */
    const all = window.EXPERIMENTS || [];
    const i = all.findIndex(e => e.id === def.id);
    if (i > -1 && all.length > 1) {
      const prev = all[(i - 1 + all.length) % all.length];
      const next = all[(i + 1) % all.length];
      const nav = $('.lab-head nav');
      nav.insertAdjacentHTML('afterbegin',
        `<a class="btn sm ghost" href="lab.html?id=${prev.id}" title="${prev.title}">← 上一个</a>`);
      nav.insertAdjacentHTML('beforeend',
        `<a class="btn sm ghost" href="lab.html?id=${next.id}" title="${next.title}">下一个 →</a>`);
    }
  }

  window.LabEngine = { mount };
})();
