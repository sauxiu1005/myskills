---
name: storyboard-generation
description: |
  用于生成结构化演示幻灯片和多面板电影分镜板的规则与提示词模板。输入是一份幻灯片 brief 或镜头列表；输出是完整渲染好的幻灯片/分镜图，其中图片卡、文字块、时间线条、机位运动叠加图都被框在画面内，排版清晰、光线一致。
  当用户想要生成演示幻灯片、搭建多面板分镜板、制作导演风格镜头卡，或者生成结构化占位空面板时触发。
trigger-words: [分镜板, 分镜生成, 幻灯片生成, 演示幻灯片, 镜头卡, 空面板, 时间线条, storyboard, storyboards, presentation slide, film storyboard, shot card, director storyboard]
allowed-tools: [hub_generate_image, hub_save_file_to_session, question]
---

# 分镜板与演示幻灯片生成

生成完整分镜幻灯片或演示 deck（图片卡、文字块、时间线条、机位运动叠加），画面内容严格框在画布中，排版清晰。

## 工作流

### Step 1 —— 用 `question` 明确交付形态

调用 `question`：
- question："需要哪种幻灯片/分镜？"
- options: [
    "单张演示幻灯片（例如章节封面、对比、Before/After）",
    "多面板电影分镜板（导演风格 + 机位箭头）",
    "占位空面板（结构复用，无角色无内容）"
  ]

再追加一次 `question` 锁死结构化参数：
- question："哪种布局结构和画面比？"
- options: [
    "16:9 幻灯片，2 行 / N 列网格",
    "2.39:1 超宽电影感分镜条",
    "1:1 方形社交卡",
    "自定义 —— 用户描述布局"
  ]

多面板 deck 还要问：
- 行/列数
- 底部是否加时间线条？（是/否 + slow→fast 标签）
- Standard 还是 Extreme 风格幅度

不要静默选默认布局、画面比或风格 —— 烧 credit 前一定用 `question` 确认。

### Step 2 —— 按幻灯片类型挑 vendor

按 slide 类型经 `hub_generate_image` `vendor` 参数路由：

| 幻灯片类型 | 首选 vendor / model | 理由 |
|---|---|---|
| 文字密集（headline、标签、注释） | `vendor: gpt-image` (`model: gpt-image-2`) | 文字可读性最好 |
| 图片卡网格、lifestyle 拼贴 | `vendor: nano-banana` (`model: nano_banana_pro`) | 写实字面布局 |
| 导演风分镜带机位叠加 | `vendor: nano-banana` (`model: nano_banana_pro`) | 结构化 JSON prompt 处理好 |
| 插画风 pitch deck | `vendor: seedream` (`model: seedream_4_5`) | 色彩层次强 |

### Step 3 —— 套用规则构建 prompt

按以下九条规则组装 prompt 字符串：

1. **严格边界内。** Prompt 必须显式写：`"All photo cards fully inside slide boundaries, nothing cropped."` 任何东西都不能被边缘截断。
2. **分辨率与比例。** 用 `aspect_ratio: "16:9"`（或 Step 1 确认的比例）配合 `resolution: "1k"` 或 `"2k"` 传给 `hub_generate_image` 的 params。`1080p` 对幻灯片类图像模型**不合法** —— 永远不要用。
3. **布局定义。** Prompt 正文写清行列结构：`LAYOUT: 2 rows. Row 1: two equal columns (E1 left, E2 right). Row 2: three equal columns (E3, E4, E5)...`
4. **参考对齐。** 复用现有布局时，明确写字体、图标集、卡片样式、背景色。
5. **时间线条。** 长镜头或多场景序列时加：`Timeline bar at very bottom: gradient line from left (slow) to right (fast), labeled [标签].`
6. **一致性。** 光线、时间、环境在面板间保持一致 —— 除非明确对比状态（Before/After）。
7. **复杂分镜板（电影/视频）。** 用结构化 JSON prompt：深炭灰背景 `#1a1a1a`、面板 2px 白边、特定字体标签。青色标机位、黄色斜体标音频、绿色标转场。每个面板下方嵌入结构化数据块（Shot Type / Lens / Camera Path / Audio / Transition）。
8. **机位运动叠加。** 显式让模型把箭头、示意图**直接画在画面里**：`"curved cyan arc arrow showing orbit"`、`"bold downward arrow labeled VERTICAL PLUNGE"`。
9. **空面板。** 结构占位用：`"COMPLETELY EMPTY dark panel — solid dark charcoal background, NO photo, NO person, NO image. Just the dark background with a subtle dark grey rectangle placeholder outline."`

### Step 4 —— 烧 credit 前确认

给用户过一遍：
- Step 3 完整 prompt 字符串
- Step 2 选的 vendor + model
- 画面比 + 分辨率（`1k` 或 `2k`，绝不 `1080p`）
- 行列结构以及是单张还是批量

等用户显式批准后再调生成。

### Step 5 —— 通过 `hub_generate_image` 生成

单张调用：

```
hub_generate_image with:
  vendor: <Step 2>
  model: <Step 2 具体 model id>
  prompt: <Step 3 构建的 prompt>
  aspect_ratio: <Step 1>
  resolution: 1k  # 或 2k —— 绝不 1080p
```

**多面板要求光线一致**时 —— 一次 `hub_generate_image` 批量提交，让模型把它们当成一组处理（防止逐张风格漂移）：

```
hub_generate_image with:
  vendor: <批次内同一 vendor>
  model: <批次内同一 model>
  prompt: <同一 wrapper + 每面板差异>
  aspect_ratio: <批次内同一比例>
  resolution: 1k
  # N 个变体一次提交，模型把它们视作一个 deck
```

### Step 6 —— 把产出注册回 session

每一张返回的图调用 `hub_save_file_to_session`：
- file: <返回的图片路径>
- file_type: image

对于 deck，按顺序（Slide 1 / Slide 2 / ...）把 N 个路径列给用户。

## Hub 适配说明

- 图像生成走 `hub_generate_image`，按幻灯片类型选后端（Nano Banana Pro / GPT Image / Seedream），dispatcher 负责路由。
- 永远不要传 `1080p` —— 传 `1k` 或 `2k`。画面比放到 request params 里，不写在 prompt 文本中。
- 每一张幻灯片/分镜面板生成完用 `hub_save_file_to_session` (`file_type: image`) 注册，让 deck 出现在 workspace 文件面板。
- 多面板 deck 之前，用 `question` 向用户确认行列数、画面比、Standard 或 Extreme 风格幅度，再一次性批量提交。
- 需要多面板光线一致时，用 `hub_generate_image` 一次批量提交，让模型把它们当成一组处理。
