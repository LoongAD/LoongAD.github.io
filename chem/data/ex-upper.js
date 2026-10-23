/* ============================================================
   实验数据 · 上册（9 个）
   每个实验 = 元信息 + SVG 骨架 + draw 更新 + controls + hud + 判定
   ============================================================ */
window.EXPERIMENTS = window.EXPERIMENTS || [];

/* ---------------- U1-01 常用仪器 ---------------- */
(function () {
  const ICON = {
    tube: `<path d="M-8 -26 V16 a8 8 0 0 0 16 0 V-26" ${K()}/><line x1="-10" y1="-26" x2="10" y2="-26" ${K(2)}/>`,
    beaker: `<path d="M-18 -18 V16 a6 6 0 0 0 6 6 H12 a6 6 0 0 0 6 -6 V-18" ${K()}/><line x1="-21" y1="-18" x2="21" y2="-18" ${K(2)}/>`,
    flask: `<path d="M-5 -24 v14 L-19 18 a7 7 0 0 0 6 8 h26 a7 7 0 0 0 6 -8 L5 -10 v-14" ${K()}/>`,
    lamp: `<path d="M-14 22 h28 l-3 -18 a5 5 0 0 0 -5 -4 h-12 a5 5 0 0 0 -5 4 Z" ${K()}/><line x1="0" y1="0" x2="0" y2="-8" ${K(2)}/>`,
    dish: `<path d="M-20 4 a20 13 0 0 0 40 0 Z" ${K()}/><ellipse cx="0" cy="4" rx="20" ry="5" ${K()}/>`,
    cylinder: `<path d="M-9 -22 V18 a9 9 0 0 0 18 0 V-22" ${K()}/><ellipse cx="0" cy="-22" rx="9" ry="3" ${K()}/>`,
    balance: `<line x1="-22" y1="-8" x2="22" y2="-8" ${K(2)}/><path d="M-14 -8 v7 h12 v-7M2 -8 v7 h12 v-7" ${K()}/><rect x="-4" y="8" width="8" height="14" ${K()}/>`,
    funnel: `<path d="M-18 -16 H18 L5 6 V22 h-10 V6 Z" ${K()}/>`,
    rod: `<rect x="-2.5" y="-24" width="5" height="46" rx="2.5" ${K()}/>`,
    stand: `<rect x="-26" y="18" width="52" height="6" ${K()}/><rect x="-2" y="-24" width="5" height="42" ${K()}/><rect x="0" y="-6" width="22" height="4" ${K()}/>`,
    clamp: `<path d="M-14 -6 h20 a8 8 0 0 1 0 16 h-20" ${K()}/><path d="M-14 -6 v16" ${K()}/>`
  };
  function K(w) { return `stroke="var(--ink)" stroke-width="${w || 1.7}" fill="none" stroke-linejoin="round" stroke-linecap="round"`; }

  const ITEMS = [
    { id: 'tube', n: '试管', g: 'react', why: '少量试剂的反应容器，可直接加热' },
    { id: 'beaker', n: '烧杯', g: 'react', why: '配制溶液、较多量反应，加热要垫石棉网' },
    { id: 'flask', n: '锥形瓶', g: 'react', why: '滴定、振荡反应，便于观察' },
    { id: 'lamp', n: '酒精灯', g: 'heat', why: '常用加热工具，外焰温度最高' },
    { id: 'dish', n: '蒸发皿', g: 'heat', why: '蒸发浓缩溶液，可直接加热' },
    { id: 'cylinder', n: '量筒', g: 'measure', why: '量取液体体积，不能加热、不能作反应容器' },
    { id: 'balance', n: '托盘天平', g: 'measure', why: '称量固体质量，精确到 0.1 g' },
    { id: 'funnel', n: '漏斗', g: 'sep', why: '过滤、加液引流' },
    { id: 'rod', n: '玻璃棒', g: 'sep', why: '搅拌、引流、转移，过滤时引流' },
    { id: 'stand', n: '铁架台', g: 'hold', why: '固定反应装置，配铁夹、铁圈' },
    { id: 'clamp', n: '试管夹', g: 'hold', why: '夹持试管加热，从底部往上套' }
  ];
  const GROUPS = [
    { v: 'react', t: '反应容器' },
    { v: 'heat', t: '加热器具' },
    { v: 'measure', t: '计量器具' },
    { v: 'sep', t: '过滤分离' },
    { v: 'hold', t: '夹持固定' }
  ];

  window.EXPERIMENTS.push({
    id: 'u1-01', studentExp: 1, code: 'U1-01', title: '常用仪器的识别与使用',
    book: '上册', unit: '第一单元 步入化学殿堂', kind: '基本操作',
    opening: '共 11 件常用仪器。先选仪器，再判断它属于哪一类。',
    stageNote: '仪器按用途分为五类：反应、加热、计量、分离、夹持',
    init: () => ({ placed: {}, picked: null, right: 0, wrong: 0, cur: null }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="仪器分类台">
      <text x="20" y="26" font-size="11" fill="var(--muted)" font-family="var(--f-sans)">当前仪器</text>
      <g id="curIcon" transform="translate(230,100) scale(1.72)"></g>
      <text id="curName" x="230" y="184" font-size="15" font-weight="700" fill="var(--ink)"
            text-anchor="middle" font-family="var(--f-sans)">—</text>
      <line x1="20" y1="176" x2="440" y2="176" stroke="var(--line)" stroke-width="1"/>
      <g id="bins"></g>
    </svg>`,
    draw(s, el, api) {
      const cur = s.cur;
      const ic = el.querySelector('#curIcon');
      ic.innerHTML = cur ? ICON[cur.id] : '';
      const allDone = Object.keys(s.placed).length === ITEMS.length;
      el.querySelector('#curName').textContent = cur ? cur.n
        : allDone ? '全部识别完毕' : '从左侧选择一件仪器';
      const bins = el.querySelector('#bins');
      bins.innerHTML = GROUPS.map((g, i) => {
        const y = 196 + i * 39;
        const got = ITEMS.filter(t => s.placed[t.id] === g.v);
        return `<g>
          <rect x="20" y="${y}" width="420" height="31" rx="3" fill="none"
                stroke="var(--line)" stroke-width="1"/>
          <text x="32" y="${y + 20}" font-size="11.5" fill="var(--muted)" font-family="var(--f-sans)">${g.t}</text>
          <text x="150" y="${y + 20}" font-size="12" fill="var(--ink)" font-family="var(--f-sans)">${got.map(t => t.n).join(' · ') || '—'}</text>
        </g>`;
      }).join('');
    },
    controls(s) {
      const left = ITEMS.filter(t => !s.placed[t.id]);
      const list = [{
        type: 'opts', id: 'pick', label: `① 选择仪器（剩 ${left.length} 件）`,
        options: left.slice(0, 6).map(t => ({ v: t.id, t: t.n, i: '' })),
        get: st => st.picked,
        pick: (st, v) => { st.picked = v; const it = ITEMS.find(x => x.id === v); st.cur = it; },
        state: (st, o) => st.picked === o.v ? 'on' : ''
      }];
      if (s.picked) {
        list.push({
          type: 'opts', id: 'cat', label: '② 归入哪一类',
          options: GROUPS.map(g => ({ v: g.v, t: g.t })),
          get: () => null,
          pick: () => {},
          state: () => ''
        });
      }
      return list;
    },
    onChange(id, v, s, api) {
      if (id !== 'cat') return;
      const it = ITEMS.find(x => x.id === s.picked);
      if (!it) return;
      if (it.g === v) {
        s.placed[it.id] = v; s.right++; s.picked = null; s.cur = null;
        api.say(`<b>${it.n}</b> —— ${it.why}。`, 'ok');
        if (Object.keys(s.placed).length === ITEMS.length) {
          api.conclude('11 件仪器全部归位', [
            '反应容器：试管、烧杯、锥形瓶 —— 用于盛放和进行反应。',
            '加热器具：酒精灯、蒸发皿 —— 酒精灯外焰温度最高，加热用外焰。',
            '计量器具：量筒、托盘天平 —— 量筒<b>不能</b>加热，也不能作反应容器。',
            '过滤分离：漏斗、玻璃棒 —— 玻璃棒在过滤中只起<b>引流</b>作用。',
            '夹持固定：铁架台、试管夹。'
          ]);
        }
      } else {
        s.wrong++;
        const right = GROUPS.find(g => g.v === it.g).t;
        api.say(`<b>${it.n}</b> 不属于「${GROUPS.find(g => g.v === v).t}」，它属于<b>${right}</b>。${it.why}`, 'bad');
        s.picked = null; s.cur = null;
      }
    },
    hud(s) {
      const done = Object.keys(s.placed).length;
      return [
        { label: '已识别', value: `${done}/11`, hi: done === 11 },
        { label: '正确', value: s.right },
        { label: '错误', value: s.wrong }
      ];
    }
  });
})();

/* ---------------- U1-02 量筒读数 ---------------- */
(function () {
  const TOP = 76, BOT = 330, MAX = 100;
  const y = v => BOT - (v / MAX) * (BOT - TOP);

  window.EXPERIMENTS.push({
    id: 'u1-02', studentExp: 1, code: 'U1-02', title: '量筒的量取与读数',
    book: '上册', unit: '第一单元 步入化学殿堂', kind: '基本操作',
    opening: '拖动滑块改变液面，切换三种视线，看读数怎么偏。',
    stageNote: '量筒放在水平桌面上，视线要与凹液面最低处保持水平',
    init: () => ({ vol: 50, eye: 'level' }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="量筒读数">
      <line x1="40" y1="352" x2="420" y2="352" stroke="var(--line)" stroke-width="2"/>
      <g id="cyl">
        <path d="M170 68 V322 a26 26 0 0 0 52 0 V68" fill="var(--paper-2)" fill-opacity=".7"
              stroke="var(--ink)" stroke-width="1.8"/>
        <ellipse cx="196" cy="68" rx="26" ry="6" fill="none" stroke="var(--ink)" stroke-width="1.8"/>
        <rect x="190" y="50" width="12" height="20" fill="var(--paper-2)" stroke="var(--ink)" stroke-width="1.8"/>
      </g>
      <g id="ticks"></g>
      <rect id="liq" x="172" y="200" width="48" height="0" fill="#7fb6d6" opacity=".42"/>
      <line id="meniscus" x1="172" y1="200" x2="220" y2="200" stroke="#4e93b8" stroke-width="2.4" opacity="0"/>
      <line id="sight" x1="120" y1="200" x2="300" y2="200" stroke="var(--accent)" stroke-width="1.2" stroke-dasharray="5 4"/>
      <circle id="eye" cx="300" cy="200" r="4.5" fill="var(--accent)"/>
      <text id="eyeLbl" x="312" y="204" font-size="11" fill="var(--accent)" font-family="var(--f-sans)">平视</text>
      <text x="300" y="384" font-size="11" fill="var(--faint)" text-anchor="middle"
            font-family="var(--f-sans)">读数在右侧刻度上，视线决定你看到哪一格</text>
    </svg>`,
    draw(s, el) {
      const g = el.querySelector('#cyl');
      if (!el.querySelector('#ticks').children.length) {
        let t = '';
        for (let v = 0; v <= MAX; v += 5) {
          const yy = y(v), major = v % 10 === 0;
          t += `<line x1="196" y1="${yy}" x2="${196 + (major ? 22 : 12)}" y2="${yy}"
                 stroke="var(--ink)" stroke-width="1" opacity=".55"/>`;
          if (major && v % 20 === 0) t += `<text x="${196 + 26}" y="${yy + 3.5}" font-size="9"
                 fill="var(--muted)" font-family="var(--f-mono)">${v}</text>`;
        }
        el.querySelector('#ticks').innerHTML = t;
      }
      const yy = y(s.vol);
      const liq = el.querySelector('#liq');
      liq.setAttribute('y', yy);
      liq.setAttribute('height', Math.max(0, BOT - yy));
      const men = el.querySelector('#meniscus');
      men.setAttribute('y1', yy); men.setAttribute('y2', yy);
      men.setAttribute('opacity', BOT - yy > 3 ? .95 : 0);
      const bias = s.eye === 'level' ? 0 : s.eye === 'up' ? -3 : 3;
      const eyeY = s.eye === 'level' ? yy : s.eye === 'up' ? yy + 62 : yy - 62;
      const sl = el.querySelector('#sight');
      sl.setAttribute('y1', eyeY); sl.setAttribute('y2', eyeY);
      sl.setAttribute('x2', 300);
      el.querySelector('#eye').setAttribute('cy', eyeY);
      el.querySelector('#eyeLbl').setAttribute('y', eyeY + 4);
      el.querySelector('#eyeLbl').textContent =
        { level: '平视', up: '仰视', down: '俯视' }[s.eye];
    },
    controls(s) {
      return [
        { type: 'range', id: 'vol', label: '液面体积', min: 0, max: 100, step: 5, unit: ' mL',
          get: st => st.vol, set: (st, v) => { st.vol = v; } },
        { type: 'seg', id: 'eye', label: '视线方向', options: [
            { v: 'level', t: '平视' }, { v: 'up', t: '仰视' }, { v: 'down', t: '俯视' }],
          get: st => st.eye, set: (st, v) => { st.eye = v; } },
        { type: 'note', html: '仰视：视线斜向上，读到的是<b>偏低</b>的刻度，实际倒出的液体<b>偏多</b>。' }
      ];
    },
    after(s, api) {
      const bias = s.eye === 'level' ? 0 : s.eye === 'up' ? -3 : 3;
      if (bias !== 0) {
        api.say(`<b>${s.eye === 'up' ? '仰视' : '俯视'}</b>时，读数比实际${bias > 0 ? '偏大' : '偏小'} ${Math.abs(bias)} mL。
          量取 ${s.vol} mL 实际会${bias > 0 ? '少' : '多'}倒 ${Math.abs(bias)} mL。`, 'warn');
      } else {
        api.say('平视凹液面最低处，读数与实际一致。这是唯一正确的读法。', 'ok');
      }
    },
    hud(s) {
      const bias = s.eye === 'level' ? 0 : s.eye === 'up' ? -3 : 3;
      return [
        { label: '实际体积', value: s.vol + ' mL' },
        { label: '读数', value: (s.vol + bias) + ' mL', hi: bias !== 0 },
        { label: '偏差', value: (bias > 0 ? '+' : '') + bias + ' mL' }
      ];
    }
  });
})();

/* ---------------- U1-03 酒精灯 ---------------- */
(function () {
  window.EXPERIMENTS.push({
    id: 'u1-03', studentExp: 1, code: 'U1-03', title: '酒精灯的使用与加热',
    book: '上册', unit: '第一单元 步入化学殿堂', kind: '基本操作',
    opening: '四个操作，每个都有对错。选错的会被拦下并说明原因。',
    stageNote: '酒精灯火焰分三层：外焰、内焰、焰心，外焰温度最高',
    init: () => ({ step: 0, lit: false, right: 0, wrong: 0, done: {} }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="酒精灯加热">
      <line x1="30" y1="330" x2="430" y2="330" stroke="var(--line)" stroke-width="2"/>
      <g transform="translate(210,268)">
        <path d="M-34 62 h68 l-8 -44 a10 10 0 0 0 -10 -8 h-32 a10 10 0 0 0 -10 8 Z"
              fill="var(--paper-3)" stroke="var(--ink)" stroke-width="1.8"/>
        <rect x="-7" y="4" width="14" height="14" fill="var(--paper-3)" stroke="var(--ink)" stroke-width="1.8"/>
        <line x1="0" y1="4" x2="0" y2="-8" stroke="var(--ink)" stroke-width="2.4"/>
        <g id="flame" opacity="0"></g>
        <text x="0" y="82" font-size="10.5" fill="var(--faint)" text-anchor="middle"
              font-family="var(--f-sans)">酒精灯</text>
      </g>
      <g id="tubeG" opacity=".25" transform="translate(268,138)">
        <path d="M-11 0 V120 a11 11 0 0 0 22 0 V0" fill="var(--paper-2)" fill-opacity=".6"
              stroke="var(--ink)" stroke-width="1.6"/>
        <rect x="-11" y="80" width="22" height="40" fill="#7fb6d6" opacity=".4"/>
      </g>
      <g id="clampG" opacity="0" transform="translate(300,150)">
        <path d="M0 0 h30 a10 10 0 0 1 0 20 h-30" fill="none" stroke="var(--ink)" stroke-width="1.6"/>
      </g>
      <text id="stageTip" x="230" y="384" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
    </svg>`,
    draw(s, el) {
      const f = el.querySelector('#flame');
      if (s.lit) {
        f.setAttribute('opacity', 1);
        f.innerHTML = `
          <path d="M0 -12 c-16 -12 -12 -30 0 -46 c12 16 16 34 0 46 Z" fill="#e8a33d" opacity=".85"/>
          <path d="M0 -12 c-9 -8 -7 -20 0 -30 c7 10 9 22 0 30 Z" fill="#f3c877" opacity=".95"/>
          <path d="M0 -12 c-4 -5 -3 -11 0 -16 c3 5 4 11 0 16 Z" fill="#fdf0cf"/>`;
      } else {
        f.setAttribute('opacity', 0);
        f.innerHTML = '';
      }
      el.querySelector('#tubeG').setAttribute('opacity', s.step >= 2 ? 1 : .25);
      el.querySelector('#clampG').setAttribute('opacity', s.step >= 2 ? 1 : 0);
      el.querySelector('#stageTip').textContent =
        s.step === 0 ? '先检查灯芯与酒精量'
        : s.step === 1 ? (s.lit ? '已点燃，火焰分三层' : '准备点燃')
        : s.step === 2 ? '正在加热试管中的液体'
        : '实验结束，记得盖灭';
    },
    controls(s) {
      const STEPS = [
        { id: 'prep', q: '① 使用前先做什么？', opts: [
            { v: 'full', t: '把酒精加满到瓶口' },
            { v: 'half', t: '加到容积的 1/2 ~ 2/3，检查灯芯' },
            { v: 'none', t: '不用检查，直接点' }] },
        { id: 'light', q: '② 怎么点燃？', opts: [
            { v: 'match', t: '用火柴点燃' },
            { v: 'other', t: '用另一盏燃着的酒精灯引燃' }] },
        { id: 'heat', q: '③ 加热时用哪层火焰？', opts: [
            { v: 'outer', t: '外焰' }, { v: 'inner', t: '内焰' }, { v: 'core', t: '焰心' }] },
        { id: 'off', q: '④ 怎么熄灭？', opts: [
            { v: 'cap', t: '用灯帽盖灭，再提起盖一次' },
            { v: 'blow', t: '用嘴吹灭' },
            { v: 'water', t: '用水浇灭' }] }
      ];
      const cur = STEPS[Math.min(s.step, 3)];
      const list = [{
        type: 'opts', id: 'ans', label: cur.q,
        options: cur.opts.map(o => ({ v: o.v, t: o.t })),
        get: () => null, pick: () => {},
        state: (st, o) => st.done[cur.id] === o.v
          ? (o.v === cur.opts[0].v || o.v === 'match' || o.v === 'outer' || o.v === 'cap' || o.v === 'half' ? 'ok' : 'bad')
          : ''
      }];
      if (s.step > 0) {
        list.unshift({ type: 'note', html: `已完成 <b>${s.step}</b> / 4 步` });
      }
      return list;
    },
    onChange(id, v, s, api) {
      if (id !== 'ans' || s.step > 3) return;
      const good = { prep: 'half', light: 'match', heat: 'outer', off: 'cap' };
      const why = {
        full: '酒精不能超过容积的 2/3 —— 太满时灯内酒精蒸气多，容易喷出着火。',
        none: '必须先检查灯芯是否平整、酒精量是否合适。',
        other: '绝对不能用一盏灯引燃另一盏 —— 酒精会洒出，引起失火。',
        inner: '内焰温度低于外焰，加热要用外焰。',
        core: '焰心主要是酒精蒸气，温度最低。',
        blow: '吹灭会把火焰吹进灯内，可能引起爆炸。',
        water: '不能用水浇，酒精会浮在水面继续燃烧。'
      };
      const stepId = ['prep', 'light', 'heat', 'off'][s.step];
      if (v === good[stepId]) {
        s.done[stepId] = v; s.step++; s.right++;
        if (stepId === 'light') s.lit = true;
        api.say(`正确。${stepId === 'prep' ? '酒精量合适，灯芯平整。' : stepId === 'light' ? '用火柴点燃，安全。' : stepId === 'heat' ? '外焰温度最高，加热最快。' : '盖灭后提起盖一次，防止冷却后盖子打不开。'}`, 'ok');
        if (s.step === 4) {
          api.conclude('酒精灯使用四条', [
            '酒精量 <b>1/2 ~ 2/3</b>，不能少于 1/4。',
            '用火柴点燃，<b>禁止</b>用一盏灯引燃另一盏。',
            '加热用<b>外焰</b>，因为外焰与氧气接触充分、燃烧完全、温度最高。',
            '用<b>灯帽盖灭</b>，盖灭后提起盖一次再盖上。'
          ]);
        }
      } else {
        s.wrong++;
        api.say(why[v] || '这个操作不正确。', 'bad');
        s.step++;
      }
    },
    hud(s) {
      return [
        { label: '步骤', value: `${s.step}/4`, hi: s.step === 4 },
        { label: '正确', value: s.right },
        { label: '错误', value: s.wrong }
      ];
    }
  });
})();

/* ---------------- U3-01 过滤 ---------------- */
(function () {
  const ITEMS = [
    { id: 'stick', t: '滤纸贴紧漏斗内壁', s: '「一贴」：滤纸与漏斗壁之间不能有气泡',
      bad: '滤纸没贴紧，液体从滤纸与漏斗的缝隙流下去 —— 滤液仍然浑浊。' },
    { id: 'level', t: '液面低于滤纸边缘', s: '「二低」：液面低、滤纸边缘低',
      bad: '液面高过滤纸边缘，液体会从滤纸外侧溢进漏斗 —— 滤液浑浊。' },
    { id: 'wall', t: '漏斗下端管口靠烧杯内壁', s: '「三靠」之一：防止滤液飞溅',
      bad: '漏斗下端悬空，滤液滴落时溅出烧杯外，造成损失。' },
    { id: 'rod', t: '玻璃棒轻靠三层滤纸处', s: '「三靠」之二：引流，不能戳破滤纸',
      bad: '没有引流，直接倾倒会冲翻或戳破滤纸 —— 滤液浑浊。' }
  ];

  window.EXPERIMENTS.push({
    id: 'u3-01', code: 'U3-01', title: '过滤',
    book: '上册', unit: '第三单元 探秘水世界', kind: '基本操作',
    opening: '四个要点全部打开，再点「开始过滤」。关掉任意一个，看滤液会怎样。',
    stageNote: '一贴、二低、三靠',
    init: () => ({ on: {}, run: false, res: null, t: 0 }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="过滤装置">
      <line x1="26" y1="356" x2="434" y2="356" stroke="var(--line)" stroke-width="2"/>
      <g id="stand">
        <rect x="60" y="348" width="112" height="8" rx="2" fill="var(--paper-3)" stroke="var(--ink)" stroke-width="1.6"/>
        <rect x="104" y="62" width="7" height="286" fill="var(--paper-3)" stroke="var(--ink)" stroke-width="1.6"/>
        <rect x="108" y="166" width="46" height="5" rx="2" fill="var(--paper-3)" stroke="var(--ink)" stroke-width="1.6"/>
        <ellipse cx="196" cy="168" rx="44" ry="6" fill="none" stroke="var(--ink)" stroke-width="3.2"/>
      </g>
      <g id="funnelG">
        <path d="M150 104 H244 L202 164 V226 h-12 V164 Z" fill="var(--paper-2)" fill-opacity=".75"
              stroke="var(--ink)" stroke-width="1.7"/>
        <line x1="145" y1="104" x2="249" y2="104" stroke="var(--ink)" stroke-width="2.4" stroke-linecap="round"/>
        <path id="paper" d="M155 108 L196 164 L237 108 Z" fill="var(--paper-3)" stroke="var(--ink)"
              stroke-width="1.2" opacity=".9"/>
        <path id="fLiq" d="M166 124 L196 162 L226 124 Z" fill="#9fc9de" opacity="0"/>
      </g>
      <g transform="translate(44,196)">
        <path d="M0 0 V84 a9 9 0 0 0 9 9 h62 a9 9 0 0 0 9 -9 V0"
              fill="var(--paper-2)" fill-opacity=".7" stroke="var(--ink)" stroke-width="1.7"/>
        <line x1="-4" y1="0" x2="84" y2="0" stroke="var(--ink)" stroke-width="2.2" stroke-linecap="round"/>
        <rect id="topLiq" x="2" y="26" width="76" height="62" fill="#9fc9de" opacity=".42"/>
        <rect x="8" y="70" width="64" height="16" fill="#b39a78" opacity=".55"/>
        <text x="40" y="112" font-size="10" fill="var(--faint)" text-anchor="middle"
              font-family="var(--f-sans)">待滤液</text>
      </g>
      <g transform="translate(158,206)">
        <path d="M0 0 V62 a9 9 0 0 0 9 9 h58 a9 9 0 0 0 9 -9 V0"
              fill="var(--paper-2)" fill-opacity=".7" stroke="var(--ink)" stroke-width="1.7"/>
        <line x1="-4" y1="0" x2="80" y2="0" stroke="var(--ink)" stroke-width="2.2" stroke-linecap="round"/>
        <rect id="botLiq" x="2" y="71" width="72" height="0" fill="#b9d6e6" opacity=".55"/>
        <text x="38" y="84" font-size="10" fill="var(--faint)" text-anchor="middle"
              font-family="var(--f-sans)">滤液</text>
      </g>
      <circle id="drip" cx="196" cy="250" r="2.4" fill="#7fb6d6" opacity="0"/>
      <g id="rodG" opacity=".25" transform="rotate(9 208 96)">
        <rect x="205" y="26" width="5" height="128" rx="2.5" fill="var(--paper-2)"
              fill-opacity=".5" stroke="var(--ink)" stroke-width="1.4"/>
      </g>
      <text id="resTxt" x="230" y="384" font-size="11.5" fill="var(--muted)"
            text-anchor="middle" font-family="var(--f-sans)">未开始</text>
    </svg>`,
    draw(s, el) {
      ITEMS.forEach(it => { /* 状态只影响控件外观 */ });
      el.querySelector('#rodG').setAttribute('opacity', s.on.rod ? 1 : .25);
      el.querySelector('#paper').setAttribute('opacity', s.on.stick ? 1 : .55);
      const f = el.querySelector('#fLiq');
      const top = el.querySelector('#topLiq');
      const bot = el.querySelector('#botLiq');
      const drip = el.querySelector('#drip');
      if (s.res === null) {
        f.setAttribute('opacity', 0);
        top.setAttribute('height', 62);
        top.setAttribute('y', 26);
        bot.setAttribute('height', 0);
        bot.setAttribute('y', 71);
        drip.setAttribute('opacity', 0);
        el.querySelector('#resTxt').textContent = '未开始';
        el.querySelector('#resTxt').setAttribute('fill', 'var(--muted)');
        return;
      }
      const t = s.t;
      f.setAttribute('opacity', Math.min(.55, t * .8));
      top.setAttribute('height', 62 * (1 - t));
      top.setAttribute('y', 26 + 62 * t);
      bot.setAttribute('height', 71 * t);
      bot.setAttribute('y', 71 - 71 * t);
      bot.setAttribute('fill', s.res ? '#b39a78' : '#b9d6e6');
      drip.setAttribute('opacity', t > .1 && t < .95 ? .9 : 0);
      const txt = el.querySelector('#resTxt');
      if (t >= 1) {
        txt.textContent = s.res ? '滤液浑浊 —— 有要点没做到' : '滤液澄清 —— 操作正确';
        txt.setAttribute('fill', s.res ? 'var(--bad)' : 'var(--ok)');
      } else {
        txt.textContent = '过滤中…';
      }
    },
    controls(s) {
      return [
        { type: 'opts', id: 'tog', label: '操作要点（点一下切换）',
          options: ITEMS.map(it => ({ v: it.id, t: it.t })),
          get: () => null,
          pick: (st, v) => { if (!st.run) st.on[v] = !st.on[v]; },
          state: (st, o) => st.on[o.v] ? 'ok' : '',
          locked: st => st.run },
        { type: 'note', html: ITEMS.map(it => `· <b>${it.t}</b> —— ${it.s}`).join('<br>') }
      ];
    },
    actLabels: { run: '开始过滤', reset: '重置' },
    actions: {
      run(s, api) {
        if (s.run) return;
        const miss = ITEMS.filter(it => !s.on[it.id]);
        s.run = true; s.t = 0;
        api.say('液体开始流下，注意观察滤液的颜色。');
        const timer = setInterval(() => {
          s.t = Math.min(1, s.t + .05);
          s.res = !s.on.stick || !s.on.level || !s.on.rod;
          api.update();
          if (s.t >= 1) {
            clearInterval(timer);
            if (s.res) {
              api.say(`滤液浑浊。原因：${miss.map(m => `<b>${m.t}</b>`).join('、')} 没有做到。${miss[0].bad}`, 'bad');
            } else {
              api.say('滤液澄清透明，四个要点全部到位。', 'ok');
              api.conclude('过滤的四句口诀', [
                '<b>一贴</b>：滤纸贴紧漏斗内壁，中间不能有气泡。',
                '<b>二低</b>：滤纸边缘低于漏斗口，液面低于滤纸边缘。',
                '<b>三靠</b>：玻璃棒靠三层滤纸、漏斗下端靠烧杯内壁、烧杯口靠玻璃棒。',
                '过滤只能除去<b>不溶性</b>杂质，可溶性杂质要靠蒸发或结晶。'
              ]);
            }
          }
        }, 55);
      },
      reset(s, api) { s.run = false; s.res = null; s.t = 0; api.clearConcl(); api.say('已重置。'); }
    },
    hud(s) {
      const n = ITEMS.filter(it => s.on[it.id]).length;
      return [
        { label: '要点达成', value: `${n}/4`, hi: n === 4 },
        { label: '滤液', value: s.res === null ? '—' : s.res ? '浑浊' : '澄清' },
        { label: '状态', value: s.run ? '过滤中' : '待开始' }
      ];
    }
  });
})();

/* ---------------- U3-02 电解水 ---------------- */
(function () {
  window.EXPERIMENTS.push({
    id: 'u3-02', studentExp: 2, code: 'U3-02', title: '电解水',
    book: '上册', unit: '第三单元 探秘水世界', kind: '课标必做',
    opening: '打开电源，观察两支刻度管里气体的体积比。',
    stageNote: '正极产生氧气，负极产生氢气，体积比 1 : 2',
    init: () => ({ power: 'off', t: 0, test: null }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="电解水装置">
      <!-- 电解槽 -->
      <rect x="104" y="238" width="252" height="94" rx="4" fill="var(--paper-2)" fill-opacity=".6"
            stroke="var(--ink)" stroke-width="1.8"/>
      <rect x="106" y="252" width="248" height="78" fill="#9fc9de" opacity=".26"/>
      <line x1="106" y1="252" x2="354" y2="252" stroke="#7fb6d6" stroke-width="1.8" opacity=".7"/>

      <!-- 左管：负极，倒扣 -->
      <g>
        <path d="M156 272 V112 a18 18 0 0 1 36 0 V272"
              fill="var(--paper-2)" fill-opacity=".7" stroke="var(--ink)" stroke-width="1.8"/>
        <rect id="waterL" x="158" y="112" width="32" height="158" fill="#9fc9de" opacity=".45"/>
        <rect id="gL" x="158" y="112" width="32" height="0" fill="var(--paper-2)"/>
        <line id="lineL" x1="158" y1="112" x2="190" y2="112" stroke="#7fb6d6" stroke-width="2" opacity="0"/>
        <text id="volL" x="174" y="96" font-size="11" fill="var(--ink)" text-anchor="middle"
              font-weight="700" font-family="var(--f-mono)">0</text>
      </g>

      <!-- 右管：正极，倒扣 -->
      <g>
        <path d="M268 272 V112 a18 18 0 0 1 36 0 V272"
              fill="var(--paper-2)" fill-opacity=".7" stroke="var(--ink)" stroke-width="1.8"/>
        <rect id="waterR" x="270" y="112" width="32" height="158" fill="#9fc9de" opacity=".45"/>
        <rect id="gR" x="270" y="112" width="32" height="0" fill="var(--paper-2)"/>
        <line id="lineR" x1="270" y1="112" x2="302" y2="112" stroke="#7fb6d6" stroke-width="2" opacity="0"/>
        <text id="volR" x="286" y="96" font-size="11" fill="var(--ink)" text-anchor="middle"
              font-weight="700" font-family="var(--f-mono)">0</text>
      </g>

      <text x="174" y="292" font-size="11" fill="var(--ink)" text-anchor="middle"
            font-weight="700" font-family="var(--f-sans)">负极</text>
      <text x="286" y="292" font-size="11" fill="var(--ink)" text-anchor="middle"
            font-weight="700" font-family="var(--f-sans)">正极</text>

      <!-- 导线与电源 -->
      <rect x="176" y="340" width="108" height="34" rx="3" fill="var(--paper-3)"
            stroke="var(--ink)" stroke-width="1.6"/>
      <text id="powerTxt" x="230" y="362" font-size="11.5" fill="var(--muted)"
            text-anchor="middle" font-family="var(--f-sans)">电源：断开</text>

      <g id="bubbles"></g>
    </svg>`,
    draw(s, el) {
      const vol = Math.round(s.t * 15);          // 正极 mL，试管容积约 30 mL
      const MAXH = 152;                          // 管内可容纳高度
      const hR = Math.min(MAXH, vol * 3.0);
      const hL = Math.min(MAXH, vol * 2 * 3.0);
      const set = (gid, wid, hid, lid, h) => {
        const g = el.querySelector('#' + gid);
        g.setAttribute('height', h);
        g.setAttribute('y', 112);
        const w = el.querySelector('#' + wid);
        w.setAttribute('height', 158 - h);
        w.setAttribute('y', 112 + h);
        const l = el.querySelector('#' + lid);
        l.setAttribute('y1', 112 + h); l.setAttribute('y2', 112 + h);
        l.setAttribute('opacity', h > 1 ? .85 : 0);
      };
      set('gL', 'waterL', null, 'lineL', hL);
      set('gR', 'waterR', null, 'lineR', hR);
      el.querySelector('#volL').textContent = vol * 2;
      el.querySelector('#volR').textContent = vol;
      el.querySelector('#powerTxt').textContent =
        s.power === 'off' ? '电源：断开' : s.power === 'dc' ? '电源：直流电' : '电源：交流电';
      el.querySelector('#powerTxt').setAttribute('fill',
        s.power === 'off' ? 'var(--muted)' : 'var(--accent)');
      el.querySelector('#bubbles').innerHTML = s.power === 'dc' && s.t > 0 && s.t < 1
        ? Array.from({ length: 12 }, (_, i) => {
            const x = 166 + (i % 2) * 112 + ((i * 7) % 14);
            const yy = 268 - ((s.t * 180 + i * 23) % 120);
            return `<circle cx="${x}" cy="${yy}" r="${1.4 + (i % 3) * .7}" fill="#9fc9de" opacity=".55"/>`;
          }).join('')
        : '';
    },
    controls(s) {
      return [
        { type: 'seg', id: 'power', label: '电源', options: [
            { v: 'off', t: '断开' }, { v: 'dc', t: '直流电' }, { v: 'ac', t: '交流电' }],
          get: st => st.power, set: (st, v) => { st.power = v; st.t = 0; } },
        { type: 'note', html: '通电后，两支管内的气体体积比约为 <b>1 : 2</b>（正极 : 负极）。' }
      ];
    },
    after(s, api) {
      if (s.power === 'off') { api.say('电源已断开。选择「直流电」开始电解。'); return; }
      if (s.power === 'ac') { api.say('<b>交流电</b>下两极产物反复颠倒，无法收集到纯净气体 —— 电解水必须用直流电。', 'bad'); return; }
      if (s.t < 1) {
        s.t = Math.min(1, s.t + 0.02);
        setTimeout(() => api.update(), 40);
        api.say('两极都有气泡产生，气体在刻度管上方聚集。');
      } else {
        const v = Math.round(s.t * 15);
        api.say(`正极气体 <b>${v} mL</b>，负极气体 <b>${v * 2} mL</b>，体积比 1 : 2。
          正极气体能使带火星木条复燃 —— 是氧气；负极气体能燃烧，火焰淡蓝 —— 是氢气。`, 'ok');
        api.conclude('电解水的结论', [
          '水在通电条件下分解：<b>2H₂O =通电= 2H₂↑ + O₂↑</b>。',
          '正极（阳极）产生<b>氧气</b>，负极（阴极）产生<b>氢气</b>，体积比 <b>1 : 2</b>。',
          '氢气体积是氧气的 2 倍，说明水中氢、氧原子个数比为 2 : 1。',
          '水中加少量硫酸钠或氢氧化钠，是为了<b>增强导电性</b>，不参与反应。'
        ]);
      }
    },
    hud(s) {
      const vol = Math.round(s.t * 15);
      return [
        { label: '正极 O₂', value: vol + ' mL' },
        { label: '负极 H₂', value: vol * 2 + ' mL', hi: s.t >= 1 },
        { label: '体积比', value: vol ? '1 : 2' : '—' }
      ];
    }
  });
})();

/* ---------------- U4-01 测定空气中氧气含量 ---------------- */
(function () {
  window.EXPERIMENTS.push({
    id: 'u4-01', code: 'U4-01', title: '测定空气中氧气的含量',
    book: '上册', unit: '第四单元 我们周围的空气', kind: '教材演示',
    opening: '按顺序点四步。注意：必须冷却到室温才能打开止水夹。',
    stageNote: '红磷燃烧消耗氧气，瓶内压强减小，水被压入约 1/5 体积',
    init: () => ({ step: 0, h: 0 }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="测定空气中氧气含量">
      <g transform="translate(150,80)">
        <rect x="0" y="0" width="160" height="220" rx="6" fill="var(--paper-2)" fill-opacity=".7"
              stroke="var(--ink)" stroke-width="1.8"/>
        <rect id="waterIn" x="2" y="218" width="156" height="0" fill="#7fb6d6" opacity=".4"/>
        <g id="spoon" opacity="0" transform="translate(80,150)">
          <line x1="0" y1="-60" x2="0" y2="0" stroke="var(--ink)" stroke-width="2"/>
          <path d="M-9 0 h18 l-4 10 h-10 Z" fill="var(--paper-3)" stroke="var(--ink)" stroke-width="1.4"/>
        </g>
        <g id="fire" opacity="0">
          <path d="M80 148 c-8 -6 -6 -15 0 -23 c6 8 8 17 0 23 Z" fill="#e8a33d"/>
        </g>
        <rect id="smoke" x="8" y="16" width="144" height="120" rx="4" fill="#e9e4d9" opacity="0"/>
        <line x1="-4" y1="0" x2="164" y2="0" stroke="var(--ink)" stroke-width="2.2" stroke-linecap="round"/>
        <text x="80" y="244" font-size="10.5" fill="var(--faint)" text-anchor="middle"
              font-family="var(--f-sans)">集气瓶 150 mL</text>
      </g>
      <g id="clampG" transform="translate(310,96)">
        <rect x="0" y="0" width="34" height="8" rx="3" fill="var(--paper-3)" stroke="var(--ink)" stroke-width="1.5"/>
        <path d="M34 4 h16" stroke="var(--ink)" stroke-width="1.5"/>
        <text x="12" y="-8" font-size="10" fill="var(--faint)" text-anchor="middle"
              font-family="var(--f-sans)">止水夹</text>
      </g>
      <g id="beakerG" transform="translate(320,200)">
        <path d="M0 0 V86 a10 10 0 0 0 10 10 h40 a10 10 0 0 0 10 -10 V0" fill="var(--paper-2)"
              fill-opacity=".7" stroke="var(--ink)" stroke-width="1.6"/>
        <rect id="bLiq" x="2" y="20" width="56" height="74" fill="#7fb6d6" opacity=".35"/>
        <text x="30" y="114" font-size="10" fill="var(--faint)" text-anchor="middle"
              font-family="var(--f-sans)">烧杯（水）</text>
      </g>
      <text id="stepTxt" x="230" y="384" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">未开始</text>
    </svg>`,
    draw(s, el, api) {
      el.querySelector('#spoon').setAttribute('opacity', s.step >= 1 ? 1 : 0);
      el.querySelector('#fire').setAttribute('opacity', s.step === 1 || s.step === 2 ? 1 : 0);
      el.querySelector('#smoke').setAttribute('opacity', s.step === 2 ? .55 : s.step >= 3 ? .18 : 0);
      el.querySelector('#waterIn').setAttribute('height', s.h);
      el.querySelector('#waterIn').setAttribute('y', 218 - s.h);
      el.querySelector('#stepTxt').textContent =
        s.step === 0 ? '未开始' : s.step === 4 ? '水进入约 1/5 体积' : `第 ${s.step} 步 / 4`;
    },
    controls(s) {
      const STEPS = ['点燃燃烧匙中的红磷', '迅速伸入集气瓶并塞紧', '冷却至室温', '打开止水夹'];
      return [
        { type: 'steps', id: 'st', label: '操作顺序', steps: STEPS, get: st => st.step },
        {
          type: 'opts', id: 'act', label: s.step < 4 ? `执行第 ${s.step + 1} 步` : '已完成',
          options: s.step < 4 ? [{ v: 'go', t: STEPS[s.step] }] : [{ v: 'done', t: '实验完成' }],
          get: () => null, pick: () => {}, state: () => ''
        }
      ];
    },
    onChange(id, v, s, api) {
      if (id !== 'act' || s.step >= 4) return;
      if (s.step === 3) {
        let h = 0;
        const timer = setInterval(() => {
          h += 6;
          if (h >= 44) { h = 44; clearInterval(timer); s.step = 4; }
          s.h = h;
          api.update();
        }, 45);
        s.step = 3;
        api.say('打开止水夹，水被压入瓶中。', 'ok');
      } else {
        s.step++;
        api.say([
          '红磷燃烧，产生大量<b>白烟</b>（五氧化二磷固体），放出热量。',
          '伸入瓶中后红磷继续燃烧，消耗瓶内的<b>氧气</b>，瓶内压强减小。',
          '必须<b>冷却到室温</b>再打开止水夹 —— 没冷却就打开，瓶内气体还热、压强偏大，进水会偏少。'
        ][s.step - 1], 'ok');
      }
    },
    after(s, api) {
      if (s.step === 4 && s.h >= 44) {
        api.say('水进入约 1/5 体积，说明氧气约占空气体积的 1/5。', 'ok');
        api.conclude('测定原理与误差', [
          '红磷燃烧：<b>4P + 5O₂ =点燃= 2P₂O₅</b>，消耗氧气，生成固体。',
          '瓶内气体减少，压强减小，水被压入，进入水的体积 = 消耗掉的氧气体积。',
          '结论：氧气约占空气体积的 <b>1/5</b>。',
          '误差偏小的常见原因：红磷不足、装置漏气、<b>未冷却就打开止水夹</b>。',
          '不能用木炭、硫代替红磷 —— 它们燃烧生成气体，瓶内压强不会明显减小。'
        ]);
      }
    },
    hud(s) {
      return [
        { label: '步骤', value: `${Math.min(s.step, 4)}/4`, hi: s.step === 4 },
        { label: '进水体积', value: Math.round(s.h / 220 * 150) + ' mL' },
        { label: '占瓶容积', value: Math.round(s.h / 220 * 100) + '%' }
      ];
    }
  });
})();

/* ---------------- U4-02 氧气的制取 ---------------- */
(function () {
  window.EXPERIMENTS.push({
    id: 'u4-02', studentExp: 4, code: 'U4-02', title: '氧气的实验室制取与性质',
    book: '上册', unit: '第四单元 我们周围的空气', kind: '课标必做',
    opening: '先选药品，再选发生装置和收集装置。三者必须匹配。',
    stageNote: '发生装置由反应物状态和条件决定，收集装置由气体密度和溶解性决定',
    init: () => ({ drug: null, gen: null, col: null, checked: false }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="制取氧气装置选择">
      <g id="scene">
        <text x="230" y="30" font-size="11" fill="var(--muted)" text-anchor="middle"
              font-family="var(--f-sans)">装置预览</text>
        <line x1="40" y1="340" x2="420" y2="340" stroke="var(--line)" stroke-width="2"/>
        <g id="genG" opacity=".18" transform="translate(90,150)"></g>
        <g id="colG" opacity=".18" transform="translate(272,150)"></g>
        <text id="combo" x="230" y="374" font-size="11.5" fill="var(--muted)" text-anchor="middle"
              font-family="var(--f-sans)">尚未选择</text>
      </g>
    </svg>`,
    draw(s, el) {
      const g = el.querySelector('#genG'), c = el.querySelector('#colG');
      g.setAttribute('opacity', s.gen ? 1 : .18);
      c.setAttribute('opacity', s.col ? 1 : .18);
      g.innerHTML = s.gen === 'heat'
        ? `<g>
             <path d="M0 0 h70 l-14 90 H14 Z" fill="var(--paper-2)" fill-opacity=".7"
                   stroke="var(--ink)" stroke-width="1.7"/>
             <rect x="24" y="-16" width="22" height="18" fill="var(--paper-3)" stroke="var(--ink)" stroke-width="1.5"/>
             <path d="M46 0 h50 q20 0 20 22 v60" fill="none" stroke="var(--ink)" stroke-width="1.7"/>
             <text x="35" y="118" font-size="10.5" fill="var(--faint)" text-anchor="middle"
                   font-family="var(--f-sans)">固固加热型</text>
           </g>`
        : s.gen === 'room'
        ? `<g>
             <path d="M0 10 h64 l-12 76 H12 Z" fill="var(--paper-2)" fill-opacity=".7"
                   stroke="var(--ink)" stroke-width="1.7"/>
             <rect x="22" y="-10" width="20" height="20" fill="var(--paper-3)" stroke="var(--ink)" stroke-width="1.5"/>
             <path d="M42 22 h54 q18 0 18 20 v46" fill="none" stroke="var(--ink)" stroke-width="1.7"/>
             <text x="32" y="106" font-size="10.5" fill="var(--faint)" text-anchor="middle"
                   font-family="var(--f-sans)">固液常温型</text>
           </g>`
        : '';
      c.innerHTML = s.col === 'water'
        ? `<g>
             <path d="M0 0 h96 v70 h-96 Z" fill="#9fc9de" opacity=".22" stroke="var(--ink)" stroke-width="1.5"/>
             <rect x="18" y="8" width="34" height="54" rx="3" fill="var(--paper-2)" fill-opacity=".7"
                   stroke="var(--ink)" stroke-width="1.5"/>
             <text x="48" y="92" font-size="10.5" fill="var(--faint)" text-anchor="middle"
                   font-family="var(--f-sans)">排水法</text>
           </g>`
        : s.col === 'up'
        ? `<g>
             <rect x="24" y="6" width="46" height="62" rx="3" fill="var(--paper-2)" fill-opacity=".7"
                   stroke="var(--ink)" stroke-width="1.5"/>
             <rect x="26" y="6" width="42" height="10" fill="var(--paper-3)" stroke="var(--ink)" stroke-width="1"/>
             <text x="48" y="92" font-size="10.5" fill="var(--faint)" text-anchor="middle"
                   font-family="var(--f-sans)">向上排空气法</text>
           </g>`
        : '';
      const names = { kmno4: '高锰酸钾', h2o2: '过氧化氢+二氧化锰', kclo3: '氯酸钾+二氧化锰' };
      const gn = { heat: '固固加热型', room: '固液常温型' };
      const cn = { water: '排水法', up: '向上排空气法' };
      el.querySelector('#combo').textContent =
        s.drug ? `${names[s.drug]} · ${gn[s.gen] || '未选发生装置'} · ${cn[s.col] || '未选收集装置'}` : '尚未选择';
    },
    controls(s) {
      return [
        { type: 'opts', id: 'drug', label: '① 药品', options: [
            { v: 'kmno4', t: '高锰酸钾（紫黑色固体）' },
            { v: 'h2o2', t: '过氧化氢溶液 + 二氧化锰' },
            { v: 'kclo3', t: '氯酸钾 + 二氧化锰' }],
          get: st => st.drug, pick: (st, v) => { st.drug = v; st.checked = false; },
          state: (st, o) => st.drug === o.v ? 'on' : '' },
        { type: 'opts', id: 'gen', label: '② 发生装置', options: [
            { v: 'heat', t: '固固加热型（试管口略向下）' },
            { v: 'room', t: '固液常温型（锥形瓶 + 长颈漏斗）' }],
          get: st => st.gen, pick: (st, v) => { st.gen = v; st.checked = false; },
          state: (st, o) => st.gen === o.v ? 'on' : '' },
        { type: 'opts', id: 'col', label: '③ 收集装置', options: [
            { v: 'water', t: '排水法' }, { v: 'up', t: '向上排空气法' }],
          get: st => st.col, pick: (st, v) => { st.col = v; st.checked = false; },
          state: (st, o) => st.col === o.v ? 'on' : '' }
      ];
    },
    actLabels: { check: '检查装置是否匹配', reset: '清空选择' },
    actions: {
      check(s, api) {
        if (!s.drug || !s.gen || !s.col) { api.say('三项都要选。', 'warn'); return; }
        const need = { kmno4: 'heat', h2o2: 'room', kclo3: 'heat' }[s.drug];
        if (s.gen !== need) {
          api.say(`<b>${s.drug === 'h2o2' ? '过氧化氢' : '固体加热'}</b>必须用 ${need === 'heat' ? '固固加热型' : '固液常温型'} 装置。选错了发生装置，反应根本不会发生。`, 'bad');
          return;
        }
        if (s.col !== 'water' && s.col !== 'up') return;
        api.say('装置匹配。氧气不易溶于水，可用排水法；密度比空气大，也可用向上排空气法。排水法收集到的气体更纯。', 'ok');
        api.conclude('制取氧气的三套路线', [
          '<b>2KMnO₄ =△= K₂MnO₄ + MnO₂ + O₂↑</b> —— 固固加热，试管口略向下、塞棉花。',
          '<b>2KClO₃ =MnO₂,△= 2KCl + 3O₂↑</b> —— 固固加热，MnO₂ 作催化剂。',
          '<b>2H₂O₂ =MnO₂= 2H₂O + O₂↑</b> —— 固液常温，不需要加热，最简便。',
          '排水法收集完毕：<b>先撤导管，后熄灭酒精灯</b>，防止水倒吸炸裂试管。',
          '验满（向上排空气法）：带火星木条放在<b>瓶口</b>；检验：伸入<b>瓶内</b>。'
        ]);
      },
      reset(s, api) { s.drug = s.gen = s.col = null; s.checked = false; api.clearConcl(); api.say('已清空选择。'); }
    },
    hud(s) {
      const need = s.drug ? { kmno4: 'heat', h2o2: 'room', kclo3: 'heat' }[s.drug] : null;
      return [
        { label: '药品', value: s.drug ? { kmno4: 'KMnO₄', h2o2: 'H₂O₂', kclo3: 'KClO₃' }[s.drug] : '—' },
        { label: '发生装置', value: s.gen ? (s.gen === 'heat' ? '加热' : '常温') : '—',
          hi: s.gen && need && s.gen !== need },
        { label: '收集', value: s.col ? (s.col === 'water' ? '排水' : '排空气') : '—' }
      ];
    }
  });
})();

/* ---------------- U5-01 质量守恒 ---------------- */
(function () {
  window.EXPERIMENTS.push({
    id: 'u5-01', code: 'U5-01', title: '质量守恒定律',
    book: '上册', unit: '第五单元 定量研究化学反应', kind: '教材演示',
    opening: '选一个反应，再选装置，称量反应前后的质量。',
    stageNote: '参加反应的各物质质量总和 = 反应后生成的各物质质量总和',
    init: () => ({ rxn: 'cuso4', dev: 'sealed', m1: null, m2: null, done: false }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="质量守恒实验">
      <line x1="30" y1="330" x2="430" y2="330" stroke="var(--line)" stroke-width="2"/>
      <g transform="translate(150,150)">
        <line x1="-60" y1="0" x2="176" y2="0" stroke="var(--ink)" stroke-width="2.4" stroke-linecap="round"/>
        <circle cx="58" cy="0" r="5" fill="var(--paper-3)" stroke="var(--ink)" stroke-width="1.6"/>
        <path d="M-52 0 v14 h52 v-14" fill="none" stroke="var(--ink)" stroke-width="1.6"/>
        <path d="M116 0 v14 h52 v-14" fill="none" stroke="var(--ink)" stroke-width="1.6"/>
        <rect x="52" y="6" width="12" height="52" fill="var(--paper-3)" stroke="var(--ink)" stroke-width="1.6"/>
        <path d="M26 58 h64 l-8 12 h-48 Z" fill="var(--paper-3)" stroke="var(--ink)" stroke-width="1.6"/>
      </g>
      <g id="flaskG" transform="translate(-52,200) scale(.85)">
        <path d="M-9 -22 v18 L-40 62 a12 12 0 0 0 10 14 h60 a12 12 0 0 0 10 -14 L9 -4 v-18"
              fill="var(--paper-2)" fill-opacity=".7" stroke="var(--ink)" stroke-width="1.7"/>
        <rect id="liqA" x="-34" y="30" width="68" height="44" fill="#9fc9de" opacity=".45"/>
        <rect id="liqB" x="-34" y="30" width="68" height="44" fill="#4e93b8" opacity="0"/>
        <g id="cap" opacity="0">
          <rect x="-13" y="-30" width="26" height="10" rx="2" fill="var(--paper-3)" stroke="var(--ink)" stroke-width="1.5"/>
        </g>
        <g id="bubG"></g>
      </g>
      <text id="devTxt" x="230" y="372" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
    </svg>`,
    draw(s, el) {
      const a = el.querySelector('#liqA'), b = el.querySelector('#liqB');
      const cap = el.querySelector('#cap');
      cap.setAttribute('opacity', s.dev === 'sealed' ? 1 : 0);
      if (s.done) {
        if (s.rxn === 'cuso4') {
          a.setAttribute('fill', '#2f6fd0'); a.setAttribute('opacity', .42);
          b.setAttribute('opacity', 0);
        } else {
          a.setAttribute('opacity', .15);
          b.setAttribute('fill', '#bcd9ea'); b.setAttribute('opacity', .5);
        }
      } else {
        a.setAttribute('fill', '#9fc9de'); a.setAttribute('opacity', .45);
        b.setAttribute('opacity', 0);
      }
      el.querySelector('#bubG').innerHTML = (s.done && s.rxn === 'na2co3' && s.dev === 'open')
        ? `<circle cx="-10" cy="50" r="3" fill="#fff" opacity=".7"/>
           <circle cx="8" cy="40" r="2.4" fill="#fff" opacity=".6"/>` : '';
      el.querySelector('#devTxt').textContent =
        (s.rxn === 'cuso4' ? '氢氧化钠 + 硫酸铜' : '碳酸钠 + 稀盐酸') +
        ' · ' + (s.dev === 'sealed' ? '密闭装置' : '敞口装置');
    },
    controls(s) {
      return [
        { type: 'opts', id: 'rxn', label: '① 选择反应', options: [
            { v: 'cuso4', t: 'NaOH + CuSO₄ → 蓝色沉淀' },
            { v: 'na2co3', t: 'Na₂CO₃ + HCl → 冒气泡' }],
          get: st => st.rxn, pick: (st, v) => { st.rxn = v; st.m1 = st.m2 = null; st.done = false; },
          state: (st, o) => st.rxn === o.v ? 'on' : '' },
        { type: 'opts', id: 'dev', label: '② 选择装置', options: [
            { v: 'sealed', t: '密闭（塞紧瓶塞）' }, { v: 'open', t: '敞口' }],
          get: st => st.dev, pick: (st, v) => { st.dev = v; st.m1 = st.m2 = null; st.done = false; },
          state: (st, o) => st.dev === o.v ? 'on' : '' }
      ];
    },
    actLabels: { weigh1: '① 称量反应前质量', react: '② 让反应发生', weigh2: '③ 称量反应后质量' },
    actions: {
      weigh1(s, api) {
        s.m1 = 128.6;
        api.say('反应前总质量：<b>128.6 g</b>。', 'ok');
      },
      react(s, api) {
        if (s.m1 === null) { api.say('先称量反应前的质量。', 'warn'); return; }
        s.done = true;
        api.say(s.rxn === 'cuso4'
          ? '生成蓝色絮状沉淀，体系内没有气体逸出。'
          : '产生大量气泡，二氧化碳逸出到空气中。', 'ok');
      },
      weigh2(s, api) {
        if (!s.done) { api.say('先让反应发生。', 'warn'); return; }
        s.m2 = (s.rxn === 'na2co3' && s.dev === 'open') ? 126.4 : 128.6;
        if (Math.abs(s.m2 - s.m1) < 0.05) {
          api.say('反应前后总质量相等，<b>质量守恒</b>。', 'ok');
          api.conclude('质量守恒定律', [
            '内容：参加化学反应的各物质质量总和，等于反应后生成的各物质质量总和。',
            '微观解释：反应前后<b>原子的种类、数目、质量</b>都不变，只是重新组合。',
            '本组实验：密闭装置中无论是否产生气体，总质量都不变。',
            '敞口且有气体逸出时，称量结果会<b>偏小</b> —— 少的质量就是逸出的 CO₂。'
          ]);
        } else {
          api.say(`反应后总质量 <b>${s.m2.toFixed(1)} g</b>，比反应前少了 ${(s.m1 - s.m2).toFixed(1)} g。少的正是逸出的 CO₂ —— 定律并没有被推翻，是装置<b>敞口</b>导致气体跑掉了。`, 'warn');
          api.conclude('为什么“变轻”了', [
            '质量守恒的前提是<b>把逸出的气体也算进去</b>。',
            '敞口装置中 CO₂ 扩散到空气里，天平自然称不到。',
            '验证质量守恒定律时，有气体参加或生成的反应必须用<b>密闭装置</b>。'
          ]);
        }
      }
    },
    hud(s) {
      return [
        { label: '反应前', value: s.m1 === null ? '—' : s.m1.toFixed(1) + ' g' },
        { label: '反应后', value: s.m2 === null ? '—' : s.m2.toFixed(1) + ' g', hi: s.m2 !== null && s.m2 !== s.m1 },
        { label: '差值', value: s.m2 === null || s.m1 === null ? '—' : (s.m2 - s.m1).toFixed(1) + ' g' }
      ];
    }
  });
})();

/* ---------------- U6-01 燃烧条件 ---------------- */
(function () {
  window.EXPERIMENTS.push({
    id: 'u6-01', studentExp: 5, code: 'U6-01', title: '燃烧条件的探究',
    book: '上册', unit: '第六单元 控制燃烧', kind: '课标必做',
    opening: '加热铜片，再决定是否通氧气，看哪几处白磷烧起来。',
    stageNote: '燃烧需要三个条件同时满足：可燃物、氧气、温度达到着火点',
    init: () => ({ temp: 20, o2: false }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="燃烧条件">
      <g id="lamp" transform="translate(199,306)"></g>

      <g id="bath">
        <path d="M136 142 V292 a7 7 0 0 0 7 7 h174 a7 7 0 0 0 7 -7 V142"
              fill="var(--paper-2)" fill-opacity=".62" stroke="var(--ink)" stroke-width="1.8"/>
        <line x1="130" y1="142" x2="330" y2="142" stroke="var(--ink)" stroke-width="2.4" stroke-linecap="round"/>
        <rect id="water" x="138" y="204" width="178" height="93" fill="#9fc9de" opacity=".26"/>
        <line id="waterTop" x1="138" y1="204" x2="316" y2="204" stroke="#7fb6d6" stroke-width="1.6" opacity=".75"/>
        <text x="336" y="250" font-size="10" fill="var(--faint)"
              font-family="var(--f-sans)">热水</text>
        <text x="336" y="264" font-size="10" fill="var(--faint)"
              font-family="var(--f-sans)">约 80 ℃</text>
      </g>

      <line x1="118" y1="138" x2="342" y2="138" stroke="var(--ink)" stroke-width="4.4" stroke-linecap="round"/>
      <text x="352" y="142" font-size="10" fill="var(--faint)"
            font-family="var(--f-sans)">铜片</text>

      <g id="pWhite" transform="translate(180,132)">
        <g class="fl" opacity="0">
          <path d="M0 -8 c-8 -6 -6 -15 0 -23 c6 8 8 17 0 23 Z" fill="#e8a33d"/>
          <path d="M0 -8 c-4 -4 -3 -10 0 -14 c3 4 4 10 0 14 Z" fill="#f6d68a"/>
        </g>
        <circle r="7.5" fill="#f4f0e6" stroke="var(--ink)" stroke-width="1.4"/>
        <text x="0" y="-38" font-size="10" fill="var(--muted)" text-anchor="middle"
              font-family="var(--f-sans)">白磷</text>
      </g>

      <g id="pRed" transform="translate(286,132)">
        <g class="fl" opacity="0">
          <path d="M0 -8 c-8 -6 -6 -15 0 -23 c6 8 8 17 0 23 Z" fill="#e8a33d"/>
          <path d="M0 -8 c-4 -4 -3 -10 0 -14 c3 4 4 10 0 14 Z" fill="#f6d68a"/>
        </g>
        <circle r="7.5" fill="#c2493f" stroke="var(--ink)" stroke-width="1.4"/>
        <text x="0" y="-38" font-size="10" fill="var(--muted)" text-anchor="middle"
              font-family="var(--f-sans)">红磷</text>
      </g>

      <g id="pWater" transform="translate(228,258)">
        <g class="fl" opacity="0">
          <path d="M0 -8 c-9 -7 -6 -17 0 -26 c6 9 9 19 0 26 Z" fill="#e8a33d"/>
          <path d="M0 -8 c-4 -4 -3 -10 0 -14 c3 4 4 10 0 14 Z" fill="#f6d68a"/>
        </g>
        <circle r="7.5" fill="#f4f0e6" stroke="var(--ink)" stroke-width="1.4"/>
        <text x="58" y="4" font-size="10" fill="var(--muted)"
              font-family="var(--f-sans)">水中白磷</text>
      </g>

      <text id="tTxt" x="230" y="384" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
    </svg>`,
    draw(s, el) {
      el.querySelector('#lamp').innerHTML = Parts.lamp({ x: 0, y: 0, lit: s.temp >= 40 });
      const paint = (id, hot, burn) => {
        const g = el.querySelector('#' + id);
        g.querySelector('.fl').setAttribute('opacity', burn ? 1 : 0);
        const c = g.querySelector('circle');
        if (burn) c.setAttribute('fill', '#3a3730');
        else c.setAttribute('fill', id === 'pRed' ? '#c2493f' : '#f4f0e6');
      };
      const w = s.temp >= 40 && s.o2;
      const r = s.temp >= 240 && s.o2;
      paint('pWhite', s.temp >= 40, w);
      paint('pRed', s.temp >= 240, r);
      paint('pWater', s.temp >= 40, w);
      el.querySelector('#water').setAttribute('fill',
        s.temp >= 60 ? '#c9908a' : '#9fc9de');
      el.querySelector('#water').setAttribute('opacity', s.temp >= 60 ? .3 : .28);
      el.querySelector('#tTxt').textContent =
        `温度 ${s.temp} ℃ · ${s.o2 ? '已通氧气' : '未通氧气'}`;
    },
    controls(s) {
      return [
        { type: 'range', id: 'temp', label: '加热温度', min: 20, max: 300, step: 10, unit: ' ℃',
          get: st => st.temp, set: (st, v) => { st.temp = v; },
          note: '白磷着火点约 40 ℃，红磷约 240 ℃' },
        { type: 'seg', id: 'o2', label: '是否通氧气', options: [
            { v: 'n', t: '不通' }, { v: 'y', t: '通氧气' }],
          get: st => st.o2 ? 'y' : 'n', set: (st, v) => { st.o2 = v === 'y'; } }
      ];
    },
    after(s, api) {
      const w = s.temp >= 40 && s.o2;
      const r = s.temp >= 240 && s.o2;
      const ww = s.temp >= 40;
      if (w && r) {
        api.say('铜片上的白磷和红磷都燃烧，水中的白磷也燃烧。三个条件全部满足。', 'ok');
        api.conclude('燃烧的三个条件', [
          '可燃物、氧气（或空气）、温度达到着火点 —— <b>三者缺一不可</b>。',
          '水中白磷通氧气后燃烧，说明水下也能燃烧，只要满足三个条件。',
          '白磷着火点低（40 ℃），红磷高（240 ℃），所以热水就能点燃白磷。',
          '灭火的原理就是<b>破坏其中一个条件</b>：清除可燃物、隔绝氧气、降温到着火点以下。'
        ]);
      } else if (ww && !s.o2) {
        api.say('温度已超过白磷着火点，但水中白磷不燃烧 —— 因为它<b>没有接触氧气</b>。', 'warn');
      } else if (w && !r) {
        api.say('只有白磷燃烧。红磷没烧，因为温度还没到它的着火点（240 ℃）。', 'ok');
      } else if (!w && s.o2 && s.temp < 40) {
        api.say('通了氧气但温度不够，白磷也不燃烧。', 'warn');
      } else {
        api.say('当前条件下没有任何物质燃烧。');
      }
    },
    hud(s) {
      const burning = [
        s.temp >= 40 && s.o2 ? '白磷' : null,
        s.temp >= 240 && s.o2 ? '红磷' : null,
        s.temp >= 40 && s.o2 ? '水中白磷' : null
      ].filter(Boolean);
      return [
        { label: '温度', value: s.temp + ' ℃' },
        { label: '氧气', value: s.o2 ? '有' : '无' },
        { label: '正在燃烧', value: burning.length ? burning.length + ' 处' : '无', hi: burning.length > 0 }
      ];
    }
  });
})();

/* ---------------- S06 二氧化碳的制取与性质（学生实验 6） ---------------- */
(function () {
  window.EXPERIMENTS.push({
    id: 'u6-02', code: 'U6-02', title: '二氧化碳的实验室制取与性质',
    book: '上册', unit: '第六单元 控制燃烧', kind: '课标必做', studentExp: 6,
    opening: '先选试剂和收集方法，制取一瓶 CO₂，再做三个性质实验。',
    stageNote: '固液常温型装置；长颈漏斗下端要伸入液面以下形成液封',
    init: () => ({
      phase: 'make', drug: 'marble', collect: 'up',
      made: false, full: false, gas: 0,
      lime: false, litmus: false, candle: false
    }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="二氧化碳的制取与性质">
      <g id="phaseMake">
        <!-- 锥形瓶 -->
        <g transform="translate(112,150)">
          <path d="M34 0 v34 L4 128 a14 14 0 0 0 13 18 h94 a14 14 0 0 0 13 -18 L94 34 V0"
                fill="var(--paper-2)" fill-opacity=".7" stroke="var(--ink)" stroke-width="1.8"/>
          <line x1="26" y1="0" x2="102" y2="0" stroke="var(--ink)" stroke-width="2.4" stroke-linecap="round"/>
          <g id="chips"></g>
          <rect id="acid" x="16" y="118" width="94" height="0" fill="#cfe3f0" opacity=".45"/>
          <text x="64" y="164" font-size="10" fill="var(--faint)" text-anchor="middle"
                font-family="var(--f-sans)">锥形瓶</text>
        </g>
        <!-- 分液漏斗 -->
        <g transform="translate(196,44)">
          <path d="M-14 0 h28 v16 L24 58 a8 8 0 0 1 -8 10 h-32 a8 8 0 0 1 -8 -10 L-24 16 Z"
                fill="var(--paper-2)" fill-opacity=".7" stroke="var(--ink)" stroke-width="1.6"/>
          <line x1="-18" y1="0" x2="18" y2="0" stroke="var(--ink)" stroke-width="2"/>
          <rect x="-5" y="58" width="10" height="14" fill="var(--paper-3)" stroke="var(--ink)" stroke-width="1.3"/>
          <rect x="-11" y="10" width="22" height="22" fill="#cfe3f0" opacity=".45"/>
          <text x="0" y="-8" font-size="10" fill="var(--faint)" text-anchor="middle"
                font-family="var(--f-sans)">稀盐酸</text>
        </g>
        <!-- 导管 -->
        <path d="M176 132 h56 q24 0 24 24 v34" fill="none" stroke="var(--ink)" stroke-width="2"/>
        <!-- 集气瓶 -->
        <g transform="translate(240,190)">
          <rect x="0" y="0" width="86" height="112" rx="4" fill="var(--paper-2)" fill-opacity=".7"
                stroke="var(--ink)" stroke-width="1.8"/>
          <rect id="gasFill" x="3" y="112" width="80" height="0" fill="#dfe6ea" opacity=".85"/>
          <rect id="plate" x="-5" y="-8" width="96" height="7" rx="2"
                fill="var(--paper-3)" stroke="var(--ink)" stroke-width="1.2" opacity="0"/>
          <text x="43" y="132" font-size="10" fill="var(--faint)" text-anchor="middle"
                font-family="var(--f-sans)">集气瓶</text>
        </g>
        <!-- 验满木条 -->
        <g id="stick" opacity="0" transform="translate(283,178)">
          <rect x="-2" y="0" width="4" height="26" fill="#b08b5a" stroke="var(--ink)" stroke-width="1"/>
          <path d="M0 -2 c-4 -5 -3 -11 0 -15 c3 4 4 10 0 15 Z" fill="#e8a33d"/>
        </g>
        <text id="makeTip" x="230" y="382" font-size="11" fill="var(--muted)" text-anchor="middle"
              font-family="var(--f-sans)">选择试剂后开始制取</text>
      </g>

      <g id="phaseProp" style="display:none">
        <text x="230" y="26" font-size="11" fill="var(--muted)" text-anchor="middle"
              font-family="var(--f-sans)">用制得的二氧化碳做三个性质实验</text>
        <!-- 石灰水 -->
        <g transform="translate(84,70)">
          <path d="M0 0 V96 a16 16 0 0 0 32 0 V0" fill="var(--paper-2)" fill-opacity=".7"
                stroke="var(--ink)" stroke-width="1.6"/>
          <rect id="limeLiq" x="2" y="60" width="28" height="52" fill="#e8eef2" opacity=".5"/>
          <g id="limeCloud" opacity="0"></g>
          <text x="16" y="126" font-size="10" fill="var(--muted)" text-anchor="middle"
                font-family="var(--f-sans)">澄清石灰水</text>
        </g>
        <!-- 石蕊 -->
        <g transform="translate(212,84)">
          <path d="M-24 -10 h48 l-6 76 a18 18 0 0 1 -36 0 Z" fill="var(--paper-2)" fill-opacity=".7"
                stroke="var(--ink)" stroke-width="1.6"/>
          <rect id="litmusLiq" x="-20" y="8" width="40" height="56" fill="#8c7fb8" opacity=".38" rx="2"/>
          <text x="0" y="104" font-size="10" fill="var(--muted)" text-anchor="middle"
                font-family="var(--f-sans)">紫色石蕊</text>
        </g>
        <!-- 蜡烛 -->
        <g transform="translate(330,80)">
          <!-- 烧杯 -->
          <path d="M-30 62 V96 a6 6 0 0 0 6 6 h48 a6 6 0 0 0 6 -6 V62"
                fill="var(--paper-2)" fill-opacity=".6" stroke="var(--ink)" stroke-width="1.6"/>
          <line x1="-34" y1="62" x2="34" y2="62" stroke="var(--ink)" stroke-width="2"/>
          <!-- 低蜡烛 -->
          <g transform="translate(-13,0)">
            <rect x="-4" y="22" width="8" height="40" fill="#f6eed4" stroke="var(--ink)" stroke-width="1.2"/>
            <line x1="0" y1="22" x2="0" y2="16" stroke="var(--ink)" stroke-width="1.3"/>
            <g id="flameLow"><path d="M0 16 c-4 -5 -3 -12 0 -16 c3 4 4 11 0 16 Z" fill="#e8a33d"/></g>
          </g>
          <!-- 高蜡烛 -->
          <g transform="translate(13,-16)">
            <rect x="-4" y="22" width="8" height="56" fill="#f6eed4" stroke="var(--ink)" stroke-width="1.2"/>
            <line x1="0" y1="22" x2="0" y2="16" stroke="var(--ink)" stroke-width="1.3"/>
            <g id="flameHigh"><path d="M0 16 c-4 -5 -3 -12 0 -16 c3 4 4 11 0 16 Z" fill="#e8a33d"/></g>
          </g>
          <text x="0" y="118" font-size="10" fill="var(--muted)" text-anchor="middle"
                font-family="var(--f-sans)">高低蜡烛</text>
        </g>
        <text id="propTip" x="230" y="382" font-size="11" fill="var(--muted)" text-anchor="middle"
              font-family="var(--f-sans)">按左侧按钮依次验证</text>
      </g>
    </svg>`,
    draw(s, el) {
      el.querySelector('#phaseMake').style.display = s.phase === 'make' ? '' : 'none';
      el.querySelector('#phaseProp').style.display = s.phase === 'prop' ? '' : 'none';

      /* 药品 */
      const chips = el.querySelector('#chips');
      chips.innerHTML = s.drug === 'marble'
        ? Array.from({ length: 7 }, (_, i) =>
            `<circle cx="${24 + (i * 17) % 66}" cy="${104 - (i % 3) * 7}" r="${4 + (i % 2)}"
              fill="#cfcabd" stroke="var(--ink)" stroke-width="1"/>`).join('')
        : s.drug === 'powder'
        ? `<rect x="20" y="112" width="82" height="8" fill="#e6e2d6" stroke="none"/>`
        : Array.from({ length: 7 }, (_, i) =>
            `<circle cx="${24 + (i * 17) % 66}" cy="${104 - (i % 3) * 7}" r="${4 + (i % 2)}"
              fill="#cfcabd" stroke="var(--ink)" stroke-width="1"/>`).join('');

      const acid = el.querySelector('#acid');
      acid.setAttribute('height', s.made ? 30 : 0);
      acid.setAttribute('y', s.made ? 106 : 136);

      const gas = el.querySelector('#gasFill');
      gas.setAttribute('height', s.gas * 1.05);
      gas.setAttribute('y', 112 - s.gas * 1.05);
      el.querySelector('#plate').setAttribute('opacity', s.full ? 1 : 0);
      el.querySelector('#stick').setAttribute('opacity', s.full ? 1 : 0);

      el.querySelector('#makeTip').textContent =
        s.drug !== 'marble' ? '当前试剂不适合制取 CO₂'
        : !s.made ? '试剂已就位，点「开始制取」'
        : !s.full ? `正在收集… ${Math.round(s.gas / 100 * 100)}%`
        : '已集满，可以去做性质实验了';

      if (s.phase === 'prop') {
        el.querySelector('#limeCloud').setAttribute('opacity', s.lime ? 1 : 0);
        el.querySelector('#limeCloud').innerHTML = s.lime
          ? Array.from({ length: 14 }, (_, i) =>
              `<circle cx="${6 + (i * 7) % 20}" cy="${70 + (i * 11) % 38}" r="${1.4 + (i % 3) * .5}"
                fill="#ffffff" opacity=".9"/>`).join('') : '';
        el.querySelector('#limeLiq').setAttribute('fill', s.lime ? '#eef1f3' : '#e8eef2');
        el.querySelector('#litmusLiq').setAttribute('fill', s.litmus ? '#a8324a' : '#8c7fb8');
        el.querySelector('#flameLow').setAttribute('opacity', s.candle ? 0 : 1);
        el.querySelector('#flameHigh').setAttribute('opacity', s.candle ? 0 : 1);
        el.querySelector('#propTip').textContent =
          s.lime && s.litmus && s.candle ? '三个性质都验证完了' : '按左侧按钮依次验证';
      }
    },
    controls(s) {
      if (s.phase === 'make') {
        return [
          { type: 'opts', id: 'drug', label: '① 选择试剂', options: [
              { v: 'marble', t: '石灰石 + 稀盐酸' },
              { v: 'sulfur', t: '石灰石 + 稀硫酸' },
              { v: 'powder', t: '碳酸钠粉末 + 稀盐酸' }],
            get: st => st.drug, pick: (st, v) => { if (!st.made) st.drug = v; },
            state: (st, o) => st.drug === o.v ? 'on' : '', locked: st => st.made },
          { type: 'opts', id: 'collect', label: '② 收集方法', options: [
              { v: 'up', t: '向上排空气法' },
              { v: 'down', t: '向下排空气法' },
              { v: 'water', t: '排水法' }],
            get: st => st.collect, pick: (st, v) => { if (!st.made) st.collect = v; },
            state: (st, o) => st.collect === o.v ? 'on' : '', locked: st => st.made }
        ];
      }
      return [{
        type: 'note',
        html: '三个性质实验各自独立，顺序不限。<br>澄清石灰水变浑浊 —— 检验 CO₂；<br>石蕊变红 —— CO₂ 与水反应生成碳酸；<br>蜡烛自下而上熄灭 —— 密度大、不燃不助燃。'
      }];
    },
    actLabels: {
      make: '开始制取', full: '验满', toProp: '去做性质实验',
      lime: '通入澄清石灰水', litmus: '滴入紫色石蕊', candle: '倾倒二氧化碳'
    },
    secondary: ['toProp', 'lime', 'litmus', 'candle'],
    actionHide(k, s) {
      const making = ['make', 'full', 'toProp'];
      return s.phase === 'make' ? k === 'lime' || k === 'litmus' || k === 'candle'
                              : making.includes(k);
    },
    actions: {
      make(s, api) {
        if (s.made) return;
        if (s.drug === 'sulfur') {
          api.say('稀硫酸与石灰石反应生成<b>微溶于水的硫酸钙</b>，覆盖在石灰石表面，反应很快停止 —— 制不出 CO₂。', 'bad');
          return;
        }
        if (s.drug === 'powder') {
          api.say('碳酸钠粉末与盐酸反应<b>太快</b>，气体来不及收集，不适合实验室制取。', 'bad');
          return;
        }
        if (s.collect === 'water') {
          api.say('CO₂ 能溶于水，<b>不能用排水法</b>收集。', 'bad');
          return;
        }
        if (s.collect === 'down') {
          api.say('CO₂ 密度比空气大，用向下排空气法会收集不到。', 'bad');
          return;
        }
        s.made = true;
        api.say('石灰石表面产生大量气泡，气体沿导管进入集气瓶，瓶内空气被从上口排出。', 'ok');
      },
      full(s, api) {
        if (!s.made) { api.say('先制取气体。', 'warn'); return; }
        if (s.gas < 100) {
          s.gas = Math.min(100, s.gas + 34);
          s.full = s.gas >= 100;
          api.say(s.full ? '集气瓶口木条熄灭 —— 已集满。' : '还在收集，再等一会儿。', s.full ? 'ok' : '');
          if (s.full) api.conclude('二氧化碳的制取', [
            '原理：<b>CaCO₃ + 2HCl = CaCl₂ + H₂O + CO₂↑</b>。',
            '发生装置：固液常温型，长颈漏斗下端要<b>伸入液面以下</b>，防止气体从漏斗逸出。',
            '收集：只能<b>向上排空气法</b> —— 密度比空气大，且能溶于水。',
            '验满：燃着的木条放在<b>瓶口</b>，熄灭则满；检验：通入澄清石灰水，变浑浊。',
            '不用稀硫酸（生成硫酸钙覆盖表面）、不用浓盐酸（挥发 HCl）、不用碳酸钠粉末（太快）。'
          ]);
          return;
        }
        api.say('已经满了。', 'warn');
      },
      toProp(s, api) {
        if (!s.full) { api.say('先集满一瓶气体。', 'warn'); return; }
        s.phase = 'prop';
        api.say('换到性质实验台。三支器材已备好。');
      },
      lime(s, api) {
        if (s.lime) return;
        s.lime = true;
        api.say('澄清石灰水<b>变浑浊</b>：CO₂ + Ca(OH)₂ = CaCO₃↓ + H₂O。这是检验 CO₂ 的方法。', 'ok');
        checkDone(s, api);
      },
      litmus(s, api) {
        if (s.litmus) return;
        s.litmus = true;
        api.say('紫色石蕊<b>变红</b>：CO₂ + H₂O = H₂CO₃。使石蕊变红的是<b>碳酸</b>，不是 CO₂ 本身。', 'ok');
        checkDone(s, api);
      },
      candle(s, api) {
        if (s.candle) return;
        s.candle = true;
        api.say('下层蜡烛先熄灭、上层后熄灭：CO₂ <b>密度比空气大</b>，且<b>不燃烧也不支持燃烧</b>。', 'ok');
        checkDone(s, api);
      }
    },
    hud(s) {
      if (s.phase === 'make') {
        return [
          { label: '已收集', value: Math.round(s.gas) + '%', hi: s.full },
          { label: '验满', value: s.full ? '已满' : '未满' },
          { label: '收集方法', value: s.collect === 'up' ? '向上排空气' : s.collect === 'down' ? '向下排空气' : '排水法' }
        ];
      }
      return [
        { label: '石灰水', value: s.lime ? '变浑浊' : '—', hi: s.lime },
        { label: '石蕊', value: s.litmus ? '变红' : '—', hi: s.litmus },
        { label: '蜡烛', value: s.candle ? '自下而上熄灭' : '—', hi: s.candle }
      ];
    }
  });

  function checkDone(s, api) {
    if (!(s.lime && s.litmus && s.candle)) return;
    api.conclude('二氧化碳的三条性质', [
      '物理性质：无色无味，<b>密度比空气大</b>，能溶于水。',
      '与水反应：<b>CO₂ + H₂O = H₂CO₃</b>，碳酸能使紫色石蕊变红；加热后碳酸分解，红色又褪去。',
      '与碱反应：<b>CO₂ + Ca(OH)₂ = CaCO₃↓ + H₂O</b>，用于检验 CO₂。',
      '不燃烧、不支持燃烧：可用来灭火，倾倒时<b>下层先灭</b>。',
      '注意：使石蕊变红的是碳酸，不是 CO₂ —— 干燥的 CO₂ 不能使干燥石蕊纸花变色。'
    ]);
  }
})();

/* ---------------- K03 自制简易净水器（跨学科实践1） ---------------- */
(function () {
  const PACKS = {
    std:     { n: '标准四层', layers: ['小卵石', '石英砂', '活性炭', '蓬松棉'], score: 3,
               desc: '由上到下颗粒由粗到细，最后用蓬松棉挡住细炭粉。' },
    nocarbon:{ n: '去掉活性炭', layers: ['小卵石', '石英砂', '蓬松棉'], score: 2,
               desc: '过滤还在，但颜色和异味去不掉 —— 吸附靠的是活性炭。' },
    reverse: { n: '顺序颠倒', layers: ['蓬松棉', '活性炭', '石英砂', '小卵石'], score: 1,
               desc: '细材料在上，很快被泥沙堵死，水几乎下不去。' },
    cotton:  { n: '只放蓬松棉', layers: ['蓬松棉'], score: 0,
               desc: '只能挡住大颗粒，细小泥沙照样漏过去。' }
  };
  const LAYER_C = {
    '小卵石': ['#b9b2a4', '#8f887a'],
    '石英砂': ['#ddd2ae', '#b8a97c'],
    '活性炭': ['#4a4a4e', '#2c2c30'],
    '蓬松棉': ['#f4f2ec', '#d8d4c8']
  };
  const OUT = [
    { c: 'rgba(150,120,90,.7)', t: '仍然很浑浊', msg: '泥沙几乎没被拦住，这样的水不能喝。' },
    { c: 'rgba(172,152,122,.62)', t: '浑浊减轻，仍有泥沙', msg: '细颗粒漏了过去，过滤层次不够。' },
    { c: 'rgba(206,216,206,.58)', t: '清澈但略带颜色和气味', msg: '浊度降下来了，可溶解的色素和异味还在。' },
    { c: 'rgba(214,236,246,.55)', t: '清澈、无色、无味', msg: '过滤 + 吸附都起作用了。' }
  ];

  window.EXPERIMENTS.push({
    id: 'k01', code: 'K01', title: '自制简易净水器',
    book: '上册', unit: '第三单元 探秘水世界', kind: '跨学科实践',
    opening: '选一种装填方案，把浑水倒进去，比较出水的水质。',
    stageNote: '净水器只能除去不溶性杂质和部分色素异味，不能杀菌，也不能把硬水软化',
    init: () => ({ pack: 'std', poured: false }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="自制简易净水器">
      <text x="230" y="34" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">浑水 → 分层过滤 → 出水</text>

      <!-- 上部储水（倒置瓶身） -->
      <path d="M176 60 h108 v34 l-14 18 v150 a10 10 0 0 1 -10 10 h-60 a10 10 0 0 1 -10 -10 V112 l-14 -18 Z"
            fill="var(--paper-2)" fill-opacity=".65" stroke="var(--ink)" stroke-width="1.8" stroke-linejoin="round"/>
      <g clip-path="url(#npClip)">
        <rect id="raw" x="176" y="60" width="108" height="0" fill="rgba(150,116,78,.72)"/>
        <g id="layers"></g>
      </g>
      <defs>
        <clipPath id="npClip">
          <path d="M176 60 h108 v34 l-14 18 v150 a10 10 0 0 1 -10 10 h-60 a10 10 0 0 1 -10 -10 V112 l-14 -18 Z"/>
        </clipPath>
      </defs>
      <line x1="170" y1="60" x2="290" y2="60" stroke="var(--ink)" stroke-width="2.2" stroke-linecap="round"/>
      <g id="labels"></g>

      <!-- 出水口 -->
      <path d="M230 282 v18" stroke="var(--ink)" stroke-width="1.8"/>
      <circle id="drop" cx="230" cy="306" r="3.4" fill="rgba(214,236,246,.8)" opacity="0"/>

      <!-- 接水烧杯 -->
      <g id="cup" transform="translate(184,310)"></g>
      <rect id="outLiq" x="191" y="344" width="78" height="22" fill="rgba(214,236,246,.55)" opacity="0"/>

      <text id="packTxt" x="230" y="392" font-size="11.5" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">标准四层</text>
    </svg>`,
    draw(s, el) {
      const cup = el.querySelector('#cup');
      if (!cup.dataset.init) {
        cup.innerHTML = window.Parts.beaker({ x: 0, y: 0, w: 92, h: 66, fill: '#cfe3f0', level: 0 });
        cup.dataset.init = '1';
      }
      const p = PACKS[s.pack];
      const n = p.layers.length;
      const top = 112, area = 168;
      const hh = area / n;
      const labels = [];
      el.querySelector('#layers').innerHTML = p.layers.map((name, i) => {
        const [c1, c2] = LAYER_C[name];
        const y = top + i * hh;
        const dots = name === '活性炭'
          ? Array.from({ length: 14 }, (_, k) =>
              `<circle cx="${186 + (k * 29) % 92}" cy="${y + 6 + (k * 17) % Math.max(8, hh - 10)}"
                 r="${1.6 + (k % 3) * .6}" fill="#1c1c1e" opacity=".8"/>`).join('')
          : name === '小卵石'
            ? Array.from({ length: 12 }, (_, k) =>
              `<circle cx="${188 + (k * 31) % 88}" cy="${y + 7 + (k * 19) % Math.max(8, hh - 12)}"
                 r="${2.4 + (k % 3)}" fill="${c2}" opacity=".75"/>`).join('')
            : '';
        labels.push(`<line x1="284" y1="${y + hh / 2}" x2="302" y2="${y + hh / 2}"
            stroke="var(--line)" stroke-width="1"/>
          <text x="308" y="${y + hh / 2 + 4}" font-size="10.5" fill="var(--muted)"
                font-family="var(--f-sans)">${name}</text>`);
        return `<rect x="176" y="${y}" width="108" height="${hh}" fill="${c1}"/>
          <line x1="176" y1="${y}" x2="284" y2="${y}" stroke="${c2}" stroke-width="1"/>
          ${dots}`;
      }).join('');
      el.querySelector('#labels').innerHTML = labels.join('');

      const raw = el.querySelector('#raw');
      raw.setAttribute('height', s.poured ? 48 : 0);
      raw.setAttribute('opacity', s.poured ? 1 : 0);

      const o = OUT[p.score];
      const out = el.querySelector('#outLiq');
      out.setAttribute('opacity', s.poured ? 1 : 0);
      out.setAttribute('fill', o.c);
      el.querySelector('#drop').setAttribute('opacity', s.poured ? .9 : 0);
      el.querySelector('#drop').setAttribute('fill', o.c);
      el.querySelector('#packTxt').textContent = `${p.n}：${p.desc}`;
    },
    controls(s) {
      return [{
        type: 'opts', id: 'pack', label: '① 选择装填方案',
        options: Object.keys(PACKS).map(k => ({ v: k, t: PACKS[k].n })),
        get: st => st.pack,
        pick: (st, v) => { st.pack = v; st.poured = false; },
        state: (st, o) => st.poured && st.pack === o.v ? 'ok' : (st.pack === o.v ? 'on' : '')
      }];
    },
    actLabels: { pour: '倒入一杯浑水', reset: '重置' },
    secondary: ['reset'],
    actions: {
      pour(s, api) {
        const p = PACKS[s.pack];
        s.poured = true;
        const o = OUT[p.score];
        api.say(`<b>${p.n}</b>：出水${o.t}。${o.msg}`, p.score >= 2 ? 'ok' : 'warn');
        if (p.score === 3) {
          api.conclude('简易净水器的三层作用', [
            '<b>小卵石 + 石英砂</b>：过滤，拦住泥沙等不溶性杂质。颗粒由粗到细，否则细砂很快被堵死。',
            '<b>活性炭</b>：吸附，除去色素和异味（疏松多孔，表面积大）。',
            '<b>蓬松棉</b>：挡住细小的炭粉和砂粒，防止它们冲进水里。',
            '这套装置得到的水<b>仍然不能直接喝</b>：没有杀菌，也除不掉可溶性钙镁离子（硬水）。',
            '实验室里真正的净化顺序是：沉降 → 过滤 → 吸附 → 蒸馏（或杀菌），蒸馏才能得到纯水。'
          ]);
        }
      },
      reset(s, api) {
        s.poured = false;
        api.clearConcl(); api.say('已重置，换一种装法再试。');
      }
    },
    hud(s) {
      const p = PACKS[s.pack];
      return [
        { label: '层数', value: p.layers.length },
        { label: '出水', value: s.poured ? OUT[p.score].t : '—', hi: s.poured && p.score === 3 },
        { label: '浊度', value: s.poured ? ['很高', '较高', '较低', '低'][p.score] : '—' }
      ];
    }
  });
})();

/* ---------------- K02 简易供氧器（跨学科实践2） ---------------- */
(function () {
  const V_M = 24;   // 常温常压下气体摩尔体积 L/mol
  window.EXPERIMENTS.push({
    id: 'k02', code: 'K02', title: '设计和制作简易供氧器',
    book: '上册', unit: '第四单元 我们周围的空气', kind: '跨学科实践',
    opening: '配一瓶双氧水，看能放出多少氧气、够吸多久。',
    stageNote: '按常温常压 24 L/mol 估算；实际产率低于理论值，需留安全余量',
    init: () => ({ c: 6, V: 200, cat: true, made: false }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="简易供氧器">
      <text x="230" y="30" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">分液漏斗 + 锥形瓶 + 洗气 + 气袋</text>

      <!-- 分液漏斗 -->
      <path d="M196 70 h48 l-10 34 h-28 Z" fill="var(--paper-2)" fill-opacity=".7"
            stroke="var(--ink)" stroke-width="1.6"/>
      <line x1="192" y1="70" x2="248" y2="70" stroke="var(--ink)" stroke-width="2"/>
      <rect x="216" y="104" width="8" height="26" fill="var(--paper-2)" stroke="var(--ink)" stroke-width="1.4"/>
      <circle id="valve" cx="220" cy="118" r="6" fill="var(--paper-3)" stroke="var(--ink)" stroke-width="1.4"/>
      <text x="220" y="60" font-size="9.5" fill="var(--muted)" text-anchor="middle" font-family="var(--f-sans)">双氧水</text>

      <!-- 锥形瓶 -->
      <path d="M206 130 v18 L176 268 a14 14 0 0 0 12 18 h64 a14 14 0 0 0 12 -18 L234 148 v-18"
            fill="var(--paper-2)" fill-opacity=".55" stroke="var(--ink)" stroke-width="1.8"/>
      <line x1="200" y1="130" x2="240" y2="130" stroke="var(--ink)" stroke-width="2.2"/>
      <g id="liq"><rect x="182" y="236" width="76" height="46" fill="rgba(150,190,220,.55)"/>
        <line x1="182" y1="236" x2="258" y2="236" stroke="#6fa3c4" stroke-width="2"/></g>
      <g id="bubbles"></g>
      <text x="220" y="302" font-size="9.5" fill="var(--muted)" text-anchor="middle" font-family="var(--f-sans)">锥形瓶（MnO₂）</text>

      <!-- 导管 + 气袋 -->
      <path d="M234 142 h74 v34" fill="none" stroke="var(--ink)" stroke-width="1.6"/>
      <path d="M308 176 v20" fill="none" stroke="var(--ink)" stroke-width="1.6"/>
      <g id="bag" transform="translate(268,196)">
        <rect x="0" y="0" width="80" height="72" rx="10" fill="rgba(206,230,246,.45)"
              stroke="var(--ink)" stroke-width="1.6"/>
        <text id="bagTxt" x="40" y="40" font-size="11" fill="var(--ink)" text-anchor="middle"
              font-family="var(--f-num)">0 L</text>
      </g>

      <text id="outTxt" x="230" y="378" font-size="12" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
    </svg>`,
    draw(s, el) {
      const r = calc(s);
      el.querySelector('#bagTxt').textContent = `${r.o2.toFixed(1)} L`;
      el.querySelector('#bag').setAttribute('transform',
        `translate(${268 - Math.min(10, r.o2 * .3)},${196 + Math.min(8, r.o2 * .2)})`);
      el.querySelector('#liq').setAttribute('opacity', s.made ? .35 : 1);
      const b = el.querySelector('#bubbles');
      b.innerHTML = s.made && s.cat
        ? Array.from({ length: 10 }, (_, i) =>
          `<circle cx="${192 + (i * 23) % 56}" cy="${232 - (i * 17) % 60}" r="${1.6 + i % 3 * .7}"
             fill="#fff" opacity=".75"/>`).join('')
        : '';
      el.querySelector('#outTxt').textContent = s.made
        ? `产氧 ${r.o2.toFixed(1)} L，按 2 L/min 可吸 ${r.min.toFixed(0)} 分钟`
        : '配好双氧水，点"开始制氧"';
    },
    controls(s) {
      return [{
        type: 'seg', id: 'c', label: '① 双氧水浓度',
        options: [{ v: '3', t: '3%' }, { v: '6', t: '6%' }, { v: '15', t: '15%' }, { v: '30', t: '30%' }],
        get: st => String(st.c), set: (st, v) => { st.c = +v; st.made = false; }
      }, {
        type: 'range', id: 'V', label: '② 双氧水体积', min: 100, max: 500, step: 50, unit: ' mL',
        get: st => st.V, set: (st, v) => { st.V = v; st.made = false; }
      }, {
        type: 'seg', id: 'cat', label: '③ 加不加二氧化锰',
        options: [{ v: '1', t: '加 MnO₂' }, { v: '0', t: '不加' }],
        get: st => (st.cat ? '1' : '0'), set: (st, v) => { st.cat = v === '1'; st.made = false; }
      }];
    },
    actLabels: { make: '开始制氧', reset: '重置' },
    secondary: ['reset'],
    actions: {
      make(s, api) {
        const r = calc(s);
        s.made = true;
        if (!s.cat) {
          api.say(`不加催化剂，常温下双氧水分解很慢，几分钟也看不到明显气泡。<br>理论上能产 ${r.o2.toFixed(1)} L，但速率跟不上，不适合作供氧器。`, 'warn');
          return;
        }
        api.say(`产生氧气约 <b>${r.o2.toFixed(1)} L</b>。<br>
          计算：${s.V} mL ${s.c}% 双氧水含 H₂O₂ ${r.m.toFixed(1)} g，
          即 ${r.n.toFixed(3)} mol，按 2H₂O₂ =MnO₂= 2H₂O + O₂↑ 得 O₂ ${(r.n / 2).toFixed(3)} mol，
          换算体积 ${r.o2.toFixed(1)} L。<br>
          按每分钟 2 L 的吸氧流量，可用 <b>${r.min.toFixed(0)} 分钟</b>。`, 'ok');
        api.conclude('供氧器的设计要点', [
          '原理：<b>2H₂O₂ =MnO₂= 2H₂O + O₂↑</b>，常温、可控，副产物只有水。',
          '三段式：<b>发生</b>（分液漏斗控制滴速）→ <b>净化</b>（洗去液沫）→ <b>输出</b>（流量计、安全阀）。',
          '用量按需反推：先定流量和时长，算出总氧量，再折算双氧水浓度与体积。',
          '浓度越高产氧越快，但反应放热明显，30% 双氧水有腐蚀性，家庭场景一般用 3%–6%。',
          '实际产率低于理论值，设计时要留 20% 以上余量；装置必须留排气口，不能完全密闭。'
        ]);
      },
      reset(s, api) {
        s.made = false; api.clearConcl(); api.say('已重置。');
      }
    },
    hud(s) {
      const r = calc(s);
      return [
        { label: 'H₂O₂ 质量', value: r.m.toFixed(1) + ' g' },
        { label: '理论产氧', value: r.o2.toFixed(1) + ' L', hi: s.made },
        { label: '可供氧', value: r.min.toFixed(0) + ' min' },
        { label: '速率', value: s.cat ? (s.made ? '正常' : '待启动') : '极慢' }
      ];
    }
  });

  function calc(s) {
    const m = s.V * (s.c / 100);          // 密度按 1 g/mL
    const n = m / 34;
    const o2 = n / 2 * 24;
    return { m, n, o2, min: o2 / 2 };
  }
})();

/* ---------------- K03 绿色化学制氧原理（跨学科实践3） ---------------- */
(function () {
  const ROUTES = {
    kmno4: { n: '加热高锰酸钾', eq: '2KMnO₄ =△= K₂MnO₄ + MnO₂ + O₂↑', M: 158, per: 2, o2: 1,
             oMass: 128, waste: '锰酸钾、二氧化锰固体', heat: true, danger: '较低' },
    kclo3: { n: '氯酸钾 + MnO₂', eq: '2KClO₃ =MnO₂/加热= 2KCl + 3O₂↑', M: 122.5, per: 2, o2: 3,
             oMass: 96, waste: '氯化钾固体', heat: true, danger: '较高（受热易爆）' },
    h2o2:  { n: '过氧化氢 + MnO₂', eq: '2H₂O₂ =MnO₂= 2H₂O + O₂↑', M: 34, per: 2, o2: 1,
             oMass: 64, waste: '只有水', heat: false, danger: '低' }
  };

  window.EXPERIMENTS.push({
    id: 'k03', code: 'K03', title: '基于绿色化学选择制氧原理',
    book: '上册', unit: '第五单元 定量研究化学反应', kind: '跨学科实践',
    opening: '同样制 1 L 氧气，三条路线各要多少原料、产生多少废物？',
    stageNote: '气体按 22.4 L/mol（标准状况）折算；原子利用率 = 进入 O₂ 的氧 ÷ 原料中的氧',
    init: () => ({ V: 1, pick: 'h2o2' }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="三种制氧原理对比">
      <text x="230" y="30" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">同样制 1 L O₂，三条路线对比</text>
      <g id="rows"></g>
    </svg>`,
    draw(s, el) {
      const rows = Object.keys(ROUTES).map((k, i) => {
        const r = ROUTES[k];
        const need = s.V / 22.4 / r.o2 * r.per * r.M;
        const atom = r.o2 * 32 / r.oMass * 100;
        const y = 56 + i * 108;
        const on = s.pick === k;
        return `<g>
          <rect x="18" y="${y}" width="424" height="96" rx="6"
                fill="${on ? 'var(--accent-bg)' : 'var(--paper-2)'}"
                stroke="${on ? 'var(--accent)' : 'var(--line)'}" stroke-width="1.2"/>
          <text x="34" y="${y + 24}" font-size="13" font-weight="700" fill="var(--ink)"
                font-family="var(--f-sans)">${r.n}</text>
          <text x="34" y="${y + 46}" font-size="10.5" fill="var(--muted)"
                font-family="var(--f-mono)">${r.eq}</text>
          <text x="34" y="${y + 70}" font-size="10.5" fill="var(--ink-2)" font-family="var(--f-sans)">
            需原料 <tspan font-family="var(--f-num)" fill="var(--accent)">${need.toFixed(1)}</tspan> g
            · 原子利用率 <tspan font-family="var(--f-num)">${atom.toFixed(0)}</tspan>%
            · ${r.heat ? '需加热' : '常温'}
          </text>
          <text x="34" y="${y + 88}" font-size="10" fill="var(--muted)" font-family="var(--f-sans)">
            副产物：${r.waste}　危险性：${r.danger}
          </text>
        </g>`;
      }).join('');
      el.querySelector('#rows').innerHTML = rows;
    },
    controls(s) {
      return [{
        type: 'range', id: 'V', label: '① 需要氧气体积', min: 1, max: 10, step: 1, unit: ' L',
        get: st => st.V, set: (st, v) => { st.V = v; }
      }, {
        type: 'opts', id: 'pick', label: '② 选一条路线看评价',
        options: Object.keys(ROUTES).map(k => ({ v: k, t: ROUTES[k].n })),
        get: st => st.pick, pick: (st, v) => { st.pick = v; }
      }];
    },
    actLabels: { judge: '给出评价', reset: '重置' },
    secondary: ['reset'],
    actions: {
      judge(s, api) {
        const r = ROUTES[s.pick];
        const need = s.V / 22.4 / r.o2 * r.per * r.M;
        const atom = r.o2 * 32 / r.oMass * 100;
        const txt = {
          kmno4: `制 ${s.V} L O₂ 需高锰酸钾 ${need.toFixed(1)} g，原子利用率仅 ${atom.toFixed(0)}%，还要加热，副产物是两种固体废物。`,
          kclo3: `制 ${s.V} L O₂ 需氯酸钾 ${need.toFixed(1)} g，氧原子利用率 ${atom.toFixed(0)}%（全部氧都进 O₂），但要加热，氯酸钾受热有爆炸风险。`,
          h2o2: `制 ${s.V} L O₂ 需 H₂O₂ ${need.toFixed(1)} g（折合 30% 双氧水 ${(need / 0.3).toFixed(0)} g），原子利用率 ${atom.toFixed(0)}%，常温、副产物只有水。`
        }[s.pick];
        api.say(txt, 'ok');
        api.conclude('绿色化学视角下的选择', [
          '<b>原子利用率</b>：KClO₃ 100% > H₂O₂ 50% > KMnO₄ 25%。',
          '<b>但原子利用率不是唯一指标</b>：KClO₃ 要加热、有爆炸风险，KCl 仍是固体废物。',
          'H₂O₂ 虽然只有一半氧变成 O₂，但<b>常温进行、副产物只有水</b>、操作最安全，综合最绿色。',
          '绿色化学的三条判据：<b>原子利用率高、副产物无害、能耗低</b>，要一起看。',
          '所以实验室制氧首选 <b>2H₂O₂ =MnO₂= 2H₂O + O₂↑</b>。'
        ]);
      },
      reset(s, api) { api.clearConcl(); api.say('已重置。'); }
    },
    hud(s) {
      const r = ROUTES[s.pick];
      const need = s.V / 22.4 / r.o2 * r.per * r.M;
      return [
        { label: '路线', value: r.n },
        { label: '原料', value: need.toFixed(1) + ' g' },
        { label: '原子利用率', value: (r.o2 * 32 / r.oMass * 100).toFixed(0) + '%' },
        { label: '能耗', value: r.heat ? '需加热' : '常温', hi: !r.heat }
      ];
    }
  });
})();

/* ---------------- K04 碳中和行动方案（跨学科实践4） ---------------- */
(function () {
  /* 排放因子：电 0.581 kg/kWh（全国电网平均），天然气 2.16 kg/m³，汽油 2.3 kg/L */
  const F = { e: 0.581, g: 2.16, p: 2.3 };
  const TREE = 18;   // 一棵树一年约吸收 18 kg CO₂

  window.EXPERIMENTS.push({
    id: 'k04', code: 'K04', title: '设计家庭低碳行动方案',
    book: '上册', unit: '第六单元 控制燃烧', kind: '跨学科实践',
    opening: '填一填家里的用电、燃气和用车，看一年排多少碳、怎么减。',
    stageNote: '排放因子取全国平均值，仅作估算；各地电网、气源不同，结果会有差异',
    init: () => ({ e: 200, g: 15, p: 40, plan: {} }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="家庭碳足迹">
      <text x="230" y="30" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">一个月的排放，折算成一年的账</text>

      <g transform="translate(120,64)">
        <circle cx="80" cy="80" r="62" fill="none" stroke="var(--line)" stroke-width="12"/>
        <circle id="arc" cx="80" cy="80" r="62" fill="none" stroke="var(--accent)" stroke-width="12"
                stroke-linecap="round" stroke-dasharray="0 390" transform="rotate(-90 80 80)"/>
        <text id="big" x="80" y="80" font-size="30" fill="var(--ink)" text-anchor="middle"
              font-family="var(--f-num)">0</text>
        <text x="80" y="100" font-size="10" fill="var(--muted)" text-anchor="middle"
              font-family="var(--f-sans)">kg CO₂ / 月</text>
      </g>

      <g id="bars" transform="translate(268,72)"></g>

      <text id="treeTxt" x="230" y="300" font-size="12" fill="var(--ink-2)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
      <text id="planTxt" x="230" y="330" font-size="11.5" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
      <text id="cutTxt" x="230" y="362" font-size="12" fill="var(--accent)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
    </svg>`,
    draw(s, el) {
      const r = calc(s);
      el.querySelector('#big').textContent = r.month.toFixed(0);
      const frac = Math.min(1, r.month / 400);
      el.querySelector('#arc').setAttribute('stroke-dasharray', `${frac * 390} 390`);

      const items = [
        ['用电', r.e], ['燃气', r.g], ['用车', r.p]
      ];
      const max = Math.max(...items.map(x => x[1]), 1);
      el.querySelector('#bars').innerHTML = items.map(([n, v], i) => {
        const h = 100 * v / max;
        return `<g transform="translate(${i * 58},0)">
          <rect x="0" y="${120 - h}" width="34" height="${h}" rx="2" fill="var(--accent)" opacity=".${8 - i * 2}"/>
          <text x="17" y="${112 - h}" font-size="10.5" fill="var(--ink)" text-anchor="middle"
                font-family="var(--f-num)">${v.toFixed(0)}</text>
          <text x="17" y="136" font-size="10" fill="var(--muted)" text-anchor="middle"
                font-family="var(--f-sans)">${n}</text>
        </g>`;
      }).join('');

      el.querySelector('#treeTxt').textContent =
        `一年约 ${(r.year / 1000).toFixed(1)} t CO₂，相当于 ${Math.ceil(r.year / TREE)} 棵树一年的吸收量`;
      const cut = r.cut;
      el.querySelector('#planTxt').textContent = Object.keys(s.plan).length
        ? `已选 ${Object.keys(s.plan).length} 项措施，每月可减 ${cut.toFixed(0)} kg`
        : '左侧勾选减排措施，看能减多少';
      el.querySelector('#cutTxt').textContent = cut > 0
        ? `减排 ${(cut / r.month * 100).toFixed(0)}% ｜ 一年少排 ${(cut * 12 / 1000).toFixed(2)} t`
        : '';
    },
    controls(s) {
      return [{
        type: 'range', id: 'e', label: '① 月用电量', min: 50, max: 600, step: 10, unit: ' kW·h',
        get: st => st.e, set: (st, v) => { st.e = v; }
      }, {
        type: 'range', id: 'g', label: '② 月天然气', min: 0, max: 60, step: 1, unit: ' m³',
        get: st => st.g, set: (st, v) => { st.g = v; }
      }, {
        type: 'range', id: 'p', label: '③ 月汽油', min: 0, max: 200, step: 5, unit: ' L',
        get: st => st.p, set: (st, v) => { st.p = v; }
      }, {
        type: 'opts', id: 'plan', label: '④ 选减排措施',
        options: [
          { v: 'led', t: '全换 LED 灯（省电 10%）' },
          { v: 'ac', t: '空调调高 1 ℃（省电 15%）' },
          { v: 'bus', t: '每周少开一天车（省油 30%）' },
          { v: 'solar', t: '装光伏（抵 30% 用电）' }
        ],
        get: st => null,
        pick: (st, v) => { st.plan[v] = !st.plan[v]; },
        state: (st, o) => st.plan[o.v] ? 'on' : ''
      }];
    },
    actLabels: { report: '生成方案', reset: '重置' },
    secondary: ['reset'],
    actions: {
      report(s, api) {
        const r = calc(s);
        api.say(`当前每月排放 <b>${r.month.toFixed(0)} kg</b>，一年 ${(r.year / 1000).toFixed(2)} t。<br>
          选中的措施每月可减 ${r.cut.toFixed(0)} kg，减排 ${(r.cut / r.month * 100).toFixed(0)}%。`, 'ok');
        api.conclude('一份可执行的低碳方案', [
          `<b>基线</b>：月排放 ${r.month.toFixed(0)} kg（用电 ${r.e.toFixed(0)} + 燃气 ${r.g.toFixed(0)} + 用车 ${r.p.toFixed(0)}）。`,
          '<b>算账</b>：电 0.581 kg/kWh、天然气 2.16 kg/m³、汽油 2.3 kg/L —— 有数字才能定目标。',
          '<b>措施</b>：换 LED、空调 26 ℃、少开一天车、光伏，优先做"省钱又减碳"的。',
          '<b>监测</b>：每月抄一次电表气表，和基线比，方案才不是口号。',
          '化学视角：<b>C + O₂ =点燃= CO₂</b>、<b>CH₄ + 2O₂ =点燃= CO₂ + 2H₂O</b>，烧多少碳排多少碳。',
          '碳中和不是"不排放"，而是排放与吸收相抵；植树是抵消，减排才是根本。'
        ]);
      },
      reset(s, api) {
        s.plan = {}; api.clearConcl(); api.say('已重置。');
      }
    },
    hud(s) {
      const r = calc(s);
      return [
        { label: '月排放', value: r.month.toFixed(0) + ' kg' },
        { label: '年排放', value: (r.year / 1000).toFixed(2) + ' t' },
        { label: '需植树', value: Math.ceil(r.year / TREE) + ' 棵' },
        { label: '可减排', value: r.cut > 0 ? r.cut.toFixed(0) + ' kg/月' : '—', hi: r.cut > 0 }
      ];
    }
  });

  function calc(s) {
    const e = s.e * F.e, g = s.g * F.g, p = s.p * F.p;
    let cut = 0;
    if (s.plan.led) cut += e * 0.10;
    if (s.plan.ac) cut += e * 0.15;
    if (s.plan.bus) cut += p * 0.30;
    if (s.plan.solar) cut += e * 0.30;
    return { e, g, p, month: e + g + p, year: (e + g + p) * 12, cut };
  }
})();

/* ---------------- K05 土壤酸碱性（跨学科实践5） ---------------- */
(function () {
  const PLANTS = [
    { n: '茶树', lo: 5.0, hi: 5.5 }, { n: '水稻', lo: 6.0, hi: 7.0 },
    { n: '小麦', lo: 6.0, hi: 7.5 }, { n: '棉花', lo: 6.0, hi: 8.0 }
  ];

  window.EXPERIMENTS.push({
    id: 'k05', code: 'K05', title: '探究土壤酸碱性对植物生长的影响',
    book: '下册', unit: '第七单元 常见的酸和碱', kind: '跨学科实践',
    opening: '取一份土样测 pH，判断适合种什么，再算要撒多少熟石灰。',
    stageNote: '熟石灰用量按耕层 20 cm、每平方米提高 0.5 个 pH 约需 50 g 估算，实际应测土配方',
    init: () => ({ ph: 5.2, area: 20, lime: 0 }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="土壤酸碱性">
      <text x="230" y="30" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">土样浸出液 → pH 试纸 → 改良</text>

      <!-- pH 比色卡 -->
      <g transform="translate(52,64)">
        <text x="0" y="0" font-size="10.5" fill="var(--muted)" font-family="var(--f-sans)">pH 比色卡</text>
        <g id="scale"></g>
        <path id="marker" d="M0 0 l-5 -8 l10 0 Z" fill="var(--ink)" transform="translate(0,42)"/>
      </g>

      <!-- 土样 + 烧杯 -->
      <g transform="translate(180,86)">
        <path d="M26 0 h96 l-8 18 v78 a10 10 0 0 1 -10 10 h-60 a10 10 0 0 1 -10 -10 V18 Z"
              fill="var(--paper-2)" fill-opacity=".55" stroke="var(--ink)" stroke-width="1.7"/>
        <rect x="34" y="66" width="80" height="38" fill="rgba(140,110,76,.55)"/>
        <line x1="34" y1="66" x2="114" y2="66" stroke="#8c6e4c" stroke-width="2"/>
        <text x="74" y="126" font-size="9.5" fill="var(--muted)" text-anchor="middle"
              font-family="var(--f-sans)">土壤浸出液</text>
      </g>

      <!-- 改良：撒石灰 -->
      <g id="limeG" transform="translate(320,100)" opacity="0">
        <path d="M0 8 q10 -14 20 0 q10 -14 20 0" fill="none" stroke="var(--ink)" stroke-width="1.4"/>
        <g id="limeDots"></g>
        <text x="20" y="58" font-size="9.5" fill="var(--muted)" text-anchor="middle"
              font-family="var(--f-sans)">熟石灰</text>
      </g>

      <text id="fitTxt" x="230" y="286" font-size="12" fill="var(--ink-2)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
      <text id="needTxt" x="230" y="316" font-size="12" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
      <text id="afterTxt" x="230" y="348" font-size="13" fill="var(--accent)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
    </svg>`,
    draw(s, el) {
      const COLORS = ['#c0392b', '#cf5a3a', '#d97b3c', '#d9a13c', '#c9c23c', '#8fbc4a', '#4fa86a',
        '#3f9b8e', '#3d84a8', '#3f65a8', '#5b4fa8', '#6f4a9b', '#7d3f8b', '#8b3a6b'];
      el.querySelector('#scale').innerHTML = COLORS.map((c, i) =>
        `<rect x="${i * 20}" y="8" width="20" height="26" fill="${c}"/>
         <text x="${i * 20 + 10}" y="48" font-size="9" fill="var(--muted)" text-anchor="middle"
               font-family="var(--f-num)">${i + 1}</text>`).join('');
      const pos = (Math.min(14, Math.max(1, s.ph)) - 1) * 20 + 10;
      el.querySelector('#marker').setAttribute('transform', `translate(${pos},42)`);

      const fit = PLANTS.filter(p => s.ph >= p.lo && s.ph <= p.hi).map(p => p.n);
      el.querySelector('#fitTxt').textContent = fit.length
        ? `适合种：${fit.join('、')}` : '这个 pH 下多数作物长不好';

      const need = limeNeed(s);
      el.querySelector('#needTxt').textContent = need > 0
        ? `${s.area} m² 需熟石灰约 ${need.toFixed(2)} kg`
        : 'pH 已在中性附近，不必撒石灰';

      el.querySelector('#limeG').setAttribute('opacity', need > 0 ? 1 : 0);
      el.querySelector('#limeDots').innerHTML = need > 0
        ? Array.from({ length: Math.min(14, Math.round(need * 20)) }, (_, i) =>
          `<circle cx="${4 + (i * 13) % 40}" cy="${16 + (i * 17) % 24}" r="1.6"
             fill="#f2f0e8" stroke="#b9b2a4" stroke-width=".6"/>`).join('')
        : '';

      el.querySelector('#afterTxt').textContent = need > 0
        ? `撒后 pH 约升到 ${(s.ph + 0.5).toFixed(1)}`
        : '';
    },
    controls(s) {
      return [{
        type: 'range', id: 'ph', label: '① 土样 pH', min: 4, max: 9, step: 0.1,
        get: st => st.ph, set: (st, v) => { st.ph = v; }
      }, {
        type: 'range', id: 'area', label: '② 改良面积', min: 5, max: 100, step: 5, unit: ' m²',
        get: st => st.area, set: (st, v) => { st.area = v; }
      }];
    },
    actLabels: { apply: '撒熟石灰并翻耕', reset: '重置' },
    secondary: ['reset'],
    actions: {
      apply(s, api) {
        const need = limeNeed(s);
        if (need <= 0) {
          api.say('pH 已经在 6.5 以上，再撒石灰会把土壤变碱，反而影响作物吸收养分。', 'warn');
          return;
        }
        s.ph = Math.min(8.5, s.ph + 0.5);
        api.say(`撒下 ${need.toFixed(2)} kg 熟石灰，翻耕混匀。<br>
          Ca(OH)₂ 中和土壤中的酸，pH 从 ${(s.ph - 0.5).toFixed(1)} 升到 ${s.ph.toFixed(1)}。<br>
          注意：一次不要超过 0.5 个 pH，隔两周再测一次。`, 'ok');
        api.conclude('测土 — 判断 — 改良', [
          '<b>测定</b>：梅花形取 5 点土样，风干研碎，加蒸馏水（土水比 1:2.5）振荡，静置后取<b>上层清液</b>测 pH。',
          '<b>判断</b>：茶树喜酸（5.0–5.5），水稻 6.0–7.0，小麦 6.0–7.5，棉花 6.0–8.0。',
          '<b>改良</b>：酸性土撒<b>熟石灰 Ca(OH)₂</b> 或石灰石粉；碱性土施有机肥、石膏。',
          '用量按面积和 pH 缺口算，<b>一次不超过 0.5 个 pH</b>，过量会使土壤板结、养分被固定。',
          '易错：pH 试纸不能直接插进湿土，必须测浸出液；也不能用蒸馏水润湿试纸。'
        ]);
      },
      reset(s, api) {
        s.ph = 5.2; api.clearConcl(); api.say('已重置。');
      }
    },
    hud(s) {
      const need = limeNeed(s);
      return [
        { label: 'pH', value: s.ph.toFixed(1), hi: s.ph < 6 },
        { label: '酸碱性', value: s.ph < 6.5 ? '酸性' : s.ph > 7.5 ? '碱性' : '中性' },
        { label: '熟石灰', value: need > 0 ? need.toFixed(2) + ' kg' : '不需要' },
        { label: '适种', value: PLANTS.filter(p => s.ph >= p.lo && s.ph <= p.hi).length + ' 类' }
      ];
    }
  });

  function limeNeed(s) {
    if (s.ph >= 6.5) return 0;
    const d = Math.min(1.5, 6.5 - s.ph);       // 最多一次调 1.5
    return s.area * 50 * d / 0.5 / 1000;       // kg
  }
})();
