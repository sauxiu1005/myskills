# 平面设计七条防翻车铁律 + 三条工作流 meta 约束

> **何时 read**：写任何海报 / 封面 / 社媒图 / 营销图 brief 之前必读。任何一条违反都会直接导致设计感差 / 信息不传达 / 文字错乱 / 品牌色错位 / 文案重复——prompt 设计阶段就要规避，post 阶段也要按这六条 inspect。

## 六条防翻车铁律

### 1. 比例必须显式声明（Aspect-Ratio Discipline）

每个子类型默认比例**完全不同**。**禁止**用「默认 1:1」或「随便给个比例」凑合。

- 海报常见：印刷 3:4（A3/A4）/ 电影 2:3 / 朋友圈竖图 9:16 / 横幅 16:9
- 封面常见：杂志 3:4 / 书籍 2:3 / 专辑 1:1 / 视频 16:9 或 9:16
- 社媒常见：公众号头图 2.35:1 / 公众号次条 1:1 / 小红书 3:4 / 微博 16:9 / Story 9:16 / IG Post 1:1
- 营销 banner 常见：网页 16:9 或 21:9 / 详情页 1:1 或 4:5 / 促销 9:16 或 3:4

未明确比例**直接问用户**，不要默认 1:1。每个子类型的默认比例见对应 `subtypes/{NN}-{name}.md`。

### 2. 文字内容必须用户确认（Text Pre-confirmation）

平面设计 80% 的失败是**文字错乱**：错字、字体不合调性、文案位置压主体、长度超出预算。

派单生图前**必须 AskUserQuestion** 用户确认：

- 是否需要文字（Y/N）
- 主标题完整文字（用户原话 verbatim）
- 副标题（如有）
- 辅助信息（日期、地点、品牌、CTA）
- 中英文 / 中英混排
- 字体调性偏好

**不允许**「这是海报，文字应该是 XX」凭训练先验补全文字。

### 3. AI 渲染中文字策略（Text Rendering Strategy）

> ⚠️ **2026 更新**：默认走**直接渲染**（用 openai/qwen），不再默认走"纯底图 + 后期"。后者是 SDXL/早期 midjourney 时代的 workaround，已过时。

中文文字渲染策略：

- **策略 A（默认）**：用 openai (gpt-image-2) 或 qwen 直接渲染。openai 标题级 ≤ 20 字 / qwen ≤ 15 字稳定可用，国风/中式调性优先 qwen
- **策略 C**：用户提供模板图（i2i 模式），保留版式仅替换文字
- **策略 B（罕见 fallback）**：仅在用户明确"只要底图自己加文字"或文字 > 50 字极端长时使用；走 B 时**必须返回结构化交付物**（坐标 + 字体推荐），不允许默默交付空白底图

### 4. 视觉权重三区分明（Visual Weight Discipline）

任何含文字 + 图像的画面必须有 Heavy / Medium / Light 三区分明的视觉权重：

- **Heavy 区**：主视觉密度区（主体 / 强色彩 / 复杂细节 / 高对比）
- **Medium 区**：文字落点最佳区（轻度纹理 / 中等明暗对比，文字与图像不打架）
- **Light 区**：留白呼吸空间（无主体 / 无质感 / luminous emptiness 刻意空）

**文字必须落 Medium 区**——不能压在 Heavy 区主要细节上（人物海报不压脸；商品图不压 logo）。**留白必须明确为「刻意空」**——不能只说「较亮区域」（模型会用渐变贴图填充）。

#### ⚠️ MUST READ before writing composition prompt

本铁律的执行细节、prompt 写法红线、5 类假三区识别详见下方「几何分割红线」节。

#### 几何分割红线（Composition Prompt 反例）

写 Composition / Layout / Subject 段 prompt 时**禁止**用以下描述（直接命中假三区 #4）：

| 反例 | 后果 |
|---|---|
| ❌ `Top 1/3: title area, Middle: main visual, Bottom 1/3: fade` | 上下色块硬切 |
| ❌ `Upper section + Lower section` | 同上 |
| ❌ `Header area + main image area` | 同上 |
| ❌ `clean color block at top for text` | 纯色块覆盖，无过渡带 |

**正确写法**（必须含**梯度过渡**关键词）：

```
warm tonal gradient flowing from luminous upper area
through textured middle band into rich heavy lower zone,
no hard color block boundaries
```

或：

```
seamless tonal transition between text area and main subject area,
no horizontal color split, soft visual blend
```

详细三区模型 + 失败模式 + Prompt 写法 + 5 类假三区识别详见下方相关章节。

### 5. 品牌色 hex 严执（Brand Color Fidelity）

任务含品牌色 hex 时**必须**：

- prompt 里写出完整 hex（`#FF6B35`）+ 描述性辅助词（`warm orange`）
- 标明角色（`primary / accent / background`）
- 配色比例（`dominant 60% / accent 25% / background 15%`）
- **不允许**用「品牌色」这种含糊词，模型会偏移到训练先验

### 6. 文案唯一性（Text Uniqueness）

> 同一文案信息**不在画面中出现两次**——重复 = 信息层级失效 + AI 幻觉典型症状（benchmark 实测高频翻车点）。

**必须遵守**：

- 主标题 / 副标题 / CTA / 时间地点 / 品牌名 / 价格 → 每段在画面中**只出现一次**
- 中英文对照**不算重复**（如 "周末读书会 / Weekend Book Club" 上下并列）
- 版权信息 / Copyright / 小字 → 单独一处不可重复

**失败模式**：

| 表现 | 根因 | 修法 |
|---|---|---|
| 标题在顶部 + 同一标题又出现在中间 | AI 幻觉，prompt 没显式约束 | 显式要求"each text element appears exactly once" |
| 时间出现两次（顶部一次 + 底部又一次） | prompt 描述时间放置时多次提到 | prompt 中每段文字只声明 1 次位置 |
| 同一英文短语在画面 3 处出现 | 模型在"留白"区域用文案填充 | negative: no duplicated text, no repeated copy |
| 中文主标题被复刻成英文翻译再出一次 | 模型自动加英译 | 显式 "Chinese title only, no English translation overlay" |

**Prompt 防御标准句**：

```
Text rendering discipline:
- each text element appears exactly once in the composition
- no duplicated copy, no repeated phrases
- title at {position} only, date at {position} only
- no auto-translated overlays

negative: no duplicated text, no repeated copy, no echoed phrases
```

### 7. 氛围效果不能吞主体（Atmosphere ≠ Subject Erasure）

motion blur / dramatic blur / soft focus / dreamy haze / extreme bokeh / mood-only 等氛围效果**必须保留至少 1 个清晰可识别的主体**（人物 / 产品 / 地标 / 标志性物件 / 场景核心元素），让海报不退化成纯装饰背景。

**适用场景**：

- 春日 motion blur 海报 → 必须保留可辨认的"花田 / 原野 / 樱树 / 行人剪影"等主体细节
- 梦幻 bokeh 婚礼海报 → 必须保留可辨认的新人 / 产品轮廓
- soft focus 美妆海报 → 必须保留可辨认的产品瓶身 / 模特面部
- 雨夜霓虹氛围海报 → 必须保留可辨认的人物 / 招牌 / 街景结构

**Prompt 防御标准句**：

```
motion blur applied to background only,
main subject (e.g. {subject_keyword}) remains in clear focus,
identifiable subject silhouette / shape must be preserved,
do not blur the entire frame, do not erase the subject into pure abstraction
```

**自检（必走）**：出图后眯眼 1 秒看不清"画的是什么具体场景 / 主体是什么"→ 直接 regen，把氛围效果权重往下降。

---

## 三条工作流 meta 约束（必读）

五条铁律之外，三条贯穿整个工作流的 meta 约束。

### Meta-1. 子类型边界不可跨界（Subtype Discipline）

海报 / 封面 / 社媒图 / 营销图各有独立的设计逻辑：

- **海报**：信息传达（艺术性优先），主视觉占 60%+
- **封面**：依附于内容（杂志 / 书 / 视频），有固定标题字位
- **社媒图**：首屏吸引力 + 小屏阅读性
- **营销图**：转化导向（信息清晰 + CTA 显眼），主视觉占 40-50%

**禁止把营销图当海报做**（卖点图需要清晰的产品 + 卖点 + CTA，不追求艺术性）。子类型识别歧义时（"做个海报推广 X 产品"）必须 AskUserQuestion 确认主用途。

### Meta-2. 参考图必走 i2i（Reference Discipline）

用户提供模板图 / 参考海报 / 品牌已有素材时**禁止**走纯文生图。明确告知用户走哪条路径：

- "将基于参考图重绘"（保留版式 / 主体）
- "将仅参考风格"（取风格 不取内容）
- "将作为模板替换"（保留版式 / 替换文字 / 替换主体）

多张参考图时**必须 AskUserQuestion 明确每张角色**（模板 / 风格 / 主体 / 品牌素材）。

### Meta-3. 必填项缺一不可（Brief Completeness）

派单前对照 `subtypes/{NN}-{name}.md` 的"必填项"清单 grep 一遍。任一缺失：

- 比例缺 → AskUserQuestion
- 主视觉缺 → AskUserQuestion
- 文字内容缺 → AskUserQuestion（按 Iron Law #2）
- 字体调性缺 → AskUserQuestion
- 配色策略缺 → AskUserQuestion 或采用子类型默认
- 平台尺寸缺 → 按子类型默认（见 `defaults.md`）

跳过 = sub-agent 凭训练先验补全 = 拿到结果对不上后再返工。

---

## 配套 reference
- 子类型决策入口 → `subtypes-index.md` / `subtypes-quick-ref.md`
- 跨子类型共用规则 → `cross-subtype-rules.md`
- 默认参数（比例 / 调性 / 配色）→ `defaults.md`
- 子类型 → 模型映射 → `model-routing.md`
- 海报评分模型（出图后必走）→ `quality-scoring.md`
