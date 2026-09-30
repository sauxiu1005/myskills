# Anti-Patterns — 动态海报常见错误

## Creative 创意层

- **Don't pile up surreal elements**: ONE impossible thing per video. More = visual noise.
- **Don't lose the product**: The product must be clearly recognizable. Surreal context enhances, never obscures.
- **Don't use warm/saturated color palettes**: Stick to cool desaturated + accent pops. This is the identity.
- **Don't over-process**: Light film grain is good. Heavy filters, HDR glow, or painterly effects = AI look.
- **Don't use generic AI prompts**: Every prompt must name a specific camera, lens, and film stock.

## Storyboard 分镜层

- **Don't repeat the same shot type**: 相邻 Beat 必须切换景别。全景→全景 或 特写→特写 = 视觉单调。用景别切换制造剪辑节奏。
- **Don't put text in non-Payoff beats**: 只有最后一个 Beat（Payoff）可以包含品牌名/slogan，中间 Beat 的 prompt 禁止文字。
- **Don't skip Visual Delta**: 相邻 Beat 之间没有清晰、可量化的视觉差异 = 视频模型不知道该变什么。每个 Visual Delta 必须回答"观众 1 秒内能看出什么不同"。

## Video 视频层

- **Don't make empty motion videos**: Video must have 内容反差 — a visible, progressive change that delivers the brand message. Not just "scene comes alive" or ambient camera movement.
- **Don't make the escalation instant**: The absurd event must build progressively so the audience watches it unfold — not a single flash cut.
- **Don't lose the product in the escalation**: No matter how dramatic the event, the product must remain the visual and narrative center.
- **Don't describe scenes in motion prompts**: Motion prompt 的 80% 必须是变化动作描述，不是静态场景描述。如果 prompt 读起来像 3 张图的说明文字而不是一段连续动作，视频就不会有叙事张力。
- **Don't show frontal faces**: Seedance 对正面人脸极度敏感，会直接拒绝。所有分镜图和 motion prompt 中禁止正面人脸——用背影、剪影、局部肢体、物体代替人物。
- **Don't write vague motion prompts**: Seedance 的 prompt 必须极度详细——每个 Visual Delta 展开为 ≥2 句动作描述，包含起点位置、扩展方向、速度节奏、物理形态。一句话概括 = 模型乱猜。
