# 02. 日漫复古/赛璐璐 (jp-retro)

> **优先质量维度**: Style Authenticity + Texture Fidelity（90s 时代感 + 手绘媒介质感）
> **默认比例**: 4:3（90s 电视动画原生比例）/ 2:3 立绘
> **核心识别特征**: 暖橘色调 + 粗 lineart + 颗粒胶片质感 + 二值化赛璐璐阴影 — 美少女战士/EVA/灌篮高手 90s 怀旧派系

---

## 一、子风格基因清单

> 风格不是"看着像就行",必须可量化、可复现、可教学。
> 核心逻辑：基因 = 手绘赛璐璐 × 暖色调 × 颗粒胶片 × 粗 lineart × 复古五官。

| # | 基因维度 | 描述 | Prompt 关键词 |
|---|---|---|---|
| 1 | 笔触 | 手绘粗 lineart、不规则线条、扫描感 | `hand-drawn lineart, thick irregular lines, traditional cel animation` |
| 2 | 配色 | 暖橘黄棕调、低对比、复古印刷感 | `warm color palette, retro orange tones, muted saturation, vintage print look` |
| 3 | 五官比例 | 较小杏仁眼、尖下巴、细长鼻 | `small almond eyes, sharp chin, defined nose bridge, 90s anime face` |
| 4 | 头身比例 | 7-8 头身偏修长 | `7-8 head body ratio, elongated proportions` |
| 5 | 质感 | 胶片颗粒、扫描痕迹、轻微褪色 | `film grain, slight scan artifacts, vintage faded look` |
| 6 | 光影风格 | 二值化硬阴影、明显赛璐璐分层 | `traditional cel shading, two-tone hard shadow, animation cel layers` |

---

## 二、整体风格与质感

| 维度 | 要求 |
|---|---|
| **画风时代** | 1990-2005 黄金期（美少女战士 / EVA / 灌篮高手 / 棋魂 路线）|
| **媒介感** | 手绘赛璐璐 + 胶片摄影 + 扫描质感;**禁止**数字平涂干净感 |
| **配色方案** | 暖色为主（橘黄/棕红/茶色）、低饱和、印刷感、阴影偏紫 |
| **背景处理** | 手绘水彩背景 + 透视稍弱、城市夜景多用品红霓虹 |
| **光影逻辑** | 二值化硬阴影分层、面光 + 阴影面只有一层中间色 |

---

## 三、Prompt 关键词词典

| 类别 | 关键词组合 |
|---|---|
| **必出基础词** | `90s anime style, retro anime, traditional cel animation, hand-drawn aesthetic, vintage anime` |
| **角色描绘** | `small almond eyes, sharp facial features, 7-head body, period-accurate clothing` |
| **画风强化** | `thick hand-drawn lineart, two-tone cel shading, film grain, slight color fade, scan artifacts` |
| **场景类型** | `90s tokyo cityscape, retro school uniform scene, sunset trainstation, neon night street` |

**完整 prompt 模板（示例）**：
```
90s retro anime style illustration, traditional cel animation aesthetic,
[character description with hair/eye/outfit lock], hand-drawn thick lineart,
two-tone cel shading with hard shadow edges, warm muted color palette with
retro orange and brown tones, subtle film grain texture, slight vintage fade,
[scene: tokyo street 1995 / classroom evening / neon city night],
7-head body proportion, scan artifact texture, vintage anime production look
```

---

## 四、模型推荐

| 场景 | 推荐 | 备选 | 备注 |
|---|---|---|---|
| 单角色立绘 | seedream | midjourney | seedream 加 retro 关键词出片纯 |
| 复古场景背景 | midjourney | seedream | midjourney 美学软适合手绘背景 |
| 角色 + 城市夜景 | midjourney | seedream | midjourney 氛围渲染强 |
| 多角色合影 | seedream | kontext | kontext 备份做主体保留 |
| 老动画截图风 | midjourney | seedream | 加 `vhs screenshot, anime DVD` 强化 |

**只能用：nano_banana / kling / kontext / openai / midjourney / seedream / qwen**

---

## 五、默认参数（如不指定走这个）

| 参数 | 默认值 | 说明 |
|---|---|---|
| 模型 | seedream | 主推；midjourney 备选用于氛围 |
| 比例 | 4:3 / 2:3 | 4:3 还原 90s TV 比例 |
| 增强词 | `90s anime, hand-drawn, film grain, warm retro palette, vintage` | 必带 vintage 防数字感 |
| Negative | `modern anime, digital flat coloring, 3d render, photorealistic, glossy finish, hd polished, extra limbs, low quality` | 排除现代清洁感 |

---

## 六、角色设计规范（保一致性必读）

不写这些 → 角色第二张就漂移到现代风：

- **发型/发色 lock**：必须明确 + 标注复古特征（如 `1990s style permed brown hair`、`90s long straight black hair with hime cut bangs`）
- **眼睛 lock**：尺寸（`small to medium almond eyes`）+ 颜色 + 形状（杏 vs 三白眼）
- **服装关键元素**：必须写明时代特征（如 `90s sailor uniform`、`retro highschool blazer`、`vintage denim jacket`）
- **体型/头身比**：明确写 `7-8 head elongated body`，复古风偏修长
- **是否 i2i 加持**：> 1 张图必须用 reference + 关键词重复强调 retro

**主体一致性 Lock 详细策略**：发型/发色/眼睛/服装关键元素必须逐条锁定，并标注复古特征。

---

## 七、易错点（Watch For）

- **数字感太强** — 没加 `hand-drawn, film grain` → 模型默认现代数字平涂 → 失去 90s 怀旧 → 必须 `traditional cel animation, hand-drawn lineart, film grain`
- **眼睛画太大** — 现代日漫训练数据污染 → 萌系大眼跑出 → 与 90s 杏仁眼不符 → 加 `small almond eyes, 90s style face`
- **配色太鲜艳** — 没控制饱和度 → 模型给 vibrant → 失去复古暖色感 → `muted warm palette, retro brown orange tones, low saturation`
- **lineart 太细** — 没限制 → 模型给精细数字线 → 失去手绘粗线感 → `thick irregular hand-drawn lineart`
- **背景太精致** — 模型默认精修高清 → 失去手绘水彩感 → `painted watercolor background, soft edges, traditional animation background`
- **混入 modern shading** — 多层柔和 shading → 失去赛璐璐二值化 → `hard two-tone cel shadow, no gradient shading`
- **服装时代错乱** — 没标年代 → 模型给现代潮服 → 时空错位 → 必须 `90s period-accurate clothing`

---

## 配套场景模板（这子风格能干啥用）

| 场景 | 推荐组合 |
|---|---|
| 90s 怀旧立绘 | seedream + 2:3 + 复古服装 lock + 胶片颗粒 |
| 复古城市夜景 | midjourney + 16:9 + 霓虹/品红/夕阳 |
| 老番截图风 | midjourney + 4:3 + `vhs screenshot, anime DVD cap` |
| 同人复古海报 | midjourney + 2:3 + 大色块 + 复古字体留白 |
| 复古乐队/演唱会 | seedream + 16:9 + 90s 服装 + 舞台灯 |
| EVA 风机甲 | midjourney + 2:3 + 暗色系 + 机械细节 |

---

## 配套 reference

本文件是 anime/jp-retro 子风格特化层。

- 防翻车铁律 → `../iron-laws.md`
- 跨子风格共用规则 → `../cross-substyle-rules.md`
- 默认参数 → `../defaults.md`
- 模型路由 → `../model-routing.md`
