# **模板一：MiniMax-H3 单图图生视频（I2V）官方 Skill 标准模板**



**适用场景：仅有一张起始参考图（Picture 1），进行单镜头动作生成与台词演绎。**



integrated\_multimodal\_description:

\[Shot 1] Live-action, \[视觉风格，如：cinematic suspense] style. The opening scene aligns with Picture 1, framed in a \[镜头构图，如：medium shot] showing \[主场景与主体描述，如：a middle-aged woman in a patterned dark jacket standing outside apartment door 703 in a cold-toned hallway, with a young man in a black hoodie beside her]. 



From \[00:00] to \[00:03], \[首段动作描述，如：the woman uses her right fist to pound heavily on door 703 with loud thuds]. An off-screen \[声音来源描述] inside \[位置] asks \[语气描述]: <d>\[Chinese] \[台词内容]</d>.



From \[00:03] to \[00:06], \[第二段动作描述，如：the woman clears her throat and shouts forcefully at the door]: <d>\[Chinese] \[台词内容]</d>.



From \[00:06] to \[00:08], \[第三段动作描述与回应]: <d>\[Chinese] \[台词内容]</d>.



From \[00:08] to \[00:12], \[冲突爆发/核心动作描述，如：the woman's eyebrows arch in anger as she raises her foot and violently kicks the bottom panel of the wooden door], shouting: <d>\[Chinese] \[台词内容]</d>.



From \[00:12] to \[00:15], \[动作停顿/状态锁定与长台词演绎，如：the woman lowers her foot and glares at the door. The door stays strictly closed, maintaining the composition of Picture 1. The panicky male voice inside the room stammers continuously through the closed door]: <d>\[Chinese] \[台词内容]</d>.



overall\_soundscape:

\[物理环境音效与拟音描述，如：Heavy fist impacts on wooden door, sharp boot kick reverberation echoing down the hallway, metallic door lock unlatching].



non\_diegetic\_music:

\[BGM 与悬疑氛围音描述，如：A low, pulsing bass drone building tension during the door pounding, swelling into a tense atmospheric synthesizer tone towards the end].



# **模板二：MiniMax-H3 首尾帧图生视频（FL2VA）官方 Skill 生产级模板**



**适用场景：包含首帧（Picture 1）与尾帧（Picture 2），强行锁定时间轴（精准到 0.01 秒），防止尾帧过早开启或画面扭曲。**



How the reference pictures align with the target video — Picture 1 aligns with the start of the target video, Picture 2 aligns with the \[总时长，如：20.00-second] mark of the target video.



integrated\_multimodal\_description:

\[Shot 1] Live-action, \[视觉风格，如：cinematic suspense] style. The opening scene aligns with Picture 1, framed in a \[镜头构图，如：medium shot] showing \[首帧场景与初始主体描述]. 



From \[00:00] to \[00:03], \[首帧初始动作与声音触发]. An off-screen \[声音主体] inside \[位置] asks \[语气]: <d>\[Chinese] \[台词内容]</d>.



From \[00:03] to \[00:06], \[主体回应动作与对白]: <d>\[Chinese] \[台词内容]</d>.



From \[00:06] to \[00:08], \[第二阶段隔门/隔空回应]: <d>\[Chinese] \[台词内容]</d>.



From \[00:08] to \[00:10], \[高潮爆发动作，如：踹门/击打/突变]: <d>\[Chinese] \[台词内容]</d>.



From \[00:10] to \[尾帧启动前的时间，如：00:18.00], \[首帧状态强行锁死段]: \[主体动作描述，如：The woman lowers her foot and glares at the door]. The scene maintains the strict composition of Picture 1 without any camera shift or structural deformation. The off-screen character inside \[位置] speaks continuously through the barrier: <d>\[Chinese] \[完整长台词内容]</d>.



From \[尾帧启动时间，如：00:18.00] to \[总时长，如：00:20.00], \[尾帧过渡与平滑收敛段]: Right as the dialogue completes, \[解锁/开门/转头动作触发音效与物理机制]，the camera smoothly transitions over \[过渡时长，如：2 seconds] to match Picture 2, showing \[尾帧构图与出场角色/状态描述]，locking into the final frame at \[总时长，如：20.00s].



overall\_soundscape:

\[物理环境音效描述，如：Heavy fist impacts on wooden door, sharp boot kick, metallic lock click, door creak, ambient hallway draft].



non\_diegetic\_music:

\[BGM/配乐节奏起伏，如：A low, pulsing bass drone building tension during the initial confrontation, swelling into a tense synthesizer tone as the lock turns at 00:18.00].



# **💡 官方 Skill 核心遵循硬规则小结：**



**1.首行对齐标记：**必须包含 

How the reference pictures align with the target video — Picture 1 aligns with the start of the target video, Picture 2 aligns with the XX.XX-second mark of the target video.（官方解析引擎的入口 Anchor）。



**2.三段式顶级字段：**

* integrated\_multimodal\_description:（画面+动作+时间轴+台词融合）
* overall\_soundscape:（环境拟音）
* non\_diegetic\_music:（非原声音轨/配乐）



**3.台词标准包裹：**

所有语音对白必须严格遵守 <d>\[Chinese] 台词文本 </d> 格式。



**4.首帧锁死语法：**在中间时间段显式标注 

maintaining the composition of Picture 1，并在最后段落明确标注 transitions smoothly over X seconds to match Picture 2，可精准控制尾帧出现的时间点（如最后 2 秒）。



