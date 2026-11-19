# 真人摄影与 H3 画面控制

用于真人产品广告及“人物假、光线平、AI 感重”的修订。默认追求可信的现场摄影；用户选择的插画、超现实或棚拍风格仍优先。本页是从可见参考与失败案例提炼的制作方法，不是 H3 官方参数说明，也未承诺某组提示词能保证模型结果。

## 1. 先定位问题在哪一层

| 层级 | 可见问题 | 优先处理 |
|---|---|---|
| 场景与摄影设计 | 每镜同一浅色桌面、人物像陈列模特、全画面均匀柔亮 | 改人物任务、空间纵深和光源/暗面；先修定帧 |
| 定帧 | 蜡皮、假眼睛、手部无骨骼、金属像塑料 | 编辑或更换母图；不要继续衍生并指望视频修复 |
| 视频 | 原图正常，动起来身份改变、阴影漂移、动作匀速或手形融化 | 减少并行动作与运镜，明确接触阶段；在剩余额度内单变量重试 |
| 后期 | 泛黄 LUT、磨皮、过度锐化、假景深、每镜推近 | 回到原素材，局部修正白平衡/曝光和剪点；保留纹理 |

提高分辨率只增加像素，不会修正表演、皮肤或布光关系。不要把暖色、浅景深、光晕、胶片颗粒当成“真实”的同义词。

## 2. 摄影方案：让不同镜头共享一个可信世界

在 `look-plan.json` 写项目方向及逐镜差异，用自然语言即可，不把记录模板作为工具参数。至少明确：

- **人物**：与使用场景相符的年龄感、发型、服装、手部与袖口；已有身份图优先。保留自然不对称、细小色差、适度皱纹/皮纹，不给每个人添加夸张毛孔、污渍或疲态。肤色不统一提亮，深肤色靠轮廓和反射分离，不漂白。
- **任务与表演**：人物此刻要完成什么、视线落在哪里、什么结果触发反应。先看通知再操作，完成后才反应；轻微表情由任务产生。呼吸和眨眼属于自然行为，不给全体角色统一秒表；除非设计为直视镜头，不要求广告式看镜头微笑。
- **光源**：来自哪扇窗/哪盏灯、大小感、方向、软硬程度。柔光也要有方向；明确远离光源的一侧更暗、有细节。环境反射提供弱补光；灯、窗、屏幕各自有强弱和作用范围。
- **空间**：前景遮挡、中景人物与操作、后景距离；用明暗、色温或材质分离，不必全靠背景模糊。留少量有使用理由的物件与褶皱，不统一布置咖啡、花瓶、亚麻、石材套装。
- **镜头**：景别、机位高度、透视、焦点对象、移动起止与动机。数字焦距只是视角意图，不能称为实测镜头或真实相机元数据。
- **接力连续性**：锁定手势、主体锚点、相机侧向、接触阶段和关键光源关系。新场景可以有不同背景亮度与色温，不能为了平均曝光一致抹掉阴影。若有刻意昼夜变化，分镜注明并检查切换是否成立。

### 光线层次的可执行描述

“soft cinematic lighting”信息不足。改为“画左窗光擦过手背和银色边缘；靠镜头的一侧由较暗室内反射，仍能看到皮纹；后方墙面落入更暗的冷灰；窗外亮部保留变化”。

常用起点而非通用硬指标：人物/桌面主光约 30–70° 侧向，暗面视觉上低约 1–2 档；暗面不能丢失重要动作。它们是生成目标，不是从成片 RGB 数值反算出的现场测光值。黑旗/negative fill 是“减少反射”的布光意图，通常不应成为画面里的黑板道具。

室内夜景可用暖色实景灯配较冷的远处窗光；白天可用窗光配较暗室内。不要每镜固定橙蓝、轮廓光、体积光和太阳光斑。未见空气介质与光源依据时不加入光束。局部灯具允许高亮，不应把整张脸、白色机身和桌面同时漂白。

### 材质与成像

- 皮肤：面颊、额头、嘴唇和指节的色泽/反射有所区别；清晰度随景别和光线而定。真实不等于满脸锐利毛孔。
- 织物：有纤维方向、接缝、重量和受力褶皱；运动时褶皱附着，不随机闪现。
- 金属：亮带与暗带共同表现曲率；随物体/相机相对运动变化，不能全边缘自发光。
- 玻璃/屏幕：保持局部环境反射、透视、接触遮挡与合理亮度。文字必须读准时，在稳定平面上后期跟踪合成，并保留手部遮挡和反光；不要贴成完全无反射的白纸。
- 后期：保留中间调分离和高光过渡，适量锐度；先统一曝光/白平衡，再看是否需要轻微纹理。颗粒不是修复皮肤漂移的工具，不默认加磨皮、强降噪、锐化晕边或全局雾。

### 镜头设计起点

| 用途 | 可采用的视角意图 | 重点 |
|---|---|---|
| 人与环境 | 约 28–40 mm 等效，眼高或接近动作高度 | 背景仍能交代使用地点，机位不是无所不在的漂浮视角 |
| 半身使用 | 约 40–65 mm 等效，中等景深 | 表情与产品关系可读，不把脸手同时移出焦平面 |
| 手部操作/细节 | 约 50–85 mm 等效或合适近摄 | 不用超广角贴近手指；保留产品机构和接触处的清晰度 |

以上是原创复现建议，不是苹果原片的已知器材/光圈。平台未提供光学参数时只写视角与景深效果。关键操作默认固定机位或一个缓慢单轴移动；只有需要揭示环境、跟随人物或转移注意时再运镜。跟随要有起步、惯性和停稳，不能同时 orbit + dolly + zoom + rack focus。匹配切点优先维持轨迹，不为“丰富”加入抖动。

## 3. 定帧先解决摄影，H3 负责可信动作

1. 从原计划挑最易暴露问题的一镜：有人脸就验证脸，有手部操作就验证手与机构。既有代表接力包含这些内容时复用，不强行另加镜头或任务。
2. 把产品结构参考、人物身份参考、摄影气氛参考分开注明；使用多少图、能否编辑、参考是否锁定身份，以当次 Design 能力为准。没有多参考能力时先合成并检验可用定帧。
3. 看原尺寸脸、手、产品局部，以及全画面明暗分布。主光、暗面、背景和接触关系成立后才生成视频。低对比并非自动失败，关键是体积和空间是否可读。
4. H3 指令保留简短摄影锚点，主要篇幅给一个动作的因果和时序。动词优先于“award-winning / ultra-real / luxury / flawless”等泛词。不要为了增强质感重复十几个相互冲突的风格标签。
5. 检查完整源片，选择满足动作与摄影的区间；相邻帧的肤质、指节、轮廓、接触阴影与反射都要稳定。仅看首尾、仅靠2K、仅看手机缩略图不能通过真人质检。

### 英文定帧模板

按镜头填具体内容，不原样堆满每个字段；画面语言沿用项目设定。

```text
A live-action frame of [person] in [specific lived-in location], in the middle of
[task]. Preserve [product identity and visible state] from the product reference.
[Shot size, camera height and perspective]; focus on [eyes / contact plane],
with enough depth to read [essential details].
[Motivated key source] lights [specific surface] from [direction].
[Shadow side] remains darker with visible detail; [background region] has a
separate tonal level. [One plausible secondary source, if needed].
Natural local skin-tone variation, restrained skin sheen, believable hair and
fabric. [Specific material reflection and contact shadow].
[Exact hand preparation, gaze and product anchor]. Preserve [matched geometry].
Keep [2–3 relevant unwanted defects] out of the image.
```

### 英文 H3 示例 A：桌前展开产品，正常速度

例为折叠产品；只有项目资料支持相应机构和终态才采用。时长按平台能力调整，示例 5 秒不构成固定要求。

```text
One continuous live-action shot, five seconds, real-time movement. Preserve the
person, hands, sleeve, silver two-panel device and single hinge from the approved
first frame. A fixed camera looks down obliquely at the hand–device contact plane;
the hinge and both hands stay in focus, with the room softly readable behind them.
Side daylight from the window on camera left makes a soft highlight on the
knuckles and a narrow reflection on the metal. The near side remains darker,
with skin and fabric detail visible. Exposure and white balance stay stable.
0–0.6 s: the left hand supports the lower half; the right thumb settles beneath
the outer edge with light pressure.
0.6–2.6 s: the right hand opens the upper half around the existing hinge in one
ordinary movement, easing as the two rigid halves reach the approved flat state.
2.6–5 s: the hands settle naturally and the user looks at the revealed content.
The contact shadow and metal reflection respond to the changing angle.
Keep the same face and skin texture; no beauty smoothing, rubber fingers,
floating grip, extra hinge, camera orbit or exposure pulsing. No added text.
```

### 英文 H3 示例 B：人物使用产品，而非产品旁边站一个模特

```text
One continuous five-second live-action medium close shot. The same adult from
the approved reference sits at a used desk, reading a reply on the device just
below frame. Eye-level, natural perspective; focus stays on the near eye while
the hands and device remain legible. The camera is still.
A large window on camera left shapes the face; the far cheek stays softly
shadowed. A dim warm lamp deep in the room separates the background without
filling the face. Preserve natural facial asymmetry, subtle under-eye texture,
flyaway hair and the fabric's weight, without exaggerated pores.
The eyes finish reading, the thumb taps once, then a small, restrained smile
appears in response to the reply. The head makes only the adjustment needed to
read. Maintain identity, gaze direction and lighting throughout. No posed grin,
automatic slow motion, skin smoothing or drifting facial features.
```

若人物仅在通话屏幕内，先保证屏幕内的人脸有独立合理的环境、视线与光照；不要给小脸塞复杂表演。原生成反复失败时，在能力与额度允许范围内，可单独制作通话画面并做透视跟踪、遮挡和反射合成。必须记录为合成，不声称单次 H3 完成。

## 4. 有针对性的重试与后期边界

- 平光：先改首帧的光源方向、补光强度和背景层次，而非仅加“dramatic”；不能牺牲产品可读性。
- 蜡皮：先换/修身份定帧、减少美颜与风格词，再检验视频；不通过加颗粒制造假毛孔。
- 动作假：明确支撑、接触和受力，减少并行动作，必要时改机位展示关键关系；失败区间不能靠剪掉必要事件蒙混过关。
- 漂浮运镜：先固定机位验证动作，再按必要性增加单轴运动；不叠加后期推近。
- 闪烁/反射漂移：检查是否原定帧与尾帧光源矛盾；删掉不必要的尾帧约束仅在真实能力允许且终态仍可验证时采用。
- 曝光或肤色略偏但结构与时间稳定：可后期局部校正。几何、身份、受力和阴影逻辑错误，调色不能修复。

沿用每资产最多一次有针对性重试和项目总额度；重试记录“失败证据 → 单一主要改动 → 观察结果”，不是重复提交同一提示。没有生成授权就交付摄影方案和待验证提示。技能升级本身不表示已经做了 H3 对照实验；未实测项保持 pending。
