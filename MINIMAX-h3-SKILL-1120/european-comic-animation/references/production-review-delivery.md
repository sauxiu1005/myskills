# 制作、检查、剪辑与交付 / Production, inspection, editing and delivery

## 中文方法
### 执行准备
制作必须已有明确通过的剧本和已确认参数。建立精确时表：事件/镜号、源时长与最终帧区间、景别/角度、初态、触发、结果、演员/道具数量、参考版本、衔接、声音。
总时长按实际帧率换算为帧；无法精确表达的秒数需说明可实现的帧边界，不暗自改规格。剧情与时长冲突先取得具体调整通过，不通过加速解决。
当前用户明确指定且满足要求的模型优先；未指定时推荐 MiniMax H3 支持参考人物连续性与连贯动作，图片模型按线稿、水粉媒介和身份参考能力选择。制作前核实可用性、参考类型、画幅、时长和清晰度；不可用时选择满足要求的替代，不省略真实身份参考。能力缺口或会明显改变输出时，提出替代和影响并取得决定，不沿用旧会话偏好。
输入齐备的独立事件可并行；角色/场景锚点与依赖镜头按顺序。提示围绕一个完整事件与少量关键状态，不堆相互冲突的动作指令。
保留任务和参考关系；状态未知先查询/继续等待同一任务，不因等待中断或用户重复消息重交。费用确认不代替剧本和规格确认。
### 生成后检查
本制作流程包括主动视觉与技术检查。逐镜检查身份、媒介、演员/道具数量、动作弧线和支撑脚、实际接触、先后关系、物体连续与可见结果。
检查开头重复、镜内机位/尺度/背景透视突跳、尾部拖尾、跨镜方向/步态/道具接缝。高风险时段密集逐帧并检查采样分页边界；稀疏缩略图不能证明所有帧流畅。
记录证据来源：实际媒体检查、测量、用户外部目检；描述“观察到什么”，不把提示、意图或任务成功当验收。证据冲突时核查具体窗口，无法检查就报告未核实范围，不循环耗时或编造通过。
检查不等于自动授权付费重生成。仅修失败镜并保留有效结果；在当次明确预算/次数授权内执行。没有覆盖授权则说明具体缺陷、修法、成本范围和对其他素材的影响，等用户决定。达到本次上限或明确停止即停，不借用过去项目配额。
### 剪辑与声音
选连续有效区间，保留初态、触发、接触、物体响应、落稳和获益/情绪结果；切点服务动作，不机械平均分秒，不重复同一开场。
不靠冻结、循环、交叉溶解鬼影、整体加速或盲目插帧遮盖卡顿。源片内部断点仍在保留区时，需报告或局部修复，不能仅挪尾点声称解决。
按确认尺寸等比适配，明确裁切/补边/放大与实际导出，保护关键脚部和触点。重组不应改变已认可的无关镜头。
新原创配乐选择是：实际生成独立音频并混入；否：不生成新音乐。已有音乐按授权版本/范围混入；无音乐不自动删除对白/原声。依据声音方案保留或剔除生成音轨，避免叠加杂音或双重配乐。测量音量/峰值，保证需要的声轨真实存在。
最终核对帧数、尺寸、帧率、时长、音频流和完整解码。严格时长不能通过截掉结果或加静帧凑齐；必要时与用户确认调整。
### 交付与局部修改
交付可播放的成片到当前项目画布/素材，给真实下载入口或文件路径；不能仅交提示词、计划或裸素材。
保留最终脚本版本、参数确认、身份和风格参考、生成记录、源区间剪辑表、音频来源、技术验证和真实残余。独立角色/场景/镜头内容归各自对象，全片只维护整体成果，引用依赖而不重复堆放。
用户提供已验证外部成片且要求原样采用时，复制核对一致性后导入，不偷偷重剪混音。保留旧版；简述改动、规格与残余，区分已执行、已交付、已接受。

## English method
Require both script approval and confirmed specifications. Build an exact shot/frame plan with source versus export duration, framing, initial/trigger/result states, actor/prop counts, actual reference versions, transitions and sound. If timing conflicts with story, obtain a concrete revision approval rather than speeding up.
Honor the current user's compatible model choices. Otherwise prefer MiniMax H3 for reference-guided continuity and connected action, and select an image model by its linework, gouache and identity-reference capabilities. Verify availability, references, format, duration and resolution; if unavailable, select an equivalent model without dropping identity inputs. Explain capability gaps or material output changes and obtain a decision, without inheriting old session preferences. Parallelize independent ready inputs, sequence dependencies, and recover uncertain tasks before resubmission.
Proactively inspect visual identity/medium, counts, motion/contact, causal ordering, object continuity, achieved outcomes, internal jumps and seams. Use dense consecutive frames where needed; sparse thumbnails cannot prove full smoothness. Separate observation, technical measurement and user review from intended prompts. State unavailable or conflicting evidence.
Inspection is not unlimited paid-retake authorization. Repair only affected shots within the current confirmed budget/count. Otherwise present the precise defect, remedy and cost impact and wait; never inherit historical quotas.
Edit continuous valid ranges preserving the full causal and emotional result. Avoid repeated openings, frozen/looped padding, ghosted dissolves, blanket acceleration and blind interpolation. A tail trim cannot fix an internal retained jump. Explain actual scaling, cropping/padding and upscaling.
Generate and mix music only when Yes. Reuse supplied music as agreed; No does not imply silence or removal of dialogue. Retain/remove source sound per the confirmed sound plan and verify actual tracks, levels and peaks.
Check final frames, dimensions, fps, duration, audio streams and full decode. Deliver a playable film to canvas/assets with a real file/download reference, not just prompts or clips. Preserve records and prior versions for local revisions. Import an explicitly approved external final unchanged when requested, checking byte identity; distinguish delivery from acceptance and disclose remaining limitations.
