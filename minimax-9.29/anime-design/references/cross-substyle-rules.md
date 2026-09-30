# 二次元/动漫跨子风格共用规则

> **何时 read**：写任意子风格 brief 时检查这些通用必填项 / 共用规则；做系列作品 / 多视图 / IP 衍生时尤其要逐条对照。

## 跨子风格共用规则

1. **比例必须显式声明** — 每个子风格默认比例不同（详见 `defaults.md`）。立绘默认 9:16 或 2:3；条漫强制竖版 9:16；3D CG 走 16:9。**禁止**默认 1:1，无明确比例 AskUserQuestion。

2. **角色 Identity Lock 流程**（系列 / 隐式 IP 化必走）：

   - **Step 1 出锁定参考图**：首图用 t2i 抽到满意的角色形象 → 保存为 reference.png
   - **Step 2 抽 Lock card**：把发色 hex / 瞳色 hex / 服饰描述 / 配饰描述 / 标志性特征逐条写下来
   - **Step 3 后续全 i2i**：所有同角色后续图必须 i2i + 参考图 + 复制 Lock card 到 prompt，禁止 t2i 重新抽奖
   - **推荐模型**：seedream（i2i 主体保留强项）/ kontext（多视图角色一致）

   #### 隐式 IP 化触发器（必识别）

   用户没说"系列 / 同一个人"时，以下 prompt **默认推断为同 IP 多风格**，强制启动 Character Lock：

   | 用户表述 | 隐式需求 | 必走流程 |
   |---|---|---|
   | "出 N 种风格头像" / "做几个不同画风的头像" | 同一人物 N 风格 | t2i 抽 anchor → 提 Lock card → 后续每张 i2i + 风格描述 |
   | "出 N 种风格立绘 / 卡片 / character sheet" | 同上 | 同上 |
   | "把这个角色画成日漫 / 国漫 / 韩漫" | 跨风格 IP 衍生 | 见「同 IP 跨子风格衍生」行 |
   | "做 X 张表情包 / 贴纸" | 同一 IP 多表情 | 锁脸 + 锁服 + 仅切表情/手势 |

   **严禁**把"出 N 种风格头像/立绘"理解为"N 种独立风格的不同人物"。判定有歧义时 → AskUserQuestion 二选一："同一个人物 N 风格" / "N 种独立风格的不同人物（默认不会触发，需用户明确）"。

3. **五官规范**（按子风格区分，禁止默认）：

   | 维度 | 萌系/Q 版/shojo | shonen/cyberpunk | webtoon/厚涂/3D |
   |---|---|---|---|
   | 眼睛位置 | 面部下半（瞳孔位 1/3 横线下）| 面部中部偏上 | 接近写实 1/2 横线 |
   | 瞳孔大小 | 大，多重高光 | 中等，锐利 | 接近真人比例 |
   | 鼻梁 | 一笔简化或省略 | 简化但有结构 | 完整鼻梁结构 |
   | 嘴 | 小巧一道线 | 中等带轮廓 | 完整唇形 |
   | 头身比 | Q 版 2-3 / 萌系 5-6 / shojo 7 | 7-7.5 | 7.5-8 |

4. **笔触一致**（系列必锁，单图必明确）：

   | 笔触类型 | 适用子风格 | 关键 prompt 词 |
   |---|---|---|
   | cel shading（赛璐璐）| jp-modern / jp-retro / jp-shonen / cn-modern | `cel shading, flat colors, hard-edge shadows` |
   | watercolor | ghibli | `watercolor texture, soft edges, painterly background` |
   | painterly 厚涂 | kr-paint / cn-xianxia 高级版 | `thick brushstrokes, oil painting texture, semi-realistic` |
   | smooth gradient | kr-webtoon / jp-shojo | `smooth gradient shading, soft glow` |
   | 3D render | cn-3d-fantasy / cyberpunk 部分 | `cinematic 3D, Unreal Engine, volumetric lighting` |
   | ink wash 水墨 | cn-xianxia | `ink wash painting, Chinese brushwork, calligraphic strokes` |

   #### 笔触易混淆词典（用户说 X 不要画 Y）

   | 用户说 | 默认应该是 | 容易翻车成 | 区分关键词（必须出现）|
   |---|---|---|---|
   | 水彩 | watercolor 透明叠层 / 湿画法 / 留水痕 | painterly 厚涂厚重笔触 | `transparent watercolor washes, wet-on-wet, paper grain visible, soft pigment bleed` |
   | 厚涂 | painterly 油画质感 / 厚重笔触 / 不透明 | watercolor 透明叠层 | `thick opaque oil paint strokes, impasto texture, no paper grain, no wet bleed` |
   | 吉卜力 | midjourney 朴素水彩 + 圆润治愈 | seedream 大眼萌系赛璐璐 | `watercolor texture, soft hand-drawn warmth, rounded character design` |
   | 国漫 3D | kling 电影级 3D + 玄幻光效 | seedream 2D 平面 / midjourney painterly | `cinematic 3D render, Unreal Engine quality, volumetric lighting` |
   | 赛璐璐 | cel shading 平涂 + 硬阴影 | smooth gradient 渐变阴影 | `cel shading, flat colors, hard-edge shadows, no gradient` |

   **强约束**：用户明确说"水彩"时，prompt **必须**含 `watercolor` 而**禁止**出现 `painterly` / `thick brushstrokes`；说"厚涂"时反之。说"赛璐璐"时禁止 `smooth gradient`。

5. **风格基因 Lock**（系列必走）— 单作品禁止跨子风格混搭。系列作品建 Style Lock card：笔触类型 + 配色基调 + 线稿粗细 + 阴影方式 + 背景处理（详见 `iron-laws.md` 第 4 条）。

6. **通用 negative prompt 必出**：

   ```
   realistic photo, photography, photorealistic, real human face,
   3d render (除非 cn-3d-fantasy / 部分 cyberpunk),
   distorted face, mutated face, asymmetric eyes, cross-eyed,
   extra limbs, extra fingers, malformed hands, bad anatomy,
   low quality, amateur sketch, watermark, signature
   ```

   各子风格独立 negative 见 `defaults.md`。

7. **中文/对话框文字** — 漫画对话框 / 标题 / 拟声词中文 ≥ 5 字默认走纯底图 + 后期。仅英文短拟声词（BOOM / WHAM）/ 中文 ≤ 4 字标题可走 openai 或 qwen 嵌入。详见 `iron-laws.md` 第 3 条。

8. **关键空间约束必须用硬表达**（立绘 / 全身像 / 多视图必读）

   "立绘 / 全身像 / full body / character sheet" 这类 prompt 用弱表达时，backend（含 seedream / midjourney / kling）会默认裁切到七分身（腰/膝盖以上），破坏立绘完整性。**必须**用显式硬表达。

   | 用户意图 | 弱表达（易裁切，禁用）| 硬表达（必用）|
   |---|---|---|
   | 全身像 / 立绘 | `full body` | `head-to-toe full body, including feet, no cropping at legs / waist` |
   | 全身镜 / 全身照 | `full body shot` | `full body, feet visible, ground or floor visible, no leg cropping` |
   | 三视图角色设定 | `3-view character sheet` | `3-view character sheet (front / side / back), each view head-to-toe, all feet visible across views` |
   | 多视图扩展（4-view / 6-view）| `multi-view character sheet` | 同上模板，明示 "each view head-to-toe, all feet visible" |
   | 多人合影全身 | `group full body shot` | `group full body shot, all characters head-to-toe, all feet on ground visible` |
   | 站姿展示 | `standing pose` | `standing pose head-to-toe, full body including feet, no leg cropping` |

   **派单前自检**：prompt 里如果出现 "全身 / 立绘 / full body / standing pose / character sheet" 任一关键词，必须把对应的硬表达整段拼进 prompt，**不允许**只写一个 `full body` 凑数。

   **出图后自检**：见 `SKILL.md` Step 5 的"全身/立绘裁切自检"。

## 全局必填项（任意子风格 brief 缺一不可）

不写这些 → sub-agent 凭训练先验补全 → 拿到结果对不上：

- **来源国** — 日漫 / 国漫 / 韩漫 / 美漫 / 通用，5 选 1
- **子风格** — 14 子风格选 1（见 `substyles-index.md`）
- **比例** — 默认走子风格推荐（详见 `defaults.md`）
- **角色基本信息** — 性别 / 年龄段 / 发色 / 瞳色 / 服饰大类（系列必建 Lock card）
- **场景类型** — 立绘 / 半身 / 全身 / 场景插画 / 动作分镜 / Q 版表情
- **笔触类型** — 见上表，按子风格默认
- **是否系列** — Y/N；Y 则建 Character Lock + Style Lock 两张 card
- **是否含中文文字** — Y/N；Y 则按渲染策略选（A 嵌入 / B 纯底图 / C 模板）

## 系列一致性策略（多视图 / 多分镜 / IP 衍生）

| 场景 | 推荐流程 |
|---|---|
| 同角色多视图（正面 / 侧面 / 背面）| seedream + i2i + Character Lock card 复用，每视图额外加视角描述词 |
| 同角色多表情 | seedream + i2i + 第一张作为 reference，仅改表情词 |
| 多角色同场景（团队 / 班级集体）| 先 t2i 抽场景 + 角色 1，再 kontext 多角色保持一致；或分别出 + 后期合成 |
| 同 IP 跨子风格衍生（萌系 IP 出 Q 版周边）| 不要直接转——重画 Q 版本时仅取 Lock card 的发色 / 瞳色 / 服饰核心元素，不取头身比 / 笔触 |
| 长篇分镜（漫画连载）| 每页起手都要 i2i + Lock card；建议预先出 turnaround sheet（角色三视图）作为永久参考 |

## 子风格边界判断（识别歧义时必问）

| 用户说 | 可能是 | AskUserQuestion 选项 |
|---|---|---|
| "做个动漫角色" | 14 子风格任意 | "来源国 + 媒介（立绘 / 场景 / Q 版）" |
| "国风女孩" | cn-xianxia vs cn-modern | "古风仙侠 / 现代国潮" 二选一 |
| "热血风" | jp-shonen vs cn-3d-fantasy | "日漫手绘热血 / 国漫 3D 玄幻" 二选一 |
| "我想要日漫感" | 6 子风格 01-06 | "现代萌系 / 复古 / 少年热血 / 少女浪漫 / 治愈风景 / 日系城市天空" |
| "未来感少女" | cyberpunk vs jp-modern + 科幻服饰 | "二次元赛博朋克场景 / 现代萌系穿科幻服" |

## 配套 reference

本文件是子风格层共用规则。子风格独有规则走 `substyles/{NN}-{slug}.md`。

- 防翻车铁律 → `iron-laws.md`
- 子风格索引 → `substyles-index.md`
- 默认参数 → `defaults.md`
- 子风格 → 模型映射 → `model-routing.md`
