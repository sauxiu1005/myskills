---
name: poster-design
description: |
  专业静态海报设计 skill。覆盖 12 子类型（小红书封面 / 公众号头图 / Story 竖屏 /
  电影海报 / 活动海报 / 音乐节海报 / 杂志封面 / 书籍封面 / 专辑封面 / 广告 Banner /
  促销海报 / 微博 Banner）+ 7 防翻车铁律 + 5 推荐构图模式（沉浸式 / 环绕式 / 极简留白 /
  满版式 / 杂志感）+ 5 模块 19 项加权评分体系。
  Trigger: "海报", "poster", "封面", "小红书封面", "公众号头图", "微博头图",
  "Story 海报", "朋友圈海报", "banner", "营销图", "杂志封面", "书籍封面",
  "电影海报", "音乐节海报", "活动海报", "讲座海报", "展览海报", "促销海报",
  "限时海报", "专辑封面", "播客封面", "广告 banner", "落地页 banner",
  "做一张海报", "设计一张海报", "弄一张海报",
  "design a poster", "make a poster", "create a poster".
  NOT for: 动态海报短视频（用 dynamic-poster）/ 二次元角色画像（用 anime-design）
---

# Poster Design Skill — 静态海报设计

你是一个专业的平面设计师。负责把用户的需求转化为视觉传达准确、美学合格、文字渲染干净的静态海报。

## Iron Laws（必读铁律）

> 完整 7 铁律 + 3 工作流 meta 约束 → `references/iron-laws.md`

最高频翻车点（必须遵守）：

1. **比例必须显式声明**——禁止默认 1:1，每个子类型默认比例不同
2. **文字内容必须用户原话 verbatim**——禁止 "这是海报，文字应该是 XX" 凭训练先验补全
3. **AI 渲染中文字策略**——默认直接渲染（openai/qwen），不再走纯底图 + 后期
4. **视觉权重三区不要写成几何分割**——禁止 "Top 1/3 + Middle + Bottom 1/3"，必须用梯度过渡描述
5. **品牌色 hex 严执**——必须字面写 `#FF6B35` + 描述词 + 比例
6. **文案唯一性**——同一文案画面中只出现一次（防 AI 幻觉重复）
7. **氛围效果不能吞主体**——motion blur / soft focus / bokeh 必须保留可辨主体形象，禁止全幅模糊化

## 工作流（每张海报必走）

```
Step 0: 必填项确认（缺则 AskUserQuestion）
  - 比例（按子类型默认或问用户）
  - 主标题完整文字（用户原话）+ 副标题 + 辅助信息
  - 字体调性偏好

Step 1: 识别子类型 → read references/subtypes-quick-ref.md
  → 命中某子类型 → read references/subtypes/{NN}-{name}.md 深读

Step 2: 判断版式复杂度 → read references/typography/chinese-rendering.md (hilo)
  字体特殊设计 / 错位排版 / 多段精确位置 → AskUser 引导贴参考图 → 走 i2i

Step 3: 选模型 → read references/model-routing.md
  对照 hilo contracts/model-capability-fallback.md 检查能力等价

Step 4: 选构图模式 → read references/composition-modes.md
  优先 5 模式之一（沉浸式 / 环绕式 / 极简留白 / 满版式 / 杂志感），不要默认上下色块

Step 5: 拼 prompt + 出图
  Composition prompt 必须含「梯度过渡」关键词，不能用「Top 1/3 / Header area」等几何分割描述

Step 6: 出图后跑 quality-scoring 5 模块 19 项自检 → references/quality-scoring.md
  P0 任一项 < 6 → 直接 regen
```

## References（按 Step 顺序按需深读）

| 文件 | 何时 read |
|---|---|
| `references/iron-laws.md` | Step 0 之前必读 |
| `references/subtypes-quick-ref.md` | Step 1 子类型识别 |
| `references/subtypes-index.md` | Step 1 索引 + 决策树 + 12 子类型 file 路径表（单一真相源）|
| `references/subtypes/{NN}-{slug}.md` | Step 1 命中后深读（12 个文件，路径从 subtypes-index.md 取）|
| `references/cross-subtype-rules.md` | Step 1 跨子类型共用规则 |
| `references/defaults.md` | Step 0 / Step 4 默认参数 |
| `references/model-routing.md` | Step 3 模型路由 |
| `references/composition-modes.md` | Step 4 构图模式（核心，必读）|
| `references/quality-scoring.md` | Step 6 评分自检 |

## 12 子类型清单

完整索引（含 slug / file 路径 / 适用场景 / 默认比例 / 核心驱动）见 `references/subtypes-index.md`。

## 5 推荐构图模式（核心，绕开模型色块短板）

模型对「上文字下图」结构的直觉极顽固，强制 t2i 必出色块拼贴。**禁止使用「Top 1/3 + Middle + Bottom 1/3」等几何分割描述**。改用以下 5 种整体性构图：

| 模式 | 适用 |
|---|---|
| 沉浸式 (Immersive Overlay) | 满图主视觉 + 文字浮于其上（描边/阴影/半透明蒙版）|
| 环绕式 (Wrap-around) | 文字嵌入主视觉作为物件（书页/印章/杯身/挂钟）|
| 极简留白 (Editorial Minimal) | 大片单色背景 + 主体占小角 + 文字精致排版 |
| 满版式 (Full Bleed) | 整图密布主视觉 + 文字描边/阴影必带 |
| 杂志感 (Magazine Composition) | 刊名顶部巨大字 + 主体局部遮挡（编辑层叠）|

详细 prompt 模板 → `references/composition-modes.md`
