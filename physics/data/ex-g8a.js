/* ============================================================
   实验数据 · 八年级上册（人教版 2024）
   ============================================================ */
window.EXPERIMENTS = window.EXPERIMENTS || [];

/* ---------------- P1-01 长度和时间的测量 ---------------- */
(function () {
  const OBJS = {
    pencil: { n: '铅笔', len: 17.50, c: '#d9a13c' },
    block: { n: '木块', len: 3.25, c: '#b98a5a' },
    book: { n: '物理课本', len: 25.90, c: '#5f7fa8' }
  };
  const DIV = { 1: '1 mm', 10: '1 cm' };

  window.EXPERIMENTS.push({
    id: 'p1-01', code: 'P1-01', title: '长度和时间的测量',
    book: '八年级上册', unit: '第一章 机械运动', kind: '基本操作',
    opening: '把物体放在刻度尺上，读出长度；注意估读到分度值的下一位。',
    stageNote: '读数 = 准确值 + 估读值 + 单位；估读位由分度值决定',
    init: () => ({ obj: 'pencil', div: 1 }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="长度测量">
      <text x="230" y="34" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">物体左端对齐零刻度，右端读数</text>

      <g id="obj"></g>
      <g id="rulerG" transform="translate(40,240)"></g>

      <g id="pointer" opacity=".9">
        <line x1="0" y1="140" x2="0" y2="238" stroke="var(--accent)" stroke-width="1.2"
              stroke-dasharray="4 3"/>
        <circle cx="0" cy="140" r="3" fill="var(--accent)"/>
      </g>

      <text id="readTxt" x="230" y="330" font-size="22" fill="var(--ink)" text-anchor="middle"
            font-family="var(--f-num)">—</text>
      <text id="unitTxt" x="230" y="352" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
      <text x="230" y="386" font-size="10.5" fill="var(--f-faint)" text-anchor="middle"
            font-family="var(--f-sans)">读数要估读到分度值的下一位</text>
    </svg>`,
    draw(s, el) {
      const o = OBJS[s.obj];
      const scale = 300 / 28;                        // 28 cm 宽的尺，映射到 300 px
      const objW = o.len * scale;
      el.querySelector('#obj').innerHTML = `
        <rect x="48" y="196" width="${objW}" height="40" rx="3"
              fill="${o.c}" opacity=".8" stroke="var(--ink)" stroke-width="1.4"/>
        <text x="${48 + objW / 2}" y="222" font-size="10.5" fill="#fff" text-anchor="middle"
              font-family="var(--f-sans)">${o.n}</text>`;
      el.querySelector('#rulerG').innerHTML =
        window.Parts.ruler({ x: 0, y: 0, w: 320, h: 40, show: 28 });
      el.querySelector('#pointer').setAttribute('transform', `translate(${48 + objW},0)`);

      const div = s.div;                              // mm
      const raw = o.len * 10;                         // cm → mm
      let read, note;
      if (div === 1) {
        read = (Math.round(raw * 10) / 10).toFixed(2) + ' cm';
        note = '分度值 1 mm：准确到 0.1 cm，估读到 0.01 cm';
      } else {
        read = (Math.round(raw / 10 * 10) / 10).toFixed(1) + ' cm';
        note = '分度值 1 cm：准确到 1 cm，估读到 0.1 cm';
      }
      el.querySelector('#readTxt').textContent = read;
      el.querySelector('#unitTxt').textContent = note;
    },
    controls(s) {
      return [{
        type: 'seg', id: 'obj', label: '① 选择物体',
        options: Object.keys(OBJS).map(k => ({ v: k, t: OBJS[k].n })),
        get: st => st.obj, set: (st, v) => { st.obj = v; }
      }, {
        type: 'seg', id: 'div', label: '② 刻度尺分度值',
        options: [{ v: '1', t: '1 mm' }, { v: '10', t: '1 cm' }],
        get: st => String(st.div), set: (st, v) => { st.div = +v; }
      }];
    },
    actLabels: { read: '读一次数', reset: '重置' },
    secondary: ['reset'],
    actions: {
      read(s, api) {
        const o = OBJS[s.obj];
        const div = s.div === 1 ? 0.1 : 1;
        const v = Math.round(o.len / div) * div;
        api.say(`物体长 <b>${v.toFixed(s.div === 1 ? 2 : 1)} cm</b>。<br>
          分度值 ${s.div === 1 ? '1 mm' : '1 cm'}，所以要估读到 ${s.div === 1 ? '0.1 mm' : '1 mm'}（即 ${s.div === 1 ? '0.01 cm' : '0.1 cm'}）。<br>
          记录结果必须带<b>单位</b>，只写数字不算对。`, 'ok');
        api.conclude('测量的三个要点', [
          '<b>分度值</b>决定读到哪一位：分度值 1 mm，就读到 0.1 mm（0.01 cm）。',
          '<b>估读</b>：最后一位是估读的，允许有偏差，但不能不估。',
          '<b>单位</b>：1.75 cm 与 17.5 mm 是同一个长度，写法不同。',
          '多次测量取平均值可以减小<b>误差</b>，但不能消除；错误（如零刻度没对齐）必须避免。',
          '误差不是错误：误差由仪器、方法、人眼决定，不可避免；错误是操作不规范造成的。'
        ]);
      },
      reset(s, api) { api.clearConcl(); api.say('已重置。'); }
    },
    hud(s) {
      const o = OBJS[s.obj];
      const div = s.div === 1 ? 0.1 : 1;
      return [
        { label: '物体', value: o.n },
        { label: '真实长度', value: o.len.toFixed(2) + ' cm' },
        { label: '分度值', value: DIV[s.div] },
        { label: '应读到', value: (Math.round(o.len / div) * div).toFixed(s.div === 1 ? 2 : 1) + ' cm', hi: true }
      ];
    }
  });
})();

/* ---------------- P1-02 测量平均速度 ---------------- */
(function () {
  window.EXPERIMENTS.push({
    id: 'p1-02', code: 'P1-02', title: '测量平均速度',
    book: '八年级上册', unit: '第一章 机械运动', kind: '学生实验',
    opening: '让小车从斜面顶端滑下，分别测全程和上半程的时间，算平均速度。',
    stageNote: '斜面越小越好测：坡度太陡，时间太短，误差大',
    init: () => ({ L: 1.0, h: 0.20, run: 0 }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="测量平均速度">
      <text x="230" y="30" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">斜面越长、越缓，时间越好测</text>

      <line x1="60" y1="292" x2="400" y2="292" stroke="var(--ink)" stroke-width="2"/>
      <path id="incline" d="" stroke="var(--ink)" stroke-width="2.2" fill="none"/>
      <g id="cartG"></g>

      <g id="marks"></g>

      <text id="sTxt" x="230" y="326" font-size="12" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
      <text id="tTxt" x="230" y="350" font-size="12" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
      <text id="vTxt" x="230" y="380" font-size="20" fill="var(--accent)" text-anchor="middle"
            font-family="var(--f-num)">—</text>
    </svg>`,
    draw(s, el) {
      const x0 = 60, x1 = 400, y0 = 292;
      const dy = s.h * 260;                          // 高度差像素
      el.querySelector('#incline').setAttribute('d', `M${x0} ${y0} L${x1} ${y0 - dy}`);
      const ang = Math.atan2(dy, x1 - x0);
      const cx = x0 + 20, cy = y0 - 20 * Math.tan(ang) - 26;
      el.querySelector('#cartG').innerHTML =
        window.Parts.cart({ x: cx, y: cy, w: 48, h: 26 }) +
        `<text x="${cx + 24}" y="${cy + 52}" font-size="9.5" fill="var(--muted)"
           text-anchor="middle" font-family="var(--f-sans)">小车</text>`;

      const half = (x0 + x1) / 2;
      el.querySelector('#marks').innerHTML = `
        <line x1="${x0}" y1="${y0 - dy - 10}" x2="${x0}" y2="${y0 + 6}" stroke="var(--accent)" stroke-width="1.4"/>
        <line x1="${half}" y1="${y0 - dy / 2 - 10}" x2="${half}" y2="${y0 + 6}" stroke="var(--accent)"
              stroke-width="1.4" stroke-dasharray="4 3"/>
        <line x1="${x1}" y1="${y0 - 10}" x2="${x1}" y2="${y0 + 6}" stroke="var(--accent)" stroke-width="1.4"/>
        <text x="${x0}" y="${y0 + 22}" font-size="9.5" fill="var(--muted)" text-anchor="middle"
              font-family="var(--f-sans)">起点</text>
        <text x="${half}" y="${y0 + 22}" font-size="9.5" fill="var(--muted)" text-anchor="middle"
              font-family="var(--f-sans)">中点</text>
        <text x="${x1}" y="${y0 + 22}" font-size="9.5" fill="var(--muted)" text-anchor="middle"
              font-family="var(--f-sans)">终点</text>`;

      const r = calc(s);
      el.querySelector('#sTxt').textContent = `斜面长 s = ${s.L.toFixed(2)} m，高 h = ${s.h.toFixed(2)} m`;
      el.querySelector('#tTxt').textContent = s.run
        ? `全程 t = ${r.tAll.toFixed(2)} s ｜ 上半程 t₁ = ${r.t1.toFixed(2)} s`
        : '点"释放小车"开始计时';
      el.querySelector('#vTxt').textContent = s.run ? `v = ${r.vAll.toFixed(2)} m/s` : '—';
    },
    controls(s) {
      return [{
        type: 'range', id: 'L', label: '① 斜面长度', min: 0.6, max: 1.6, step: 0.1, unit: ' m',
        get: st => st.L, fmt: v => v.toFixed(1), set: (st, v) => { st.L = v; st.run = 0; }
      }, {
        type: 'range', id: 'h', label: '② 斜面高度', min: 0.05, max: 0.40, step: 0.01, unit: ' m',
        get: st => st.h, fmt: v => v.toFixed(2), set: (st, v) => { st.h = v; st.run = 0; }
      }];
    },
    actLabels: { run: '释放小车，计时', reset: '重置' },
    secondary: ['reset'],
    actions: {
      run(s, api) {
        s.run = 1;
        const r = calc(s);
        api.say(`全程 ${s.L.toFixed(2)} m，用时 <b>${r.tAll.toFixed(2)} s</b>，平均速度 v = s/t = <b>${r.vAll.toFixed(2)} m/s</b>。<br>
          上半程 ${(s.L / 2).toFixed(2)} m，用时 ${r.t1.toFixed(2)} s，v₁ = ${r.v1.toFixed(2)} m/s；<br>
          下半程 v₂ = ${r.v2.toFixed(2)} m/s，比 v₁ 大 —— 小车在<b>加速</b>。`, 'ok');
        api.conclude('平均速度不是速度的平均', [
          '公式：<b>v = s / t</b>，必须用<b>总路程 ÷ 总时间</b>。',
          `本例全程 v = ${r.vAll.toFixed(2)} m/s，而 (v₁+v₂)/2 = ${((r.v1 + r.v2) / 2).toFixed(2)} m/s，两者不相等。`,
          '小车沿斜面下滑是<b>变速运动</b>，速度越来越大。',
          '坡度越缓、斜面越长，时间越长，测量误差越小。',
          '测时间要从<b>小车开始运动</b>计到<b>撞击金属片</b>，不能提前或滞后。'
        ]);
      },
      reset(s, api) { s.run = 0; api.clearConcl(); api.say('已重置。'); }
    },
    hud(s) {
      const r = calc(s);
      return [
        { label: '全程 s', value: s.L.toFixed(2) + ' m' },
        { label: '全程 t', value: s.run ? r.tAll.toFixed(2) + ' s' : '—' },
        { label: '平均速度', value: s.run ? r.vAll.toFixed(2) + ' m/s' : '—', hi: !!s.run },
        { label: '下半程 v₂', value: s.run ? r.v2.toFixed(2) + ' m/s' : '—' }
      ];
    }
  });

  function calc(s) {
    const g = 9.8;
    const a = g * s.h / s.L * 0.55;                 // 阻力和转动惯量折算
    const tAll = Math.sqrt(2 * s.L / a);
    const t1 = Math.sqrt(2 * (s.L / 2) / a);
    const vAll = s.L / tAll;
    const v1 = (s.L / 2) / t1;
    const v2 = (s.L / 2) / (tAll - t1);
    return { a, tAll, t1, vAll, v1, v2 };
  }
})();

/* ---------------- P2-01 声音的产生与传播 ---------------- */
(function () {
  const MEDIA = {
    air: { n: '空气', v: 340, c: 'rgba(200,220,235,.35)' },
    water: { n: '水', v: 1500, c: 'rgba(120,170,210,.45)' },
    steel: { n: '钢铁', v: 5200, c: 'rgba(150,155,160,.5)' },
    vacuum: { n: '真空', v: 0, c: 'rgba(220,220,220,.12)' }
  };
  window.EXPERIMENTS.push({
    id: 'p2-01', code: 'P2-01', title: '声音的产生与传播',
    book: '八年级上册', unit: '第二章 声现象', kind: '演示实验',
    opening: '敲响音叉，换不同介质，看声音能不能传出去、传得多快。',
    stageNote: '声速随介质和温度变化；15 ℃ 空气中约 340 m/s',
    init: () => ({ med: 'air', on: false, dist: 100 }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="声音的传播">
      <text x="230" y="30" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">音叉振动 → 介质 → 耳朵</text>

      <!-- 音叉 -->
      <g transform="translate(86,120)">
        <path d="M0 40 V0 M22 40 V0" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/>
        <path d="M0 40 q11 14 22 0" stroke="var(--ink)" stroke-width="3" fill="none"/>
        <rect x="8" y="52" width="6" height="70" rx="2" fill="var(--paper-3)" stroke="var(--ink)" stroke-width="1.3"/>
        <text x="11" y="140" font-size="9.5" fill="var(--muted)" text-anchor="middle"
              font-family="var(--f-sans)">音叉</text>
      </g>

      <!-- 介质区域 -->
      <rect id="medBox" x="140" y="96" width="200" height="150" rx="8"
            fill="rgba(200,220,235,.35)" stroke="var(--line)" stroke-width="1.2"/>
      <g id="waves"></g>
      <text id="medName" x="240" y="268" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">空气</text>

      <!-- 耳朵 -->
      <g transform="translate(372,150)" id="ear">
        <path d="M0 20 q-14 -6 -14 12 q0 18 14 12" fill="none" stroke="var(--ink)" stroke-width="2"/>
        <path d="M4 24 q-6 8 0 16" fill="none" stroke="var(--ink)" stroke-width="1.4"/>
        <text x="0" y="70" font-size="9.5" fill="var(--muted)" text-anchor="middle"
              font-family="var(--f-sans)">人耳</text>
      </g>

      <text id="vTxt" x="230" y="310" font-size="20" fill="var(--ink)" text-anchor="middle"
            font-family="var(--f-num)">—</text>
      <text id="msgTxt" x="230" y="338" font-size="11.5" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
      <text id="timeTxt" x="230" y="372" font-size="12" fill="var(--accent)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
    </svg>`,
    draw(s, el) {
      const m = MEDIA[s.med];
      el.querySelector('#medBox').setAttribute('fill', m.c);
      el.querySelector('#medName').textContent = m.n;

      const on = s.on && m.v > 0;
      el.querySelector('#waves').innerHTML = on
        ? [0, 1, 2, 3, 4].map(i => {
          const x = 168 + i * 36;
          return `<path d="M${x} 120 q10 -18 20 0 q10 18 20 0" fill="none" stroke="var(--accent)"
            stroke-width="1.8" opacity="${1 - i * .16}"/>`;
        }).join('')
        : '';

      el.querySelector('#ear').setAttribute('opacity', s.on && m.v > 0 ? 1 : .35);
      el.querySelector('#vTxt').textContent = m.v > 0 ? `v = ${m.v} m/s` : '无法传播';
      el.querySelector('#msgTxt').textContent = s.med === 'vacuum'
        ? '真空罩里只剩音叉在振动，听不到声音 —— 声音的传播需要介质'
        : `${m.n}中声速 ${m.v} m/s，比空气中${m.v > 340 ? '快' : '相同'}`;
      el.querySelector('#timeTxt').textContent = m.v > 0
        ? `传到 ${s.dist} m 外需要 ${(s.dist / m.v * 1000).toFixed(1)} ms`
        : '—';
    },
    controls(s) {
      return [{
        type: 'seg', id: 'med', label: '① 传播介质',
        options: Object.keys(MEDIA).map(k => ({ v: k, t: MEDIA[k].n })),
        get: st => st.med, set: (st, v) => { st.med = v; st.on = false; }
      }, {
        type: 'range', id: 'dist', label: '② 距离', min: 10, max: 1000, step: 10, unit: ' m',
        get: st => st.dist, set: (st, v) => { st.dist = v; }
      }];
    },
    actLabels: { strike: '敲响音叉', reset: '重置' },
    secondary: ['reset'],
    actions: {
      strike(s, api) {
        s.on = true;
        const m = MEDIA[s.med];
        if (m.v === 0) {
          api.say('音叉在振动，但<b>听不到声音</b>。真空不能传声 —— 声音的传播需要介质。', 'warn');
          return;
        }
        api.say(`在${m.n}中，声音以 <b>${m.v} m/s</b> 传播，传到 ${s.dist} m 外要 ${(s.dist / m.v).toFixed(3)} s。<br>
          声音是由物体<b>振动</b>产生的，振动停止，发声也停止。`, 'ok');
        api.conclude('声音的产生与传播', [
          '产生：声源<b>振动</b>；振动停止，发声停止（但声音还会继续传播一会儿）。',
          '传播需要<b>介质</b>：固体、液体、气体都能传声，<b>真空不能传声</b>。',
          '声速：一般 <b>v固 > v液 > v气</b>；15 ℃ 空气中约 340 m/s。',
          '声速还随温度升高而增大：气温每升高 1 ℃，声速约增加 0.6 m/s。',
          '回声是声音遇到障碍物反射回来的现象；人耳能区分回声与原声的时间间隔要大于 0.1 s。'
        ]);
      },
      reset(s, api) { s.on = false; api.clearConcl(); api.say('已重置。'); }
    },
    hud(s) {
      const m = MEDIA[s.med];
      return [
        { label: '介质', value: m.n },
        { label: '声速', value: m.v ? m.v + ' m/s' : '0', hi: m.v > 0 },
        { label: '距离', value: s.dist + ' m' },
        { label: '传播时间', value: m.v ? (s.dist / m.v * 1000).toFixed(1) + ' ms' : '—' }
      ];
    }
  });
})();

/* ---------------- P2-02 音调与频率 ---------------- */
(function () {
  window.EXPERIMENTS.push({
    id: 'p2-02', code: 'P2-02', title: '探究音调与频率的关系',
    book: '八年级上册', unit: '第二章 声现象', kind: '学生实验',
    opening: '把钢尺一端压在桌边，改变伸出长度，拨动听音调。',
    stageNote: '钢尺越短，振动越快，频率越高，音调越高',
    init: () => ({ L: 12, pluck: 0 }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="音调与频率">
      <text x="230" y="30" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">伸出越长 → 振动越慢 → 音调越低</text>

      <!-- 桌边 -->
      <rect x="40" y="150" width="150" height="26" fill="var(--paper-3)" stroke="var(--ink)" stroke-width="1.5"/>
      <line x1="40" y1="176" x2="190" y2="176" stroke="var(--ink)" stroke-width="2"/>
      <text x="115" y="144" font-size="10" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">桌面</text>

      <!-- 钢尺 -->
      <rect id="ruler2" x="150" y="162" width="120" height="10" rx="2"
            fill="#c9ced6" stroke="var(--ink)" stroke-width="1.3"/>
      <g id="vib"></g>

      <!-- 波形 -->
      <g transform="translate(40,240)">
        <rect x="0" y="0" width="380" height="90" rx="4" fill="var(--paper-2)"
              stroke="var(--line)" stroke-width="1"/>
        <line x1="0" y1="45" x2="380" y2="45" stroke="var(--line-2)" stroke-width="1"/>
        <path id="wave" d="" fill="none" stroke="var(--accent)" stroke-width="2"/>
        <text x="8" y="16" font-size="9.5" fill="var(--muted)" font-family="var(--f-sans)">波形</text>
      </g>

      <text id="fTxt" x="230" y="360" font-size="20" fill="var(--ink)" text-anchor="middle"
            font-family="var(--f-num)">—</text>
      <text id="noteTxt" x="230" y="384" font-size="11.5" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
    </svg>`,
    draw(s, el) {
      const px = 10 + s.L * 9;
      el.querySelector('#ruler2').setAttribute('width', px);
      const f = freq(s.L);
      el.querySelector('#vib').innerHTML = s.pluck
        ? `<path d="M${150 + px} 167 q-${px * .3} -10 -${px * .6} 0" fill="none"
             stroke="var(--accent)" stroke-width="1.6" opacity=".8"/>` : '';

      const k = Math.min(10, Math.max(1.2, f / 20));
      let d = 'M0 45';
      for (let x = 0; x <= 380; x += 2) {
        d += ` L${x} ${45 - Math.sin(x / 380 * Math.PI * 2 * k) * 26}`;
      }
      el.querySelector('#wave').setAttribute('d', d);

      el.querySelector('#fTxt').textContent = `f ≈ ${f.toFixed(0)} Hz`;
      el.querySelector('#noteTxt').textContent = f < 20 ? '低于人耳听觉下限'
        : f > 20000 ? '高于人耳听觉上限（超声波）'
          : `音调${f > 500 ? '较高' : f > 150 ? '适中' : '较低'}（人耳 20–20000 Hz）`;
    },
    controls(s) {
      return [{
        type: 'range', id: 'L', label: '① 钢尺伸出长度', min: 4, max: 20, step: 1, unit: ' cm',
        get: st => st.L, set: (st, v) => { st.L = v; st.pluck = 0; }
      }];
    },
    actLabels: { pluck: '拨动钢尺', reset: '重置' },
    secondary: ['reset'],
    actions: {
      pluck(s, api) {
        s.pluck = 1;
        const f = freq(s.L);
        api.say(`伸出 ${s.L} cm，振动频率约 <b>${f.toFixed(0)} Hz</b>。<br>
          伸出越短，振动越快，频率越高，<b>音调越高</b>。`, 'ok');
        api.conclude('音调由频率决定', [
          '频率 f：物体每秒振动的次数，单位 Hz。',
          '<b>频率越高，音调越高</b>；频率越低，音调越低。',
          '人耳听觉范围约 <b>20 Hz – 20000 Hz</b>；高于 20000 Hz 叫超声波，低于 20 Hz 叫次声波。',
          '音调、响度、音色是声音的三个特性：音调由频率决定，响度由振幅决定，音色由发声体材料和结构决定。',
          '用同样大的力拨钢尺，只改变伸出长度，响度大致不变、音调明显变化 —— 这是控制变量。'
        ]);
      },
      reset(s, api) { s.pluck = 0; api.clearConcl(); api.say('已重置。'); }
    },
    hud(s) {
      const f = freq(s.L);
      return [
        { label: '伸出长度', value: s.L + ' cm' },
        { label: '频率', value: f.toFixed(0) + ' Hz', hi: true },
        { label: '音调', value: f > 500 ? '高' : f > 150 ? '中' : '低' },
        { label: '振动', value: s.pluck ? '正在振动' : '静止' }
      ];
    }
  });

  function freq(L) {
    const l = L / 100;
    return 0.55 / (l * l);          // 悬臂梁一阶频率的简化模型
  }
})();

/* ---------------- P3-02 熔化和凝固 ---------------- */
(function () {
  const MATS = {
    hypo: { n: '海波（硫代硫酸钠）', mp: 48, crystal: true, c: 'rgba(150,200,235,.5)' },
    wax: { n: '石蜡', mp: null, crystal: false, c: 'rgba(240,235,220,.85)' }
  };
  window.EXPERIMENTS.push({
    id: 'p3-02', code: 'P3-02', title: '探究固体熔化时温度的变化规律',
    book: '八年级上册', unit: '第三章 物态变化', kind: '学生实验',
    opening: '给海波和石蜡加热，记录温度随时间的变化，画成曲线比一比。',
    stageNote: '海波是晶体，熔化时温度停在熔点；石蜡是非晶体，没有固定熔点',
    init: () => ({ mat: 'hypo', heat: 1, run: 0 }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="熔化曲线">
      <text x="230" y="28" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">加热时间 — 温度曲线</text>

      <g transform="translate(60,60)">
        <line x1="0" y1="230" x2="330" y2="230" stroke="var(--ink)" stroke-width="1.4"/>
        <line x1="0" y1="0" x2="0" y2="230" stroke="var(--ink)" stroke-width="1.4"/>
        <text x="330" y="248" font-size="9.5" fill="var(--muted)" text-anchor="end"
              font-family="var(--f-sans)">t / min</text>
        <text x="6" y="12" font-size="9.5" fill="var(--muted)" font-family="var(--f-sans)">T / ℃</text>
        <g id="grid"></g>
        <path id="curve" d="" fill="none" stroke="var(--accent)" stroke-width="2.4"/>
        <line id="mpLine" x1="0" y1="0" x2="330" y2="0" stroke="var(--muted)"
              stroke-width="1" stroke-dasharray="4 4" opacity="0"/>
        <text id="mpTxt" x="332" y="0" font-size="9" fill="var(--muted)" opacity="0"
              font-family="var(--f-num)">48</text>
      </g>

      <g transform="translate(48,300)">
        ${window.Parts.beaker({ x: 0, y: 0, w: 74, h: 56, fill: 'rgba(150,200,235,.45)', level: .45 })}
      </g>
      <g id="lampG" transform="translate(52,356)"></g>

      <text id="stateTxt" x="230" y="334" font-size="12" fill="var(--ink)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
      <text id="noteTxt" x="230" y="360" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
    </svg>`,
    draw(s, el) {
      const m = MATS[s.mat];
      el.querySelector('#grid').innerHTML = [0, 20, 40, 60, 80].map(v => {
        const y = 230 - v / 80 * 230;
        return `<line x1="0" y1="${y}" x2="330" y2="${y}" stroke="var(--line-2)" stroke-width="1"/>
          <text x="-6" y="${y + 3}" font-size="8.5" fill="var(--faint)" text-anchor="end"
                font-family="var(--f-num)">${v}</text>`;
      }).join('') + [0, 2, 4, 6, 8, 10].map(v => {
        const x = v / 10 * 330;
        return `<line x1="${x}" y1="0" x2="${x}" y2="230" stroke="var(--line-2)" stroke-width="1"/>
          <text x="${x}" y="244" font-size="8.5" fill="var(--faint)" text-anchor="middle"
                font-family="var(--f-num)">${v}</text>`;
      }).join('');

      const pts = curve(s);
      el.querySelector('#curve').setAttribute('d',
        'M' + pts.map(p => `${(p.t / 10 * 330).toFixed(1)},${(230 - p.T / 80 * 230).toFixed(1)}`).join(' L'));

      const mp = m.mp;
      const line = el.querySelector('#mpLine');
      const txt = el.querySelector('#mpTxt');
      if (mp) {
        const y = 230 - mp / 80 * 230;
        line.setAttribute('y1', y); line.setAttribute('y2', y);
        line.setAttribute('opacity', .8);
        txt.setAttribute('y', y + 3); txt.setAttribute('opacity', 1);
        txt.textContent = mp + '℃';
      } else {
        line.setAttribute('opacity', 0); txt.setAttribute('opacity', 0);
      }

      el.querySelector('#lampG').innerHTML =
        window.Parts.lamp({ x: 0, y: 0, lit: s.run, w: 46, h: 44 });
      const last = pts[pts.length - 1];
      el.querySelector('#stateTxt').textContent =
        `现在 ${last.T.toFixed(1)} ℃ · ${stateOf(s, last.T)}`;
      el.querySelector('#noteTxt').textContent = m.crystal
        ? '海波熔化时吸热但温度不变，这个温度就是熔点'
        : '石蜡没有固定熔点，边吸热边升温、逐渐变软';
    },
    controls(s) {
      return [{
        type: 'seg', id: 'mat', label: '① 选择物质',
        options: Object.keys(MATS).map(k => ({ v: k, t: MATS[k].n })),
        get: st => st.mat, set: (st, v) => { st.mat = v; st.run = 0; }
      }, {
        type: 'range', id: 'heat', label: '② 加热强度', min: 0.5, max: 2, step: 0.5,
        get: st => st.heat, fmt: v => v.toFixed(1) + ' 倍', set: (st, v) => { st.heat = v; st.run = 0; }
      }];
    },
    actLabels: { run: '开始加热（10 min）', reset: '重置' },
    secondary: ['reset'],
    actions: {
      run(s, api) {
        s.run = 1;
        const m = MATS[s.mat];
        const pts = curve(s);
        const last = pts[pts.length - 1];
        if (m.crystal) {
          api.say(`海波在 <b>${m.mp} ℃</b> 开始熔化，熔化过程中继续加热，温度<b>保持 ${m.mp} ℃ 不变</b>，
            直到全部变成液体才继续升温。<br>这个温度就是海波的熔点。`, 'ok');
        } else {
          api.say(`石蜡边吸热边升温，<b>没有一段温度不变的过程</b>，也就没有固定熔点 —— 它是非晶体。`, 'ok');
        }
        api.conclude('晶体与非晶体的区别', [
          '<b>晶体</b>有固定的熔点（海波 48 ℃、冰 0 ℃、萘 80 ℃），熔化时吸热但温度不变。',
          '<b>非晶体</b>没有固定熔点（石蜡、松香、玻璃、沥青），熔化时温度持续升高。',
          '熔化<b>吸热</b>，凝固<b>放热</b>；同种晶体的熔点和凝固点相同。',
          '晶体熔化的条件：<b>温度达到熔点 + 继续吸热</b>，缺一不可。',
          '曲线上的水平段就是熔化过程，长度反映熔化时间，与加热强度和物质质量有关。'
        ]);
      },
      reset(s, api) { s.run = 0; api.clearConcl(); api.say('已重置。'); }
    },
    hud(s) {
      const pts = curve(s);
      const last = pts[pts.length - 1];
      return [
        { label: '物质', value: MATS[s.mat].n },
        { label: '当前温度', value: last.T.toFixed(1) + ' ℃', hi: !!MATS[s.mat].mp },
        { label: '熔点', value: MATS[s.mat].mp ? MATS[s.mat].mp + ' ℃' : '无' },
        { label: '状态', value: stateOf(s, last.T) }
      ];
    }
  });

  function curve(s) {
    const m = MATS[s.mat];
    const pts = [];
    const tMax = 10;
    for (let t = 0; t <= tMax; t += 0.2) {
      pts.push({ t, T: tempAt(s, t) });
    }
    return pts;
  }
  function tempAt(s, t) {
    const m = MATS[s.mat];
    const rate = 6 * s.heat;               // ℃/min
    if (!m.crystal) return 20 + rate * t * 0.9;
    const t1 = (m.mp - 20) / rate;         // 到熔点
    const melt = 3.2 / s.heat;             // 熔化用时
    if (t <= t1) return 20 + rate * t;
    if (t <= t1 + melt) return m.mp;
    return m.mp + (t - t1 - melt) * rate * 0.85;
  }
  function stateOf(s, T) {
    const m = MATS[s.mat];
    if (!m.crystal) return T > 50 ? '软化' : '固态';
    if (T < m.mp) return '固态';
    if (Math.abs(T - m.mp) < 0.3) return '固液共存';
    return '液态';
  }
})();

/* ---------------- P3-03 探究水沸腾时温度变化的特点 ---------------- */
(function () {
  window.EXPERIMENTS.push({
    id: 'p3-03', code: 'P3-03', title: '探究水沸腾时温度变化的特点',
    book: '八年级上册', unit: '第三章 物态变化', kind: '学生实验',
    opening: '给水加热，每隔一分钟记一次温度，画出沸腾曲线。',
    stageNote: '沸点随气压降低而降低：海拔越高，水越不容易烧开',
    init: () => ({ alt: 0, power: 1, run: 0, t: 0 }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="水沸腾">
      <text x="230" y="28" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">水的温度 — 时间曲线</text>

      <g transform="translate(58,56)">
        <line x1="0" y1="220" x2="300" y2="220" stroke="var(--ink)" stroke-width="1.4"/>
        <line x1="0" y1="0" x2="0" y2="220" stroke="var(--ink)" stroke-width="1.4"/>
        <text x="300" y="238" font-size="9.5" fill="var(--muted)" text-anchor="end"
              font-family="var(--f-sans)">t / min</text>
        <text x="6" y="12" font-size="9.5" fill="var(--muted)" font-family="var(--f-sans)">T / ℃</text>
        <g id="grid"></g>
        <path id="curve" d="" fill="none" stroke="var(--accent)" stroke-width="2.4"/>
        <line id="bpLine" x1="0" y1="0" x2="300" y2="0" stroke="var(--muted)"
              stroke-width="1" stroke-dasharray="4 4"/>
        <text id="bpTxt" x="304" y="0" font-size="9" fill="var(--muted)" font-family="var(--f-num)">100</text>
      </g>

      <g transform="translate(340,90)">
        ${window.Parts.beaker({ x: 0, y: 0, w: 76, h: 96, fill: 'rgba(150,200,235,.45)', level: .55 })}
        <g id="steam"></g>
      </g>
      <g id="lampG" transform="translate(352,240)"></g>

      <text id="bpTxt2" x="230" y="318" font-size="13" fill="var(--ink)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
      <text id="stateTxt" x="230" y="344" font-size="12" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
      <text id="noteTxt" x="230" y="376" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
    </svg>`,
    draw(s, el) {
      const bp = boilPoint(s.alt);
      el.querySelector('#grid').innerHTML = [90, 92, 94, 96, 98, 100].map(v => {
        const y = 220 - (v - 90) / 10 * 220;
        return `<line x1="0" y1="${y}" x2="300" y2="${y}" stroke="var(--line-2)" stroke-width="1"/>
          <text x="-6" y="${y + 3}" font-size="8.5" fill="var(--faint)" text-anchor="end"
                font-family="var(--f-num)">${v}</text>`;
      }).join('') + [0, 2, 4, 6, 8, 10].map(v => {
        const x = v / 10 * 300;
        return `<line x1="${x}" y1="0" x2="${x}" y2="220" stroke="var(--line-2)" stroke-width="1"/>
          <text x="${x}" y="234" font-size="8.5" fill="var(--faint)" text-anchor="middle"
                font-family="var(--f-num)">${v}</text>`;
      }).join('');

      const pts = curve(s);
      el.querySelector('#curve').setAttribute('d',
        'M' + pts.map(p => `${(p.t / 10 * 300).toFixed(1)},${(220 - (p.T - 90) / 10 * 220).toFixed(1)}`).join(' L'));

      const y = 220 - (bp - 90) / 10 * 220;
      el.querySelector('#bpLine').setAttribute('y1', y);
      el.querySelector('#bpLine').setAttribute('y2', y);
      el.querySelector('#bpTxt').setAttribute('y', y + 3);
      el.querySelector('#bpTxt').textContent = bp.toFixed(1);

      el.querySelector('#steam').innerHTML = s.run
        ? [0, 1, 2].map(i => `<path d="M${18 + i * 20} 0 q6 -14 0 -28 q-6 -14 0 -28" fill="none"
             stroke="var(--muted)" stroke-width="1.2" opacity=".4"/>`).join('')
        : '';
      el.querySelector('#lampG').innerHTML =
        window.Parts.lamp({ x: 0, y: 0, lit: s.run, w: 46, h: 44 });

      const last = pts[pts.length - 1];
      el.querySelector('#bpTxt2').textContent =
        `沸点 ${bp.toFixed(1)} ℃ · 当前 ${last.T.toFixed(1)} ℃`;
      el.querySelector('#stateTxt').textContent = s.run
        ? (last.T >= bp - 0.05 ? '正在沸腾：吸热，温度不再升高' : '还在升温')
        : '点"开始加热"';
      el.querySelector('#noteTxt').textContent = s.alt > 0
        ? `海拔 ${s.alt} m，气压低于标准大气压，沸点降到 ${bp.toFixed(1)} ℃`
        : '标准大气压下水的沸点是 100 ℃';
    },
    controls(s) {
      return [{
        type: 'range', id: 'alt', label: '① 海拔', min: 0, max: 3000, step: 100, unit: ' m',
        get: st => st.alt, set: (st, v) => { st.alt = v; s.run = 0; }
      }, {
        type: 'range', id: 'power', label: '② 火力', min: 0.5, max: 2, step: 0.5,
        get: st => st.power, fmt: v => v.toFixed(1) + ' 倍', set: (st, v) => { st.power = v; s.run = 0; }
      }];
    },
    actLabels: { run: '开始加热（10 min）', reset: '重置' },
    secondary: ['reset'],
    actions: {
      run(s, api) {
        s.run = 1;
        const bp = boilPoint(s.alt);
        api.say(`水加热到 <b>${bp.toFixed(1)} ℃</b> 开始沸腾，之后继续加热，<b>温度保持不变</b>。<br>
          这个温度就是当时气压下的沸点。`, 'ok');
        api.conclude('沸腾的两个特点', [
          '沸腾是<b>液体内部和表面同时</b>发生的剧烈汽化现象。',
          '沸腾时<b>吸热但温度不变</b>，这个温度叫沸点。',
          '沸点与<b>气压</b>有关：气压越低，沸点越低。海拔 3000 m 处水约 90 ℃ 就开了。',
          '标准大气压（1.013×10⁵ Pa）下水的沸点是 100 ℃。',
          '沸腾条件：<b>温度达到沸点 + 继续吸热</b>；两者缺一不可。',
          '高压锅利用增大气压提高沸点；减压蒸馏利用降低气压降低沸点。'
        ]);
      },
      reset(s, api) { s.run = 0; api.clearConcl(); api.say('已重置。'); }
    },
    hud(s) {
      const bp = boilPoint(s.alt);
      const pts = curve(s);
      const last = pts[pts.length - 1];
      return [
        { label: '海拔', value: s.alt + ' m' },
        { label: '沸点', value: bp.toFixed(1) + ' ℃', hi: true },
        { label: '当前温度', value: last.T.toFixed(1) + ' ℃' },
        { label: '状态', value: last.T >= bp - 0.05 ? '沸腾' : '升温' }
      ];
    }
  });

  function boilPoint(alt) {
    return 100 - alt / 300 * 1.0;
  }
  function curve(s) {
    const bp = boilPoint(s.alt);
    const pts = [];
    const t1 = (bp - 20) / (8 * s.power);      // 升温到沸点的时间
    for (let t = 0; t <= 10; t += 0.2) {
      pts.push({ t, T: t <= t1 ? 20 + 8 * s.power * t : bp });
    }
    return pts;
  }
})();

/* ---------------- P4-02 光的反射 ---------------- */
(function () {
  window.EXPERIMENTS.push({
    id: 'p4-02', code: 'P4-02', title: '探究光的反射定律',
    book: '八年级上册', unit: '第四章 光现象', kind: '学生实验',
    opening: '转动激光笔，改变入射角，比较反射角的大小。',
    stageNote: '入射角、反射角都是光线与法线的夹角，不是与镜面的夹角',
    init: () => ({ i: 45 }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="光的反射">
      <text x="230" y="30" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">入射角是光线与法线的夹角</text>

      <line x1="40" y1="250" x2="420" y2="250" stroke="var(--ink)" stroke-width="3"/>
      <g id="hatch"></g>
      <line x1="230" y1="250" x2="230" y2="86" stroke="var(--muted)" stroke-width="1.4"
            stroke-dasharray="5 4"/>
      <text x="230" y="78" font-size="10" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">法线</text>

      <g id="rays"></g>
      <g id="arcs"></g>

      <text x="180" y="266" font-size="9.5" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">镜面</text>

      <text id="angTxt" x="230" y="330" font-size="13" fill="var(--ink)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
      <text id="noteTxt" x="230" y="360" font-size="11.5" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
      <text x="230" y="388" font-size="10.5" fill="var(--f-faint)" text-anchor="middle"
            font-family="var(--f-sans)">反射角总是等于入射角</text>
    </svg>`,
    draw(s, el) {
      el.querySelector('#hatch').innerHTML = Array.from({ length: 16 }, (_, i) =>
        `<line x1="${50 + i * 24}" y1="250" x2="${42 + i * 24}" y2="258"
           stroke="var(--muted)" stroke-width="1" opacity=".55"/>`).join('');

      const cx = 230, cy = 250, len = 150;
      const a = s.i * Math.PI / 180;
      const ix = cx - Math.sin(a) * len, iy = cy - Math.cos(a) * len;
      const rx = cx + Math.sin(a) * len, ry = cy - Math.cos(a) * len;

      el.querySelector('#rays').innerHTML = `
        <line x1="${ix}" y1="${iy}" x2="${cx}" y2="${cy}" stroke="var(--accent)" stroke-width="2.2"/>
        <line x1="${cx}" y1="${cy}" x2="${rx}" y2="${ry}" stroke="var(--accent)" stroke-width="2.2"
              stroke-dasharray="7 4"/>
        <path d="M${ix + 16} ${iy - 6} l-12 12" stroke="var(--accent)" stroke-width="0"/>
        <text x="${ix - 6}" y="${iy - 6}" font-size="10" fill="var(--accent)" text-anchor="end"
              font-family="var(--f-sans)">入射光线</text>
        <text x="${rx + 6}" y="${ry - 6}" font-size="10" fill="var(--accent)"
              font-family="var(--f-sans)">反射光线</text>
        <circle cx="${cx}" cy="${cy}" r="3.4" fill="var(--ink)"/>`;

      const r = 56;
      el.querySelector('#arcs').innerHTML = `
        <path d="M${cx} ${cy - r} A${r} ${r} 0 0 0 ${cx - Math.sin(a) * r} ${cy - Math.cos(a) * r}"
              fill="none" stroke="var(--accent)" stroke-width="1.2"/>
        <path d="M${cx} ${cy - r} A${r} ${r} 0 0 1 ${cx + Math.sin(a) * r} ${cy - Math.cos(a) * r}"
              fill="none" stroke="var(--accent)" stroke-width="1.2" stroke-dasharray="4 3"/>
        <text x="${cx - Math.sin(a / 2) * (r + 16)}" y="${cy - Math.cos(a / 2) * (r + 16)}"
              font-size="10" fill="var(--accent)" text-anchor="middle" font-family="var(--f-num)">${s.i}°</text>
        <text x="${cx + Math.sin(a / 2) * (r + 16)}" y="${cy - Math.cos(a / 2) * (r + 16)}"
              font-size="10" fill="var(--accent)" text-anchor="middle" font-family="var(--f-num)">${s.i}°</text>`;

      el.querySelector('#angTxt').textContent =
        `入射角 ${s.i}°　反射角 ${s.i}°`;
      el.querySelector('#noteTxt').textContent = s.i === 0
        ? '垂直入射：入射角 0°，反射光线沿原路返回'
        : `入射角增大，反射角同样增大，两者始终相等`;
    },
    controls(s) {
      return [{
        type: 'range', id: 'i', label: '① 入射角', min: 0, max: 80, step: 5, unit: '°',
        get: st => st.i, set: (st, v) => { st.i = v; }
      }];
    },
    actLabels: { measure: '测量并记录', reset: '重置' },
    secondary: ['reset'],
    actions: {
      measure(s, api) {
        api.say(`入射角 <b>${s.i}°</b>，反射角 <b>${s.i}°</b>，两者相等。`, 'ok');
        api.conclude('光的反射定律', [
          '反射光线、入射光线、法线在<b>同一平面内</b>（三线共面）。',
          '反射光线和入射光线分居<b>法线两侧</b>。',
          '<b>反射角等于入射角</b>（∠i = ∠r）。',
          '入射角是光线与<b>法线</b>的夹角；光线垂直镜面时，入射角是 0°，不是 90°。',
          '光路是<b>可逆</b>的：让光沿反射光线射入，会沿原入射光线射出。',
          '镜面反射和漫反射都遵守反射定律，区别只在反射面是否平整。'
        ]);
      },
      reset(s, api) { s.i = 45; api.clearConcl(); api.say('已重置。'); }
    },
    hud(s) {
      return [
        { label: '入射角', value: s.i + '°' },
        { label: '反射角', value: s.i + '°', hi: true },
        { label: '夹角关系', value: '相等' },
        { label: '特殊情形', value: s.i === 0 ? '垂直入射' : '斜射' }
      ];
    }
  });
})();

/* ---------------- P4-03 平面镜成像 ---------------- */
(function () {
  window.EXPERIMENTS.push({
    id: 'p4-03', code: 'P4-03', title: '探究平面镜成像的特点',
    book: '八年级上册', unit: '第四章 光现象', kind: '学生实验',
    opening: '移动蜡烛，比较像与物到镜面的距离、大小关系。',
    stageNote: '像与物关于镜面对称；像不能用光屏承接，是虚像',
    init: () => ({ u: 80 }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="平面镜成像">
      <text x="230" y="30" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">像与物到镜面的距离相等</text>

      <rect x="226" y="80" width="8" height="230" fill="rgba(180,205,225,.5)"
            stroke="var(--ink)" stroke-width="1.6"/>
      <line x1="230" y1="76" x2="230" y2="314" stroke="var(--ink)" stroke-width="1"/>
      <text x="230" y="332" font-size="9.5" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">玻璃板（代替平面镜）</text>

      <g id="objG"></g>
      <g id="imgG"></g>
      <g id="dist"></g>

      <text id="txt" x="230" y="368" font-size="12.5" fill="var(--ink)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
      <text id="note" x="230" y="390" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
    </svg>`,
    draw(s, el) {
      const cx = 230, base = 300;
      const ux = cx - s.u, ix = cx + s.u;
      el.querySelector('#objG').innerHTML =
        window.Parts.candle({ x: ux - 8, y: base - 60, h: 60, lit: true }) +
        `<text x="${ux}" y="${base + 16}" font-size="9.5" fill="var(--muted)" text-anchor="middle"
           font-family="var(--f-sans)">物</text>`;
      el.querySelector('#imgG').innerHTML = `
        <g opacity=".55">
          <rect x="${ix - 8}" y="${base - 60}" width="16" height="60" rx="3"
                fill="none" stroke="var(--accent)" stroke-width="1.4" stroke-dasharray="4 3"/>
          <path d="M${ix} ${base - 68} c-5 -6 -3 -12 0 -16 c3 4 5 10 0 16 Z"
                fill="none" stroke="var(--accent)" stroke-width="1.2" stroke-dasharray="3 3"/>
        </g>
        <text x="${ix}" y="${base + 16}" font-size="9.5" fill="var(--accent)" text-anchor="middle"
              font-family="var(--f-sans)">像（虚像）</text>`;

      el.querySelector('#dist').innerHTML = `
        <line x1="${ux}" y1="${base + 28}" x2="${cx}" y2="${base + 28}"
              stroke="var(--accent)" stroke-width="1.3"/>
        <line x1="${cx}" y1="${base + 28}" x2="${ix}" y2="${base + 28}"
              stroke="var(--accent)" stroke-width="1.3" stroke-dasharray="4 3"/>
        <text x="${(ux + cx) / 2}" y="${base + 44}" font-size="10" fill="var(--accent)"
              text-anchor="middle" font-family="var(--f-num)">${s.u.toFixed(0)} cm</text>
        <text x="${(cx + ix) / 2}" y="${base + 44}" font-size="10" fill="var(--accent)"
              text-anchor="middle" font-family="var(--f-num)">${s.u.toFixed(0)} cm</text>`;

      el.querySelector('#txt').textContent =
        `物距 ${s.u.toFixed(0)} cm ＝ 像距 ${s.u.toFixed(0)} cm，像与物等大`;
      el.querySelector('#note').textContent =
        s.u < 40 ? '物距变小，像距同样变小，像的大小不变' : '无论物距怎么变，像始终与物等大';
    },
    controls(s) {
      return [{
        type: 'range', id: 'u', label: '① 物到镜面的距离', min: 20, max: 160, step: 5, unit: ' cm',
        get: st => st.u, set: (st, v) => { st.u = v; }
      }];
    },
    actLabels: { measure: '测量物距与像距', reset: '重置' },
    secondary: ['reset'],
    actions: {
      measure(s, api) {
        api.say(`物距 <b>${s.u.toFixed(0)} cm</b>，像距 <b>${s.u.toFixed(0)} cm</b>，两者相等；像与物<b>等大</b>。`, 'ok');
        api.conclude('平面镜成像的四个特点', [
          '<b>等大</b>：像与物大小相等（不管物距多远）。',
          '<b>等距</b>：像与物到镜面的距离相等。',
          '<b>对称</b>：像与物关于镜面对称，左右颠倒。',
          '<b>虚像</b>：像不是实际光线会聚成的，不能用光屏承接。',
          '实验用<b>玻璃板</b>代替平面镜，是为了能看到板后的替代蜡烛，便于确定像的位置。',
          '玻璃板要<b>竖直放置</b>，否则像会偏上或偏下，无法与替代蜡烛重合。'
        ]);
      },
      reset(s, api) { s.u = 80; api.clearConcl(); api.say('已重置。'); }
    },
    hud(s) {
      return [
        { label: '物距', value: s.u.toFixed(0) + ' cm' },
        { label: '像距', value: s.u.toFixed(0) + ' cm', hi: true },
        { label: '像的大小', value: '与物等大' },
        { label: '像的性质', value: '虚像' }
      ];
    }
  });
})();

/* ---------------- P4-04 光的折射 ---------------- */
(function () {
  const MEDIA = {
    water: { n: '水', n1: 1.33 },
    glass: { n: '玻璃', n1: 1.50 }
  };
  window.EXPERIMENTS.push({
    id: 'p4-04', code: 'P4-04', title: '探究光的折射规律',
    book: '八年级上册', unit: '第四章 光现象', kind: '学生实验',
    opening: '让激光从空气斜射入水或玻璃，比较折射角和入射角。',
    stageNote: '光从空气进入水或玻璃，折射角小于入射角；反之则大于',
    init: () => ({ i: 45, med: 'water' }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="光的折射">
      <text x="230" y="30" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">光从空气斜射入介质，折射角变小</text>

      <rect x="40" y="220" width="380" height="150" fill="rgba(120,170,210,.28)"/>
      <line x1="40" y1="220" x2="420" y2="220" stroke="var(--ink)" stroke-width="2"/>
      <text x="60" y="212" font-size="10" fill="var(--muted)" font-family="var(--f-sans)">空气</text>
      <text id="medTxt" x="60" y="242" font-size="10" fill="var(--muted)"
            font-family="var(--f-sans)">水</text>

      <line x1="230" y1="220" x2="230" y2="76" stroke="var(--muted)" stroke-width="1.2"
            stroke-dasharray="5 4"/>
      <line x1="230" y1="220" x2="230" y2="330" stroke="var(--muted)" stroke-width="1.2"
            stroke-dasharray="5 4"/>
      <text x="230" y="70" font-size="10" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">法线</text>

      <g id="rays"></g>
      <g id="arcs"></g>

      <text id="angTxt" x="230" y="356" font-size="13" fill="var(--ink)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
      <text id="note" x="230" y="382" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
    </svg>`,
    draw(s, el) {
      const m = MEDIA[s.med];
      el.querySelector('#medTxt').textContent = m.n;

      const cx = 230, cy = 220, len = 140;
      const a1 = s.i * Math.PI / 180;
      const a2 = Math.asin(Math.sin(a1) / m.n1);
      const ix = cx - Math.sin(a1) * len, iy = cy - Math.cos(a1) * len;
      const rx = cx + Math.sin(a2) * len, ry = cy + Math.cos(a2) * len;

      el.querySelector('#rays').innerHTML = `
        <line x1="${ix}" y1="${iy}" x2="${cx}" y2="${cy}" stroke="var(--accent)" stroke-width="2.2"/>
        <line x1="${cx}" y1="${cy}" x2="${rx}" y2="${ry}" stroke="var(--accent)" stroke-width="2.2"/>
        <text x="${ix - 8}" y="${iy - 6}" font-size="10" fill="var(--accent)" text-anchor="end"
              font-family="var(--f-sans)">入射光线</text>
        <text x="${rx + 8}" y="${ry + 4}" font-size="10" fill="var(--accent)"
              font-family="var(--f-sans)">折射光线</text>
        <circle cx="${cx}" cy="${cy}" r="3.4" fill="var(--ink)"/>`;

      const r1 = 50, r2 = 62;
      el.querySelector('#arcs').innerHTML = `
        <path d="M${cx} ${cy - r1} A${r1} ${r1} 0 0 0 ${cx - Math.sin(a1) * r1} ${cy - Math.cos(a1) * r1}"
              fill="none" stroke="var(--accent)" stroke-width="1.2"/>
        <path d="M${cx} ${cy + r2} A${r2} ${r2} 0 0 1 ${cx + Math.sin(a2) * r2} ${cy + Math.cos(a2) * r2}"
              fill="none" stroke="var(--accent)" stroke-width="1.2"/>
        <text x="${cx - 34}" y="${cy - 30}" font-size="10" fill="var(--accent)"
              text-anchor="middle" font-family="var(--f-num)">${s.i}°</text>
        <text x="${cx + 34}" y="${cy + 44}" font-size="10" fill="var(--accent)"
              text-anchor="middle" font-family="var(--f-num)">${(a2 * 180 / Math.PI).toFixed(0)}°</text>`;

      el.querySelector('#angTxt').textContent =
        `入射角 ${s.i}°　折射角 ${(a2 * 180 / Math.PI).toFixed(1)}°`;
      el.querySelector('#note').textContent = s.i === 0
        ? '垂直入射时，光的传播方向不改变'
        : `光从空气进入${m.n}（n = ${m.n1}），折射角小于入射角`;
    },
    controls(s) {
      return [{
        type: 'seg', id: 'med', label: '① 下方介质',
        options: Object.keys(MEDIA).map(k => ({ v: k, t: MEDIA[k].n })),
        get: st => st.med, set: (st, v) => { st.med = v; }
      }, {
        type: 'range', id: 'i', label: '② 入射角', min: 0, max: 80, step: 5, unit: '°',
        get: st => st.i, set: (st, v) => { st.i = v; }
      }];
    },
    actLabels: { measure: '测量并记录', reset: '重置' },
    secondary: ['reset'],
    actions: {
      measure(s, api) {
        const m = MEDIA[s.med];
        const a2 = Math.asin(Math.sin(s.i * Math.PI / 180) / m.n1) * 180 / Math.PI;
        api.say(`入射角 <b>${s.i}°</b>，折射角 <b>${a2.toFixed(1)}°</b>。光从空气进入${m.n}，折射角小于入射角。`, 'ok');
        api.conclude('光的折射规律', [
          '光从空气斜射入水或玻璃时，<b>折射角小于入射角</b>，折射光线向法线偏折。',
          '光从水或玻璃斜射入空气时，<b>折射角大于入射角</b>。',
          '入射角增大，折射角也增大；入射角为 0°（垂直入射）时，传播方向不变。',
          '折射时，入射光线、折射光线、法线在<b>同一平面内</b>，分居法线两侧。',
          '生活现象：水中的筷子看起来"折断"、池水看起来变浅、海市蜃楼。',
          '光从空气进入介质，速度变小；从介质进入空气，速度变大。'
        ]);
      },
      reset(s, api) { s.i = 45; api.clearConcl(); api.say('已重置。'); }
    },
    hud(s) {
      const m = MEDIA[s.med];
      const a2 = Math.asin(Math.sin(s.i * Math.PI / 180) / m.n1) * 180 / Math.PI;
      return [
        { label: '入射角', value: s.i + '°' },
        { label: '折射角', value: a2.toFixed(1) + '°', hi: true },
        { label: '介质', value: m.n },
        { label: '偏折方向', value: s.i === 0 ? '不偏折' : '靠向法线' }
      ];
    }
  });
})();

/* ---------------- P5-03 凸透镜成像的规律 ---------------- */
(function () {
  window.EXPERIMENTS.push({
    id: 'p5-03', code: 'P5-03', title: '探究凸透镜成像的规律',
    book: '八年级上册', unit: '第五章 透镜及其应用', kind: '学生实验',
    opening: '改变物距，观察像的大小、正倒和虚实，找出规律。',
    stageNote: 'u > 2f 缩小倒立实像；f < u < 2f 放大倒立实像；u < f 放大正立虚像',
    init: () => ({ f: 10, u: 30 }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="凸透镜成像">
      <text x="230" y="26" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">主光轴 · 焦点 · 二倍焦距</text>

      <line x1="30" y1="210" x2="430" y2="210" stroke="var(--ink)" stroke-width="1.2"/>
      <g id="marks"></g>
      <g id="lensG" transform="translate(230,210)"></g>
      <g id="objG"></g>
      <g id="imgG"></g>
      <g id="rays"></g>

      <text id="infoTxt" x="230" y="330" font-size="13" fill="var(--ink)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
      <text id="appTxt" x="230" y="356" font-size="11.5" fill="var(--accent)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
      <text id="noteTxt" x="230" y="382" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
    </svg>`,
    draw(s, el) {
      const cx = 230, cy = 210, k = 2.4;   // 像素/cm
      const f = s.f, u = s.u;
      const v = (u > f) ? (u * f) / (u - f) : -((u * f) / (f - u));
      const real = u > f;

      el.querySelector('#lensG').innerHTML = window.Parts.lens({ x: -10, y: -70, h: 140, type: 'convex' }) +
        `<line x1="0" y1="-78" x2="0" y2="78" stroke="var(--muted)" stroke-width=".8" opacity=".5"/>`;

      el.querySelector('#marks').innerHTML = `
        <circle cx="${cx - f * k}" cy="${cy}" r="2.4" fill="var(--accent)"/>
        <circle cx="${cx + f * k}" cy="${cy}" r="2.4" fill="var(--accent)"/>
        <circle cx="${cx - 2 * f * k}" cy="${cy}" r="2" fill="var(--muted)"/>
        <circle cx="${cx + 2 * f * k}" cy="${cy}" r="2" fill="var(--muted)"/>
        <text x="${cx - f * k}" y="${cy + 16}" font-size="9" fill="var(--accent)" text-anchor="middle"
              font-family="var(--f-num)">F</text>
        <text x="${cx + f * k}" y="${cy + 16}" font-size="9" fill="var(--accent)" text-anchor="middle"
              font-family="var(--f-num)">F'</text>
        <text x="${cx - 2 * f * k}" y="${cy + 16}" font-size="9" fill="var(--muted)" text-anchor="middle"
              font-family="var(--f-num)">2F</text>
        <text x="${cx + 2 * f * k}" y="${cy + 16}" font-size="9" fill="var(--muted)" text-anchor="middle"
              font-family="var(--f-num)">2F'</text>`;

      const ox = cx - u * k;
      el.querySelector('#objG').innerHTML =
        `<line x1="${ox}" y1="${cy}" x2="${ox}" y2="${cy - 46}" stroke="var(--ink)" stroke-width="3"/>
         <path d="M${ox} ${cy - 46} l0 -8" stroke="var(--ink)" stroke-width="1"/>
         <text x="${ox}" y="${cy + 16}" font-size="9.5" fill="var(--muted)" text-anchor="middle"
               font-family="var(--f-sans)">物</text>`;

      const ih = 46 * (real ? v / u : -v / u);
      const ix = real ? cx + v * k : cx + v * k;
      el.querySelector('#imgG').innerHTML = real
        ? `<line x1="${ix}" y1="${cy}" x2="${ix}" y2="${cy + ih}" stroke="var(--accent)" stroke-width="2.6"/>
           <text x="${ix}" y="${cy + ih + 14}" font-size="9.5" fill="var(--accent)" text-anchor="middle"
                 font-family="var(--f-sans)">像（实）</text>`
        : `<line x1="${ix}" y1="${cy}" x2="${ix}" y2="${cy - 46 * v / u}" stroke="var(--accent)"
                stroke-width="2.2" stroke-dasharray="4 3" opacity=".8"/>
           <text x="${ix}" y="${cy - 46 * v / u - 8}" font-size="9.5" fill="var(--accent)"
                 text-anchor="middle" font-family="var(--f-sans)">像（虚）</text>`;

      el.querySelector('#rays').innerHTML = `
        <line x1="${ox}" y1="${cy - 46}" x2="${cx}" y2="${cy - 46}" stroke="var(--muted)" stroke-width="1" opacity=".7"/>
        <line x1="${cx}" y1="${cy - 46}" x2="${real ? ix : cx + 160}" y2="${real ? cy + ih : cy - 46 * 2}" stroke="var(--muted)" stroke-width="1" opacity=".55"/>
        <line x1="${ox}" y1="${cy - 46}" x2="${cx}" y2="${cy}" stroke="var(--muted)" stroke-width="1" opacity=".55"/>`;

      const p = property(u, f, v, real);
      el.querySelector('#infoTxt').textContent =
        `物距 u = ${u.toFixed(0)} cm　像距 v = ${real ? v.toFixed(1) : '—'} cm`;
      el.querySelector('#appTxt').textContent = `${p.name}：${p.desc}`;
      el.querySelector('#noteTxt').textContent = p.tip;
    },
    controls(s) {
      return [{
        type: 'range', id: 'f', label: '① 焦距', min: 5, max: 20, step: 1, unit: ' cm',
        get: st => st.f, set: (st, v) => { st.f = v; }
      }, {
        type: 'range', id: 'u', label: '② 物距', min: 4, max: 60, step: 1, unit: ' cm',
        get: st => st.u, set: (st, v) => { st.u = v; }
      }];
    },
    actLabels: { shot: '记录成像情况', reset: '重置' },
    secondary: ['reset'],
    actions: {
      shot(s, api) {
        const u = s.u, f = s.f;
        const real = u > f;
        const v = real ? u * f / (u - f) : (u * f) / (f - u);
        const p = property(u, f, v, real);
        api.say(`u = ${u} cm，f = ${f} cm，${p.name}：${p.desc}。<br>${p.tip}`, 'ok');
        api.conclude('凸透镜成像的五条规律', [
          '<b>u > 2f</b>：倒立、缩小的实像，f < v < 2f —— 照相机。',
          '<b>u = 2f</b>：倒立、等大的实像，v = 2f —— 测焦距的方法。',
          '<b>f < u < 2f</b>：倒立、放大的实像，v > 2f —— 投影仪、幻灯机。',
          '<b>u = f</b>：不成像（折射光平行射出）。',
          '<b>u < f</b>：正立、放大的虚像，与物同侧 —— 放大镜。',
          '口诀：一倍焦距分虚实，二倍焦距分大小；物近像远像变大。'
        ]);
      },
      reset(s, api) { Object.assign(s, { f: 10, u: 30 }); api.clearConcl(); api.say('已重置。'); }
    },
    hud(s) {
      const u = s.u, f = s.f, real = u > f;
      const v = real ? u * f / (u - f) : (u * f) / (f - u);
      const p = property(u, f, v, real);
      return [
        { label: '物距 u', value: u + ' cm' },
        { label: '像距 v', value: real ? v.toFixed(1) + ' cm' : '—' },
        { label: '像的性质', value: p.short, hi: true },
        { label: '应用', value: p.app }
      ];
    }
  });

  function property(u, f, v, real) {
    if (Math.abs(u - f) < 0.5) return { name: '不成像', short: '不成像', app: '—',
      desc: '折射光线平行射出，既不成实像也不成虚像', tip: 'u = f 时不成像，这是分界点' };
    if (u > 2 * f) return { name: '倒立缩小的实像', short: '倒立缩小实像', app: '照相机',
      desc: `像距 ${v.toFixed(1)} cm，在 f 与 2f 之间`, tip: '物距大于二倍焦距，像变小、变近' };
    if (Math.abs(u - 2 * f) < 0.5) return { name: '倒立等大的实像', short: '倒立等大实像', app: '测焦距',
      desc: `像距 ${v.toFixed(1)} cm，等于 2f`, tip: 'u = 2f 时 v = 2f，可用来测焦距' };
    if (u > f) return { name: '倒立放大的实像', short: '倒立放大实像', app: '投影仪',
      desc: `像距 ${v.toFixed(1)} cm，大于 2f`, tip: '物距在 f 与 2f 之间，像变大、变远' };
    return { name: '正立放大的虚像', short: '正立放大虚像', app: '放大镜',
      desc: '像与物同侧，不能用光屏承接', tip: '物距小于焦距，看到的是虚像' };
  }
})();

/* ---------------- P6-03 测量物质的密度 ---------------- */
(function () {
  const OBJS = {
    iron: { n: '铁块', rho: 7.9, m: 79.0, V: 10 },
    alu: { n: '铝块', rho: 2.7, m: 54.0, V: 20 },
    stone: { n: '石块', rho: 2.6, m: 52.0, V: 20 }
  };
  window.EXPERIMENTS.push({
    id: 'p6-03', code: 'P6-03', title: '测量物质的密度',
    book: '八年级上册', unit: '第六章 质量与密度', kind: '学生实验',
    opening: '先用天平称质量，再用量筒排水法测体积，最后算密度。',
    stageNote: '先测质量再测体积：先测体积会让物体沾水，质量偏大',
    init: () => ({ obj: 'iron', weighed: false, volumed: false }),
    svg: `<svg viewBox="0 0 460 400" role="img" aria-label="测量密度">
      <text x="230" y="28" font-size="11" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">天平称质量 → 量筒测体积 → ρ = m/V</text>

      <g id="balG" transform="translate(58,64)"></g>
      <text id="mTxt" x="142" y="176" font-size="12" fill="var(--ink)" text-anchor="middle"
            font-family="var(--f-num)">—</text>

      <g id="cylG" transform="translate(268,60)"></g>
      <text id="vTxt" x="300" y="290" font-size="12" fill="var(--ink)" text-anchor="middle"
            font-family="var(--f-num)">—</text>

      <text id="rhoTxt" x="230" y="336" font-size="24" fill="var(--accent)" text-anchor="middle"
            font-family="var(--f-num)">—</text>
      <text id="noteTxt" x="230" y="366" font-size="11.5" fill="var(--muted)" text-anchor="middle"
            font-family="var(--f-sans)">—</text>
    </svg>`,
    draw(s, el) {
      const o = OBJS[s.obj];
      el.querySelector('#balG').innerHTML = window.Parts.balance({ x: 0, y: 0, w: 168 }) +
        `<text x="84" y="120" font-size="9.5" fill="var(--muted)" text-anchor="middle"
           font-family="var(--f-sans)">托盘天平</text>`;
      el.querySelector('#mTxt').textContent = s.weighed ? `m = ${o.m.toFixed(1)} g` : '未称量';

      const base = 40;
      const lvl = s.volumed ? (base + o.V) / 100 : base / 100;
      el.querySelector('#cylG').innerHTML = window.Parts.cylinder({
        x: 0, y: 0, h: 210, w: 44, fill: 'rgba(120,170,210,.5)', level: lvl
      }) + `<text x="22" y="226" font-size="9.5" fill="var(--muted)" text-anchor="middle"
             font-family="var(--f-sans)">量筒</text>`;
      el.querySelector('#vTxt').textContent = s.volumed
        ? `V物 = ${o.V} cm³（${base + o.V} − ${base}）`
        : `原来水 ${base} mL`;

      el.querySelector('#rhoTxt').textContent =
        (s.weighed && s.volumed) ? `ρ = ${o.rho.toFixed(1)} g/cm³` : 'ρ = ?';
      el.querySelector('#noteTxt').textContent =
        (s.weighed && s.volumed)
          ? `ρ = m/V = ${o.m.toFixed(1)} ÷ ${o.V} = ${o.rho.toFixed(1)} g/cm³`
          : '按顺序：先称质量，再测体积';
    },
    controls(s) {
      return [{
        type: 'seg', id: 'obj', label: '① 选择物体',
        options: Object.keys(OBJS).map(k => ({ v: k, t: OBJS[k].n })),
        get: st => st.obj,
        set: (st, v) => { st.obj = v; st.weighed = false; st.volumed = false; }
      }];
    },
    actLabels: { weigh: '用天平称质量', volume: '放入量筒测体积', calc: '计算密度', reset: '重置' },
    secondary: ['reset'],
    actions: {
      weigh(s, api) {
        s.weighed = true;
        api.say(`天平读数 <b>${OBJS[s.obj].m.toFixed(1)} g</b>。物体放在左盘，砝码放右盘。`, 'ok');
      },
      volume(s, api) {
        const o = OBJS[s.obj];
        if (!s.weighed) {
          api.say('先称质量再测体积 —— 反过来物体沾了水，称出来的质量会偏大。', 'warn');
          return;
        }
        s.volumed = true;
        api.say(`量筒原来装水 40 mL，放入物体后升到 <b>${40 + o.V} mL</b>，物体体积 <b>${o.V} cm³</b>。`, 'ok');
      },
      calc(s, api) {
        if (!s.weighed || !s.volumed) { api.say('两步都做完再算。', 'warn'); return; }
        const o = OBJS[s.obj];
        api.say(`ρ = m/V = ${o.m.toFixed(1)} g ÷ ${o.V} cm³ = <b>${o.rho.toFixed(1)} g/cm³</b>。`, 'ok');
        api.conclude('测密度的标准流程', [
          '原理：<b>ρ = m / V</b>，需要测质量和体积两个量。',
          '<b>先称质量</b>：天平调平，左物右码，读数 = 砝码 + 游码。',
          '<b>再测体积</b>：量筒装适量水读 V₁，放入物体读 V₂，V物 = V₂ − V₁。',
          '顺序不能反：先测体积会让物体沾水，质量偏大，密度偏大。',
          '量筒读数视线与凹液面最低处相平；仰视偏小、俯视偏大。',
          '密度是物质的特性：同种物质密度相同，与质量、体积无关。'
        ]);
      },
      reset(s, api) {
        Object.assign(s, { weighed: false, volumed: false });
        api.clearConcl(); api.say('已重置。');
      }
    },
    hud(s) {
      const o = OBJS[s.obj];
      return [
        { label: '物体', value: o.n },
        { label: '质量 m', value: s.weighed ? o.m.toFixed(1) + ' g' : '—' },
        { label: '体积 V', value: s.volumed ? o.V + ' cm³' : '—' },
        { label: '密度 ρ', value: (s.weighed && s.volumed) ? o.rho.toFixed(1) + ' g/cm³' : '—',
          hi: s.weighed && !!s.volumed }
      ];
    }
  });
})();
