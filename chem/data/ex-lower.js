/* ============================================================
   实验数据 · 下册（8 个）
   ============================================================ */
window.EXPERIMENTS = window.EXPERIMENTS || [];

/* ---------------- D7-01 酸碱指示剂 ---------------- */
(function () {
  const SOLS = [
    { id: 'hcl', n: '稀盐酸', k: 'acid', litmus: '#c0392b', phenol: 'rgba(200,220,235,.20)', pt: '不变色' },
    { id: 'h2so4', n: '稀硫酸', k: 'acid', litmus: '#c0392b', phenol: 'rgba(200,220,235,.20)', pt: '不变色' },
    { id: 'naoh', n: '氢氧化钠溶液', k: 'base', litmus: '#2f6fa8', phenol: 'rgba(200,52,98,.62)', pt: '变红' },
    { id: 'caoh', n: '氢氧化钙溶液', k: 'base', litmus: '#2f6fa8', phenol: 'rgba(200,52,98,.62)', pt: '变红' },
    { id: 'nacl', n: '氯化钠溶液', k: 'neutral', litmus: '#6b5fa8', phenol: 'rgba(200,220,235,.20)', pt: '不变色' },
    { id: 'water', n: '蒸馏水', k: 'neutral', litmus: '#6b5fa8', phenol: 'rgba(200,220,235,.20)', pt: '不变色' }
  ];

  window.EXPERIMENTS.push({
    id: 'd7-01', code: 'D7-01', title: '酸碱指示剂',
    book: '下册', unit: '第七单元 常见的酸和碱', kind: '教材演示',
    opening: '选一种溶液，分别滴加紫色石蕊和无色酚酞，比较颜色变化。',
    stageNote: '石蕊：遇酸变红、遇碱变蓝；酚酞：遇碱变红、遇酸不变色',
    init: () => ({ sol: 'hcl', litmus: false, phenol: false, tried: {} }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="酸碱指示剂">
      <g id="tubes"></g>
      <text id="solName" x="230" y="366" font-size="12" fill="var(--ink)" text-anchor="middle"
            font-weight="700" font-family="var(--f-sans)">稀盐酸</text>
      <text id="solKind" x="230" y="384" font-size="10.5" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
    </svg>`,
    draw(s, el) {
      const sol = SOLS.find(x => x.id === s.sol);
      const box = el.querySelector('#tubes');
      const litColor = s.litmus ? sol.litmus : '#8c7fb8';
      const phColor = s.phenol ? sol.phenol : 'rgba(200,220,235,.20)';
      box.innerHTML = `
        <g transform="translate(96,90)">
          ${Parts.tube({ x: 0, y: 0, h: 210, w: 44, fill: litColor, level: s.litmus ? .62 : .55 })}
          <text x="22" y="234" font-size="11" fill="var(--muted)" text-anchor="middle"
                font-family="var(--f-sans)">紫色石蕊</text>
          <text x="22" y="252" font-size="10.5" fill="var(--ink)" text-anchor="middle"
                font-family="var(--f-sans)">${s.litmus ? (sol.k === 'acid' ? '变红' : sol.k === 'base' ? '变蓝' : '仍紫') : '—'}</text>
        </g>
        <g transform="translate(236,90)">
          ${Parts.tube({ x: 0, y: 0, h: 210, w: 44, fill: phColor, level: .55 })}
          <text x="22" y="234" font-size="11" fill="var(--muted)" text-anchor="middle"
                font-family="var(--f-sans)">无色酚酞</text>
          <text x="22" y="252" font-size="10.5" fill="var(--ink)" text-anchor="middle"
                font-family="var(--f-sans)">${s.phenol ? sol.pt : '—'}</text>
        </g>
        <g transform="translate(160,40)">
          ${Parts.dropper({ x: 0, y: 0, h: 56, color: '#b11226' })}
        </g>`;
      el.querySelector('#solName').textContent = sol.n;
      el.querySelector('#solKind').textContent =
        sol.k === 'acid' ? '酸性溶液' : sol.k === 'base' ? '碱性溶液' : '中性溶液';
    },
    controls(s) {
      return [
        { type: 'opts', id: 'sol', label: '① 选择溶液', options: SOLS.map(x => ({ v: x.id, t: x.n })),
          get: st => st.sol, pick: (st, v) => { st.sol = v; st.litmus = false; st.phenol = false; },
          state: (st, o) => st.sol === o.v ? 'on' : '' },
        { type: 'opts', id: 'drop', label: '② 滴加指示剂（可各滴一次）', options: [
            { v: 'litmus', t: '滴加紫色石蕊' }, { v: 'phenol', t: '滴加无色酚酞' }],
          get: () => null, pick: (st, v) => { if (v === 'litmus') st.litmus = true; else st.phenol = true; },
          state: (st, o) => (o.v === 'litmus' ? st.litmus : st.phenol) ? 'ok' : '' }
      ];
    },
    onChange(id, v, s, api) {
      if (id !== 'drop') return;
      const sol = SOLS.find(x => x.id === s.sol);
      if (v === 'litmus') {
        api.say(sol.k === 'acid' ? '紫色石蕊遇酸<b>变红</b>。'
          : sol.k === 'base' ? '紫色石蕊遇碱<b>变蓝</b>。'
          : '中性溶液不能使紫色石蕊变色，仍是紫色。',
          sol.k === 'neutral' ? 'warn' : 'ok');
      } else {
        api.say(sol.k === 'base' ? '无色酚酞遇碱<b>变红</b>。'
          : '无色酚酞遇酸或中性溶液<b>不变色</b>，仍是无色。',
          sol.k === 'base' ? 'ok' : 'warn');
      }
      if (s.litmus && s.phenol) {
        api.conclude('两种指示剂的颜色规律', [
          '紫色石蕊：遇酸<b>变红</b>，遇碱<b>变蓝</b>，中性仍为紫色。',
          '无色酚酞：遇碱<b>变红</b>，遇酸和中性<b>不变色</b>。',
          '指示剂只能判断酸碱性，<b>不能</b>测出酸碱度（pH）。',
          '酚酞不变色不等于溶液一定呈酸性 —— 中性溶液也不变色。'
        ]);
      }
    },
    hud(s) {
      const sol = SOLS.find(x => x.id === s.sol);
      return [
        { label: '溶液', value: sol.n },
        { label: '酸碱性', value: sol.k === 'acid' ? '酸性' : sol.k === 'base' ? '碱性' : '中性' },
        { label: '已滴加', value: `${(s.litmus ? 1 : 0) + (s.phenol ? 1 : 0)}/2` }
      ];
    }
  });
})();

/* ---------------- D7-02 pH 试纸 ---------------- */
(function () {
  const SOLS = [
    { id: 'hcl', n: '稀盐酸', ph: 1, color: '#c0392b' },
    { id: 'hac', n: '食醋', ph: 3, color: '#d4693f' },
    { id: 'water', n: '蒸馏水', ph: 7, color: '#8aa86a' },
    { id: 'nahco3', n: '碳酸氢钠溶液', ph: 8, color: '#4f8f8a' },
    { id: 'naoh', n: '氢氧化钠溶液', ph: 13, color: '#2a4f8f' }
  ];
  const COLORS = ['#c0392b', '#c95a35', '#d4693f', '#cf8a3c', '#c8a63c', '#9ab04a',
    '#8aa86a', '#5f9f76', '#4f8f8a', '#48789a', '#3f62a0', '#35508f', '#2a4f8f', '#22406f'];

  window.EXPERIMENTS.push({
    id: 'd7-02', code: 'D7-02', title: '溶液酸碱度的检验',
    book: '下册', unit: '第七单元 常见的酸和碱', kind: '教材演示',
    opening: '用玻璃棒蘸取溶液滴在 pH 试纸上，与标准比色卡对照读数。',
    stageNote: 'pH < 7 酸性，pH = 7 中性，pH > 7 碱性；试纸不能先用水润湿',
    init: () => ({ sol: 'hcl', wet: false, tested: false, ph: null }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="pH 试纸">
      <g transform="translate(50,60)">
        <text x="0" y="0" font-size="10.5" fill="var(--muted)" font-family="var(--f-sans)">标准比色卡</text>
        <g id="card"></g>
      </g>
      <g transform="translate(120,246)">
        <rect x="0" y="0" width="220" height="76" rx="4" fill="var(--paper-2)"
              stroke="var(--ink)" stroke-width="1.5"/>
        <rect id="paper" x="20" y="16" width="180" height="44" rx="2" fill="#e8e2d2"
              stroke="var(--ink)" stroke-width="1"/>
        <text x="110" y="92" font-size="10.5" fill="var(--faint)" text-anchor="middle"
              font-family="var(--f-sans)">pH 试纸</text>
      </g>
      <g transform="translate(60,150)">
        ${''}
      </g>
      <text id="readTxt" x="230" y="374" font-size="12" fill="var(--ink)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
    </svg>`,
    draw(s, el) {
      const card = el.querySelector('#card');
      if (!card.children.length) {
        card.innerHTML = COLORS.map((c, i) => `
          <rect x="${i * 26}" y="10" width="24" height="22" fill="${c}" stroke="var(--paper-2)" stroke-width="1"/>
          <text x="${i * 26 + 12}" y="46" font-size="8.5" fill="var(--muted)" text-anchor="middle"
                font-family="var(--f-mono)">${i + 1}</text>`).join('');
      }
      const sol = SOLS.find(x => x.id === s.sol);
      const p = el.querySelector('#paper');
      if (!s.tested) {
        p.setAttribute('fill', '#e8e2d2');
      } else {
        const c = COLORS[Math.min(13, Math.max(0, Math.round(s.ph) - 1))];
        p.setAttribute('fill', s.wet ? '#d9d3c2' : c);
        p.setAttribute('opacity', s.wet ? .5 : 1);
      }
      const t = el.querySelector('#readTxt');
      if (!s.tested) t.textContent = `待测：${sol.n}`;
      else if (s.wet) t.textContent = '试纸被水润湿，读数偏低，不准';
      else t.textContent = `测得 pH ≈ ${Math.round(s.ph)}`;
      t.setAttribute('fill', s.tested && s.wet ? 'var(--bad)' : 'var(--ink)');
    },
    controls(s) {
      return [
        { type: 'opts', id: 'sol', label: '① 选择待测溶液', options: SOLS.map(x => ({ v: x.id, t: x.n })),
          get: st => st.sol, pick: (st, v) => { st.sol = v; st.tested = false; },
          state: (st, o) => st.sol === o.v ? 'on' : '' },
        { type: 'seg', id: 'wet', label: '② 试纸是否润湿', options: [
            { v: 'dry', t: '干燥' }, { v: 'wet', t: '用水润湿' }],
          get: st => st.wet ? 'wet' : 'dry', set: (st, v) => { st.wet = v === 'wet'; st.tested = false; } }
      ];
    },
    actLabels: { test: '蘸取试液并比色' },
    actions: {
      test(s, api) {
        const sol = SOLS.find(x => x.id === s.sol);
        s.tested = true;
        s.ph = s.wet
          ? (sol.ph < 7 ? Math.min(7, sol.ph + 2.5) : Math.max(7, sol.ph - 2.5))
          : sol.ph;
        if (s.wet) {
          api.say(`试纸<b>先用水润湿</b>了 —— 相当于把溶液稀释了，酸性变弱、碱性也变弱，读数会偏向 7。测得 pH ≈ ${Math.round(s.ph)}，真实值是 ${sol.ph}。`, 'bad');
        } else {
          api.say(`测得 pH ≈ ${sol.ph}，${sol.ph < 7 ? '酸性' : sol.ph === 7 ? '中性' : '碱性'}。`, 'ok');
          api.conclude('pH 的正确用法', [
            '用<b>玻璃棒蘸取</b>待测液滴在试纸上，不能把试纸伸进待测液。',
            '试纸<b>不能先用水润湿</b> —— 会稀释溶液，使酸性偏弱、碱性偏弱。',
            '读数只能读到<b>整数</b>，pH 试纸测不出 7.2 这种精度。',
            'pH 越小酸性越强，pH 越大碱性越强；pH = 7 为中性。'
          ]);
        }
      }
    },
    hud(s) {
      const sol = SOLS.find(x => x.id === s.sol);
      return [
        { label: '溶液', value: sol.n },
        { label: '真实 pH', value: s.tested ? String(sol.ph) : '—' },
        { label: '测得 pH', value: s.tested ? '≈' + Math.round(s.ph) : '—', hi: s.tested && s.wet }
      ];
    }
  });
})();

/* ---------------- D7-03 中和反应 ---------------- */
(function () {
  const M = { naoh: 40, hcl: 36.5 };
  const yOf = v => 300 - v * 1.1;

  window.EXPERIMENTS.push({
    id: 'd7-03', code: 'D7-03', title: '中和反应',
    book: '下册', unit: '第七单元 常见的酸和碱', kind: '教材演示',
    opening: '先投料，再滴酚酞，然后逐滴加盐酸，直到红色恰好褪去。',
    stageNote: '液面按 1 g/mL 示意，不表示真实密度；数值为教学模型参数',
    init: () => ({ fed: false, naoh: 0.5, pct: 2, dropG: 0.5, phenol: false, acid: 0, vad: 0, done: false }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="中和反应">
      <defs>
        <clipPath id="flaskClip">
          <path d="M20 2 v38 L-12 184 a18 18 0 0 0 16 20 h128 a18 18 0 0 0 16 -20 L116 40 V2 Z"/>
        </clipPath>
      </defs>
      <g transform="translate(150,90)">
        <g clip-path="url(#flaskClip)">
          <rect id="liq" x="-30" y="204" width="180" height="0" fill="rgba(200,220,235,.25)"/>
          <line id="liqTop" x1="-30" y1="204" x2="150" y2="204" stroke="#9fc9de" stroke-width="2.2" opacity="0"/>
        </g>
        <path d="M22 0 v40 L-14 186 a18 18 0 0 0 16 22 h132 a18 18 0 0 0 16 -22 L114 40 V0"
              fill="none" fill-opacity="0" stroke="var(--ink)" stroke-width="1.9"/>
        <line x1="14" y1="0" x2="122" y2="0" stroke="var(--ink)" stroke-width="2.6" stroke-linecap="round"/>
        <text x="60" y="232" font-size="10.5" fill="var(--faint)" text-anchor="middle"
              font-family="var(--f-sans)">锥形瓶</text>
      </g>
      <g id="dropA" transform="translate(196,48)">
        <rect x="-4" y="0" width="8" height="26" rx="3" fill="var(--paper-3)" stroke="var(--ink)" stroke-width="1.4"/>
        <rect x="-2.5" y="26" width="5" height="26" fill="var(--paper-2)" stroke="var(--ink)" stroke-width="1.3"/>
        <path d="M-2.5 52 L0 72 L2.5 52" fill="none" stroke="var(--ink)" stroke-width="1.3"/>
        <text x="0" y="-8" font-size="10" fill="var(--muted)" text-anchor="middle"
              font-family="var(--f-sans)">酚酞</text>
      </g>
      <g id="dropB" transform="translate(268,48)">
        <rect x="-4" y="0" width="8" height="26" rx="3" fill="var(--paper-3)" stroke="var(--ink)" stroke-width="1.4"/>
        <rect x="-2.5" y="26" width="5" height="26" fill="var(--paper-2)" stroke="var(--ink)" stroke-width="1.3"/>
        <path d="M-2.5 52 L0 72 L2.5 52" fill="none" stroke="var(--ink)" stroke-width="1.3"/>
        <text x="0" y="-8" font-size="10" fill="var(--muted)" text-anchor="middle"
              font-family="var(--f-sans)">盐酸</text>
      </g>
      <circle id="dot" cx="196" cy="126" r="2.6" fill="#4e93b8" opacity="0"/>
      <text id="phTxt" x="230" y="378" font-size="12" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
    </svg>`,
    draw(s, el) {
      const m = calc(s);
      const base = 204;
      const h = s.fed ? Math.min(112, 34 + m.vol * 1.15) : 0;
      const liq = el.querySelector('#liq');
      liq.setAttribute('height', h);
      liq.setAttribute('y', base - h);
      const red = s.phenol && m.ohLeft > 0.0004;
      liq.setAttribute('fill', red ? 'rgba(200,52,98,.6)' : 'rgba(198,226,244,.34)');
      const top = el.querySelector('#liqTop');
      top.setAttribute('y1', base - h); top.setAttribute('y2', base - h);
      top.setAttribute('opacity', h > 2 ? .9 : 0);
      top.setAttribute('stroke', red ? '#c8346a' : '#7fb6d6');
      el.querySelector('#phTxt').textContent = s.fed
        ? `pH ≈ ${m.pH.toFixed(1)} · ${m.pH < 7 ? '酸性' : m.pH > 7 ? '碱性' : '中性'}`
        : '尚未投料';
    },
    controls(s) {
      const list = [{
        type: 'range', id: 'naoh', label: 'NaOH 质量', min: 0.2, max: 1.2, step: 0.1, unit: ' g',
        get: st => st.naoh, set: (st, v) => { st.naoh = v; },
        disabled: s.fed, note: s.fed ? '已投料，参数已锁定' : ''
      }, {
        type: 'range', id: 'pct', label: 'NaOH 溶液浓度', min: 1, max: 5, step: 1, unit: ' %',
        get: st => st.pct, set: (st, v) => { st.pct = v; }, disabled: s.fed
      }, {
        type: 'seg', id: 'dropG', label: '滴管规格', options: [
          { v: '0.5', t: '0.5 g/滴' }, { v: '1', t: '1 g/滴' }],
        get: st => String(st.dropG), set: (st, v) => { st.dropG = +v; }, disabled: s.fed
      }];
      if (!s.fed) {
        list.push({ type: 'note', html: '投料后参数锁定，模拟真实实验。' });
      }
      return list;
    },
    actLabels: { feed: '确认投料', phenol: '滴加酚酞', acid: '滴加稀盐酸', reset: '重置' },
    actions: {
      feed(s, api) {
        if (s.fed) return;
        s.fed = true;
        const m = calc(s);
        api.say(`已投入 ${s.naoh.toFixed(1)} g NaOH，配成 ${s.pct}% 的溶液。瓶内 OH⁻ 共 <b>${m.oh0.toFixed(3)} g</b>。`, 'ok');
      },
      phenol(s, api) {
        if (!s.fed) { api.say('先投料。', 'warn'); return; }
        s.phenol = true;
        api.say('滴入酚酞，溶液变<b>红</b> —— 说明溶液呈碱性。', 'ok');
      },
      acid(s, api) {
        if (!s.fed) { api.say('先投料。滴加顺序不能颠倒。', 'warn'); return; }
        if (!s.phenol) { api.say('先滴酚酞。没有指示剂就判断不了终点。', 'warn'); return; }
        if (s.done) return;
        const before = calc(s);
        s.acid += s.dropG;
        s.vad++;
        const after = calc(s);
        if (before.pH > 8.2 && after.pH <= 8.2) {
          s.done = true;
          api.say(`红色<b>恰好褪去</b>。<br>滴之前只剩 ${before.ohLeft.toFixed(3)} g OH⁻，这一滴把它耗尽还有余，
            pH 从 ${before.pH.toFixed(1)} 直落到 ${after.pH.toFixed(1)}。<br>
            终点附近 pH 就是这么陡 —— 判终点靠指示剂，不靠 pH 试纸。`, 'ok');
          api.conclude('中和反应的实质', [
            '化学方程式：<b>NaOH + HCl = NaCl + H₂O</b>。',
            '实质：<b>H⁺ + OH⁻ = H₂O</b>，酸中的 H⁺ 与碱中的 OH⁻ 结合成水。',
            '酚酞在碱性溶液中显红色，恰好褪色时说明 OH⁻ 刚被耗尽。',
            '此时溶液中的溶质是 NaCl（还有少量水），溶液呈中性。'
          ]);
        } else if (after.pH < 4) {
          api.say(`已经明显过量，pH 降到 ${after.pH.toFixed(1)}，溶液呈酸性。多滴了 ${s.vad} 滴。`, 'warn');
        } else {
          api.say(`第 ${s.vad} 滴。剩余 OH⁻ ${after.ohLeft.toFixed(3)} g，pH ${after.pH.toFixed(1)}，还是碱性。`);
        }
      },
      reset(s, api) {
        Object.assign(s, { fed: false, phenol: false, acid: 0, vad: 0, done: false });
        api.clearConcl(); api.say('已重置，参数解锁。');
      }
    },
    hud(s) {
      const m = calc(s);
      return [
        { label: '剩余 OH⁻', value: m.ohLeft.toFixed(3) + ' g', hi: s.done },
        { label: '生成 H₂O', value: m.water.toFixed(3) + ' g' },
        { label: 'pH', value: s.fed ? m.pH.toFixed(1) : '—' }
      ];
    }
  });

  function calc(s) {
    if (!s.fed) return { oh0: 0, ohLeft: 0, water: 0, total: 0, vol: 0, pH: 7 };
    // naoh 是纯 NaOH 的质量；pct 只用于折算溶液体积
    const nOH = s.naoh / M.naoh;
    const oh0 = nOH * 17;
    const nH = s.acid * 0.1 / M.hcl;
    const react = Math.min(nOH, nH);
    const ohLeft = (nOH - react) * 17;
    const hLeft = (nH - react) * 1;
    const water = react * 18;
    const vol = s.naoh / (s.pct / 100) + s.acid;   // 溶液质量 ≈ 体积（g → mL）
    let pH;
    if (!s.fed) pH = 7;
    else if (ohLeft > 1e-6) {
      const c = (ohLeft / 17) / (vol / 1000);
      pH = 14 + Math.log10(Math.max(1e-14, c));
    } else if (hLeft > 1e-6) {
      const c = (hLeft / 1) / (vol / 1000);
      pH = -Math.log10(Math.max(1e-14, c));
    } else pH = 7;
    return {
      oh0, ohLeft: Math.max(0, ohLeft), water, vol,
      total: s.naoh + s.acid,
      pH: Math.max(0, Math.min(14, pH))
    };
  }
})();

/* ---------------- D7-04 酸的化学性质 ---------------- */
(function () {
  const CASES = [
    { id: 'litmus', t: '稀盐酸 + 紫色石蕊', phen: '溶液变红', eq: '—', why: '酸能使紫色石蕊变红' },
    { id: 'mg', t: '稀盐酸 + 镁条', phen: '剧烈冒气泡，镁条溶解', eq: 'Mg + 2HCl = MgCl₂ + H₂↑', why: '酸与活泼金属反应放出氢气' },
    { id: 'fe2o3', t: '稀盐酸 + 氧化铁', phen: '红棕色固体溶解，溶液变黄', eq: 'Fe₂O₃ + 6HCl = 2FeCl₃ + 3H₂O', why: '酸能除锈（与金属氧化物反应）' },
    { id: 'cuo', t: '稀盐酸 + 氧化铜', phen: '黑色固体溶解，溶液变蓝绿', eq: 'CuO + 2HCl = CuCl₂ + H₂O', why: '同上，生成蓝色 CuCl₂' },
    { id: 'naoh', t: '稀盐酸 + 氢氧化钠（加酚酞）', phen: '红色褪去', eq: 'NaOH + HCl = NaCl + H₂O', why: '酸与碱发生中和反应' },
    { id: 'caco3', t: '稀盐酸 + 碳酸钙', phen: '冒气泡，固体溶解', eq: 'CaCO₃ + 2HCl = CaCl₂ + H₂O + CO₂↑', why: '酸与盐反应，生成气体' }
  ];

  window.EXPERIMENTS.push({
    id: 'd7-04', studentExp: 7, code: 'D7-04', title: '酸的化学性质',
    book: '下册', unit: '第七单元 常见的酸和碱', kind: '课标必做',
    opening: '依次试六组，归纳酸能与哪几类物质反应。',
    stageNote: '酸的五个通性：指示剂、活泼金属、金属氧化物、碱、某些盐',
    init: () => ({ done: {} }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="酸的化学性质">
      <text x="230" y="34" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">实验记录</text>
      <g id="rows"></g>
    </svg>`,
    draw(s, el) {
      const rows = el.querySelector('#rows');
      rows.innerHTML = CASES.map((c, i) => {
        const done = s.done[c.id];
        const y = 54 + i * 52;
        return `<g>
          <line x1="26" y1="${y + 40}" x2="434" y2="${y + 40}" stroke="var(--line-2)" stroke-width="1"/>
          <circle cx="40" cy="${y + 16}" r="9" fill="${done ? 'var(--accent)' : 'none'}"
                  stroke="${done ? 'var(--accent)' : 'var(--line)'}" stroke-width="1.4"/>
          <text x="40" y="${y + 20}" font-size="10" fill="${done ? '#fff' : 'var(--faint)'}"
                text-anchor="middle" font-family="var(--f-num)">${i + 1}</text>
          <text x="60" y="${y + 12}" font-size="12" fill="var(--ink)" font-family="var(--f-sans)">${c.t}</text>
          <text x="60" y="${y + 30}" font-size="11" fill="${done ? 'var(--ink-2)' : 'var(--faint)'}"
                font-family="var(--f-sans)">${done ? c.phen : '未做'}</text>
          <text x="428" y="${y + 20}" font-size="11" fill="${done ? 'var(--accent)' : 'var(--faint)'}"
                text-anchor="end" font-family="var(--f-mono)">${done ? c.eq.replace(/ /g, '').slice(0, 16) : '—'}</text>
        </g>`;
      }).join('');
    },
    controls(s) {
      return [
        { type: 'opts', id: 'pick', label: `选择一组（已完成 ${Object.keys(s.done).length}/6）`,
          options: CASES.map(c => ({ v: c.id, t: c.t })),
          get: () => null, pick: (st, v) => { st.pickId = v; },
          state: (st, o) => st.done[o.v] ? 'ok' : '' }
      ];
    },
    onChange(id, v, s, api) {
      if (id !== 'pick') return;
      const c = CASES.find(x => x.id === v);
      s.done[v] = true;
      api.say(`<b>${c.t}</b>：${c.phen}。<br>方程式：${c.eq}<br>${c.why}。`, 'ok');
      if (Object.keys(s.done).length === CASES.length) {
        api.conclude('酸的五条通性', [
          '使紫色石蕊<b>变红</b>（无色酚酞不变色）。',
          '与<b>活泼金属</b>反应，放出氢气（排在氢前的金属）。',
          '与<b>金属氧化物</b>反应，生成盐和水 —— 工业除锈的原理。',
          '与<b>碱</b>反应，生成盐和水 —— 中和反应。',
          '与<b>某些盐</b>反应，生成新酸和新盐（如碳酸盐放出 CO₂）。'
        ]);
      }
    },
    hud(s) {
      return [
        { label: '已完成', value: `${Object.keys(s.done).length}/6`, hi: Object.keys(s.done).length === 6 },
        { label: '出现气泡', value: (s.done.mg ? 1 : 0) + (s.done.caco3 ? 1 : 0) },
        { label: '溶液变色', value: (s.done.litmus ? 1 : 0) + (s.done.fe2o3 ? 1 : 0) + (s.done.cuo ? 1 : 0) }
      ];
    }
  });
})();

/* ---------------- D8-01 粗盐提纯 ---------------- */
(function () {
  const STEPS = [
    { id: 'dissolve', t: '溶解：加水搅拌，使 NaCl 溶解', why: '加适量水，搅拌加速溶解；水不能太多，否则后面蒸发耗时长' },
    { id: 'filter', t: '过滤：除去不溶性杂质', why: '一贴二低三靠；滤纸破损或液面过高都会使滤液浑浊' },
    { id: 'evaporate', t: '蒸发：加热浓缩至出现较多固体', why: '玻璃棒不断搅拌防局部过热飞溅；出现较多固体时停止加热，用余热蒸干' },
    { id: 'weigh', t: '计算产率', why: '产率 = 精盐质量 ÷ 粗盐质量 × 100%' }
  ];

  window.EXPERIMENTS.push({
    id: 'd8-01', studentExp: 8, code: 'D8-01', title: '粗盐中难溶性杂质的去除',
    book: '下册', unit: '第八单元 海水中的化学', kind: '课标必做',
    opening: '按「溶解 → 过滤 → 蒸发 → 计算产率」四步操作。',
    stageNote: '粗盐中的泥沙不溶于水，可用过滤除去；NaCl 溶于水，蒸发结晶回收',
    init: () => ({ step: 0, water: 30, yield: null }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="粗盐提纯">
      <g id="s0" opacity=".2" transform="translate(60,150)">
        ${''}
      </g>
      <g id="s1" opacity=".2" transform="translate(150,140)"></g>
      <g id="s2" opacity=".2" transform="translate(300,180)"></g>
      <text id="cap" x="230" y="378" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">第 1 步 / 4</text>
    </svg>`,
    draw(s, el) {
      const g1 = el.querySelector('#s1'), g2 = el.querySelector('#s2');
      g1.setAttribute('opacity', s.step >= 1 ? 1 : .2);
      g2.setAttribute('opacity', s.step >= 2 ? 1 : .2);
      g1.innerHTML = s.step >= 1 ? `<g>
        ${Parts.beaker({ x: 0, y: 0, w: 88, h: 100, fill: '#9fc9de', level: .55 })}
        <rect x="8" y="86" width="72" height="10" fill="#b39a78" opacity=".55"/>
        <text x="44" y="122" font-size="10" fill="var(--faint)" text-anchor="middle"
              font-family="var(--f-sans)">浊液</text></g>` : '';
      g2.innerHTML = s.step >= 2 ? `<g>
        <path d="M0 40 h72 L44 84 v40 h-16 V84 Z" fill="var(--paper-2)" fill-opacity=".7"
              stroke="var(--ink)" stroke-width="1.6"/>
        <rect x="20" y="30" width="34" height="14" fill="var(--paper-3)" stroke="var(--ink)" stroke-width="1.2"/>
        <text x="36" y="142" font-size="10" fill="var(--faint)" text-anchor="middle"
              font-family="var(--f-sans)">蒸发皿</text></g>` : '';
      el.querySelector('#cap').textContent =
        s.step >= 4 ? `产率 ${s.yield}%` : `第 ${s.step + 1} 步 / 4 · ${STEPS[s.step].t.split('：')[0]}`;
    },
    controls(s) {
      return [
        { type: 'steps', id: 'st', label: '操作流程', steps: STEPS.map(x => x.t), get: st => st.step },
        { type: 'opts', id: 'go', label: s.step >= 4 ? '已完成' : '执行下一步',
          options: s.step >= 4 ? [{ v: 'done', t: '实验完成' }] : [{ v: 'go', t: STEPS[s.step].t }],
          get: () => null, pick: () => {}, state: () => '' }
      ];
    },
    onChange(id, v, s, api) {
      if (id !== 'go' || s.step >= 4) return;
      const st = STEPS[s.step];
      s.step++;
      api.say(`<b>${st.t.split('：')[0]}</b>：${st.why}。`, s.step === 4 ? 'ok' : 'ok');
      if (s.step === 4) {
        s.yield = 82.5;
        api.conclude('粗盐提纯', [
          '四步：<b>溶解 → 过滤 → 蒸发 → 计算产率</b>。',
          '过滤只能除去<b>不溶性</b>杂质（泥沙），可溶性杂质（MgCl₂、CaCl₂）除不掉。',
          '产率偏低的常见原因：溶解不充分、转移时有损失、蒸发时液滴飞溅。',
          '蒸发时<b>不能蒸干</b> —— 出现较多固体就停止加热，用余热蒸干，否则固体飞溅。'
        ]);
      }
    },
    hud(s) {
      return [
        { label: '步骤', value: `${Math.min(s.step, 4)}/4`, hi: s.step === 4 },
        { label: '粗盐', value: '5.0 g' },
        { label: '产率', value: s.yield ? s.yield + '%' : '—' }
      ];
    }
  });
})();

/* ---------------- D9-01 金属活动性 ---------------- */
(function () {
  const METALS = [
    { id: 'mg', n: '镁', rank: 1, hcl: '剧烈反应，迅速溶解', rate: 3 },
    { id: 'zn', n: '锌', rank: 2, hcl: '反应较快，冒气泡', rate: 2 },
    { id: 'fe', n: '铁', rank: 3, hcl: '反应缓慢，冒气泡', rate: 1 },
    { id: 'cu', n: '铜', rank: 4, hcl: '不反应', rate: 0 }
  ];

  window.EXPERIMENTS.push({
    id: 'd9-01', studentExp: 9, code: 'D9-02', title: '金属活动性顺序',
    book: '下册', unit: '第九单元 金属', kind: '课标必做',
    opening: '把四种金属分别放入稀盐酸，比较反应剧烈程度。',
    stageNote: 'K Ca Na Mg Al Zn Fe Sn Pb (H) Cu Hg Ag Pt Au —— 排在氢前的能置换出酸中的氢',
    init: () => ({ acid: false, tested: {} }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="金属与酸">
      <g id="rack"></g>
      <text x="230" y="376" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">稀盐酸</text>
    </svg>`,
    draw(s, el) {
      const rack = el.querySelector('#rack');
      rack.innerHTML = METALS.map((m, i) => {
        const x = 46 + i * 96;
        const done = s.tested[m.id];
        const bub = done && m.rate > 0;
        return `<g transform="translate(${x},90)">
          ${Parts.tube({ x: 0, y: 0, h: 190, w: 48, fill: s.acid ? '#cfe3f0' : '#cfe3f0', level: s.acid ? .6 : 0 })}
          ${done ? `<rect x="10" y="${190 - 100}" width="28" height="14" rx="2"
                fill="${m.rate ? '#8c8378' : '#b5764a'}" opacity=".85"/>` : ''}
          ${bub ? Array.from({ length: 5 }, (_, k) =>
            `<circle cx="${14 + (k * 9) % 22}" cy="${120 - k * 12}" r="${1.5 + k % 2}" fill="#fff" opacity=".75"/>`).join('') : ''}
          <text x="24" y="214" font-size="13" fill="var(--ink)" text-anchor="middle"
                font-weight="700" font-family="var(--f-sans)">${m.n}</text>
          <text x="24" y="232" font-size="10" fill="${done ? (m.rate ? 'var(--ok)' : 'var(--bad)') : 'var(--faint)'}"
                text-anchor="middle" font-family="var(--f-sans)">${done ? (m.rate ? '反应' : '不反应') : '—'}</text>
        </g>`;
      }).join('');
    },
    controls(s) {
      return [
        { type: 'seg', id: 'acid', label: '加入稀盐酸', options: [
            { v: 'n', t: '未加' }, { v: 'y', t: '已加' }],
          get: st => st.acid ? 'y' : 'n', set: (st, v) => { st.acid = v === 'y'; } },
        { type: 'opts', id: 'test', label: '观察某一种金属', options:
            METALS.map(m => ({ v: m.id, t: `${m.n}（${m.hcl}）` })),
          get: () => null, pick: (st, v) => { if (st.acid) st.tested[v] = true; },
          state: (st, o) => st.tested[o.v] ? 'ok' : '' },
        { type: 'note', html: s.acid ? '' : '先选择「已加」稀盐酸，再点击金属观察。' }
      ];
    },
    onChange(id, v, s, api) {
      if (id !== 'test') return;
      if (!s.acid) { api.say('先加稀盐酸。', 'warn'); return; }
      const m = METALS.find(x => x.id === v);
      api.say(m.rate ? `<b>${m.n}</b>：${m.hcl}，说明 ${m.n} 排在氢前面。`
        : `<b>铜</b>：${m.hcl}，说明铜排在氢<b>后面</b>，不能置换出酸中的氢。`, m.rate ? 'ok' : 'warn');
      if (Object.keys(s.tested).length === 4) {
        api.conclude('金属活动性顺序', [
          '顺序：<b>K Ca Na Mg Al Zn Fe Sn Pb (H) Cu Hg Ag Pt Au</b>。',
          '排在<b>氢前</b>的金属能置换出稀盐酸、稀硫酸中的氢，产生氢气。',
          '反应剧烈程度：Mg > Zn > Fe，铜不反应 —— 活动性越强反应越剧烈。',
          '排在<b>前面</b>的金属能把排在后面的金属从其盐溶液中置换出来（K、Ca、Na 除外）。'
        ]);
      }
    },
    hud(s) {
      return [
        { label: '已加酸', value: s.acid ? '是' : '否' },
        { label: '已观察', value: `${Object.keys(s.tested).length}/4`, hi: Object.keys(s.tested).length === 4 },
        { label: '能反应', value: Object.keys(s.tested).filter(k => METALS.find(m => m.id === k).rate > 0).length + ' 种' }
      ];
    }
  });
})();

/* ---------------- D9-02 铁锈蚀 ---------------- */
(function () {
  const TUBES = [
    { id: 'a', n: '① 水 + 空气', water: true, oil: false, dry: false, rust: true, why: '水和氧气同时接触 —— 生锈' },
    { id: 'b', n: '② 水 + 植物油', water: true, oil: true, dry: false, rust: false, why: '油层隔绝氧气 —— 不生锈' },
    { id: 'c', n: '③ 干燥空气', water: false, oil: false, dry: true, rust: false, why: '没有水 —— 不生锈' },
    { id: 'd', n: '④ 水 + 食盐', water: true, oil: false, dry: false, rust: true, salt: true, why: '食盐加速锈蚀 —— 生锈更快' }
  ];

  window.EXPERIMENTS.push({
    id: 'd9-02', code: 'D9-03', title: '铁的锈蚀与防护',
    book: '下册', unit: '第九单元 金属', kind: '教材演示',
    opening: '四支试管放一周，比较铁钉的锈蚀情况。',
    stageNote: '铁生锈是铁与空气中的氧气和水共同作用的结果',
    init: () => ({ week: false }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="铁钉锈蚀">
      <g id="tubes"></g>
      <text x="230" y="378" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">放置一周后观察</text>
    </svg>`,
    draw(s, el) {
      const box = el.querySelector('#tubes');
      box.innerHTML = TUBES.map((t, i) => {
        const x = 48 + i * 96;
        const rustColor = t.salt ? '#a35b2c' : '#8c5a34';
        return `<g transform="translate(${x},86)">
          ${Parts.tube({ x: 0, y: 0, h: 210, w: 52, fill: t.water ? '#cfe3f0' : 'transparent', level: t.water ? .62 : 0 })}
          ${t.dry ? `<rect x="4" y="60" width="44" height="80" fill="var(--paper-3)" opacity=".5"/>` : ''}
          ${t.oil ? `<rect x="3" y="70" width="46" height="12" fill="#e6d27a" opacity=".55"/>` : ''}
          <g transform="translate(26,120)">
            <rect x="-3" y="0" width="6" height="52" rx="2" fill="${s.week && t.rust ? rustColor : '#8f8b84'}"
                  opacity="${s.week && t.rust ? .9 : .75}"/>
            <rect x="-11" y="0" width="22" height="7" rx="2" fill="${s.week && t.rust ? rustColor : '#8f8b84'}"/>
            ${s.week && t.rust ? `<circle cx="-6" cy="16" r="3.2" fill="${rustColor}" opacity=".6"/>
              <circle cx="6" cy="30" r="2.6" fill="${rustColor}" opacity=".5"/>` : ''}
          </g>
          <text x="26" y="232" font-size="10" fill="var(--muted)" text-anchor="middle"
                font-family="var(--f-sans)">${t.n}</text>
          <text x="26" y="250" font-size="10" fill="${s.week ? (t.rust ? 'var(--bad)' : 'var(--ok)') : 'var(--faint)'}"
                text-anchor="middle" font-family="var(--f-sans)">${s.week ? (t.rust ? '生锈' : '未生锈') : '—'}</text>
        </g>`;
      }).join('');
    },
    controls(s) {
      return [
        { type: 'opts', id: 'go', label: '时间', options: [
            { v: 'now', t: '刚放入（第 0 天）' }, { v: 'week', t: '放置一周后' }],
          get: () => null, pick: (st, v) => { st.week = v === 'week'; },
          state: (st, o) => (o.v === 'week' && st.week) || (o.v === 'now' && !st.week) ? 'on' : '' },
        { type: 'note', html: '① 与 ④ 生锈，② 与 ③ 不生锈。对比 ① ② 说明需要<b>氧气</b>，对比 ① ③ 说明需要<b>水</b>。' }
      ];
    },
    after(s, api) {
      if (s.week) {
        api.say('① 和 ④ 生锈，② 和 ③ 没生锈。④ 比 ① 锈得更厉害，说明食盐能<b>加速</b>锈蚀。', 'ok');
        api.conclude('铁生锈的条件与防护', [
          '铁生锈是铁与<b>氧气和水</b>共同作用的结果，二者缺一不可。',
          '对比 ①②：② 有油层隔绝氧气，不生锈 → 需要氧气。',
          '对比 ①③：③ 干燥无水，不生锈 → 需要水。',
          '食盐、酸性环境会<b>加速</b>锈蚀，所以沿海地区钢铁更容易锈。',
          '防锈原理是<b>隔绝氧气或水</b>：刷漆、涂油、镀层、制成不锈钢、保持干燥。'
        ]);
      } else {
        api.say('刚放入，还没有明显变化。点「放置一周后」看结果。');
      }
    },
    hud(s) {
      return [
        { label: '已放置', value: s.week ? '7 天' : '0 天' },
        { label: '生锈', value: s.week ? '2 支' : '—', hi: s.week },
        { label: '最快', value: s.week ? '④ 食盐水' : '—' }
      ];
    }
  });
})();

/* ---------------- D10-01 配制溶液 ---------------- */
(function () {
  window.EXPERIMENTS.push({
    id: 'u3-03', code: 'U3-03', title: '配制一定溶质质量分数的溶液',
    book: '上册', unit: '第三单元 探秘水世界', kind: '课标必做', studentExp: 3,
    opening: '先设定目标，算出需要多少氯化钠和水，再称量、量取、溶解。',
    stageNote: '溶质质量分数 = 溶质质量 ÷ 溶液质量 × 100%',
    init: () => ({ target: 50, pct: 6, weighed: null, measured: null, step: 0 }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="配制溶液">
      <g transform="translate(56,120)">${''}</g>
      <g id="balanceG" transform="translate(40,150)">
        ${''}
      </g>
      <g id="cylG" transform="translate(250,110)"></g>
      <g id="beakerG" transform="translate(160,236)">
        <path d="M0 0 V92 a10 10 0 0 0 10 10 h76 a10 10 0 0 0 10 -10 V0" fill="var(--paper-2)"
              fill-opacity=".7" stroke="var(--ink)" stroke-width="1.7"/>
        <rect id="solLiq" x="2" y="92" width="92" height="0" fill="#9fc9de" opacity=".4"/>
        <rect id="nacl" x="18" y="80" width="60" height="0" fill="#fff" opacity=".8"/>
        <text x="48" y="122" font-size="10.5" fill="var(--faint)" text-anchor="middle"
              font-family="var(--f-sans)">烧杯</text>
      </g>
      <text id="formula" x="230" y="42" font-size="12" fill="var(--ink)" text-anchor="middle"
            font-family="var(--f-mono)">—</text>
    </svg>`,
    draw(s, el) {
      const m = need(s);
      el.querySelector('#formula').textContent =
        `${s.pct}% = ${m.solute.toFixed(1)} g ÷ ${s.target.toFixed(0)} g × 100%`;
      el.querySelector('#cylG').innerHTML = Parts.cylinder({
        x: 0, y: 0, h: 160, w: 44, fill: '#9fc9de', level: s.measured ? .5 : 0
      });
      el.querySelector('#solLiq').setAttribute('height', s.step >= 3 ? 80 : 0);
      el.querySelector('#solLiq').setAttribute('y', s.step >= 3 ? 12 : 92);
      el.querySelector('#nacl').setAttribute('height', s.step >= 3 ? 0 : (s.weighed ? 6 : 0));
      el.querySelector('#nacl').setAttribute('y', s.weighed ? 86 : 92);
    },
    controls(s) {
      return [
        { type: 'range', id: 'target', label: '目标溶液质量', min: 20, max: 100, step: 5, unit: ' g',
          get: st => st.target, set: (st, v) => { st.target = v; st.step = 0; st.weighed = null; } },
        { type: 'range', id: 'pct', label: '目标质量分数', min: 2, max: 20, step: 1, unit: ' %',
          get: st => st.pct, set: (st, v) => { st.pct = v; st.step = 0; st.weighed = null; } },
        { type: 'note', html: `需 NaCl <b>${need(s).solute.toFixed(1)} g</b>，水 <b>${need(s).water.toFixed(1)} g</b>（约 ${need(s).water.toFixed(1)} mL）。` }
      ];
    },
    actLabels: { weigh: '① 称取氯化钠', measure: '② 量取水', dissolve: '③ 溶解' },
    actions: {
      weigh(s, api) {
        const m = need(s);
        s.weighed = m.solute;
        s.step = Math.max(s.step, 1);
        api.say(`用托盘天平称取 <b>${m.solute.toFixed(1)} g</b> 氯化钠。注意「左物右码」。`, 'ok');
      },
      measure(s, api) {
        if (s.weighed === null) { api.say('先称量氯化钠。', 'warn'); return; }
        s.measured = need(s).water;
        s.step = Math.max(s.step, 2);
        api.say(`用量筒量取 <b>${need(s).water.toFixed(1)} mL</b> 水，平视凹液面最低处。`, 'ok');
      },
      dissolve(s, api) {
        if (s.measured === null) { api.say('先量取水。', 'warn'); return; }
        s.step = 3;
        api.say('把氯化钠倒入烧杯，加水，用玻璃棒搅拌至完全溶解。', 'ok');
        api.conclude('配制溶液的步骤与误差', [
          '步骤：<b>计算 → 称量 → 量取 → 溶解 → 装瓶贴标签</b>。',
          '溶质质量分数 = 溶质质量 ÷ <b>溶液</b>质量 × 100%（不是溶剂质量）。',
          '称量时「左物右码」，药品不能直接放在托盘上。',
          '量取水时<b>仰视</b>读数会导致实际水偏多，质量分数偏小。',
          '溶质质量分数偏小的常见原因：溶质称少了、水多了、烧杯内壁有水。'
        ]);
      }
    },
    hud(s) {
      const m = need(s);
      return [
        { label: '需 NaCl', value: m.solute.toFixed(1) + ' g', hi: s.weighed !== null },
        { label: '需水', value: m.water.toFixed(1) + ' mL' },
        { label: '已配', value: s.step >= 3 ? `${s.target.toFixed(0)} g` : '—' }
      ];
    }
  });

  function need(s) {
    const solute = s.target * s.pct / 100;
    return { solute, water: s.target - solute };
  }
})();

/* ---------------- S10 测定鸡蛋壳中碳酸钙的含量（学生实验 10） ---------------- */
(function () {
  const M = { caco3: 100, co2: 44 };
  const ACID = 20;          // 加入的稀盐酸质量 g
  const PURITY = 0.9;       // 教学模型：蛋壳中含 CaCO₃ 90%

  window.EXPERIMENTS.push({
    id: 'd8-02', code: 'D8-02', title: '测定鸡蛋壳中碳酸钙的含量',
    book: '下册', unit: '第八单元 海水中的化学', kind: '课标必做', studentExp: 10,
    opening: '称蛋壳 → 加足量稀盐酸 → 冷却后再称 → 用质量差算碳酸钙含量。',
    stageNote: '用质量差法：减少的质量就是逸出的 CO₂；必须反应完全并冷却到室温再称量',
    init: () => ({ egg: 3.0, m1: null, m2: null, reacted: false, result: null }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="测定鸡蛋壳中碳酸钙含量">
      <!-- 电子天平 -->
      <rect x="96" y="300" width="268" height="34" rx="4" fill="var(--paper-3)"
            stroke="var(--ink)" stroke-width="1.8"/>
      <rect x="126" y="286" width="208" height="16" rx="2" fill="var(--paper-2)"
            stroke="var(--ink)" stroke-width="1.4"/>
      <rect x="150" y="308" width="160" height="18" rx="2" fill="#1a1815" opacity=".08"/>
      <text id="readout" x="230" y="322" font-size="12" fill="var(--ink)" text-anchor="middle"
            font-family="var(--f-mono)" font-weight="700">0.00 g</text>
      <text x="230" y="352" font-size="10" fill="var(--faint)" text-anchor="middle"
            font-family="var(--f-sans)">电子天平（已去皮）</text>

      <!-- 锥形瓶 -->
      <g transform="translate(170,96)">
        <path d="M34 0 v40 L0 168 a16 16 0 0 0 14 20 h100 a16 16 0 0 0 14 -20 L94 40 V0"
              fill="var(--paper-2)" fill-opacity=".7" stroke="var(--ink)" stroke-width="1.8"/>
        <line x1="26" y1="0" x2="102" y2="0" stroke="var(--ink)" stroke-width="2.4" stroke-linecap="round"/>
        <rect x="12" y="150" width="112" height="34" fill="#c6e2f4" opacity="0" id="acidLiq"/>
        <g id="pieces"></g>
        <g id="bubbles"></g>
        <text x="64" y="212" font-size="10" fill="var(--faint)" text-anchor="middle"
              font-family="var(--f-sans)">锥形瓶 + 蛋壳</text>
      </g>

      <!-- 数据标注 -->
      <text id="tagM1" x="360" y="120" font-size="11" fill="var(--muted)"
            font-family="var(--f-sans)">m₁ —</text>
      <text id="tagM2" x="360" y="140" font-size="11" fill="var(--muted)"
            font-family="var(--f-sans)">m₂ —</text>
      <text id="tagCO2" x="360" y="160" font-size="11" fill="var(--accent)"
            font-family="var(--f-sans)">Δm —</text>
      <text id="tipTxt" x="230" y="384" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">先称量蛋壳质量</text>
    </svg>`,
    draw(s, el) {
      el.querySelector('#readout').textContent =
        s.m2 !== null ? s.m2.toFixed(2) + ' g'
        : s.m1 !== null ? s.m1.toFixed(2) + ' g' : '0.00 g';

      el.querySelector('#acidLiq').setAttribute('opacity', s.reacted ? .4 : 0);

      el.querySelector('#pieces').innerHTML = s.reacted
        ? ''
        : Array.from({ length: 9 }, (_, i) =>
            `<path d="M${18 + (i * 13) % 88} ${176 - (i % 4) * 12} l7 -6 l6 7 l-8 5 Z"
              fill="#e6dfcc" stroke="var(--ink)" stroke-width=".8" opacity=".9"/>`).join('');

      el.querySelector('#bubbles').innerHTML = s.reacted
        ? Array.from({ length: 10 }, (_, i) =>
            `<circle cx="${20 + (i * 11) % 88}" cy="${168 - (i * 13) % 80}" r="${1.6 + (i % 3) * .6}"
              fill="#fff" stroke="#9fc9de" stroke-width=".8" opacity=".7"/>`).join('')
        : '';

      el.querySelector('#tagM1').textContent = 'm₁ ' + (s.m1 !== null ? s.m1.toFixed(1) + ' g' : '—');
      el.querySelector('#tagM2').textContent = 'm₂ ' + (s.m2 !== null ? s.m2.toFixed(2) + ' g' : '—');
      el.querySelector('#tagCO2').textContent = 'Δm ' + (s.m2 !== null ? (s.m1 + ACID - s.m2).toFixed(2) + ' g' : '—');

      el.querySelector('#tipTxt').textContent =
        s.result ? `碳酸钙含量约 ${s.result}%`
        : s.reacted ? '反应完全，冷却后称量'
        : s.m1 !== null ? '加入足量稀盐酸' : '先称量蛋壳质量';
    },
    controls(s) {
      return [
        { type: 'range', id: 'egg', label: '鸡蛋壳质量', min: 2.0, max: 5.0, step: 0.5, unit: ' g',
          get: st => st.egg, set: (st, v) => { st.egg = v; st.m1 = st.m2 = null; st.reacted = false; st.result = null; },
          disabled: s.m1 !== null, note: s.m1 !== null ? '已称量，重新称量请先重置' : '洗净、去内膜、烘干后研磨' },
        { type: 'note', html: `加入稀盐酸 <b>${ACID} g</b>（足量），反应至不再产生气泡。` }
      ];
    },
    actLabels: {
      weigh: '① 称量蛋壳', add: '② 加稀盐酸', weigh2: '③ 冷却后称量', calc: '④ 计算结果', reset: '重置'
    },
    secondary: ['add', 'weigh2', 'calc'],
    actions: {
      weigh(s, api) {
        s.m1 = s.egg;
        api.say(`称得蛋壳 <b>${s.m1.toFixed(1)} g</b>。注意先撕净内层白膜 —— 软膜不与盐酸反应，留着会使结果偏小。`, 'ok');
      },
      add(s, api) {
        if (s.m1 === null) { api.say('先称量蛋壳。', 'warn'); return; }
        s.reacted = true;
        const mCO2 = s.m1 * PURITY * M.co2 / M.caco3;
        s.m2 = s.m1 + ACID - mCO2;
        api.say('蛋壳表面产生大量气泡，固体逐渐减少。反应至<b>不再产生气泡</b>说明碳酸钙已完全反应。', 'ok');
      },
      weigh2(s, api) {
        if (!s.reacted) { api.say('先加盐酸让反应发生。', 'warn'); return; }
        api.say(`冷却到室温后称得 <b>${s.m2.toFixed(2)} g</b>。比反应前少了 <b>${(s.m1 + ACID - s.m2).toFixed(2)} g</b>。`, 'ok');
      },
      calc(s, api) {
        if (s.m2 === null) { api.say('先完成两次称量。', 'warn'); return; }
        const mCO2 = s.m1 + ACID - s.m2;
        const mCaCO3 = mCO2 * M.caco3 / M.co2;
        const pct = mCaCO3 / s.m1 * 100;
        s.result = pct.toFixed(1);
        api.say(`减少的 ${mCO2.toFixed(2)} g 就是逸出的 CO₂。按方程式算出 CaCO₃ 为 ${mCaCO3.toFixed(2)} g，质量分数 ${pct.toFixed(1)}%。`, 'ok');
        api.conclude('质量差法的完整算法', [
          '原理：<b>CaCO₃ + 2HCl = CaCl₂ + H₂O + CO₂↑</b>，只有 CO₂ 逸出，减少的质量就是它。',
          `n(CO₂) = ${mCO2.toFixed(2)} ÷ 44 = ${(mCO2 / 44).toFixed(4)} mol`,
          `m(CaCO₃) = n × 100 = ${mCaCO3.toFixed(2)} g`,
          `w(CaCO₃) = ${mCaCO3.toFixed(2)} ÷ ${s.m1.toFixed(1)} × 100% = <b>${pct.toFixed(1)}%</b>`,
          '误差偏小：蛋壳未研碎反应不完全、装置漏气、CO₂ 溶于水未逸出。',
          '误差偏大：盐酸挥发、未冷却就称量（气体体积收缩会吸水增重）。'
        ]);
      },
      reset(s, api) {
        s.m1 = s.m2 = null; s.reacted = false; s.result = null;
        api.clearConcl(); api.say('已重置，可以重新称量。');
      }
    },
    hud(s) {
      const mCO2 = s.m2 !== null ? s.m1 + ACID - s.m2 : null;
      return [
        { label: '蛋壳 m₁', value: s.m1 !== null ? s.m1.toFixed(1) + ' g' : '—' },
        { label: '反应后 m₂', value: s.m2 !== null ? s.m2.toFixed(2) + ' g' : '—', hi: s.m2 !== null },
        { label: 'CO₂', value: mCO2 !== null ? mCO2.toFixed(2) + ' g' : '—' },
        { label: 'CaCO₃ 含量', value: s.result ? s.result + '%' : '—', hi: !!s.result }
      ];
    }
  });
})();

/* ---------------- D7-05 碱的化学性质（学生实验7 补全） ---------------- */
(function () {
  const BASES = {
    naoh: { n: '氢氧化钠溶液', f: 'NaOH', c: 0.10, v0: 10, tint: 'rgba(198,226,244,.34)' },
    caoh: { n: '澄清石灰水', f: 'Ca(OH)₂', c: 0.02, v0: 10, tint: 'rgba(206,230,244,.32)' }
  };
  const DROP_V = 0.5;        // 每滴 0.5 mL
  const DROP_C = 0.10;       // 盐酸 0.10 mol/L
  const TOP = 176, BOT = 346; // 试管液面范围

  function calc(s) {
    const b = BASES[s.base];
    const nOH0 = b.c * b.v0;                 // mmol
    const nH = DROP_C * DROP_V * s.drops;    // mmol
    const nCO2 = s.co2 * 0.06;               // 通入的 CO₂ 折算，mmol
    // CO₂ 消耗 OH⁻：CO₂ + 2OH⁻ → CO₃²⁻ + H₂O
    const ohUsed = nOH0 - nH - nCO2 * 2;
    const V = b.v0 + DROP_V * s.drops;
    let pH;
    if (ohUsed > 1e-6) pH = 14 + Math.log10(ohUsed / V);
    else {
      const hEx = -ohUsed;                    // 过量 H⁺（mmol）
      const cH = Math.max(1e-14, (hEx + nCO2 * 0) / V);
      pH = hEx > 1e-9 ? -Math.log10(cH) : 7;
    }
    if (s.co2 && s.base === 'naoh' && ohUsed > 1e-6) pH = Math.min(pH, 12.4);
    return {
      b, nOH0, nH, pH: Math.max(0, Math.min(14, pH)),
      neutral: Math.abs(pH - 7) < 0.35,
      ohLeft: Math.max(0, ohUsed)
    };
  }

  window.EXPERIMENTS.push({
    id: 'd7-05', studentExp: 7, code: 'D7-05', title: '碱的化学性质',
    book: '下册', unit: '第七单元 常见的酸和碱', kind: '课标必做',
    opening: '取一种碱溶液，依次检验它跟指示剂、酸、非金属氧化物、盐的反应。',
    stageNote: '碱液均为 10 mL；盐酸 0.10 mol/L，每滴 0.5 mL；pH 为计算值',
    init: () => ({ base: 'naoh', litmus: false, phenol: false, drops: 0, co2: 0, cuso4: false, done: {} }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="碱的化学性质">
      <defs>
        <clipPath id="btClip">
          <path d="M188 120 V342 a32 32 0 0 0 64 0 V120 Z"/>
        </clipPath>
      </defs>
      <text x="230" y="28" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">取碱液 → 加试剂 → 看现象</text>
      <text id="baseName" x="230" y="48" font-size="12.5" fill="var(--ink)" text-anchor="middle"
            font-weight="700" font-family="var(--f-sans)">氢氧化钠溶液</text>

      <g clip-path="url(#btClip)">
        <rect id="liq" x="186" y="176" width="68" height="170" fill="rgba(198,226,244,.34)"/>
        <g id="bubbles" opacity="0"></g>
        <g id="precip" opacity="0">
          <rect x="186" y="286" width="68" height="52" fill="rgba(70,130,200,.55)"/>
          <circle cx="206" cy="300" r="7" fill="rgba(70,130,200,.6)"/>
          <circle cx="230" cy="310" r="9" fill="rgba(70,130,200,.55)"/>
          <circle cx="252" cy="298" r="6" fill="rgba(70,130,200,.6)"/>
        </g>
      </g>
      <path d="M188 120 V342 a32 32 0 0 0 64 0 V120" fill="none" stroke="var(--ink)"
            stroke-width="1.8" stroke-linejoin="round"/>
      <line x1="182" y1="120" x2="258" y2="120" stroke="var(--ink)" stroke-width="2.4" stroke-linecap="round"/>
      <rect id="liqTop" x="186" y="176" width="68" height="2" fill="#7fb6d6" opacity="0"/>

      <g id="dropper" transform="translate(230,56)" opacity="0">
        <rect x="-4" y="0" width="8" height="22" rx="3" fill="var(--paper-3)" stroke="var(--ink)" stroke-width="1.3"/>
        <rect x="-2.5" y="22" width="5" height="22" fill="var(--paper-2)" stroke="var(--ink)" stroke-width="1.2"/>
        <path d="M-2.5 44 L0 58 L2.5 44" fill="none" stroke="var(--ink)" stroke-width="1.2"/>
      </g>
      <g id="tube" transform="translate(264,176)" opacity="0">
        <path d="M0 0 v30 q0 10 12 12 h20" fill="none" stroke="var(--ink)" stroke-width="1.6"/>
        <circle id="gasDot" cx="34" cy="44" r="2.4" fill="var(--muted)" opacity="0"/>
        <text x="0" y="-6" font-size="9.5" fill="var(--muted)" font-family="var(--f-sans)">CO₂</text>
      </g>

      <text id="phTxt" x="230" y="392" font-size="13" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">pH ≈ 13.0 · 碱性</text>
    </svg>`,
    draw(s, el) {
      const m = calc(s);
      const b = m.b;
      const liq = el.querySelector('#liq');
      const red = s.phenol && m.ohLeft > 0.02;
      const blue = s.litmus;
      const litFill = m.pH > 7.4 ? 'rgba(47,111,168,.62)'
        : m.pH < 6.6 ? 'rgba(192,57,43,.58)' : 'rgba(126,104,168,.52)';
      const milky = s.base === 'caoh' && s.co2 > 0;
      let fill = b.tint;
      if (red) fill = 'rgba(200,52,98,.62)';
      else if (blue) fill = litFill;
      if (milky) fill = 'rgba(235,239,242,.97)';
      liq.setAttribute('fill', fill);

      const top = el.querySelector('#liqTop');
      top.setAttribute('y', TOP);
      top.setAttribute('opacity', milky ? 0 : .9);
      top.setAttribute('fill', red ? '#c8346a' : blue ? (m.pH > 7.4 ? '#2f6fa8' : m.pH < 6.6 ? '#c0392b' : '#7e68a8') : '#7fb6d6');

      el.querySelector('#baseName').textContent = b.n;

      const bub = el.querySelector('#bubbles');
      bub.setAttribute('opacity', milky ? 1 : 0);
      if (milky) {
        const pts = [];
        for (let i = 0; i < 34; i++) {
          const x = 191 + (i * 37) % 60;
          const y = 186 + (i * 29) % 152;
          pts.push(`<circle cx="${x}" cy="${y}" r="${1.2 + (i % 3) * .8}" fill="#aeb6bf" opacity=".65"/>`);
        }
        bub.innerHTML = pts.join('');
      }
      el.querySelector('#precip').setAttribute('opacity', s.cuso4 ? 1 : 0);

      const dropper = el.querySelector('#dropper');
      const tube = el.querySelector('#tube');
      dropper.setAttribute('opacity', s.drops > 0 || s.litmus || s.phenol ? 1 : 0);
      tube.setAttribute('opacity', s.co2 > 0 ? 1 : 0);

      const ph = el.querySelector('#phTxt');
      ph.textContent = `pH ≈ ${m.pH.toFixed(1)} · ${m.pH < 6.6 ? '酸性' : m.pH > 7.4 ? '碱性' : '中性'}`;
    },
    controls(s) {
      return [{
        type: 'seg', id: 'base', label: '① 取碱液',
        options: [{ v: 'naoh', t: '氢氧化钠溶液' }, { v: 'caoh', t: '澄清石灰水' }],
        get: st => st.base,
        set: (st, v) => { Object.assign(st, { base: v, litmus: false, phenol: false, drops: 0, co2: 0, cuso4: false }); },
        note: s.base === 'caoh' ? '饱和石灰水浓度低，只需 4 滴盐酸就中和。' : ''
      }];
    },
    actLabels: {
      litmus: '② 滴加紫色石蕊', phenol: '② 滴加无色酚酞',
      acid: '③ 滴加稀盐酸（1 滴）', co2: '④ 通入 CO₂',
      cuso4: '⑤ 滴加硫酸铜溶液', reset: '重置'
    },
    secondary: ['reset'],
    actions: {
      litmus(s, api) {
        s.litmus = true; s.phenol = false;
        s.done.litmus = 1;
        api.say('紫色石蕊<b>变蓝</b> —— 碱溶液能使紫色石蕊变蓝，使无色酚酞变红。', 'ok');
      },
      phenol(s, api) {
        s.phenol = true; s.litmus = false;
        s.done.phenol = 1;
        api.say('无色酚酞<b>变红</b>。记住：酚酞遇碱变红，遇酸和中性溶液都不变色。', 'ok');
      },
      acid(s, api) {
        const before = calc(s);
        s.drops++;
        const after = calc(s);
        s.done.acid = 1;
        if (before.pH > 7.4 && after.pH <= 7.4) {
          s.done.neutral = 1;
          api.say(`第 ${s.drops} 滴，${s.phenol ? '红色恰好褪去' : s.litmus ? '石蕊由蓝变紫' : 'pH 降到 7'}，pH 从 ${before.pH.toFixed(1)} 落到 ${after.pH.toFixed(1)}。<br>
            ${s.base === 'naoh' ? 'NaOH + HCl = NaCl + H₂O' : 'Ca(OH)₂ + 2HCl = CaCl₂ + 2H₂O'}<br>
            碱与酸反应生成盐和水，这就是<b>中和反应</b>。`, 'ok');
        } else if (after.pH < 6.5) {
          api.say(`已经过量，pH 降到 ${after.pH.toFixed(1)}，溶液显酸性。`, 'warn');
        } else {
          api.say(`第 ${s.drops} 滴，pH ${after.pH.toFixed(1)}，红色还在，说明碱还没被中和完。`);
        }
        if (s.done.litmus && s.done.phenol && s.done.neutral && s.done.co2 && s.done.cuso4) done(api);
      },
      co2(s, api) {
        const before = calc(s);
        s.co2++;
        s.done.co2 = 1;
        const after = calc(s);
        if (s.base === 'caoh') {
          api.say('石灰水<b>变浑浊</b>，出现白色沉淀：<br>Ca(OH)₂ + CO₂ = CaCO₃↓ + H₂O<br>这就是检验 CO₂ 的方法。', 'ok');
        } else {
          api.say(`溶液仍然澄清 —— NaOH 与 CO₂ 反应<b>没有明显现象</b>：<br>
            2NaOH + CO₂ = Na₂CO₃ + H₂O<br>
            但 pH 从 ${before.pH.toFixed(1)} 降到 ${after.pH.toFixed(1)}，OH⁻ 确实被消耗了。<br>
            要确证反应发生，可再向溶液中滴加稀盐酸，看是否产生气泡（有 Na₂CO₃ 就会冒泡）。`, 'ok');
        }
        if (s.done.litmus && s.done.phenol && s.done.neutral && s.done.co2 && s.done.cuso4) done(api);
      },
      cuso4(s, api) {
        s.cuso4 = true;
        s.done.cuso4 = 1;
        api.say(`出现<b>蓝色絮状沉淀</b>：<br>
          ${s.base === 'naoh' ? '2NaOH + CuSO₄ = Cu(OH)₂↓ + Na₂SO₄' : 'Ca(OH)₂ + CuSO₄ = Cu(OH)₂↓ + CaSO₄'}<br>
          碱与盐反应，生成新碱和新盐。`, 'ok');
        if (s.done.litmus && s.done.phenol && s.done.neutral && s.done.co2 && s.done.cuso4) done(api);
      },
      reset(s, api) {
        Object.assign(s, { litmus: false, phenol: false, drops: 0, co2: 0, cuso4: false, done: {} });
        api.clearConcl(); api.say('已重置，可以换一种碱再做。');
      }
    },
    hud(s) {
      const m = calc(s);
      const seen = Object.keys(s.done).filter(k => k !== 'neutral').length;
      return [
        { label: '溶液 pH', value: m.pH.toFixed(1), hi: s.done.neutral },
        { label: '已加盐酸', value: s.drops ? `${(s.drops * DROP_V).toFixed(1)} mL` : '—' },
        { label: '现象', value: s.cuso4 ? '蓝色沉淀' : (s.base === 'caoh' && s.co2) ? '变浑浊' : m.pH < 6.6 ? '酸性' : '碱性' },
        { label: '已做', value: `${Math.min(seen, 5)}/5` }
      ];
    }
  });

  function done(api) {
    api.conclude('碱的四条通性', [
      '使紫色石蕊<b>变蓝</b>，使无色酚酞<b>变红</b>。',
      '与<b>非金属氧化物</b>反应生成盐和水：2NaOH + CO₂ = Na₂CO₃ + H₂O；Ca(OH)₂ + CO₂ = CaCO₃↓ + H₂O。',
      '与<b>酸</b>反应生成盐和水（中和反应）：NaOH + HCl = NaCl + H₂O。',
      '与<b>某些盐</b>反应生成新碱和新盐：2NaOH + CuSO₄ = Cu(OH)₂↓ + Na₂SO₄。',
      '注意：NaOH 与 CO₂ 反应<b>无明显现象</b>，要确认反应发生，得检验产物（加盐酸冒泡）或比较反应前后的 pH。'
    ]);
  }
})();

/* ---------------- K06 制备五水硫酸铜晶体（跨学科实践6） ---------------- */
(function () {
  /* 硫酸铜溶解度 g/100 g 水（教材附录数据） */
  const SOL = [[0, 14.3], [10, 17.4], [20, 20.7], [30, 24.2], [40, 28.5], [50, 33.3],
               [60, 40.0], [70, 47.0], [80, 55.0], [90, 64.0], [100, 75.4]];
  const WATER = 50;   // g
  const SALT = 30;    // g

  function sol(T) {
    T = Math.max(0, Math.min(100, T));
    for (let i = 0; i < SOL.length - 1; i++) {
      const [t1, s1] = SOL[i], [t2, s2] = SOL[i + 1];
      if (T >= t1 && T <= t2) return s1 + (s2 - s1) * (T - t1) / (t2 - t1);
    }
    return SOL[SOL.length - 1][1];
  }
  /* 该温度下 50 g 水最多溶解多少克 */
  const maxAt = T => sol(T) * WATER / 100;

  window.EXPERIMENTS.push({
    id: 'k06', code: 'K06', title: '制备五水硫酸铜晶体',
    book: '下册', unit: '第八单元 海水中的化学', kind: '跨学科实践',
    opening: '50 g 水加 30 g 硫酸铜，先加热让它全溶，再降温看晶体析出。',
    stageNote: '溶解度按教材数据插值；析出量按 CuSO₄ 计，未折算结晶水',
    init: () => ({ T: 20, dissolved: false, cooled: false, seed: false }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="制备五步硫酸铜晶体">
      <g id="beaker" transform="translate(120,96)"></g>
      <g id="liq" transform="translate(120,96)" opacity="0">
        <rect id="liqRect" x="6" y="120" width="138" height="60" fill="rgba(47,111,208,.55)"/>
        <line id="liqTop" x1="6" y1="120" x2="144" y2="120" stroke="#2f6fd0" stroke-width="2"/>
      </g>
      <g id="salt" transform="translate(120,96)"></g>
      <g id="crystals" transform="translate(120,96)"></g>
      <g id="lamp" transform="translate(169,300)"></g>
      <g id="thermo" transform="translate(300,110)">
        <rect x="0" y="0" width="9" height="150" rx="4" fill="var(--paper-2)" stroke="var(--ink)" stroke-width="1.3"/>
        <circle cx="4.5" cy="158" r="9" fill="#c0392b" stroke="var(--ink)" stroke-width="1.3"/>
        <rect id="merc" x="2" y="60" width="5" height="98" fill="#c0392b"/>
        <text id="tTxt" x="26" y="80" font-size="15" fill="var(--ink)" font-family="var(--f-num)">20°C</text>
        <text x="26" y="98" font-size="10" fill="var(--muted)" font-family="var(--f-sans)">温度</text>
        <text id="sTxt" x="26" y="126" font-size="10.5" fill="var(--muted)" font-family="var(--f-sans)">—</text>
      </g>
      <text id="msg" x="230" y="386" font-size="12" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
    </svg>`,
    draw(s, el) {
      const bk = el.querySelector('#beaker');
      if (!bk.dataset.init) {
        bk.innerHTML = window.Parts.beaker({ x: 0, y: 0, w: 150, h: 190, fill: '#2f6fd0', level: 0 });
        bk.dataset.init = '1';
      }
      const m = maxAt(s.T);
      const liq = el.querySelector('#liq');
      const rect = el.querySelector('#liqRect');
      const top = el.querySelector('#liqTop');
      liq.setAttribute('opacity', s.dissolved || s.T > 60 ? 1 : .35);
      const h = 88 + Math.min(34, s.T * .34);
      rect.setAttribute('y', 182 - h);
      rect.setAttribute('height', h);
      top.setAttribute('y1', 182 - h); top.setAttribute('y2', 182 - h);
      const conc = s.dissolved ? Math.min(1, SALT / (maxAt(s.T) || 1)) : .6;
      rect.setAttribute('fill', `rgba(46,102,196,${.18 + conc * .2})`);

      /* 未溶的固体 */
      const salt = el.querySelector('#salt');
      const undissolved = s.dissolved ? 0 : SALT;
      if (undissolved > 0) {
        salt.innerHTML = Array.from({ length: 9 }, (_, i) =>
          `<rect x="${30 + (i % 5) * 18}" y="${158 + Math.floor(i / 5) * 9}" width="14" height="8" rx="1.5"
             fill="rgba(40,90,190,.9)" stroke="#1d4f9c" stroke-width="1"/>`).join('');
      } else salt.innerHTML = '';

      /* 析出的晶体 */
      const c = el.querySelector('#crystals');
      const out = s.cooled ? Math.max(0, SALT - maxAt(s.T)) : 0;
      if (out > 0.2) {
        const n = Math.min(26, Math.max(3, Math.round(out * 1.2)));
        c.innerHTML = Array.from({ length: n }, (_, i) => {
          const x = 22 + (i * 37) % 108, y = 172 - Math.floor(i / 6) * 7;
          return `<path d="M${x} ${y} l8 -10 l8 10 l-8 8 Z" fill="rgba(58,126,224,.9)" stroke="#17427f" stroke-width="1"/>`;
        }).join('');
      } else c.innerHTML = '';

      el.querySelector('#lamp').innerHTML = window.Parts.lamp({ x: 0, y: 0, lit: s.T > 60, w: 52, h: 52 });
      el.querySelector('#merc').setAttribute('y', 158 - s.T * 1.45);
      el.querySelector('#merc').setAttribute('height', s.T * 1.45);
      el.querySelector('#tTxt').textContent = `${Math.round(s.T)}°C`;
      el.querySelector('#sTxt').textContent = `S ≈ ${sol(s.T).toFixed(1)} g/100g水`;
      el.querySelector('#msg').textContent = s.cooled
        ? (out > 0.2 ? `析出晶体 ${out.toFixed(1)} g` : '没有晶体析出')
        : s.dissolved ? '已全部溶解，可以降温了' : `还有 ${SALT} g 固体没溶`;
    },
    controls(s) {
      return [{
        type: 'range', id: 'T', label: '① 温度', min: 10, max: 100, step: 5, unit: ' ℃',
        get: st => st.T,
        set: (st, v) => {
          st.T = v;
          if (st.dissolved && v < 60) { /* 保持已溶解状态，冷却时再析出 */ }
          if (st.cooled) st.cooled = false;
        },
        note: `50 g 水，加入 30 g CuSO₄；当前最多溶 ${maxAt(s.T).toFixed(1)} g`
      }];
    },
    actLabels: { dissolve: '加热并搅拌，让它溶解', cool: '缓慢降温，观察结晶', reset: '重置' },
    secondary: ['reset'],
    actions: {
      dissolve(s, api) {
        if (s.T < 80) {
          api.say(`现在 ${s.T} ℃，50 g 水最多只能溶 ${maxAt(s.T).toFixed(1)} g，30 g 溶不完。<br>把温度升到 80 ℃ 以上再试。`, 'warn');
          return;
        }
        s.dissolved = true; s.cooled = false;
        api.say(`加热到 ${s.T} ℃，固体全部溶解，得到<b>热的饱和溶液</b>（略带过量）。<br>此时 50 g 水能溶 ${maxAt(s.T).toFixed(1)} g，30 g 完全溶得下。`, 'ok');
      },
      cool(s, api) {
        if (!s.dissolved) { api.say('先加热让它全部溶解，否则析出的只是没溶完的固体。', 'warn'); return; }
        const out = Math.max(0, SALT - maxAt(s.T));
        s.cooled = true;
        if (out <= 0.2) {
          api.say(`降到 ${s.T} ℃，还能溶 ${maxAt(s.T).toFixed(1)} g，没有晶体析出。继续降温。`, 'warn');
          return;
        }
        api.say(`降到 ${s.T} ℃，溶解度只有 ${sol(s.T).toFixed(1)} g/100g水，多出的 <b>${out.toFixed(1)} g</b> 以晶体形式析出。<br>
          静置后得到蓝色<b>五水硫酸铜晶体（CuSO₄·5H₂O）</b>。`, 'ok');
        api.conclude('降温结晶的完整思路', [
          '原理：CuSO₄ 的溶解度随温度升高<b>明显增大</b>，降温时多余的溶质只能结晶析出。',
          `计算：50 g 水在 ${s.T} ℃ 最多溶 ${maxAt(s.T).toFixed(1)} g，加入 30 g，析出 ${out.toFixed(1)} g。`,
          '步骤：加热溶解 → 趁热过滤（除去不溶杂质）→ 缓慢降温结晶 → 过滤、洗涤、干燥。',
          '为什么要<b>缓慢</b>降温：降温太快晶体细小并夹带杂质，慢降温才能长出大晶体。',
          '对比：NaCl 溶解度受温度影响小，只能用<b>蒸发结晶</b>；KNO₃、CuSO₄ 用<b>降温结晶</b>。',
          '注意：析出的是 CuSO₄·5H₂O，带 5 个结晶水，计算纯度时要换算相对分子质量 250。'
        ]);
      },
      reset(s, api) {
        Object.assign(s, { T: 20, dissolved: false, cooled: false });
        api.clearConcl(); api.say('已重置。');
      }
    },
    hud(s) {
      const out = s.cooled ? Math.max(0, SALT - maxAt(s.T)) : 0;
      return [
        { label: '温度', value: `${Math.round(s.T)} ℃` },
        { label: '溶解度', value: sol(s.T).toFixed(1) + ' g' },
        { label: '溶解状态', value: s.dissolved ? '全溶' : '未溶完', hi: s.dissolved },
        { label: '析出', value: s.cooled && out > 0.2 ? out.toFixed(1) + ' g' : '—', hi: out > 0.2 }
      ];
    }
  });
})();



/* ---------------- D9-03 金属的物理性质（学生实验9 上半） ---------------- */
(function () {
  const METALS = {
    ag: { n: '银', sym: 'Ag', c: '#d8dde2', cond: 100, hard: 2.5, rho: 10.5, price: '贵', use: '首饰、精密触点' },
    cu: { n: '铜', sym: 'Cu', c: '#c1703f', cond: 92, hard: 3.0, rho: 8.9, price: '中', use: '导线、水管' },
    al: { n: '铝', sym: 'Al', c: '#cfd4d8', cond: 61, hard: 2.75, rho: 2.7, price: '低', use: '门窗、易拉罐' },
    zn: { n: '锌', sym: 'Zn', c: '#b9bcc0', cond: 27, hard: 2.5, rho: 7.1, price: '低', use: '镀层、干电池外壳' },
    fe: { n: '铁', sym: 'Fe', c: '#9aa0a6', cond: 17, hard: 4.5, rho: 7.9, price: '低', use: '结构材料、锅具' }
  };
  const TESTS = { cond: '导电性', hard: '硬度', rho: '密度' };

  window.EXPERIMENTS.push({
    id: 'd9-03', studentExp: 9, code: 'D9-01', title: '金属的物理性质',
    book: '下册', unit: '第九单元 金属', kind: '课标必做',
    opening: '换一种金属，分别测导电性、硬度和密度，比较它们的差异。',
    stageNote: '导电性以银为 100 作相对值；硬度为莫氏硬度；密度单位 g/cm³',
    init: () => ({ m: 'cu', test: 'cond', done: {} }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="金属的物理性质">
      <text x="230" y="30" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">金属片 → 通电 / 刻划 / 测体积</text>
      <text id="mName" x="230" y="52" font-size="13" fill="var(--ink)" text-anchor="middle"
            font-weight="700" font-family="var(--f-sans)">铜 Cu</text>

      <!-- 金属片 -->
      <rect id="plate" x="150" y="150" width="160" height="70" rx="4"
            fill="#c1703f" stroke="var(--ink)" stroke-width="1.6"/>
      <text id="plateSym" x="230" y="192" font-size="24" fill="rgba(255,255,255,.85)"
            text-anchor="middle" font-family="var(--f-num)">Cu</text>

      <!-- 电路：电池 + 灯泡 + 导线 -->
      <g id="circuit">
        <rect x="60" y="96" width="54" height="30" rx="3" fill="var(--paper-2)" stroke="var(--ink)" stroke-width="1.5"/>
        <line x1="87" y1="96" x2="87" y2="86" stroke="var(--ink)" stroke-width="2"/>
        <text x="87" y="144" font-size="9.5" fill="var(--muted)" text-anchor="middle" font-family="var(--f-sans)">电源</text>
        <path d="M60 111 H40 V185 H150" fill="none" stroke="var(--ink)" stroke-width="1.5"/>
        <path d="M114 111 H300 V132" fill="none" stroke="var(--ink)" stroke-width="1.5"/>
        <path d="M300 200 V232 H310" fill="none" stroke="var(--ink)" stroke-width="1.5"/>
        <path d="M150 232 H310" fill="none" stroke="var(--ink)" stroke-width="1.5"/>
        <circle id="bulbGlow" cx="300" cy="160" r="0" fill="#f6d68a" opacity=".55"/>
        <circle cx="300" cy="160" r="18" fill="var(--paper-2)" stroke="var(--ink)" stroke-width="1.5"/>
        <path d="M292 162 q4 -12 8 0 q4 12 8 0" fill="none" stroke="#e8a33d" stroke-width="1.6"/>
        <text x="300" y="196" font-size="9.5" fill="var(--muted)" text-anchor="middle" font-family="var(--f-sans)">灯泡</text>
      </g>

      <!-- 硬度：划痕 -->
      <g id="scratch" opacity="0">
        <line x1="176" y1="176" x2="252" y2="176" stroke="#fff" stroke-width="1.6" opacity=".9"/>
        <line x1="176" y1="188" x2="238" y2="188" stroke="#fff" stroke-width="1.2" opacity=".75"/>
        <line x1="176" y1="200" x2="246" y2="200" stroke="#fff" stroke-width="1" opacity=".6"/>
        <text x="230" y="248" font-size="10.5" fill="var(--muted)" text-anchor="middle"
              font-family="var(--f-sans)">用钢针刻划</text>
      </g>

      <!-- 密度：量筒 -->
      <g id="cyl" opacity="0" transform="translate(352,120)">
        <rect x="0" y="0" width="34" height="150" rx="6" fill="var(--paper-2)" fill-opacity=".7"
              stroke="var(--ink)" stroke-width="1.5"/>
        <rect id="water" x="3" y="40" width="28" height="104" fill="rgba(120,170,210,.55)"/>
        <line id="wTop" x1="3" y1="40" x2="31" y2="40" stroke="#5f97bb" stroke-width="1.8"/>
        <text x="17" y="168" font-size="9.5" fill="var(--muted)" text-anchor="middle"
              font-family="var(--f-sans)">量筒</text>
        <text id="volTxt" x="17" y="18" font-size="9.5" fill="var(--muted)" text-anchor="middle"
              font-family="var(--f-num)">50</text>
      </g>

      <text id="readTxt" x="230" y="378" font-size="12" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
    </svg>`,
    draw(s, el) {
      const m = METALS[s.m];
      el.querySelector('#mName').textContent = `${m.n} ${m.sym}`;
      el.querySelector('#plate').setAttribute('fill', m.c);
      el.querySelector('#plateSym').textContent = m.sym;

      const isCond = s.test === 'cond';
      el.querySelector('#circuit').setAttribute('opacity', isCond ? 1 : .18);
      el.querySelector('#scratch').setAttribute('opacity', s.test === 'hard' ? 1 : 0);
      el.querySelector('#cyl').setAttribute('opacity', s.test === 'rho' ? 1 : 0);

      const glow = el.querySelector('#bulbGlow');
      const r = isCond ? 8 + m.cond * 0.22 : 0;
      glow.setAttribute('r', r);

      const vol = 50 + 100 / m.rho;   // 100 g 金属排开水的体积
      el.querySelector('#water').setAttribute('y', 144 - vol * .9);
      el.querySelector('#water').setAttribute('height', vol * .9);
      el.querySelector('#wTop').setAttribute('y1', 144 - vol * .9);
      el.querySelector('#wTop').setAttribute('y2', 144 - vol * .9);
      el.querySelector('#volTxt').textContent = `${vol.toFixed(1)} mL`;

      const txt = s.test === 'cond'
        ? `灯泡亮度反映导电性：相对值 ${m.cond}（银 = 100）`
        : s.test === 'hard'
          ? `莫氏硬度 ${m.hard}，钢针（约 5.5）能划出痕`
          : `100 g 该金属排开水的体积 ${vol.toFixed(1)} mL，密度 ${m.rho} g/cm³`;
      el.querySelector('#readTxt').textContent = txt;
    },
    controls(s) {
      return [{
        type: 'opts', id: 'metal', label: '① 选金属',
        options: Object.keys(METALS).map(k => ({ v: k, t: `${METALS[k].n} ${METALS[k].sym}` })),
        get: st => st.m,
        pick: (st, v) => { st.m = v; },
        state: (st, o) => st.done[o.v] ? 'ok' : (st.m === o.v ? 'on' : '')
      }, {
        type: 'seg', id: 'test', label: '② 选测试项目',
        options: [{ v: 'cond', t: '导电性' }, { v: 'hard', t: '硬度' }, { v: 'rho', t: '密度' }],
        get: st => st.test, set: (st, v) => { st.test = v; }
      }];
    },
    actLabels: { record: '记录这一项', reset: '重置' },
    secondary: ['reset'],
    actions: {
      record(s, api) {
        const m = METALS[s.m];
        s.done[s.m + ':' + s.test] = 1;
        const n = Object.keys(s.done).length;
        const v = s.test === 'cond' ? `相对导电性 ${m.cond}` :
          s.test === 'hard' ? `莫氏硬度 ${m.hard}` : `密度 ${m.rho} g/cm³`;
        api.say(`<b>${m.n}</b>：${v}。`, 'ok');
        if (n >= 15) {
          api.conclude('金属物理性质的差异', [
            '<b>导电、导热性</b>：银 > 铜 > 铝 > 锌 > 铁。银最好，但太贵，所以导线用<b>铜</b>。',
            '<b>硬度</b>：铁 > 铜 > 铝 ≈ 锌 ≈ 银。所以菜刀用铁，不用铝。',
            '<b>密度</b>：银 10.5 > 铜 8.9 > 铁 7.9 > 锌 7.1 > 铝 2.7。铝合金轻，用于飞机、门窗。',
            '选材要看<b>性能 + 价格 + 加工</b>三者：导线用铜、锅用铁或铝、首饰用金银。',
            '金属的物理性质（颜色、光泽、导电导热、延展性）不需要发生化学变化就能表现。'
          ]);
        } else if (s.m === 'cu' && s.test === 'cond') {
          api.say('铜的导电性仅次于银，价格却低得多 —— 这就是导线用铜不用银的原因。', 'ok');
        }
      },
      reset(s, api) {
        s.done = {}; api.clearConcl(); api.say('已重置，重新记录。');
      }
    },
    hud(s) {
      const m = METALS[s.m];
      return [
        { label: '导电性', value: String(m.cond), hi: s.test === 'cond' },
        { label: '硬度', value: String(m.hard), hi: s.test === 'hard' },
        { label: '密度', value: m.rho + ' g/cm³', hi: s.test === 'rho' },
        { label: '已记录', value: `${Object.keys(s.done).length}/15` }
      ];
    }
  });
})();

/* ---------------- 统一按教材顺序排列（排序稳定，组内保持定义顺序） ---------------- */
(function () {
  const ORDER = ['第一单元', '第二单元', '第三单元', '第四单元', '第五单元', '第六单元',
    '第七单元', '第八单元', '第九单元', '第十单元', '第十一单元'];
  const idx = e => {
    const i = ORDER.findIndex(u => (e.unit || '').includes(u));
    return i < 0 ? 99 : i;
  };
  /* 同一单元内：先按 U/D 编号，跨学科实践（K）排在单元末尾 */
  const sub = e => {
    const m = (e.code || '').match(/^[UD]\d+-(\d+)$/);
    if (m) return +m[1];
    const k = (e.code || '').match(/^K(\d+)$/);
    return k ? 40 + +k[1] : 99;
  };
  (window.EXPERIMENTS || []).sort((a, b) => idx(a) - idx(b) || sub(a) - sub(b));
})();

/* ---------------- K07 揭秘暖宝宝（跨学科实践7） ---------------- */
(function () {
  window.EXPERIMENTS.push({
    id: 'k07', code: 'K07', title: '揭秘"暖宝宝"',
    book: '下册', unit: '第九单元 金属', kind: '跨学科实践',
    opening: '改一改铁粉、活性炭、食盐的比例，看发热峰值和持续时间怎么变。',
    stageNote: '曲线为教学模型，趋势正确、数值不对应真实产品；实际配方属商业机密',
    init: () => ({ fe: 8, c: 2, salt: 1, on: false }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="暖宝宝发热">
      <text x="230" y="30" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">铁粉 + 活性炭 + 食盐 + 水 → 缓慢氧化放热</text>

      <!-- 暖宝宝袋 -->
      <g transform="translate(56,64)">
        <rect x="0" y="0" width="110" height="140" rx="8" fill="var(--paper-2)"
              stroke="var(--ink)" stroke-width="1.7"/>
        <g id="powder"></g>
        <text x="55" y="118" font-size="9.5" fill="var(--muted)" text-anchor="middle"
              font-family="var(--f-sans)">无纺布袋</text>
      </g>

      <!-- 温度曲线 -->
      <g transform="translate(190,64)">
        <line x1="0" y1="140" x2="248" y2="140" stroke="var(--ink)" stroke-width="1.4"/>
        <line x1="0" y1="0" x2="0" y2="140" stroke="var(--ink)" stroke-width="1.4"/>
        <text x="248" y="156" font-size="9.5" fill="var(--muted)" text-anchor="end"
              font-family="var(--f-sans)">时间 / h</text>
        <text x="4" y="12" font-size="9.5" fill="var(--muted)" font-family="var(--f-sans)">℃</text>
        <line x1="0" y1="60" x2="248" y2="60" stroke="var(--line)" stroke-dasharray="3 4"/>
        <text x="4" y="56" font-size="9" fill="var(--faint)" font-family="var(--f-num)">40</text>
        <path id="curve" d="" fill="none" stroke="var(--accent)" stroke-width="2.2"/>
        <circle id="peakDot" cx="0" cy="0" r="3.4" fill="var(--accent)" opacity="0"/>
      </g>

      <text id="peakTxt" x="230" y="296" font-size="13" fill="var(--ink)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
      <text id="durTxt" x="230" y="324" font-size="12" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
      <text id="whyTxt" x="230" y="360" font-size="11.5" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
    </svg>`,
    draw(s, el) {
      const r = calc(s);
      const dots = [];
      for (let i = 0; i < 40; i++) {
        const x = i * 6;
        const t = i * 0.08;
        const temp = 20 + (r.peak - 20) * Math.exp(-Math.pow((t - r.peakAt) / r.width, 2));
        const y = 140 - (temp - 15) * 1.9;
        dots.push(`${x.toFixed(1)},${Math.max(0, y).toFixed(1)}`);
      }
      el.querySelector('#curve').setAttribute('d', 'M' + dots.join(' L'));

      const px = r.peakAt * 6 / 0.08 * 0.08 * 6; // 峰值横坐标（简化）
      const peakX = Math.min(240, r.peakAt / 0.08 * 6);
      const peakY = 140 - (r.peak - 15) * 1.9;
      el.querySelector('#peakDot').setAttribute('cx', peakX);
      el.querySelector('#peakDot').setAttribute('cy', Math.max(0, peakY));
      el.querySelector('#peakDot').setAttribute('opacity', 1);

      el.querySelector('#powder').innerHTML = [
        ...Array.from({ length: Math.round(s.fe * 1.2) }, (_, i) =>
          `<circle cx="${10 + (i * 23) % 90}" cy="${10 + (i * 31) % 90}" r="2"
             fill="#3a3a3e" opacity=".8"/>`),
        ...Array.from({ length: Math.round(s.c * 2) }, (_, i) =>
          `<circle cx="${14 + (i * 37) % 82}" cy="${16 + (i * 19) % 84}" r="2.6"
             fill="#16161a"/>`)
      ].join('');

      el.querySelector('#peakTxt').textContent = `峰值温度约 ${r.peak.toFixed(0)} ℃`;
      el.querySelector('#durTxt').textContent = `有效发热约 ${r.dur.toFixed(1)} 小时`;
      el.querySelector('#whyTxt').textContent = s.salt === 0
        ? '没有食盐，缺少电解质，铁粉氧化很慢 —— 几乎不热'
        : s.c === 0
          ? '没有活性炭，不能形成原电池，发热明显变慢'
          : '食盐作电解质、活性炭构成原电池，两者都在加速铁的氧化';
    },
    controls(s) {
      return [{
        type: 'range', id: 'fe', label: '① 铁粉', min: 3, max: 15, step: 1, unit: ' g',
        get: st => st.fe, set: (st, v) => { st.fe = v; }
      }, {
        type: 'range', id: 'c', label: '② 活性炭', min: 0, max: 4, step: 0.5, unit: ' g',
        get: st => st.c, set: (st, v) => { st.c = v; }
      }, {
        type: 'range', id: 'salt', label: '③ 食盐', min: 0, max: 2, step: 0.5, unit: ' g',
        get: st => st.salt, set: (st, v) => { st.salt = v; }
      }];
    },
    actLabels: { test: '封袋，测 8 小时', reset: '重置' },
    secondary: ['reset'],
    actions: {
      test(s, api) {
        const r = calc(s);
        if (s.salt === 0) {
          api.say('8 小时只升到三十几度 —— 没有食盐作电解质，铁粉氧化极慢，这就是"无盐不热"的原因。', 'warn');
        } else if (s.c === 0) {
          api.say('能发热，但升温慢、峰值低。活性炭与铁粉形成原电池，是加速反应的关键。', 'warn');
        } else {
          api.say(`峰值 ${r.peak.toFixed(0)} ℃，有效发热 ${r.dur.toFixed(1)} 小时。<br>
            铁粉越多，总热量越大、持续越久；食盐和活性炭决定"起效快不快"。`, 'ok');
        }
        if (s.salt > 0 && s.c > 0 && s.fe >= 6) {
          api.conclude('暖宝宝的化学原理', [
            '发热主体：<b>4Fe + 3O₂ + 6H₂O = 4Fe(OH)₃</b>，铁缓慢氧化放热。',
            '活性炭：疏松多孔，吸附氧气和水分，并与铁粉形成<b>原电池</b>，加速电子转移。',
            '食盐：提供电解质溶液，让原电池导通 —— <b>没有盐几乎不热</b>。',
            '蛭石：保水隔热，让热量缓慢释放；无纺布袋控制氧气进入速率。',
            '这是<b>缓慢氧化</b>，不是燃烧：放热平缓、不发光、持续数小时。',
            '安全：不直接贴皮肤（低温烫伤）、睡觉不用、婴幼儿慎用。'
          ]);
        }
      },
      reset(s, api) {
        Object.assign(s, { fe: 8, c: 2, salt: 1 }); api.clearConcl(); api.say('已重置。');
      }
    },
    hud(s) {
      const r = calc(s);
      return [
        { label: '峰值温度', value: r.peak.toFixed(0) + ' ℃', hi: r.peak > 50 },
        { label: '持续时间', value: r.dur.toFixed(1) + ' h' },
        { label: '总热量', value: '随铁粉量' },
        { label: '起效', value: s.salt > 0 && s.c > 0 ? '快' : '慢', hi: s.salt > 0 && s.c > 0 }
      ];
    }
  });

  function calc(s) {
    const cat = s.c > 0 ? 1 : 0.35;
    const salt = s.salt > 0 ? 1 : 0.3;
    const peak = Math.min(70, 26 + s.fe * 2.4 * cat * salt + s.c * 2.2 + s.salt * 4);
    const dur = 2 + s.fe * 0.55 * (0.6 + 0.4 * salt);
    return { peak, dur, peakAt: Math.min(5, 1 + s.fe * 0.25), width: 2.2 };
  }
})();

/* ---------------- K08 空间站再生生保（跨学科实践8） ---------------- */
(function () {
  const O2 = 0.84, CO2 = 1.0;   // kg / 人 / 天
  window.EXPERIMENTS.push({
    id: 'k08', code: 'K08', title: '空间站"再生生保系统"方案设计',
    book: '下册', unit: '第十单元 化学与健康', kind: '跨学科实践',
    opening: '设定乘员和天数，算一算要带多少水、能回收多少。',
    stageNote: '按每人每天耗氧 0.84 kg、呼出 CO₂ 1.0 kg 估算；电解水制氧 1 kg O₂ 需 1.125 kg 水',
    init: () => ({ n: 3, d: 30, sab: true }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="空间站物质循环">
      <text x="230" y="30" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">水 → 氧 → 二氧化碳 → 水，闭环</text>

      <g font-family="var(--f-sans)">
        <rect x="36" y="80" width="104" height="52" rx="6" fill="var(--paper-2)" stroke="var(--ink)" stroke-width="1.4"/>
        <text x="88" y="102" font-size="11.5" fill="var(--ink)" text-anchor="middle">电解水</text>
        <text x="88" y="120" font-size="10" fill="var(--muted)" text-anchor="middle">2H₂O =通电= 2H₂↑+O₂↑</text>

        <rect x="196" y="80" width="104" height="52" rx="6" fill="var(--paper-2)" stroke="var(--ink)" stroke-width="1.4"/>
        <text x="248" y="102" font-size="11.5" fill="var(--ink)" text-anchor="middle">乘员呼吸</text>
        <text x="248" y="120" font-size="10" fill="var(--muted)" text-anchor="middle">耗 O₂ / 产 CO₂</text>

        <rect x="326" y="80" width="100" height="52" rx="6" fill="var(--paper-2)" stroke="var(--ink)" stroke-width="1.4"/>
        <text x="376" y="102" font-size="11.5" fill="var(--ink)" text-anchor="middle">Sabatier</text>
        <text x="376" y="120" font-size="9" fill="var(--muted)" text-anchor="middle">CO₂+4H₂→CH₄+2H₂O</text>

        <path d="M140 106 H196" stroke="var(--ink)" stroke-width="1.4" marker-end="url(#ar)"/>
        <path d="M300 106 H326" stroke="var(--ink)" stroke-width="1.4" marker-end="url(#ar)"/>
        <path d="M376 132 V190 H88 V132" stroke="var(--ink)" stroke-width="1.4" fill="none" marker-end="url(#ar)"/>
        <text x="232" y="208" font-size="10" fill="var(--muted)" text-anchor="middle">回收的水再电解</text>
      </g>
      <defs>
        <marker id="ar" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" fill="var(--ink)"/>
        </marker>
      </defs>

      <g id="nums" font-family="var(--f-sans)"></g>

      <text id="loopTxt" x="230" y="378" font-size="12.5" fill="var(--accent)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
    </svg>`,
    draw(s, el) {
      const r = calc(s);
      el.querySelector('#nums').innerHTML = [
        ['需氧', r.o2.toFixed(0) + ' kg', 88, 60],
        ['呼出 CO₂', r.co2.toFixed(0) + ' kg', 248, 60],
        ['回收水', r.back.toFixed(0) + ' kg', 376, 60]
      ].map(([k, v, x, y]) => `
        <text x="${x}" y="${y}" font-size="10" fill="var(--muted)" text-anchor="middle">${k}</text>
        <text x="${x}" y="${y + 16}" font-size="15" fill="var(--ink)" text-anchor="middle"
              font-family="var(--f-num)">${v.replace(' kg', '')}</text>`).join('');

      el.querySelector('#loopTxt').textContent =
        `水回收率约 ${(r.rate * 100).toFixed(0)}% ｜ 净耗水 ${r.net.toFixed(0)} kg`;
    },
    controls(s) {
      return [{
        type: 'range', id: 'n', label: '① 乘员人数', min: 1, max: 6, step: 1, unit: ' 人',
        get: st => st.n, set: (st, v) => { st.n = v; }
      }, {
        type: 'range', id: 'd', label: '② 驻留天数', min: 5, max: 180, step: 5, unit: ' 天',
        get: st => st.d, set: (st, v) => { st.d = v; }
      }, {
        type: 'seg', id: 'sab', label: '③ 用不用 Sabatier 反应',
        options: [{ v: '1', t: '用（回收 CO₂）' }, { v: '0', t: '不用' }],
        get: st => (st.sab ? '1' : '0'), set: (st, v) => { st.sab = v === '1'; }
      }];
    },
    actLabels: { plan: '生成物料平衡表', reset: '重置' },
    secondary: ['reset'],
    actions: {
      plan(s, api) {
        const r = calc(s);
        api.say(`<b>${s.n} 人 × ${s.d} 天</b>：需氧 ${r.o2.toFixed(0)} kg，呼出 CO₂ ${r.co2.toFixed(0)} kg。<br>
          电解这些水要 ${r.water.toFixed(0)} kg，Sabatier 能回收 ${r.back.toFixed(0)} kg，
          净耗水 <b>${r.net.toFixed(0)} kg</b>，水回收率 ${(r.rate * 100).toFixed(0)}%。`, 'ok');
        api.conclude('再生生保的三步闭环', [
          '<b>制氧</b>：2H₂O =通电= 2H₂↑ + O₂↑，1 kg O₂ 需 1.125 kg 水，同时副产 0.125 kg H₂。',
          '<b>除碳</b>：CO₂ + 4H₂ =催化剂= CH₄ + 2H₂O（Sabatier），1 kg CO₂ 可回收约 0.82 kg 水。',
          '<b>循环</b>：回收的水再电解，形成"水—氧—碳"闭环，回收率可达 90% 以上。',
          `本例：需水 ${r.water.toFixed(0)} kg，回收 ${r.back.toFixed(0)} kg，净耗 ${r.net.toFixed(0)} kg。`,
          '为什么必须再生：把 1 kg 物资送上空间站成本极高，带水上去等于带钱上去。',
          '注意：甲烷是副产物，不能直接排放，需储存或进一步处理；系统必须有备份。'
        ]);
      },
      reset(s, api) { Object.assign(s, { n: 3, d: 30, sab: true }); api.clearConcl(); api.say('已重置。'); }
    },
    hud(s) {
      const r = calc(s);
      return [
        { label: '需氧', value: r.o2.toFixed(0) + ' kg' },
        { label: '需电解水', value: r.water.toFixed(0) + ' kg' },
        { label: '回收水', value: r.back.toFixed(0) + ' kg', hi: s.sab },
        { label: '净耗水', value: r.net.toFixed(0) + ' kg' }
      ];
    }
  });

  function calc(s) {
    const days = s.n * s.d;
    const o2 = O2 * days;
    const co2 = CO2 * days;
    const water = o2 * 1.125;
    const back = s.sab ? co2 * 0.818 : 0;
    const net = Math.max(0, water - back);
    return { o2, co2, water, back, net, rate: back / water };
  }
})();

/* ---------------- K09 制造再生纸（跨学科实践9） ---------------- */
(function () {
  const FIBER = {
    news: { n: '新闻纸（短纤维）', k: 0.9, s: 0.85 },
    print: { n: '打印纸（中长纤维）', k: 1.0, s: 1.0 },
    board: { n: '瓦楞纸板（长纤维）', k: 1.2, s: 1.25 }
  };

  window.EXPERIMENTS.push({
    id: 'k09', code: 'K09', title: '制造再生纸',
    book: '下册', unit: '第十一单元 化学与社会发展', kind: '跨学科实践',
    opening: '调纸浆浓度、换纤维种类，看抄出来的纸有多厚、多结实。',
    stageNote: '定量与强度为教学模型，用于比较趋势；实际抄纸还受打浆度、压榨、干燥影响',
    init: () => ({ c: 1.0, f: 'print' }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="制造再生纸">
      <text x="230" y="30" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">废纸 → 撕碎 → 浸泡 → 打浆 → 抄纸 → 压平 → 干燥</text>

      <!-- 浆槽 -->
      <g transform="translate(48,74)">
        <path d="M0 10 h150 l-10 100 h-130 Z" fill="var(--paper-2)" fill-opacity=".6"
              stroke="var(--ink)" stroke-width="1.7"/>
        <rect id="pulp" x="10" y="40" width="130" height="66" fill="rgba(210,210,205,.75)"/>
        <line id="pulpTop" x1="10" y1="40" x2="140" y2="40" stroke="#a9a9a3" stroke-width="2"/>
        <g id="fibers"></g>
        <text x="75" y="128" font-size="9.5" fill="var(--muted)" text-anchor="middle"
              font-family="var(--f-sans)">纸浆槽</text>
      </g>

      <!-- 抄纸网 + 湿纸页 -->
      <g transform="translate(236,86)">
        <rect x="0" y="0" width="150" height="14" rx="2" fill="var(--paper-3)" stroke="var(--ink)" stroke-width="1.5"/>
        <g id="mesh"></g>
        <rect id="sheet" x="14" y="-2" width="122" height="6" rx="1" fill="#e8e4d8"
              stroke="#b9b2a4" stroke-width="1"/>
        <text x="75" y="34" font-size="9.5" fill="var(--muted)" text-anchor="middle"
              font-family="var(--f-sans)">抄纸网（湿纸页）</text>
      </g>

      <text id="basisTxt" x="230" y="270" font-size="14" fill="var(--ink)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
      <text id="strTxt" x="230" y="298" font-size="12" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
      <text id="judgeTxt" x="230" y="330" font-size="12" fill="var(--accent)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
      <text id="saveTxt" x="230" y="362" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
    </svg>`,
    draw(s, el) {
      const r = calc(s);
      const h = 20 + Math.min(80, r.basis * 1.4);
      el.querySelector('#pulp').setAttribute('y', 106 - h);
      el.querySelector('#pulp').setAttribute('height', h);
      el.querySelector('#pulpTop').setAttribute('y1', 106 - h);
      el.querySelector('#pulpTop').setAttribute('y2', 106 - h);

      el.querySelector('#fibers').innerHTML = Array.from({ length: Math.min(26, 4 + Math.round(s.c * 8)) }, (_, i) =>
        `<line x1="${14 + (i * 29) % 118}" y1="${48 + (i * 23) % 56}"
           x2="${26 + (i * 29) % 118}" y2="${52 + (i * 23) % 56}"
           stroke="#8d8a80" stroke-width=".9" opacity=".7"/>`).join('');

      const thick = 4 + Math.min(8, r.basis / 22);
      el.querySelector('#sheet').setAttribute('height', thick);
      el.querySelector('#sheet').setAttribute('y', -thick + 1);

      el.querySelector('#mesh').innerHTML = Array.from({ length: 14 }, (_, i) =>
        `<line x1="${i * 11}" y1="0" x2="${i * 11}" y2="14" stroke="var(--muted)" stroke-width=".5" opacity=".45"/>`).join('');

      el.querySelector('#basisTxt').textContent = `定量 ${r.basis.toFixed(0)} g/m²`;
      el.querySelector('#strTxt').textContent =
        `抗张强度 ${r.str.toFixed(2)} kN/m ｜ 吸水率 ${r.absorb.toFixed(0)}%`;
      el.querySelector('#judgeTxt').textContent = r.judge;
      el.querySelector('#saveTxt').textContent = `每吨废纸可再造 ${(0.8 * 1000).toFixed(0)} kg 再生纸，省木材 3 m³、水 100 t`;
    },
    controls(s) {
      return [{
        type: 'seg', id: 'f', label: '① 废纸种类',
        options: Object.keys(FIBER).map(k => ({ v: k, t: FIBER[k].n })),
        get: st => st.f, set: (st, v) => { st.f = v; }
      }, {
        type: 'range', id: 'c', label: '② 纸浆浓度', min: 0.3, max: 3, step: 0.1, unit: ' %',
        get: st => st.c, fmt: v => v.toFixed(1), set: (st, v) => { st.c = v; }
      }];
    },
    actLabels: { make: '抄一张纸', reset: '重置' },
    secondary: ['reset'],
    actions: {
      make(s, api) {
        const r = calc(s);
        api.say(`抄出 <b>${r.basis.toFixed(0)} g/m²</b> 的纸，抗张强度 ${r.str.toFixed(2)} kN/m。<br>${r.judge}`, 'ok');
        api.conclude('再生纸的工艺与指标', [
          '流程：<b>收集 → 撕碎 → 温水浸泡 → 打浆 → 抄纸 → 压平 → 干燥</b>。',
          '打浆让纤维分丝帚化，纤维之间才能重新结合 —— 这是强度的来源。',
          '定量（g/m²）由纸浆浓度决定；强度还取决于<b>纤维长度</b>，长纤维纸板 > 打印纸 > 新闻纸。',
          '再生纸纤维会变短，一般只能循环 5–7 次，所以仍需掺部分原浆。',
          '化学环节：制浆用碱煮除木质素，漂白传统用含氯剂（产生二噁英），现在多用 H₂O₂ 无氯漂白。',
          '意义：每回收 1 t 废纸，省木材 3 m³、水 100 t、电 600 kW·h，减少固体废物。'
        ]);
      },
      reset(s, api) { Object.assign(s, { c: 1.0, f: 'print' }); api.clearConcl(); api.say('已重置。'); }
    },
    hud(s) {
      const r = calc(s);
      return [
        { label: '定量', value: r.basis.toFixed(0) + ' g/m²' },
        { label: '抗张强度', value: r.str.toFixed(2) + ' kN/m' },
        { label: '吸水率', value: r.absorb.toFixed(0) + '%' },
        { label: '评价', value: r.short }
      ];
    }
  });

  function calc(s) {
    const f = FIBER[s.f];
    const basis = s.c * 62 * f.k;
    const str = basis * 0.036 * f.s;
    const absorb = Math.max(30, 150 - s.c * 32);
    let judge = '厚度与强度适中，接近普通打印纸。', short = '适中';
    if (basis < 45) { judge = '太薄，抄起来容易破，只能做低定量纸。'; short = '偏薄'; }
    else if (basis > 120) { judge = '太厚，干燥慢、易起皱，接近纸板。'; short = '偏厚'; }
    else if (str < 1.6) { judge = '强度偏低，纤维短、交织不够。'; short = '偏弱'; }
    else if (str > 3.2) { judge = '强度很好，接近包装纸板。'; short = '偏强'; }
    return { basis, str, absorb, judge, short };
  }
})();
