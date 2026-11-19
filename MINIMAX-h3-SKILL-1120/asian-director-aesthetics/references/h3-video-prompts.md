# MiniMax H3 导演风格视频提示词

视频提示词与视频生成均默认以 MiniMax H3 为目标；用户指定其他模型或要求通用提示词时遵从，生成时的可用性与替代决策遵循主文件。此页是本 skill 的重点写作流程。只要提示词就交付可复制正文，不启动生成，也不要求用户打开项目。

## 先确定输入方式

- 文生视频：完整建立人物、开场构图、场景、动作与声音，不虚构参考素材。
- 首帧驱动：先看真实图片，从图中人物姿势、机位和光源继续发展。不能在开场重置服装或空间；写明图片对应视频开头。
- 首尾帧驱动：核对两图的身份、道具和空间能否连接，描述中间怎样抵达终帧。末帧只用于结束；不要在开头提前完成终态。
- 多素材参考：区分人物身份、场景、色光、动作、声音的职责。色卡不承担人物身份，人物照不自动充当首帧。采用下文参考模式，并按实际平台映射素材。

缺少时长时可建议一段10秒镜头，并标明为创作建议；实际调用以当前工具支持范围为准。用户已有首帧时不重新生图；需要创作首帧时推荐使用 Seedream。

## 导演风格如何进入动作

先读取所选导演条目，选一个作品分支，保留用户主体。用两三项相互支持的视觉机制组织事件，不让导演名代替可见描述。

| 分支 | 可执行的短段落设计 | 镜头与声音的作用 |
|---|---|---|
| 王家卫／《花样年华》 | 走廊里两人擦肩，一人的手指在饭盒提柄上收紧，另一人在门内停住；视线始终没有相接 | 中景或中全景保留门框遮挡；固定或轻微横移，脚步由近到远，不强制雨夜、旁白和慢动作 |
| 张艺谋／《大红灯笼高高挂》 | 院落远景中，一人走到偏离中轴的门前停下，另一侧有人点亮灯笼 | 建筑重复和人物尺度始终可读；红色因灯笼发光而出现，脚步与院落回声建立空间 |
| 贾樟柯／《三峡好人》 | 人物在江边等消息，先看手中纸条再抬头；背景劳动者继续搬运物件 | 固定中全景保留人物与环境；远近活动各有节奏，背景不能虚化成无信息色块 |
| 陈凯歌／《霸王别姬》 | 成年男性旦角在帘边整袖、抬眼、准备入场，手势与服装来自同一戏曲语境 | 中景保留身段，前景帘幕与远处戏台分层；后台衣料声、远处舞台声有明确来源 |
| 毕赣／《路边野餐》 | 人物听见门内声音，回头后走入门洞，最后停在庭院边 | 从背后连续跟随，冷日光到暖灯的变化来自行进路径；静止终态仍保留画面深处的去路 |

这些是原创创作建议，不是原片镜头复述或已验证的生成结果。以场景决定运动，不强制所有镜头缓慢推进；人物不动、摄影机不动也可以有完整事件。

## 从方案到可复制正文

1. **确定开场。** 景别、机位、人物位置／朝向、手中物品、前中后景、主光方向必须能拼成同一画面。人物气质通过姿态、妆发、衣料和动作体现。
2. **写动作因果。** 组织为触发、反应、行动、结果；短段落通常两三拍即可。不要只写“感到孤独”“梦境感”。动作幅度与速度按表演需要描述，别给每根手指设置不必要数值。
3. **保持镜头可执行。** 优先一个主导运动，确有需要再加合理衔接；说清摄影机跟谁、朝哪走、什么进入或离开画面。推进与变焦、平移与摇摄分别处理。切镜时重新建立视线、道具和人物站位。
4. **让颜色随物体与光源成立。** 衣服、砖墙、灯笼、窗光各承担颜色；人物进门时允许受光变化，但不靠整幅突然换滤镜表达情绪。
5. **给结束留空间。** 最后一拍让动作完成或停在明确的未决状态；不能在最后一秒同时完成转身、奔跑、对白和切景。首尾帧任务明确收束到末帧。
6. **声音随动作设计。** 将脚步落地、门响、呼吸和对白与对应事件联系起来；配乐服从用户意图。没有配乐不等于完全无声。对白先按自然语速试读，给停顿和反应留时长，过长就拆段或删改建议，不能强行加速。

先使用用户当前交互语言说明方案，再按下列结构交付一段可复制的正文；确认问题与交付摘要同样跟随用户语言，用户明确指定回复语言时优先遵从，不因参考资料为中文而固定使用中文。普通情况下不必展示中间推理。默认用英文写提交正文，保留中文台词和画面文字原文；用户明确要中文提示词时遵从，不把英文称为所有平台的强制要求。

## H3 结构与官方格式边界

本页沿用源包于2026-10-29记录的指南写法；本次合并未重新联网核验，正式使用时优先核对可取得的当前模型写作指南，冲突以当前指南为准；无法取得时按下方降级规则处理。以下仅说明提示词正文组织，不定义接口请求格式。按源包记录，普通生成正文采用 `integrated_multimodal_description`、`overall_soundscape`、`non_diegetic_music` 三个字段。图生模式在前面声明参考帧与时间的对应。开场用 `[Shot 1]`，不加切镜时间；实际切镜才新增镜号和递增时间，单镜内部动作节拍不冒充切镜。运镜写进当前镜头的自然语言。对白按指南使用固定说话者编号和语言标签，原话不改；复杂对白格式按下方官方原文核对。

这些是提示词正文的组织约定，不自动等于工具的JSON参数。最终投递须遵守平台当前契约；不要把字段拆成未经声明的API键。原包“参考说明＋核心创意＋分段过程”可作中文构思提纲，不再声称是唯一官方结构。

多素材参考模式按官方参考指南组织为 `subject_definitions`、`summary`、`retention_analysis`、`detailed_description`、`overall_soundscape`、`non_diegetic_music`。先定义素材角色，再描述保留范围和逐镜事件；人物、图片、视频、音频标签分别追踪，不能相互代替。正式使用此模式时优先核对下方参考指南对应规则；无法取得时同样按下方降级规则处理，只创建实际存在的素材标签；不把六段模板硬套到无素材的文生视频。

### 当前指南无法取得时

无法取得当前写作指南时，不阻塞仅提示词交付：可提供明确标注“尚未核对最新格式”的草稿，分开说明已确认要求与不确定的写法，不声称已经核验最新指南。实际生成前仍核对当前平台能力与输入；只有确有必要条件无法确认时，才暂停受影响的生成并询问。不得因此静默更换模型、改变已确认规格或跳过审批，也不为取得指南而要求安装、登录或付费调用。 本页历史示例只作为草稿依据，不把网页访问失败等同于模型不可用。该分支也适用于多素材参考任务；不会将缺少指南冒充为已完成最新格式核验。

## 完整原创示例：毕赣／《路边野餐》分支

设定：文生视频，建议10秒，单镜头，无对白。此示例不需要素材；没有生成或效果验证。构图要保留人物脚步与去路，避免浅景深特写。

```text
integrated_multimodal_description: [Shot 1] A live-action medium-wide view looks down a narrow hillside passage. A middle-aged man in a worn navy cotton jacket stands with his back three-quarters toward the camera, his empty hands resting at his sides. A weathered doorframe borders the left foreground; the man occupies the middle ground, with an open courtyard entrance ahead on his right. Cool overcast daylight reveals damp grey plaster and green plants beside the steps. A warm bulb is visible inside the entrance. He hears a chair scrape from within, pauses, and slowly turns his head toward the opening before turning his shoulders. The camera follows behind him at a measured walking pace as he takes three short steps through the doorway, keeping his torso and the courtyard entrance in view. His jacket gradually catches the warm light as he passes beneath the bulb. He stops just inside the courtyard; the camera settles behind him. In the final moment, he looks toward a half-open door across the empty courtyard. The path remains spatially continuous, with no cut or sudden relocation.

overall_soundscape: A chair scrapes briefly inside the courtyard, prompting the man's turn. His shoes make soft, uneven footfalls on the damp paving, then fall quiet as he stops. Occasional drops strike a metal basin beyond the doorway.

non_diegetic_music: N/A
```

如果改成用户首帧驱动，先看图，再按图修改上述站位和环境；不要只在这段前加“参考图片”而保留互相冲突的开场。

## 完整原创示例：王家卫／《花样年华》分支

设定：文生视频，建议8秒，固定单镜头，无对白。人物动作承载关系，不依赖演员相貌复制。

```text
integrated_multimodal_description: [Shot 1] A live-action medium-wide shot observes a narrow 1960s Hong Kong apartment corridor from behind a partially open wooden door. The foreground doorframe conceals a strip of the passage. An adult woman in a fitted patterned cheongsam carries a metal food container in her right hand; an adult man in a pale shirt stands farther down the corridor beside his doorway. Dark red fabric is visible inside the near room, while muted green plaster recedes behind the man. A warm wall lamp reveals the texture of her sleeve without flooding the entire corridor. The camera remains still. As she approaches, he moves half a step back to let her pass. She briefly slows, tightening her fingers around the handle, but keeps her eyes lowered. He turns his head only after she has passed behind the foreground doorframe. She leaves the visible corridor; he remains beside his doorway, looking into the space she occupied. The final beat holds on that empty interval between the two doorways.

overall_soundscape: Her measured footsteps approach, pass the doorway, and recede. The container handle gives a small metallic click as her grip tightens. A low indoor room tone persists after her footsteps fade.

non_diegetic_music: N/A
```

## 交付与核查

交付内容：一句导演／作品分支说明，独立列出建议时长与输入方式，再给可复制正文；有素材才附简短映射。不要只交分镜表或抽象风格词，也不把未填占位符留给用户。

提交前检查开场与素材一致、动作有因果、镜头方向不冲突、景别能承载导演特征、声音来源成立、终态可抵达。要求多镜头时再核对切镜时点与连续性。实际生成前检查模型与输入模式、时长、音频和素材能力；模型不可用不妨碍交付面向H3的提示词草稿。

生成后先交用户审阅，不主动分析成品质检或重生成。用户明确要求核查时，可按其范围查看人物一致性、动作完成度、空间连续性、视觉辨识度与声音同步；发现问题后说明建议，获得调整授权再制作。格式检查不等于生成效果测试；失败重试遵守主文件的授权规则。

## 来源与核对范围

核对日期：2026-10-29。结构依据来自以下官方资料；两段示例和导演转译表是本 skill 新编的创作方案。

- [MiniMaxAI：基础提示词指南](https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/docs/VIDEO_PROMPT_WRITING_GUIDE_base_en.md)：需要图像对齐、切镜、对白或声音精确格式时按需查阅。
- [MiniMaxAI：多素材参考模式指南](https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/docs/VIDEO_PROMPT_WRITING_GUIDE_ref_en.md)：使用多素材参考、编辑或续接时核对标签与保留关系。
- [MiniMax：视频生成接口文档](https://platform.minimax.io/docs/guides/video-generation)：核对平台型号和输入能力；不将接口能力无条件视为MiniMax Design当前已暴露的工具能力。

源包研究及本次合并均不代表实际生成测试。使用时先确认当前可用模型、输入限制与写作指南，不假定必须连接外部应用或打开特定项目。
