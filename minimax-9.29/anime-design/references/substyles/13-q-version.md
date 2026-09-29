# 13. Q 版/萌化 (q-version)

> **优先质量维度**: Style Authenticity + Cuteness Appeal（萌系识别度 + kawaii 感染力）
> **默认比例**: 1:1（头像 / 表情包）/ 3:4（萌版立绘）/ 9:16（萌系全身海报）
> **核心识别特征**: 3 头身超变形 + 大眼小嘴简化五官 + 圆润萌系轮廓 + kawaii 配色 — 类 SD（super deformed）/ chibi 风 / 表情包文化视觉调性

---

## 一、子风格基因清单

> Q 版核心是「比例破坏」+「特征夸大」+「萌点强化」，不是简单缩小普通角色。
> 核心逻辑：基因 = 3 头身 × 大眼小嘴 × 圆润形态 × kawaii 配色。

| # | 基因维度 | 描述 | Prompt 关键词 |
|---|---|---|---|
| 1 | 笔触 | 圆润简化轮廓，无尖锐线条，描边清晰但柔和 | `rounded soft outlines, simplified clean lineart, no sharp lines` |
| 2 | 配色 | kawaii 高明度低饱和（粉嫩 / 奶黄 / 薄荷绿 / 樱花粉）+ 偶尔点缀强调色 | `kawaii pastel palette, soft pink, mint green, cream yellow, high brightness` |
| 3 | 五官比例 | 极简化五官 — 大眼睛占脸 30%+ / 鼻嘴极小或省略 / 腮红点缀 | `oversized round eyes, tiny nose and mouth or omitted, blush cheeks, simplified features` |
| 4 | 头身比例 | **必须 3 头身**（核心识别特征），偶尔 2 头身（极端萌）/ 4 头身（轻萌） | `3-head body proportion, super deformed (SD), chibi figure, oversized head small body` |
| 5 | 光影风格 | 极简平涂 + 单层柔和阴影 + 局部高光（眼睛 / 头发） | `simple flat shading, soft single-layer shadow, glossy eye highlights` |
| 6 | 动作姿态 | 萌系动作（kira pose / V 手势 / 抱小物 / 歪头），极度可爱化 | `cute chibi pose, peace sign, kira pose, holding small item, head tilt` |

---

## 二、整体风格与质感

| 维度 | 要求 |
|---|---|
| **画风时代** | 90 后日漫 SD 文化 + 现代社交媒体表情包文化 |
| **媒介感** | 数字绘画干净萌系，类社交平台表情包 / 二创周边设计 |
| **配色方案** | 高明度低饱和 pastel 色（粉 / 蓝 / 黄 / 绿），柔和不刺眼 |
| **背景处理** | 纯色 / 简化几何 / 卡通元素（爱心 / 星星 / 闪光），不抢主体 |
| **光影逻辑** | 简化卡通光影，强调可爱感不强调真实感 |

---

## 三、Prompt 关键词词典

| 类别 | 关键词组合 |
|---|---|
| **必出基础词** | `chibi style, super deformed (SD), Q-version, 3-head body proportion, kawaii aesthetic` |
| **角色描绘** | `oversized round eyes, tiny nose and mouth, blush cheeks, oversized head small body, cute chibi pose` |
| **画风强化** | `kawaii illustration, mascot character design, sticker style, emoji-friendly chibi` |
| **场景类型** | `pastel colored background, cartoon decorative elements, hearts and stars, simple solid background` |

**完整 prompt 模板（示例）**：
```
chibi style super deformed Q-version, 3-head body proportion with oversized head small body,
[CHARACTER: <角色身份> reimagined as chibi], oversized round eyes occupying 30% of face,
tiny nose and mouth or omitted, blush cheeks, simplified facial features,
kawaii pastel color palette (soft pink mint cream yellow), simple flat shading,
cute chibi pose with [peace sign / holding small item / head tilt],
rounded soft outlines, [BACKGROUND: pastel solid color with hearts and stars decoration],
mascot character design, sticker friendly, 1:1
```

---

## 四、模型推荐

| 场景 | 推荐 | 备选 | 备注 |
|---|---|---|---|
| 表情包 | nano_banana | seedream | nano_banana 简洁萌系适配 |
| 萌版立绘 | **seedream** | nano_banana | seedream 二次元 + i2i 保主体 |
| 同 IP 萌化 | seedream + i2i | kontext | i2i 必走，保留原 IP 特征 |
| 头像 | nano_banana | seedream | nano_banana 出头像快且萌 |
| 周边设计 | seedream | midjourney | seedream 萌系基础好 |

**只能用：nano_banana / kling / kontext / openai / midjourney / seedream / qwen**

---

## 五、默认参数（如不指定走这个）

| 参数 | 默认值 | 说明 |
|---|---|---|
| 模型 | seedream | Q 版主推（萌系 + 主体稳） |
| 比例 | 1:1（默认头像 / 表情包）/ 3:4（萌版立绘） |  |
| 增强词 | `chibi, super deformed, 3-head body, kawaii pastel palette, oversized eyes, blush cheeks` | 强化萌系识别度 |
| Negative | `realistic body proportion, 7-8 head body, detailed anatomy, sharp angular features, dark grim palette, painterly texture` | 防御正常人体比例 |

---

## 六、角色设计规范（保一致性必读）

不写这些 → 角色第二张就漂移到正常人体比例：

- **发型/发色 lock**：明确「chibi simplified hair as solid clusters」+ 颜色（萌系常用浅色 / 双色染发 / 渐变色）
- **眼睛 lock**：「oversized round eyes occupying 30% of face, glossy highlights, large pupils」（眼睛是萌点核心）
- **服装关键元素**：原 IP 服装萌化简化（保留标志性配色 + 简化细节），如制服 / 角色服必须可识别
- **体型/头身比**：**必须明写 `3-head body proportion`**（不锁就出 5-6 头身）+ `oversized head, tiny round body`
- **是否 i2i 加持**：原 IP 萌化必走 i2i，权重 40-50%，保留原角色特征再萌化
- **腮红 + 高光 lock**：「blush cheeks, glossy eye highlights, sparkle effects」（萌系标配三件套）

**主体一致性 Lock 详细策略**：3头身/超大眼睛/简化服装/腮红高光必须逐条锁定。

---

## 七、易错点（Watch For）

- **身体比例画成正常人体** — 不锁 3 头身就出 5-7 头身（默认）→ 失去 Q 版核心识别 → 强制 `3-head body proportion, super deformed, NOT normal body proportion`
- **眼睛画太小** — 套写实眼睛 → 失去萌点 → 锁 `oversized round eyes occupying 30% of face`
- **配色高饱和** — 出鲜艳重色 → 失去 kawaii 柔和感 → 锁 `kawaii pastel palette, high brightness low saturation`
- **加细节过多** — 萌系核心是简化，加细节失去萌感 → 加 `simplified features, NOT detailed`
- **强用 midjourney** — midjourney 偏 painterly，画 Q 版常变厚涂 → 改 seedream 或 nano_banana
- **背景过满** — 萌系角色 + 复杂背景 → 抢主体 → 加 `simple solid background OR pastel decoration only`
- **打光复杂** — 套电影级光影 → 失去萌系简化感 → 加 `simple flat shading, soft single-layer shadow`

---

## 配套场景模板

| 场景 | 推荐组合 |
|---|---|
| 单人立绘 | seedream + 3:4 + 默认参数 |
| 角色多视图 | seedream + i2i 锁主体 + `chibi character sheet` |
| 同人插画 | seedream + 1:1 + `chibi fan art` |
| 漫画跨页 | seedream + 9:16 + `chibi 4-panel comic` |
| 表情包 | nano_banana + 1:1 + 多表情变体 prompt |

---

## 配套 reference

本文件是 anime/q-version 子风格特化层。

- 防翻车铁律 → `../iron-laws.md`
- 跨子风格共用规则 → `../cross-substyle-rules.md`
- 默认参数 → `../defaults.md`
- 模型路由 → `../model-routing.md`
