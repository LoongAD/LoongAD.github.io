/* ============================================================
   器材库 —— 统一线稿风格
   规则：描边 1.6px、圆头、液体半透明 + 一条液面线
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

    beaker({ x = 0, y = 0, w = 96, h = 112, fill = '#2f6fd0', level = 0 }) {
      const ix = x + 6, iw = w - 12, top = y + 10, bot = y + h - 10;
      const lh = (bot - top) * Math.min(1, Math.max(0, level));
      return `<g>
        <path d="M${x} ${y + 2} V${bot - 8} a8 8 0 0 0 8 8 H${x + w - 8} a8 8 0 0 0 8 -8 V${y + 2}"
              ${S} ${GLASS}/>
        <line x1="${x - 4}" y1="${y + 2}" x2="${x + w + 4}" y2="${y + 2}" stroke="var(--ink)" stroke-width="2.2" stroke-linecap="round"/>
        <line x1="${x + 14}" y1="${y + 26}" x2="${x + 24}" y2="${y + 26}" ${THIN} opacity=".5"/>
        <line x1="${x + 14}" y1="${y + 46}" x2="${x + 24}" y2="${y + 46}" ${THIN} opacity=".5"/>
        <line x1="${x + 14}" y1="${y + 66}" x2="${x + 24}" y2="${y + 66}" ${THIN} opacity=".5"/>
        ${liquid(ix, bot - lh, iw, lh, fill)}
      </g>`;
    },

    tube({ x = 0, y = 0, h = 120, w = 30, fill = '#2f6fd0', level = 0 }) {
      const top = y + 6, bot = y + h - 6, r = w / 2;
      const lh = (bot - top - r) * Math.min(1, Math.max(0, level));
      return `<g>
        <path d="M${x} ${top} V${bot - r} a${r} ${r} 0 0 0 ${w} 0 V${top}" ${S} ${GLASS}/>
        <line x1="${x - 3}" y1="${top}" x2="${x + w + 3}" y2="${top}" stroke="var(--ink)" stroke-width="2" stroke-linecap="round"/>
        ${liquid(x + 2, bot - r - lh, w - 4, lh, fill)}
      </g>`;
    },

    flask({ x = 0, y = 0, w = 120, h = 140, fill = '#2f6fd0', level = 0 }) {
      const cx = x + w / 2, neckW = 20, topY = y + 4, bodyTop = y + 48, bot = y + h - 6;
      const innerTop = bodyTop + 8;
      const lh = (bot - innerTop) * Math.min(1, Math.max(0, level));
      return `<g>
        <path d="M${cx - neckW / 2} ${topY} v${bodyTop - topY} L${x + 8} ${bot - 22}
                 a14 14 0 0 0 12 22 h${w - 40} a14 14 0 0 0 12 -22 L${cx + neckW / 2} ${bodyTop} v-${bodyTop - topY}"
              ${S} ${GLASS}/>
        <line x1="${cx - neckW / 2 - 4}" y1="${topY}" x2="${cx + neckW / 2 + 4}" y2="${topY}" stroke="var(--ink)" stroke-width="2.2" stroke-linecap="round"/>
        ${liquid(x + 14, bot - lh, w - 28, lh, fill)}
      </g>`;
    },

    cylinder({ x = 0, y = 0, h = 300, w = 46, fill = '#9fc9de', level = .5 }) {
      const top = y + 8, bot = y + h - 12;
      const lh = (bot - top) * Math.min(1, Math.max(0, level));
      let ticks = '';
      for (let i = 1; i < 20; i++) {
        const ty = bot - (bot - top) * i / 20;
        const len = i % 5 === 0 ? 16 : 9;
        ticks += `<line x1="${x + w}" y1="${ty}" x2="${x + w - len}" y2="${ty}" ${THIN} opacity=".55"/>`;
      }
      return `<g>
        <path d="M${x} ${top} V${bot} a${w / 2} ${w / 2} 0 0 0 ${w} 0 V${top}" ${S} ${GLASS}/>
        <ellipse cx="${x + w / 2}" cy="${top}" rx="${w / 2}" ry="5" ${S}/>
        <rect x="${x + w / 2 - 5}" y="${top - 12}" width="10" height="13" ${S} fill="var(--paper-2)"/>
        ${ticks}
        ${liquid(x + 2, bot - lh, w - 4, lh, fill)}
      </g>`;
    },

    gasjar({ x = 0, y = 0, w = 84, h = 120, fill = '#cfe3f0', level = 0, plate = false }) {
      const top = y + 10, bot = y + h - 6;
      const lh = (bot - top) * Math.min(1, Math.max(0, level));
      return `<g>
        <rect x="${x}" y="${top}" width="${w}" height="${h - 16}" rx="5" ${S} ${GLASS}/>
        <line x1="${x - 3}" y1="${top}" x2="${x + w + 3}" y2="${top}" stroke="var(--ink)" stroke-width="2.2" stroke-linecap="round"/>
        ${plate ? `<rect x="${x - 4}" y="${top - 7}" width="${w + 8}" height="6" rx="2" ${S} fill="var(--paper-3)"/>` : ''}
        ${liquid(x + 3, bot - lh, w - 6, lh, fill)}
      </g>`;
    },

    funnel({ x = 0, y = 0, w = 80, h = 110 }) {
      const cx = x + w / 2;
      return `<g>
        <path d="M${x} ${y} H${x + w} L${cx + 6} ${y + 52} V${y + h} h-12 V${y + 52} Z"
              ${S} ${GLASS}/>
        <line x1="${x - 3}" y1="${y}" x2="${x + w + 3}" y2="${y}" stroke="var(--ink)" stroke-width="2" stroke-linecap="round"/>
      </g>`;
    },

    rod({ x = 0, y = 0, h = 130, angle = 0 }) {
      return `<g transform="rotate(${angle} ${x} ${y})">
        <rect x="${x - 2.5}" y="${y}" width="5" height="${h}" rx="2.5"
              fill="var(--paper-2)" fill-opacity=".5" stroke="var(--ink)" stroke-width="1.4"/>
      </g>`;
    },

    dropper({ x = 0, y = 0, h = 90, color = '#b11226' }) {
      return `<g>
        <rect x="${x - 5}" y="${y}" width="10" height="34" rx="4" ${S} fill="${color}" fill-opacity=".3"/>
        <rect x="${x - 3}" y="${y + 34}" width="6" height="30" ${S} fill="var(--paper-2)"/>
        <path d="M${x - 3} ${y + 64} L${x} ${y + h} L${x + 3} ${y + 64}" ${S}/>
      </g>`;
    },

    lamp({ x = 0, y = 0, lit = false, w = 62, h = 60 }) {
      const cx = x + w / 2;
      return `<g>
        <path d="M${x + 6} ${y + h} h${w - 12} l-6 -34 a8 8 0 0 0 -8 -7 h-${w - 32} a8 8 0 0 0 -8 7 Z"
              ${S} fill="var(--paper-3)"/>
        <rect x="${cx - 5}" y="${y + h - 46}" width="10" height="12" ${S} fill="var(--paper-3)"/>
        <line x1="${cx}" y1="${y + h - 46}" x2="${cx}" y2="${y + h - 54}" stroke="var(--ink)" stroke-width="2"/>
        ${lit ? `<path d="M${cx} ${y + h - 54} c-9 -6 -7 -16 0 -26 c7 10 9 20 0 26 Z" fill="#e8a33d" stroke="none" opacity=".9"/>
                 <path d="M${cx} ${y + h - 54} c-4 -5 -3 -11 0 -16 c3 5 4 11 0 16 Z" fill="#f6d68a" stroke="none"/>` : ''}
        <path d="M${x + 10} ${y + h} h${w - 20}" stroke="var(--ink)" stroke-width="2" stroke-linecap="round"/>
      </g>`;
    },

    stand({ x = 0, y = 0, h = 300, ring = 0 }) {
      return `<g>
        <rect x="${x}" y="${y + h - 8}" width="110" height="10" rx="2" ${S} fill="var(--paper-3)"/>
        <rect x="${x + 40}" y="${y}" width="7" height="${h - 8}" ${S} fill="var(--paper-3)"/>
        ${ring ? `<rect x="${x + 44}" y="${ring}" width="46" height="5" rx="2" ${S} fill="var(--paper-3)"/>
        <ellipse cx="${x + 128}" cy="${ring + 2}" rx="42" ry="6" ${S}/>` : ''}
      </g>`;
    },

    pipe({ x = 0, y = 0, w = 90, h = 60 }) {
      return `<path d="M${x} ${y} v${h * .5} q0 ${h * .5} ${h * .5} ${h * .5} h${w}" ${S} ${GLASS}/>`;
    },

    balance({ x = 0, y = 0, w = 160 }) {
      return `<g>
        <rect x="${x + w / 2 - 6}" y="${y + 20}" width="12" height="46" ${S} fill="var(--paper-3)"/>
        <path d="M${x + w / 2 - 34} ${y + 66} h68 l-8 12 h-52 Z" ${S} fill="var(--paper-3)"/>
        <line x1="${x + 8}" y1="${y + 18}" x2="${x + w - 8}" y2="${y + 18}" stroke="var(--ink)" stroke-width="2.4" stroke-linecap="round"/>
        <circle cx="${x + w / 2}" cy="${y + 18}" r="4" ${S} fill="var(--paper-3)"/>
        <path d="M${x + 14} ${y + 18} v10 h30 v-10" ${S}/>
        <path d="M${x + w - 44} ${y + 18} v10 h30 v-10" ${S}/>
      </g>`;
    },

    dish({ x = 0, y = 0, w = 90, fill = '#9fc9de', level = .3 }) {
      const cx = x + w / 2;
      return `<g>
        <path d="M${x} ${y} a${w / 2} ${w / 2 * .62} 0 0 0 ${w} 0 Z" ${S} fill="var(--paper-3)"/>
        <ellipse cx="${cx}" cy="${y}" rx="${w / 2}" ry="${w * .16}" ${S} fill="var(--paper-2)"/>
        <ellipse cx="${cx}" cy="${y + 2}" rx="${w / 2 - 6}" ry="${w * .13}" fill="${fill}" opacity=".45"/>
      </g>`;
    },

    label({ x, y, t, size = 11, color = 'var(--muted)', anchor = 'middle' }) {
      return `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" text-anchor="${anchor}"
        font-family="var(--f-sans)">${t}</text>`;
    }
  };

  window.Parts = P;
})();
