---
name: ugc-ad-production
description: |
  为一个商品端到端生产一支拟真 AI UGC 广告的完整流水线。15 秒、9:16 竖版格式，成片看起来像真人 creator 而不是 AI。输入是商品、参考 UGC 视频、2+ 张 creator 面孔参考、目标受众和 hook 类型；输出是分镜脚本、一张 4K creator 面孔图，以及一段 15 秒 Kling 3.0 视频可直接进后期。
  当用户想做 UGC 广告、拍 UGC 视频、拉一个 AI UGC 创作者、生成商品 UGC 或跑完整 UGC 流水线时触发。
trigger-words: [UGC 广告, UGC 视频, AI UGC creator, 产品 UGC, 拟真 UGC, 达人视频, UGC ad, UGC video, ugc pipeline, product UGC]
allowed-tools: [question, hub_generate_image, hub_generate_video, hub_read_media, hub_save_file_to_session]
---

# UGC 广告生产流水线

给一个商品生成拟真 AI UGC 广告的端到端工作流。15 秒。像真人。不像 AI。

**锁死的默认值 —— 永远不跟用户商量**：

- 剪辑工具：Canva（外部工具，Hub 外做）
- 视频时长：15 秒
- 画幅：9:16 竖版
- 视频模型：Kling 3.0
- 图像模型：Nano Banana Pro（4K）

---

## 工作流

### Step 1: 收集五项必要输入
用**单次** `question` 一把问齐五个问题。**不要**一条一条问 —— 流水线烧 credits，末端才发现少输入会白烧一次 Kling 渲染。

要问的：

1. **商品** —— 名称、URL 或图
2. **参考 UGC 视频** —— 同赛道的 Pinterest / TikTok / YouTube 链接
3. **Creator 面孔参考** —— 2 张以上真人照（漂亮、匹配品牌），会做 face-mix
4. **目标受众** —— 比如 18-35 岁痘痘肌女性
5. **Hook 类型** —— problem/solution、before/after、testimonial、transformation，或 "让 agent 定"

如果用户把参考 UGC 视频以 asset 形式丢进 session，在 Step 2 之前调一次 `hub_read_media` 确认时长和画幅，脚本节奏才能对上。

### Step 2: 起草分镜脚本（Claude 推理，不调工具）
用 Claude 自己的推理能力写带时间戳的脚本 —— 这一步是纯文本，不涉及 Hub 工具。

要填的模板：

```
Make a UGC script for a 15-second video like [REFERENCE VIDEO] but for [PRODUCT].
Use [CREATOR DESCRIPTION from face references] as the UGC creator/speaker.
Include:
- Hook (first 3-5 seconds): show the problem visually + audio hook
- Voiceover lines with exact words
- Cut descriptions: what the camera shows at each moment (creator face, product, before/after, etc.)
- Actions and mannerisms: make the creator feel like a real character — nervous laugh, hair tuck, direct eye contact, pointing at product, etc.
- Call to action (last 2-3 seconds)
- Timestamps for each cut/action
Output as a shooting script with columns: Timestamp | Voiceover | Visual/Shot | Action/Mannerism
```

给 Claude 最大化上下文：商品细节、目标受众痛点、赛道爆款 UGC、叙事框架（problem-agitate-solve、before/after）。埋入的爆款原则：pattern-interrupt hook、社交证明、转变时刻、紧迫感 CTA。

本步产出：交给用户看的带时间戳分镜脚本。

### Step 3: 生成 Creator 面孔
调 `hub_generate_image`，参数：

- vendor：`nano-banana`（Nano Banana Pro）
- model：4K 变体
- prompt（模板）：
  ```
  Mix these faces to create a new attractive face that does not belong to any real person.
  Use as the face of a UGC beauty/lifestyle content creator.
  4K resolution. Hyperrealistic skin texture, pores, natural imperfections, natural lighting.
  Creator holding the product near her face, holding a ring-light mic. Suitable as a UGC first frame.
  ```
- resolution：4K（必需 —— 毛孔和微观细节是不 AI 感的关键）
- medias：把用户给的所有面孔参考 + 商品图作为图像输入
- aspect_ratio：9:16

用户要多版就生成 3-5 版让他挑；否则出一张。

### Step 4: 注册选中的面孔
挑好的那张 creator 肖像调 `hub_save_file_to_session`，`file_type: image`。Step 5 就能用它作为 `start_image`。

### Step 5: 生成 15 秒视频
调 `hub_generate_video`，参数：

- vendor：`kling`
- model：`kling_3_0`
- prompt：Step 2 的分镜脚本重排成导演式 cut。示例：
  ```
  [First frame: creator holding product, looking at camera, natural lighting]
  Cut 1 (0-3s): Creator speaks directly to camera with [mannerism], says "[hook line]"
  Cut 2 (3-7s): Close-up of product being applied / used
  Cut 3 (7-12s): Creator reaction shot — [emotion/mannerism from script]
  Cut 4 (12-15s): Creator faces camera, delivers CTA, [mannerism]
  ```
- duration_sec：15（锁死）
- aspect_ratio：9:16（锁死）
- medias：
  - role `start_image`：Step 4 的 creator 图（session ID）
  - role `image`（或 reference）：商品图
- 除非用户明确要多版，每次跑单条。

### Step 6: 注册最终视频
返回的 `.mp4` 调 `hub_save_file_to_session`，`file_type: video`。用户可以 pin 或传给下游。

### Step 7: 交接外部后期
告诉用户哪些还在 Hub 外，**不要**尝试调它们：

- 语音克隆 / 配音：ElevenLabs 或 Play.ht
- 剪辑 / 字幕 / 切镜：Canva
- SFX：Artlist（切镜 whoosh、VO 10% 混响做空间感）

---

## 爆款原则（每一步都埋入）

- **Hook = 问题镜像**：前 3 秒展示观众自己的问题。他们停止滑动是因为看到了自己。
- **Before/After = 希望循环**：问题 hook 之后展示转变。制造欲望。
- **音频 hook**：切镜时的 whoosh 音效是 pattern interrupt —— 拉高观看时长。
- **Creator 小动作 = 信任**：像真人的 creator（紧张地笑、拨头发、叹气）比完美演绎更快建立潜意识信任。
- **混响 = 空间感**：10% 混响去掉 "AI 电台腔"。
- **CTA 紧迫感**：最后 2-3 秒。直接、具体、低摩擦（"link in bio"、"tap the link"、"DM me"）。

## 品牌注意

如果是给真实账号/品牌（不是测试）：

- Creator 面孔要匹配品牌目标受众人设
- Creator 的风格/调性要在所有 UGC 视频里保持一致
- 不同视频不要混美学 —— 挑一个锁死

## 平台 / 成本汇总

| 工具 | 用途 |
|------|------|
| Claude / Gemini 2.5 Pro | 脚本 |
| Nano Banana Pro（`hub_generate_image`） | Creator 面孔 + 商品图 |
| Kling 3.0（`hub_generate_video`） | 视频生成 |
| ElevenLabs | 语音克隆 + swap（外部） |
| Play.ht | 语音克隆备选（外部） |
| Canva | 视频剪辑 + 文字（外部） |
| Artlist | 音效（外部） |

## Hub 适配说明

- 五项必要输入（商品、参考 UGC 视频、2+ creator 面孔、目标受众、hook 类型）用一次 `question` 结构化问齐，别一条条挤；也别悄悄假设 never-ask 清单里的默认值（Canva、15s、9:16、Kling 3.0、Nano Banana Pro）。
- Step 2（creator 面孔）走 `hub_generate_image` + Nano Banana Pro 模型，把 2+ 张参考面孔作为图像输入，目标 4K。挑好的那版用 `hub_save_file_to_session`（`file_type: image`）注册到 session，Step 3 直接当首帧。
- Step 3（15 秒视频）走 `hub_generate_video` + `vendor: kling` + `model: kling_3_0`，Step 2 的 creator 图作为 `start_image`，商品图作为额外的媒体参考。duration = 15s、aspect_ratio = 9:16，不可协商。
- 最终 `.mp4` 用 `hub_save_file_to_session`（`file_type: video`）注册。外部工具步骤（ElevenLabs 配音、Canva 剪辑、Artlist 音效）在 Hub 外做 —— 作为用户后续待办点出来，别自作主张去调。
- 用户如果把参考 UGC 视频丢进 session、你在写脚本前需要看时长/画幅，用 `hub_read_media`。
- Kling 3.0 credits：每次跑单条生成 15s。除非用户明确要求多版，别自行 fan out 变体。
