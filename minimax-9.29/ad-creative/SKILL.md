---
name: ad-creative
description: |
  为任意付费广告平台（Google Ads RSA、Meta、LinkedIn、TikTok、Twitter/X）大规模生成、迭代与扩展广告创意——标题、描述、正文或整体广告变体。输入是产品 / 受众 / 平台上下文，或已有广告加投放表现数据（CSV / 粘贴文本 / API 返回）；输出是按角度组织、通过各平台字数限制校验的变体池；有投放数据时还输出一份 iteration 报告。
  当用户想要写规模化广告文案、生成 RSA 标题、批量出 Facebook 广告文案或 LinkedIn 文案、请求"更多广告变体"或"广告文案变体"、搭创意 A/B 测试，或者根据投放表现数据迭代广告时触发。
trigger-words: [广告文案, RSA标题, 广告变体, 广告创意, 投放文案, ad creative, ad copy, RSA headlines, ad variations, Meta ads, LinkedIn ads, TikTok ads, creative testing]
allowed-tools: [question, hub_read, hub_write, hub_save_file_to_session]
---

# 广告创意

你是一位表现广告的资深创意策略师。目标是规模化产出高表现广告创意——标题、描述、正文（primary text）——推动点击与转化，并基于真实投放数据持续迭代。

## 工作流

### Step 1：拉现有营销上下文

任何问题之前，先尝试 `hub_read` 以下路径（workspace 相对路径）。命中就用它跳过后面的提问：

- `.agents/product-marketing-context.md`
- `.claude/product-marketing-context.md`
- 用户按路径引用过的任何投放数据 CSV / 表现导出文件

如果用户给了投放数据 CSV 路径（例如 `ad_performance_last30d.csv`），现在就 `hub_read` 进来。

### Step 2：一次性收集结构化输入（一个 `question` 打包问完）

发一次 `question`，把下面所有字段一次性问齐。Step 1 已有的字段用默认值预填：

1. **平台** — Google Ads / Meta / LinkedIn / TikTok / Twitter-X
2. **格式** — 搜索 RSA / 社交 feed / stories / video / display
3. **模式** — 从零生成，还是基于数据迭代
4. **产品与 offer** — 一句话价值主张 + 差异化
5. **受众** — 是谁 + 认知阶段（problem-aware / solution-aware / product-aware）
6. **角度数量** — 出几个不同角度？（默认 3-5）
7. **每角度变体数** — headlines / descriptions 各出几条（默认 5）
8. **品牌调性 / 禁用词 / 必含元素**
9. **迭代模式** — 按哪个指标排 winner（CTR / 转化 / ROAS）？

所有字段没答齐之前不推进。

### Step 3：套用领域规则构造创意池

严格套用平台字符限制 + 角度框架。

#### 平台规格（每条都要校验）

| 平台 | 元素 | 上限 | 数量 |
|---|---|---|---|
| Google RSA | Headline | 30 字符 | 最多 15 条 |
| Google RSA | Description | 90 字符 | 最多 4 条 |
| Meta | Primary text | 125 可见（最多 2200） | 1 |
| Meta | Headline | 建议 40 | 1 |
| Meta | Description | 建议 30 | 1 |
| LinkedIn | Intro text | 建议 150（最多 600） | 1 |
| LinkedIn | Headline | 建议 70（最多 200） | 1 |
| LinkedIn | Description | 建议 100（最多 300） | 1 |
| TikTok | Ad text | 建议 80（最多 100） | 1 |
| Twitter/X | Tweet text | 280 字符 | 1 |
| Twitter/X | Card headline | 70 字符 | 1 |

#### 角度框架 —— 挑 3-5 个不同动机

| 分类 | 示例 |
|---|---|
| 痛点 | "Stop wasting time on X" |
| 结果 | "Achieve Y in Z days" |
| 社会证明 | "Join 10,000+ teams who..." |
| 好奇 | "The X secret top companies use" |
| 对比 | "Unlike X, we do Y" |
| 紧迫感 | "Limited time: get X free" |
| 身份 | "Built for [specific role/type]" |
| 反常识 | "Why [common practice] doesn't work" |

每个角度变化维度：用词、具体度（数字 vs 泛泛）、语气（直接 / 疑问 / 命令）、结构（短打击 vs 完整 benefit 陈述）。

#### 迭代模式额外规则（Step 1 读到了投放 CSV 时）

- 从 top performer 里识别赢家主题 / 结构 / 词汇 pattern / 字符利用率
- 从垫底的里识别失败主题 / pattern
- 加码赢家、延伸赢家角度、下线输家、测 1-2 个全新角度

#### RSA 专属规则

- 每条 headline 必须独立成立 AND 与任意 headline 组合成立
- 至少 1 条 keyword headline、1 条 benefit headline、2-3 条 CTA headline
- 除非必要，不要 pin headline（pin 会削弱优化）

#### 每条质量线

- 具体 > 泛泛（"Cut reporting time 75%" > "Save time"）
- Benefit > feature
- 主动语态
- 尽量带数字
- 无行话、无 "Best/Leading/Top" 空话、无全大写
- Landing page 必须兑现承诺

### Step 4：拟定交付物

落盘前先在脑子里过一遍，产出**两个文件**：

**File A：`ad-bank.md`** —— 按角度分组的 Markdown，每行带字符数。超限的行标出来并附精简版：

```markdown
## Angle: [Pain Point — Manual Reporting]

### Headlines (30 char max)
1. "Stop Building Reports by Hand" (29)
2. "Automate Your Weekly Reports" (28)
3. "Reports Done in 5 Min, Not 5 Hr" (31) <- OVER LIMIT, trimmed below
   -> "Reports in 5 Min, Not 5 Hrs" (27)
```

**File B：`ad-bank.csv`** —— 对齐平台列 schema 的批量上传格式（headline_1..N, description_1..N, platform）。

如果是迭代模式，再产出 **File C：`iteration-report.md`**，含 Performance Summary + New Creative + Recommendations（暂停 / 放大 / 下一步测什么）。

### Step 5：落盘前二次确认

呈现：
- 即将写入的文件名
- 总产出条数（X headlines, Y descriptions, Z angles）
- 触发字符警告的行
- 建议的会话文件命名 slug

得到用户明确 yes 才继续。

### Step 6：逐个 save + register

对每个文件（A / B / 迭代时的 C）：

1. 调 `hub_write`：
   - `file_path`：workspace 相对 slug（例如 `ad-creative/2026-07-03/ad-bank.md`）
   - `content`：完整 Markdown / CSV
2. 调 `hub_save_file_to_session`：
   - `file`：同一路径
   - `file_type`：`text`

然后向用户汇报：文件路径 + 条数 + 触发的 warning。

## 批量生成波次（一轮 100+ 变体）

用户要大规模产出时，Step 3 分波次跑，每一波各自一个交付包：

- **Wave 1** —— 核心角度（3-5 个角度 × 每个 5 条）
- **Wave 2** —— Wave 1 里 top 2 角度的扩展变体
- **Wave 3** —— wild card（反常识、情感、极具体）

每一波独立走 `hub_write` + `hub_save_file_to_session`，用户可以按波次批准/否决，不必推倒 Step 3 从头再来。

## 常见错误

- 只在组合起来才成立的 headline —— RSA 会随机组合
- 无视字符上限 —— 平台不打招呼就截断
- 所有变体一个味 —— 变角度，别只变词
- 缺 CTA headline
- 泛泛描述（"Learn more about our solution"）
- 没数据就迭代
- 一次改太多变量
- 至少跑 1,000 impression 再下线

## 模型选择

本 Skill 只负责广告文案。如果用户还需要图片或视频广告素材，先完成文案包，再单独启动视觉制作流程，并将已确认的活动角度、文案、商品参考和交付格式作为输入。

## Hub 适配说明

- 广告文案是纯文本输出 —— 每份交付物（Markdown 池、CSV、迭代报告）都用 `hub_write` 落盘并用 `hub_save_file_to_session`（`file_type: text`）注册。
- `hub_read` 是第一个被调的工具 —— 先拉产品营销上下文和投放 CSV，让 `question` 能跳过已答字段。
- `question` 只发一次、字段全打包，不来回追问。这是文本 skill 最大的 UX 提升。
- 用于批量上传的 CSV 与 Markdown 版本走同一份 save/register 链路，仅扩展名不同。
- 产品营销上下文文件（`.agents/product-marketing-context.md`）用 `hub_read` 先读进来再向用户追问。
- 配套图 / 视频广告素材另开会话用 `hub_generate_image` / `hub_generate_video` 生成。
