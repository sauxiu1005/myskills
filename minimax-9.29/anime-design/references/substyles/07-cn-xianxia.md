# 07. 国漫仙侠/水墨 (cn-xianxia)

> **优先质量维度**: Style Authenticity + Cultural Accuracy（中式美学纯度 + 服饰文化准确）
> **默认比例**: 2:3（人物立绘）/ 16:9（场景）/ 3:4（条幅长卷）
> **核心识别特征**: 水墨晕染 + 飘逸汉服 + 仙气云雾 + 空灵留白 — 灵笼 / 雾山五行 / 哪吒 国漫仙侠派系

---

## 一、子风格基因清单

> 风格不是"看着像就行",必须可量化、可复现、可教学。
> 核心逻辑：基因 = 水墨晕染 × 汉服飘逸 × 仙气云雾 × 国风留白 × 中式五官。

| # | 基因维度 | 描述 | Prompt 关键词 |
|---|---|---|---|
| 1 | 笔触 | 水墨晕染 + 国画线条 + 半厚涂 | `chinese ink wash painting elements, traditional brushwork, semi-painterly` |
| 2 | 配色 | 中式低饱和 + 朱红/青绿/赭石 + 水墨黑白 | `chinese traditional palette, vermillion, jade green, ochre, ink black, low saturation` |
| 3 | 服饰文化 | 汉服 / 唐装 / 道袍 + 飘带 + 玉佩 | `flowing hanfu, traditional chinese robe, silk ribbons, jade pendant, hair crown` |
| 4 | 五官比例 | 中式细长丹凤眼 + 柳叶眉 + 樱桃唇 | `chinese phoenix eyes, willow brow, cherry lips, oriental beauty features` |
| 5 | 仙侠氛围 | 云雾缭绕 + 飞剑 + 仙鹤 + 灵气 | `misty clouds swirl, flying sword, immortal crane, spiritual energy aura` |
| 6 | 构图美学 | 国画留白 + 山水远景 + 云中楼阁 | `chinese painting composition, negative space, distant mountains, cloud palace` |

---

## 二、整体风格与质感

| 维度 | 要求 |
|---|---|
| **画风时代** | 现代国漫仙侠（2018 后哪吒 / 雾山五行 / 灵笼 / 一人之下 路线）|
| **媒介感** | 水墨 + 数字半厚涂 + 国画质感;**禁止**日漫 cel shading 干净感 |
| **配色方案** | 中式低饱和 + 朱红 / 青绿 / 赭石 / 水墨黑白、强调单色调统一 |
| **背景处理** | 水墨远山 + 飘逸云雾 + 中式建筑 / 仙山楼阁 + 大量留白 |
| **光影逻辑** | 柔和散光、灵气光晕、朱砂红 / 月白蓝主光 |

---

## 三、Prompt 关键词词典

| 类别 | 关键词组合 |
|---|---|
| **必出基础词** | `chinese xianxia anime style, traditional chinese aesthetic, ink wash painting elements, donghua style` |
| **角色描绘** | `flowing hanfu robe, phoenix eyes, willow brow, jade hair crown, silk ribbons flowing in wind, oriental beauty` |
| **画风强化** | `chinese ink wash, semi-painterly brushstrokes, low saturation traditional palette, ethereal misty atmosphere, chinese painting composition` |
| **场景类型** | `misty mountain peaks with cloud sea, ancient chinese palace floating in clouds, bamboo forest, jade lake with crane, immortal cultivation realm` |

**完整 prompt 模板（示例）**：
```
chinese xianxia donghua style illustration, traditional chinese aesthetic,
[character: hanfu color/style, hair style with jade crown, weapon if any],
flowing silk hanfu robe with traditional embroidery, phoenix eyes with
willow-shaped brow, oriental beauty features, long flowing black hair
with traditional jade hair crown, silk ribbons flowing in spiritual wind,
chinese ink wash painting background with ethereal misty mountains,
low saturation traditional palette of jade green and vermillion,
spiritual energy aura, [scene: misty mountain peak / cloud palace /
bamboo grove with crane / immortal cultivation realm], chinese painting
composition with negative space, semi-painterly brushwork, donghua
production quality
```

---

## 四、模型推荐

| 场景 | 推荐 | 备选 | 备注 |
|---|---|---|---|
| 单人汉服立绘 | qwen | midjourney | qwen 中式美学 + 汉服细节最准 |
| 水墨山水场景 | qwen | midjourney | qwen 中国风训练数据强 |
| 仙侠氛围插画 | qwen | midjourney | qwen 主推；midjourney 备用 |
| 多角色对决 | qwen | seedream | seedream 备用做主体一致 |
| 古装写真风 | qwen | midjourney | qwen 服饰理解准确 |

**只能用：nano_banana / kling / kontext / openai / midjourney / seedream / qwen**

---

## 五、默认参数（如不指定走这个）

| 参数 | 默认值 | 说明 |
|---|---|---|
| 模型 | qwen | 中文理解 + 中式美学最强 |
| 比例 | 2:3 立绘 / 16:9 场景 / 3:4 长卷 | 竖构图突出汉服飘逸 |
| 增强词 | `chinese xianxia, hanfu, ink wash, ethereal mist, traditional palette, donghua` | 必带 chinese 防日漫化 |
| Negative | `japanese anime style, kimono, modern clothing, vibrant saturated, cel shading, sparkly moe, sharp anime lineart, western fantasy, extra limbs, low quality` | 排除日漫和西方污染 |

---

## 六、角色设计规范（保一致性必读）

不写这些 → 角色立马跑偏成日漫和服或西方仙女：

- **发型 lock**：必须**汉式**（如 `long black hair in traditional chinese updo with jade crown`、`half-up half-down style with pearl hairpin`），避免日漫双马尾
- **眼睛 lock**：**中式细长丹凤眼**（如 `narrow phoenix eyes with cool gaze`、`upturned almond eyes with eyeliner`），避免日漫大圆眼
- **服装关键元素**：必须明确**汉服形制**（齐胸襦裙 / 道袍 / 广袖大衫 / 唐圆领袍），加颜色 + 纹样（如 `white flowing hanfu with crane embroidery, jade green silk underrobe`）
- **配饰 lock**：玉佩 / 流苏 / 香囊 / 剑 / 拂尘（如 `jade pendant at waist, silk tassels flowing, immortal sword on back`）
- **气质 lock**：仙气 / 清冷 / 飘逸 / 凛然（**禁止**萌系可爱）
- **是否 i2i 加持**：> 1 张图必须 reference + 中式关键词重复

**主体一致性 Lock 详细策略**：汉式发型/丹凤眼/汉服形制/配饰必须逐条锁定，保持中式特征。

---

## 七、易错点（Watch For）

- **画成日漫和服** — 没明确写 hanfu → 模型默认日本和服 → 文化错乱 → 必须 `flowing chinese hanfu, NOT japanese kimono` + negative `kimono`
- **眼睛画成日漫大圆眼** — 默认日漫训练 → 失去中式凤眼 → `narrow chinese phoenix eyes, oriental almond eyes, NOT large anime eyes`
- **配色太鲜艳** — 给 vibrant → 失去中式低饱和雅致 → `traditional chinese low saturation palette, jade green and vermillion accents`
- **背景太干净** — 默认精致背景 → 失去水墨晕染感 → `chinese ink wash background, painterly mist, traditional brushstrokes`
- **缺仙气云雾** — 没加 mist/cloud → 失去仙侠氛围 → `ethereal misty atmosphere, spiritual cloud swirl, immortal aura`
- **服饰朝代错乱** — 没指定朝代 → 唐宋明混搭 → 文化不准 → 必须指定（如 `tang dynasty style hanfu` 或 `ming dynasty hanfu`）
- **加了西方奇幻元素** — 模型混入西方 fantasy → 翅膀/魔法阵跑偏 → negative `western fantasy, magic circle, fairy wings`

---

## 配套场景模板（这子风格能干啥用）

| 场景 | 推荐组合 |
|---|---|
| 单人汉服立绘 | qwen + 2:3 + 完整汉服 lock + 仙气环境 |
| 水墨山水 | qwen + 16:9 + 远山云海 + 留白 |
| 双人对剑 | qwen + 16:9 + 飞剑 + 飘逸打斗 |
| 长卷国风 | qwen + 3:4 / 9:16 + 山水 + 楼阁 + 人物点缀 |

---

## 配套 reference

本文件是 anime/cn-xianxia 子风格特化层。

- 防翻车铁律 → `../iron-laws.md`
- 跨子风格共用规则 → `../cross-substyle-rules.md`
- 默认参数 → `../defaults.md`
- 模型路由 → `../model-routing.md`
