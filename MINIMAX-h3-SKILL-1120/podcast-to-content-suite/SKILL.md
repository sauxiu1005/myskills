---
name: podcast-to-content-suite
description: |
  把一份播客转录稿转成完整的内容营销套件——SEO 优化的博客、Twitter/X + LinkedIn + Instagram + Facebook 的社交内容、邮件 newsletter、show notes、3-5 个音频卡片脚本，以及 SEO 元素（关键词、meta 标签、schema markup）。输入是带时间戳的播客转录稿，输出是按 `references/output-template.md` 组装的完整跨渠道内容生态。
  当用户提供播客转录稿、要求二次加工播客节目、想把音频转成博客/社交/newsletter 内容、或提到播客营销与分发时触发。
trigger-words: [podcast to content, podcast repurposing, podcast transcript, blog from podcast, show notes, audiogram, podcast marketing, 播客套件, 播客二次加工, podcast distribution]
allowed-tools: [hub_read, hub_write, hub_save_file_to_session, question]
---

# 播客转内容套件

把一集播客转成完整的内容营销生态:博客、社交贴、newsletter、show notes、音频卡片、SEO 元素。

## 内容

- `references/component-specs.md` — 每类产物的需求、最佳实践、示例
- `references/output-template.md` — 完整组装后的输出格式含占位符

## 工作流

### Step 1: 加载 skill 内置 reference
调用 `hub_read` 加载两份 skill 自带的 reference 文件(不要凭记忆改写——模板是输出形态的核心依据):
- file: `references/component-specs.md`
- file: `references/output-template.md`

### Step 2: 定位播客转录稿
判断用户是否附了转录稿。附了就调用 `hub_read`:
- file: `<转录稿路径>`

没附就调用 `question`:
- question: "请提供播客转录稿——workspace 里的文件路径,或直接粘贴。同时告诉我:节目标题、嘉宾姓名、发布日期、目标受众。"

**不要**在 chat 里贴一整片转录稿——读进来,基于已加载内容工作。

### Step 3: 分析转录稿
按 `references/component-specs.md` 第 1 节,识别:
- 主题和子话题
- 5-7 个关键洞见
- 金句
- 数据和统计
- 嘉宾资历
- 目标受众
- 可执行建议
- 主要段落的时间戳(**逐字**保留原转录稿的原始时间)

### Step 4: 写 SEO 优化博客
调用 `hub_write`:
- file: `./blog.md`
- content: 1200-2000 字,H1 带主关键词,meta description,H2/H3 结构,嵌入金句,CTA(按 component-specs 第 2 节)

然后调用 `hub_save_file_to_session`:
- file: `./blog.md`
- file_type: `text`

### Step 5: 写社交内容
调用 `hub_write`:
- file: `./social.md`
- content: Twitter/X 长推 + LinkedIn 帖子 + Instagram caption + Facebook 帖子(按第 3 节)

然后调用 `hub_save_file_to_session`:
- file: `./social.md`
- file_type: `text`

### Step 6: 写邮件 newsletter
调用 `hub_write`:
- file: `./newsletter.md`
- content: 主题行多版本(3-5 个)、preview text、移动端友好正文(按第 4 节)

然后调用 `hub_save_file_to_session`:
- file: `./newsletter.md`
- file_type: `text`

### Step 7: 写 show notes
调用 `hub_write`:
- file: `./show-notes.md`
- content: 摘要、嘉宾简介、逐字保留的时间戳、提到的资源、金句、订阅链接(按第 5 节)

然后调用 `hub_save_file_to_session`:
- file: `./show-notes.md`
- file_type: `text`

### Step 8: 写音频卡片脚本(只写脚本,不做渲染)
调用 `hub_write`:
- file: `./audiograms.md`
- content: 3-5 段,每段 30-60 秒,含逐字时间戳节选 + 屏幕文字(按第 6 节)

然后调用 `hub_save_file_to_session`:
- file: `./audiograms.md`
- file_type: `text`

**不要**尝试渲染音频或视频——本 skill 没有媒体工具。实际音频卡片制作交给用户或下游视频 skill。

### Step 9: 抽取 SEO 元素
调用 `hub_write`:
- file: `./seo.md`
- content: 主/次关键词、meta 标签、schema markup(JSON-LD)、建议内链(按第 7 节)

然后调用 `hub_save_file_to_session`:
- file: `./seo.md`
- file_type: `text`

### Step 10: 组装主索引
按 `references/output-template.md`,生成最终引用上面 6 份文件的组装交付物。

调用 `hub_write`:
- file: `./podcast-suite-index.md`
- content: 严格按模板组装的索引,链接 / 摘要指向 blog.md、social.md、newsletter.md、show-notes.md、audiograms.md、seo.md

然后调用 `hub_save_file_to_session`:
- file: `./podcast-suite-index.md`
- file_type: `text`

## Hub 适配说明

- skill 激活时用 `hub_read` 加载两份 reference(`references/component-specs.md`、`references/output-template.md`);不要凭记忆改写——模板是输出形态的核心依据。
- 用户提供的转录稿用 `hub_read` 读进来(不要在 chat 里贴一整片文本回显)。没附转录稿时用 `question` 追问:要么给文件路径、要么直接粘贴,以及节目标题、嘉宾姓名、发布日期、目标受众。
- 每类产物用 `hub_write` 各自写一份 markdown 文件到当前 project / session workspace(`blog.md`、`social.md`、`newsletter.md`、`show-notes.md`、`audiograms.md`、`seo.md`),再逐一用 `hub_save_file_to_session`(`file_type: text`)注册,让它们出现在 workspace 文件面板供用户编辑。
- 音频卡片交付物**只是脚本**(转录节选 + 时间戳 + 屏幕文字)。不要尝试渲染音频或视频——本 skill 没有媒体工具;实际音频卡片渲染交给用户或下游视频 skill。
- Show notes 和音频卡片脚本里的时间戳必须**逐字保留**原转录稿的原始时间,不要自己造时间。
