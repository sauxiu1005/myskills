# 04. 日漫少女向 (jp-shojo)

> **优先质量维度**: Aesthetic Romance + Character Consistency（浪漫美感 + 角色一致性）
> **默认比例**: 2:3（立绘）/ 3:4（场景插画）
> **核心识别特征**: 闪亮粒子 + 大水汪眼 + 柔光粉调 + 花朵装饰 — 樱兰高校 / 美少女战士 / 果儿 少女向派系

---

## 一、子风格基因清单

> 风格不是"看着像就行",必须可量化、可复现、可教学。
> 核心逻辑：基因 = 柔光粉调 × 闪亮粒子 × 大水汪眼 × 修长比例 × 花朵装饰。

| # | 基因维度 | 描述 | Prompt 关键词 |
|---|---|---|---|
| 1 | 笔触 | 柔和细腻 lineart、避免硬转折 | `soft delicate lineart, refined linework, smooth curves` |
| 2 | 配色 | 粉色 / 薄荷 / 浅紫 / 米白 柔和粉调 | `pastel pink palette, soft mint green, lavender, cream tones` |
| 3 | 五官比例 | 超大水汪眼、樱桃小嘴、尖小下巴 | `huge sparkling watery eyes, cherry lips, delicate pointed chin` |
| 4 | 头身比例 | 7-8 头身修长、四肢纤细 | `7-8 head slender body, delicate slim limbs` |
| 5 | 装饰元素 | 花瓣、星光、蕾丝、丝带 | `floating petals, sparkle particles, lace, ribbons, floral motifs` |
| 6 | 光影风格 | 柔光、bloom 光晕、逆光通透 | `soft diffused lighting, bloom effect, dreamy glow, backlight halo` |

---

## 二、整体风格与质感

| 维度 | 要求 |
|---|---|
| **画风时代** | 现代少女漫主流（2010 后果儿 / 樱兰 / 别冲我笑 路线）|
| **媒介感** | 数字柔光厚涂 + 细腻 cel shading + 大量后期 bloom 效果 |
| **配色方案** | 粉色系主导（樱粉 / 薄荷 / 奶油 / 浅紫）、低对比、高明度 |
| **背景处理** | 虚化柔焦、大量花瓣 / 星光 / 闪粒、梦幻氛围 |
| **光影逻辑** | 柔和漫射光、面颊高光、眼眶 bloom、整体过曝感 |

---

## 三、Prompt 关键词词典

| 类别 | 关键词组合 |
|---|---|
| **必出基础词** | `shojo anime style, dreamy romantic illustration, soft pastel anime, sparkly shojo aesthetic` |
| **角色描绘** | `huge sparkling watery eyes with multi-layer highlights, delicate features, slender 8-head body, flowing long hair` |
| **画风强化** | `soft delicate lineart, dreamy bloom lighting, sparkle particles, floating petals, lace details, romantic atmosphere` |
| **场景类型** | `cherry blossom garden, sunset balcony, vintage tea room, starry night confession, school festival evening` |

**完整 prompt 模板（示例）**：
```
shojo anime style illustration, dreamy romantic aesthetic,
[character with hair/eye/outfit lock], huge sparkling watery eyes with
multi-layer star-shaped highlights, delicate cherry lips, slender 8-head body,
soft delicate lineart, pastel pink palette with mint accents, dreamy bloom
lighting effect, floating sakura petals, sparkle particles around,
[scene: sunset cherry blossom garden / school rooftop confession / starlit balcony],
romantic atmospheric lighting, refined shojo manga production quality
```

---

## 四、模型推荐

| 场景 | 推荐 | 备选 | 备注 |
|---|---|---|---|
| 单角色少女立绘 | seedream | midjourney | seedream 萌系细节强 |
| 双人浪漫场景 | seedream | kontext | kontext 主体保留 |
| 花海背景插画 | midjourney | seedream | midjourney 氛围渲染软美 |
| 表情情绪图 | seedream | nano_banana | 哭/笑/害羞表情 seedream 准 |
| 同人封面 | midjourney | seedream | midjourney 美学梦幻 |

**只能用：nano_banana / kling / kontext / openai / midjourney / seedream / qwen**

---

## 五、默认参数（如不指定走这个）

| 参数 | 默认值 | 说明 |
|---|---|---|
| 模型 | seedream | 主推；midjourney 用于氛围/花海 |
| 比例 | 2:3 立绘 / 3:4 场景 / 1:1 头像 | 竖构图突出修长 |
| 增强词 | `dreamy, sparkle, bloom, soft pastel, romantic, floating petals` | 必带 dreamy 防硬朗 |
| Negative | `harsh lighting, dark moody, sharp masculine features, muscular, gritty, low saturation, photorealistic, extra limbs, low quality` | 排除硬朗/写实风 |

---

## 六、角色设计规范（保一致性必读）

不写这些 → 角色第二张就漂移：

- **发型/发色 lock**：必须详细（如 `waist-length wavy honey-blonde hair with side bangs and ribbon`）+ 强调柔顺
- **眼睛 lock**：颜色 + 大尺寸 + 高光特征（如 `huge sparkling sapphire blue eyes with star-shaped highlights and long lashes`）
- **服装关键元素**：必须细节（蕾丝 / 丝带 / 花朵 / 制服款式如 `frilly white blouse with pink ribbon, layered ruffle skirt`）
- **体型/头身比**：明确 `8-head slender delicate body`，少女向偏修长
- **气质 lock**：温柔 / 活泼 / 高冷 → `gentle expression`、`cheerful smile`、`elegant cool gaze`
- **是否 i2i 加持**：表情/姿势变化必须 reference image，否则五官立刻漂移

**主体一致性 Lock 详细策略**：发型/发色/眼睛/服装关键元素必须逐条锁定。

---

## 七、易错点（Watch For）

- **lineart 太硬** — 没写 `soft delicate lineart` → 模型给锐利线条 → 失去少女细腻感 → 必须 `soft refined linework, smooth delicate lines`
- **眼睛不够大不够亮** — 默认大小 → 失去水汪汪感 → `huge sparkling watery eyes with multi-layer highlights, star-shaped reflections`
- **配色太鲜艳** — 给 vibrant → 失去柔和粉调 → `soft pastel palette, low saturation, dreamy color tones`
- **缺少装饰元素** — 没加花瓣/星光 → 失去梦幻感 → 必须 `floating petals, sparkle particles, dreamy bloom`
- **光太硬** — 没写 soft → 模型给戏剧光 → 失去柔光感 → `soft diffused lighting, dreamy bloom effect, backlight halo`
- **混入 shonen 力量感** — 没排除 → 模型给肌肉 / 锐利 → 风格违和 → negative 加 `muscular, sharp masculine, gritty, harsh shadow`
- **背景过实** — 默认精修 → 失去梦幻虚化 → `soft blurred bokeh background, dreamy depth of field`

---

## 配套场景模板（这子风格能干啥用）

| 场景 | 推荐组合 |
|---|---|
| 少女单人立绘 | seedream + 2:3 + 完整服饰 lock + 闪粒 |
| 双人浪漫互动 | seedream + 3:4 + 害羞表情 + 花瓣飘落 |
| 花海背景插画 | midjourney + 16:9 + 樱花/玫瑰场景 |
| 同人头像/胸像 | seedream + 1:1 + 半身 + 大眼特写 |

---

## 配套 reference

本文件是 anime/jp-shojo 子风格特化层。

- 防翻车铁律 → `../iron-laws.md`
- 跨子风格共用规则 → `../cross-substyle-rules.md`
- 默认参数 → `../defaults.md`
- 模型路由 → `../model-routing.md`
