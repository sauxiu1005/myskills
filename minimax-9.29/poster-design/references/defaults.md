# 平面设计默认参数

> **何时 read**：用户没明确指定某个参数时按本表默认值出 prompt。每个参数都是「保守安全选择」，不是「最酷最炫」选择——保持 brief 真实意图，不过度发挥。

## 默认比例（按子类型）

| 子类型 | 默认比例 | 像素尺寸（推荐）|
|---|---|---|
| xiaohongshu-cover | **3:4** | 1080×1440 |
| wechat-cover（头图）| **2.35:1** | 900×383 |
| wechat-cover（次条）| **1:1** | 200×200 或 1080×1080 |
| weibo-banner | **16:9** | 1200×675 |
| story-vertical | **9:16** | 1080×1920 |
| movie-poster | **2:3** | 1200×1800 |
| event-poster | **3:4** | 2480×3508（A3/A4 印刷）/ 1080×1440（数字）|
| music-festival-poster | **2:3** 或 **9:16** | 1080×1920 |
| magazine-cover | **3:4** | 1500×2000 |
| book-cover | **2:3** | 1200×1800 |
| album-cover | **1:1** | 1500×1500（流媒体 3000×3000）|
| ad-banner | **16:9** | 1920×1080（网页）/ 1500×750（详情页 2:1）|
| promo-poster | **9:16** 或 **3:4** | 1080×1920 / 1080×1440 |

## 默认字体调性（按子类型）

| 子类型 | 默认调性 |
|---|---|
| xiaohongshu-cover | 活泼可爱（圆润字体）|
| wechat-cover | 商务现代 / 文艺优雅 |
| movie-poster | 视片型而定，无默认（必问用户）|
| event-poster | 商务现代 |
| music-festival-poster | 活泼 / 复古 |
| magazine-cover | 文艺优雅（衬线）|
| book-cover | 文艺优雅 |
| album-cover | 视风格而定，无默认（必问用户）|
| ad-banner | 商务现代 |
| promo-poster | 活泼 / 紧迫感字体 |

## 默认文字渲染策略

| 文字情况 | 默认策略 |
|---|---|
| 全英文 ≤ 6 词 | A 嵌入策略 |
| 中文 ≤ 4 字（艺术化短句）| A 嵌入策略 |
| **中文长句、多段、中英混排** | **B 纯底图策略**（默认）|
| 用户提供模板图 | C 模板替换策略 |

## 默认配色策略

| 场景 | 默认 |
|---|---|
| 用户提供品牌色 hex | 严格执行 |
| 用户未提供 + 商务场景 | 中性色 + 单色强调 |
| 用户未提供 + 节庆 / 促销 | 暖色调（红 / 橙 / 金）|
| 用户未提供 + 文艺 / 杂志 | 莫兰迪 / 低饱和柔和色 |
| 用户未提供 + 科技 / 数码 | 冷色调（蓝 / 紫 / 黑灰）|

## 默认增强词

**核心**：现代模型不需要 SDXL 时代 cargo-cult 词。**默认零增强词**，只描述任务本身

仅在以下条件追加：

- 用户明确指定风格化词（"日落金时刻"、"Wes Anderson 配色"）→ 用户原话 verbatim
- Medium 容易漂（平面设计 prompt 出生活摄影感）→ Medium Lock 句

## 默认 negative

```
busy clutter, hard to read, low contrast, watermark, signature
```

不再默认推 `low quality, blurry, ugly` —— 现代模型不需要被告知「不要低质量」。

## 默认平台尺寸（精确像素）

详见各子类型 `subtypes/{NN}-{name}.md` 的"平台规格"节。

## 配套 reference
> 本文件是参数默认值速查。规则原理走 `iron-laws.md` / `cross-subtype-rules.md`。

- 防翻车铁律 → `iron-laws.md`
- 子类型索引 → `subtypes-index.md`
