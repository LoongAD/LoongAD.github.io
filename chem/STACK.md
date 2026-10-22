# 全流程技术清单（从起项目到上线）

> ★ 数据为 2026-10-20 用 GitHub API 实测。「—」表示未核实，别当准数用。
> 建议标记：**用** = 直接引依赖 · **看** = 读代码学思路 · **别碰** = license 或质量有问题

---

## 阶段 0 · 项目骨架

| 项目 | ★ | 许可 | 用途 | 建议 |
|---|---|---|---|---|
| [withastro/astro](https://github.com/withastro/astro) | 63.3k | MIT | 内容站框架，默认零 JS，产物纯静态 | **用**。首页/实验库/详情页都能生成 |
| [tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss) | — | MIT | 原子化 CSS | 你已在用 `tailwind.min.css` |
| 纯 HTML（不构建） | — | — | 单个 `index.html` | **当前原型走的就是这条**，改一行刷新生效 |

**选择标准**：如果你接受"每次改完等 5 秒构建"，用 Astro；如果只想双击打开就能看，保持纯 HTML。32 个实验的规模，纯 HTML 完全撑得住。

---

## 阶段 1 · 内容与数据（这次新查的重点）

| 项目 | ★ | 许可 | 用途 | 建议 |
|---|---|---|---|---|
| [Bowserinator/Periodic-Table-JSON](https://github.com/Bowserinator/Periodic-Table-JSON) | 727 | 未标 | 118 个元素的完整数据（原子量、电负性、熔沸点、电子排布） | **用**。省掉自己录元素表 |
| [Ali-Marandi/chembalance](https://github.com/Ali-Marandi/chembalance) | 108 | MIT | 化学方程式配平（有理数线性代数解法） | **用**。配平算法不好写，这个直接解 |
| [mhchem/MathJax-mhchem](https://github.com/mhchem/MathJax-mhchem) | 108 | Apache-2.0 | 化学式排版扩展：`\ce{CuSO4 + 2NaOH -> Cu(OH)2 v + Na2SO4}` | **用**。下标、↑↓、沉淀符号全自动 |
| KaTeX | — | MIT | 公式渲染底座，支持 mhchem 扩展 | **用**。和上面配套，比手拼 `<sub>` 强 |
| `experiments.json`（本项目） | — | — | 32 个实验的结构化元数据 | 已生成，可直接当底稿 |

**这一组是之前漏掉的。** 它们的价值：

1. **元素数据**——讲「相对原子质量」「电负性」时直接查表，不用硬编码
2. **方程式配平**——学生输入 `Fe + O2 -> Fe3O4`，你能立刻给出 `3Fe + 2O2 → Fe3O4`，这是"会算"和"不会算"的分界
3. **mhchem**——化学式的排版规范（下标、箭头、沉淀符号）比想象中琐碎，别自己拼

---

## 阶段 2 · 页面与 UI

| 项目 | ★ | 许可 | 用途 | 建议 |
|---|---|---|---|---|
| [lucide-icons/lucide](https://github.com/lucide-icons/lucide) | — | ISC | 图标集 | 你已在用 `lucide.min.js` |
| `DESIGN.md`（本项目） | — | — | 三套主题、色值、字号、组件尺寸 | 已生成，照着做 |
| 字体 | — | — | 系统字体栈即可 | **不需要**买字库 |

---

## 阶段 3 · 交互引擎（核心）

| 项目 | ★ | 许可 | 用途 | 建议 |
|---|---|---|---|---|
| 原生 SVG + DOM | — | — | 器材 < 20 件、位置固定 | **先用**。当前原型就是它 |
| [konvajs/konva](https://github.com/konvajs/konva) | 14.9k | MIT* | Canvas 2D 场景图，对象级拖拽/变换/分层 | 器材多、要自由摆放时换 |
| [fabricjs/fabric.js](https://github.com/fabricjs/fabric.js) | 31.5k | MIT | Canvas 对象模型，自带选择框/缩放/旋转 | 偏画板场景，实验台不如 Konva 顺手 |
| [liabru/matter-js](https://github.com/liabru/matter-js) | 18.5k | MIT | 2D 刚体物理 | **只在**要"倒液、碰撞"时用 |
| [mrdoob/three.js](https://github.com/mrdoob/three.js) | 116.6k | MIT | 3D 渲染 | 最后考虑，学习曲线陡 |
| [3dmol/3Dmol.js](https://github.com/3dmol/3Dmol.js) | 1.0k | BSD-3 | 分子结构可视化（球棍模型） | 讲分子构型时直接嵌 |

\* Konva 的 LICENSE 文件是 MIT，GitHub API 标 NOASSERTION（文件格式不标准）。

**关键判断**：竞品自己就没有物理引擎（液面按 1 g/mL 线性换算）。**不要为了"像"而上 Matter.js**，那是给自己找麻烦。

---

## 阶段 4 · 动效

| 项目 | ★ | 许可 | 用途 | 建议 |
|---|---|---|---|---|
| [juliangarnier/anime](https://github.com/juliangarnier/anime) | 73.7k | MIT | 轻量动画引擎（~20KB），无框架依赖 | **首选**。液面、滴管、HUD 数字都够 |
| [motiondivision/motion](https://github.com/motiondivision/motion) | 34.4k | MIT | 声明式动画，React/原生 JS 双版本 | 次选，API 更现代 |
| [greensock/GSAP](https://github.com/greensock/GSAP) | 29.5k | 自定义 | 时间轴动画，复杂序列最强 | 只有要做"多步联动演出"才用 |
| [darkroomengineering/lenis](https://github.com/darkroomengineering/lenis) | 16.7k | MIT | 平滑滚动 | 营销首页那种顺滑感 |
| [maxwellito/vivus](https://github.com/maxwellito/vivus) | 15.5k | MIT | SVG 线条"画出来"的动画 | **画实验装置示意**时很好用 |

**节奏参考**（从竞品操作中估的，见 DESIGN.md）：液面 400–600ms ease-out，颜色 600–800ms ease，**不要用 spring 回弹**。

---

## 阶段 5 · 搜索

| 项目 | ★ | 许可 | 用途 | 建议 |
|---|---|---|---|---|
| [Pagefind/pagefind](https://github.com/Pagefind/pagefind) | 5.5k | MIT | 构建时生成静态索引，运行时纯前端检索 | **首选**（实验多了以后） |
| [krisk/Fuse](https://github.com/krisk/Fuse) | 20.5k | Apache-2.0 | 内存模糊搜索 | **32 条数据用这个就够**，一行接上 |
| [lucaong/minisearch](https://github.com/lucaong/minisearch) | 6.2k | MIT | 轻量全文索引 | 备选 |

**中文提醒**：三个默认都按空格切词，中文要额外处理。32 个实验的规模，`Fuse` + 手工维护的关键词字段最省事。

---

## 阶段 6 · 状态与撤销

| 方案 | 说明 |
|---|---|
| **自研命令栈**（推荐） | 50 行搞定：每次操作 push `{do, undo}`，撤销时反向执行。竞品的"撤销/重做"就是这么回事 |
| immer | 需要不可变更新时用；原生 JS 项目没必要引入 |

---

## 阶段 7 · 测试

| 项目 | 许可 | 用途 | 建议 |
|---|---|---|---|
| Playwright | Apache-2.0 | 浏览器自动化、截图回归 | **用**。竞品分析、界面回归都靠它 |
| Vitest | MIT | 单元测试 | 化学计算（摩尔质量、配平）值得写几个 |

---

## 阶段 8 · 部署

| 方案 | 成本 | 适合 |
|---|---|---|
| GitHub Pages | 免费 | 纯静态，最简单 |
| Cloudflare Pages | 免费 | 国内访问相对快 |
| Vercel | 免费 | 如果后面上 Next.js |
| 现有 PythonAnywhere | 已有 | 放静态目录，和账本站同域 |

---

## 阶段 9 · 可选 / 以后再说

| 项目 | 用途 | 什么时候需要 |
|---|---|---|
| RDKit.js | 分子式解析、2D 结构生成 | 高中化学用不上，大学/竞赛才需要 |
| SmilesDrawer | SMILES → 结构图 | 同上 |
| MathJax | 公式渲染（比 KaTeX 重） | 只有要排复杂数学式时 |

---

## 最小可行组合（推荐先跑这个）

```
纯 HTML + CSS + 原生 JS
+ anime.js（动效）
+ Fuse（搜索）
+ 自研命令栈（撤销）
+ GitHub Pages（部署）
```

零构建、零框架、总体积 < 100KB，改一行刷新生效，断网也能跑。

## 升级触发条件

| 什么时候 | 换什么 |
|---|---|
| 器材超过 10 件、要自由摆放 | Konva |
| 要模拟倒液/碰撞 | Matter.js |
| 要真 3D | Three.js |
| 实验数超过 100、要全文搜索 | Pagefind |
| 方程式要自动排版 | KaTeX + mhchem |
| 要做配平计算器 | chembalance |

---

## 明确不要碰的

| 项目 | 原因 |
|---|---|
| PhET（phetsims/*） | 限非商业教育用途，单个模拟仓库已停止维护，代码拿不走 |
| 无 license 的化学项目（0–2★ 那批） | 法律上默认"保留所有权利"，只能读代码学思路 |
| GPL-2.0 / GPL-3.0 项目 | 传染性，会让你的整个项目必须开源 |
| `mleoking/PhET` 镜像 | GPL-2.0 且 2016 年停更 |

---

## 一句话总结

**轮子很全，而且都是 MIT/Apache。** 你缺的从来不是库，是这两样：

1. **32 个实验各自的内容**（现象、方程式、操作步骤、考点）
2. **32 个实验各自的界面设计**（不是同一张台面换参数）

这两样 GitHub 上没有，也不用找。
