# 11. 韩式厚涂立绘 (kr-paint)

> **优先质量维度**: Style Authenticity + Texture Quality（厚涂质感 + 笔触肌理）
> **默认比例**: 2:3（立绘标准）/ 3:4（半身立绘）/ 9:16（全身立绘）
> **核心识别特征**: painterly 厚涂笔触 + 强烈肌理感 + 油画质感色彩 + 立绘构图（孤立角色 + 装饰背景）— 类游戏卡牌立绘 / 韩国 painter 圈风格

---

## 一、子风格基因清单

> 厚涂 ≠ 平涂，区别在「可见的笔触」「肌理感」「颜料堆叠感」「无明显 lineart」。
> 核心逻辑：基因 = 厚涂笔触 × 颜料堆叠 × 油画质感 × 立绘聚焦。

| # | 基因维度 | 描述 | Prompt 关键词 |
|---|---|---|---|
| 1 | 笔触 | 可见笔触感，颜料堆叠层次，无（或极弱）描边线 | `painterly brushstrokes, visible paint texture, impasto technique, no lineart` |
| 2 | 配色 | 油画质感丰富色相，混色过渡丰富，明暗对比强烈 | `oil painting colors, rich tonal range, saturated dramatic palette` |
| 3 | 五官比例 | 偏写实但理想化，眼睛精致细节，皮肤质感丰富有血色 | `idealized realistic features, intricate eye details, fleshy skin tones` |
| 4 | 头身比例 | 7-8 头身偏写实，肌肉骨骼立体感强，姿态优雅 | `7-8 head body realistic anatomy, strong muscle definition, elegant pose` |
| 5 | 光影风格 | 强烈电影级光影，伦勃朗光 / 边缘光 / 体积光，明暗对比戏剧化 | `dramatic cinematic lighting, rim lighting, volumetric light, strong chiaroscuro` |
| 6 | 构图美学 | 立绘居中聚焦 / 装饰性背景虚化 / 角色占面 70%+ | `character-focused composition, decorative blurred background, character occupies 70% of frame` |

---

## 二、整体风格与质感

| 维度 | 要求 |
|---|---|
| **画风时代** | 2015 后韩国 painter 圈与卡牌游戏立绘工业风 |
| **媒介感** | 数字厚涂模拟油画质感，类 Photoshop 油画笔刷 |
| **配色方案** | 高饱和深色调 + 局部强对比高光，金 / 银 / 暗红 / 翡翠为主 |
| **背景处理** | 虚化装饰性背景（光晕 / 雾气 / 抽象色块），不抢主体 |
| **光影逻辑** | 电影级戏剧布光，主体明暗对比极强，背景压暗 |

---

## 三、Prompt 关键词词典

| 类别 | 关键词组合 |
|---|---|
| **必出基础词** | `painterly Korean illustration, thick paint texture, impasto brushstrokes, oil painting feel` |
| **角色描绘** | `idealized realistic features, intricate detail rendering, fleshy skin tones, character splash art` |
| **画风强化** | `Korean game card art, MMORPG character illustration, ArtStation trending, masterpiece painterly` |
| **场景类型** | `mystical altar, dark fantasy throne, ethereal mist background, decorative ornamental backdrop` |

**完整 prompt 模板（示例）**：
```
painterly Korean illustration with thick paint texture and impasto brushstrokes,
oil painting feel with rich tonal range, NO lineart, visible brushwork,
[CHARACTER: <角色身份 / 服装 / 武器 / 姿态>], idealized realistic features,
intricate detail rendering on costume and accessories, dramatic cinematic lighting,
strong rim lighting and volumetric god rays, decorative blurred background with light particles,
7-8 head body realistic anatomy, character splash art composition, 2:3 vertical
```

---

## 四、模型推荐

| 场景 | 推荐 | 备选 | 备注 |
|---|---|---|---|
| 角色立绘 | **seedream** | midjourney | seedream 立绘强项 + i2i 保主体 |
| 概念美术 | midjourney | seedream | midjourney painterly 美学最强 |
| 卡牌全身像 | seedream | midjourney | seedream 适配 2:3 立绘比例 |
| 半身像 | seedream | midjourney | seedream 细节渲染强 |
| 角色多视图 | seedream + i2i | kontext | 厚涂跨图保细节难，必走 i2i |

**只能用：nano_banana / kling / kontext / openai / midjourney / seedream / qwen**

---

## 五、默认参数（如不指定走这个）

| 参数 | 默认值 | 说明 |
|---|---|---|
| 模型 | seedream | 韩式厚涂主推（立绘强项） |
| 比例 | 2:3（默认立绘）/ 3:4（半身）/ 9:16（全身海报） |  |
| 增强词 | `painterly brushstrokes, thick paint texture, dramatic cinematic lighting, masterpiece quality, ArtStation trending` | 强化厚涂质感 |
| Negative | `flat shading, vector outlines, cel shading, sharp clean lineart, anime style flat colors, cartoon, low quality` | 防御画成平涂日漫 |

---

## 六、角色设计规范（保一致性必读）

不写这些 → 角色第二张就漂移到平涂日漫风：

- **发型/发色 lock**：明确「painterly hair with visible brushstrokes, individual hair clusters」+ 颜色（厚涂常用深色暗调 + 局部高光）
- **眼睛 lock**：「intricate detail eyes with painterly highlights, no flat anime eye style」（防御扁平日漫眼）
- **服装关键元素**：必须明写质感（金属铠甲反光 / 丝绸光泽 / 皮革纹理 / 宝石折射），厚涂的核心展示点
- **体型/头身比**：明确「7-8 head body realistic anatomy, defined muscle structure」（防御 Q 化或扁平化）
- **是否 i2i 加持**：seedream + i2i 必走，权重 50-65%；细节多无 i2i 必漂移
- **配饰细节 lock**：武器 / 法器 / 首饰每个都要单独描述并锁定（厚涂的标志是装饰细节多）

**主体一致性 Lock 详细策略**：厚涂发型/精细眼睛/质感服装/装饰细节必须逐条锁定。

---

## 七、易错点（Watch For）

- **平涂丧失厚涂质感** — 没强调 painterly 时模型默认平涂 → 失去厚涂识别度 → 强制 `painterly brushstrokes, thick paint texture, NO flat shading`
- **加 lineart 描边** — 套日漫描边逻辑 → 厚涂特征丢失（厚涂无明显描边）→ 加 `no lineart, no outline, only painterly brushwork`
- **配色低饱和** — 默认柔色调 → 失去厚涂油画质感 → 锁 `oil painting colors, rich tonal range, saturated dramatic palette`
- **背景细节过多** — 装饰背景画成实景 → 抢主体焦点 → 加 `decorative blurred background, NOT detailed environment`
- **头身比缩短** — 出 6 头身日漫比例 → 失去厚涂立绘的优雅修长 → 锁 `7-8 head body realistic anatomy`
- **强用 nano_banana** — nano_banana 偏简洁，画不出厚涂质感 → 改 seedream 或 midjourney
- **打光太均匀** — 没用电影级布光 → 缺戏剧性 → 强制 `dramatic chiaroscuro, rim lighting, volumetric god rays`

---

## 配套场景模板

| 场景 | 推荐组合 |
|---|---|
| 单人立绘 | seedream + 2:3 + 默认参数 |
| 卡牌设计 | seedream + 2:3 + `splash art composition` |
| 概念图 | midjourney + 16:9 + painterly 强化词 |
| 半身像 | seedream + 3:4 + `bust portrait` |

---

## 配套 reference

本文件是 anime/kr-paint 子风格特化层。

- 防翻车铁律 → `../iron-laws.md`
- 跨子风格共用规则 → `../cross-substyle-rules.md`
- 默认参数 → `../defaults.md`
- 模型路由 → `../model-routing.md`
