# 05. 吉卜力风 (ghibli)

> **优先质量维度**: Style Authenticity + Atmospheric Mood（手绘媒介感 + 治愈氛围）
> **默认比例**: 16:9（场景插画）/ 4:3（角色场景）
> **核心识别特征**: 水彩背景 + 朴素圆润五官 + 自然光影 + 治愈氛围 — 宫崎骏 / 高畑勋 / 米林宏昌 吉卜力派系

---

## 一、子风格基因清单

> 风格不是"看着像就行",必须可量化、可复现、可教学。
> 核心逻辑：基因 = 水彩手绘 × 朴素圆润 × 自然光 × 茂密植被 × 治愈调。

| # | 基因维度 | 描述 | Prompt 关键词 |
|---|---|---|---|
| 1 | 笔触 | 手绘水彩背景 + 简洁角色 lineart | `Studio Ghibli style, hand-painted watercolor background, simple character lineart` |
| 2 | 配色 | 自然清新、低饱和柔和、绿系/天蓝主导 | `natural soft palette, fresh greens, sky blue, muted earth tones` |
| 3 | 五官比例 | 朴素圆润、大圆眼但不浮夸、小鼻 | `round friendly features, gentle round eyes, soft simple face, miyazaki style face` |
| 4 | 头身比例 | 6-7 头身、孩子角色 4-5 头身 | `6-head friendly proportion, childlike body for kids` |
| 5 | 背景质感 | 茂密自然 / 田园 / 蓝天白云 / 老建筑 | `lush nature scenery, miyazaki landscape, painted clouds, rural countryside` |
| 6 | 光影风格 | 自然柔和日光、暖金色、温暖治愈 | `warm natural sunlight, golden hour glow, soft atmospheric perspective` |

---

## 二、整体风格与质感

| 维度 | 要求 |
|---|---|
| **画风时代** | 经典吉卜力（1985-2014 黄金期：龙猫 / 千与千寻 / 哈尔 / 起风了 路线）|
| **媒介感** | 手绘水彩 + 传统赛璐璐角色合成;**禁止**数字平涂电子感 |
| **配色方案** | 自然清新、绿/蓝/暖黄主导、低饱和但通透 |
| **背景处理** | 极致细节自然环境（树叶/云/草地）+ 水彩晕染感 |
| **光影逻辑** | 自然日光、温暖金色时刻、空气透视、植物斑驳光影 |

---

## 三、Prompt 关键词词典

| 类别 | 关键词组合 |
|---|---|
| **必出基础词** | `Studio Ghibli style, Hayao Miyazaki aesthetic, hand-painted ghibli illustration, miyazaki film style` |
| **角色描绘** | `gentle round face, simple friendly features, modest clothing, miyazaki character design` |
| **画风强化** | `hand-painted watercolor background, soft painterly textures, natural soft lighting, atmospheric perspective` |
| **场景类型** | `lush forest with sunlight filtering through, countryside meadow, european-style cottage, rural town, sky and clouds, summer rural village` |

**完整 prompt 模板（示例）**：
```
Studio Ghibli style illustration, Hayao Miyazaki aesthetic,
[character with simple description: hair color, modest outfit],
gentle round friendly face, miyazaki character design with soft simple features,
hand-painted watercolor background with lush nature details,
warm natural sunlight, golden hour atmospheric perspective,
[scene: countryside meadow / forest path with sunlight rays / european cottage /
summer rural village], painterly soft textures, ghibli film aesthetic,
healing atmosphere, traditional animation feel
```

---

## 四、模型推荐

| 场景 | 推荐 | 备选 | 备注 |
|---|---|---|---|
| 角色 + 自然场景 | midjourney | seedream | midjourney 美学最接近吉卜力 |
| 纯风景画 | midjourney | seedream | midjourney 水彩感 + 云朵渲染强 |
| 角色立绘 | midjourney | seedream | seedream 偏现代日漫，需用 ghibli 关键词强化 |
| 童话奇幻场景 | midjourney | seedream | midjourney 想象力构图强 |
| 治愈日常 | midjourney | seedream | 田园 / 老房子 / 夕阳 |

**只能用：nano_banana / kling / kontext / openai / midjourney / seedream / qwen**

---

## 五、默认参数（如不指定走这个）

| 参数 | 默认值 | 说明 |
|---|---|---|
| 模型 | midjourney | 美学最接近，水彩感强 |
| 比例 | 16:9 风景 / 4:3 场景 / 2:3 立绘 | 横构图突出环境 |
| 增强词 | `Studio Ghibli, Miyazaki, hand-painted, watercolor, natural soft lighting, painterly` | 必带 hand-painted 防数字感 |
| Negative | `digital flat coloring, sharp lineart, cyberpunk, anime moe style, vibrant saturated, glossy 3d, modern anime, sparkly, extra limbs, low quality` | 排除现代日漫和数字感 |

---

## 六、角色设计规范（保一致性必读）

不写这些 → 角色第二张就漂移到现代日漫：

- **发型/发色 lock**：必须**朴素**描述（如 `short brown bob`、`black braids with simple ribbon`），避免现代日漫复杂发型
- **眼睛 lock**：尺寸（中等圆 + 友善）+ 颜色（如 `gentle round brown eyes, friendly expression`），**禁止**写 sparkling / multi-highlight（违和）
- **服装关键元素**：必须**简朴**（如 `simple cotton dress`、`worn travel cloak`、`old-fashioned schoolgirl uniform`），避免华丽蕾丝
- **体型/头身比**：根据角色年龄（成人 6-7 头身、儿童 4-5 头身、老人略矮）
- **气质 lock**：纯朴 / 坚毅 / 善良（吉卜力角色都有内在力量）
- **是否 i2i 加持**：> 1 张图必须 reference + ghibli 关键词重复强调

**主体一致性 Lock 详细策略**：发型/发色/眼睛/服装关键元素必须逐条锁定，保持朴素特征。

---

## 七、易错点（Watch For）

- **太精细电子化** — 没加 `hand-painted, painterly` → 模型给数字精修 → 失去手绘水彩感 → 必须 `hand-painted watercolor background, painterly texture, traditional animation feel`
- **角色画成现代萌系** — 没加 `miyazaki character design` → 模型给大眼闪亮 → 与吉卜力朴素感不符 → 加 `simple round friendly features, modest design, miyazaki style face`
- **配色太鲜艳** — 没控制 → vibrant 跑偏 → 失去自然柔和 → `natural soft palette, muted earthy tones`
- **背景太简单** — 没强调茂密自然 → 失去吉卜力背景丰富感 → `lush detailed nature scenery, every leaf painted, atmospheric perspective`
- **光线太硬** — 默认 dramatic → 失去温暖治愈 → `warm soft natural sunlight, golden hour, gentle atmospheric glow`
- **服装太华丽** — 模型默认精致服装 → 与吉卜力朴素感违和 → `simple modest clothing, worn fabric texture, lived-in look`
- **加了 sparkle 闪粒** — 少女向训练数据污染 → 失去吉卜力质感 → negative 加 `sparkly, anime moe, multi-layer eye highlights`

---

## 配套场景模板（这子风格能干啥用）

| 场景 | 推荐组合 |
|---|---|
| 田园风景 | midjourney + 16:9 + 草地 / 夕阳 / 老房子 |
| 角色 + 自然 | midjourney + 4:3 + 朴素角色 + 茂密背景 |
| 童话奇幻场景 | midjourney + 16:9 + 飞行器 / 神秘森林 / 城堡 |
| 治愈日常 | midjourney + 3:2 + 老厨房 / 雨天窗台 / 火车窗外 |

---

## 配套 reference

本文件是 anime/ghibli 子风格特化层。

- 防翻车铁律 → `../iron-laws.md`
- 跨子风格共用规则 → `../cross-substyle-rules.md`
- 默认参数 → `../defaults.md`
- 模型路由 → `../model-routing.md`
