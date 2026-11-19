# Review: stills, clips, cuts, film

`qc.py` measures alignment, size and brightness. This page covers what those numbers cannot show: whether the
picture is physically believable. Every user-sent-back problem in the examples was of this kind (an impossible
grip, a motion with no cause, a direction reversed at a cut, a product short of its state), and every one was
visible in a still or a clip before delivery.

Look at full size. A 384-pixel contact-sheet cell hides fingers: use `qc.py look` for full-size crops of the hands
and the product at the frames the edit actually uses.

## Every still, before the next wave edits it

| Look at | It fails when |
|---|---|
| Identity | a prop does not read as itself in half a second (a passport with no cover printing, a card that could be a notebook) |
| Product | wrong shape or face for the state, the hinge on the wrong side, extra cameras, buttons, text or interface; it differs from the official image |
| End states | "flat" is not flat (the edges must run straight across the hinge), "closed" has a gap, "upright" leans. Official photos are posed: the still must show the state the plan names, not the photo's pose |
| Hands | not five plausible fingers; a grip nobody would use for this action; fingers across a screen or the product's face; the grip does not show what happens next (thumb under the edge before a lift, palm on top before a press); jewellery differs across a pair (default: none) |
| Physics | the object could not rest in that state, or something floats or bends where it cannot |
| Framing | the shared shape is off its cut partner: check with `qc.py onion` and `qc.py match`. Generated edits often zoom or re-centre; measure after every edit and fix with `align.py` (crop the wider frames to the tighter one) instead of regenerating |
| Light | an unmotivated key-direction change breaks the relay, or comparable subject regions jump in exposure. The 10% target is a warning for comparable regions, not a reason to flatten shadows or force different backgrounds to the same mean brightness |

## Every clip, before it is picked

- **Watch the motion, not just the ends.** `qc.py sheet` across the whole clip (every 2–4 frames). Many problems sit
  in the middle: a grip that morphs, a cover that goes the wrong way, a hand that appears from nowhere.
- **When does the motion start and end?** Models often hold the first frames and settle early. Start the pick
  where the motion starts; end it before the motion stops (or at rest, if the cut is a rest cut).
- **Direction and speed at the cut frames**, compared with the partner shot's.
- **Hands stay plausible all the way through.** The product stays rigid except at its hinge and reaches its state.
- **Screens.** Model-made camera dots, interfaces or text: remove dots with `undot.py`; use another take for UI.
- **The last 2–3 frames.** Models often jump or smear into the locked end frame; do not use them.
- **The camera.** No drift or zoom unless planned: `qc.py match` at the frames used.

## 真人摄影与 H3 真实性

真人路线结合 [live-action-realism.md](live-action-realism.md) 检查并写回 `look-plan.json.review`；结构和卡点合格不代表摄影合格。无人物镜头将人脸项标为 not_applicable。

| 维度 | 通过的可见证据 | 需要返修的现象 |
|---|---|---|
| 人物与手 | 身份稳定；皮肤有适度局部差异；关节、接触和衣物褶皱随动作合理变化 | 蜡皮、美颜漂移、五官游走、手指融合、悬空触控；不能用噪点掩盖 |
| 光线层次 | 可解释的主光、保留细节的暗面、主体与环境分离；亮屏与金属高光符合环境 | 所有表面同亮、人物自发光、没有接触阴影、光源无故换边、亮度呼吸 |
| 材质与空间 | 皮肤/织物/金属/玻璃反射不同；前景遮挡和背景距离合理 | 统一塑料质感、漂浮物、重复纹理、无动机光束、贴图般反射 |
| 表演与运动 | 视线有对象；重心与接触先后合理；单个动作有自然加减速 | 固定营业笑、人物等候展示产品、同步机械微动作、全程慢动作 |
| 镜头与时间稳定 | 焦点服务脸或操作；运镜有动机且有视差；细节附着于物体 | 无重力漂移、背景变形、每镜自动推近、皮肤纹理游动、失焦遮错 |

先正常速度看完整片段，再看关键动作前/中/后及切点的原尺寸脸/手/金属区域；观察相邻连续帧可区分运动模糊与纹理漂移，稀疏缩略图不能证明时间稳定。并排比较原定帧和视频中段，明确缺陷来自图片、运动生成还是后期。每项记录 `passed / needs_revision / pending / not_applicable` 及时间码/证据；不使用平均分掩盖严重人脸、手或结构错误。数值测光仅辅助，肤色与局部反光不可用全帧平均值判断。

## Every cut, after the render

- `qc.py cuts`: brightness steps (under 10% on match cuts) and alignment.
- For each relay, the last frames of the outgoing shot and the first of the incoming: same direction and similar
  speed, or both at rest. A world shot whose first and last frames look the same has no motion: re-pick or remake.
- Movement relays normally play at 0.8–1.25× real time and avoid accidental holds. Planned rest cuts, product viewing time, copy and end cards can deliberately hold.

## The film, before delivery

- A frame grid of the whole film (`qc.py sheet` on the mp4, every 3–5 frames), read section by section as a
  sequence: does each part read as one continuous motion?
- Listen: foley on the action frames, every music join, the final hit on the end card.
- Anything wrong on the product or on a hand is fixed (re-pick, post fix, or one regeneration) before delivery. If
  the cap does not allow it, ask; never ship it as a "known deviation". Known deviations are for small things
  elsewhere in the frame, and the README says what each would cost to fix.


## Design 版：体验、手势与全片推进

结合 [relay-design.md](relay-design.md) 检查 `relay-plan.json`，计划字段不能代替实际检查结论。

- **体验联系**：能否用一句话说清现实动作与产品体验的联系？只形似却无内容作用时改场景/动作或删减该组；纯形态展示说明它突出哪项材料/形态价值。
- **产品事实**：操作与可见结果有资料支撑吗？创意隐喻或概念设定是否被误写成真实功能？参考广告中的表现本身不作为事实来源。
- **手势切点**：实际切出/切入两侧各检查至少 2–3 帧。主锚点、手势、接触对象、阶段、方向和速度是否可读地延续？只对齐物体中心但指尖跳位，仍需修正。无手镜头检查相应物体锚点。
- **贯穿元素**：重复元素是否逐次变化并回到产品？是否遮挡产品或只机械重复？不适用时可标 not_applicable，不硬加装饰。
- **节奏与阅读**：正常速度是否能识别动作、理解体验、读完必要文案并记住产品？卡拍是否有疏密变化？有意的产品展示停留不等于失败动作。
- **证据**：保存真实素材 ID、帧率、切点帧号/时间码及检查图；未测量、未播放或未听审的项用 pending，不记 passed。重剪后检查更新的实际切点，不能沿用旧结论。

这些是 Agent 的自检，不额外增加用户审批节点；按既有推进模式和额度修正。
