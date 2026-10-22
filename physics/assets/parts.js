/* ============================================================
   物理器材库 —— 统一线稿风格
   规则：描边 1.6px、圆头、读数用数字字体
   用 CSS 变量取色，自动跟随深浅色主题
   ============================================================ */
(function () {
  'use strict';
  const S = 'stroke="var(--ink)" stroke-width="1.6" fill="none" stroke-linejoin="round" stroke-linecap="round"';
  const THIN = 'stroke="var(--ink)" stroke-width="1" fill="none"';
  const GLASS = 'fill="var(--paper-2)" fill-opacity=".72"';

  function liquid(x, y, w, h, fill, opacity) {
    if (h <= 0.5) return '';
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" opacity="${opacity || .5}"/>
      <line x1="${x}" y1="${y}" x2="${x + w}" y2="${y}" stroke="${fill}" stroke-width="2" opacity=".95"/>`;
  }

  const P = {
    liquid,

    /* 刻度尺：cm 刻度，10 cm 长 */
    ruler({ x = 0, y = 0, w = 300, h = 34, angle = 0, show = 10 }) {
      let ticks = '';
      const n = show * 10;
      for (let i = 0; i <= n; i++) {
        const tx = 8 + i * (w - 16) / n;
        const big = i % 10 === 0, mid = i % 5 === 0;
        ticks += `<line x1="${tx}" y1="${y}" x2="${tx}" y2="${y + (big ? 12 : mid ? 8 : 5)}"
          ${THIN} opacity=".65"/>`;
        if (big) {
          ticks += `<text x="${tx}" y="${y + 24}" font-size="8.5" fill="var(--muted)"
            text-anchor="middle" font-family="var(--f-num)">${i / 10}</text>`;
        }
      }
      return `<g transform="rotate(${angle} ${x} ${y})">
        <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2"
              fill="var(--paper-3)" stroke="var(--ink)" stroke-width="1.4"/>
        ${ticks}
      </g>`;
    },

    /* 秒表 */
    stopwatch({ x = 0, y = 0, r = 28, t = '0.00' }) {
      return `<g transform="translate(${x},${y})">
        <circle cx="0" cy="0" r="${r}" ${S} fill="var(--paper-2)"/>
        <circle cx="0" cy="0" r="${r - 5}" ${THIN} opacity=".35"/>
        <text x="0" y="4" font-size="13" fill="var(--ink)" text-anchor="middle"
              font-family="var(--f-num)">${t}</text>
        <rect x="-5" y="${-r - 8}" width="10" height="8" rx="2" ${S} fill="var(--paper-3)"/>
      </g>`;
    },

    /* 弹簧测力计：竖直，reading 为 N */
    spring({ x = 0, y = 0, h = 170, w = 40, reading = 0, max = 5 }) {
      const top = y + 12, bot = y + h - 10;
      const p = Math.min(1, Math.max(0, reading / max));
      const py = top + (bot - top) * p;
      let ticks = '';
      for (let i = 0; i <= max * 5; i++) {
        const ty = top + (bot - top) * i / (max * 5);
        ticks += `<line x1="${x + w - 4}" y1="${ty}" x2="${x + w - (i % 5 ? 8 : 14)}" y2="${ty}"
          ${THIN} opacity=".6"/>`;
        if (i % 5 === 0) {
          ticks += `<text x="${x + 4}" y="${ty + 3}" font-size="7.5" fill="var(--muted)"
            font-family="var(--f-num)">${i / 5}</text>`;
        }
      }
      return `<g>
        <rect x="${x}" y="${top}" width="${w}" height="${bot - top}" rx="4"
              fill="var(--paper-2)" fill-opacity=".85" stroke="var(--ink)" stroke-width="1.5"/>
        <rect x="${x + w / 2 - 7}" y="${y}" width="14" height="14" rx="2" ${S} fill="var(--paper-3)"/>
        ${ticks}
        <rect x="${x + 2}" y="${py - 5}" width="${w - 4}" height="10" fill="var(--accent)" opacity=".18"/>
        <line x1="${x + 2}" y1="${py}" x2="${x + w - 2}" y2="${py}" stroke="var(--accent)" stroke-width="1.6"/>
        <line x1="${x + w / 2}" y1="${py}" x2="${x + w / 2}" y2="${bot + 16}"
              stroke="var(--ink)" stroke-width="1.4"/>
        <path d="M${x + w / 2 - 9} ${bot + 16} h18" ${S}/>
        <text x="${x + w / 2 + 14}" y="${py + 4}" font-size="10" fill="var(--accent)"
              font-family="var(--f-num)">${reading.toFixed(1)}</text>
      </g>`;
    },

    /* 托盘天平 */
    balance({ x = 0, y = 0, w = 170 }) {
      const cx = x + w / 2;
      return `<g>
        <rect x="${cx - 6}" y="${y + 26}" width="12" height="48" ${S} fill="var(--paper-3)"/>
        <path d="M${cx - 34} ${y + 74} h68 l-8 12 h-52 Z" ${S} fill="var(--paper-3)"/>
        <line x1="${x + 10}" y1="${y + 24}" x2="${x + w - 10}" y2="${y + 24}"
              stroke="var(--ink)" stroke-width="2.4" stroke-linecap="round"/>
        <circle cx="${cx}" cy="${y + 24}" r="4" ${S} fill="var(--paper-3)"/>
        <path d="M${x + 16} ${y + 24} v10 h34 v-10" ${S}/>
        <path d="M${x + w - 50} ${y + 24} v10 h34 v-10" ${S}/>
        <path d="M${x + 10} ${y + 34} h46" stroke="var(--ink)" stroke-width="1.2"/>
      </g>`;
    },

    /* 量筒 */
    cylinder({ x = 0, y = 0, h = 200, w = 40, fill = '#9fc9de', level = .5 }) {
      const top = y + 8, bot = y + h - 10;
      const lh = (bot - top) * Math.min(1, Math.max(0, level));
      let ticks = '';
      for (let i = 1; i < 20; i++) {
        const ty = bot - (bot - top) * i / 20;
        const len = i % 5 === 0 ? 14 : 8;
        ticks += `<line x1="${x + w}" y1="${ty}" x2="${x + w - len}" y2="${ty}" ${THIN} opacity=".55"/>`;
      }
      return `<g>
        <path d="M${x} ${top} V${bot} a${w / 2} ${w / 2} 0 0 0 ${w} 0 V${top}" ${S} ${GLASS}/>
        <ellipse cx="${x + w / 2}" cy="${top}" rx="${w / 2}" ry="4" ${S}/>
        ${ticks}
        ${liquid(x + 2, bot - lh, w - 4, lh, fill)}
      </g>`;
    },

    beaker({ x = 0, y = 0, w = 90, h = 110, fill = '#9fc9de', level = .4 }) {
      const ix = x + 6, iw = w - 12, top = y + 8, bot = y + h - 8;
      const lh = (bot - top) * Math.min(1, Math.max(0, level));
      return `<g>
        <path d="M${x} ${y + 2} V${bot - 6} a6 6 0 0 0 6 6 H${x + w - 6} a6 6 0 0 0 6 -6 V${y + 2}"
              ${S} ${GLASS}/>
        <line x1="${x - 4}" y1="${y + 2}" x2="${x + w + 4}" y2="${y + 2}"
              stroke="var(--ink)" stroke-width="2" stroke-linecap="round"/>
        ${liquid(ix, bot - lh, iw, lh, fill)}
      </g>`;
    },

    /* 凸/凹透镜 */
    lens({ x = 0, y = 0, h = 120, type = 'convex' }) {
      if (type === 'convex') {
        return `<g>
          <path d="M${x} ${y} q22 ${h / 2} 0 ${h} q-22 ${-h / 2} 0 ${-h} Z"
                fill="rgba(150,200,235,.32)" stroke="var(--ink)" stroke-width="1.6"/>
        </g>`;
      }
      return `<g>
        <path d="M${x - 7} ${y} q7 ${h / 2} 0 ${h} q-7 ${-h / 2} 0 ${-h} Z"
              fill="rgba(150,200,235,.32)" stroke="var(--ink)" stroke-width="1.6"/>
        <path d="M${x + 7} ${y} q-7 ${h / 2} 0 ${h}" fill="none" stroke="var(--ink)" stroke-width="1.6"/>
        <path d="M${x - 7} ${y} h14 M${x - 7} ${y + h} h14" stroke="var(--ink)" stroke-width="1.6"/>
      </g>`;
    },

    screen({ x = 0, y = 0, w = 12, h = 130 }) {
      return `<g>
        <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2"
              fill="var(--paper-3)" stroke="var(--ink)" stroke-width="1.5"/>
        <line x1="${x + 3}" y1="${y + 6}" x2="${x + w - 3}" y2="${y + 6}" ${THIN} opacity=".4"/>
        <line x1="${x + 3}" y1="${y + h - 6}" x2="${x + w - 3}" y2="${y + h - 6}" ${THIN} opacity=".4"/>
      </g>`;
    },

    candle({ x = 0, y = 0, h = 56, lit = true }) {
      return `<g>
        <rect x="${x}" y="${y}" width="16" height="${h}" rx="3"
              fill="#f6f1e2" stroke="var(--ink)" stroke-width="1.3"/>
        <line x1="${x + 8}" y1="${y}" x2="${x + 8}" y2="${y - 8}" stroke="var(--ink)" stroke-width="1.2"/>
        ${lit ? `<path d="M${x + 8} ${y - 8} c-5 -6 -3 -12 0 -16 c3 4 5 10 0 16 Z"
          fill="#e8a33d" stroke="none"/>` : ''}
      </g>`;
    },

    bulb({ x = 0, y = 0, on = false, r = 15 }) {
      return `<g>
        <circle cx="${x}" cy="${y}" r="${r}" fill="${on ? 'rgba(246,214,138,.55)' : 'var(--paper-2)'}"
                stroke="var(--ink)" stroke-width="1.5"/>
        <path d="M${x - 5} ${y + 3} q5 -14 10 0" fill="none" stroke="${on ? '#c9852a' : 'var(--muted)'}"
              stroke-width="1.4"/>
        <rect x="${x - 5}" y="${y + r}" width="10" height="8" fill="var(--paper-3)"
              stroke="var(--ink)" stroke-width="1.2"/>
      </g>`;
    },

    battery({ x = 0, y = 0, cells = 2 }) {
      let out = '';
      for (let i = 0; i < cells; i++) {
        const bx = x + i * 34;
        out += `<rect x="${bx}" y="${y}" width="30" height="18" rx="2"
          fill="var(--paper-2)" stroke="var(--ink)" stroke-width="1.4"/>
          <line x1="${bx + 30}" y1="${y + 9}" x2="${bx + 34}" y2="${y + 9}"
                stroke="var(--ink)" stroke-width="2"/>
          <text x="${bx + 15}" y="${y + 13}" font-size="8" fill="var(--muted)"
                text-anchor="middle" font-family="var(--f-num)">1.5V</text>`;
      }
      return `<g>${out}</g>`;
    },

    switchBox({ x = 0, y = 0, closed = false }) {
      return `<g>
        <rect x="${x}" y="${y}" width="38" height="20" rx="2" fill="var(--paper-3)"
              stroke="var(--ink)" stroke-width="1.4"/>
        <circle cx="${x + 7}" cy="${y + 10}" r="2.4" fill="var(--ink)"/>
        <circle cx="${x + 31}" cy="${y + 10}" r="2.4" fill="var(--ink)"/>
        <line x1="${x + 7}" y1="${y + 10}" x2="${closed ? x + 31 : x + 30}" y2="${closed ? y + 10 : y - 4}"
              stroke="var(--ink)" stroke-width="2" stroke-linecap="round"/>
      </g>`;
    },

    meter({ x = 0, y = 0, label = 'A', value = '0', w = 56, h = 46 }) {
      return `<g>
        <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="var(--paper-2)"
              stroke="var(--ink)" stroke-width="1.4"/>
        <text x="${x + 8}" y="${y + 14}" font-size="9" fill="var(--muted)"
              font-family="var(--f-sans)">${label}</text>
        <text x="${x + w / 2}" y="${y + 34}" font-size="15" fill="var(--ink)"
              text-anchor="middle" font-family="var(--f-num)">${value}</text>
        <circle cx="${x + w - 9}" cy="${y + 9}" r="2.2" fill="var(--accent)"/>
      </g>`;
    },

    rheostat({ x = 0, y = 0, w = 90, pos = .5 }) {
      const px = x + 10 + (w - 20) * Math.min(1, Math.max(0, pos));
      return `<g>
        <rect x="${x}" y="${y}" width="${w}" height="22" rx="2" fill="var(--paper-3)"
              stroke="var(--ink)" stroke-width="1.4"/>
        ${Array.from({ length: 10 }, (_, i) =>
          `<line x1="${x + 10 + i * (w - 20) / 9}" y1="${y}" x2="${x + 10 + i * (w - 20) / 9}" y2="${y + 22}"
             stroke="var(--line)" stroke-width="1"/>`).join('')}
        <line x1="${px}" y1="${y - 14}" x2="${px}" y2="${y}" stroke="var(--ink)" stroke-width="2"/>
        <path d="M${px - 8} ${y - 14} h16" stroke="var(--ink)" stroke-width="2.4" stroke-linecap="round"/>
        <text x="${x + w / 2}" y="${y + 36}" font-size="8.5" fill="var(--muted)"
              text-anchor="middle" font-family="var(--f-sans)">滑动变阻器</text>
      </g>`;
    },

    pulley({ x = 0, y = 0, r = 22 }) {
      return `<g>
        <circle cx="${x}" cy="${y}" r="${r}" fill="var(--paper-2)" stroke="var(--ink)" stroke-width="1.6"/>
        <circle cx="${x}" cy="${y}" r="${r - 6}" fill="none" stroke="var(--ink)" stroke-width="1" opacity=".4"/>
        <circle cx="${x}" cy="${y}" r="3" fill="var(--ink)"/>
      </g>`;
    },

    lever({ x = 0, y = 0, w = 260, angle = 0 }) {
      return `<g transform="rotate(${angle} ${x} ${y})">
        <rect x="${x}" y="${y - 4}" width="${w}" height="8" rx="2"
              fill="var(--paper-3)" stroke="var(--ink)" stroke-width="1.4"/>
        ${Array.from({ length: 13 }, (_, i) =>
          `<line x1="${x + i * w / 12}" y1="${y - 4}" x2="${x + i * w / 12}" y2="${y - 9}"
             stroke="var(--ink)" stroke-width=".8" opacity=".5"/>`).join('')}
      </g>`;
    },

    cart({ x = 0, y = 0, w = 56, h = 30 }) {
      return `<g>
        <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3"
              fill="var(--paper-3)" stroke="var(--ink)" stroke-width="1.5"/>
        <circle cx="${x + 12}" cy="${y + h + 5}" r="6" fill="var(--paper-2)"
                stroke="var(--ink)" stroke-width="1.3"/>
        <circle cx="${x + w - 12}" cy="${y + h + 5}" r="6" fill="var(--paper-2)"
                stroke="var(--ink)" stroke-width="1.4"/>
      </g>`;
    },

    lamp({ x = 0, y = 0, lit = false, w = 56, h = 56 }) {
      const cx = x + w / 2;
      return `<g>
        <path d="M${x + 6} ${y + h} h${w - 12} l-6 -32 a8 8 0 0 0 -8 -7 h-${w - 32} a8 8 0 0 0 -8 7 Z"
              ${S} fill="var(--paper-3)"/>
        <rect x="${cx - 5}" y="${y + h - 44}" width="10" height="12" ${S} fill="var(--paper-3)"/>
        ${lit ? `<path d="M${cx} ${y + h - 52} c-9 -6 -7 -16 0 -26 c7 10 9 20 0 26 Z" fill="#e8a33d" stroke="none"/>
                 <path d="M${cx} ${y + h - 52} c-4 -5 -3 -11 0 -16 c3 5 4 11 0 16 Z" fill="#f6d68a" stroke="none"/>` : ''}
      </g>`;
    },

    thermometer({ x = 0, y = 0, h = 120, t = 20, min = -20, max = 110 }) {
      const p = (t - min) / (max - min);
      const col = t < 0 ? '#3f7fb8' : '#c0392b';
      return `<g>
        <rect x="${x}" y="${y}" width="8" height="${h}" rx="4"
              fill="var(--paper-2)" stroke="var(--ink)" stroke-width="1.3"/>
        <circle cx="${x + 4}" cy="${y + h + 8}" r="9" fill="${col}" stroke="var(--ink)" stroke-width="1.3"/>
        <rect x="${x + 2}" y="${y + h - p * (h - 8)}" width="4" height="${p * (h - 8) + 8}" fill="${col}"/>
        <text x="${x + 16}" y="${y + 10}" font-size="9.5" fill="var(--muted)"
              font-family="var(--f-num)">${t.toFixed(0)}℃</text>
      </g>`;
    },

    label({ x, y, t, size = 11, color = 'var(--muted)', anchor = 'middle' }) {
      return `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" text-anchor="${anchor}"
        font-family="var(--f-sans)">${t}</text>`;
    }
  };

  window.Parts = P;
})();
