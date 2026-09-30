# 14. 二次元赛博朋克 (cyberpunk)

> **优先质量维度**: Style Authenticity + Atmosphere & Lighting（赛博美学 + 霓虹氛围）
> **默认比例**: 16:9（电影感场景）/ 9:16（角色立绘）/ 21:9（宽幕概念图）
> **核心识别特征**: 霓虹高饱和配色（紫粉 + 青蓝）+ 未来都市背景 + 机甲义体元素 + 高对比强氛围 — **二次元化**的赛博朋克，非真人摄影风

---

## 一、子风格基因清单

> ⚠️ 这是 **二次元化** 的赛博朋克（漫画 / 动画 style），不是真人 photo style。
> 核心逻辑：基因 = 霓虹配色 × 未来都市 × 机甲义体 × 二次元笔触。

| # | 基因维度 | 描述 | Prompt 关键词 |
|---|---|---|---|
| 1 | 笔触 | 二次元 anime / 漫画 style 笔触，清晰描边 + 数字绘画质感 | `anime style cyberpunk, manga illustration, digital illustration, clean lineart` |
| 2 | 配色 | 霓虹高饱和（电光紫 / 霓虹粉 / 青蓝 / 荧光绿）+ 暗黑底色高对比 | `neon palette, hot pink and cyan, electric purple, vibrant glowing colors against dark background` |
| 3 | 五官比例 | 二次元化但偏酷帅，眼睛锐利带科技义眼光感，冷感表情 | `anime cyberpunk features, sharp expressive eyes with cybernetic glow, cool stoic expression` |
| 4 | 头身比例 | 7-8 头身偏写实（赛博机甲需身体比例支撑），高挑修长 | `7-8 head body, slender tall figure for cyber aesthetics` |
| 5 | 光影风格 | 强霓虹光源 + 边缘光（rim light）+ 反射光（街道湿地反射） | `neon rim lighting, multiple light sources, wet street reflections, atmospheric glow` |
| 6 | 标志元素 | 机甲义体 / 全息屏 / 霓虹招牌 / 朋克发色 / 未来都市 | `cybernetic implants, holographic displays, neon signs, futuristic megacity` |

---

## 二、整体风格与质感

| 维度 | 要求 |
|---|---|
| **画风时代** | 现代 anime / manga 风（《Cyberpunk: Edgerunners》《攻壳机动队》《阿基拉》调性） |
| **媒介感** | 二次元数字插画，清晰干净，**不是**真人摄影感 |
| **配色方案** | 暗调底（深蓝紫 / 黑）+ 霓虹高光（粉紫青）撞色，对比极强 |
| **背景处理** | 未来都市夜景 / 霓虹招牌密集 / 雨夜街道 / 高楼林立 |
| **光影逻辑** | 多光源混合（霓虹 + 全息 + 街灯），rim lighting 突出主体 |

---

## 三、Prompt 关键词词典

| 类别 | 关键词组合 |
|---|---|
| **必出基础词** | `anime cyberpunk style, neon-lit cyberpunk illustration, manga aesthetic, futuristic dystopia` |
| **角色描绘** | `cybernetic implants and augmentations, glowing visor or cyber eye, punk hair color, tech wear outfit` |
| **画风强化** | `Cyberpunk Edgerunners style, Ghost in the Shell aesthetic, Akira inspired, anime illustration NOT photo` |
| **场景类型** | `neon-lit megacity, rainy night street, holographic billboards, retrofuture Tokyo, cyber bar interior` |

**完整 prompt 模板（示例）**：
```
anime cyberpunk style, manga aesthetic NOT realistic photo,
[CHARACTER: <角色身份> with cybernetic implants and tech wear outfit],
glowing cyber eye / visor, punk hair color (pink / cyan / purple),
sharp expressive anime eyes with cool stoic expression, 7-8 head body slender figure,
[SCENE: neon-lit megacity at night with holographic billboards and wet street reflections],
neon palette (hot pink, cyan, electric purple) against dark blue-black background,
strong rim lighting and atmospheric neon glow, multiple light sources,
clean digital illustration with crisp lineart, 16:9 cinematic
```

---

## 四、模型推荐

| 场景 | 推荐 | 备选 | 备注 |
|---|---|---|---|
| 概念图 / 美术 | **midjourney** | seedream | midjourney 赛博美学最强 |
| 角色立绘 | **seedream** | midjourney | seedream 二次元角色 + 主体稳 |
| 都市夜景 | midjourney | seedream | midjourney 出氛围,seedream 出细节 |
| 角色 + 场景 | seedream | midjourney | seedream 角色更稳 + i2i 加持 |
| 角色多视图 | seedream + i2i | kontext | i2i 锁主体保 cyber 元素一致 |

**只能用：nano_banana / kling / kontext / openai / midjourney / seedream / qwen**

---

## 五、默认参数（如不指定走这个）

| 参数 | 默认值 | 说明 |
|---|---|---|
| 模型 | seedream（角色为主）/ midjourney（场景为主） | 双主推（角色 vs 场景分流） |
| 比例 | 16:9（场景默认）/ 9:16（角色立绘）/ 21:9（宽幕概念图） |  |
| 增强词 | `anime cyberpunk, neon palette, cybernetic implants, atmospheric neon glow, rim lighting, wet street reflections` | 强化赛博 + 二次元识别度 |
| Negative | **`realistic photo, photography, real person, photorealistic skin, 3d render movie style`**（核心防御真人化）+ `low contrast, muted colors, daylight bright sky, pastoral landscape` | 双重防御 |

---

## 六、角色设计规范（保一致性必读）

不写这些 → 角色第二张就漂移到真人 / 失去赛博元素：

- **发型/发色 lock**：明确「punk hair color (electric pink / cyan / purple / silver)」+ 朋克发型（不对称剪 / 渐变染 / 挑染）
- **眼睛 lock**：「sharp anime eyes with cybernetic glow OR glowing visor / cyber eye」（cyber 眼是核心标志）
- **服装关键元素**：必须明写 cyberpunk 元素（tech wear / 机甲外套 / 全息纹身 / LED 边饰 / 朋克皮衣）
- **义体细节 lock**：cybernetic implant 位置（手臂 / 颈部 / 脸侧）跨图保留，每个角色固定义体设计
- **是否 i2i 加持**：seedream + i2i 必走，权重 45-60%，保 cyber 标志元素不漂移
- **配色 lock**：每个角色绑定标志霓虹色（如「pink + cyan duo」），跨图保留

**主体一致性 Lock 详细策略**：朋克发色/cyber眼/tech wear/义体细节/霓虹配色必须逐条锁定。

---

## 七、易错点（Watch For）

- **配色不够 cyber 感** — 模型默认柔色或写实色 → 失去赛博识别 → 强制 `neon palette, hot pink + cyan + electric purple against dark background, vibrant glowing`
- **真人化失去二次元感** — 写 cyberpunk 时模型默认套真人 / 3D 电影感 → 失去 anime 风 → **必须**强制 `anime style, manga illustration, NOT realistic photo, NOT photorealistic`
- **背景空洞** — 角色 + 简单背景 → 失去赛博都市氛围 → 加 `dense neon-lit megacity background with holographic billboards`
- **缺 cyber 元素** — 只有未来感色调没机甲义体 → 失去赛博朋克核心 → 强制 `cybernetic implants, tech wear, glowing visor`
- **打光平淡** — 没用 rim lighting 多光源 → 缺氛围张力 → 锁 `strong neon rim lighting, multiple light sources, atmospheric glow`
- **场景明亮化** — 出白天明亮场景 → 失去赛博暗夜氛围 → 加 `night scene, dark atmosphere, NOT daylight`
- **混入西方奇幻** — 写 cyber 时模型混入魔法元素 → 风格断层 → 加 `sci-fi cyberpunk, NOT fantasy, NOT magic`

---

## 配套场景模板

| 场景 | 推荐组合 |
|---|---|
| 单人立绘 | seedream + 9:16 + 默认参数 |
| 角色多视图 | seedream + i2i 锁主体 + `cyberpunk character sheet` |
| 同人插画 | midjourney + 16:9 + `cyberpunk fan art` |
| 都市夜景 | midjourney + 21:9 + `neon megacity at night` |
| 漫画跨页 | seedream + 16:9 + `cyberpunk comic panel` |

---

## 配套 reference

本文件是 anime/cyberpunk 子风格特化层。强调二次元化，与真人赛博风分流。

- 防翻车铁律 → `../iron-laws.md`
- 跨子风格共用规则 → `../cross-substyle-rules.md`
- 默认参数 → `../defaults.md`
- 模型路由 → `../model-routing.md`
