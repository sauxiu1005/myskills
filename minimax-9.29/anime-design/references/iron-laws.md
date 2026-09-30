# 二次元/动漫五条防翻车铁律 + 三条工作流 meta 约束

> **何时 read**：写任何二次元/动漫角色立绘 / 多视图 / 系列封面 / IP 衍生 brief 之前必读。任何一条违反都会直接导致角色漂移 / 五官崩坏 / 风格人格分裂 / 中文文字错乱 / 透视失败——prompt 设计阶段就要规避，post 阶段也要按这五条 inspect。

## 五条防翻车铁律

### 1. 主体（角色）一致性必须显式 Lock（Character Identity Lock）

二次元 80% 的失败是**多张图角色对不上**：发色/瞳色/服饰/发型/标志性配饰每次抽奖。系列作品（多视图、表情包、剧情分镜、衍生周边）必须**显式锁角色**。

- 单图随手画无所谓；**任何一组 ≥ 2 张同角色** 必须建 Character Identity Lock card
- 锁定项：发色 + 发型 + 瞳色 + 肤色 + 标志性服饰（包括纹样 / 配色 hex）+ 标志性配饰（耳环/项链/武器）+ 体型/年龄段
- **首图 t2i 抽出锁定参考图后，后续全部走 i2i**（seedream / kontext + 参考图），禁止 t2i 多次抽奖凑一致
- **不允许**只用「同一个少女」「相同设计」这种含糊词，模型会偏移到训练先验

详细 Lock card 模板走 `cross-substyle-rules.md` 角色一致性 Lock 节。

### 2. 五官比例必须显式说明（Facial Anatomy Discipline）

二次元五官与写实人体差异巨大，且子风格之间差异更大（chibi 3 头身 vs webtoon 7-8 头身）。**禁止**默认「画个动漫脸」，否则鼻嘴比例错、瞳孔大小错、眼距错。

- **眼睛位置**：日漫现代 / 萌系 / Q 版 → 眼睛位于面部下半（瞳孔大、占面 1/3）；webtoon / 厚涂立绘 → 眼睛接近面部 1/2 横线（更接近写实）
- **瞳孔大小**：萌系 / shojo / chibi 大而高光多；shonen / cyberpunk 较锐利窄；写实韩漫接近真人比例
- **鼻嘴**：日漫多简化（鼻梁一笔 / 嘴小）；美漫卡通鼻嘴夸张突出；国漫水墨鼻线极简
- **头身比**：chibi 2-3 头身；萌系 5-6 头身；shonen / shojo 7 头身；webtoon / 厚涂 7.5-8 头身（接近写实）

子风格的五官 / 头身比默认值见 `defaults.md`，跨子风格的解剖学规则走 `cross-substyle-rules.md`。

### 3. AI 中文/对话框文字渲染策略选择（Text Rendering Strategy）

漫画对话框 / 标题 logo / 拟声词中文渲染是二次元生图的最大失败点（错字、缺笔画、字形不像漫画字）。生图前必须**显式选定**策略：

- **A 嵌入策略**：仅适合英文拟声词（BOOM / WHAM / POW）/ 中文 ≤ 4 字艺术化标题，且推荐用 **openai 或 qwen**
- **B 纯底图策略**（默认）：seedream / midjourney / kling 出不含文字的底图 + 后期手动加对话框 + 字体。**所有中文长对话、多框分镜、系列标题**默认走 B
- **C 模板替换策略**：用户提供已有漫画模板（i2i 模式），保留分镜版式仅替换台词

**禁止**让 seedream / midjourney 直接渲染中文长台词——会出错字或乱码。

### 4. 风格一致性禁止跨子风格混搭（Style Genes Lock）

单作品禁止把吉卜力 + 赛博朋克、Q 版 + 厚涂立绘混在一起——会得到风格人格分裂的怪物。系列作品必须 Lock 风格基因。

- **单图**：14 子风格选 1，明确写出关键风格词（见 `substyles-quick-ref.md`）
- **系列**：除了 Character Lock 还要建 Style Lock card：笔触类型（cel shading / painterly / watercolor / 3D render）+ 配色基调 + 线稿粗细 + 阴影方式
- **跨子风格混搭**只在用户**明确要求**「赛博朋克版的吉卜力」这种 brief 时允许，且必须主从分明（一个主子风格 + 一个借用元素）

跨子风格的笔触 / 阴影规则走 `cross-substyle-rules.md` 笔触一致节。

### 5. negative prompt 必出（Anti-Drift Negative）

二次元最常见漂移：跑成写实照片、跑成 3D 渲染（除非要 3D 子风格）、多手多脚、面崩。每张 prompt 必须挂 negative：

```
realistic photo, photography, photorealistic, real human face,
3d render (除非 cn-3d-fantasy 子风格), distorted face, mutated face, asymmetric eyes,
extra limbs, extra fingers, malformed hands, bad anatomy,
low quality, amateur sketch, watermark, signature, text artifacts (走纯底图时)
```

**不允许**省略 negative——现代模型也会跑偏，二次元 prompt 缺 negative 经常出真人脸。详见 `defaults.md` 默认 negative 节 + 各子风格独立 negative。

---

## 三条工作流 meta 约束（必读）

五条铁律之外，三条贯穿整个工作流的 meta 约束。

### Meta-1. 风格继承不可隐式（Style Inheritance Discipline）

用户说「按上次那个风格再来一张」时**禁止**靠记忆继承——必须把上次的关键风格词 / Lock card / 参考图作为 explicit input 带入新 prompt。

- 上次 Lock card 还在 → 复制 verbatim
- Lock card 丢失 → AskUserQuestion 上传上次成图作为风格参考（i2i 走 style only）
- **不允许**「我记得是日漫现代风」凭印象补，模型会跑偏到训练先验的「日漫现代」

### Meta-2. 参考图必须明确角色（Reference Discipline）

用户提供参考图时**禁止**走纯文生图。多张参考图必须 AskUserQuestion 明确每张角色：

- "保留主体 / 保角色"（i2i 走主体保留，seedream 或 kontext）
- "仅参考风格"（取笔触配色不取角色）
- "作为分镜模板"（保留版式 / 替换内容）
- "作为服饰 / 配饰参考"（局部参考）

参考图角色不明确 → sub-agent 凭直觉用 → 拿到结果对不上后再返工。

### Meta-3. 客户语义优先于训练先验（Brief Verbatim）

用户原话描述的「JK 制服」「拔刀斩」「凤眼」「魂环」必须**逐字保留**到 prompt，不允许翻译成 sub-agent 自己理解的英文（"school uniform" 会丢失 JK 短裙长袜的特征）。

- 国漫 / 国风 / 仙侠特有词汇优先用中文 prompt + qwen 模型
- 日漫特有词汇（铠甲 / 巫女 / 魔法少女）保留原词
- 用户给的角色设定文本（人设档）逐段贴进 prompt，不要总结

---

## 配套 reference

本文件是**二次元场景的铁律层**，给出 5 条 + 3 条 meta 防翻车规则。

- 子风格决策入口 → `substyles-index.md` / `substyles-quick-ref.md`
- 跨子风格共用规则 → `cross-substyle-rules.md`
- 默认参数（比例 / 笔触 / 配色）→ `defaults.md`
- 子风格 → 模型映射 → `model-routing.md`
