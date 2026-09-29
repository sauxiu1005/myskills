# TVC Creative Concept Template — TVC 创意方案模板

用户选定 concept option 后，按此模板扩展为完整 TVC 方案，存入 `concept.md`。

---

## Step A: Scene Breakdown（场景拆解）

写分镜前必须先完成场景拆解。详细规范见 `storyboard-rules.md` Scene Breakdown 章节。

- **Subject**: 产品的可见特征（材质/颜色/形态/关键细节），在画面中的状态
- **Environment**: 空间布局，背景元素，地面/墙面/材质
- **Lighting**: 光源方向 & 质感（硬/软），暗示的时间段
- **Visual Anchors**: 3-6 个必须在所有面板中保持一致的要素（色调、主光源、天气/雾/雨、颗粒/质感、背景标记物、产品外观）

## Step B: Cinematic Approach（电影手法）

详细焦距/DoF/镜头运动规范见 `storyboard-rules.md` Cinematic Approach 章节。

- Shot progression: 如何从全景推到特写服务于情绪节拍
- Lens range: 焦距范围（18-85mm），DoF 倾向
- Light & color: 对比度，主色调，材质渲染优先级

## Step C: 9-Frame Keyframes

每帧是一段 **80-120 词的英文 Image Prompt**。格式规范见 `storyboard-rules.md` Keyframe Format 章节。

---

## concept.md 输出格式

```markdown
# TVC Creative Concept — [Brand Name]

## Creative Direction
The Impossible Thing: [one sentence]
Creative Dimension: [dimension]
Emotional Tone: [tone]
Visual Medium: [from references/photography-styles.md]
Visual Style: [camera + lens + film stock + imperfections]

## Scene Breakdown
Subject: [product visible traits]
Environment: [spatial layout, materials, background]
Lighting: [direction, quality, time of day]
Visual Anchors: [3-6 constants across all panels]

## Story Arc
[3-5 sentences — complete narrative]

## 9-Frame Storyboard

**每帧末尾必须包含 Grade 行**，写明具体设备和胶片：`shot on [camera], [lens], [film stock], [2-3 artifacts]`。不写 Grade = 不合格。

### KF1 | LS | Atmosphere
[80-120 words: Composition + Action + Camera/Lens/DoF + Lighting. NO product. Grade: shot on ...]
### KF2 | MS | Tension
[Subtle anomaly. Camera pushes in. Lighting shifts. Grade: shot on ...]
### KF3 | MCU | Hint
[First product clue — shadow/reflection/partial. Shallow DoF on clue. Grade: shot on ...]
### KF4 | LS/MS | Reveal
[Product appears impossibly. Wide to show context. Power angle. Grade: shot on ...]
### KF5 | CU | Product Detail
[Macro detail. 85mm, f/2.8 shallow DoF. Material texture. Grade: shot on ...]
### KF6 | MS | Escalation
[Environment responds. Progressive change. Camera tracks. Grade: shot on ...]
### KF7 | LS | Climax
[Maximum surreal intensity. Wide to show full impact. Grade: shot on ...]
### KF8 | ECU | Product Detail
[Different angle. Craftsmanship. Extreme shallow DoF. Grade: shot on ...]
### KF9 | MS | Payoff
[Brand name as physical scene element, in stylized typography matching product tone (e.g. elegant serif / bold sans-serif / handwritten script / geometric monospace). Final composition. Grade: shot on ...]
```
