# 08. 国漫现代 (cn-modern)

> **优先质量维度**: Style Authenticity + Color Harmony（国漫识别度 + 高饱和大色块）
> **默认比例**: 16:9（横版剧集帧）/ 9:16（竖版海报）
> **核心识别特征**: 扁平几何 + 明亮饱和大色块 + 简化锐利轮廓线 + 中式留白构图 — 类《罗小黑战记》《刺客伍六七》《一人之下》视觉调性

---

## 一、子风格基因清单

> 国漫现代不是「中国题材的日漫」，而是有独立美学：扁平化、几何化、设计感强。
> 核心逻辑：基因 = 扁平笔触 × 高饱和大色块 × 简化五官 × 中式构图。

| # | 基因维度 | 描述 | Prompt 关键词 |
|---|---|---|---|
| 1 | 笔触 | 扁平 vector 感，锐利清晰的描边线，无阴影渐变层叠 | `flat design, vector-style outlines, sharp clean lineart` |
| 2 | 配色 | 高饱和度纯色大色块，明亮跳跃，主色 + 撞色搭配 | `bright bold colors, high saturation, color block design, contrasting palette` |
| 3 | 五官比例 | 眼睛偏小且偏简化（小圆点 / 短弧线），鼻嘴极简甚至省略 | `simplified facial features, small expressive eyes, minimalist nose and mouth` |
| 4 | 头身比例 | 5-6 头身（成年），3-4 头身（萌系角色），偏修长 | `5-6 head body proportion, slightly elongated figure` |
| 5 | 光影风格 | 极简平涂，仅一层硬边阴影，无柔和渐变 | `flat shading, single hard-edge shadow layer, no gradient` |
| 6 | 构图美学 | 中式留白 / 几何分割 / 装饰性边框 / 现代图形语言 | `geometric composition, Chinese minimalist layout, decorative graphic elements` |

---

## 二、整体风格与质感

| 维度 | 要求 |
|---|---|
| **画风时代** | 2015 后的中国动画工业风，区别于早期日漫模仿期 |
| **媒介感** | 数字 vector / Flash 动画质感，类电视动画帧 |
| **配色方案** | 高饱和明亮（朱红 / 亮黄 / 青蓝 / 嫩绿）+ 撞色搭配，避免低饱和柔色 |
| **背景处理** | 扁平几何背景 / 简化场景轮廓 / 中式留白纯色块 |
| **光影逻辑** | 不模拟真实光，纯设计感的明暗分块 |

---

## 三、Prompt 关键词词典

| 类别 | 关键词组合 |
|---|---|
| **必出基础词** | `modern Chinese anime style, flat design, geometric shapes, bright bold colors, high saturation` |
| **角色描绘** | `simplified facial features, sharp clean lineart, vector-style outlines, single-layer flat shading` |
| **画风强化** | `Luo Xiaohei aesthetic, contemporary Chinese animation, designer illustration, color block composition` |
| **场景类型** | `urban street, modern Chinese cityscape, school classroom, hutong alley, neon-lit nightscape` |

**完整 prompt 模板（示例）**：
```
modern Chinese anime style, flat design with bright bold colors and high saturation,
simplified facial features with small expressive eyes, sharp clean vector-style lineart,
single-layer hard-edge flat shading, geometric color block composition,
[CHARACTER: <发色 / 服装 / 表情>], [SCENE: <场景描述>],
contemporary Chinese animation aesthetic, designer illustration feel,
5-6 head body proportion, decorative graphic background, 16:9
```

---

## 四、模型推荐

| 场景 | 推荐 | 备选 | 备注 |
|---|---|---|---|
| 单角色立绘 | seedream | qwen | seedream 二次元基础好，qwen 更懂中式美学 |
| 中式场景 + 角色 | qwen | seedream | qwen 国风构图理解强 |
| 多角色群像 | seedream | midjourney | seedream 主体一致性更稳 |
| 含中文标题 | qwen | openai | qwen 中文渲染最好 |
| 角色多视图 | seedream + i2i | kontext | seedream 主体保留 + kontext 兜底 |

**只能用：nano_banana / kling / kontext / openai / midjourney / seedream / qwen**

---

## 五、默认参数（如不指定走这个）

| 参数 | 默认值 | 说明 |
|---|---|---|
| 模型 | seedream | 国漫现代主推（角色立绘 + 主体稳） |
| 比例 | 16:9（动画感）/ 9:16（海报）/ 1:1（角色头像） |  |
| 增强词 | `flat design, bright bold colors, vector-style outlines, single-layer flat shading` | 强化扁平识别度 |
| Negative | `realistic photo, photography, gradient shading, soft pastel colors, Japanese anime big eyes, painterly texture` | 防御画风混入日漫 / 厚涂 |

---

## 六、角色设计规范（保一致性必读）

不写这些 → 角色第二张就漂移到日漫风：

- **发型/发色 lock**：发色用纯色单色块（`solid black hair`, `bright red short hair`），不要渐变染色 / 高光闪片
- **眼睛 lock**：明确「small simplified eyes, single-color iris, no white highlight reflection」（防御日漫闪亮大眼睛）
- **服装关键元素**：现代中式元素（卫衣 + 国风刺绣 / 改良汉服 / 街头潮牌），明确颜色 hex 范围
- **体型/头身比**：明确「5-6 head body」(成年) / 「3-4 head body」(萌系)，防御日漫自动 7-8 头身
- **是否 i2i 加持**：seedream + i2i 强 cite，参考首张图保 35-50% 权重

**主体一致性 Lock 详细策略**：发色纯色单色块/简化眼睛/中式服装/头身比必须逐条锁定。

---

## 七、易错点（Watch For）

- **画成日漫风** — 写「Chinese anime」时模型默认套日漫五官 / 大眼睛 → 失去国漫识别度 → 强制加 `simplified facial features, small eyes, NOT Japanese anime style`
- **配色低饱和** — 用「莫兰迪」「奶油色」时 → 国漫现代标志性高饱和大色块丢失 → 锁 `high saturation, bright bold colors, color block design`
- **加渐变阴影** — 模型默认套日漫渐变 → 失去扁平 vector 感 → 加 `flat shading, single hard-edge shadow, NO gradient`
- **背景写实化** — 写「中国街道」时模型套真实摄影感 → 风格断层 → 加 `flat geometric background, simplified shapes`
- **头身比错乱** — 不锁就出 7-8 头身（日漫默认）→ 失去国漫修长设计感 → 锁 `5-6 head body proportion`
- **强用 midjourney** — midjourney 偏 painterly，强行出国漫现代会偏厚涂 → 改用 seedream / qwen

---

## 配套场景模板

| 场景 | 推荐组合 |
|---|---|
| 单人立绘 | seedream + 1:1 + 默认参数 |
| 角色多视图 | seedream + i2i 锁主体 + `character sheet, multiple views` |
| 同人插画 | qwen（中式）/ seedream（现代）|
| 漫画跨页 | seedream + 9:16 + `comic panel layout` |

---

## 配套 reference

本文件是 anime/cn-modern 子风格特化层。

- 防翻车铁律 → `../iron-laws.md`
- 跨子风格共用规则 → `../cross-substyle-rules.md`
- 默认参数 → `../defaults.md`
- 模型路由 → `../model-routing.md`
