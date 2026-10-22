/* ============================================================
   实验数据 · 九年级全一册（人教版 2024）
   ============================================================ */
window.EXPERIMENTS = window.EXPERIMENTS || [];

/* ---------------- P13-01 比较不同物质的吸热能力 ---------------- */
(function () {
  const MATS = {
    water: { n: '水', c: 4.2, color: 'rgba(120,170,210,.4)' },
    oil: { n: '食用油', c: 2.1, color: 'rgba(230,200,120,.5)' },
    sand: { n: '沙石', c: 0.92, color: 'rgba(200,180,140,.65)' }
  };
  window.EXPERIMENTS.push({
    id: 'p13-01', code: 'P13-01', title: '比较不同物质的吸热能力',
    book: '九年级全一册', unit: '第十三章 内能', kind: '学生实验',
    opening: '同样的质量、同样的热源，加热相同时间，看谁升温慢。',
    stageNote: '升温慢的吸热能力强，比热容大；水的比热容 4.2×10³ J/(kg·℃)',
    init: () => ({ mat: 'water', m: 0.2, t: 4 }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="比热容">
      <text x="230" y="28" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">相同质量、相同热源，升温越慢比热容越大</text>

      <g id="cupG" transform="translate(70,80)"></g>
      <g transform="translate(220,80)">
        ${window.Parts.thermometer({ x: 0, y: 0, h: 100, t: 20 })}
      </g>
      <g id="lampG" transform="translate(84,210)"></g>

      <g transform="translate(300,70)">
        <line x1="0" y1="150" x2="130" y2="150" stroke="var(--ink)" stroke-width="1.3"/>
        <line x1="0" y1="0" x2="0" y2="150" stroke="var(--ink)" stroke-width="1.3"/>
        <text x="130" y="166" font-size="9" fill="var(--muted)" text-anchor="end"
              font-family="var(--f-sans)">t / min</text>
        <text x="5" y="12" font-size="9" fill="var(--muted)" font-family="var(--f-sans)">℃</text>
        <path id="curve" d="" fill="none" stroke="var(--accent)" stroke-width="2.2"/>
      </g>

      <text id="tTxt" x="230" y="300" font-size="18" fill="var(--ink)" text-anchor="middle"
            font-family="var(--f-num)">—</text>
      <text id="qTxt" x="230" y="328" font-size="11.5" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
      <text id="noteTxt" x="230" y="360" font-size="11" fill="var(--f-faint)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
    </svg>`,
    draw(s, el) {
      const m = MATS[s.mat];
      const T = temp(s);
      el.querySelector('#cupG').innerHTML = window.Parts.beaker({
        x: 0, y: 0, w: 90, h: 120, fill: m.color, level: .55
      }) + `<text x="45" y="140" font-size="9.5" fill="var(--muted)" text-anchor="middle"
             font-family="var(--f-sans)">${m.n} ${s.m} kg</text>`;
      el.querySelector('#lampG').innerHTML =
        window.Parts.lamp({ x: 0, y: 0, lit: s.t > 0, w: 62, h: 56 });

      const pts = [];
      for (let t = 0; t <= 10; t += 0.2) {
        pts.push(`${(t / 10 * 130).toFixed(1)},${(150 - (tempAt(s, t) - 20) / 40 * 150).toFixed(1)}`);
      }
      el.querySelector('#curve').setAttribute('d', 'M' + pts.join(' L'));

      el.querySelector('#tTxt').textContent = `${T.toFixed(1)} ℃`;
      el.querySelector('#qTxt').textContent =
        `Q = cmΔt = ${m.c}×10³ × ${s.m} × ${(T - 20).toFixed(1)} = ${(m.c * 1000 * s.m * (T - 20) / 1000).toFixed(1)} kJ`;
      el.querySelector('#noteTxt').textContent =
        `比热容 ${m.c}×10³ J/(kg·℃)，${m.n}升温${m.c > 3 ? '最慢' : '较快'}`;
    },
    controls(s) {
      return [{
        type: 'seg', id: 'mat', label: '① 物质',
        options: Object.keys(MATS).map(k => ({ v: k, t: MATS[k].n })),
        get: st => st.mat, set: (st, v) => { st.mat = v; }
      }, {
        type: 'range', id: 'm', label: '② 质量', min: 0.1, max: 0.5, step: 0.1, unit: ' kg',
        get: st => st.m, fmt: v => v.toFixed(1), set: (st, v) => { st.m = v; }
      }, {
        type: 'range', id: 't', label: '③ 加热时间', min: 0, max: 10, step: 1, unit: ' min',
        get: st => st.t, set: (st, v) => { st.t = v; }
      }];
    },
    actLabels: { record: '记录温度', reset: '重置' },
    secondary: ['reset'],
    actions: {
      record(s, api) {
        const m = MATS[s.mat];
        const T = temp(s);
        api.say(`加热 ${s.t} min，${m.n}从 20 ℃ 升到 <b>${T.toFixed(1)} ℃</b>。<br>
          Q = cmΔt = ${m.c}×10³ × ${s.m} × ${(T - 20).toFixed(1)} J。`, 'ok');
        api.conclude('比热容是物质的特性', [
          '定义：<b>单位质量的某种物质，温度升高 1 ℃ 所吸收的热量</b>，符号 c。',
          '公式：<b>Q = cmΔt</b>；吸热 Q吸 = cm(t−t₀)，放热 Q放 = cm(t₀−t)。',
          '水的比热容 <b>4.2×10³ J/(kg·℃)</b>，在常见物质中较大。',
          '质量相同、吸热相同时，<b>比热容越大，升温越慢</b>。',
          '水的比热容大 → 沿海昼夜温差小、汽车用循环水冷却、暖气用水做介质。',
          '比热容是物质特性，与质量、温度变化无关（同种物质状态不变时）。'
        ]);
      },
      reset(s, api) { Object.assign(s, { mat: 'water', m: 0.2, t: 4 }); api.clearConcl(); api.say('已重置。'); }
    },
    hud(s) {
      const m = MATS[s.mat];
      const T = temp(s);
      return [
        { label: '物质', value: m.n },
        { label: '比热容', value: m.c + '×10³' },
        { label: '温度', value: T.toFixed(1) + ' ℃', hi: true },
        { label: '吸热', value: (m.c * 1000 * s.m * (T - 20) / 1000).toFixed(1) + ' kJ' }
      ];
    }
  });

  function tempAt(s, t) {
    const m = MATS[s.mat];
    const P = 300;                       // 热源功率 W
    const dT = P * t * 60 / (m.c * 1000 * s.m);
    return 20 + dT;
  }
  function temp(s) { return tempAt(s, s.t); }
})();

/* ---------------- P15-05 串、并联电路中电流的规律 ---------------- */
(function () {
  window.EXPERIMENTS.push({
    id: 'p15-05', code: 'P15-05', title: '探究串、并联电路中电流的规律',
    book: '九年级全一册', unit: '第十五章 电流和电路', kind: '学生实验',
    opening: '换串联和并联，分别测各点电流，比较大小关系。',
    stageNote: '串联：I = I₁ = I₂；并联：I = I₁ + I₂',
    init: () => ({ mode: 'series', R1: 10, R2: 15, U: 6 }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="串并联电流">
      <text x="230" y="26" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">电流表串联接入各点，读数比较</text>
      <g id="circuit"></g>
      <g id="labels"></g>

      <text id="resTxt" x="230" y="330" font-size="13" fill="var(--ink)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
      <text id="lawTxt" x="230" y="360" font-size="12" fill="var(--accent)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
      <text id="noteTxt" x="230" y="386" font-size="10.5" fill="var(--f-faint)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
    </svg>`,
    draw(s, el) {
      const I = s.U / (s.R1 + s.R2);
      const I1 = s.U / s.R1, I2 = s.U / s.R2;
      const series = s.mode === 'series';

      el.querySelector('#circuit').innerHTML = series
        ? `<rect x="90" y="96" width="280" height="170" fill="none" stroke="var(--ink)" stroke-width="1.6"/>
           ${resSym(160, 96, 'R₁', s.R1)}
           ${resSym(280, 96, 'R₂', s.R2)}
           ${window.Parts.battery({ x: 196, y: 256 })}
           ${window.Parts.switchBox({ x: 88, y: 170 })}`
        : `<rect x="90" y="96" width="280" height="170" fill="none" stroke="var(--ink)" stroke-width="1.6"/>
           <path d="M180 96 v-26 h110 v26 M180 96 v26 h110 v-26" fill="none" stroke="var(--ink)" stroke-width="1.6"/>
           ${resSym(212, 70, 'R₁', s.R1)}
           ${resSym(212, 122, 'R₂', s.R2)}
           ${window.Parts.battery({ x: 196, y: 256 })}
           ${window.Parts.switchBox({ x: 88, y: 170 })}`;

      el.querySelector('#labels').innerHTML = series
        ? `<text x="120" y="88" font-size="9.5" fill="var(--accent)" font-family="var(--f-num)">I=${I.toFixed(2)}A</text>
           <text x="330" y="88" font-size="9.5" fill="var(--accent)" font-family="var(--f-num)">I=${I.toFixed(2)}A</text>
           <text x="230" y="300" font-size="9.5" fill="var(--muted)" text-anchor="middle"
                 font-family="var(--f-sans)">串联：电流只有一条路径</text>`
        : `<text x="120" y="88" font-size="9.5" fill="var(--accent)" font-family="var(--f-num)">I总=${(I1 + I2).toFixed(2)}A</text>
           <text x="330" y="88" font-size="9.5" fill="var(--accent)" font-family="var(--f-num)">I₁=${I1.toFixed(2)}A</text>
           <text x="330" y="130" font-size="9.5" fill="var(--accent)" font-family="var(--f-num)">I₂=${I2.toFixed(2)}A</text>
           <text x="230" y="300" font-size="9.5" fill="var(--muted)" text-anchor="middle"
                 font-family="var(--f-sans)">并联：电流在分支点分开</text>`;

      el.querySelector('#resTxt').textContent = series
        ? `I = U/(R₁+R₂) = ${s.U}/${s.R1 + s.R2} = ${I.toFixed(2)} A`
        : `I₁ = ${I1.toFixed(2)} A，I₂ = ${I2.toFixed(2)} A，I总 = ${(I1 + I2).toFixed(2)} A`;
      el.querySelector('#lawTxt').textContent = series
        ? '串联电路：电流处处相等 I = I₁ = I₂'
        : '并联电路：干路电流等于各支路电流之和 I = I₁ + I₂';
      el.querySelector('#noteTxt').textContent = series
        ? '串联时，电流只有一条路径，没有分支'
        : '并联时，各支路两端电压相同，电流按电阻反比分配';
    },
    controls(s) {
      return [{
        type: 'seg', id: 'mode', label: '① 连接方式',
        options: [{ v: 'series', t: '串联' }, { v: 'parallel', t: '并联' }],
        get: st => st.mode, set: (st, v) => { st.mode = v; }
      }, {
        type: 'range', id: 'R1', label: '② R₁', min: 5, max: 30, step: 5, unit: ' Ω',
        get: st => st.R1, set: (st, v) => { st.R1 = v; }
      }, {
        type: 'range', id: 'R2', label: '③ R₂', min: 5, max: 30, step: 5, unit: ' Ω',
        get: st => st.R2, set: (st, v) => { st.R2 = v; }
      }, {
        type: 'range', id: 'U', label: '④ 电源电压', min: 1.5, max: 9, step: 1.5, unit: ' V',
        get: st => st.U, fmt: v => v.toFixed(1), set: (st, v) => { st.U = v; }
      }];
    },
    actLabels: { measure: '测各点电流', reset: '重置' },
    secondary: ['reset'],
    actions: {
      measure(s, api) {
        const I = s.U / (s.R1 + s.R2);
        const I1 = s.U / s.R1, I2 = s.U / s.R2;
        if (s.mode === 'series') {
          api.say(`串联电路中，各点电流都是 <b>${I.toFixed(2)} A</b>。<br>I = U/(R₁+R₂) = ${s.U}/${s.R1 + s.R2}。`, 'ok');
        } else {
          api.say(`并联电路：I₁ = <b>${I1.toFixed(2)} A</b>，I₂ = <b>${I2.toFixed(2)} A</b>，干路 I = <b>${(I1 + I2).toFixed(2)} A</b>。`, 'ok');
        }
        api.conclude('串、并联电路的电流规律', [
          '<b>串联</b>：电流处处相等，<b>I = I₁ = I₂</b>（只有一条路径）。',
          '<b>并联</b>：干路电流等于各支路电流之和，<b>I = I₁ + I₂</b>。',
          '电流表必须<b>串联</b>接入被测电路，不能并联（会短路）。',
          '电流表要"+"接线柱进、"-"接线柱出，不能超量程。',
          '串联电路中，电阻大的用电器两端电压大，但电流相同。',
          '并联电路中，电阻小的支路电流大（I = U/R）。'
        ]);
      },
      reset(s, api) { Object.assign(s, { mode: 'series', R1: 10, R2: 15, U: 6 }); api.clearConcl(); api.say('已重置。'); }
    },
    hud(s) {
      const I = s.U / (s.R1 + s.R2);
      const I1 = s.U / s.R1, I2 = s.U / s.R2;
      return [
        { label: '连接', value: s.mode === 'series' ? '串联' : '并联' },
        { label: '总电流', value: (s.mode === 'series' ? I : I1 + I2).toFixed(2) + ' A', hi: true },
        { label: 'I₁', value: (s.mode === 'series' ? I : I1).toFixed(2) + ' A' },
        { label: 'I₂', value: (s.mode === 'series' ? I : I2).toFixed(2) + ' A' }
      ];
    }
  });

  function resSym(x, y, label, val) {
    return `<rect x="${x - 22}" y="${y - 10}" width="44" height="20" fill="var(--paper-2)"
              stroke="var(--ink)" stroke-width="1.4"/>
            <text x="${x}" y="${y + 4}" font-size="9" fill="var(--muted)" text-anchor="middle"
                  font-family="var(--f-num)">${label}</text>
            <text x="${x}" y="${y - 16}" font-size="8.5" fill="var(--faint)" text-anchor="middle"
                  font-family="var(--f-num)">${val}Ω</text>`;
  }
})();

/* ---------------- P16-02 串、并联电路中电压的规律 ---------------- */
(function () {
  window.EXPERIMENTS.push({
    id: 'p16-02', code: 'P16-02', title: '探究串、并联电路中电压的规律',
    book: '九年级全一册', unit: '第十六章 电压 电阻', kind: '学生实验',
    opening: '用电压表分别测各部分电压，比较总电压与各部分电压的关系。',
    stageNote: '串联：U = U₁ + U₂；并联：U = U₁ = U₂',
    init: () => ({ mode: 'series', R1: 10, R2: 20, U: 6 }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="串并联电压">
      <text x="230" y="26" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">电压表并联在各元件两端</text>
      <g id="circuit"></g>
      <text id="resTxt" x="230" y="330" font-size="13" fill="var(--ink)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
      <text id="lawTxt" x="230" y="360" font-size="12" fill="var(--accent)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
    </svg>`,
    draw(s, el) {
      const series = s.mode === 'series';
      const U1 = series ? s.U * s.R1 / (s.R1 + s.R2) : s.U;
      const U2 = series ? s.U * s.R2 / (s.R1 + s.R2) : s.U;
      el.querySelector('#circuit').innerHTML = `
        <rect x="90" y="96" width="280" height="170" fill="none" stroke="var(--ink)" stroke-width="1.6"/>
        ${box(160, 96, 'R₁', s.R1, U1)}
        ${box(280, 96, 'R₂', s.R2, U2)}
        ${window.Parts.battery({ x: 196, y: 256 })}
        <text x="230" y="300" font-size="9.5" fill="var(--muted)" text-anchor="middle"
              font-family="var(--f-sans)">${series ? '串联' : '并联'}电路</text>`;
      el.querySelector('#resTxt').textContent = series
        ? `U₁ = ${U1.toFixed(1)} V，U₂ = ${U2.toFixed(1)} V，U = ${s.U.toFixed(1)} V`
        : `U₁ = ${U1.toFixed(1)} V，U₂ = ${U2.toFixed(1)} V，U = ${s.U.toFixed(1)} V`;
      el.querySelector('#lawTxt').textContent = series
        ? '串联：U = U₁ + U₂（电压按电阻正比分配）'
        : '并联：U = U₁ = U₂（各支路电压相等）';
    },
    controls(s) {
      return [{
        type: 'seg', id: 'mode', label: '① 连接方式',
        options: [{ v: 'series', t: '串联' }, { v: 'parallel', t: '并联' }],
        get: st => st.mode, set: (st, v) => { st.mode = v; }
      }, {
        type: 'range', id: 'R1', label: '② R₁', min: 5, max: 30, step: 5, unit: ' Ω',
        get: st => st.R1, set: (st, v) => { st.R1 = v; }
      }, {
        type: 'range', id: 'R2', label: '③ R₂', min: 5, max: 30, step: 5, unit: ' Ω',
        get: st => st.R2, set: (st, v) => { st.R2 = v; }
      }, {
        type: 'range', id: 'U', label: '④ 电源电压', min: 1.5, max: 9, step: 1.5, unit: ' V',
        get: st => st.U, fmt: v => v.toFixed(1), set: (st, v) => { st.U = v; }
      }];
    },
    actLabels: { measure: '测各部分电压', reset: '重置' },
    secondary: ['reset'],
    actions: {
      measure(s, api) {
        const series = s.mode === 'series';
        const U1 = series ? s.U * s.R1 / (s.R1 + s.R2) : s.U;
        const U2 = series ? s.U * s.R2 / (s.R1 + s.R2) : s.U;
        api.say(series
          ? `U₁ = <b>${U1.toFixed(1)} V</b>，U₂ = <b>${U2.toFixed(1)} V</b>，U₁+U₂ = ${(U1 + U2).toFixed(1)} V = 电源电压。`
          : `U₁ = U₂ = <b>${s.U.toFixed(1)} V</b>，各支路电压都等于电源电压。`, 'ok');
        api.conclude('串、并联电路的电压规律', [
          '<b>串联</b>：总电压等于各部分电压之和，<b>U = U₁ + U₂</b>。',
          '<b>并联</b>：各支路两端电压相等，<b>U = U₁ = U₂</b>。',
          '串联时电压按电阻<b>正比</b>分配：U₁/U₂ = R₁/R₂。',
          '电压表必须<b>并联</b>在被测元件两端，不能串联（会断路）。',
          '电压表"+"接线柱接靠近电源正极的一端。',
          '串联电池组总电压等于各节电池电压之和；并联电池组电压不变、容量增大。'
        ]);
      },
      reset(s, api) { Object.assign(s, { mode: 'series', R1: 10, R2: 20, U: 6 }); api.clearConcl(); api.say('已重置。'); }
    },
    hud(s) {
      const series = s.mode === 'series';
      const U1 = series ? s.U * s.R1 / (s.R1 + s.R2) : s.U;
      const U2 = series ? s.U * s.R2 / (s.R1 + s.R2) : s.U;
      return [
        { label: '连接', value: series ? '串联' : '并联' },
        { label: 'U₁', value: U1.toFixed(1) + ' V' },
        { label: 'U₂', value: U2.toFixed(1) + ' V' },
        { label: '总电压', value: s.U.toFixed(1) + ' V', hi: true }
      ];
    }
  });

  function box(x, y, label, R, U) {
    return `<rect x="${x - 24}" y="${y - 11}" width="48" height="22" fill="var(--paper-2)"
              stroke="var(--ink)" stroke-width="1.4"/>
            <text x="${x}" y="${y + 4}" font-size="8.5" fill="var(--muted)" text-anchor="middle"
                  font-family="var(--f-num)">${label}</text>
            <text x="${x}" y="${y - 18}" font-size="8.5" fill="var(--accent)" text-anchor="middle"
                  font-family="var(--f-num)">${U.toFixed(1)}V</text>
            <text x="${x}" y="${y + 30}" font-size="8" fill="var(--faint)" text-anchor="middle"
                  font-family="var(--f-num)">${R}Ω</text>`;
  }
})();

/* ---------------- P17-01 探究电流与电压、电阻的关系 ---------------- */
(function () {
  window.EXPERIMENTS.push({
    id: 'p17-01', code: 'P17-01', title: '探究电流与电压、电阻的关系',
    book: '九年级全一册', unit: '第十七章 欧姆定律', kind: '学生实验',
    opening: '先保持电阻不变改变电压，再保持电压不变改变电阻，记录电流。',
    stageNote: '控制变量：研究 I 与 U 的关系时，R 必须保持不变',
    init: () => ({ U: 3, R: 10, mode: 'U' }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="欧姆定律">
      <text x="230" y="26" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">电流表串联、电压表并联在定值电阻两端</text>

      <g id="circuit"></g>

      <g transform="translate(300,250)">
        <line x1="0" y1="90" x2="120" y2="90" stroke="var(--ink)" stroke-width="1.3"/>
        <line x1="0" y1="0" x2="0" y2="90" stroke="var(--ink)" stroke-width="1.3"/>
        <text x="120" y="106" font-size="8.5" fill="var(--muted)" text-anchor="end"
              font-family="var(--f-sans)">${'U/V'}</text>
        <text x="4" y="10" font-size="8.5" fill="var(--muted)" font-family="var(--f-sans)">I/A</text>
        <path id="line" d="" stroke="var(--accent)" stroke-width="2"/>
      </g>

      <text id="resTxt" x="230" y="336" font-size="16" fill="var(--accent)" text-anchor="middle"
            font-family="var(--f-num)">—</text>
      <text id="lawTxt" x="230" y="364" font-size="11.5" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
      <text id="noteTxt" x="230" y="388" font-size="10.5" fill="var(--f-faint)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
    </svg>`,
    draw(s, el) {
      const I = s.U / s.R;
      el.querySelector('#circuit').innerHTML = `
        <rect x="70" y="80" width="200" height="130" fill="none" stroke="var(--ink)" stroke-width="1.6"/>
        <rect x="140" y="70" width="60" height="20" fill="var(--paper-2)" stroke="var(--ink)" stroke-width="1.4"/>
        <text x="170" y="84" font-size="9" fill="var(--muted)" text-anchor="middle"
              font-family="var(--f-num)">R=${s.R}Ω</text>
        ${window.Parts.battery({ x: 120, y: 198 })}
        ${window.Parts.meter({ x: 250, y: 112, label: 'A', value: I.toFixed(2) + 'A' })}
        <path d="M170 80 v-22 h-40" fill="none" stroke="var(--ink)" stroke-width="1.2"/>
        <text x="140" y="52" font-size="8.5" fill="var(--muted)" text-anchor="middle"
              font-family="var(--f-sans)">电压表 ${s.U}V</text>`;

      const k = 120 / 6;
      el.querySelector('#line').setAttribute('d', `M0 90 L${s.U * k} ${90 - I * 90 / 0.6}`);
      el.querySelector('#resTxt').textContent = `I = ${I.toFixed(2)} A`;
      el.querySelector('#lawTxt').textContent =
        `I = U/R = ${s.U} ÷ ${s.R} = ${I.toFixed(2)} A`;
      el.querySelector('#noteTxt').textContent = s.mode === 'U'
        ? '保持 R 不变，U 增大，I 成正比增大'
        : '保持 U 不变，R 增大，I 成反比减小';
    },
    controls(s) {
      return [{
        type: 'seg', id: 'mode', label: '① 研究哪个关系',
        options: [{ v: 'U', t: 'I 与 U（定 R）' }, { v: 'R', t: 'I 与 R（定 U）' }],
        get: st => st.mode, set: (st, v) => { st.mode = v; }
      }, {
        type: 'range', id: 'U', label: '② 电压 U', min: 1, max: 6, step: 0.5, unit: ' V',
        get: st => st.U, fmt: v => v.toFixed(1), set: (st, v) => { st.U = v; }
      }, {
        type: 'range', id: 'R', label: '③ 电阻 R', min: 5, max: 30, step: 5, unit: ' Ω',
        get: st => st.R, set: (st, v) => { st.R = v; }
      }];
    },
    actLabels: { measure: '读出电流', reset: '重置' },
    secondary: ['reset'],
    actions: {
      measure(s, api) {
        const I = s.U / s.R;
        api.say(`U = ${s.U} V，R = ${s.R} Ω，电流 <b>${I.toFixed(2)} A</b>。`, 'ok');
        api.conclude('欧姆定律', [
          '<b>I = U / R</b>：导体中的电流，跟导体两端电压成正比，跟导体电阻成反比。',
          '研究 I 与 U 的关系时，必须<b>保持 R 不变</b>；研究 I 与 R 时，保持 U 不变。',
          'I–U 图像是一条过原点的<b>直线</b>，说明 I 与 U 成正比。',
          'I–R 图像是<b>双曲线</b>，说明 I 与 R 成反比。',
          '电阻是导体本身的属性，由材料、长度、横截面积和温度决定，与 U、I 无关。',
          '使用欧姆定律时，U、I、R 必须对应<b>同一段导体</b>、同一时刻。'
        ]);
      },
      reset(s, api) { Object.assign(s, { U: 3, R: 10, mode: 'U' }); api.clearConcl(); api.say('已重置。'); }
    },
    hud(s) {
      const I = s.U / s.R;
      return [
        { label: '电压 U', value: s.U.toFixed(1) + ' V' },
        { label: '电阻 R', value: s.R + ' Ω' },
        { label: '电流 I', value: I.toFixed(2) + ' A', hi: true },
        { label: '规律', value: s.mode === 'U' ? 'I ∝ U' : 'I ∝ 1/R' }
      ];
    }
  });
})();

/* ---------------- P18-04 测量小灯泡的电功率 ---------------- */
(function () {
  const RATED_U = 2.5, RATED_I = 0.3;
  window.EXPERIMENTS.push({
    id: 'p18-04', code: 'P18-04', title: '测量小灯泡的电功率',
    book: '九年级全一册', unit: '第十八章 电功率', kind: '学生实验',
    opening: '调节滑动变阻器，让灯泡两端电压变化，观察亮度并算功率。',
    stageNote: '额定电压 2.5 V，额定电流 0.3 A，额定功率 0.75 W',
    init: () => ({ U: 2.5 }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="小灯泡电功率">
      <text x="230" y="26" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">电压表并联在灯泡两端，滑动变阻器串联限流</text>

      <g id="circuit"></g>
      <g id="bulbG"></g>

      <text id="pTxt" x="230" y="322" font-size="20" fill="var(--accent)" text-anchor="middle"
            font-family="var(--f-num)">—</text>
      <text id="stateTxt" x="230" y="350" font-size="12" fill="var(--ink)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
      <text id="noteTxt" x="230" y="378" font-size="10.5" fill="var(--f-muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
    </svg>`,
    draw(s, el) {
      const R = 8.33;                             // 2.5 / 0.3
      const I = s.U / R;
      const P = s.U * I;
      const bright = Math.min(1, P / 0.75);

      el.querySelector('#bulbG').innerHTML =
        window.Parts.bulb({ x: 150, y: 90, on: s.U > 1.2, r: 17 }) +
        `<text x="150" y="128" font-size="9" fill="var(--muted)" text-anchor="middle"
           font-family="var(--f-sans)">L（2.5V 0.3A）</text>`;

      el.querySelector('#circuit').innerHTML = `
        <rect x="60" y="76" width="180" height="150" fill="none" stroke="var(--ink)" stroke-width="1.6"/>
        ${window.Parts.battery({ x: 105, y: 218 })}
        ${window.Parts.rheostat({ x: 258, y: 150, w: 100, pos: (s.U - 0.5) / 3 })}
        <path d="M240 150 h18" stroke="var(--ink)" stroke-width="1.4"/>
        ${window.Parts.meter({ x: 246, y: 96, label: 'A', value: I.toFixed(2) + 'A', w: 52 })}
        <text x="150" y="58" font-size="8.5" fill="var(--muted)" text-anchor="middle"
              font-family="var(--f-sans)">V ${s.U.toFixed(1)}V</text>
        <path d="M134 90 h-36 v-20" fill="none" stroke="var(--ink)" stroke-width="1.1"/>`;

      el.querySelector('#pTxt').textContent = `P = ${P.toFixed(2)} W`;
      el.querySelector('#stateTxt').textContent = Math.abs(s.U - RATED_U) < 0.05
        ? '正常发光（额定电压下）'
        : s.U > RATED_U ? '比正常亮，长时间会烧坏' : '比正常暗';
      el.querySelector('#noteTxt').textContent =
        `P = UI = ${s.U.toFixed(1)} × ${I.toFixed(2)} = ${P.toFixed(2)} W，亮度约 ${(bright * 100).toFixed(0)}%`;
    },
    controls(s) {
      return [{
        type: 'range', id: 'U', label: '① 灯泡两端电压', min: 0.5, max: 3, step: 0.1, unit: ' V',
        get: st => st.U, fmt: v => v.toFixed(1), set: (st, v) => { st.U = v; }
      }];
    },
    actLabels: { measure: '读电表并计算', reset: '重置' },
    secondary: ['reset'],
    actions: {
      measure(s, api) {
        const I = s.U / 8.33;
        const P = s.U * I;
        api.say(`U = ${s.U.toFixed(1)} V，I = ${I.toFixed(2)} A，P = UI = <b>${P.toFixed(2)} W</b>。<br>
          ${Math.abs(s.U - 2.5) < 0.05 ? '此时为额定功率 0.75 W，灯泡正常发光。' : s.U > 2.5 ? '高于额定电压，实际功率大于额定功率。' : '低于额定电压，实际功率小于额定功率。'}`, 'ok');
        api.conclude('额定功率与实际功率', [
          '<b>额定电压</b>：用电器正常工作时的电压；<b>额定功率</b>：额定电压下的功率。',
          '<b>P = UI = I²R = U²/R</b>，三个公式在纯电阻电路中通用。',
          '实际电压等于额定电压时，实际功率等于额定功率，正常发光。',
          '实际电压高于额定电压，实际功率变大，灯变亮，长期会烧坏。',
          '实际电压低于额定电压，实际功率变小，灯变暗。',
          '测量原理：伏安法测 P = UI；滑动变阻器用来改变灯泡两端电压。'
        ]);
      },
      reset(s, api) { s.U = 2.5; api.clearConcl(); api.say('已重置。'); }
    },
    hud(s) {
      const I = s.U / 8.33;
      return [
        { label: '电压 U', value: s.U.toFixed(1) + ' V' },
        { label: '电流 I', value: I.toFixed(2) + ' A' },
        { label: '功率 P', value: (s.U * I).toFixed(2) + ' W', hi: true },
        { label: '状态', value: Math.abs(s.U - 2.5) < 0.05 ? '正常' : s.U > 2.5 ? '偏亮' : '偏暗' }
      ];
    }
  });
})();

/* ---------------- P20-02 探究通电螺线管的磁场 ---------------- */
(function () {
  window.EXPERIMENTS.push({
    id: 'p20-02', code: 'P20-02', title: '探究通电螺线管的磁场',
    book: '九年级全一册', unit: '第二十章 电与磁', kind: '学生实验',
    opening: '改变电流方向，用小磁针看螺线管的 N、S 极怎么变。',
    stageNote: '安培定则：右手握螺线管，四指指电流方向，拇指所指为 N 极',
    init: () => ({ dir: 1, turns: 6 }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="通电螺线管">
      <text x="230" y="28" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">改变电流方向，磁极对调</text>

      <g id="coil"></g>
      <g id="field"></g>
      <g id="poles"></g>
      <g id="compass"></g>

      <text id="ruleTxt" x="230" y="330" font-size="12.5" fill="var(--ink)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
      <text id="noteTxt" x="230" y="358" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
    </svg>`,
    draw(s, el) {
      const cx = 230, cy = 180, w = 180, h = 56;
      const n = s.turns;
      let coil = `<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="26"
        fill="var(--paper-2)" fill-opacity=".5" stroke="var(--ink)" stroke-width="1.2"/>`;
      for (let i = 0; i < n; i++) {
        const x = cx - w / 2 + 14 + i * (w - 28) / (n - 1);
        coil += `<ellipse cx="${x}" cy="${cy}" rx="7" ry="${h / 2 - 2}" fill="none"
          stroke="var(--accent)" stroke-width="1.6"/>`;
      }
      coil += `<path d="M${cx - w / 2 - 30} ${cy - h / 2 + 26} h30" stroke="var(--accent)" stroke-width="1.8"/>
               <path d="M${cx + w / 2} ${cy + h / 2 - 26} h30" stroke="var(--accent)" stroke-width="1.8"/>`;
      el.querySelector('#coil').innerHTML = coil;

      const left = s.dir > 0 ? 'S' : 'N';
      const right = s.dir > 0 ? 'N' : 'S';
      el.querySelector('#poles').innerHTML = `
        <text x="${cx - w / 2 - 16}" y="${cy + 6}" font-size="20" fill="var(--accent)"
              text-anchor="middle" font-family="var(--f-num)">${left}</text>
        <text x="${cx + w / 2 + 16}" y="${cy + 6}" font-size="20" fill="var(--accent)"
              text-anchor="middle" font-family="var(--f-num)">${right}</text>`;

      const dir = s.dir > 0 ? 1 : -1;
      el.querySelector('#field').innerHTML = [0, 1, 2].map(i => {
        const r = 70 + i * 24;
        return `<path d="M${cx + (w / 2 + 8) * dir} ${cy} q${r * .5 * dir} -${r * .9} 0 -${r * 1.6} q-${r * .5 * dir} -${r * .9} 0 -${r * 1.6}"
          fill="none" stroke="var(--muted)" stroke-width="1" opacity=".35"
          transform="translate(0,${r * .8}) scale(1,-1) translate(0,-${r * .8})"/>`;
      }).join('');

      el.querySelector('#compass').innerHTML = `
        <circle cx="120" cy="300" r="18" fill="var(--paper-2)" stroke="var(--ink)" stroke-width="1.3"/>
        <path d="M120 300 l-5 8 l5 -18 l5 18 Z" fill="var(--accent)"/>
        <text x="120" y="330" font-size="9" fill="var(--muted)" text-anchor="middle"
              font-family="var(--f-sans)">小磁针</text>`;

      el.querySelector('#ruleTxt').textContent =
        `电流从${s.dir > 0 ? '左' : '右'}端流入，右端是 ${right} 极`;
      el.querySelector('#noteTxt').textContent =
        '右手握螺线管，四指顺着电流环绕方向，拇指指向 N 极';
    },
    controls(s) {
      return [{
        type: 'seg', id: 'dir', label: '① 电流方向',
        options: [{ v: '1', t: '从左端流入' }, { v: '-1', t: '从右端流入' }],
        get: st => String(st.dir), set: (st, v) => { st.dir = +v; }
      }, {
        type: 'range', id: 'turns', label: '② 线圈匝数', min: 4, max: 10, step: 1, unit: ' 匝',
        get: st => st.turns, set: (st, v) => { st.turns = v; }
      }];
    },
    actLabels: { check: '判断磁极', reset: '重置' },
    secondary: ['reset'],
    actions: {
      check(s, api) {
        const right = s.dir > 0 ? 'N' : 'S';
        api.say(`电流从${s.dir > 0 ? '左' : '右'}端流入，用安培定则判断：右端为 <b>${right}</b> 极。`, 'ok');
        api.conclude('通电螺线管的磁场', [
          '通电螺线管外部磁场与<b>条形磁体</b>相似，一端为 N 极、一端为 S 极。',
          '<b>安培定则</b>：右手握螺线管，四指指向电流方向，拇指所指的一端就是 N 极。',
          '改变<b>电流方向</b>，磁极对调。',
          '增大<b>电流</b>或增加<b>匝数</b>，磁性增强；插入铁芯磁性大幅增强（电磁铁）。',
          '磁极间的相互作用：同名磁极相斥，异名磁极相吸。',
          '磁感线在磁体外部从 N 极出发回到 S 极，内部从 S 到 N。'
        ]);
      },
      reset(s, api) { Object.assign(s, { dir: 1, turns: 6 }); api.clearConcl(); api.say('已重置。'); }
    },
    hud(s) {
      return [
        { label: '电流方向', value: s.dir > 0 ? '左进' : '右进' },
        { label: '左端', value: s.dir > 0 ? 'S' : 'N' },
        { label: '右端', value: s.dir > 0 ? 'N' : 'S', hi: true },
        { label: '匝数', value: s.turns + ' 匝' }
      ];
    }
  });
})();

/* ---------------- P20-06 探究电磁感应现象 ---------------- */
(function () {
  window.EXPERIMENTS.push({
    id: 'p20-06', code: 'P20-06', title: '探究电磁感应现象',
    book: '九年级全一册', unit: '第二十章 电与磁', kind: '学生实验',
    opening: '让导体在磁场中左右运动，看电流表指针是否偏转。',
    stageNote: '闭合电路的一部分导体做切割磁感线运动时，电路中产生感应电流',
    init: () => ({ move: 0, dir: 0 }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="电磁感应">
      <text x="230" y="28" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">导体切割磁感线，电流表指针偏转</text>

      <!-- 磁极 -->
      <rect x="90" y="90" width="58" height="150" fill="rgba(200,70,60,.18)"
            stroke="var(--ink)" stroke-width="1.5"/>
      <text x="119" y="170" font-size="20" fill="var(--accent)" text-anchor="middle"
            font-family="var(--f-num)">N</text>
      <rect x="310" y="90" width="58" height="150" fill="rgba(60,90,200,.16)"
            stroke="var(--ink)" stroke-width="1.5"/>
      <text x="339" y="170" font-size="20" fill="var(--accent)" text-anchor="middle"
            font-family="var(--f-num)">S</text>

      <!-- 导体 -->
      <g id="rod">
        <line x1="230" y1="96" x2="230" y2="234" stroke="var(--ink)" stroke-width="5"/>
        <text x="230" y="252" font-size="9.5" fill="var(--muted)" text-anchor="middle"
              font-family="var(--f-sans)">导体 ab</text>
      </g>
      <g id="motion"></g>

      <!-- 电流表 -->
      <g transform="translate(180,300)">
        <rect x="0" y="0" width="100" height="56" rx="4" fill="var(--paper-2)"
              stroke="var(--ink)" stroke-width="1.4"/>
        <text x="12" y="16" font-size="9" fill="var(--muted)" font-family="var(--f-sans)">电流表</text>
        <line id="needle" x1="50" y1="46" x2="50" y2="22" stroke="var(--accent)" stroke-width="2"
              stroke-linecap="round"/>
        <text x="50" y="52" font-size="8" fill="var(--f-faint)" text-anchor="middle"
              font-family="var(--f-num)">0</text>
      </g>
      <path d="M230 234 v66" stroke="var(--ink)" stroke-width="1.4"/>
      <path d="M230 300 h-50" stroke="var(--ink)" stroke-width="1.4"/>
      <path d="M230 300 h50" stroke="var(--ink)" stroke-width="1.4"/>

      <text id="stateTxt" x="230" y="380" font-size="12" fill="var(--accent)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
    </svg>`,
    draw(s, el) {
      const dx = s.move * 2;
      el.querySelector('#rod').setAttribute('transform', `translate(${dx},0)`);
      el.querySelector('#motion').innerHTML = s.move
        ? `<path d="M${230 + dx + (s.move > 0 ? 14 : -14)} 170 h${s.move > 0 ? -26 : 26}"
             stroke="var(--accent)" stroke-width="1.6" marker-end="url(#arw)"/>`
        : '';
      const cur = s.move ? (s.move * (s.dir > 0 ? 1 : -1)) : 0;
      const ang = Math.max(-34, Math.min(34, cur * 6));
      el.querySelector('#needle').setAttribute('transform', `rotate(${ang} 50 46)`);
      el.querySelector('#stateTxt').textContent = s.move === 0
        ? '导体静止，指针不偏转'
        : `导体${s.move > 0 ? '向右' : '向左'}运动，指针向${ang > 0 ? '右' : '左'}偏转`;
    },
    controls(s) {
      return [{
        type: 'range', id: 'move', label: '① 导体运动', min: -3, max: 3, step: 1,
        get: st => st.move, fmt: v => v === 0 ? '静止' : v > 0 ? `向右 ${v}` : `向左 ${-v}`,
        set: (st, v) => { st.move = v; }
      }, {
        type: 'seg', id: 'dir', label: '② 磁场方向',
        options: [{ v: '1', t: 'N 在左' }, { v: '-1', t: 'N 在右（对调）' }],
        get: st => String(st.dir), set: (st, v) => { st.dir = +v; }
      }];
    },
    actLabels: { check: '观察指针', reset: '重置' },
    secondary: ['reset'],
    actions: {
      check(s, api) {
        if (!s.move) {
          api.say('导体静止，没有切割磁感线，<b>不产生感应电流</b>，指针不偏转。', 'warn');
          return;
        }
        api.say(`导体${s.move > 0 ? '向右' : '向左'}切割磁感线，电路中产生感应电流，指针偏转。<br>
          改变运动方向或磁场方向，电流方向都会反向。`, 'ok');
        api.conclude('电磁感应', [
          '<b>闭合电路的一部分导体</b>做<b>切割磁感线</b>运动时，电路中产生感应电流。',
          '条件：电路闭合 + 导体做切割磁感线运动（两者缺一不可）。',
          '感应电流的方向与<b>导体运动方向</b>和<b>磁场方向</b>都有关。',
          '导体运动越快、磁场越强，感应电流越大。',
          '能量转化：机械能 → 电能，这是<b>发电机</b>的原理。',
          '奥斯特实验说明"电生磁"，电磁感应说明"磁生电"，两者方向相反。'
        ]);
      },
      reset(s, api) { Object.assign(s, { move: 0, dir: 0 }); api.clearConcl(); api.say('已重置。'); }
    },
    hud(s) {
      return [
        { label: '运动', value: s.move === 0 ? '静止' : s.move > 0 ? '向右' : '向左' },
        { label: '切割磁感线', value: s.move ? '是' : '否', hi: !!s.move },
        { label: '感应电流', value: s.move ? '有' : '无' },
        { label: '能量转化', value: '机械能→电能' }
      ];
    }
  });
})();

/* ---------------- 按教材章序排列 ---------------- */
(function () {
  const CN = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    '二十一', '二十二'];
  const idx = e => {
    const m = (e.unit || '').match(/第([一二三四五六七八九十]+)章/);
    return m ? CN.indexOf(m[1]) : 99;
  };
  const sub = e => {
    const m = (e.code || '').match(/^P(\d+)-(\d+)$/);
    return m ? +m[2] : 99;
  };
  (window.EXPERIMENTS || []).sort((a, b) => idx(a) - idx(b) || sub(a) - sub(b));
})();
