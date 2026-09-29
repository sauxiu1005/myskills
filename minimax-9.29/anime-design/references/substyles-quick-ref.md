# 二次元 14 子风格要点速查（高密度）

> **何时 read**：开始 brief 时快速判断本子风格的推荐模型 + 关键 prompt 词 + 高危雷区。详细 playbook 走 `substyles/{NN}-{slug}.md`。

| slug | 推荐模型 | 关键 prompt 词 | 高危雷区 |
|---|---|---|---|
| **jp-modern** | seedream | `modern anime style, vibrant colors, detailed eyes, glossy hair highlights, cel shading, clean lineart` | 五官跑写实；眼睛过小（应占面 1/3）；颜色发灰（萌系要饱和）|
| **jp-retro** | seedream | `90s anime aesthetic, hand-drawn cel animation, warm color palette, slight film grain, retro shading` | 出现 4K 数字感（破坏复古）；颜色过艳；线稿过细（90s 是粗线）|
| **jp-shonen** | seedream | `shonen anime style, dynamic action lines, speed effects, intense expression, sharp angular features, dramatic shading` | 力量感不足；缺动感线；表情温吞（应该咬牙瞪眼）|
| **jp-shojo** | midjourney | `shojo manga style, soft pastel colors, sparkles bokeh, romantic atmosphere, large dewy eyes, flowing hair` | 配色过冷；缺闪光粒子；眼睛干涩（应水汪汪带高光）|
| **ghibli** | midjourney | `Studio Ghibli style, Hayao Miyazaki aesthetic, watercolor background, soft natural lighting, lush nature, whimsical, healing atmosphere` | 笔触过锐利（应水彩柔）；色彩过饱和；缺自然元素 |
| **shinkai** | midjourney | `Makoto Shinkai style, hyper-saturated sky, light particles, lens flare, urban skyline, cinematic atmosphere` | 天空缺层次；光线粒子缺；构图普通无电影感 |
| **cn-xianxia** | qwen | `Chinese xianxia style, hanfu clothing, ink wash painting elements, ethereal mist, traditional Chinese aesthetic, flowing sleeves, jade ornaments` | 服饰跑日式和服；缺水墨笔触；背景过西式 |
| **cn-modern** | seedream | `modern Chinese illustration, flat design, geometric shapes, bright bold colors, contemporary urban` | 跑成日漫现代风；缺中式元素细节；扁平设计画成立体 |
| **cn-3d-fantasy** | kling | `Chinese 3D fantasy, cinematic 3D render, Unreal Engine, volumetric lighting, particle effects, fantasy armor, mythical creatures` | 跑成 2D（必须明确 3D render）；光效平淡；建模粗糙 |
| **kr-webtoon** | seedream | `Korean webtoon style, manhwa aesthetic, realistic body proportions (7-8 heads), smooth gradient shading, sharp clean lineart, vertical composition` | 头身比错（不是萌系 5 头身）；眼睛过大（应接近写实）；构图非竖版 |
| **kr-paint** | midjourney | `Korean illustration painterly style, thick painterly brushstrokes, oil painting texture, dramatic lighting, semi-realistic anime face` | 缺笔触肌理；过于干净（应有刷痕）；五官跑萌系 |
| **us-cartoon** | midjourney | `Western cartoon style, Disney-Pixar aesthetic, expressive exaggerated features, vibrant palette, smooth 3D-like shading` | 跑成日漫脸；缺夸张表情；配色暗（应明亮饱和）|
| **q-version** | seedream | `chibi style, super deformed (SD), Q-version, 3-head proportion, big head small body, exaggerated expression, kawaii, simple clean lineart` | 头身比超过 3（要 2-3 头身）；表情不夸张；脚画得太具体（chibi 脚要圆萌）|
| **cyberpunk** | midjourney | `cyberpunk anime, neon-lit cityscape, holographic UI, futuristic mecha, cybernetic implants, rain-soaked streets, bladerunner atmosphere` | 缺霓虹光效；环境平淡（应雨夜 / 霓虹 / 蒸汽）；机甲设计陈旧 |

## 进入深度策划时

详细子风格 playbook 见各专门文件：

`substyles/01-jp-modern.md` / `02-jp-retro.md` / `03-jp-shonen.md` / `04-jp-shojo.md` / `05-ghibli.md` / `06-shinkai.md` / `07-cn-xianxia.md` / `08-cn-modern.md` / `09-cn-3d-fantasy.md` / `10-kr-webtoon.md` / `11-kr-paint.md` / `12-us-cartoon.md` / `13-q-version.md` / `14-cyberpunk.md`

跨子风格共用规则见 `cross-substyle-rules.md`。

## 配套 skill / reference

> 本文件是子风格决策速查，深度规划走 substyles/ 下对应文件。

- 子风格完整索引 + 决策树 → `substyles-index.md`
- 防翻车铁律 → `iron-laws.md`
- 跨子风格共用规则 → `cross-substyle-rules.md`
- 子风格 → 模型映射 → `model-routing.md`
