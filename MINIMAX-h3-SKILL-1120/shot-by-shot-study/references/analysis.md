# 镜头分析判据

## 测量与视觉复核

先生成检测底稿、运动曲线及关键帧，再进行内容判断。上游运动曲线是采样帧缩放为 64×36 后的亮度差分，默认 5 Hz；它不是全分辨率逐帧光流，也不能拆分主体运动与摄影机运动。

场景检测可能漏掉暗场、相似构图反打、叠化，也可能把闪光、摇晃或字幕切换误判成切镜。用回放或带时间戳帧复核，而不是因平均镜长偏长就强行加刀。可针对误检情况调整阈值（例如从 0.3 向 0.15 或 0.4 试验），但不要用预想镜头数校准结果。

叠化可按过渡中点约定边界，在备注注明“约定中点”与过渡区间。镜头内分段动作可写 note；若为了教学分段，需要单独定义分析段，不加入真实切换数量。

首尾对照主要看背景地标、透视、构图比例与运动轨迹。两帧相同不排除镜头中途移动后返回；主体变大也可能是主体接近，不能直接判推镜。推拉与数字裁切/变焦无法区分时注明不确定并补看视频。

## 兼容词表

字段使用以下上游枚举，以便本地校验与面板显示一致；未知不硬猜。

| 字段 | 可用值 |
| --- | --- |
| size | none、extreme-wide、wide、medium-wide、medium、medium-close、close、extreme-close |
| category | establishing、subject、dialogue、reaction、insert、pov、empty、product、text-card、transition、archive |
| camera | static、push-in、pull-out、zoom-in、zoom-out、pan-left、pan-right、tilt-up、tilt-down、truck-left、truck-right、pedestal-up、pedestal-down、tracking、arc、whip-pan、handheld、shake、rack-focus、micro-push、roll、drone |
| transitionIn | cut、dissolve、fade-in、fade-out、whip、match-cut、wipe、morph |
| rhythm | hook、setup、build、beat、turn、payoff、breath、close |

- 景别看被摄主体在画框内的比例：环境为主的大远景/全景，膝上中远景、腰上中景、胸上中近景、肩脸特写、局部大特写；不要拿景深和焦段代替景别。纯字卡/黑场用 none。
- 类别是主要叙事功能；特写不自动等于 insert，全景不自动等于 establishing。dialogue 要有对话证据，reaction 要有画内主体，text-card 要记录文字，empty 的 subjects 为空。
- static 表示摄影机固定，人物可以剧烈运动；tracking 要看到随主体位移的摄影机运动。rack-focus 是焦点转移，不等于变焦。
- 一镜可以包含多段运镜，camera 写有证据的主导类型，变化写 note。无法可靠分类时在草稿留空，或在确有保守类别依据时填写并标注低置信度。
- rhythm 是解释性标签：钩子/铺垫/递进/重音/转折/兑现/换气/收口。理由写当前画面提供了什么信息，与前后镜头怎样关联。

## 描述、台词与人物

兼容上游检查器时，frame 中文至少 12 字或英文至少 8 词；内容须有可核对信息，而不是为凑字数重复形容词。相似机位描述仍应区分动作、人物或构图变化。

对白字幕可进 audio，但加“字幕显示：”并在 sidecar 标记 burned-subtitles。未知说话人标“说话人未确认”；画外声音不能因此加入画内 subjects。画面标题、界面文字等进入 onscreenText。无听音工具则不要推断音乐或音效。

人物编号只用于同片内可见外观与角色延续。只有充分画面证据才跨镜归并；不确定时临时编号并备注，避免为了人物统计强行合并。

上游某些规则是启发式约束。若真实视觉证据与“低运动量不该运镜”等检查冲突，复查采样、阈值与镜头长度，记录差异。不要改成错误标签只为通过，不宣称全部通过。
