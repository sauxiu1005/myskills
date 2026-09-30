# Story Prompt Guide — 故事剧本 Prompt 编写规则

Seedance 的 prompt 是一个**完整的故事短片剧本**，不是分镜的拼接。模型需要理解「发生了什么事」才能生成连贯的视频。

---

## Prompt 结构

```
[Opening] image 1 is a 9-panel storyboard showing the complete story progression.
The video begins with the top-left panel: [完整的开场场景描述，纯环境，产品未出现，光线如何，3-4句].

[Transition — 1st] [匹配 Visual Medium 的转场特效，如 "A brief white flash fills the frame, then clears —"]

[Inciting event] [故事的触发点——什么开始变化，从画面的哪个位置开始，2-3句]. [变化的初始阶段——速度慢，范围小，具体描述物理形态].

[Rising action] [变化加速和扩展——从哪里蔓延到哪里，覆盖了什么，新元素出现，2-3句]. The story progresses through the middle panels of the storyboard. [变化到达中间状态的具体描述].

[Transition — 2nd] [第二个转场特效（可选），如 "The image fragments into pixel blocks for a split second, snaps back —"]

[Climax] [变化到达顶峰——最戏剧性的瞬间，画面被变化填满，2-3句]. The scene matches the bottom panels of the storyboard.

[Resolution] [最终定格——产品在变化后的世界中居中，品牌信息呈现，1-2句].

Throughout: [产品] remains [不变状态]. No visible human face. [Visual Medium 关键词 + 介质瑕疵]. [camera movement].
```

---

## 关键原则

- 这是一个有**起承转合**的故事，不是几张图的说明文字
- `image 1` 是九宫格分镜图，包含完整的视觉叙事弧线。Prompt 引导模型沿分镜图的面板顺序（左→右，上→下）展开故事
- 故事是连续的——句子之间用因果关系和时间推进连接，不是断裂的场景罗列
- 变化必须有**物理细节**：什么物体、从哪里开始、向什么方向、以什么速度、变成什么形态
- 禁止叙事词（realizes, decides, despite）、情感词（feels, thinks, surprised）
- 只用**视觉动词**：grows, spreads, cracks, crawls, floats, shatters, freezes, rotates, fills

---

## Transition Effects — 转场特效词库

在故事节拍之间插入 **1-2 个转场特效**，增加视觉冲击力和节奏感。转场必须与 Visual Medium 匹配——VHS 用 analog 类转场，Film 用 organic 类转场，所有介质都可以用 camera 类转场。

### 转场词库（按介质分类）

| 类别 | 转场效果 | Prompt 关键词 |
|------|---------|-------------|
| **Analog (VHS/Phone)** | 闪白 | `a brief white flash fills the frame` |
| | 信号干扰 | `static noise bursts across the screen for a split second` |
| | 数码故障 | `digital glitch — the image fragments into pixel blocks, then snaps back` |
| | 扫描线爆裂 | `horizontal scan lines tear across the frame` |
| | 色差闪烁 | `RGB channels split apart momentarily, chromatic aberration flickers` |
| | 跟踪错误 | `VHS tracking error — the image rolls vertically, then stabilizes` |
| **Organic (16mm/Super8/35mm)** | 胶片灼烧 | `a film burn blooms from the edge — orange and white light bleeds across the frame` |
| | 光泄漏 | `warm light leaks bleed in from the right edge` |
| | 曝光闪烁 | `the exposure pulses — the image briefly washes out to overexposed white, then returns` |
| | 帧跳 | `a single-frame jump cut — the composition shifts abruptly` |
| | 化学晕染 | `color bleeds outward like chemicals spreading on wet paper` |
| **Camera (通用)** | 闪光灯 | `a camera flash strobes — freezing the scene in harsh white light for an instant` |
| | 快速甩镜 | `a whip pan blurs the frame horizontally, revealing the next scene` |
| | 焦点爆炸 | `focus racks violently to full blur, then snaps sharp on [target]` |
| | 镜头眩光 | `a lens flare streaks across the frame as light source shifts` |

### 使用规则

1. **每段视频最多 2 个转场**，放在故事节拍转换处（Opening→Inciting / Rising→Climax 最合适）
2. **转场必须匹配 Visual Medium** — VHS 视频不能用 film burn，16mm 不能用 digital glitch
3. **转场是瞬间事件**（0.5-1s），不是持续效果 — 用 `briefly`, `for a split second`, `momentarily`
4. **转场之后必须描述恢复** — `then snaps back`, `then stabilizes`, `then returns`
5. **禁止连续转场** — 两个转场之间至少隔一个故事节拍

### Prompt 中的写法

转场插入在两个节拍之间，作为一个独立短句：

```
[Opening scene description, 2-3 sentences].

[Transition — e.g. "A brief white flash fills the frame, then clears to reveal:"]

[Inciting event — change begins, 2-3 sentences].

[Rising action accelerates, 2-3 sentences].

[Transition — e.g. "The image fragments into pixel blocks for a split second, snaps back —"]

[Climax — maximum intensity, 2-3 sentences].

[Resolution — final composition, 1-2 sentences].
```

---

## 检查清单

- [ ] 读起来像一个完整的故事（有开头、发展、高潮、结尾）？
- [ ] 用 `image 1` 引用了九宫格分镜图？
- [ ] 变化有物理细节（起点位置、方向、速度、形态）？
- [ ] 句子之间有因果/时间连接，不是断裂的场景列表？
- [ ] 产品的不变状态被显式声明？
- [ ] 包含 `no visible human face`？
- [ ] 包含 Visual Medium 关键词 + 介质瑕疵（与九宫格 prompt 一致）？
- [ ] 包含 1-2 个转场特效，且与 Visual Medium 匹配？
- [ ] 整段 prompt 在 150-250 词之间？
- [ ] 结尾明确描述了最终定格画面？
