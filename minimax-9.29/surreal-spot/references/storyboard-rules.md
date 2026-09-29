# Storyboard Rules — 分镜脚本规则

## 目录

1. [核心流程](#核心流程)
2. [Scene Breakdown](#scene-breakdown场景拆解写分镜前必做)
3. [Cinematic Approach](#cinematic-approach电影手法写分镜前确定)
4. [Keyframe Format](#keyframe-format每帧格式)
5. [9 帧分布参考](#9-帧分布参考)
6. [Continuity Rules](#continuity-rules连续性规则)
7. [Grid Requirements](#grid-requirements网格要求)
8. [Visual Delta 规则](#visual-delta-规则)
9. [人脸规避规则](#人脸规避规则seedance-安全)
10. [品牌文字规则](#品牌文字规则)

---

## 核心流程

```
Step 1: Scene Breakdown → Step 2: Theme & Story → Step 3: Cinematic Approach → Step 4: Keyframes → Step 5: Contact Sheet Grid
```

---

## Scene Breakdown（场景拆解）— 写分镜前必做

在写任何面板描述之前，先完成场景拆解：

### Subjects（主体）
列出每个关键主体（A/B/C…），描述可见特征（材质/形态/颜色），相对位置，朝向，动作/状态。

### Environment & Lighting（环境与光影）
室内/室外，空间布局，背景元素，地面/墙面/材质，光源方向 & 质感（硬/软；主光/辅光/轮廓光），暗示的时间段，3-8 个氛围关键词。

### Visual Anchors（视觉锚点）— 跨面板一致性
列出 3-6 个必须在所有面板中保持一致的视觉特征：
- 色调/色彩基调
- 主光源方向和质感
- 天气/环境效果（雾/雨/尘埃）
- 颗粒/质感（胶片颗粒、扫描线等 Visual Medium artifacts）
- 背景标记物（标志性建筑、材质、道具）
- 产品外观（颜色、材质、形态不变）

---

## Cinematic Approach（电影手法）— 写分镜前确定

### Shot Progression（景别推进策略）
如何从全景推到特写（或反向），如何服务于 Setup → Build → Turn → Payoff 四个情绪节拍。

### Lens Range（焦距范围）
- 全景：18-35mm，深景深（f/8-11）
- 中景：35-50mm，中等景深（f/4-5.6）
- 特写：50-85mm，浅景深（f/2-2.8）
- 大特写：85-100mm macro，极浅景深（f/1.8-2.8）

### Camera Movement（镜头运动）
每个运动必须有理由。常用类型：
- `slow 5% push-in`（缓慢推进——增加紧张感）
- `lateral dolly`（横移——揭示隐藏元素）
- `subtle handheld micro-shake`（轻微手持抖动——增加临场感）
- `locked tripod`（锁定三脚架——稳定、庄严）
- `low orbit`（低角度环绕——增强主体力量感）

---

## Keyframe Format（每帧格式）

每帧 **80-120 词英文 Image Prompt**，使用以下结构：

```
[KF# | shot type code | story beat name]
- Composition: subject placement (center/rule-of-thirds/off-center), foreground/mid/background layers, leading lines, gaze direction
- Action/beat: what visibly happens (simple, executable, one sentence)
- Camera: height (eye-level/low/high/worm's-eye), angle, movement type and amount
- Lens/DoF: focal length (mm), DoF (shallow/medium/deep), focus target
- Lighting: key light direction, shadow quality (hard/soft), highlight emphasis
- Grade: shot on [camera + lens], [film stock], [2-3 specific artifacts e.g. film grain/scan lines/light leaks], [color temperature]
```

### Shot Type 景别代码

| Code | Name | 用途 |
|------|------|------|
| ELS | Extreme Long Shot | 大全景，极小的主体在环境中 |
| LS | Long Shot | 全景，展示完整环境 + 主体 |
| MLS | Medium Long Shot | 中全景，主体占 30-40% |
| MS | Medium Shot | 中景，主体占 40-60% |
| MCU | Medium Close-Up | 近景，主体占 60-80% |
| CU | Close-Up | 特写，主体填满画面 |
| ECU | Extreme Close-Up | 大特写，材质/纹理细节 |
| Low | Low Angle | 低角度仰拍 |
| High | High Angle | 高角度俯拍 |
| Insert | Insert Shot | 插入镜头（细节/道具） |

---

## 9 帧分布参考

| 故事弧线 | KF# | 景别 | 功能 |
|---------|------|------|------|
| Atmosphere | KF1 | LS | 纯环境建立，**产品不出现**，展示"正常世界" |
| Tension | KF2 | MS | 环境中出现微妙异常——裂缝、阴影、不自然的静止 |
| Hint | KF3 | MCU | 产品的第一个线索——影子、反射、局部轮廓、材质痕迹 |
| Reveal | KF4 | LS/MS | 产品以不可能的方式完整登场——延迟揭示的 payoff |
| Product Detail | KF5 | CU | 产品材质/纹理特写，85mm 浅景深 |
| Escalation | KF6 | MS | 环境回应产品存在，荒诞事件开始 |
| Climax | KF7 | LS | 最大视觉冲击，全景展示完整影响 |
| Product Detail | KF8 | ECU | 第二个产品特写，不同角度/细节 |
| Payoff | KF9 | MS | 收尾定格，品牌名融入场景 |

**Hard requirements**:
- 必须包含：1 个建立环境的全景（LS），1 个亲密特写（CU），1 个极端细节（ECU），1 个力量角度镜头（Low/High）
- 相邻面板景别不重复
- 编辑驱动的连续性：动作延续、一致的画面方向

---

## Continuity Rules（连续性规则）

**可以变的**：动作、表情、走位、构图、角度、镜头运动

**不能变的**：
1. 主体外观（材质/颜色/形态/比例）
2. 环境设定（同一空间，同一背景元素）
3. 光影风格（同一时间段，同一主光方向）
4. 色彩基调（同一 cinematic color grade）
5. Visual Medium artifacts（同一胶片/介质特征）

**额外约束**：
- 不引入参考图/前序面板中不存在的新角色/物体
- 需要张力时，用画外暗示（阴影、声音、反射、遮挡、目光方向）
- DoF 随景别真实变化：全景深（LS），浅景深+自然虚化（CU/ECU）

---

## Grid Requirements（网格要求）

1. 单张主图包含所有 keyframe 作为独立面板（3×3 九宫格）
2. 每个面板标注：KF 编号 + 景别（标签在安全边距内，不覆盖主体）
3. 所有面板严格连续性（参照 Continuity Rules）
4. DoF 随景别真实变化（全景深 → 浅景深）

---

## Visual Delta 规则

每个 Visual Delta 必须回答：**"如果把两张图并排放，观众 1 秒内能看出什么不同？"**

合格的 Visual Delta 示例：
- "地面从干净水泥变成 60% 被绿色植被覆盖"
- "产品周围新增 5-6 个同方向倾斜的物体"
- "景别从全景切到产品表面材质的大特写"
- "画面从单一产品变成 20+ 个同类产品填满货架"

不合格的 Visual Delta：
- "氛围更紧张" ← 不可见
- "变化加剧" ← 太模糊
- "光线变暖" ← 差异太小

---

## 人脸规避规则（Seedance 安全）

Seedance 2.0 对正面人脸极度敏感，会直接拒绝生成。所有分镜图必须遵守：
- **禁止正面人脸**：不出现可辨识的五官（眼睛、鼻子、嘴巴）
- 需要人物时，使用：背影（`seen from behind`）、侧影剪影（`silhouette`）、局部肢体（`hands only`, `feet walking`）、远景小人（`tiny figure in the distance`）
- 用物体代替人物传达故事：鞋子自己转向、杯子自己移动、衣服悬浮
- Prompt 中主动写入 `no visible face, no facial features, seen from behind`

---

## 品牌文字规则

- 仅最后一帧（KF9 / Payoff）的 Image Prompt 中包含品牌名/slogan
- **品牌名必须融入场景**：刻在表面（engraved）、投影在墙上（projected）、印在材料中（printed）、浮雕在环境表面（embossed），**禁止悬浮文字**
- **字体必须匹配产品调性**：在 prompt 中指定艺术字体风格——奢侈品用衬线体（`elegant serif lettering`）、潮牌用粗体无衬线（`bold sans-serif block letters`）、手工品牌用手写体（`handwritten script`）、科技品牌用等宽几何体（`geometric monospace type`）。禁止默认字体，禁止无风格描述的裸文字
- 在 prompt 中描述文字作为场景元素的存在方式，包含字体风格描述
- KF1-8 的描述中禁止包含任何文字
- Panel 9 的品牌名在九宫格中一次生成；渲染不准确时保留视觉画面，在确定性后期中加入已核对文字
