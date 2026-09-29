# 10. 韩漫 webtoon (kr-webtoon)

> **优先质量维度**: Style Authenticity + Character Consistency（写实人体比例 + 跨格角色稳）
> **默认比例**: 9:16（竖版长条）/ 2:3（漫画格）
> **核心识别特征**: 写实人体比例 + 平滑渐变上色 + 锐利清晰 lineart + 长条竖屏阅读构图 — 类《女神降临》《看脸时代》《泛而不爱》视觉调性

---

## 一、子风格基因清单

> 韩漫 ≠ 日漫，区别在「写实化人体比例」「平滑渐变」「锐利 lineart」「长条竖屏」。
> 核心逻辑：基因 = 写实人体 × 平滑渐变 × 锐利描边 × 竖屏分镜。

| # | 基因维度 | 描述 | Prompt 关键词 |
|---|---|---|---|
| 1 | 笔触 | 数字绘画极锐利 lineart，描边均匀清晰无颤抖 | `sharp clean lineart, digital illustration, precise outlines` |
| 2 | 配色 | 平滑渐变上色 + 偏低饱和柔色 + 高级灰调 | `smooth gradient shading, soft muted palette, sophisticated color grading` |
| 3 | 五官比例 | 偏写实，眼睛中等大小（非日漫超大眼），鼻梁高挺，下颚清晰 | `realistic facial proportion, medium-sized eyes, high nose bridge, defined jawline` |
| 4 | 头身比例 | 8-9 头身写实人体（女性高挑 / 男性宽肩），腿长优势显著 | `8-9 head body realistic proportion, slender tall figure, long legs` |
| 5 | 光影风格 | 柔和渐变阴影 + 局部高光强调（眼睛 / 嘴唇 / 头发丝） | `smooth gradient shadows, selective highlights on hair and lips` |
| 6 | 构图美学 | 竖版长条单格分镜 / 大量单角色特写 / 留白多 / 适配手机滚动 | `vertical webtoon panel, single character close-up, generous white space` |

---

## 二、整体风格与质感

| 维度 | 要求 |
|---|---|
| **画风时代** | 2010 后韩国数字漫画工业，专为手机滚动阅读设计 |
| **媒介感** | 数字平板绘制，非传统纸笔，干净无颗粒 |
| **配色方案** | 高级感低饱和（米白 / 浅灰 / 雾蓝 / 雾粉），偶尔点缀强调色 |
| **背景处理** | 弱化 / 模糊化，焦点在角色；纯色 / 渐变 / 模糊街景 |
| **光影逻辑** | 柔和均匀，唯美感优先，少强戏剧光对比 |

---

## 三、Prompt 关键词词典

| 类别 | 关键词组合 |
|---|---|
| **必出基础词** | `Korean webtoon style, manhwa aesthetic, smooth gradient shading, sharp clean lineart` |
| **角色描绘** | `realistic body proportion, 8-9 head tall figure, defined facial features, glossy hair with selective highlights` |
| **画风强化** | `True Beauty webtoon style, Lookism aesthetic, Naver webtoon quality, vertical scroll comic` |
| **场景类型** | `school hallway, modern Seoul cafe, K-pop concert backstage, modern apartment, urban street at night` |

**完整 prompt 模板（示例）**：
```
Korean webtoon manhwa style, smooth gradient shading with sharp clean digital lineart,
[CHARACTER: <8-9 head body proportion, defined facial features, K-style fashion>],
realistic body anatomy, medium-sized expressive eyes, high nose bridge, defined jawline,
glossy hair with selective highlights, soft muted color palette,
[SCENE: <现代场景>] with blurred bokeh background,
vertical webtoon panel composition, generous negative space, 9:16
```

---

## 四、模型推荐

| 场景 | 推荐 | 备选 | 备注 |
|---|---|---|---|
| 单角色立绘 | seedream | midjourney | seedream 二次元 + 写实比例稳 |
| 多格漫画 | seedream + i2i | kontext | 跨格主体一致刚需 |
| 长条竖版 | seedream | midjourney | seedream 出竖版构图更稳 |
| 韩式时尚 | seedream | midjourney | midjourney 偏画意,seedream 更写实韩漫 |
| 含韩文对话框 | seedream + 后期 | openai | 韩文渲染都不强,纯底图 + 后期 |

**只能用：nano_banana / kling / kontext / openai / midjourney / seedream / qwen**

---

## 五、默认参数（如不指定走这个）

| 参数 | 默认值 | 说明 |
|---|---|---|
| 模型 | seedream | 韩漫主推（写实比例 + 主体稳） |
| 比例 | 9:16（默认竖版）/ 2:3（漫画格）/ 1:1（角色头像） |  |
| 增强词 | `smooth gradient shading, sharp clean lineart, realistic body proportion, soft muted palette` | 强化韩漫识别度 |
| Negative | `Japanese anime big eyes, chibi proportion, cel shading, vector flat design, low body proportion, oversaturated colors` | 防御画成日漫萌系 |

---

## 六、角色设计规范（保一致性必读）

不写这些 → 角色第二张就漂移到日漫大眼睛萌系：

- **发型/发色 lock**：明确「glossy realistic hair, individual strands, K-style cut」+ 颜色（韩漫常用纯黑 / 棕黑 / 浅棕 / 染色奶茶色）
- **眼睛 lock**：必须明写「medium-sized eyes, NOT oversized anime eyes, realistic eye shape, clear iris detail」（防御日漫大眼睛）
- **服装关键元素**：K-style 时尚（oversized 卫衣 / 校服 / 西装 / 连衣裙），明确品牌质感与剪裁
- **体型/头身比**：必须明写「8-9 head body, slender tall figure, long legs」（日漫默认 6-7 头身要破除）
- **是否 i2i 加持**：seedream + i2i 强 cite，长漫画必走 i2i，权重 45-60%
- **面部特征 lock**：「high nose bridge, defined jawline, full lips」（防御扁平化日漫脸）

**主体一致性 Lock 详细策略**：写实发型/中等眼睛/韩式服装/8-9头身/面部特征必须逐条锁定。

---

## 七、易错点（Watch For）

- **画成日漫大眼睛萌系** — 写「anime」时模型默认套日漫大眼睛 + 6 头身 → 失去韩漫写实感 → 强制 `medium-sized eyes, 8-9 head body, NOT Japanese anime`
- **头身比缩短** — 不锁就出 6-7 头身（日漫默认）→ 失去韩漫腿长优势 → 锁 `8-9 head body, slender tall figure`
- **配色高饱和** — 日漫高饱和混入 → 失去韩漫高级感 → 锁 `soft muted palette, sophisticated color grading`
- **加 cel shading** — 套日漫赛璐璐分块阴影 → 失去平滑渐变质感 → 加 `smooth gradient shading, NO cel shading`
- **横版构图** — 写漫画时默认横版（日漫 / 美漫习惯）→ 不适配 webtoon 竖版滚动 → 锁 `vertical webtoon panel, 9:16`
- **lineart 颤抖手绘感** — 套传统纸笔感 → 失去数字绘画干净度 → 加 `sharp clean digital lineart, precise outlines`
- **背景写实细节过多** — 焦点分散 → 失去 webtoon 角色为主特点 → 加 `blurred bokeh background, focus on character`

---

## 配套场景模板

| 场景 | 推荐组合 |
|---|---|
| 单人立绘 | seedream + 9:16 + 默认参数 |
| 角色多视图 | seedream + i2i 锁主体 + `character reference sheet` |
| 同人插画 | seedream + 9:16 + 韩式服装关键词 |
| 漫画跨页 | seedream + i2i + `vertical webtoon strip` |

---

## 配套 reference

本文件是 anime/kr-webtoon 子风格特化层。

- 防翻车铁律 → `../iron-laws.md`
- 跨子风格共用规则 → `../cross-substyle-rules.md`
- 默认参数 → `../defaults.md`
- 模型路由 → `../model-routing.md`
