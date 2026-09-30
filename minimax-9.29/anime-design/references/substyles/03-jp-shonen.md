# 03. 日漫少年向 (jp-shonen)

> **优先质量维度**: Action Dynamics + Character Consistency（动作张力 + 角色一致性）
> **默认比例**: 16:9（战斗场景）/ 2:3（角色立绘）
> **核心识别特征**: 动感速度线 + 力量感肌肉 + 特效粒子 + 棱角分明五官 — JUMP 系热血主流（鸣人/海贼/咒术/我英）

---

## 一、子风格基因清单

> 风格不是"看着像就行",必须可量化、可复现、可教学。
> 核心逻辑：基因 = 动感线条 × 力量肌肉 × 战斗特效 × 棱角五官 × 7-8 头身。

| # | 基因维度 | 描述 | Prompt 关键词 |
|---|---|---|---|
| 1 | 笔触 | 锐利动感 lineart、速度线、爆炸感 | `dynamic sharp lineart, speed lines, action manga style` |
| 2 | 配色 | 高对比、强光暗、特效色鲜艳 | `high contrast colors, vivid effect colors, dramatic lighting` |
| 3 | 五官比例 | 棱角分明、锐利眼神、男性化下颌 | `sharp angular features, intense eyes, defined jawline, masculine face` |
| 4 | 头身比例 | 8 头身、肌肉发达、力量感 | `8-head muscular body, athletic build, powerful proportions` |
| 5 | 战斗特效 | 能量光效、粒子飞溅、冲击波 | `energy aura, particle effects, impact shockwave, battle vfx` |
| 6 | 构图 | 仰拍、动态对角线、夸张透视 | `low angle shot, diagonal composition, dramatic perspective, foreshortening` |

---

## 二、整体风格与质感

| 维度 | 要求 |
|---|---|
| **画风时代** | 现代 JUMP 主流（2010 后我英 / 鬼灭 / 咒术 / 链锯人）|
| **媒介感** | 数字 cel shading + 锐利 lineart + 偶尔半厚涂战斗场景 |
| **配色方案** | 高饱和高对比、能量光效用纯色（金/蓝/紫）、阴影深邃 |
| **背景处理** | 战斗场景多用速度线 / 抽象背景 / 爆炸冲击;日常场景写实 |
| **光影逻辑** | 强戏剧光影、轮廓边缘强光、暗部深 |

---

## 三、Prompt 关键词词典

| 类别 | 关键词组合 |
|---|---|
| **必出基础词** | `shonen anime style, JUMP manga aesthetic, dynamic action illustration, modern shonen` |
| **角色描绘** | `sharp angular features, intense determined eyes, muscular athletic build, 8-head body, battle pose` |
| **画风强化** | `dynamic sharp lineart, speed lines, dramatic high contrast lighting, energy effects, particle vfx` |
| **场景类型** | `mid-air battle scene, urban destruction, training arena, school rooftop confrontation, magical aura unleashed` |

**完整 prompt 模板（示例）**：
```
shonen anime style illustration, JUMP manga aesthetic,
[character with hair/eye/outfit/weapon lock], dynamic action pose,
sharp angular facial features, intense determined eyes, muscular 8-head body,
dynamic sharp lineart with speed lines, high contrast dramatic lighting,
energy aura particle effects, low angle dramatic perspective,
[scene: mid-air battle / urban combat / training dojo],
modern shonen production quality, cel shading
```

---

## 四、模型推荐

| 场景 | 推荐 | 备选 | 备注 |
|---|---|---|---|
| 单角色战斗立绘 | seedream | midjourney | seedream 力量感 + 动作张力强 |
| 多角色对战场景 | seedream | kontext | kontext 主体一致备份 |
| 招式特效图 | midjourney | seedream | midjourney 粒子/能量效果美 |
| 漫画分镜风 | seedream | midjourney | 加 `manga panel, comic page` 强化 |
| 跨页震撼图 | midjourney | seedream | midjourney 大场面渲染强 |

**只能用：nano_banana / kling / kontext / openai / midjourney / seedream / qwen**

---

## 五、默认参数（如不指定走这个）

| 参数 | 默认值 | 说明 |
|---|---|---|
| 模型 | seedream | 战斗动作 + 主体一致最强 |
| 比例 | 16:9 战斗 / 2:3 立绘 / 3:4 漫画分镜 | 横构图突出动作 |
| 增强词 | `dynamic action, sharp lineart, speed lines, energy effects, dramatic lighting, JUMP style` | 必带 dynamic 防静态 |
| Negative | `soft moe style, sparkly shojo, cute chibi, soft pastel, painterly, watercolor, low contrast, static pose, extra limbs` | 排除少女/萌系污染 |

---

## 六、角色设计规范（保一致性必读）

不写这些 → 角色第二张就漂移：

- **发型/发色 lock**：必须明确 + 标志性特征（如 `spiky orange hair with bangs`、`silver long ponytail with sharp ends`）
- **眼睛 lock**：颜色 + 形状（多为锐利 + 特殊瞳孔）+ 神态（如 `sharp red eyes with cross-shaped pupils, intense glare`）
- **服装/装备关键元素**：战斗服 + 武器（如 `black combat uniform with red scarf, katana on back`）+ 标志性配饰
- **体型/头身比**：明确 `8-head muscular athletic build` 或 `lean martial artist build`
- **战斗形态/能力可视化**：能量颜色 + 特效形态（如 `golden energy aura, lightning sparks around hands`）
- **是否 i2i 加持**：动作切换必须用 reference image，否则脸型 + 武器都会变

**主体一致性 Lock 详细策略**：发型/发色/眼睛/服装关键元素必须逐条锁定。

---

## 七、易错点（Watch For）

- **画风偏萌系** — 没显式 shonen → 模型默认偏中性萌 → 失去少年向力量感 → 必须 `shonen anime, masculine, sharp angular features`
- **没有动作张力** — 没写 dynamic pose / speed lines → 角色站桩 → 失去战斗感 → 加 `dynamic action pose, speed lines, motion blur`
- **眼睛太柔和** — 默认大圆眼 → 失去锐利眼神 → `sharp intense eyes, narrow piercing gaze`
- **肌肉不够** — 没写 muscular → 模型给瘦弱身材 → 与 shonen 主流不符 → `muscular athletic build, defined musculature`
- **特效色太暗** — 没强调 vivid → 能量效果灰扑 → `vivid bright energy effects, glowing particle vfx`
- **构图太平** — 默认正面平视 → 失去张力 → `low angle dramatic perspective, foreshortening, diagonal composition`
- **混入 shojo 闪光** — 没排除 → 模型加少女向闪粒 → 风格违和 → negative 加 `sparkly shojo, soft pastel, romantic atmosphere`

---

## 配套场景模板（这子风格能干啥用）

| 场景 | 推荐组合 |
|---|---|
| 单人战斗立绘 | seedream + 2:3 + 招式动作 + 能量特效 |
| 多角色对战 | seedream + 16:9 + 对峙构图 + i2i 锁角色 |
| 必杀技分镜 | midjourney + 16:9 + 仰拍 + 大特效 |
| 漫画封面 | seedream + 3:4 + 主角群像 + 速度线背景 |

---

## 配套 reference

本文件是 anime/jp-shonen 子风格特化层。

- 防翻车铁律 → `../iron-laws.md`
- 跨子风格共用规则 → `../cross-substyle-rules.md`
- 默认参数 → `../defaults.md`
- 模型路由 → `../model-routing.md`
