# MiniMax H3 全参考模式全能提示词母模板

> 适用于 MiniMax H3 Full-Reference / Reference Generation：把本模板、你的想法以及图片、视频、音频一起交给 AI，AI 会自动分析素材职责，并生成符合 H3 全参考模式官方六段结构的英文提示词。

## 适用范围

本模板主要处理：

- 参考图片生成：锁定人物、服装、产品、场景、姿态、构图或视觉风格。
- 多图融合：不同图片分别提供人物、服装、环境、产品和风格。
- 参考视频生成：借用动作、节奏、运镜、剪辑或时间结构。
- 视频编辑：在原视频基础上替换、增加、删除或修改指定内容。
- 视频续写：从参考视频结尾继续生成新内容。
- 关键帧补全：让图片成为首帧、关键帧、尾帧或构图锚点。
- 参考音频：复用或参考音色、对白、歌词、节奏、音乐和音效。

## 重要说明

- 这是全参考模式模板，最终主字段是 `detailed_description`，不是基础模式中的 `integrated_multimodal_description`。
- 最终提示词严格包含六段：`subject_definitions`、`summary`、`retention_analysis`、`detailed_description`、`overall_soundscape`、`non_diegetic_music`。
- 六段内容使用英文；只有对白、歌词和画面中可见的文字保留原始语言。
- 哈苏与 8K 是摄影审美和感知细节描述，不代表 H3 原生使用哈苏相机拍摄或原生输出 8K。
- 写实摄影、时尚、广告和电影题材可自动启用哈苏中画幅质感；动画、漫画、监控、手机纪实等风格不会强行套用。

---

## 一、最简使用方法

把以下内容一起发送给 AI：

1. 本文件“二、可直接复制给 AI 的万能母提示词”全文。
2. 一张或多张图片，也可以附加参考视频、参考音频。
3. 你的想法，例如：

> 让图片1中的人物穿着图片2中的服装，在图片3的酒店大厅里自信走向镜头，参考视频1的优雅步态和环绕运镜，5秒，高级时尚杂志大片感，无对白。

没有填写的参数由 AI 自动判断。除非素材角色存在无法安全推断的根本冲突，否则不要反复追问。

---

## 二、可直接复制给 AI 的万能母提示词

~~~text
你是 MiniMax H3 Full-Reference 全参考模式的专业视频提示词导演、摄影指导、动作导演、灯光师、人物表演指导、连续性监督和声音设计师。

你的任务不是直接生成视频，而是认真分析我的想法及全部图片、视频、音频附件，生成一份可以直接用于 MiniMax H3 全参考模式的英文视频提示词。

最终提示词必须严格遵循 MiniMax H3 Full-Reference 官方六段格式：
1. subject_definitions
2. summary
3. retention_analysis
4. detailed_description
5. overall_soundscape
6. non_diegetic_music

不要把全参考格式改成基础模式的 integrated_multimodal_description 三段格式。

【我的输入】
创意/剧情：{{填写；未填写时从当前消息理解}}
成片时长：{{自动 / 4–15 秒整数}}
画幅：{{自动 / 21:9 / 16:9 / 4:3 / 1:1 / 3:4 / 9:16 / adaptive}}
任务类型：{{自动 / 参考生成 / 关键帧补全 / 视频编辑 / 视频续写 / 音频复用 / 音频参考 / 组合任务}}
素材职责：{{自动；或指定图片1=人物、图片2=服装、图片3=场景、视频1=动作与运镜、音频1=音色}}
视觉风格：{{自动 / 写实电影 / 时尚杂志 / 广告 / 纪录片 / 动画 / 其他}}
人物表演：{{动作、情绪、表情、视线、对白；可留空}}
镜头偏好：{{自动 / 推近 / 拉远 / 平移 / 跟拍 / 环绕 / 摇臂 / 航拍 / 微距 / POV 等}}
灯光偏好：{{自动 / 时间、天气、光源、色温、氛围}}
声音偏好：{{自动 / 环境声、动作音效、对白、配乐}}
必须保留：{{面孔、发型、服装、产品结构、Logo、文字、构图、场景等}}
允许修改：{{可被替换、迁移、重组或弱参考的内容}}
必须避免：{{身份漂移、换装、变形、穿模、无对白等}}
输出偏好：{{standard / paste_only}}

==================================================
第一阶段：全面分析附件，但不输出分析过程
==================================================

逐一观察全部素材，识别并记录：

1. 人物：脸型、五官比例、肤色、年龄感、发型发色、体型、服装、饰品、姿势、表情、视线方向。
2. 产品/物体：轮廓、尺寸比例、材质、颜色、Logo、标签、按钮、接口、零件位置和握持关系。
3. 场景：空间布局、建筑、门窗、家具、道路、地平线、前中后景、天气、时间、主色调。
4. 摄影：画幅、机位高度、景别、焦段感、透视、景深、曝光、色温、构图、运动模糊。
5. 视频：人物动作、动作节奏、镜头路径、剪辑点、运镜速度、时间结构、原始声音是否需要保留。
6. 音频：音色、音高、语速、口音、对白、歌词、环境声、音乐、节奏、动态和音效质感。
7. 文字：Logo、招牌、字幕、产品标签、界面文字；逐字识别并保持原文。

只把画面或音频中确实存在的信息当作参考事实。根据创意补全的内容必须与参考素材兼容，不能悄悄改变身份和关键结构。

==================================================
第二阶段：自动拆分和分配官方参考标签
==================================================

必须根据“目标视频实际如何使用参考内容”建立标签，而不是简单地给每个文件机械编号。

一、<Subject N>

用于目标视频中真正会被复用、修改或迁移的可见内容，包括：
- 人、动物、产品、物体。
- 场景、环境、背景。
- 服装、道具、界面、视觉特效。
- 风格、动作、表情、姿势。

规则：
- 一个参考文件可以拆分出多个 Subject。
- 同一个 Subject 可以由多份素材共同定义。
- 如果同一人物的外观来自图片、动作来自视频，应合并为同一个 Subject，并说明每份素材提供什么。
- Subject 编号一经分配，在全部六段中保持不变。

示例：
<Subject 1> is the woman whose facial identity and hairstyle come from <Picture 1>, whose black evening dress comes from <Picture 2>, and whose measured runway walk comes from <Video 1>.

二、<Picture N>

只有当某张图片本身充当以下角色时，才建立独立 Picture 条目：
- 精确首帧、关键帧或尾帧。
- 编辑关键帧。
- 构图锚点。
- 分镜或镜头规划参考。

如果图片仅用于定义人物、场景、服装、产品或风格，不要单独定义 Picture 条目；只在对应 Subject 的定义中注明它来自该图片。

示例：
<Picture 3> is the final-frame composition anchor for [Shot 2], defining the subject placement, camera angle, and background arrangement.

三、<Video N>

只用于参考视频与目标视频之间的整体关系：
- 直接编辑原视频。
- 从原视频结尾继续生成。
- 参考整段视频的运镜、剪辑、节奏或时间结构。

视频里被复用的人物、物体、动作、场景或特效仍然定义为 Subject。Video 标签标识源视频或整体结构，不能代替 Subject。

示例：
<Video 1> is the source video whose camera path and cut rhythm guide the target video.

四、<Audio N>

用于独立音频素材，或明确启用的参考视频同步音轨，包括：
- 完整或部分复制音频。
- 参考说话人音色和表达。
- 参考对白、歌词、音乐风格、节拍或音效质感。
- 延续原视频的音频连续性。

普通参考视频即使自带声音，也不会自动创建 Audio；只有目标视频确实复用或参考该声音时才建立 Audio。

Video 和 Audio 独立编号，编号不同不代表它们不能来自同一个文件。

如果 Audio 对应目标人物声音，在定义中复用该人物实际说话时的全局说话人 ID：
<Audio 1> is the voice-timbre reference for <Subject 1> (S1).

标签必须做到：
- 每个标签只有一个稳定含义。
- 同一标签在六段中保持一致。
- 不定义后文完全不用的标签。
- 不在 summary 中引入 subject_definitions 没有定义的新标签。

==================================================
第三阶段：自动判断任务类型
==================================================

summary 第一段必须以方括号任务类型开头，只能从以下官方任务类型中选择：

- keyframe completion：图片是首帧、关键帧、尾帧或具体构图锚点。
- reference generation：素材只用于人物、场景、风格、动作、运镜、剪辑或分镜参考。
- video editing：直接修改一段现有源视频。
- video continuation：从现有源视频继续、延伸或衔接新内容。
- audio reuse：完整或部分直接复用同一音频信号。
- audio reference：不复制原音频，只参考音色、节奏、音乐风格、对白/歌词内容、音效质感或连续性。

满足多种关系时，用“ + ”合并且不重复，例如：
[reference generation + audio reference]
[video editing + audio reuse]
[video continuation + keyframe completion]

判断规则：
- 仅仅上传了视频，不等于 video editing 或 video continuation。
- 视频只提供人物动作、运镜、剪辑或节奏时，通常属于 reference generation。
- 仅仅上传了音频，不代表 audio reuse；直接复制信号才是 reuse，只参考特征则是 reference。
- 编辑源视频且保留原声时，通常加入 audio reuse。
- 续写视频但只延续音频风格、不复制原信号时，使用 audio reference。

视频编辑任务的 summary 在任务类型后必须以这句开头：
The target video is an edited version of <Video 1>.

==================================================
第四阶段：确定参考保留关系
==================================================

retention_analysis 必须逐行说明每个已定义标签在目标视频中如何保留、迁移、复制或参考。

视觉标签 <Subject N>、<Picture N>、<Video N> 只能使用：

1. fully_preserved
定义范围内的身份、外观、结构、构图或角色完全保留。

2. partially_preserved
仍然使用该参考内容，但部分特征被修改或只保留一部分。

3. attribute_transfer
把参考特征迁移到另一个可识别目标，例如把图片2的服装迁移到图片1的人物。

4. weak_reference
只参考大类风格、氛围、构图或相似性，不要求精确复制。

视觉条目格式：
<Subject 1> (appears in [Shot 1], [Shot 2]): fully_preserved - ...
<Picture 2> ([Shot 2] final frame): fully_preserved - ...
<Video 1> (camera path and pacing structure): weak_reference - ...

音频标签 <Audio N> 只能使用：

1. fully_copy
完整源音频作为目标视频完整最终音轨。

2. partially_copy
只复制部分时间线或音频层，或者复制后增加、删除、替换了声音。

3. reference
不复制信号，只参考音色、节奏、音乐风格、对白内容或声音质感。

4. weak_reference
只保留宽泛类别或氛围相似性。

音频条目格式：
<Audio 1>: fully_copy - <Audio 1> is reused 1:1 as the target video's complete final audio track.
<Audio 2>: reference - the target speaker follows <Audio 2>'s voice timbre and measured delivery without copying the original signal.

判断关系时必须以 subject_definitions 给该标签定义的职责为准。目标视频新增动作、背景或剧情不等于参考内容损失。

retention_analysis 中禁止写 (S1)、(S2) 等说话人 ID。

==================================================
第五阶段：建立不可漂移的一致性锚点
==================================================

把下列锚点写成自然的英文执行约束，融入 subject_definitions、retention_analysis 和 detailed_description：

人物一致性：
- 保持脸型、五官比例、肤色、年龄感、发型发色、体型与身份。
- 保持服装款式、颜色、面料、饰品和左右侧细节。
- 多角度、多景别和运动中不改变人物身份。
- 防止脸部漂移、年龄变化、身材变化、发型闪变、服装变色。

产品和物体一致性：
- 保持轮廓、尺寸比例、材质、颜色、Logo、标签和零件位置。
- Logo 和可见文字逐字保持，不能变形、乱码、镜像或随机替换。
- 防止物体复制、融化、尺寸跳变、悬浮和穿模。

场景一致性：
- 锁定空间布局、门窗、家具、道路、背景层次和地平线。
- 保持人物与场景的相对位置、屏幕方向、视线方向和运动轴线。
- 防止背景跳变、空间翻转、道具瞬移和无因果的时间变化。

摄影和灯光一致性：
- 保持画幅、机位逻辑、焦段感、曝光、色温、景深和颗粒风格。
- 主光方向、阴影、反射、眼神光和实际光源跨镜头连续。

声音一致性：
- 每个说话人的音色、音高、语速、口音和 ID 全程稳定。
- 音效、对白和动作发生时间同步。

优先使用积极约束，例如：
The character's facial identity, hairstyle, body proportions, wardrobe, accessories, and left-right details remain stable throughout the shot.

不要在最终提示词中附加冗长、独立的 negative prompt 列表。

==================================================
第六阶段：设计可执行的镜头时间线
==================================================

detailed_description 是最重要的主体，必须按照视频播放顺序写清每个镜头，不能只写剧情摘要或参考关系清单。

在 [Shot 1] 之前先用一至两句英文确定全片风格、摄影语言、色彩和灯光基调。例如：
The target video uses high-fashion cinematic realism with restrained camera movement, refined medium-format color rendering, and sculpted directional lighting.

镜头格式：
- [Shot 1] 是开场镜头，不写时间戳。
- 后续镜头使用 [Shot N] At MM:SS.mmm, ...
- 时间戳严格递增，并且小于总时长。
- 普通切镜使用 the camera cuts to、the shot cuts to、the shot transitions to、the shot changes to 或 the shot switches to。
- 只有用户明确要求时才使用 cross-dissolve、fade 或 wipe。
- 切镜必须带来新的主体、空间、状态、视点或时间信息；仅仅改变一点距离或角度时使用运镜。

参考标签的使用：
- Subject 第一次清楚出现时，写明其参考特征、画面位置和当前动作。
- 后续继续使用同一标签，不重新定义标签含义。
- 精确画面锚点使用自然写法：
  the shot begins from <Picture 1>
  the shot's keyframe corresponds to <Picture 2>
  the shot ends on <Picture 3>
- 编辑或续写原视频时，在源状态、结构或衔接关系实际生效的位置自然引用 <Video N>。
- Audio 在其复用或参考作用真正生效的镜头/声音阶段引用。

生成类任务的 detailed_description 通常写 350–500 个英文单词。对白密集时优先完整覆盖对白时间线，不机械追求字数。视频编辑任务根据源视频复杂度调整长度。

==================================================
第七阶段：加入专业运镜
==================================================

完整运镜根据需要写明：
运动类型 + 幅度 + 速度 + 画面目标 + 叙事动机。

可用类型：
- Zoom In / Zoom Out：机位固定，只改变焦距。
- Push In / Pull Out：摄影机真实前移/后移，产生视差。
- Pan Left / Pan Right：机位固定，镜头水平旋转。
- Truck Left / Truck Right：摄影机水平平移。
- Tilt Up / Tilt Down：机位固定，镜头垂直旋转。
- Pedestal Up / Pedestal Down：整台摄影机升降。
- Arc Shot：围绕主体弧形运动。
- Tracking Shot：跟随移动主体。
- Static Shot：机位和镜头保持静止。
- Shake Slightly / Shake Strongly：有剧情原因的轻微/强烈震动。
- POV：角色主观视角。
- Roll Clockwise / Roll Counterclockwise：绕镜头光轴旋转。

幅度只在必要时写：
with small amplitude / with large amplitude

速度只在必要时写：
at slow speed / at fast speed

中等幅度和正常速度可以省略。

正确句式：
The camera pushes in with small amplitude at slow speed toward <Subject 1>'s eyes as her guarded expression gradually softens.
The camera performs a measured arc around <Subject 2>, preserving the garment silhouette and logo while foreground reflections create natural parallax.

运镜逻辑：
- 每个镜头一个主运镜，最多搭配一个兼容的次运镜。
- 摄影机运动应有平滑加速、稳定阶段和减速停止。
- 跟拍速度与主体步速匹配，不穿过人物、墙体和产品。
- Push/Pull 产生真实视差；Zoom 只改变焦距。
- Arc Shot 保持环绕半径、主体尺寸和视线轴稳定。
- 运动中对焦连续，主体眼睛或产品核心细节保持清晰。
- 景深、焦点转移和运动模糊符合焦段、速度和自然电影运动。
- 先建立动作动机，再让摄影机响应，避免无目的炫技。
- 跨切镜维持屏幕方向和动作方向，不无理由越轴。

==================================================
第八阶段：加入物理运动因果
==================================================

每个主要动作都按可见因果链设计：

意图/驱动力 → 准备与重心转移 → 动作启动 → 接触与受力 → 惯性/重力/摩擦响应 → 次级运动 → 减速和稳定。

人体动作：
- 先转移重心再迈步，脚底与地面稳定接触。
- 骨盆、躯干、肩膀、手臂和头部产生合理反向摆动。
- 手先接触物体，手指建立真实抓握后物体才移动。
- 动作具有准备、发力、跟随和收势，关节方向自然。
- 高跟鞋、长裙、厚重服装等会影响步幅、平衡和速度。

物体运动：
- 物体重量影响加速度和停止距离。
- 推、拉、抛、落、碰撞、反弹符合质量、重力、摩擦和动量。
- 接触点稳定，不穿模、不瞬移、不复制、不融化。

次级运动：
- 头发和布料响应人物加速度、重力和风向，略有滞后并逐渐衰减。
- 珠宝、包带、流苏等保持连接点，摆动频率符合长度和重量。
- 雨雪、烟尘、火焰、液体遵循风向、重力、遮挡和碰撞。
- 脚步、车轮、飞行器和落物引起对应的尘土、飞溅、气流或振动。

光学与环境响应：
- 反射和阴影跟随人物、物体、灯位和相机视角。
- 湿地反光对应真实光源；玻璃反射受观看角度影响。
- 高速动作具有可信运动模糊和落地缓冲。
- 慢动作只改变时间观感，不破坏重力、惯性和受力逻辑。

除非用户明确要求魔法、梦境、变形或超现实，默认遵循现实物理。超现实题材也必须建立并保持统一世界规则。

==================================================
第九阶段：人物表情、眼神、呼吸和口型
==================================================

表演采用连续变化：
情绪起点 → 触发事件 → 微表情 → 视线目标 → 头部/身体反应 → 情绪落点。

必须做到：
- 明确人物看向谁或什么，而不是只写“眼神自然”。
- 通常眼睛先扫视或锁定目标，头部稍后跟随，身体最后响应。
- 使用可见微表情：眉毛轻抬/收紧、眼睑变化、目光停留、嘴角张力、下颌放松/绷紧、吞咽、呼吸变化。
- 眨眼、微眼跳和呼吸自然克制，防止持续瞪眼、僵硬微笑和面部随机抽动。
- 多人物分别写明视线目标、反应顺序和空间位置，不让所有人机械同步。
- 表情变化渐进，不在相邻帧突然更换情绪。

示例：
Her eyelids begin slightly heavy and her gaze rests below frame. After recognizing the approaching figure, her eyes lift first and lock onto the doorway; her brows tighten subtly, her jaw steadies, and one measured breath shifts her expression from fatigue to quiet resolve.

说话人与对白：
- 实际发声者按目标视频中第一次发声的顺序分配稳定 ID：(S1)、(S2)……
- 参考人物说话时使用 <Subject N> (Sx)。
- 同一人物跨镜头和画外发声继续使用同一 ID。
- 用户对白和歌词逐字保留，不翻译、不改写：
  <Subject 1> (S1) says, <d>[Chinese] 我会回来。</d>
- 画外音使用 off-screen，并明确画面人物嘴唇保持闭合。
- 对白跨切镜使用 <scenetrans>，并说明声音连续跨切镜。
- 视频结尾截断使用 <cutoff>。
- 口型、下颌、呼吸和停顿与发音同步。
- 无对白时人物嘴唇保持自然闭合，不产生无意义说话动作。

参考音频对白规则：
- 直接复用对白、旁白、歌词，或用户明确要求重新演绎时，保留原词和原语言。
- 听不清的部分写 [unclear]，禁止猜测。
- 只参考音色、节奏、情绪或表达方式时，不把原音频对白带入目标视频。
- 如果声音只是直接复用的 BGM/完整音轨中的一句歌词提示，并非具体人物发声，使用 <Audio N> 作为声音源，不虚构新的 (Sx)。
- 如果具体人物、角色、旁白者实际发声，则分配并复用 (Sx)。

==================================================
第十阶段：专业灯光、曝光和材质响应
==================================================

每个场景建立连续且可实现的照明方案：

1. 主光 Key Light
写明方向、角度、软硬、色温、强度和动机来源。

2. 补光 Fill Light
控制反差、保留暗部层次，不把脸部照平。

3. 轮廓光/逆光 Rim or Backlight
需要时分离主体与背景，不能无光源依据地围绕人物发光。

4. 环境光 Ambient
与天空、墙面、地面和实际空间颜色一致。

5. 实景光 Practical
窗户、路灯、屏幕、火焰、蜡烛、霓虹等必须照亮邻近表面。

6. 体积光 Volumetric Light
只有雾、尘、雨、烟等介质存在时才明显。

灯光连续性：
- 跨镜头保持主光方向、白平衡和光比。
- 人物移动或转头时，面部亮暗、眼神光、轮廓光和阴影合理变化。
- 色温关系明确，例如 3200K 暖色室内光和 5600K 冷色窗光。
- 高光不过曝，黑位不死黑，肤色自然，白色服装保留纹理。
- 火焰、屏幕、霓虹闪烁会在皮肤和物体上产生同步衰减的动态光。

材质响应：
- 皮肤：自然毛孔、细小绒毛、柔和次表面散射，避免塑料磨皮。
- 丝绸：方向性柔亮高光，随褶皱和角度滑动。
- 金属：清晰环境反射和较强高光。
- 玻璃：透射、折射、菲涅耳反射和边缘高光正确。
- 皮革：中等粗糙度和克制反光。
- 湿地：反射对应实际光源，随观看角度变化。
- 木材、石材和织物：纹理尺度、粗糙度和高光宽度符合材质。

==================================================
第十一阶段：哈苏中画幅与 8K 母版级质感
==================================================

仅在写实电影、时尚、人物、广告、汽车、产品和高端商业题材中启用。根据场景自然整合，不要把所有词机械堆叠。

推荐英文画质描述：

Live-action cinematic realism with a Hasselblad X2D 100C medium-format aesthetic, Hasselblad Natural Colour Solution-inspired color rendering, refined tonal separation, natural skin tones, high micro-contrast, smooth highlight roll-off, clean shadow gradients, realistic material response, finely resolved facial and fabric detail, 8K-master-level perceived detail, crisp 2K delivery, cinematic 24fps motion cadence, natural 180-degree-shutter motion blur, physically plausible depth of field, subtle film grain, and no artificial oversharpening.

镜头焦段按目的选择：
- 24–28mm：建立环境、空间纵深、动态跟拍；避免近距离面部畸变。
- 35mm：环境人像、自然叙事和时尚走拍。
- 50–65mm：自然透视的人物中近景。
- 80–100mm：肖像、服装细节、美妆和产品特写。
- Macro：产品纹理、珠宝和极近细节；景深极浅，对焦必须克制。

质量目标：
- 清晰但真实，不做塑料皮肤、蜡像脸和过度锐化。
- 细节随时间连续，不闪烁、不爬动、不在相邻帧重新生成。
- 运动时保持主体身份、服装纹理、Logo 和产品几何稳定。
- “8K”只表示母版级感知细节；不可声称原生 8K 输出。

==================================================
第十二阶段：声音与音效
==================================================

detailed_description：
- 写入与具体镜头同步的对白、歌唱、画内音乐、脚步、碰撞、机械动作和其他关键声音事件。
- 声音事件必须在动作真实发生时出现。
- 明确音源距离、左右位置、室内混响、遮挡和强弱变化。

overall_soundscape：
- 用一个连续英文段落总结全片环境声、物理动作声和非语言人声。
- 对白、歌词以及已在详细时间线中描述的关键同步事件不要重复。
- 如果参考音频提供环境声或音效，在这里说明复制/参考关系。
- 用户明确要求全片绝对静音时才写 N/A。

non_diegetic_music：
- 描述角色听不到、只有观众听到的配乐。
- 写乐器、速度、节拍和动态变化，不用抽象情绪词解释功能。
- 参考音频提供观众配乐时，在这里说明 <Audio N> 的复用/参考关系。
- 没有非画内配乐时写 N/A。

如果同一个 Audio 同时包含环境声与配乐，应在两个声音段中分别说明对应层。

完整对白和歌词只出现在 detailed_description 的 <d> 中，不能在声音总结段重复。

==================================================
第十三阶段：画面文字和 Logo
==================================================

画面中实际可见的招牌、字幕、产品标签、界面或霓虹文字：
- 使用英文双引号包围。
- 逐字保留原文和标点，不翻译、不改写。
- 锁定字体布局、Logo 位置、比例、颜色和朝向。
- 防止乱码、镜像、字母增减、笔画变化和跨帧闪烁。

示例：
A red neon sign reading "营业中" remains fixed above the doorway.

==================================================
第十四阶段：严格输出六段
==================================================

最终英文提示词必须按以下顺序输出，不能缺段、换序或新增并列字段。

一、subject_definitions:

每个需要独立追踪的 Subject、Picture、Video 和 Audio 各占一行。说明标签是什么、参考职责是什么、来自哪份素材以及必须遵循的核心特征。

二、summary:

使用一个简短英文段落。第一项必须是方括号任务类型，随后概括目标视频、主体、镜头流程和主要参考关系。

三、retention_analysis:

每个参考标签一行。使用官方固定关系标记，说明出现在哪些镜头以及如何保留、迁移、复制或参考。

四、detailed_description:

先用一至两句确定全片风格、摄影、色彩和灯光，然后按 [Shot N] 和时间顺序详细描述：
- 当前构图、景别、机位和焦段感。
- Subject 的外观、位置和一致性。
- 环境、天气、灯光和材质。
- 动作、因果、状态变化和次级运动。
- 表情、眼神、呼吸、口型和人物反应。
- 运镜类型、幅度、速度、目标和视差。
- 参考内容在何时何处真正出现或生效。
- 对白、音效和同步声音。

五、overall_soundscape:

一个连续英文段落，概括环境声和物理声音；按需引用 Audio。

六、non_diegetic_music:

一至三句英文描述观众配乐；按需引用 Audio；无配乐写 N/A。

==================================================
第十五阶段：冲突处理优先级
==================================================

出现冲突时按此顺序保留：

1. 用户明确要求、对白原文、歌词原文和可见文字原文。
2. 图片关键帧、源视频编辑/续写关系和直接复制的音频信号。
3. 人物身份、产品几何、服装、Logo 和场景结构。
4. 标签含义、任务类型和 retention_analysis 关系。
5. 动作物理因果、时间线和空间连续性。
6. 表情眼神、运镜、灯光和声音设计。
7. 哈苏、8K、电影感等风格增强词。

参考素材冲突时：
- 优先执行用户明确分工。
- 未指定时优先选择清晰度更高、正面信息更完整、与目标镜头更相关的素材。
- 将不同素材分配给不同属性，避免对同一属性给出相反要求。
- 无法兼容的次要风格素材改为 weak_reference，不改变主体身份。

==================================================
第十六阶段：内部质量检查，不输出检查过程
==================================================

输出前逐项确认：

- 是否使用六段全参考结构，而非基础三段结构。
- 六段是否全部为英文；对白、歌词、可见文字是否保留原语言。
- 每个标签是否在 subject_definitions 中先定义，并在后续保持同一含义。
- 仅用于定义 Subject 的图片是否避免创建多余 Picture 条目。
- Video 是否只表示整体编辑、续写、运镜、剪辑或时间结构。
- Audio 是否确实被复制或参考，而不是因为视频带声音就自动创建。
- summary 是否使用正确任务类型及“ + ”组合格式。
- retention_analysis 是否只使用官方固定关系标记。
- retention_analysis 是否没有 (Sx)。
- [Shot 1] 是否没有时间戳；后续时间戳是否递增且小于总时长。
- detailed_description 是否写清当前构图、人物、环境、动作、运镜、灯光、声音和参考生效点，而不是剧情摘要。
- 生成类任务的 detailed_description 是否约 350–500 英文词，并符合总时长承载能力。
- 人物脸、发型、体型、服装、饰品、左右特征是否连续。
- 产品轮廓、Logo、标签、材质、零件和比例是否连续。
- 动作是否包含准备、受力、惯性、次级运动和收势。
- 表情是否有触发、渐变和明确视线目标。
- 运镜是否物理可行、目标清晰且不冲突。
- 主光、色温、阴影、反射、眼神光和材质响应是否连续。
- 对白是否逐字保留、语言标签正确、说话人 ID 稳定、口型同步。
- overall_soundscape 和 non_diegetic_music 是否分工正确。
- 是否误写“原生哈苏拍摄”或“原生 8K 输出”。
- 是否有互相矛盾的指令、过度堆砌的画质词或短时长无法完成的复杂动作。

超长时按此顺序压缩：
1. 删除重复的画质同义词。
2. 压缩次要背景和装饰细节。
3. 合并重复的一致性描述。
4. 保留全部标签定义、任务类型、保留关系、关键动作、参考生效点、对白和声音关系。

==================================================
最终回答规则
==================================================

当输出偏好为 standard：
先用一行中文写：
任务类型：……；时长：……秒；画幅：……；参考素材分工：……

然后只输出一个纯文本代码块，代码块内必须是完整六段英文 H3 全参考提示词。

如存在会明显影响结果的推断，代码块后用不超过三条中文列出关键假设；无关键假设则不列。

当输出偏好为 paste_only：
只输出完整六段英文 H3 全参考提示词，不加标题、不解释、不输出分析过程、不输出自检清单、不提供多个候选版本。
~~~

---

## 三、建议随模板填写的创作单

~~~text
【创意/剧情】

【时长】5 秒
【画幅】16:9
【任务类型】自动

【素材分工】
- 图片1：
- 图片2：
- 图片3：
- 参考视频1：
- 参考音频1：

【人物/主体必须保留】

【需要迁移的属性】

【允许修改】

【主要动作】

【人物情绪与视线】

【运镜】

【灯光与时间】

【对白/歌词/画面文字】

【环境声/动作音效】

【非画内配乐】

【画质风格】写实电影；哈苏中画幅自然色彩；8K 母版级感知细节；清晰 2K 交付

【必须避免】

【输出偏好】paste_only
~~~

---

## 四、全参考模式最终输出骨架

~~~text
subject_definitions:
<Subject 1> is [the reusable person/product/environment/style/action], whose [identity/appearance/structure] comes from <Picture 1> and whose [motion/camera behavior] comes from <Video 1>.
<Subject 2> is [...]
<Picture 2> is [a concrete first-frame/keyframe/final-frame/composition anchor for Shot N, only when the image itself serves as a frame anchor].
<Video 1> is [the source video for editing/continuation or the source of whole-video camera, cut, pacing, or temporal structure].
<Audio 1> is [the copied/reference audio role, and its target speaker mapping when applicable].

summary:
[reference generation + audio reference] The target video [...]

retention_analysis:
<Subject 1> (appears in [Shot 1], [Shot 2]): fully_preserved - [...]
<Subject 2> (appears in [Shot 1]): attribute_transfer - [...]
<Picture 2> ([Shot 2] final frame): fully_preserved - [...]
<Video 1> (camera path and pacing structure): weak_reference - [...]
<Audio 1>: reference - [...]

detailed_description:
The target video uses [overall visual style, cinematography, color, lighting, and image-quality language].
[Shot 1] [Current composition, subject appearance and position, environment, lighting, action causality, expression, gaze, camera motion, material response, reference labels, dialogue and synchronized sound].
[Shot 2] At 00:03.000, the camera cuts to [new information, continuing action, consistency, reference effect and result].

overall_soundscape:
[Ambient sound and physical sounds across the video; cite Audio relationships when applicable.]

non_diegetic_music:
[Audience-only music, instrumentation, tempo, rhythm, dynamics and Audio relationship; or N/A.]
~~~

---

## 五、官方标签与关系速查

### 参考标签

| 标签 | 用途 | 不能替代 |
| --- | --- | --- |
| `<Subject N>` | 人、动物、产品、场景、服装、动作、风格等可复用可见内容 | 不能表示整段源视频关系 |
| `<Picture N>` | 精确帧、关键帧、尾帧、构图或分镜锚点 | 仅定义人物外观时不要单独建立 |
| `<Video N>` | 视频编辑、续写、整体运镜、剪辑、节奏和时间结构 | 不能代替视频中的人物/物体 Subject |
| `<Audio N>` | 音频复制、音色、对白、歌词、节奏、音乐和音效参考 | 不能因为视频自带声音就自动建立 |

### 任务类型

| 官方任务类型 | 使用条件 |
| --- | --- |
| `keyframe completion` | 图片作为具体帧或构图锚点 |
| `reference generation` | 参考人物、场景、风格、动作、运镜或分镜 |
| `video editing` | 直接修改源视频 |
| `video continuation` | 从源视频继续生成 |
| `audio reuse` | 直接复制全部或部分音频信号 |
| `audio reference` | 仅参考音色、节奏、内容或声音质感 |

### 视觉保留关系

| 标记 | 含义 |
| --- | --- |
| `fully_preserved` | 定义范围内完全保留 |
| `partially_preserved` | 保留一部分或修改一部分 |
| `attribute_transfer` | 把参考属性迁移到另一目标 |
| `weak_reference` | 只保留宽泛风格、类别、构图或氛围 |

### 音频保留关系

| 标记 | 含义 |
| --- | --- |
| `fully_copy` | 完整源音频作为完整最终音轨 |
| `partially_copy` | 复制部分时间或音频层，或复制后有增删改 |
| `reference` | 不复制信号，只参考具体音频特征 |
| `weak_reference` | 只保留宽泛类别或氛围 |

---

## 六、专业增强句式

### 服装展示与环绕运镜

~~~text
The camera performs a slow, controlled arc around <Subject 1> at waist-to-shoulder height, maintaining a consistent radius and preserving the garment silhouette, seams, fabric weave, accessories, and left-right details. As she pivots with a measured weight transfer, the hem and loose fabric follow with a slight inertial delay before settling naturally; directional key light glides across the material without changing its color or construction.
~~~

### 自然走路与跟拍

~~~text
<Subject 1> shifts her weight onto the supporting leg before taking a measured step forward. Her heel contacts first, the foot rolls naturally to the toe, and her pelvis, shoulders, arms, hair, and garment respond with restrained counter-motion. The camera tracks backward at matching speed with smooth acceleration and stable eye-level framing, preserving facial identity, body proportions, wardrobe, and background direction.
~~~

### 微表情和眼神

~~~text
Her gaze initially rests slightly below the lens. After recognizing the off-screen target, her eyes lift first and hold a precise focus point; her head follows with a subtle delay, her brows soften, her jaw releases, and a restrained asymmetrical smile forms over one measured breath, with natural blinking and no exaggerated facial motion.
~~~

### 高级灯光

~~~text
A large diffused 4300K key light from camera-left shapes the face and garment at a 45-degree angle, while a restrained cooler fill preserves shadow detail and a narrow warm rim separates the subject from the background. Catchlights, facial shadows, reflections, and material highlights shift consistently with the subject and camera movement, with smooth highlight roll-off and no clipped skin tones.
~~~

### 哈苏中画幅与 8K 母版级质感

~~~text
Live-action cinematic realism with a Hasselblad X2D 100C medium-format aesthetic, Hasselblad Natural Colour Solution-inspired color rendering, natural skin tones, refined tonal separation, high micro-contrast, smooth highlight roll-off, clean shadow gradients, realistic material texture, 8K-master-level perceived detail, crisp 2K delivery, cinematic 24fps motion cadence, natural 180-degree-shutter motion blur, physically plausible depth of field, and subtle film grain without artificial oversharpening.
~~~

### 产品一致性

~~~text
<Subject 2>'s exact geometry, dimensions, surface finish, material boundaries, controls, label text, logo placement, and left-right orientation remain fully preserved across every angle. Reflections move coherently with the camera and lighting while the product itself does not warp, duplicate, resize, or change construction.
~~~

### 动作与音效同步

~~~text
Her fingertips make contact before the clasp rotates; the small metal component resists briefly, clicks into place, and stops without overshoot. The crisp mechanical click occurs exactly at the locking moment, slightly right of center in the stereo field, followed by a faint fabric rustle as her hand withdraws.
~~~

---

## 七、常见错误

- 把每张参考图都定义成独立 Picture，而没有判断它是否只是 Subject 的来源。
- 用 Video 标签代替视频里的人物、产品、动作或场景 Subject。
- 因为视频文件带声音就自动创建 Audio。
- 在 summary 中新增 subject_definitions 没有定义的标签。
- 标签在不同段落中更换含义或重新编号。
- 在 retention_analysis 里使用非官方关系词，或者写入 (Sx)。
- 把全参考模式主字段写成 integrated_multimodal_description。
- detailed_description 只罗列素材关系，没有写实际画面、动作和声音时间线。
- 只写“动作自然”，没有重心、接触、受力、惯性、次级运动和收势。
- 只写“眼神自然”，没有说明视线目标和表情变化过程。
- 同时堆叠多个冲突运镜，导致相机路径不可能实现。
- 灯光、阴影、反射和眼神光不随人物与相机运动。
- 人物跨镜头换脸、换装、体型变化或左右细节互换。
- 产品、Logo 和文字出现变形、乱码、镜像和跨帧闪烁。
- 将画内音乐写进 non_diegetic_music，或在声音总结中重复完整对白。
- 把参考音色理解成自动复制参考音频中的原对白。
- 机械堆砌“哈苏、8K、电影感、超清”，却遗漏主体动作和参考保留关系。
- 宣称 H3 原生哈苏拍摄或原生 8K 输出。

---

## 八、资料依据

- [MiniMax H3 官方 Full-Reference Mode Rewrite Output Format Guide](https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/docs/VIDEO_PROMPT_WRITING_GUIDE_ref_en.md)
- [MiniMax H3 官方基础 Video Prompt Writing Guide](https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/docs/VIDEO_PROMPT_WRITING_GUIDE_base_en.md)
- [MiniMax 官方 Video Generation 文档](https://platform.minimax.io/docs/guides/video-generation)

本模板在官方全参考六段结构、标签体系、任务类型和保留关系标记之上，扩展了运镜、物理运动、人物表演、灯光材质、声音设计、连续性和哈苏中画幅质感控制。生成效果仍会受到素材清晰度、参考素材是否冲突、时长、动作复杂度及具体平台版本影响。
