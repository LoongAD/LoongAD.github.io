# 物理实验 · 人教版八至九年级

初中物理 · 虚拟实验 + 知识点 + 自测。纯静态、零框架、数据驱动。

目前：**26 个虚拟实验**（八上 11 + 八下 8 + 九年级 7）、**22 章 92 节 179 个知识点**、**48 条公式**、**10 套在线自测**（带错题本）。试卷等资料暂未整理，`resources.html` 留了入口，以后往 `data/resources.js` 里加条目即可。

## 页面

- `index.html` 首页（统计数字按数据实时算）
- `labs.html` 实验库（按书册 / 类型筛选）
- `lab.html` 实验页（一个引擎，26 个实验共用；可导出可打印的实验报告）
- `knowledge.html` 知识点（22 章，侧边目录、滚动高亮、每节挂配套实验）
- `quiz.html` 在线自测（10 套，错题本存 localStorage）
- `search.html` 全站搜索
- `resources.html` 教学资料（暂空，备填）

## 结构

```
assets/
  engine.js       实验引擎（渲染页头/参数/舞台/HUD/结论/档案/报告导出）
  site.css        设计系统（靛蓝主题，纸白 / 墨黑 / 细线分层）
  parts.js        物理器材库（刻度尺、测力计、天平、透镜、电表……21 件）
data/
  ex-g8a.js       八上 11 个实验
  ex-g8b.js       八下 8 个实验
  ex-g9.js        九年级 7 个实验（文件末尾按章排序）
  kd-g8a.js       八上 6 章知识点
  kd-g8b.js       八下 6 章知识点
  kd-g9.js        九年级 10 章知识点
  meta.js         每个实验的档案：现象 / 注意 / 考点 / 公式
  quiz.js         题库（10 套 × 10 题，带解析）
  resources.js    资料清单（空，有格式示例）
```

## 加新实验的规矩

1. 实验对象：`{id, code, title, book, unit, kind, opening, stageNote, init(), svg, draw(s,el), controls(s), actions{}, actLabels{}, secondary[], hud(s)}`，push 进 `window.EXPERIMENTS`。
2. **器材一律在 `draw()` 里填充**（`data-init` 标记只画一次）。SVG 模板在定义期求值，`labs.html` 等页面虽然加载了 `parts.js`，但把 Parts 调用写进 svg 模板仍会在数据先于器材加载的页面炸掉——别这么写。
3. `unit` 写「第 X 章 …」格式，末尾的排序 IIFE 会按章重排。
4. 档案加进 `data/meta.js`，键名 = 实验对象 id。
5. 知识点里要挂实验，去 `knowledge.html` 的 `SEC_LAB` 表加一行。

## 已知取舍

- 所有数据为教学模型，趋势正确，数值不对应真实器材。
- 实验报告导出用 `window.open`，被弹窗拦截器拦时需手动允许一次。
- 错题本键名 `physWrong`，与化学站（`chemWrong`）同域名但互不干扰。
