# 二次元/动漫子风格 → 模型映射

> 模型清单基于团队真实可调能力（截至 2026-04），新增/退役模型时请同步更新。

> **何时 read**：派单选模型时按本表对照——不同子风格有强模型偏好（萌系 / webtoon 走 seedream；ghibli / shinkai 走 midjourney；3D 玄幻走 kling；国风水墨走 qwen；多视图角色一致走 kontext）。

## 子风格 → 推荐模型

| slug | 推荐 | 备选 | 备注 |
|---|---|---|---|
| jp-modern | seedream | midjourney | 萌系角色立绘，i2i 保主体强项 |
| jp-retro | seedream | midjourney | 90s 复古笔触，需明确 retro 关键词 |
| jp-shonen | seedream | midjourney | 动感线条 + 战斗特效 |
| jp-shojo | midjourney | seedream | 浪漫光感 / 闪光粒子艺术性强 |
| ghibli | midjourney | seedream | 水彩背景 + 治愈氛围必走 mj |
| shinkai | midjourney | kling | 城市光线粒子 / 电影感 |
| cn-xianxia | qwen | midjourney | 中文 prompt + 水墨 + 汉服强项 |
| cn-modern | seedream | qwen | 国漫扁平几何，中文场景走 qwen |
| cn-3d-fantasy | **kling** | seedream | 3D 玄幻必走 kling，电影级光效 |
| kr-webtoon | seedream | midjourney | webtoon 写实人体 + 平滑渐变 |
| kr-paint | midjourney | seedream | painterly 厚涂笔触 |
| us-cartoon | midjourney | nano_banana | Disney-Pixar 美学 |
| q-version | seedream | nano_banana | Q 版 chibi 强项 |
| cyberpunk | midjourney | kling | 霓虹 / 机甲 / 雨夜美学 |

## 角色一致性 / 多视图 → 模型路由

| 场景 | 推荐 | 备选 | 说明 |
|---|---|---|---|
| 单图首抽（建 Lock 参考图）| 按子风格选 | - | t2i 出锁定参考图后保存 |
| 同角色多视图（正/侧/背）| **kontext** | seedream | kontext 多视图角色一致是 FLUX 系强项 |
| 同角色多表情 / 多动作 | **seedream** | kontext | seedream + i2i 主体保留 |
| 多角色同场景 | kontext | seedream | 多角色一致需 FLUX 系 |
| Q 版周边衍生（从主形象转 Q 版）| seedream | nano_banana | seedream 风格转换准 |
| **Q 版 chibi 多视图 / character sheet** | **seedream**（唯一）| - | nano_banana 在 chibi 多视图上断头 / 比例混乱 / 4 格不对齐，禁用 |
| **Q 版 chibi 表情包套装（同 IP 多表情）**| **seedream** | nano_banana（仅短 batch ≤ 3 张）| seedream 角色一致性 + 表情差分远超 banana，长 batch（≥ 4 张）必走 seedream |

## 含中文文字 vs 纯底图

| 文字情况 | 推荐策略 + 模型 |
|---|---|
| 全英文拟声词（BOOM / WHAM / POW，≤ 6 字）| openai 直接嵌入 |
| 中文 ≤ 4 字（艺术化标题 / logo）| qwen 直接嵌入 |
| **漫画对话框中文长台词、多框分镜中文** | **任意模型走纯底图策略 + 后期加文字 + 字体** |
| 模板替换（已有漫画模板换台词）| kontext（保版式编辑）|

## 选模型反模式

| 错误 | 后果 |
|---|---|
| 真人写实任务用 seedream | 强行二次元化，写实失真；写实任务应走真人画像模型 |
| 二次元中文长台词直接生成（seedream / midjourney / kling）| 错字 / 缺笔画 / 字形像素糊；应走纯底图 + 后期，或 qwen / openai 仅用于短标题 |
| 严格主体一致的角色多视图用 midjourney t2i 多次抽奖 | 主体漂移（每张发色 / 服饰对不上）；应改用 kontext 多视图或 seedream + i2i |
| 国风仙侠水墨用 midjourney + 纯英文 prompt | 失去中文模型对汉服 / 水墨笔触理解；应用 qwen + 中文 prompt |
| 国漫 3D 玄幻用 seedream / midjourney | 出 2D 平面图缺电影 CG 感；应改用 kling |
| ghibli / shinkai 走 seedream | 缺水彩 / 光线粒子艺术性；应走 midjourney |
| Q 版周边走 midjourney 大图 | midjourney 偏写实头身比，Q 版 chibi 走 seedream |
| 漫画分镜系列首张直接 t2i 不存参考图 | 后续分镜全靠抽奖角色对不上；首图必须保存为 Lock 参考图供后续 i2i |
| Q 版 chibi 多视图 / character sheet 用 nano_banana | 4 视图断头 / 比例混乱 / 格式不对齐；多视图必须固定 seedream |
| 长 batch chibi 表情包（≥ 4 张同 IP）用 nano_banana | 角色一致性差 / 风格漂移；长 batch 必须 seedream |

## 配套 reference

本文件是二次元/动漫场景的模型路由层。

- 防翻车铁律 → `iron-laws.md`
- 子风格索引 → `substyles-index.md`
- 子风格速查 → `substyles-quick-ref.md`
- 跨子风格共用规则 → `cross-substyle-rules.md`
- 默认参数 → `defaults.md`
