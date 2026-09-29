# Story Prompt Guide — 故事剧本 Prompt 编写规则

Seedance 的 prompt 是一个**完整的故事短片剧本**，不是分镜的拼接。模型需要理解「发生了什么事」才能生成连贯的视频。

---

## Prompt 结构

```
[Opening] image 1 is the opening shot: [完整的开场场景描述，产品在什么环境中，什么状态，光线如何，3-4句].

[Inciting event] [故事的触发点——什么开始变化，从画面的哪个位置开始，2-3句]. [变化的初始阶段——速度慢，范围小，具体描述物理形态].

[Rising action] [变化加速和扩展——从哪里蔓延到哪里，覆盖了什么，新元素出现，2-3句]. The scene progresses toward image 2. [变化到达中间状态的具体描述].

[Climax] [变化到达顶峰——最戏剧性的瞬间，画面被变化填满，2-3句]. The scene arrives at image N.

[Resolution] [最终定格——产品在变化后的世界中居中，品牌信息呈现，1-2句].

Throughout: [产品] remains [不变状态]. No visible human face. Shot on [camera], [lens], [film stock], [imperfections]. [camera movement].
```

---

## 关键原则

- 这是一个有**起承转合**的故事，不是几张图的说明文字
- 用 `image 1`, `image 2`, ..., `image N` 标记故事的视觉锚点，让模型知道在故事的哪个节点对应哪张参考图
- 故事是连续的——句子之间用因果关系和时间推进连接，不是断裂的场景罗列
- 变化必须有**物理细节**：什么物体、从哪里开始、向什么方向、以什么速度、变成什么形态
- 禁止叙事词（realizes, decides, despite）、情感词（feels, thinks, surprised）
- 只用**视觉动词**：grows, spreads, cracks, crawls, floats, shatters, freezes, rotates, fills

---

## 检查清单

- [ ] 读起来像一个完整的故事（有开头、发展、高潮、结尾）？
- [ ] 用 `image N` 标记了每个视觉锚点？
- [ ] 变化有物理细节（起点位置、方向、速度、形态）？
- [ ] 句子之间有因果/时间连接，不是断裂的场景列表？
- [ ] 产品的不变状态被显式声明？
- [ ] 包含 `no visible human face`？
- [ ] 整段 prompt 在 150-250 词之间？
- [ ] 结尾明确描述了最终定格画面？
