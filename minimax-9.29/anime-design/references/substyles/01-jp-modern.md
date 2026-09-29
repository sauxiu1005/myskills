# 01. 日漫现代/萌系 (jp-modern)

> **优先质量维度**: Style Authenticity + Character Consistency（画风纯度 + 角色一致性）
> **默认比例**: 2:3（角色立绘）/ 16:9（场景）
> **核心识别特征**: 高饱和 cel shading + 高光通透大眼 + 玻璃感发丝高光 — 京阿尼/A-1 Pictures 现代主流派系

---

## 一、子风格基因清单

> 风格不是"看着像就行",必须可量化、可复现、可教学。
> 核心逻辑：基因 = cel shading 笔触 × 鲜艳配色 × 大眼 × 6-7 头身比 × 通透高光。

| # | 基因维度 | 描述 | Prompt 关键词 |
|---|---|---|---|
| 1 | 笔触 | 干净 cel shading、清晰 lineart、二值化阴影 | `cel shading, clean lineart, anime shading, sharp linework` |
| 2 | 配色 | 高饱和度、明亮通透、补色对比强 | `vibrant colors, saturated palette, bright tones` |
| 3 | 五官比例 | 大圆眼、高光多层、小鼻小嘴 | `large detailed eyes, multi-layer eye highlights, small nose` |
| 4 | 头身比例 | 6-7 头身、四肢修长 | `6-7 head body ratio, slender proportions` |
| 5 | 头发质感 | 玻璃光泽、块面高光、细丝飞起 | `glossy hair, anime hair highlights, flowing strands` |
| 6 | 光影风格 | 逆光通透、面颊腮红、空气感 | `rim lighting, soft cheek blush, atmospheric perspective` |

---

## 二、整体风格与质感

| 维度 | 要求 |
|---|---|
| **画风时代** | 2010 年后现代主流（京阿尼 / A-1 Pictures / CloverWorks 路线）|
| **媒介感** | 数字平涂为主、cel shading 二值化阴影、不带笔触颗粒 |
| **配色方案** | 高饱和、明亮、互补色搭配（粉蓝/橙绿）;天空多用清澈蓝青色 |
| **背景处理** | 干净精致、虚化前景突出角色、城市/校园/室内场景 |
| **光影逻辑** | 强调逆光、面光、轮廓光;阴影区使用降饱和度同色相 |

---

## 三、Prompt 关键词词典

| 类别 | 关键词组合 |
|---|---|
| **必出基础词** | `modern anime style, cel shading, vibrant colors, detailed anime eyes, anime illustration` |
| **角色描绘** | `large detailed eyes with highlights, glossy hair, slender 6-head body, soft cheek blush` |
| **画风强化** | `clean lineart, sharp anime linework, two-tone shading, atmospheric lighting, rim light` |
| **场景类型** | `school classroom, summer cityscape, sunset rooftop, cafe interior, blooming sakura` |

**完整 prompt 模板（示例）**：
```
modern anime style illustration, [character description with hair/eye/outfit lock],
cel shading, clean sharp lineart, vibrant saturated colors, large detailed eyes
with multi-layer highlights, glossy hair with anime highlights, soft cheek blush,
rim lighting, atmospheric perspective, [scene: school rooftop / summer city /
sakura bloom], 6-head body proportion, professional anime production quality
```

---

## 四、模型推荐

| 场景 | 推荐 | 备选 | 备注 |
|---|---|---|---|
| 单角色立绘 | seedream | midjourney | seedream 主体一致 + cel shading 纯正 |
| 多角色场景 | seedream | kontext | i2i 锁角色 + reference image |
| 校园/城市背景 | seedream | midjourney | midjourney 美学略软可备选 |
| 表情多视图 | seedream | kontext | kontext 主体保留强 |
| Q 版/SD | nano_banana | seedream | nano_banana 萌化精准 |

**只能用：nano_banana / kling / kontext / openai / midjourney / seedream / qwen**

---

## 五、默认参数（如不指定走这个）

| 参数 | 默认值 | 说明 |
|---|---|---|
| 模型 | seedream | 现代日漫风格匹配最高 |
| 比例 | 2:3 立绘 / 16:9 场景 / 1:1 头像 | 立绘竖构图为主 |
| 增强词 | `cel shading, vibrant, detailed eyes, anime production quality` | 必带 cel shading 防变厚涂 |
| Negative | `realistic photo, 3d render, painterly, watercolor, extra limbs, low quality, blurry, deformed face, malformed eyes` | 排除其他子风格污染 |

---

## 六、角色设计规范（保一致性必读）

不写这些 → 角色第二张就漂移：

- **发型/发色 lock**：必须明确写 hair length + style + color（如 `shoulder-length wavy chestnut hair with side-swept bangs`）
- **眼睛 lock**：颜色 + 形状 + 高光层数（如 `large round emerald green eyes with double highlights`）
- **服装关键元素**：领口形状 + 袖型 + 配饰（如 `sailor uniform with red ribbon, white knee-high socks`）
- **体型/头身比**：明确写 `6-head body ratio` 或 `7-head body ratio`，否则模型会乱给
- **是否 i2i 加持**：> 1 张图必须用第一张作为 reference image，否则脸型会变

**主体一致性 Lock 详细策略**：发型/发色/眼睛/服装关键元素必须逐条锁定。

---

## 七、易错点（Watch For）

- **混入吉卜力水彩感** — prompt 没写 `cel shading` 时模型会偏柔和水彩 → 失去现代日漫锐利感 → 必须显式加 `cel shading, sharp lineart`
- **眼睛太小变写实** — 没写 `large detailed eyes` → 模型给写实眼比例 → 萌系崩塌 → 加 `large round anime eyes with multi-layer highlights`
- **头身比例失调** — 没写 head ratio → 模型默认 5 头身或 8 头身 → 与日漫主流不符 → 显式 `6-7 head body ratio`
- **配色变莫兰迪** — 没写 vibrant → 模型偏低饱和文艺感 → 失去现代日漫鲜亮感 → 加 `vibrant saturated colors, bright palette`
- **lineart 太细变厚涂** — 没限制 lineart → 模型偏数字厚涂 → 失去 cel 质感 → 加 `clean sharp anime lineart, two-tone cel shading`
- **混入 painterly/3D** — 没排除 → 模型可能走油画或 3D 渲染 → 跑偏 → negative 加 `painterly, 3d render, oil painting, watercolor`

---

## 配套场景模板（这子风格能干啥用）

| 场景 | 推荐组合 |
|---|---|
| 单人立绘 | seedream + 2:3 + 完整发型/眼睛/服装 lock |
| 角色多视图 | seedream + i2i 第一张作 reference + 表情/姿势变化 |
| 校园日常插画 | seedream + 16:9 + 校服/制服 + 教室/操场场景 |
| 同人头像 | seedream + 1:1 + 半身特写 + 高光眼 |
| 治愈日常插画 | seedream + 16:9 + 室内/咖啡馆/夕阳 + 柔和光 |
| 节庆主题图 | seedream + 2:3 + 浴衣/圣诞装 + 节日道具 |
| 双人/CP 互动 | seedream + 3:4 + i2i 锁角色 + 校园/约会场景 |

---

## 配套 reference

本文件是 anime/jp-modern 子风格特化层。

- 防翻车铁律 → `../iron-laws.md`
- 跨子风格共用规则 → `../cross-substyle-rules.md`
- 默认参数 → `../defaults.md`
- 模型路由 → `../model-routing.md`
