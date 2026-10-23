/* ============================================================
   实验数据 · 八年级下册（人教版 2024）
   ============================================================ */
window.EXPERIMENTS = window.EXPERIMENTS || [];

/* ---------------- P7-01 探究重力与质量的关系 ---------------- */
(function () {
  window.EXPERIMENTS.push({
    id: 'p7-01', code: 'P7-01', title: '探究重力与质量的关系',
    book: '八年级下册', unit: '第七章 力', kind: '学生实验',
    opening: '逐个增加钩码，用弹簧测力计测重力，画出 G–m 图像。',
    stageNote: 'g = 9.8 N/kg，粗略计算可取 10 N/kg',
    init: () => ({ n: 2 }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="重力与质量">
      <text x="230" y="28" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">弹簧测力计竖直悬挂钩码</text>

      <g id="springG" transform="translate(96,64)"></g>
      <g id="hooks"></g>

      <g transform="translate(250,64)">
        <line x1="0" y1="180" x2="170" y2="180" stroke="var(--ink)" stroke-width="1.4"/>
        <line x1="0" y1="0" x2="0" y2="180" stroke="var(--ink)" stroke-width="1.4"/>
        <text x="170" y="198" font-size="9.5" fill="var(--muted)" text-anchor="end"
              font-family="var(--f-sans)">m / kg</text>
        <text x="6" y="12" font-size="9.5" fill="var(--muted)" font-family="var(--f-sans)">G / N</text>
        <g id="axes"></g>
        <path id="line" d="" stroke="var(--accent)" stroke-width="2"/>
        <g id="dots"></g>
      </g>

      <text id="gTxt" x="230" y="320" font-size="15" fill="var(--ink)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
      <text id="noteTxt" x="230" y="350" font-size="11.5" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
    </svg>`,
    draw(s, el) {
      const G = s.n * 0.5 * 9.8;
      el.querySelector('#springG').innerHTML =
        window.Parts.spring({ x: 0, y: 0, h: 170, w: 42, reading: G, max: 30 });
      el.querySelector('#hooks').innerHTML = Array.from({ length: s.n }, (_, i) =>
        `<rect x="104" y="${252 + i * 22}" width="26" height="18" rx="2"
           fill="var(--paper-3)" stroke="var(--ink)" stroke-width="1.3"/>`).join('') +
        `<text x="117" y="${252 + s.n * 22 + 14}" font-size="9.5" fill="var(--muted)"
           text-anchor="middle" font-family="var(--f-sans)">${s.n} 个钩码（每个 50 g）</text>`;

      el.querySelector('#axes').innerHTML = [0, 10, 20, 30].map(v => {
        const y = 180 - v / 30 * 180;
        return `<line x1="0" y1="${y}" x2="170" y2="${y}" stroke="var(--line-2)"/>
          <text x="-4" y="${y + 3}" font-size="8" fill="var(--faint)" text-anchor="end"
                font-family="var(--f-num)">${v}</text>`;
      }).join('') + [0, 0.1, 0.2, 0.3].map(v => {
        const x = v / 0.3 * 170;
        return `<line x1="${x}" y1="0" x2="${x}" y2="180" stroke="var(--line-2)"/>
          <text x="${x}" y="194" font-size="8" fill="var(--faint)" text-anchor="middle"
                font-family="var(--f-num)">${v.toFixed(1)}</text>`;
      }).join('');

      el.querySelector('#line').setAttribute('d', 'M0 180 L170 0');
      el.querySelector('#dots').innerHTML = Array.from({ length: 6 }, (_, i) => {
        const m = i * 0.05, g = m * 9.8;
        return `<circle cx="${g / 30 * 180 * 0 + m / 0.3 * 170}" cy="${180 - g / 30 * 180}" r="2.6"
          fill="var(--accent)"/>`;
      }).join('');

      el.querySelector('#gTxt').textContent = `G = ${G.toFixed(1)} N`;
      el.querySelector('#noteTxt').textContent =
        `m = ${(s.n * 0.05).toFixed(2)} kg，G/m = ${(G / (s.n * 0.05)).toFixed(1)} N/kg`;
    },
    controls(s) {
      return [{
        type: 'range', id: 'n', label: '① 钩码个数（每个 50 g）', min: 1, max: 5, step: 1, unit: ' 个',
        get: st => st.n, set: (st, v) => { st.n = v; }
      }];
    },
    actLabels: { measure: '读出测力计示数', reset: '重置' },
    secondary: ['reset'],
    actions: {
      measure(s, api) {
        const G = s.n * 0.5 * 9.8;
        api.say(`质量 ${(s.n * 0.05).toFixed(2)} kg，重力 <b>${G.toFixed(1)} N</b>，G/m = ${(G / (s.n * 0.05)).toFixed(1)} N/kg。`, 'ok');
        api.conclude('重力与质量的关系', [
          '物体所受重力跟它的质量成<b>正比</b>：<b>G = mg</b>。',
          'g = 9.8 N/kg，表示 1 kg 的物体受到的重力是 9.8 N；粗略计算取 10 N/kg。',
          'g 随纬度、海拔变化：赤道略小、两极略大，高山上略小。',
          '重力方向<b>竖直向下</b>，不是"垂直向下"；重垂线就是利用这一点。',
          '重心不一定在物体上，如圆环的重心在环心。',
          '质量是物体本身的属性，重力随位置变化 —— 到月球上重力变小，质量不变。'
        ]);
      },
      reset(s, api) { s.n = 2; api.clearConcl(); api.say('已重置。'); }
    },
    hud(s) {
      const G = s.n * 0.5 * 9.8;
      return [
        { label: '质量 m', value: (s.n * 0.05).toFixed(2) + ' kg' },
        { label: '重力 G', value: G.toFixed(1) + ' N', hi: true },
        { label: 'G/m', value: '9.8 N/kg' },
        { label: '方向', value: '竖直向下' }
      ];
    }
  });
})();

/* ---------------- P8-01 阻力对物体运动的影响 ---------------- */
(function () {
  const SURF = {
    towel: { n: '毛巾', mu: 0.35, c: 'rgba(220,180,150,.45)' },
    cloth: { n: '棉布', mu: 0.22, c: 'rgba(210,205,190,.5)' },
    wood: { n: '木板', mu: 0.12, c: 'rgba(200,170,120,.45)' }
  };
  window.EXPERIMENTS.push({
    id: 'p8-01', code: 'P8-01', title: '探究阻力对物体运动的影响',
    book: '八年级下册', unit: '第八章 运动和力', kind: '学生实验',
    opening: '让小车从同一高度滑下，换不同表面，比较滑行的距离。',
    stageNote: '同一高度是为了让小车到达水平面时速度相同（控制变量）',
    init: () => ({ surf: 'wood', run: 0 }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="阻力对运动的影响">
      <text x="230" y="28" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">同一高度释放，表面越光滑滑得越远</text>

      <path d="M60 150 L120 262" stroke="var(--ink)" stroke-width="2.2"/>
      <rect id="surface" x="120" y="262" width="290" height="10"/>
      <line x1="60" y1="150" x2="120" y2="150" stroke="var(--ink)" stroke-width="1" opacity=".4"/>
      <g id="cartG"></g>

      <g id="trace"></g>

      <text id="distTxt" x="230" y="318" font-size="16" fill="var(--ink)" text-anchor="middle"
            font-family="var(--f-num)">—</text>
      <text id="noteTxt" x="230" y="346" font-size="11.5" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
      <text id="lawTxt" x="230" y="378" font-size="12" fill="var(--accent)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
    </svg>`,
    draw(s, el) {
      const sf = SURF[s.surf];
      el.querySelector('#surface').setAttribute('fill', sf.c);
      el.querySelector('#surface').setAttribute('stroke', 'var(--ink)');
      const dist = distance(s);
      el.querySelector('#cartG').innerHTML =
        window.Parts.cart({ x: 130, y: 232, w: 46, h: 26 });
      el.querySelector('#trace').innerHTML = s.run
        ? `<line x1="130" y1="252" x2="${130 + dist * 210}" y2="252"
             stroke="var(--accent)" stroke-width="2" stroke-dasharray="5 3"/>
           <text x="${130 + dist * 210}" y="248" font-size="9.5" fill="var(--accent)"
                 text-anchor="middle" font-family="var(--f-num)">${(dist * 2).toFixed(2)} m</text>`
        : '';
      el.querySelector('#distTxt').textContent = s.run
        ? `滑行 ${(dist * 2).toFixed(2)} m` : '点"释放小车"';
      el.querySelector('#noteTxt').textContent = `${sf.n}表面，阻力系数约 ${sf.mu}`;
      el.querySelector('#lawTxt').textContent = s.run
        ? (s.surf === 'wood' ? '阻力越小，滑得越远 → 若不受阻力，将永远匀速直线运动' : '')
        : '';
    },
    controls(s) {
      return [{
        type: 'seg', id: 'surf', label: '① 水平面材料',
        options: Object.keys(SURF).map(k => ({ v: k, t: SURF[k].n })),
        get: st => st.surf, set: (st, v) => { st.surf = v; st.run = 0; }
      }];
    },
    actLabels: { run: '从同一高度释放', reset: '重置' },
    secondary: ['reset'],
    actions: {
      run(s, api) {
        s.run = 1;
        const d = distance(s) * 2;
        const sf = SURF[s.surf];
        api.say(`在${sf.n}上滑行 <b>${d.toFixed(2)} m</b> 后停下。<br>
          表面越光滑，阻力越小，滑行越远。`, 'ok');
        api.conclude('牛顿第一定律的得出', [
          '实验现象：毛巾 → 棉布 → 木板，阻力变小，小车滑行距离变长。',
          '科学推理：如果表面绝对光滑（不受阻力），小车将<b>永远做匀速直线运动</b>。',
          '<b>牛顿第一定律</b>：一切物体总保持静止状态或匀速直线运动状态，直到有外力迫使它改变这种状态为止。',
          '定律不能由实验直接验证（找不到完全不受力的物体），是<b>实验 + 推理</b>得出的。',
          '力不是维持运动的原因，而是<b>改变运动状态</b>的原因。',
          '小车必须从<b>同一高度</b>释放，保证到达水平面时速度相同。'
        ]);
      },
      reset(s, api) { s.run = 0; api.clearConcl(); api.say('已重置。'); }
    },
    hud(s) {
      const d = distance(s) * 2;
      return [
        { label: '表面', value: SURF[s.surf].n },
        { label: '阻力', value: s.surf === 'towel' ? '最大' : s.surf === 'cloth' ? '中等' : '最小', hi: true },
        { label: '滑行距离', value: s.run ? d.toFixed(2) + ' m' : '—' },
        { label: '推理', value: '不受力则匀速' }
      ];
    }
  });

  function distance(s) {
    const v = 2.4;                      // 到达水平面的速度 m/s
    const a = SURF[s.surf].mu * 9.8;
    return Math.min(1, v * v / (2 * a) / 4);
  }
})();

/* ---------------- P8-02 探究二力平衡的条件 ---------------- */
(function () {
  window.EXPERIMENTS.push({
    id: 'p8-02', code: 'P8-02', title: '探究二力平衡的条件',
    book: '八年级下册', unit: '第八章 运动和力', kind: '学生实验',
    opening: '在小车两端挂钩码，改变拉力大小和方向，看小车什么时候静止。',
    stageNote: '二力平衡：同物、等大、反向、共线，四个条件缺一不可',
    init: () => ({ f1: 2, f2: 2, line: true }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="二力平衡">
      <text x="230" y="28" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">两端拉力相等、方向相反、在同一直线上</text>

      <g id="table"></g>
      <g id="cartG"></g>
      <g id="forces"></g>
      <g id="pulleys"></g>

      <text id="stateTxt" x="230" y="300" font-size="17" fill="var(--ink)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
      <text id="whyTxt" x="230" y="330" font-size="11.5" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
      <text id="noteTxt" x="230" y="362" font-size="11" fill="var(--f-muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
    </svg>`,
    draw(s, el) {
      const balanced = s.f1 === s.f2 && s.line;
      el.querySelector('#table').innerHTML = `
        <rect x="60" y="176" width="340" height="12" fill="var(--paper-3)"
              stroke="var(--ink)" stroke-width="1.4"/>`;
      el.querySelector('#cartG').innerHTML =
        window.Parts.cart({ x: 202, y: 146, w: 56, h: 28 });

      el.querySelector('#pulleys').innerHTML =
        window.Parts.pulley({ x: 78, y: 168, r: 16 }) +
        window.Parts.pulley({ x: 382, y: 168, r: 16 });

      const len = 24 + s.f1 * 8, len2 = 24 + s.f2 * 8;
      el.querySelector('#forces').innerHTML = `
        <line x1="202" y1="160" x2="${202 - len}" y2="160" stroke="var(--accent)" stroke-width="2"/>
        <path d="M${202 - len} 160 l10 -5 v10 Z" fill="var(--accent)"/>
        <text x="${202 - len - 6}" y="156" font-size="10" fill="var(--accent)" text-anchor="end"
              font-family="var(--f-num)">${s.f1} N</text>
        <line x1="258" y1="160" x2="${258 + len2}" y2="160" stroke="var(--accent)" stroke-width="2"/>
        <path d="M${258 + len2} 160 l-10 -5 v10 Z" fill="var(--accent)"/>
        <text x="${258 + len2 + 6}" y="156" font-size="10" fill="var(--accent)"
              font-family="var(--f-num)">${s.f2} N</text>
        ${s.line ? `<line x1="${202 - len}" y1="160" x2="${258 + len2}" y2="160"
             stroke="var(--muted)" stroke-width=".8" stroke-dasharray="3 4" opacity=".6"/>` : ''}`;

      el.querySelector('#stateTxt').textContent = balanced ? '小车静止 —— 二力平衡' : '小车不能平衡';
      el.querySelector('#whyTxt').textContent = balanced
        ? '两个力大小相等、方向相反、作用在同一直线上'
        : s.f1 !== s.f2 ? '两边拉力不相等，小车会向拉力大的一侧加速'
          : '两个力不在同一直线上，小车会转动';
      el.querySelector('#noteTxt').textContent = s.line ? '两力共线' : '把小车扭转一个角度，两力不再共线';
    },
    controls(s) {
      return [{
        type: 'range', id: 'f1', label: '① 左端钩码（每个 0.5 N）', min: 1, max: 6, step: 1, unit: ' 个',
        get: st => st.f1, set: (st, v) => { st.f1 = v; }
      }, {
        type: 'range', id: 'f2', label: '② 右端钩码', min: 1, max: 6, step: 1, unit: ' 个',
        get: st => st.f2, set: (st, v) => { st.f2 = v; }
      }, {
        type: 'seg', id: 'line', label: '③ 两力是否共线',
        options: [{ v: '1', t: '共线' }, { v: '0', t: '扭转一个角度' }],
        get: st => (st.line ? '1' : '0'), set: (st, v) => { st.line = v === '1'; }
      }];
    },
    actLabels: { check: '观察小车状态', reset: '重置' },
    secondary: ['reset'],
    actions: {
      check(s, api) {
        const ok = s.f1 === s.f2 && s.line;
        if (ok) {
          api.say('小车保持<b>静止</b>，两个力彼此平衡。', 'ok');
        } else if (s.f1 !== s.f2) {
          api.say(`两边拉力不等（${s.f1} N vs ${s.f2} N），小车向拉力大的一侧运动，<b>不平衡</b>。`, 'warn');
        } else {
          api.say('两个力大小相等、方向相反，但<b>不在同一直线</b>上，小车会转动，仍然不平衡。', 'warn');
        }
        api.conclude('二力平衡的四个条件', [
          '作用在<b>同一物体</b>上（同体）。',
          '大小<b>相等</b>（等大）。',
          '方向<b>相反</b>（反向）。',
          '作用在<b>同一直线</b>上（共线）。',
          '四个条件缺一不可；平衡时物体保持静止或匀速直线运动。',
          '平衡力与相互作用力的区别：平衡力作用在同一物体上，相互作用力作用在两个物体上。'
        ]);
      },
      reset(s, api) { Object.assign(s, { f1: 2, f2: 2, line: true }); api.clearConcl(); api.say('已重置。'); }
    },
    hud(s) {
      const ok = s.f1 === s.f2 && s.line;
      return [
        { label: '左拉力', value: s.f1 + ' N' },
        { label: '右拉力', value: s.f2 + ' N' },
        { label: '是否共线', value: s.line ? '是' : '否' },
        { label: '平衡', value: ok ? '是' : '否', hi: ok }
      ];
    }
  });
})();

/* ---------------- P8-03 探究滑动摩擦力的大小 ---------------- */
(function () {
  const SURF = {
    wood: { n: '木板', mu: 0.30 },
    towel: { n: '毛巾', mu: 0.55 },
    glass: { n: '玻璃', mu: 0.18 }
  };
  window.EXPERIMENTS.push({
    id: 'p8-03', code: 'P8-03', title: '探究滑动摩擦力大小的因素',
    book: '八年级下册', unit: '第八章 运动和力', kind: '学生实验',
    opening: '用弹簧测力计匀速拉木块，改变压力和接触面，读拉力。',
    stageNote: '必须匀速拉动：此时拉力与摩擦力二力平衡，示数才等于摩擦力',
    init: () => ({ surf: 'wood', weight: 4, pull: 0 }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="滑动摩擦力">
      <text x="230" y="28" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">匀速拉动时，拉力 = 摩擦力</text>

      <rect id="surface" x="50" y="250" width="360" height="12" fill="rgba(200,170,120,.45)"
            stroke="var(--ink)" stroke-width="1.4"/>
      <g id="blockG"></g>
      <g id="springG"></g>
      <g id="force"></g>

      <text id="fTxt" x="230" y="316" font-size="20" fill="var(--accent)" text-anchor="middle"
            font-family="var(--f-num)">—</text>
      <text id="noteTxt" x="230" y="346" font-size="11.5" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
      <text id="tipTxt" x="230" y="376" font-size="11" fill="var(--f-faint)" text-anchor="middle"
            font-family="var(--f-sans)">压力越大、表面越粗糙，摩擦力越大</text>
    </svg>`,
    draw(s, el) {
      const sf = SURF[s.surf];
      el.querySelector('#surface').setAttribute('fill', sf.mu > .5 ? 'rgba(220,180,150,.5)'
        : sf.mu < .2 ? 'rgba(190,215,230,.45)' : 'rgba(200,170,120,.45)');

      const f = sf.mu * s.weight * 9.8;
      el.querySelector('#blockG').innerHTML = `
        <rect x="196" y="212" width="70" height="38" rx="3" fill="var(--paper-3)"
              stroke="var(--ink)" stroke-width="1.5"/>
        <text x="231" y="236" font-size="10" fill="var(--muted)" text-anchor="middle"
              font-family="var(--f-sans)">木块</text>
        ${s.weight > 4 ? `<rect x="212" y="192" width="38" height="18" rx="2"
           fill="var(--paper-2)" stroke="var(--ink)" stroke-width="1.2"/>
           <text x="231" y="205" font-size="8" fill="var(--muted)" text-anchor="middle"
                 font-family="var(--f-sans)">${s.weight - 4} N</text>` : ''}`;

      el.querySelector('#springG').innerHTML =
        window.Parts.spring({ x: 280, y: 150, h: 96, w: 38, reading: f, max: 30 }) +
        `<text x="299" y="264" font-size="9" fill="var(--muted)" text-anchor="middle"
           font-family="var(--f-sans)">测力计</text>`;

      el.querySelector('#force').innerHTML = s.pull
        ? `<line x1="266" y1="222" x2="286" y2="222" stroke="var(--accent)" stroke-width="2"/>
           <path d="M286 222 l-8 -4 v8 Z" fill="var(--accent)"/>`
        : '';

      el.querySelector('#fTxt').textContent = s.pull ? `f = ${f.toFixed(1)} N` : 'f = ?';
      el.querySelector('#noteTxt').textContent =
        `${sf.n}，压力 ${(s.weight * 9.8).toFixed(1)} N，f = μN = ${sf.mu} × ${(s.weight * 9.8).toFixed(1)}`;
    },
    controls(s) {
      return [{
        type: 'seg', id: 'surf', label: '① 接触面',
        options: Object.keys(SURF).map(k => ({ v: k, t: SURF[k].n })),
        get: st => st.surf, set: (st, v) => { st.surf = v; st.pull = 0; }
      }, {
        type: 'range', id: 'weight', label: '② 木块总重', min: 2, max: 8, step: 1, unit: ' N',
        get: st => st.weight, set: (st, v) => { st.weight = v; st.pull = 0; }
      }];
    },
    actLabels: { pull: '匀速拉动', reset: '重置' },
    secondary: ['reset'],
    actions: {
      pull(s, api) {
        s.pull = 1;
        const f = SURF[s.surf].mu * s.weight * 9.8;
        api.say(`匀速拉动时测力计示数 <b>${f.toFixed(1)} N</b>，所以摩擦力也是 ${f.toFixed(1)} N。<br>
          拉力与摩擦力是一对<b>平衡力</b>。`, 'ok');
        api.conclude('滑动摩擦力的影响因素', [
          '公式：<b>f = μN</b>，μ 是动摩擦因数，N 是压力。',
          '<b>压力越大</b>，摩擦力越大（接触面粗糙程度相同时）。',
          '<b>接触面越粗糙</b>，摩擦力越大（压力相同时）。',
          '滑动摩擦力还与<b>接触面的材料</b>有关（材料不同，动摩擦因数不同）。',
          '与接触面积大小无关，与运动速度（低速）基本无关。',
          '实验必须<b>匀速</b>拉动：只有匀速时，拉力才与摩擦力平衡，示数才等于摩擦力。',
          '增大摩擦：增大压力、使接触面粗糙、变滚动为滑动；减小摩擦：减小压力、加润滑油、变滑动为滚动、使接触面分离。'
        ]);
      },
      reset(s, api) { s.pull = 0; api.clearConcl(); api.say('已重置。'); }
    },
    hud(s) {
      const f = SURF[s.surf].mu * s.weight * 9.8;
      return [
        { label: '接触面', value: SURF[s.surf].n },
        { label: '压力', value: (s.weight * 9.8).toFixed(1) + ' N' },
        { label: '摩擦力', value: s.pull ? f.toFixed(1) + ' N' : '—', hi: !!s.pull },
        { label: '拉动方式', value: '匀速' }
      ];
    }
  });
})();

/* ---------------- P9-02 探究液体压强的特点 ---------------- */
(function () {
  const LIQ = {
    water: { n: '水', rho: 1.0, c: 'rgba(120,170,210,.45)' },
    salt: { n: '盐水', rho: 1.1, c: 'rgba(140,190,210,.5)' },
    alcohol: { n: '酒精', rho: 0.8, c: 'rgba(200,200,215,.4)' }
  };
  window.EXPERIMENTS.push({
    id: 'p9-02', code: 'P9-02', title: '探究液体压强的特点',
    book: '八年级下册', unit: '第九章 压强', kind: '学生实验',
    opening: '把压强计探头放进液体，改变深度和方向，看 U 形管液面差。',
    stageNote: 'p = ρgh，h 是液面到探头的竖直距离，不是探头到容器底的距离',
    init: () => ({ h: 10, liq: 'water', dir: 'down' }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="液体压强">
      <text x="230" y="28" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">探头放入液体，U 形管两边液面出现高度差</text>

      <!-- 容器 -->
      <path d="M50 120 v180 a10 10 0 0 0 10 10 h180 a10 10 0 0 0 10 -10 V120"
            fill="var(--paper-2)" fill-opacity=".55" stroke="var(--ink)" stroke-width="1.6"/>
      <rect id="liq" x="56" y="130" width="188" height="174" fill="rgba(120,170,210,.45)"/>
      <line id="liqTop" x1="56" y1="130" x2="244" y2="130" stroke="#6fa3c4" stroke-width="2"/>
      <text id="liqName" x="150" y="112" font-size="10" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">水</text>

      <!-- 探头 -->
      <g id="probe">
        <path id="probeArm" d="" stroke="var(--ink)" stroke-width="1.4" fill="none"/>
        <circle id="probeHead" cx="140" cy="200" r="7" fill="var(--paper-3)"
                stroke="var(--ink)" stroke-width="1.4"/>
      </g>

      <!-- U 形管 -->
      <g transform="translate(300,140)">
        <path d="M0 0 v100 a16 16 0 0 0 32 0 V0" fill="var(--paper-2)" fill-opacity=".7"
              stroke="var(--ink)" stroke-width="1.5"/>
        <rect id="uLeft" x="2" y="40" width="12" height="76" fill="rgba(120,170,210,.55)"/>
        <rect id="uRight" x="18" y="40" width="12" height="76" fill="rgba(120,170,210,.55)"/>
        <line id="uLineL" x1="2" y1="40" x2="14" y2="40" stroke="#5f97bb" stroke-width="1.6"/>
        <line id="uLineR" x1="18" y1="40" x2="30" y2="40" stroke="#5f97bb" stroke-width="1.6"/>
        <text x="16" y="132" font-size="9.5" fill="var(--muted)" text-anchor="middle"
              font-family="var(--f-sans)">U 形管压强计</text>
      </g>

      <text id="pTxt" x="230" y="330" font-size="20" fill="var(--accent)" text-anchor="middle"
            font-family="var(--f-num)">—</text>
      <text id="noteTxt" x="230" y="356" font-size="11.5" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
      <text id="dirTxt" x="230" y="382" font-size="11" fill="var(--f-faint)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
    </svg>`,
    draw(s, el) {
      const l = LIQ[s.liq];
      el.querySelector('#liq').setAttribute('fill', l.c);
      el.querySelector('#liqName').textContent = l.n;

      const top = 130, bottom = 304;
      const py = top + s.h / 30 * (bottom - top);
      const hx = s.dir === 'down' ? 140 : s.dir === 'left' ? 118 : 162;
      const hy = s.dir === 'down' ? py + 8 : py;

      el.querySelector('#probeArm').setAttribute('d',
        `M140 90 V${hy} ${s.dir === 'down' ? '' : `H${hx}`}`);
      const head = el.querySelector('#probeHead');
      head.setAttribute('cx', s.dir === 'left' ? hx - 4 : s.dir === 'right' ? hx + 4 : hx);
      head.setAttribute('cy', hy);

      const p = l.rho * 1000 * 9.8 * (s.h / 100);
      const diff = Math.min(56, p / 30);
      el.querySelector('#uLeft').setAttribute('y', 40 - diff / 2);
      el.querySelector('#uLeft').setAttribute('height', 76 + diff / 2);
      el.querySelector('#uRight').setAttribute('y', 40 + diff / 2);
      el.querySelector('#uRight').setAttribute('height', 76 - diff / 2);
      el.querySelector('#uLineL').setAttribute('y1', 40 - diff / 2);
      el.querySelector('#uLineL').setAttribute('y2', 40 - diff / 2);
      el.querySelector('#uLineR').setAttribute('y1', 40 + diff / 2);
      el.querySelector('#uLineR').setAttribute('y2', 40 + diff / 2);

      el.querySelector('#pTxt').textContent = `p = ${p.toFixed(0)} Pa`;
      el.querySelector('#noteTxt').textContent =
        `p = ρgh = ${l.rho}×10³ × 9.8 × ${(s.h / 100).toFixed(2)}`;
      el.querySelector('#dirTxt').textContent = s.dir === 'down'
        ? '探头朝下：测的是液体向下的压强'
        : '同一深度改变方向，液面高度差不变 —— 液体向各个方向都有压强';
    },
    controls(s) {
      return [{
        type: 'range', id: 'h', label: '① 探头深度', min: 2, max: 30, step: 1, unit: ' cm',
        get: st => st.h, set: (st, v) => { st.h = v; }
      }, {
        type: 'seg', id: 'liq', label: '② 液体',
        options: Object.keys(LIQ).map(k => ({ v: k, t: LIQ[k].n })),
        get: st => st.liq, set: (st, v) => { st.liq = v; }
      }, {
        type: 'seg', id: 'dir', label: '③ 探头方向',
        options: [{ v: 'down', t: '朝下' }, { v: 'left', t: '朝左' }, { v: 'right', t: '朝右' }],
        get: st => st.dir, set: (st, v) => { st.dir = v; }
      }];
    },
    actLabels: { measure: '读数', reset: '重置' },
    secondary: ['reset'],
    actions: {
      measure(s, api) {
        const l = LIQ[s.liq];
        const p = l.rho * 1000 * 9.8 * s.h / 100;
        api.say(`深度 ${s.h} cm，${l.n}的压强 <b>${p.toFixed(0)} Pa</b>。<br>
          p = ρgh = ${l.rho}×10³ kg/m³ × 9.8 N/kg × ${(s.h / 100).toFixed(2)} m。`, 'ok');
        api.conclude('液体压强的三个特点', [
          '液体对容器<b>底部和侧壁</b>都有压强，内部<b>向各个方向</b>都有压强。',
          '同种液体，<b>深度越深，压强越大</b>（p 与 h 成正比）。',
          '同一深度，液体向各个方向的压强<b>相等</b>。',
          '深度相同时，<b>液体密度越大，压强越大</b>。',
          '公式：<b>p = ρgh</b>，h 是液面到该点的竖直距离。',
          '连通器：同种液体静止时液面相平（茶壶、船闸、水位计）。'
        ]);
      },
      reset(s, api) { Object.assign(s, { h: 10, liq: 'water', dir: 'down' }); api.clearConcl(); api.say('已重置。'); }
    },
    hud(s) {
      const l = LIQ[s.liq];
      const p = l.rho * 1000 * 9.8 * s.h / 100;
      return [
        { label: '深度', value: s.h + ' cm' },
        { label: '液体', value: l.n },
        { label: '压强', value: p.toFixed(0) + ' Pa', hi: true },
        { label: '方向', value: s.dir === 'down' ? '朝下' : s.dir === 'left' ? '朝左' : '朝右' }
      ];
    }
  });
})();

/* ---------------- P10-02 探究浮力的大小 ---------------- */
(function () {
  const LIQ = {
    water: { n: '水', rho: 1.0 },
    salt: { n: '盐水', rho: 1.1 },
    alcohol: { n: '酒精', rho: 0.8 }
  };
  window.EXPERIMENTS.push({
    id: 'p10-02', code: 'P10-02', title: '探究浮力的大小',
    book: '八年级下册', unit: '第十章 浮力', kind: '学生实验',
    opening: '把物体慢慢浸入液体，看测力计示数怎么变，算出浮力。',
    stageNote: 'F浮 = G − F示 = ρ液 g V排；浸没后继续下沉，浮力不再增大',
    init: () => ({ liq: 'water', depth: 0 }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="浮力">
      <text x="230" y="28" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">测力计示数变小，减小的部分就是浮力</text>

      <g id="springG" transform="translate(96,56)"></g>
      <g id="objG"></g>

      <path d="M180 220 h220 v100 a10 10 0 0 1 -10 10 h-200 a10 10 0 0 1 -10 -10 Z"
            fill="rgba(120,170,210,.35)" stroke="var(--ink)" stroke-width="1.6"/>
      <line x1="174" y1="220" x2="406" y2="220" stroke="#6fa3c4" stroke-width="2"/>
      <text id="liqName" x="290" y="212" font-size="10" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">水</text>
      <g id="spill"></g>

      <text id="fTxt" x="230" y="352" font-size="20" fill="var(--accent)" text-anchor="middle"
            font-family="var(--f-num)">—</text>
      <text id="gTxt" x="230" y="380" font-size="11.5" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
    </svg>`,
    draw(s, el) {
      const l = LIQ[s.liq];
      el.querySelector('#liqName').textContent = l.n;

      const G = 4.0, V = 200;                       // 4 N，200 cm³
      const sub = Math.min(1, s.depth / 100);       // 浸没比例
      const Fb = l.rho * 1000 * 9.8 * (V * sub / 1e6);
      const F = Math.max(0, G - Fb);

      el.querySelector('#springG').innerHTML =
        window.Parts.spring({ x: 0, y: 0, h: 150, w: 40, reading: F, max: 5 });

      const oy = 206 + (1 - sub) * 60;
      el.querySelector('#objG').innerHTML = `
        <line x1="116" y1="${oy - 34}" x2="116" y2="${oy - 6}" stroke="var(--ink)" stroke-width="1.2"/>
        <rect x="${116 - 26}" y="${oy - 6}" width="52" height="44" rx="3"
              fill="rgba(190,205,220,.75)" stroke="var(--ink)" stroke-width="1.5"/>
        <text x="116" y="${oy + 20}" font-size="9" fill="var(--ink)" text-anchor="middle"
              font-family="var(--f-sans)">物体</text>`;

      el.querySelector('#spill').innerHTML = sub > 0
        ? `<path d="M200 ${230 + (1 - sub) * 20} q-18 8 -30 26" stroke="var(--accent)"
             stroke-width="1.4" fill="none" stroke-dasharray="3 3"/>
           <text x="212" y="${246 + (1 - sub) * 20}" font-size="9.5" fill="var(--accent)"
                 font-family="var(--f-sans)">排开液体 ${(V * sub).toFixed(0)} cm³</text>`
        : '';

      el.querySelector('#fTxt').textContent = `F浮 = ${Fb.toFixed(2)} N`;
      el.querySelector('#gTxt').textContent =
        sub === 0 ? '还没浸入，示数等于重力 4.0 N'
          : `示数 ${F.toFixed(2)} N，F浮 = G − F示 = 4.0 − ${F.toFixed(2)} = ${Fb.toFixed(2)} N`;
    },
    controls(s) {
      return [{
        type: 'seg', id: 'liq', label: '① 液体',
        options: Object.keys(LIQ).map(k => ({ v: k, t: LIQ[k].n })),
        get: st => st.liq, set: (st, v) => { st.liq = v; }
      }, {
        type: 'range', id: 'depth', label: '② 浸入程度', min: 0, max: 100, step: 10, unit: ' %',
        get: st => st.depth, set: (st, v) => { st.depth = v; }
      }];
    },
    actLabels: { read: '读测力计示数', reset: '重置' },
    secondary: ['reset'],
    actions: {
      read(s, api) {
        const l = LIQ[s.liq];
        const sub = Math.min(1, s.depth / 100);
        const Fb = l.rho * 1000 * 9.8 * (200 * sub / 1e6);
        const F = Math.max(0, 4.0 - Fb);
        api.say(`示数 <b>${F.toFixed(2)} N</b>，浮力 <b>${Fb.toFixed(2)} N</b>。<br>
          F浮 = ρ液 g V排 = ${l.rho}×10³ × 9.8 × ${(200 * sub / 1e6).toExponential(2)}。`, 'ok');
        api.conclude('阿基米德原理', [
          '<b>F浮 = G排 = ρ液 g V排</b>：浮力等于物体排开的液体所受的重力。',
          '浮力只与<b>液体密度</b>和<b>排开液体的体积</b>有关。',
          '物体浸没后继续下沉，V排 不变，<b>浮力不再增大</b>。',
          '浮力方向<b>竖直向上</b>；施力物体是液体（或气体）。',
          '称重法：F浮 = G − F示，这是实验中测浮力的常用方法。',
          '物体在液体中不受浮力的情况：底部与容器底完全密合（如桥墩）。'
        ]);
      },
      reset(s, api) { Object.assign(s, { liq: 'water', depth: 0 }); api.clearConcl(); api.say('已重置。'); }
    },
    hud(s) {
      const l = LIQ[s.liq];
      const sub = Math.min(1, s.depth / 100);
      const Fb = l.rho * 1000 * 9.8 * (200 * sub / 1e6);
      return [
        { label: '液体', value: l.n },
        { label: '排开体积', value: (200 * sub).toFixed(0) + ' cm³' },
        { label: '浮力', value: Fb.toFixed(2) + ' N', hi: true },
        { label: '测力计', value: (4.0 - Fb).toFixed(2) + ' N' }
      ];
    }
  });
})();

/* ---------------- P12-01 探究杠杆的平衡条件 ---------------- */
(function () {
  window.EXPERIMENTS.push({
    id: 'p12-01', code: 'P12-01', title: '探究杠杆的平衡条件',
    book: '八年级下册', unit: '第十二章 简单机械', kind: '学生实验',
    opening: '在杠杆两边挂钩码，改变位置，找出 F₁L₁ 与 F₂L₂ 的关系。',
    stageNote: '力臂是支点到力的作用线的距离，不是支点到作用点的距离',
    init: () => ({ n1: 2, l1: 3, l2: 2 }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="杠杆平衡">
      <text x="230" y="28" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">杠杆平衡：F₁L₁ = F₂L₂</text>

      <g id="leverG"></g>
      <g id="left"></g>
      <g id="right"></g>
      <g id="arms"></g>

      <text id="eqTxt" x="230" y="330" font-size="15" fill="var(--ink)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
      <text id="stateTxt" x="230" y="358" font-size="13" fill="var(--accent)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
      <text id="noteTxt" x="230" y="384" font-size="10.5" fill="var(--f-muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
    </svg>`,
    draw(s, el) {
      const cx = 230, cy = 200, unit = 30;
      el.querySelector('#leverG').innerHTML =
        window.Parts.lever({ x: cx - 150, y: cy, w: 300 }) +
        `<path d="M${cx - 10} ${cy + 6} L${cx + 10} ${cy + 6} L${cx} ${cy + 30} Z"
           fill="var(--paper-3)" stroke="var(--ink)" stroke-width="1.5"/>
         <text x="${cx}" y="${cy + 48}" font-size="9.5" fill="var(--muted)" text-anchor="middle"
               font-family="var(--f-sans)">支点 O</text>`;

      const lx = cx - s.l1 * unit, rx = cx + s.l2 * unit;
      el.querySelector('#left').innerHTML = Array.from({ length: s.n1 }, (_, i) =>
        `<rect x="${lx - 9}" y="${cy + 6 + i * 15}" width="18" height="13" rx="2"
           fill="var(--paper-3)" stroke="var(--ink)" stroke-width="1.2"/>`).join('') +
        `<text x="${lx}" y="${cy - 12}" font-size="10" fill="var(--accent)" text-anchor="middle"
           font-family="var(--f-num)">${s.n1}G</text>`;

      const n2 = s.n1 * s.l1 / s.l2;
      el.querySelector('#right').innerHTML = Number.isInteger(n2)
        ? Array.from({ length: n2 }, (_, i) =>
          `<rect x="${rx - 9}" y="${cy + 6 + i * 15}" width="18" height="13" rx="2"
             fill="var(--paper-3)" stroke="var(--ink)" stroke-width="1.2"/>`).join('') +
        `<text x="${rx}" y="${cy - 12}" font-size="10" fill="var(--accent)" text-anchor="middle"
           font-family="var(--f-num)">${n2}G</text>`
        : `<text x="${rx}" y="${cy - 12}" font-size="9.5" fill="var(--accent)" text-anchor="middle"
             font-family="var(--f-num)">${n2.toFixed(1)}G</text>`;

      el.querySelector('#arms').innerHTML = `
        <line x1="${cx}" y1="${cy + 56}" x2="${lx}" y2="${cy + 56}" stroke="var(--accent)"
              stroke-width="1.2" stroke-dasharray="4 3"/>
        <line x1="${cx}" y1="${cy + 56}" x2="${rx}" y2="${cy + 56}" stroke="var(--accent)"
              stroke-width="1.2" stroke-dasharray="4 3"/>
        <text x="${(cx + lx) / 2}" y="${cy + 70}" font-size="10" fill="var(--accent)"
              text-anchor="middle" font-family="var(--f-num)">L₁=${s.l1}</text>
        <text x="${(cx + rx) / 2}" y="${cy + 70}" font-size="10" fill="var(--accent)"
              text-anchor="middle" font-family="var(--f-num)">L₂=${s.l2}</text>`;

      el.querySelector('#eqTxt').textContent =
        `${s.n1}G × ${s.l1} = ${(s.n1 * s.l1)}G　｜　${n2.toFixed(1)}G × ${s.l2} = ${(n2 * s.l2).toFixed(0)}G`;
      el.querySelector('#stateTxt').textContent = Math.abs(s.n1 * s.l1 - n2 * s.l2) < 0.05
        ? '杠杆平衡' : '不平衡';
      el.querySelector('#noteTxt').textContent = s.l1 > s.l2
        ? '动力臂大于阻力臂 —— 省力杠杆，费距离' : s.l1 < s.l2 ? '动力臂小于阻力臂 —— 费力杠杆，省距离'
          : '等臂杠杆（天平）';
    },
    controls(s) {
      return [{
        type: 'range', id: 'n1', label: '① 左边钩码数', min: 1, max: 6, step: 1, unit: ' 个',
        get: st => st.n1, set: (st, v) => { st.n1 = v; }
      }, {
        type: 'range', id: 'l1', label: '② 左边力臂', min: 1, max: 5, step: 1, unit: ' 格',
        get: st => st.l1, set: (st, v) => { st.l1 = v; }
      }, {
        type: 'range', id: 'l2', label: '③ 右边力臂', min: 1, max: 5, step: 1, unit: ' 格',
        get: st => st.l2, set: (st, v) => { st.l2 = v; }
      }];
    },
    actLabels: { check: '观察是否平衡', reset: '重置' },
    secondary: ['reset'],
    actions: {
      check(s, api) {
        const n2 = s.n1 * s.l1 / s.l2;
        api.say(`左边 ${s.n1}G × ${s.l1} 格 = ${s.n1 * s.l1}G·格；右边需要 <b>${n2.toFixed(1)}G</b> × ${s.l2} 格才平衡。`, 'ok');
        api.conclude('杠杆的平衡条件', [
          '<b>F₁L₁ = F₂L₂</b>，即动力 × 动力臂 = 阻力 × 阻力臂。',
          '力臂是<b>支点到力的作用线</b>的距离（垂线段），不是到作用点的距离。',
          'L₁ > L₂：省力杠杆，但费距离（撬棒、羊角锤）。',
          'L₁ < L₂：费力杠杆，但省距离（镊子、钓鱼竿、筷子）。',
          'L₁ = L₂：等臂杠杆，不省力也不省距离（天平、定滑轮）。',
          '省力一定费距离，既省力又省距离的杠杆不存在 —— 功的原理。'
        ]);
      },
      reset(s, api) { Object.assign(s, { n1: 2, l1: 3, l2: 2 }); api.clearConcl(); api.say('已重置。'); }
    },
    hud(s) {
      const n2 = s.n1 * s.l1 / s.l2;
      return [
        { label: '左：F₁L₁', value: `${s.n1}G × ${s.l1}` },
        { label: '右：F₂L₂', value: `${n2.toFixed(1)}G × ${s.l2}` },
        { label: '右边钩码', value: n2.toFixed(1) + ' 个', hi: true },
        { label: '类型', value: s.l1 > s.l2 ? '省力' : s.l1 < s.l2 ? '费力' : '等臂' }
      ];
    }
  });
})();

/* ---------------- P12-04 测量滑轮组的机械效率 ---------------- */
(function () {
  window.EXPERIMENTS.push({
    id: 'p12-04', code: 'P12-04', title: '测量滑轮组的机械效率',
    book: '八年级下册', unit: '第十二章 简单机械', kind: '学生实验',
    opening: '改变物重和绳段数，测拉力，算有用功、总功和机械效率。',
    stageNote: 'η = W有/W总 = Gh/(Fs) = G/(nF)，n 是承担物重的绳子段数',
    init: () => ({ G: 6, Gmov: 1, n: 2, h: 0.2, pull: 0 }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="滑轮组">
      <text x="230" y="28" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">同一滑轮组，物重越大，机械效率越高</text>

      <line x1="150" y1="56" x2="330" y2="56" stroke="var(--ink)" stroke-width="3"/>
      <g id="pulleys"></g>
      <g id="rope"></g>
      <g id="weight"></g>

      <text id="wTxt" x="230" y="300" font-size="12" fill="var(--ink)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
      <text id="etaTxt" x="230" y="336" font-size="24" fill="var(--accent)" text-anchor="middle"
            font-family="var(--f-num)">—</text>
      <text id="noteTxt" x="230" y="366" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
    </svg>`,
    draw(s, el) {
      const fixedY = 76, movY = 196;
      el.querySelector('#pulleys').innerHTML =
        window.Parts.pulley({ x: 240, y: fixedY, r: 20 }) +
        window.Parts.pulley({ x: 240, y: movY, r: 20 }) +
        `<text x="270" y="${fixedY + 4}" font-size="9" fill="var(--muted)"
           font-family="var(--f-sans)">定滑轮</text>
         <text x="270" y="${movY + 4}" font-size="9" fill="var(--muted)"
           font-family="var(--f-sans)">动滑轮</text>`;

      const n = s.n;
      const lines = [];
      for (let i = 0; i < n; i++) {
        const x = 222 + i * 18;
        lines.push(`<line x1="${x}" y1="${fixedY + 18}" x2="${x}" y2="${movY - 18}"
          stroke="var(--ink)" stroke-width="1.4"/>`);
      }
      lines.push(`<line x1="${222 + (n - 1) * 18}" y1="${movY - 18}" x2="330" y2="330"
        stroke="var(--ink)" stroke-width="1.4"/>`);
      el.querySelector('#rope').innerHTML = lines.join('') +
        `<text x="336" y="322" font-size="9.5" fill="var(--accent)" font-family="var(--f-sans)">F</text>`;

      el.querySelector('#weight').innerHTML = `
        <rect x="${240 - 24}" y="${movY + 22}" width="48" height="34" rx="3"
              fill="var(--paper-3)" stroke="var(--ink)" stroke-width="1.5"/>
        <text x="240" y="${movY + 44}" font-size="10" fill="var(--ink)" text-anchor="middle"
              font-family="var(--f-num)">${s.G} N</text>`;

      const F = (s.G + s.Gmov) / n;
      const eta = s.G / (n * F) * 100;
      el.querySelector('#wTxt').textContent =
        `W有 = ${s.G} × ${s.h} = ${(s.G * s.h).toFixed(1)} J　｜　W总 = ${F.toFixed(2)} × ${(n * s.h).toFixed(1)} = ${(F * n * s.h).toFixed(1)} J`;
      el.querySelector('#etaTxt').textContent = `η = ${eta.toFixed(1)}%`;
      el.querySelector('#noteTxt').textContent =
        `拉力 F = (G + G动)/n = (${s.G} + ${s.Gmov})/${n} = ${F.toFixed(2)} N`;
    },
    controls(s) {
      return [{
        type: 'range', id: 'G', label: '① 物重', min: 2, max: 12, step: 1, unit: ' N',
        get: st => st.G, set: (st, v) => { st.G = v; }
      }, {
        type: 'range', id: 'Gmov', label: '② 动滑轮重', min: 0.5, max: 3, step: 0.5, unit: ' N',
        get: st => st.Gmov, fmt: v => v.toFixed(1), set: (st, v) => { st.Gmov = v; }
      }, {
        type: 'seg', id: 'n', label: '③ 承担物重的绳段数',
        options: [{ v: '2', t: '2 段' }, { v: '3', t: '3 段' }],
        get: st => String(st.n), set: (st, v) => { st.n = +v; }
      }, {
        type: 'range', id: 'h', label: '④ 提升高度', min: 0.1, max: 0.5, step: 0.1, unit: ' m',
        get: st => st.h, fmt: v => v.toFixed(1), set: (st, v) => { st.h = v; }
      }];
    },
    actLabels: { calc: '计算机械效率', reset: '重置' },
    secondary: ['reset'],
    actions: {
      calc(s, api) {
        const F = (s.G + s.Gmov) / s.n;
        const W有 = s.G * s.h, W总 = F * s.n * s.h;
        const eta = W有 / W总 * 100;
        api.say(`F = ${F.toFixed(2)} N，W有 = ${W有.toFixed(1)} J，W总 = ${W总.toFixed(1)} J，<b>η = ${eta.toFixed(1)}%</b>。`, 'ok');
        api.conclude('滑轮组机械效率的三点结论', [
          'η = W有/W总 = <b>Gh/(Fs) = G/(nF)</b>（忽略绳重和摩擦时 F = (G+G动)/n）。',
          '同一滑轮组，<b>物重越大，机械效率越高</b>（有用功占比变大）。',
          '<b>动滑轮越重，机械效率越低</b>（额外功变大）。',
          '机械效率总小于 1：总有额外功（提升动滑轮、克服摩擦）。',
          '机械效率与省力多少无关：省力多的滑轮组，效率不一定高。',
          '提高效率：减小动滑轮重、加润滑油、增大物重。'
        ]);
      },
      reset(s, api) { Object.assign(s, { G: 6, Gmov: 1, n: 2, h: 0.2 }); api.clearConcl(); api.say('已重置。'); }
    },
    hud(s) {
      const F = (s.G + s.Gmov) / s.n;
      const eta = s.G / (s.n * F) * 100;
      return [
        { label: '拉力 F', value: F.toFixed(2) + ' N' },
        { label: 'W有', value: (s.G * s.h).toFixed(1) + ' J' },
        { label: 'W总', value: (F * s.n * s.h).toFixed(1) + ' J' },
        { label: 'η', value: eta.toFixed(1) + '%', hi: true }
      ];
    }
  });
})();
