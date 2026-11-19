---
name: podcast-marketing
description: |
  端到端做播客的规划、制作和营销，把播客当增长渠道运营。覆盖概念/形式选择、访谈与独白集的结构、音频质量要求、嘉宾寻找与外联、SEO 优化的 shownote、从启动到规模化的增长策略，以及变现模型。输入是播客概念或已有节目；输出是完整策略文档、嘉宾外联文案或推广 checklist。
  当用户想启动播客、规划播客策略、跑嘉宾外联、写 shownote、增长播客受众，或者给已有节目做变现时触发。
trigger-words: [播客营销, 播客策略, 播客启动, 嘉宾外联, shownote, 播客增长, 播客变现, podcast strategy, launch podcast, podcast marketing, guest outreach, show notes]
allowed-tools: [question, hub_write, hub_save_file_to_session]
---

# 播客营销 Skill

播客制作与营销专家。协助规划、制作、把播客养成营销渠道。**纯文本产物 —— 不在 Hub 内做任何音频工作**。

## 工作流

### Step 1: 判断需求范围
先推断用户到底想要什么。三种常见入口：

- **新节目的完整策略** —— 走 Step 2-6 全流程
- **只要嘉宾外联文案** —— 直接跳 Step 4
- **单集 shownote** —— 直接跳 Step 5

含糊时用一次 `question` 问："你是要规划新节目、跑外联、还是给已有节目写 shownote？"

### Step 2: 收集节目上下文（一次性打包 `question`）
**不要**一条条问。用一次 `question` 把六项一起问齐，策略动笔前上下文吃全：

1. **niche** —— 具体话题
2. **目标听众** —— 是谁、关心什么
3. **形式** —— 访谈 / 独白 / 圆桌 / 叙事
4. **时长 + 频率** —— 每集多少分钟，周更 / 双周更 / 月更
5. **资源预算** —— 设备档次、剪辑能力、嘉宾寻找预算
6. **主目标** —— 流量、线索、品牌权威、社群、变现

### Step 3: 设计策略文档
内部按下面的框架组装：

- **单集结构** —— 从访谈或独白模板里挑
- **音频质量基线** —— 匹配预算
- **嘉宾 wishlist** —— 10-20 个名字 + 联络路径
- **启动计划** —— 前 8 集、开播日推广、评价获取
- **增长计划** —— 3 个月 + 6 个月节奏，挂钩 "增长策略" 表
- **变现路线图** —— 挂钩预期下载量

### Step 4: 落地策略文档
调 `hub_write` 把策略保存到 workspace 文件（例如 `./strategy.md`），用本 skill 底部的输出模板。

再对该文件调 `hub_save_file_to_session`，`file_type: text`，用户可 pin 住并传给下游 skill（如 `content-repurposing`、`copywriting`）。

### Step 5: 落地外联 + shownote 模板
每个用户要的产物：先 `hub_write` 落文件，再 `hub_save_file_to_session`（`file_type: text`）：

- `./outreach-template.md` —— 填入节目实际指标 + 名人嘉宾名
- `./show-notes-template.md` —— 填入节目实际形式
- `./promotion-checklist.md` —— 单集任务清单

回复里同时以 ready-to-copy 代码块的形式返回每份内容，落盘之外还给用户直接看得到。

### Step 6: 标出 Hub 外的交接项
只出文本。**不要**尝试调外部工具。用户问到时指路：

- 音频录制 / 剪辑 / TTS / 语音克隆 → 引导去 `hub_audio_generation` 或专属音频 skill；本 skill 不调
- 转写 → `hub_audio_transcribe_lyrics` 或专属转写 skill
- 邮件发送 / CRM 推送 → 用户自己的工具；不要尝试代发

---

## 播客作为营销

播客跟其他营销渠道玩法不同：

- **长内容建立信任** — 每集 30-60 分钟专注注意力
- **关系引擎** — 嘉宾会变成拥趸、合作方、客户
- **内容倍增器** — 每集能拆成 10-20 条内容（见 content-repurposing skill）
- **SEO 价值** — 逐字稿和 shownote 会命中长尾关键词

## 单集结构

### 访谈形式（营销最常用）

```
0:00-1:00   Cold open（本集最好的引言片段做预热）
1:00-3:00   Intro（主题曲、主播开场、本集概览）
3:00-5:00   嘉宾介绍（履历、资质、背景）
5:00-25:00  正题讨论（3-4 个核心问题）
25:00-35:00 深挖（"意外" 或 "有争议" 的段落）
35:00-40:00 闪电轮 / 快问快答
40:00-42:00 嘉宾 CTA + 去哪里找他
42:00-43:00 Outro（回顾、下集预告、订阅 CTA）
```

### 独白形式

```
0:00-0:30   Hook（你会学到什么、为什么"现在"重要）
0:30-2:00   Context（问题或情境）
2:00-12:00  正文（3-5 个要点、故事、案例）
12:00-14:00 总结 + 行动项
14:00-15:00 CTA（订阅、评价、分享）
```

## 音频质量要点

| 环节 | 最低 | 推荐 |
|------|------|------|
| 麦克风 | USB 麦（$50+） | XLR + 声卡（$150+） |
| 环境 | 安静房间、柔软表面 | 声学处理过的空间 / 衣柜 |
| 录音 | Audacity（免费） | Descript、Riverside、Squadcast |
| 托管 | Anchor（免费） | Transistor、Buzzsprout、Captivate |
| 后期 | 降噪、响度归一 | 专业剪辑 |

**规则**：

- 用 WAV/AIFF 录音，不用 MP3（交付前才压）
- 响度 -16 到 -12 LUFS 之间
- 剪掉长停顿、口头禅、背景噪声
- 永远有备录（本地 + 云同时录）

## 嘉宾管理

### 找嘉宾

1. **自己的人脉** — 客户、伙伴、行业接触
2. **播客嘉宾数据库** — PodMatch、Podmatch.com
3. **LinkedIn 搜索** — 按主题 + "podcast guest" 或 "speaker" 找专家
4. **其他播客** — 同类节目的嘉宾大概率会答应
5. **书作者** — 正在宣传新书，需要播客曝光

### 嘉宾外联模板

```
Subject: Guest invitation: {Podcast Name}

Hi {Name},

I host {Podcast Name}, a podcast about {topic} for {audience}.
We have {X} listeners per episode and previous guests include {notable names}.

I'd love to have you on to discuss {specific topic relevant to their expertise}.

Here's what previous guests have said: "{testimonial}"

The recording takes about {time}. We handle all editing and promotion.

Would you be open to a quick chat about this?

{Your name}
{Podcast URL}
```

### 录制前 checklist

- 提前 24h 发录制链接和技术要求
- 分享 3-5 个讨论问题（不是逐字剧本）
- 确认嘉宾姓名读音
- 拿到嘉宾偏好的 bio 和社交链接
- 请嘉宾准备 1-2 个跟主题相关的故事

## Shownote & SEO

每集都要有 SEO 优化过的 shownote：

```markdown
# {Episode Title — 包含目标关键词}

{2-3 句为搜索优化的本集摘要}

## Key Takeaways

1. {Takeaway 1}
2. {Takeaway 2}
3. {Takeaway 3}

## Timestamps

- [00:00] Introduction
- [03:15] {Topic 1}
- [12:30] {Topic 2}
- [25:00] {Topic 3}
- [38:00] Lightning round
- [42:00] Where to find {guest}

## Resources Mentioned

- [{Resource name}]({URL})
- [{Resource name}]({URL})

## About {Guest Name}

{简短 bio + 官网和社交链接}

## Subscribe & Follow

- [Apple Podcasts]({URL})
- [Spotify]({URL})
- [YouTube]({URL})
- [RSS Feed]({URL})
```

**SEO 要点**：

- 附完整或部分逐字稿覆盖长尾关键词
- 标题用 H1，含目标关键词
- 内部链到相关集数
- 页面内嵌音频播放器

## 增长策略

### 启动阶段（前 8 集）

1. **首发至少 3 集** — 给新听众连听内容
2. **让嘉宾分享** — 提供写好的社交文案和 audiogram
3. **个人网络推** — email 联系人、全社交渠道发
4. **Apple Podcasts 评价** — 请早期听众留评论（影响排名）
5. **提交到目录** — Apple、Spotify、Google、Amazon、Stitcher、Pocket Casts

### 增长阶段

| 策略 | 投入 | 影响 |
|------|------|------|
| 嘉宾交叉推广 | 低 | 高——每个嘉宾带自己的受众 |
| 社交平台 audiogram 短视频 | 中 | 高——音频平台上的视觉内容 |
| 邮件通讯提及 | 低 | 中——把读者转成听众 |
| 反向 podcast 做嘉宾 | 中 | 高——直接曝光对方受众 |
| YouTube 视频版播客 | 高 | 高——可搜索、可被发现 |
| 付费广告（Overcast、播客 app） | 中 | 中——$1-3/订阅 |
| 逐字稿博客文章 | 中 | 中——SEO 引流到 shownote |

### 单集推广 checklist

```
[ ] 在所有平台发布本集
[ ] Twitter/X 发 audiogram
[ ] LinkedIn 发 audiogram
[ ] Instagram Stories 分享
[ ] 邮件通讯发订阅用户
[ ] 把分享物料发给嘉宾
[ ] 在相关社群发（Reddit、Slack、Discord）
[ ] 出 2-3 张金句卡片
[ ] 更新官网 shownote 页面
[ ] 48h 内回所有评论
```

## 变现

| 变现模型 | 受众规模 | 报价 |
|----------|----------|------|
| Host-read 广告 | 1,000+ 下载/集 | $20-50 CPM |
| Pre-roll 广告 | 5,000+ 下载/集 | $15-25 CPM |
| 赞助 | 500+ 下载/集 | $500-2,000/月 |
| 付费专区内容 | 任意规模 | $5-15/月 |
| 联盟营销 | 任意规模 | 佣金浮动 |
| 服务/咨询 | 任意规模 | 来自 leads |
| 线下活动 | 10,000+ 下载/集 | 门票 |

**CPM = 每 1000 次下载的价格（行业定价标准）**

## 输出格式

写策略时，Step 4 用 `hub_write` 落下的模板：

```markdown
# Podcast Strategy: {Show Name}

## Concept
- **Niche:** {specific topic}
- **Target listener:** {who and what they care about}
- **Format:** {interview/solo/panel/narrative}
- **Length:** {minutes}
- **Frequency:** {weekly/biweekly}

## First 10 Episode Topics
1. {Topic} — {Why this first}
2. {Topic} — {Guest: Name}
...

## Guest Wishlist
| Name | Relevance | Contact Approach |
|------|-----------|-----------------|

## Growth Plan
### Month 1: Launch
### Month 2-3: Establish
### Month 4-6: Scale

## Equipment Budget
| Item | Cost |

## Content Repurposing Plan
{每集怎么拆成 10+ 条内容}
```

## 关键提醒

- 前 20 集里，**一致性大于质量**。周更，边做边改。
- 前 10 集不会好听。这很正常。继续做。
- 首发 7 天的下载量是最重要的指标（影响榜单和赞助定价）。
- **永远录视频**，哪怕初期只发音频。YouTube 视频播客增长快。
- 嘉宾驱动的节目比独白节目增长快，因为自带交叉推广。

## Hub 适配说明

- 用 `question` 一次性把概念、niche、目标听众、形式、更新频率、资源预算问齐再动笔 —— 本 skill 上下文吃得很饱。
- 最终策略文档、嘉宾 wishlist 表、外联邮件模板、单集推广 checklist 用 `hub_write` 落到当前 session workspace，再用 `hub_save_file_to_session`（`file_type: text`）注册，用户可 pin 住并传给下游 skill。
- 本 skill 只出文本产物 —— **不**做音频录制、剪辑、转写或媒体生成。用户如果想要音频侧支持（语音克隆、TTS、转写），引导他去 `hub_audio_generation` / `hub_audio_transcribe_lyrics` 或对应的音色 skill。
- 嘉宾外联文案、shownote markdown 以 ready-to-copy 块的形式返回，同时 `hub_write` 落盘 —— **不**代发外部邮件或走 CRM 工具；发送是用户的责任。
- 变现 / CPM 数据表里的计算写在策略文档内联；**不**要凭空捏造用户没给的赞助报价。
