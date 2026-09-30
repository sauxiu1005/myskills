# 平面设计 12 子类型索引

> **何时 read**：开始 brief 时第一件事——判断本任务属于 4 大场景下的哪个子类型。
> **每个子类型详细 playbook** 见 `subtypes/{NN}-{name}.md`。

## 4 大场景 + 12 子类型一览

> **路径约定**：所有 file 路径相对本文件所在目录（`references/`）。Step 1 深读时直接 `Read references/subtypes/{NN}-{slug}.md`，不要再做"小红书封面 → 01 → xiaohongshu-cover"的二次推断。

| # | slug | file | 场景 | 默认比例 | 优先维度 | 核心驱动 |
|---|---|---|---|---|---|---|
| 01 | xiaohongshu-cover | `subtypes/01-xiaohongshu-cover.md` | 社媒 | 3:4 | Visual + Engagement | 首屏吸引力 + 生活感 + 大字标题 |
| 02 | wechat-cover | `subtypes/02-wechat-cover.md` | 社媒 | 2.35:1（头图）/ 1:1（次条）| Editorial + Brand | 高级感 + 留白多 + 标题字位规范 |
| 03 | weibo-banner | `subtypes/03-weibo-banner.md` | 社媒 | 16:9 | Engagement + Information | 信息密度可高 + 配图叙事 |
| 04 | story-vertical | `subtypes/04-story-vertical.md` | 社媒 | 9:16 | Visual + Mobile-first | 全屏沉浸 + 大字标题 |
| 05 | movie-poster | `subtypes/05-movie-poster.md` | 海报 | 2:3 | Cinematic + Visual | 戏剧性主视觉 + 标题字位规范 |
| 06 | event-poster | `subtypes/06-event-poster.md` | 海报 | 3:4（A3/A4）/ 9:16 | Information + Visual | 主视觉 + 时间地点信息层级 |
| 07 | music-festival-poster | `subtypes/07-music-festival-poster.md` | 海报 | 2:3 / 9:16 | Energetic + Information | lineup 排版 + 视觉冲击力 |
| 08 | magazine-cover | `subtypes/08-magazine-cover.md` | 封面 | 3:4 | Editorial + Typography | 标题字处理是核心 + 人物视线 |
| 09 | book-cover | `subtypes/09-book-cover.md` | 封面 | 2:3 | Conceptual + Typography | 概念图像 + 标题字 + 作者署名 |
| 10 | album-cover | `subtypes/10-album-cover.md` | 封面 | 1:1 | Iconic + Memorable | 主体居中 + 唱片标签位 |
| 11 | ad-banner | `subtypes/11-ad-banner.md` | 营销 | 16:9 / 21:9 | Conversion + Clarity | 产品突出 + 卖点文案 + CTA 区 |
| 12 | promo-poster | `subtypes/12-promo-poster.md` | 营销 | 9:16 / 3:4 | Urgency + Conversion | 折扣字号大 + 倒计时 + 紧迫感 |

## 子类型选择决策树

```
用户描述 → 关键词识别
├── "海报 / poster / 电影 / 活动 / 音乐节" → 05 / 06 / 07
├── "封面 / cover / 杂志 / 书籍 / 专辑 / 视频封面" → 08 / 09 / 10
├── "公众号 / 小红书 / 微博 / Story / 朋友圈 / IG" → 01-04
├── "卖点图 / 活动 banner / 促销 / 双 11 / 广告" → 11 / 12
├── 跨场景模糊（"做个海报推广产品"）→ AskUserQuestion 确认主用途（Iron Law Meta-1）
└── 多场景需求 → 确认主场景，其他派生（"按主场景做，再裁切适配其他"）
```

## 进入深度策划时

各子类型 playbook 的完整路径见上方索引表 file 列。每个 playbook 含必出元素 / 风格质感 / 版式构图 / 信息层级 / 文字策略 / 必填项 / 易错点。

跨子类型共用规则与必填项原则见 `cross-subtype-rules.md`。

## 配套 reference
- 防翻车铁律（开始 brief 前必读）→ `iron-laws.md`
- 默认参数（比例 / 字体调性 / 配色）→ `defaults.md`
- 子类型 → 模型映射 → `model-routing.md`
- 速查（开始 brief 时高密度判断）→ `subtypes-quick-ref.md`
