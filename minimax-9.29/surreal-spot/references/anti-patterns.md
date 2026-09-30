# Anti-Patterns — 动态海报常见错误

## Creative 创意层

- **Don't pile up surreal elements**: ONE impossible thing per video. More = visual noise.
- **Don't lose the product**: The product must be clearly recognizable. Surreal context enhances, never obscures.
- **Don't default to gigantification**: Physical Impossibility ≠ making things bigger. Anti-gravity, phasing through walls, splitting, floating — all valid. 3 concept options must use 3 different creative dimensions.
- **Don't skip the story**: Every concept must answer "what HAPPENS in the scene?" — not just "what does the product look like?" Products in environments without events = product catalog, not ad.
- **Don't reveal product immediately**: Frame 1 should NOT show the product. Build atmosphere and tension first (2-3 frames), then reveal the product as the twist. Product is the payoff, not the premise.
- **Don't use warm/saturated color palettes**: Stick to cool desaturated + accent pops. This is the identity.
- **Don't chase digital perfection**: Lo-fi > hi-fi. VHS scan lines, 16mm grain, phone camera noise — these imperfections make surreal content MORE believable, not less. Never use 8K/4K/hyper-realistic.
- **Don't use generic AI prompts**: Every prompt must name a specific Visual Medium and its artifacts.

## Storyboard 分镜层

- **Don't skip dual reference for 9-grid**: 九宫格生成必须传入选中的风格参考图 + 产品原图双重引用。只传产品原图 + 900 词 prompt = 产品外形被稀释、与原图不一致。
- **Don't skip Scene Breakdown**: 写分镜前必须先提取 Visual Anchors（3-6 个跨面板一致性要素）。没有锚点 = 面板之间风格漂移。
- **Don't make all 9 panels about the product**: 环境/叙事面板 ≥ 5 个。如果每个面板都只有产品的不同角度，观众看到的是产品目录而不是广告故事。
- **Don't repeat the same shot type**: 相邻面板必须切换景别代码（LS/MS/MCU/CU/ECU）。全景→全景 或 特写→特写 = 视觉单调。
- **Don't put text in non-Payoff panels**: 只有 Panel 9（Payoff）可以包含品牌名/slogan，且必须融入场景（刻在表面、投影、印在材料中），使用匹配产品调性的艺术字体（衬线/无衬线/手写/几何等），禁止悬浮文字，禁止默认字体。
- **Don't skip Visual Delta**: 相邻面板之间没有清晰、可量化的视觉差异 = 视频模型不知道该变什么。
- **Don't write thin panel descriptions**: 每个 Panel 描述必须 80-120 词，含 Composition / Action / Camera+Lens+DoF / Lighting / Grade 五要素。缺少焦距和景深 = 生图模型乱猜构图。
- **Don't break continuity**: 面板之间只有动作/构图/角度可以变，主体外观/环境/光影/色调/Visual Medium artifacts 必须一致。

## Video 视频层

- **Don't make empty motion videos**: Video must have 内容反差 — a visible, progressive change that delivers the brand message. Not just "scene comes alive" or ambient camera movement.
- **Don't make the escalation instant**: The absurd event must build progressively so the audience watches it unfold — not a single flash cut.
- **Don't lose the product in the escalation**: No matter how dramatic the event, the product must remain the visual and narrative center.
- **Don't describe scenes in motion prompts**: Motion prompt 的 80% 必须是变化动作描述，不是静态场景描述。如果 prompt 读起来像 3 张图的说明文字而不是一段连续动作，视频就不会有叙事张力。
- **Don't show frontal faces**: Seedance 对正面人脸极度敏感，会直接拒绝。九宫格和 motion prompt 中禁止正面人脸——用背影、剪影、局部肢体、物体代替人物。
- **Don't write vague motion prompts**: Seedance 的 prompt 必须极度详细——每个 Visual Delta 展开为 ≥2 句动作描述，包含起点位置、扩展方向、速度节奏、物理形态。一句话概括 = 模型乱猜。
