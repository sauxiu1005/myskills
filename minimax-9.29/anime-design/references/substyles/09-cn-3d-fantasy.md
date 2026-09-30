# 09. 国漫 3D 玄幻 (cn-3d-fantasy)

> **优先质量维度**: Style Authenticity + Lighting & Effects（电影级 3D 质感 + 强光效张力）
> **默认比例**: 16:9（电影感）/ 21:9（宽幕史诗）
> **核心识别特征**: CG 电影级 3D 渲染 + 玄幻仙侠题材 + 强光效粒子 + 东方水墨融合 — 类《雾山五行》《姜子牙》《新神榜：哪吒重生》视觉调性

---

## 一、子风格基因清单

> 这是 anime 体系下唯一**主推 3D 渲染**的子风格,需明确区分于 2D 国漫现代/仙侠。
> 核心逻辑：基因 = 电影级 3D × 玄幻光效 × 东方美学 × 史诗构图。

| # | 基因维度 | 描述 | Prompt 关键词 |
|---|---|---|---|
| 1 | 渲染方式 | 全 3D CG 建模渲染，类电影级动画质感，非 2D 平面 | `cinematic 3D rendering, CG animation, full 3D modeling, NOT 2D` |
| 2 | 光效粒子 | 强光效爆发 / 灵气粒子 / 法术能量场 / 飘落花瓣 | `magical particles, energy effects, ethereal glow, divine light burst` |
| 3 | 五官比例 | 偏写实 3D 比例 + 东方面孔特征，眼睛比 2D 略小但更立体 | `realistic 3D facial proportion, oriental face features, expressive eyes with depth` |
| 4 | 头身比例 | 7-8 头身写实 3D 比例，肌肉骨骼立体感强 | `7-8 head body 3D proportion, anatomically detailed` |
| 5 | 光影风格 | PBR 物理光照 + 全局光照 + 体积光 + 强对比电影级布光 | `PBR materials, global illumination, volumetric lighting, cinematic dramatic lighting` |
| 6 | 题材元素 | 玄幻 / 仙侠 / 神话 / 妖魔 / 法宝 / 道场 / 山海经 | `xianxia fantasy, divine deities, mythological creatures, magical artifacts` |

---

## 二、整体风格与质感

| 维度 | 要求 |
|---|---|
| **画风时代** | 2019 后中国 3D 动画工业崛起期，比肩好莱坞 CG 制作 |
| **媒介感** | 电影院大银幕级 CG 渲染，非游戏即时渲染 |
| **配色方案** | 高对比度（亮金 + 深蓝紫 / 朱红 + 墨黑 / 翡翠绿 + 金箔），强烈戏剧色温 |
| **背景处理** | 立体 3D 仙境场景（云海 / 山门 / 神殿 / 法阵），景深焦点强 |
| **光影逻辑** | 全模拟真实物理光，体积光穿透云雾，强烈高光与阴影对比 |

---

## 三、Prompt 关键词词典

| 类别 | 关键词组合 |
|---|---|
| **必出基础词** | `cinematic 3D Chinese animation, CG rendering, xianxia fantasy aesthetic, dramatic lighting` |
| **角色描绘** | `realistic 3D character modeling, oriental face features, intricate fantasy costume, flowing fabric simulation` |
| **画风强化** | `Light Chaser Animation style, Nezha Reborn aesthetic, Wuhuapop CG quality, blockbuster animated film` |
| **场景类型** | `celestial palace, mystical mountain shrine, ethereal cloud sea, divine battlefield, ancient temple ruins` |

**完整 prompt 模板（示例）**：
```
cinematic 3D Chinese animation, CG rendering with PBR materials and global illumination,
xianxia fantasy aesthetic, [CHARACTER: <修仙者 / 神祇 / 妖魔> with intricate fantasy costume],
flowing hanfu / armor with detailed fabric simulation, magical energy particles surrounding,
ethereal glow and volumetric god rays, dramatic cinematic lighting,
[SCENE: <仙山云海 / 神殿 / 法阵>], 7-8 head body realistic 3D proportion,
blockbuster animated film quality, ultra-detailed, 16:9 cinematic
```

---

## 四、模型推荐

| 场景 | 推荐 | 备选 | 备注 |
|---|---|---|---|
| 3D 角色立绘 | **kling** | seedream | kling 是国内 3D 渲染强项,seedream 偏 2D |
| 玄幻战斗场景 | kling | midjourney | kling 出 3D 动作戏，midjourney 偏 painterly |
| 法宝 / 道具静物 | kling | seedream | kling 物理材质感强 |
| 多角色群像 | kling | midjourney | 3D 群像 kling 优势明显 |
| 概念图 / 海报 | midjourney | kling | midjourney 美学构图,kling 出最终成片 |

**只能用：nano_banana / kling / kontext / openai / midjourney / seedream / qwen**

---

## 五、默认参数（如不指定走这个）

| 参数 | 默认值 | 说明 |
|---|---|---|
| 模型 | **kling** | 唯一主推 kling 的 anime 子风格（3D 强项） |
| 比例 | 16:9（默认电影感）/ 21:9（史诗宽幕）/ 9:16（人物立绘竖版海报） |  |
| 增强词 | `cinematic 3D rendering, PBR materials, volumetric lighting, magical particles, ultra-detailed` | 强化 3D 电影质感 |
| Negative | `2D anime, flat shading, cel shading, vector outlines, hand-drawn lineart, painterly brushstroke, low-poly game render` | 防御出 2D / 低质 3D |

---

## 六、角色设计规范（保一致性必读）

不写这些 → 角色第二张就漂移到 2D 或低质 3D：

- **发型/发色 lock**：明确「flowing 3D hair simulation, individual strands」+ 颜色（玄幻常用墨黑 / 银白 / 朱红 / 玄青）
- **眼睛 lock**：「3D realistic eyes with depth, oriental almond shape」（防御 2D 大眼睛 / 西方眼型）
- **服装关键元素**：玄幻服饰必须细节锁（汉服层次 / 法器纹样 / 飘带 / 玉佩 / 铠甲花纹），明确 PBR 材质（丝绸 / 金属 / 玉石）
- **体型/头身比**：明确「7-8 head body realistic 3D anatomy」，防御 Q 化或 2D 化
- **是否 i2i 加持**：kling 支持 i2i 保主体，权重 40-55%；多角色场景必走 i2i
- **法术 / 法宝特效**：每个角色绑定固定光效色（朱红火 / 青金雷 / 翡翠木），跨图保留

**主体一致性 Lock 详细策略**：3D发型/写实眼睛/玄幻服饰/头身比/法术特效必须逐条锁定。

---

## 七、易错点（Watch For）

- **用 seedream 出 2D 风** — seedream 二次元基因偏 2D,出来是平面化国漫不是 3D → 失去玄幻 3D 质感 → 强制改 kling
- **粒子光效堆砌过度** — 满屏特效遮主体 → 角色识别度丢失 → 控制粒子在角色周围 30% 占面以内
- **头身比 Q 化** — 不锁就出 5-6 头身（日漫默认）→ 失去史诗感 → 锁 `7-8 head body realistic 3D`
- **西方奇幻混入** — 写 fantasy 时模型套巫师法袍 / 哥特元素 → 失去东方韵 → 加 `xianxia, hanfu, oriental, NOT western fantasy`
- **低质 3D 游戏感** — 出 PS2 时代低多边形游戏感 → 不够电影级 → 加 `blockbuster animated film quality, ultra-detailed PBR materials`
- **平面化打光** — 没用电影级布光 → 缺戏剧张力 → 锁 `volumetric god rays, dramatic cinematic lighting, strong contrast`
- **服装现代化** — 写 character 时模型默认现代服 → 失去玄幻题材 → 强制 `flowing hanfu / fantasy armor with intricate patterns`

---

## 配套场景模板

| 场景 | 推荐组合 |
|---|---|
| 单人立绘 | kling + 9:16 + 默认参数 + `hero pose with magical aura` |
| 角色多视图 | kling + i2i 锁主体 + `character turnaround sheet` |
| 同人插画 | kling + 16:9 + `epic battle scene with magical effects` |
| 电影海报 | midjourney 出概念 + kling 出成片 + 21:9 |

---

## 配套 reference

本文件是 anime/cn-3d-fantasy 子风格特化层。注意是唯一主推 kling 的子风格。

- 防翻车铁律 → `../iron-laws.md`
- 跨子风格共用规则 → `../cross-substyle-rules.md`
- 默认参数 → `../defaults.md`
- 模型路由 → `../model-routing.md`
