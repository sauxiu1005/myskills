# 06. 新海诚风 (shinkai)

> **优先质量维度**: Atmospheric Mood + Color Saturation（光线氛围 + 高饱和天空）
> **默认比例**: 16:9（标志性宽屏）/ 21:9（电影感）
> **核心识别特征**: 高饱和天空 + 镜头光斑 + 城市黄昏 + 极致云朵渲染 — 你的名字 / 言叶之庭 / 天气之子 派系

---

## 一、子风格基因清单

> 风格不是"看着像就行",必须可量化、可复现、可教学。
> 核心逻辑：基因 = 高饱和天空 × 镜头光斑 × 极致云朵 × 城市黄昏 × 玻璃感反射。

| # | 基因维度 | 描述 | Prompt 关键词 |
|---|---|---|---|
| 1 | 笔触 | 数字精致背景 + cel shading 人物 | `Makoto Shinkai style, cinematic anime background, detailed digital painting` |
| 2 | 配色 | 极致高饱和、橙紫粉天空、补色对比 | `hyper saturated colors, magenta orange sky, complementary contrast, dramatic palette` |
| 3 | 天空云朵 | 极致写实云朵 + 渐变天空 | `volumetric clouds, dramatic gradient sky, painterly cumulus, hyper detailed sky` |
| 4 | 光线特效 | 镜头光斑、丁达尔光、粒子尘埃 | `lens flare, god rays, light particles, dust in sunbeams, anamorphic flare` |
| 5 | 反射质感 | 玻璃 / 雨水 / 水面 极致反射 | `glossy reflections, wet asphalt reflections, glass refractions, water surface` |
| 6 | 场景氛围 | 城市黄昏 / 雨后 / 星空 / 通勤 | `tokyo cityscape sunset, rainy urban streets, starry night, train commute scene` |

---

## 二、整体风格与质感

| 维度 | 要求 |
|---|---|
| **画风时代** | 现代新海诚（2013 后言叶之庭 / 君名 / 天气之子 / 铃芽 路线）|
| **媒介感** | 数字精修 + cel shading 人物 + 极致背景渲染 |
| **配色方案** | 高饱和橙紫粉、强补色对比、低对比度细节区域 |
| **背景处理** | 极致细节城市 / 自然 + 戏剧化天空 + 大量光效叠加 |
| **光影逻辑** | 黄金时刻 / 蓝调时刻、强镜头光斑、丁达尔光、空气感 |

---

## 三、Prompt 关键词词典

| 类别 | 关键词组合 |
|---|---|
| **必出基础词** | `Makoto Shinkai style, cinematic anime, your name aesthetic, hyper detailed background painting` |
| **角色描绘** | `cel shaded anime character, modern realistic proportions, detailed skin tones, contemplative pose` |
| **画风强化** | `hyper saturated dramatic sky, volumetric clouds, lens flare, god rays, light particles, glossy reflections` |
| **场景类型** | `tokyo sunset cityscape, rainy shibuya intersection, suburban train tracks at golden hour, starry rural sky, school rooftop sunset` |

**完整 prompt 模板（示例）**：
```
Makoto Shinkai style cinematic illustration, your name aesthetic,
[character: simple description, contemplative or wistful pose],
hyper detailed digital painting background, volumetric dramatic clouds,
hyper saturated magenta orange purple sunset sky, strong cinematic lens flare,
god rays through atmosphere, dust particles in sunbeams, glossy reflective surfaces,
[scene: tokyo cityscape golden hour / rainy urban intersection /
suburban train crossing / school rooftop sunset], 16:9 cinematic composition,
shinkai film production quality, atmospheric perspective, melancholic mood
```

---

## 四、模型推荐

| 场景 | 推荐 | 备选 | 备注 |
|---|---|---|---|
| 城市黄昏风景 | midjourney | seedream | midjourney 天空 + 光效渲染最强 |
| 角色 + 城市背景 | midjourney | seedream | midjourney 氛围一气呵成 |
| 雨天/水面反射 | midjourney | seedream | midjourney 反射质感细腻 |
| 星空夜景 | midjourney | seedream | midjourney 星空粒子感强 |
| 单角色立绘 | seedream | midjourney | seedream 主体一致 + 强氛围词 |

**只能用：nano_banana / kling / kontext / openai / midjourney / seedream / qwen**

---

## 五、默认参数（如不指定走这个）

| 参数 | 默认值 | 说明 |
|---|---|---|
| 模型 | midjourney | 美学 + 光效最接近新海诚 |
| 比例 | 16:9 / 21:9 | 电影宽屏标志比例 |
| 增强词 | `Makoto Shinkai, hyper saturated sky, volumetric clouds, lens flare, cinematic` | 必带 hyper saturated 防平淡 |
| Negative | `flat dull colors, low contrast, washed out, simple background, ghibli watercolor, flat sky, no lens flare, low detail, extra limbs, low quality` | 排除平淡和吉卜力混淆 |

---

## 六、角色设计规范（保一致性必读）

不写这些 → 角色变成普通日漫，失去新海诚电影感：

- **发型/发色 lock**：现代写实风（如 `short black hair with side bangs, neat schoolboy cut`），避免夸张造型
- **眼睛 lock**：相对写实比例 + 颜色 + 沉思感（如 `realistic-proportioned dark eyes with soft highlight, contemplative gaze`）
- **服装关键元素**：现代制服 / 都市穿搭（如 `japanese highschool uniform navy blazer, white shirt, plaid skirt`）
- **体型/头身比**：现代写实 7-7.5 头身（新海诚比例较真实）
- **气质 lock**：沉思 / 怀念 / 仰望 / 通勤（新海诚标志情绪）
- **强调环境占比**：人物在画面中占比 30% 以下，背景 + 天空才是主角
- **是否 i2i 加持**：角色多镜头必须 reference

**主体一致性 Lock 详细策略**：发型/发色/眼睛/服装关键元素必须逐条锁定，保持现代写实风格。

---

## 七、易错点（Watch For）

- **天空太平淡** — 没写 `hyper saturated sky` → 模型给普通天空 → 失去新海诚标志 → 必须 `hyper saturated dramatic magenta orange sky, volumetric clouds`
- **没有镜头光斑** — 没加 `lens flare` → 失去电影感 → 必须 `cinematic lens flare, god rays, anamorphic flare`
- **配色变莫兰迪** — 没强调饱和 → 模型给低饱和 → 失去鲜艳冲击 → `hyper saturated, vivid complementary contrast`
- **混入吉卜力水彩** — 没排除 → 模型给手绘感 → 风格违和 → negative 加 `ghibli watercolor, hand-painted soft, flat sky`
- **背景细节不够** — 没加 hyper detailed → 失去新海诚极致背景 → `hyper detailed background painting, every window rendered`
- **角色比例失调** — 模型给传统大眼 → 失去新海诚相对写实感 → `realistic anime proportions, modern shinkai character design`
- **缺反射质感** — 雨/水场景没强调 → 失去湿润感 → `glossy wet asphalt reflections, water surface refractions`

---

## 配套场景模板（这子风格能干啥用）

| 场景 | 推荐组合 |
|---|---|
| 城市黄昏 | midjourney + 21:9 + 高饱和橙紫天 + 光斑 |
| 雨夜街景 | midjourney + 16:9 + 霓虹反射 + 雨滴粒子 |
| 仰望星空 | midjourney + 16:9 + 银河 + 光粒 |
| 通勤场景 | midjourney + 16:9 + 月台/电车窗外 + 黄金时刻 |

---

## 配套 reference

本文件是 anime/shinkai 子风格特化层。

- 防翻车铁律 → `../iron-laws.md`
- 跨子风格共用规则 → `../cross-substyle-rules.md`
- 默认参数 → `../defaults.md`
- 模型路由 → `../model-routing.md`
