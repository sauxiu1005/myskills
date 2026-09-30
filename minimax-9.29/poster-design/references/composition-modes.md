# 海报构图模式（绕开模型色块短板的 5 种推荐模式）

> **何时 read**：写任何海报 / 封面 / 营销图的 composition prompt 之前必读。
> **核心问题**：模型对"上文字下图 / 上下色块"这种**结构性几何分块**的执行直觉很强，会出色块拼贴感（trace 实测：即使 prompt 显式禁止仍翻车）。本文件给 5 种**整体性构图**，从根本上绕开这个短板。

---

## ⚠️ 必须先废弃的反模式

写 composition prompt 时**禁止**默认采用以下结构性思维：

| 反模式 | 为什么不行 |
|---|---|
| ❌ "上方留出来给标题，下方放主图" | 模型直觉就是出上下色块 |
| ❌ "Top 30% for title, bottom 70% for visual" | 几何分块（命中假三区 #4）|
| ❌ "色块 + 主图" 拼贴 | 模型出 PPT 拼贴感 |
| ❌ "标题区背景 vs 图像区背景" | 双背景必硬切 |

**根因**：这些都是**先分块后填内容**的设计师思维。模型的训练数据里，海报样本大量是这种结构，但**模型没有"如何让色块过渡自然"的能力**。要么从根本上不分块，要么用整体构图思维。

---

## 5 种推荐构图模式

### 模式 1：沉浸式（Immersive Overlay）

> 满图主视觉，文字浮于其上，靠**字体处理**或**半透明蒙版**实现可读性。

```
prompt 写法：
- "fully immersive composition: subject fills entire frame edge-to-edge,
   no separate text area, atmospheric depth, cinematic quality"
- "title text overlays the central upper portion of the image with
   subtle text shadow / glow / outline for legibility"
- "no rectangular background block for text"
```

**适用**：电影海报、活动主推海报、艺术展、品牌大片
**字体处理**：白字 + 描边 / 黑字 + 半透明白底 / 字体本身有特殊处理（凹陷 / 浮雕 / 描边）
**反例**：上下色块拼贴

---

### 模式 2：环绕式（Wrap-around）

> 文字**嵌入主视觉内部**，作为视觉元素的一部分（不是单独区域）。

```
prompt 写法：
- "title text integrated into the scene as a physical element:
   carved into wood / embossed on stone / printed on a paper card / 
   reflected in window / written in steam / spelled with objects"
- "text becomes part of the still life, not floating above it"
```

**适用**：文艺活动海报、产品故事海报、概念海报
**例子**：
- "周末读书会" 写在一本打开的书页上
- 品牌名印在咖啡杯侧面
- 时间用挂钟表盘呈现
- 标题用字母积木拼出在桌面

**反例**：标题白字漂浮在 Light 区中央

---

### 模式 3：极简留白式（Editorial Minimal）

> **大片单色背景** + 主图占小角 + 文字精致排版。**禁止**色块拼贴。

```
prompt 写法：
- "vast single-tone background occupying 70% of canvas,
   subject occupies bottom-left 30% in tasteful proportion,
   no horizontal/vertical color split, unified background"
- "title typeset elegantly in upper-right with generous breathing space,
   text and subject share the same visual field, no separate text zone"
```

**适用**：高端品牌海报、杂志封面、奢侈品营销、艺术展
**关键**：`unified background` + `no separate text zone` 必出现
**反例**：上半色块 + 下半色块

---

### 模式 4：满版式（Full Bleed）

> 整图密布主视觉，文字必须有**自身视觉支撑**（描边 / 阴影 / 半透明遮罩 / billing block）。

```
prompt 写法：
- "full bleed composition: imagery extends beyond frame on all sides,
   no negative space, dense visual narrative"
- "title text rendered with strong contrast support: heavy stroke outline,
   drop shadow, or semi-transparent backdrop strip — never floating bare"
- "billing block at bottom edge with industry-standard layout (cast/crew/credits)"
```

**适用**：电影海报、音乐节海报、戏剧性主推
**关键**：必须**显式声明** "full bleed" + 文字必须有自身支撑
**反例**：电影海报但中间留出色块给文字

---

### 模式 5：杂志感留白式（Magazine Composition）

> 模仿高端杂志封面：人物 / 主体居中或偏一侧 + 刊名顶部巨大字 + 副标题文字呈"漂浮"状嵌入主图周围。

```
prompt 写法：
- "magazine cover composition: subject portrait fills central frame,
   masthead title rendered LARGE across top, partially obscured by subject's head/shoulder for editorial layering"
- "supporting headlines float around subject in editorial typography:
   small text strips at side margins, no background blocks behind text"
```

**适用**：杂志封面、人物海报、时尚海报
**关键**：刊名故意被主体局部遮挡 → 视觉层叠感（不是分块）
**反例**：刊名独立放纯色顶部条

---

## 构图模式 → 子类型推荐

| 子类型 | 推荐模式（按优先序）|
|---|---|
| 01 小红书封面 | 模式 1（沉浸式）/ 模式 3（极简留白）|
| 02 公众号头图 | 模式 3（极简留白）/ 模式 1（沉浸式）|
| 03 微博 Banner | 模式 4（满版式）/ 模式 1 |
| 04 Story 竖屏 | 模式 4（满版式）/ 模式 1 |
| 05 电影海报 | 模式 4（满版式）/ 模式 1 |
| 06 活动海报 | 模式 2（环绕式）/ 模式 3（极简留白）|
| 07 音乐节海报 | 模式 4（满版式）|
| 08 杂志封面 | 模式 5（杂志感）|
| 09 书籍封面 | 模式 1 / 模式 2 |
| 10 专辑封面 | 模式 1（沉浸式）|
| 11 广告 Banner | 模式 1 / 模式 4 |
| 12 促销海报 | 模式 4（满版式）|

**没有推荐"上文字下图"模式**——这就是反模式根源。

---

## Prompt 标准句模板（直接复用）

### 通用强制句（任何海报必出现一条）

```
- composition philosophy: unified visual field, no geometric divisions,
  no separate text zone, no horizontal/vertical color band split
- text integrated INTO the composition (immersive / wrap-around / overlay),
  NOT in a separate background block
```

### Negative（任何海报必加）

```
no top color block, no bottom color block, no horizontal color band,
no rectangular text background area, no header strip, no footer strip,
no PPT-style layout, no template-like composition
```

---

## 自检 4 问（出图后必走）

1. **眯眼看图**：是否能看出"上下两块"或"左右两块"的几何切分？是 → 命中反模式
2. **找文字位置**：文字是不是"漂浮"在一块单色背景上？是 → 没用模式 1-5
3. **找过渡**：从主图到文字之间，有没有视觉过渡（色温 / 纹理 / 元素延伸）？没有 → 走的还是上下色块
4. **整体性测试**：把图缩到拇指大小，是看到"一张图"还是"两个色块拼贴"？两个 → 重出

任一回答"不达标" → 重出，强制启用模式 1-5 中的一种。

---

## 与其他 reference 的关系

- **`poster/iron-laws.md` #4**：iron-laws #4 引出三区概念，本文件给具体实施模式

---

## 配套 reference
> 本文件是**海报场景的构图策略层**，给 5 种推荐模式 + 反上下色块策略。任何海报 prompt 都该 read。

- 防翻车铁律 → `iron-laws.md`（特别 #4 视觉权重三区）
- 海报评分模型 → `quality-scoring.md`
- 12 子类型深度 → `subtypes/{NN}.md`（每个子类型推荐模式见上表）
