# 平面设计子类型 → 模型映射

> 模型清单基于团队真实可调能力（截至 2026-04），新增/退役模型时请同步更新。

> **何时 read**：派单选模型时按本表对照——不同子类型有强模型偏好（封面强调艺术性走 midjourney；含文字强调准确走 openai；中文长文案走 qwen 或纯底图）。

## 子类型 → 推荐模型

| 子类型 | 推荐 | 备选 | 备注 |
|---|---|---|---|
| xiaohongshu-cover | midjourney | nano_banana | 美感 + 生活感强项 |
| wechat-cover | midjourney | kontext | 编辑式留白封面 |
| weibo-banner | nano_banana | midjourney | 信息密度高场景 |
| story-vertical | midjourney | nano_banana | 全屏沉浸感 |
| movie-poster | midjourney | nano_banana | 戏剧性主视觉 |
| event-poster（含文字）| openai | qwen | 文字渲染准 |
| event-poster（纯底图）| midjourney | kontext | 美学打底 |
| music-festival-poster | midjourney | nano_banana | 视觉冲击 + 多 lineup |
| magazine-cover | midjourney | kontext | 编辑感 + 高级感 |
| book-cover | midjourney | nano_banana | 概念图像 |
| album-cover | midjourney | kontext | 标志性 + 留中央 |
| ad-banner（含文字）| openai | nano_banana | 商业 + 信息清晰 |
| ad-banner（纯底图）| nano_banana | openai | 信息密集场景 |
| promo-poster（含中文）| qwen | openai | 中文紧迫感字体 |
| promo-poster（纯底图）| nano_banana | midjourney | 紧迫感配色 |
| 国风 / 东方美学（任意子类型）| qwen | midjourney | 中式美学 + 中文 |

## 含文字 vs 纯底图

| 文字情况 | 推荐策略 + 模型 |
|---|---|
| 全英文短句（< 6 词）| openai 直接嵌入 |
| 中文 ≤ 4 字（艺术化）| nano_banana / qwen 直接嵌入 |
| **中文长句、中英混排** | **任意模型走纯底图策略 + 后期加文字** |
| 模板替换文字 | kontext（保版式编辑）|

## 选模型反模式

| 错误 | 后果 |
|---|---|
| 海报艺术性用 nano_banana | 美学一般；应改用 midjourney 出底图 |
| 营销图（信息密集）用 midjourney | 偏艺术 / 信息可读性差；应改用 nano_banana / openai |
| 中文长文案直接渲染（midjourney / seedream / nano_banana） | 错字 / 缺笔画；应走纯底图 + 后期，或用 openai / qwen |
| 强调主体 i2i（人物 / 产品保留）走 t2i | 主体漂移；应改用 nano_banana / kontext + 参考图 |
| 国风海报用纯英文 prompt | 失去中文模型优势；应用 qwen + 中文 prompt |

## 详细模型反模式

跨场景模型能力总览 + 回退链 → `model-knowledge/anti-patterns.md`
Gemini Nano Banana / Gemini-3-image 模型族深度能力卡 → `model-knowledge/nano-banana-family.md`

## 配套 reference
> 本文件是平面设计场景的模型路由层。**取代** `model-knowledge/design.md`（DEPRECATED）。

- 防翻车铁律 → `iron-laws.md`
- 子类型索引 → `subtypes-index.md`
- 默认参数 → `defaults.md`
- 跨场景模型能力总览 → `model-knowledge/anti-patterns.md`
- Nano Banana 工具特定 prompt 框架 → `model-knowledge/nano-banana-family.md`
