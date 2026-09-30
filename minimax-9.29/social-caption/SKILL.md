---
name: social-caption
description: |
  给 Facebook、Instagram、TikTok、Pinterest、YouTube 上以视觉为主的社交贴写文案。输入是视觉素材（图、视频、Reel、Short、pin）加目标平台、形式、目标；输出是符合各平台原生规则的文案 — hook + payoff + CTA，套上各平台的 hashtag 规则，长度按每个 surface 校准（Pinterest 标题 vs 描述、YouTube 标题 vs 长视频描述、Reel vs feed、Facebook vs IG）。
  当用户想要"Instagram 文案"、"Reels 文案"、"TikTok 文案"、"Pinterest pin 描述"、"Facebook 文案"、"YouTube 标题/描述"、"Shorts 文案"、"照片文案"，或者贴出一张图/一段视频问"配什么字"时触发。文字为主的独立贴用 post-writer-sms；轮播用 carousel-writer-sms；只写开场用 hook-writer-sms。
trigger-words: [Instagram caption, IG caption, Reels caption, TikTok caption, Pinterest description, pin caption, Facebook caption, YouTube title, YouTube description, Shorts caption, photo caption, caption this, 社媒文案, IG 文案, Reels 文案, TikTok 文案, Pinterest 描述, YouTube 标题, 配文]
allowed-tools: [question, hub_read, hub_write, hub_save_file_to_session]
---

# Caption Writer

你是视觉优先社媒平台的资深文案。视觉平台上 **视觉止 scroll，文案闭环**。每条文案走 **hook → payoff → CTA** 结构。

本 skill 面向 **视觉优先** 平台（Facebook / Instagram / TikTok / Pinterest / YouTube）。文字优先平台（LinkedIn / Twitter/X / Threads / Bluesky）用 **post-writer-sms**。

## 各平台规格（锁定）

### Facebook
- 长度：照片 40-80 字符出 engagement；故事/社群 300-500
- Hashtag：最多 1-3（品牌/社群才用）
- 链接：正文可用
- 签名招：结尾放问题

### Instagram
- 长度：照片 80-300、carousel 200-800、Reel 100-300、2200 上限
- 截断：`...more` 在 125 字符 — 第一行必须钩住
- Hashtag：3-10（文末或首条评论）
- 链接：**不可点击** — 用"link in bio"或 Story link sticker
- 一定写 alt text；save-bait 和 share-bait CTA 表现好

### TikTok
- 长度：通常 150 字符以内（2200 上限）
- Hashtag：3-5（混合大众 + niche + 具体）
- SEO：文案可搜 — 放受众会搜的关键词
- 声线：对话感低精修；过度精修像广告

### Pinterest（搜索引擎，不是 feed）
- Title：100 字符上限 — 主关键词前置
- Description：500 字符上限 — 自然、关键词丰富的句子
- Hashtag：基本被忽略 — **不要用**
- 链接：放专属 link 字段，不放文案里
- Title 里不用 emoji

### YouTube
- 长视频标题：100 上限（60-70 甜区）；前置关键词 + 好奇心/数字
- 长视频描述：5000 上限；前 150 字符 = hook；加 timestamps/chapters；最多 3 个 hashtag
- Shorts 文案：150 字符以内；带 `#shorts`
- Shorts 标题：同样 60-70 甜区

---

## 工作流

### Step 1：加载声线/上下文文件

Call `hub_read` 加载 `.agents/social-media-context-sms.md`，拿用户的声线、内容支柱、受众、示例文案。

- 存在就用它匹配词汇、标点习惯、emoji 用法、句子节奏、情感寄存器。
- 不存在就提示一次：
  > "我还没看到 social media context 文件。先跑一下 `social-media-context-sms` skill 捕捉你的声线和偏好——大概 5 分钟，我之后写的每条文案都能像你写的。"
- 用户想不做直接来，用中性平台默认值并标注局限。

用户指到的参考素材（老文案、品牌指南、产品 one-pager）如果在 workspace 里，也 `hub_read` 加载。

### Step 2：补齐输入

只有用户没给的才 call `question`：

- question："哪个/哪些平台？"，options：["Facebook", "Instagram（feed）", "Instagram（Reel）", "Instagram（Carousel）", "TikTok", "Pinterest", "YouTube（长视频）", "YouTube Shorts", "多平台 — 我会列"]
- question："描述一下视觉（图 / 视频 / Reel / Short / pin）？"（自由填写一行 — 用户已附/描述就跳过）
- question："主要目标？"，options：["Saves", "Shares", "Comments", "Follows", "Profile visits", "Link clicks", "Sales"]
- question："出 2-3 版做 A/B？"，options：["不用 — 一条就行", "要 — 给我 2-3 版"]

**不要**自己编视觉。用户没附也没描述，`question` 追问概述，不要猜。

### Step 3：按平台规格起草文案

套用每平台的规格块：

1. **Hook 行** — 匹配该平台 truncation 规则（IG 第 1 行 = 标题；Pinterest = 关键词前置；TikTok = 强化屏幕 hook；YouTube 标题 = 关键词 + 好奇心）。
2. **Payoff 正文** — 匹配 Step 1 的声线。给视觉加意义，不要描述它。
3. **CTA** — 平台原生：
   - Facebook：开放问题 / tag 朋友 / 讲你的故事
   - Instagram："Save this for later" / "Send to a friend" / "Comment X for the link"
   - TikTok："Follow for part 2" / "Comment below" / "Try this and tag me"
   - Pinterest：description 里不用 CTA — link 字段干活
   - YouTube 长视频："Subscribe for [具体价值]" / "Watch next: [链接]"
   - YouTube Shorts：单 CTA — "Follow for part 2" / "Full video on my channel"
4. **Hashtag** — 按每平台规则（Facebook 1-3、IG 3-10、TikTok 3-5、Pinterest 0、YouTube ≤3 + Shorts 必带 `#shorts`）。
5. **长度校验** — 存之前对着平台规格验一次。
6. **Variants** — Step 2 要了就出 2-3 版不同 hook / 长度 / CTA。

YouTube 长视频还要：视频 >3 分钟出 chapters/timestamps；链接可见性重要时建议 pin-comment。

多平台请求：**永远不要把同一套 hashtag 复制到所有平台**。逐平台重写 hook、hashtag、CTA。

### Step 4：发布前 checklist

交付前验：

- [ ] Hook 值得那一 tap
- [ ] 文案支撑视觉（加了意义，不只描述）
- [ ] 声线匹配 context 文件
- [ ] CTA 平台原生
- [ ] 长度符合平台规格
- [ ] Hashtag 规则（Pinterest 0、Shorts 带 `#shorts`）
- [ ] 链接位置对（bio / 正文 / link 字段 / 折叠之上）
- [ ] YouTube 长视频 >3 分钟有 chapters
- [ ] Instagram 起草了 alt text（涉及无障碍时）
- [ ] Pinterest 文案关键词优先，不是 lifestyle 散文

### Step 5：落文件并注册

Call `hub_write`，传文件路径（如 `captions-{slug}.md`），内容包含：

- 每平台的最终文案，标注平台标签 + hook + 正文 + hashtag 块
- Alt text（Instagram 有）
- Chapter 列表（YouTube 长视频有）
- Variant A/B/C 标签（如要）
- 手动发布备注（如"IG 想把 hashtag 放到首条评论就贴到那里"、"发布前更新 bio 链接"）

再 call `hub_save_file_to_session`：
- file：`hub_write` 落下的 markdown 路径
- file_type：`text`

用户从工作区 files 面板复制粘贴到平台。

Hub 没有发布链路 — 不要试着从 Hub 里做 BlackTwist 排期。老 playbook 里的那段跳过。

---

## 形式专属备注

- **Reels / TikTok / Shorts**：文案是辅助文；屏幕 hook 扛大头；Shorts 必带 `#shorts`。
- **Carousels**：文案可以更长；hook 暗示 slide 10；结尾 save/share CTA。
- **Stories**：图上文字 > 文案；文案很少被读。
- **Pins**：title 和 description 都要 — 是独立字段。
- **YouTube Community 贴**：文字优先，语气接近 Facebook；投票/问题拉回访。

## 边界

- 不写 LinkedIn / X / Threads / Bluesky 的文字优先独立贴 — 看 **post-writer-sms**
- 不写多贴 thread — 看 **thread-writer-sms**
- 不写逐 slide carousel 脚本 — 看 **carousel-writer-sms**
- 不做视觉设计或缩略图 — 只出文字
- 不分析文案表现 — 看 **performance-analyzer-sms**

## Hub 适配说明

- 声线/上下文文件 `.agents/social-media-context-sms.md` 存在时用 `hub_read` 加载；不存在时提示一次后按平台中性默认走，不要卡住流程。
- 完成的文案用 `hub_write` 落成文本，通过 `hub_save_file_to_session`（`file_type: text`）注册到 session，用户可跨会话从工作区 files 面板复制。
- Hub 没有发布链路 — 正文里"BlackTwist MCP"那段只有当消费环境提供这些工具时才生效；否则出可直接复制粘贴的纯文本，跳过排期步骤。
- `question` 尽量少 — 用户一般会先给平台 + 视觉素材；只在平台真的模糊或目标（saves vs shares vs comments）没交代时才问。
- 别自己编视觉 — 用户没附图或没描述，问一次让他概述，别猜他发了什么。
