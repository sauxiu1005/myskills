# 二次元/动漫默认参数

> **何时 read**：用户没明确指定某个参数时按本表默认值出 prompt。每个参数都是「保守安全选择」，不是「最酷最炫」选择——保持 brief 真实意图，不过度发挥。

## 默认比例（按子风格）

| slug | 默认比例 | 像素尺寸（推荐）| 备注 |
|---|---|---|---|
| jp-modern | **9:16** / 1:1 | 1080×1920 / 1080×1080 | 立绘走竖屏；社媒头像 1:1 |
| jp-retro | **4:3** / 16:9 | 1024×768 / 1920×1080 | 复刻 90s 番剧画面比例 |
| jp-shonen | **2:3** / 16:9 | 1200×1800 / 1920×1080 | 立绘 2:3；战斗分镜 16:9 |
| jp-shojo | **9:16** / 2:3 | 1080×1920 / 1200×1800 | 少女漫单页竖版 |
| ghibli | **16:9** / 3:2 | 1920×1080 / 1500×1000 | 风景插画走横版 |
| shinkai | **16:9** / 21:9 | 1920×1080 / 2560×1080 | 城市天空全景 |
| cn-xianxia | **2:3** / 9:16 | 1200×1800 / 1080×1920 | 仙侠立绘走竖版长画 |
| cn-modern | **9:16** / 1:1 | 1080×1920 / 1080×1080 | 现代国漫海报立绘 |
| cn-3d-fantasy | **16:9** / 2:3 | 1920×1080 / 1200×1800 | CG 场景 16:9；角色卡 2:3 |
| kr-webtoon | **9:16**（强制竖屏）| 800×1200 单格 / 800×6000 长图 | webtoon 必须竖版 |
| kr-paint | **2:3** / 9:16 | 1200×1800 / 1080×1920 | 角色卡比例 |
| us-cartoon | **16:9** / 1:1 | 1920×1080 / 1080×1080 | Pixar 海报 16:9；周边 1:1 |
| q-version | **1:1** / 4:5 | 1080×1080 / 1080×1350 | 表情包 1:1；周边稍长 4:5 |
| cyberpunk | **2:3** / 16:9 | 1200×1800 / 1920×1080 | 角色卡 2:3；场景 16:9 |

## 默认笔触特征（按子风格）

| slug | 笔触类型 | 关键描述词 |
|---|---|---|
| jp-modern | cel shading | `clean lineart, flat cel shading, glossy highlights` |
| jp-retro | cel shading + grain | `hand-drawn cel animation, slight film grain, thicker lineart` |
| jp-shonen | cel shading + dynamic | `dynamic lineart, speed lines, dramatic hard-edge shadows` |
| jp-shojo | smooth gradient | `soft gradient shading, sparkles bokeh, dreamy glow` |
| ghibli | watercolor | `watercolor background, soft pencil lineart, painterly natural elements` |
| shinkai | smooth + light particles | `hyper-detailed smooth shading, lens flare, light particles, atmospheric perspective` |
| cn-xianxia | ink wash + cel | `ink wash painting elements, calligraphic brushwork, ethereal mist` |
| cn-modern | flat | `flat design, clean geometric shapes, bold solid colors` |
| cn-3d-fantasy | 3D render | `cinematic 3D render, Unreal Engine, volumetric lighting, subsurface scattering` |
| kr-webtoon | smooth gradient + sharp lineart | `smooth gradient shading, sharp clean lineart, semi-realistic features` |
| kr-paint | painterly thick | `thick painterly brushstrokes, oil painting texture, visible brush marks` |
| us-cartoon | smooth 3D-like | `smooth Pixar-like shading, exaggerated proportions, vibrant palette` |
| q-version | flat + simple lineart | `simple clean lineart, flat colors, minimal shading, kawaii style` |
| cyberpunk | cel + neon glow | `cel shading with neon glow, cybernetic detail, holographic accents` |

## 默认配色策略（按子风格）

| slug | 配色基调 |
|---|---|
| jp-modern | 高饱和 vibrant，多用粉/蓝/黄/紫鲜艳色 |
| jp-retro | 暖黄 + 砖红 + 复古绿，整体偏低饱和 |
| jp-shonen | 高对比 + 主角色调（火红/电蓝/金黄）+ 黑色阴影强烈 |
| jp-shojo | 柔粉 + 浅蓝 + 米白 + 闪光金，低饱和柔和 |
| ghibli | 自然色（草绿、天蓝、土棕、奶白），低饱和柔和 |
| shinkai | 高饱和天蓝 + 橙紫晚霞 + 霓虹点缀，明暗对比强 |
| cn-xianxia | 水墨黑白 + 朱砂红 + 青绿点缀，留白多 |
| cn-modern | 明亮饱和（中国红 / 国潮绿 / 鎏金黄）+ 几何撞色 |
| cn-3d-fantasy | 暗系奇幻（紫黑 + 金 + 火红）+ 高光特效 |
| kr-webtoon | 接近写实柔和（米色肌肤 + 真实服装色）|
| kr-paint | 厚重油画色（暗红 / 墨绿 / 金棕），戏剧性 |
| us-cartoon | 明亮饱和原色（红黄蓝鲜明），Pixar 配色 |
| q-version | 糖果色（粉 / 浅蓝 / 奶黄），高饱和柔和 |
| cyberpunk | 霓虹（粉紫 + 青蓝 + 黑底），强对比 |

## 默认增强词（极简策略）

**核心**：现代模型不需要 SDXL 时代 cargo-cult 词。**默认零通用增强词**（不写 `masterpiece, best quality, 8k`），只描述任务本身 + 子风格关键词。

仅在以下条件追加：

- 用户明确指定艺术家 / 工作室风格（"宫崎骏风"、"新海诚风"）→ 用户原话 verbatim
- Medium 容易漂（萌系 prompt 跑成写实）→ 加 anti-drift Lock 句（`stylized 2D anime illustration, NOT photorealistic`）
- 子风格独有需求（cyberpunk 必须 `neon glow`，ghibli 必须 `watercolor`）→ 见上表笔触关键词

## 默认 negative（按子风格）

**通用 base negative**（所有子风格挂载）：

```
realistic photo, photography, photorealistic, real human face,
distorted face, mutated face, asymmetric eyes, cross-eyed,
extra limbs, extra fingers, malformed hands, bad anatomy,
low quality, amateur sketch, watermark, signature
```

**子风格额外 negative**：

| slug | 追加 negative |
|---|---|
| jp-modern / jp-shojo / q-version | `3d render, ugly, dull colors` |
| jp-retro | `4k digital, modern shading, hyper-detailed` |
| ghibli / shinkai | `cel shading hard edges, sharp digital lineart` |
| cn-xianxia | `western fantasy, gothic, japanese kimono` |
| cn-3d-fantasy | `flat 2D, sketch lineart, low-poly` |
| kr-webtoon / kr-paint | `chibi, super deformed, big head small body` |
| cyberpunk | `medieval, traditional, daytime bright sunlight` |
| us-cartoon | `anime style, manga lineart, japanese aesthetic` |

## 默认平台尺寸（精确像素）

详见各子风格 `substyles/{NN}-{slug}.md` 的"平台规格"节。

## 配套 reference

本文件是参数默认值速查。规则原理走 `iron-laws.md` / `cross-substyle-rules.md`。

- 防翻车铁律 → `iron-laws.md`
- 子风格索引 → `substyles-index.md`
- 跨子风格共用规则 → `cross-substyle-rules.md`
- 子风格 → 模型映射 → `model-routing.md`
