# 化学教学站

鲁教版九年级化学 · 虚拟实验 + 知识点 + 资料 + 自测。

目前：**30 个虚拟实验**（含 9 个跨学科实践）、**11 单元 44 节 144 个知识点**、**38 份单元测试卷**、**9 套在线自测**（带错题本）。

在线地址：**https://loongad.github.io/chem/**

纯静态，没有框架、没有构建步骤、没有后端。改一行刷新即生效。

## 文件结构

```
index.html        首页
labs.html         实验库（从数据自动生成列表）
lab.html          实验页（一个引擎，30 个实验共用；可导出实验报告）
knowledge.html    知识点（11 单元 / 44 节）
resources.html    教学资料（38 份，按单元分组）
search.html       全站搜索（实验 / 知识点 / 自测 / 资料）
quiz.html         在线自测
solve.html        拍照解题（拍/传/粘一张化学题 → 分步讲解）

assets/
  site.css        设计系统：颜色、字号、组件、打印样式
  engine.js       实验引擎：页头 / 参数栏 / 舞台 / 数据栏 / 结论
  nav.js          移动端抽屉导航（≤820px 生效，不影响桌面）
  solve.js        拍照解题引擎：压图 / 调用接口 / 化学式排版 / 历史
  parts.js        器材 SVG 库（烧杯、试管、漏斗、酒精灯、铁架台…）
  img/bebas.ttf   数字与编号用的字体

data/
  ex-upper.js     上册 15 个实验的定义
  ex-lower.js     下册 15 个实验的定义（含统一排序）
  kd-upper.js     上册知识点
  kd-lower.js     下册知识点
  kd-practice.js  9 个跨学科实践活动（按单元合并进知识点）
  meta.js         每个实验的档案：现象 / 注意 / 考点 / 方程式
  resources.js    教学资料清单
  quiz.js         题库
```

## 加一个实验

只要在 `data/ex-upper.js` 或 `ex-lower.js` 里加一个对象，实验库和上下页导航会自动出现：

```js
window.EXPERIMENTS.push({
  id: 'u1-04', code: 'U1-04', title: '实验名称',
  book: '上册', unit: '第一单元 步入化学殿堂', kind: '基本操作',
  opening: '一句话说明',
  init: () => ({ v: 0 }),
  svg: `<svg viewBox="0 0 460 400">…</svg>`,
  draw(s, el, api) { /* 用 el.querySelector('#id') 改属性 */ },
  controls(s) { return [{ type: 'range', id: 'x', label: '…', min: 0, max: 10,
    get: st => st.v, set: (st, v) => { st.v = v; } }]; },
  hud(s) { return [{ label: '数值', value: s.v }]; }
});
```

控件类型：`range` / `seg` / `steps` / `opts` / `note`。
动作按钮写在 `actions: { key(s, api) {} }`，文案写在 `actLabels: { key: '按钮文字' }`。

## 改配色 / 字号

全部集中在 `assets/site.css` 顶部的 `:root`。改 `--accent` 换强调色，改 `--paper` 换底色，暗色模式在 `prefers-color-scheme` 里单独覆盖。

## 本地预览

不要直接双击打开（浏览器会拦 file:// 的脚本），起一个静态服务：

```bash
cd chem-lab
python3 -m http.server 8000
# 打开 http://127.0.0.1:8000/
```

## 拍照解题（solve.html）

拍一张化学题，调用多模态大模型返回「题干 + 思路 + 2–5 步讲解 + 答案 + 易错点 + 关联章节」。

**它不预置任何密钥**。首次使用需点右上角齿轮，填入一个 OpenAI 兼容接口的地址、模型名与 API Key：

| 服务商 | 接口地址 | 模型名 |
|---|---|---|
| 通义千问（阿里云百炼） | `https://dashscope.aliyuncs.com/compatible-mode/v1` | `qwen-vl-max-latest` |
| 智谱 GLM-4V | `https://open.bigmodel.cn/api/paas/v4` | `glm-4v-plus` |
| 火山方舟 | `https://ark.cn-beijing.volces.com/api/v3` | 推理接入点 ID（`ep-` 开头） |
| 其他 | 任意 OpenAI 兼容 `/chat/completions` | 自填 |

- 密钥存在浏览器 `localStorage`，**不进仓库、不上传**；换设备需重填。
- 图片在浏览器里压到长边 1600px / JPEG 0.82 后直接发给所选服务商，站点不保存任何图片。
- 化学式排版（`H2SO4` → H₂SO₄、`=△=` → 条件箭头）由 `solve.js` 本地完成，**不引 KaTeX / CDN**。
- 讲解由模型生成，页面底部有免责提示；识别不确定时提示词要求它写「（图片此处不清）」而不是编数据。

### 想让学生免密钥使用

静态站没有后端，共享密钥只能放代理。做法：建一个 Cloudflare Worker 转发到服务商，前端把「接口地址」填成 Worker 地址，Key 随便填一个占位串（如 `proxy`），由 Worker 校验来源后再转发真实密钥。这次没做，留作二期。
