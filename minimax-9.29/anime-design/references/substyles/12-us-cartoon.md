# 12. 美漫卡通 (us-cartoon)

> **优先质量维度**: Style Authenticity + Expression Vividness（卡通识别度 + 表情夸张张力）
> **默认比例**: 16:9（动画帧）/ 4:3（经典卡通）/ 1:1（角色头像）
> **核心识别特征**: Disney-Pixar 圆润形态 + 夸张表情 + 大色块明亮配色 + 简化标志性轮廓 — 类皮克斯 / 迪士尼 / 卡通频道（Cartoon Network）视觉调性

---

## 一、子风格基因清单

> 美漫卡通有强烈识别度：圆润、夸张、大色块、可爱化。
> 核心逻辑：基因 = 圆润形态 × 夸张表情 × 大色块 × 简化轮廓。

| # | 基因维度 | 描述 | Prompt 关键词 |
|---|---|---|---|
| 1 | 笔触 | 圆润饱满轮廓线，无尖锐转角，所有形态偏 round | `rounded shapes, soft curved outlines, no sharp angles, plump form` |
| 2 | 配色 | 大色块明亮饱和 + 撞色搭配，类儿童绘本配色 | `bright vibrant colors, large color blocks, playful palette, picture book aesthetic` |
| 3 | 五官比例 | 夸张化大眼睛 + 大嘴巴，表情极度丰富,情绪外放 | `expressive exaggerated features, large round eyes, big mouth, vivid emotions` |
| 4 | 头身比例 | 3-5 头身偏 Q 化，头大身小，可爱化身体 | `3-5 head body cartoon proportion, oversized head, cute body shape` |
| 5 | 光影风格 | 简化卡通阴影 + 局部高光 + 软渐变（Pixar 风）/ 平涂（CN 风） | `cartoon shading, soft gradient highlights, Pixar-style rendering OR flat cel shading` |
| 6 | 形态语言 | 所有元素几何化简化（云朵 / 树木 / 建筑全部圆润形态）| `geometric simplified forms, rounded environment elements, stylized shapes` |

---

## 二、整体风格与质感

| 维度 | 要求 |
|---|---|
| **画风时代** | Pixar / Disney / DreamWorks 现代 3D 动画 + Cartoon Network / Adventure Time 2D 风 |
| **媒介感** | 现代 3D CG（Pixar 风）/ 数字 2D 平涂（CN 风），可选 |
| **配色方案** | 高饱和大色块 + 撞色对比（亮黄 + 蓝紫 / 朱红 + 翡翠绿），avoid 灰暗 |
| **背景处理** | 简化卡通场景 / 几何化建筑 / 圆润云树 / 大色块天空 |
| **光影逻辑** | Pixar 风：软渐变 + 局部高光；CN 风：平涂大色块少阴影 |

---

## 三、Prompt 关键词词典

| 类别 | 关键词组合 |
|---|---|
| **必出基础词** | `Western cartoon style, Disney-Pixar aesthetic, rounded shapes, expressive exaggerated features, vibrant palette` |
| **角色描绘** | `cartoon character design, oversized head, large round eyes, big expressive mouth, plump rounded body` |
| **画风强化** | `Pixar 3D animation OR Cartoon Network 2D style, animated movie quality, charming cartoon character` |
| **场景类型** | `whimsical cartoon town, stylized adventure landscape, cozy cartoon home interior, magical fantasy world` |

**完整 prompt 模板（示例）**：
```
Western cartoon style, Disney-Pixar aesthetic with rounded plump shapes,
[CHARACTER: <身份 / 服装>], oversized head with large expressive eyes and big mouth,
3-5 head body cartoon proportion, vibrant bold colors with large color blocks,
cartoon shading with soft gradient highlights, vivid emotional expression,
[SCENE: <简化卡通场景>] with stylized rounded environment elements,
animated movie quality, charming character design, 16:9
```

---

## 四、模型推荐

| 场景 | 推荐 | 备选 | 备注 |
|---|---|---|---|
| 角色立绘（2D） | **midjourney** | seedream | midjourney 美学 + 卡通理解最强 |
| 角色立绘（3D Pixar）| midjourney | kling | midjourney 出概念,kling 出 3D 成品 |
| 多角色场景 | midjourney | seedream | midjourney 群像构图美学强 |
| 表情包 / 头像 | nano_banana | midjourney | nano_banana 简洁卡通适配头像 |
| 角色多视图 | seedream + i2i | midjourney | seedream 主体一致更稳 |

**只能用：nano_banana / kling / kontext / openai / midjourney / seedream / qwen**

---

## 五、默认参数（如不指定走这个）

| 参数 | 默认值 | 说明 |
|---|---|---|
| 模型 | midjourney | 美漫卡通主推（美学 + 卡通理解强） |
| 比例 | 16:9（动画帧默认）/ 4:3（经典）/ 1:1（头像） |  |
| 增强词 | `Disney-Pixar style, rounded plump shapes, vibrant colors, expressive features, charming character design` | 强化卡通识别度 |
| Negative | `realistic photo, anime style, sharp angular features, dark gritty palette, photorealistic, manga style, painterly` | 防御写实化 / 日漫化 |

---

## 六、角色设计规范（保一致性必读）

不写这些 → 角色第二张就漂移到写实或日漫风：

- **发型/发色 lock**：明确「stylized cartoon hair as solid shapes, NOT individual strands」+ 颜色（卡通常用纯色 / 撞色染色）
- **眼睛 lock**：「large round cartoon eyes with simple iris, large white sclera area」（防御写实 / 日漫眼）
- **服装关键元素**：明确卡通化简化（纯色块 + 简单图案），无复杂纹理（卡通禁忌）
- **体型/头身比**：明确「3-5 head body cartoon proportion, oversized head, plump rounded body」（防御写实 7-8 头身）
- **是否 i2i 加持**：seedream + i2i 锁主体（角色多场景刚需），权重 40-55%
- **表情语言 lock**：每个角色绑定标志性表情（咧嘴笑 / 瞪眼 / 嘟嘴），跨图保留

**主体一致性 Lock 详细策略**：卡通化发型/圆眼睛/简化服装/3-5头身/表情语言必须逐条锁定。

---

## 七、易错点（Watch For）

- **写实化丧失卡通感** — 模型默认 photo realistic → 失去卡通圆润可爱 → 强制 `cartoon style, NOT realistic, rounded plump shapes`
- **角度过于尖锐** — 套日漫尖下巴 / 锐利轮廓 → 失去卡通圆润感 → 加 `rounded soft outlines, no sharp angles`
- **配色暗沉** — 出 grimdark 色调 → 失去卡通明亮欢快感 → 锁 `bright vibrant colors, large color blocks, playful palette`
- **头身比拉长** — 出 7-8 头身（写实默认）→ 失去卡通可爱化 → 锁 `3-5 head body cartoon proportion`
- **背景写实** — 卡通角色 + 真实场景 → 风格断层 → 强制 `stylized rounded environment, geometric simplified shapes`
- **表情平淡** — 卡通核心是夸张表情 → 表情不到位失去张力 → 加 `vivid emotional expression, exaggerated facial expression`
- **混入日漫元素** — 写 cartoon 时模型套大眼睛 + 尖下巴 → 风格断层 → 加 `Western cartoon, NOT Japanese anime`

---

## 配套场景模板

| 场景 | 推荐组合 |
|---|---|
| 单人立绘 | midjourney + 1:1 + 默认参数 |
| 角色多视图 | seedream + i2i 锁主体 + `cartoon character turnaround` |
| 同人插画 | midjourney + 16:9 + 卡通场景关键词 |
| 漫画跨页 | midjourney + 4:3 + `comic strip layout` |

---

## 配套 reference

本文件是 anime/us-cartoon 子风格特化层。

- 防翻车铁律 → `../iron-laws.md`
- 跨子风格共用规则 → `../cross-substyle-rules.md`
- 默认参数 → `../defaults.md`
- 模型路由 → `../model-routing.md`
