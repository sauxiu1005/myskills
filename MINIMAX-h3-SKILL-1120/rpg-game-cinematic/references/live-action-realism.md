# 真人质感与完整HUD / Live-action realism with full HUD

安装为 `references/live-action-realism.md`；供0.2.3主文件引用。空间站位、内容驱动切镜和可选尾帧规则对真人及写实3D路线均适用；真人质感章节仅用于真人路线。以下为中英文对齐规则。

Install as `references/live-action-realism.md` for version 0.2.3. Spatial blocking, content-driven cuts and optional tail-frame rules apply to both visual routes; photographic-realism rules apply only to live action.

## 1. 视觉职责 / Visual responsibilities

中文：真人路线中的人物、环境、道具、车辆都属于实拍世界；游戏HUD是独立屏幕图形。界面保持清晰、完整和持续，不跟随皮肤、材质、运动模糊或世界透视发生变化。禁止把“降低游戏感”解释为取消HUD；降低的是世界建模感和机械动画感。

English: People, environments, props and vehicles belong to a photographed world; the full HUD belongs to screen graphics. Keep the interface crisp, complete and persistent, independent of skin/material shading, motion blur and world perspective. Reduce modeled-world and mechanical-animation cues, never the HUD requirement.

## 2. 素材审查 / Asset review

中文：检查皮肤局部纹理及自然差异、发丝成束而非塑料整体、衣物厚薄与关节处褶皱、金属橡胶皮革不同反射、鞋底和轮胎接地、主体与环境光源方向。参考卡的均匀棚光与面板排版只服务身份辨识，不指示最终片场。不得因为照片参考中存在细小瑕疵就全部磨平，也不人为加污渍或颗粒冒充真实。主体身份和风格证据必须来自用户或实际参考。

English: Inspect local skin detail, natural variation, hair strands rather than solid plastic masses, fabric thickness and joint folds, distinct metal/rubber/leather response, grounded soles/tires and shared light direction. Studio lighting and panel layouts aid identity inspection, not final staging. Do not erase all imperfection or add arbitrary dirt/grain as a shortcut to realism. Identity and style evidence must come from the user or actual references.

## 3. 镜头与动作 / Camera and action

中文：真人镜头优先展示可理解的完整小动作，而不是在一个片段塞满所有剧情。摄影机允许轻微滞后和构图修正，幅度由故事与拍摄位置决定，不统一加入抖动。动作分配考虑准备、接触、承重、完成、恢复；手抓物体之前不能拉动物体，脚未受力不能滑行，跨坐载具后应有合理负载响应。用户选长镜头时保留，但降低动作密度。真人默认允许有动机切镜，连续性不等于相机永不切换。

English: Prefer complete, understandable small actions over compressing the entire plot into one segment. Camera lag and reframing are restrained and motivated, not mandatory shake. Budget preparation, contact, weight transfer, completion and recovery: objects move after grip, feet do not glide without support, and vehicles respond to boarding load. Respect requested long takes while reducing action density. Motivated cuts are allowed by default in live action; continuity is not synonymous with an unbroken camera.

## 4. HUD两条制作路径 / Two full-HUD production routes

中文：
- 分层推荐路线：先确认底片生成、透明界面及时间线合成能力和额外成本。底片参考用于世界，HUD参考用于合成；样片交给用户前必须加入完整适用HUD。常驻组件跨切镜使用同一图形规范和屏幕锚点，临时组件依据最终时间线触发。不得将地图、血条、任务提示简化成一个静态角标。
- 内嵌可选路线：保留所有批准HUD，单独说明屏幕空间职责；先做带HUD样片，检查世界是否被带成3D、文字是否投射到车牌或衣物、界面是否漂移。
- 两条路线都不自动改变已确认的制作方式。没有可靠合成能力时不能承诺分层可交付，必须提供可执行选项让用户决定。

English:
- Recommended layered route: verify plate generation, transparent graphics and timeline composition, and disclose extra cost. World references guide plates; HUD references guide composition. Apply the full relevant HUD before user pilot review. Persistent components use consistent designs and screen anchors across cuts; contextual elements follow the adopted edit. Do not replace maps, bars and prompts with a token static badge.
- Optional embedded route: retain every approved HUD component and distinguish its screen-space role. Test a HUD-bearing pilot for CG contamination, text projected onto physical objects and interface drift.
- Neither route silently replaces an approved method. Without verified composition capability, offer feasible choices rather than promise layered delivery.

## 5. 样片门槛 / Pilot gate

中文：真人批量生成前，使用已批准镜头中的合法短片段检验人物、世界、接触或承重动作、镜头和HUD。用户确认模型、清晰度、方式与试片费用后才执行。样片通过后尽可能直接复用；未通过先定位素材、动作密度、摄影机或HUD问题，只提出最小修复，不自动重复全流程。

English: Before bulk live-action production, test a legal short interval from an approved shot covering people, world, contact/weight, camera and full HUD. Confirm model, resolution, method and pilot cost first. Reuse accepted footage where possible. On failure isolate source, action density, camera or HUD problems and propose the smallest repair rather than rerunning the pipeline.

## 6. 出点与续拍 / Out-points and continuation

中文：先裁定实际采用区间并观看末尾动作与结束画面，记录前段实际最后空间站位，再写后段提示词。尾帧图片输入并非必需；默认用共同身份/场景/道具参考与明确的空间状态承接，可按内容切镜，不强制27秒长镜头或固定27＋3结构。静止图不能证明速度或动作过程，被遮挡人物的位置也不能凭猜测补齐。只有选择首帧引导路线时才提取真实出点图，并使用真正支持该输入的能力。合理机位变换允许屏幕左右变化，不能让世界空间中的人物互换位置。HUD跨段沿用同一状态；图像锚点和文字都需要输出质检。

English: Select the adopted interval, inspect its ending action and image, and record observed final blocking before writing the next prompt. Tail-frame input is not required. Default to shared identity/world/prop references plus explicit spatial state, with content-driven cuts and no mandatory 27-second take or 27+3 structure. Stills cannot establish speed/action history, and occluded positions must not be invented. Extract an actual out-frame only when selecting a genuinely supported frame-guided route. Camera changes may reverse screen sides without swapping world positions. Preserve HUD state across segments and inspect outputs whether using images or written blocking.

### 空间交接模板 / Spatial handoff template

每段提示词将下列信息写成具体可拍内容，时间码以本段为准。无关项可省略，人物、目标及接触关系不能省略；不把空模板直接发给生成模型。
Every prompt expresses concrete filmable facts using segment-local time. Omit irrelevant fields, not active people, objectives or contacts. Never submit an unfilled template.

| 字段 / Field | 必填内容 / Required content |
| --- | --- |
| 固定坐标 / World frame | 2—3个固定地标、路线、世界方向；不把画面左右当世界方位 / stable landmarks, route, world directions distinct from screen sides |
| 上段实际出点 / Observed prior ending | 采用片段与时间点、所有人物最后位置与动作、可见证据及未知项 / adopted clip/time, actual positions/actions, evidence and unknowns |
| 本段开场 / Current opening | 逐人地标相对位置、距离层级、身体朝向、视线、手部接触、持物、车内外 / per-person landmark relation, distance, facing, gaze, contact, possession, vehicle interior/exterior |
| 机位 / Camera | 相机在哪一侧、朝向、人物屏幕位置、运动轴线 / camera side/view, screen positions, action axis |
| 动作与切点 / Action and cut | 起点→路径→终点，谁不动，何时切到何处、如何匹配动作 / start→path→end, stationary people, cut time/view and action match |
| 计划结束 / Planned ending | 每人最终位置、道具归属、载具朝向、未完成动作、HUD / final positions, ownership, heading, unfinished action, HUD |
| 核验后的更新 / Observed update | 生成后以实际结束替换计划，作为下一段权威 / replace planned ending with observed output for the successor |

### 空间匹配示例 / Spatial-match example

中文：以下是假设示例，不能替代实际观察。若前段核验为“女孩跨坐街道东侧路缘的摩托，车头朝北；混混在东侧砖墙边、位于车后方；相机在车的西南后侧”，则后段开头明确继承上述站位。镜头可从西南后侧切到西侧中景，但摩托仍靠东侧路缘、朝北，混混仍在砖墙旁。女孩起步沿北向车道前进后，混混才随距离增加落在后方；不得切镜后突然出现在车前或道路另一侧。前段若只扶车未上车，后段先完成跨坐，不得直接改成驾驶中。

English: This hypothetical example never replaces observation. If the inspected ending shows the girl astride a motorcycle at the east curb facing north, the opponent against the east brick wall behind the bike, and the camera southwest/rear, explicitly inherit those facts. A cut to a west-side medium view changes viewpoint only: the bike remains at the east curb facing north and the opponent stays by the wall. The opponent falls behind as the rider travels north, not by teleporting across the road or ahead of the vehicle. If boarding was unfinished, complete it before riding.

### 静态走查 / Static checks

1. 未指定模型时推荐 H3，以支持多参考连续性与原生声音；用户选择优先，先核验实时能力，不兼容时说明并取得决定。 / Recommend H3 for shared references and native sound when no model is specified. User choices take precedence; check live capabilities and obtain a decision for incompatible requirements.
2. 30秒三镜头：可按内容分配，无27秒长镜头门槛，无必交尾帧图。 / A three-shot 30-second film can allocate time by content, without a mandatory 27-second take or required tail image.
3. 前段扶车但未跨坐：后段开场仍扶车，先完成动作。 / If the previous ending only shows holding the bike, the successor starts there and completes boarding.
4. 合理换机位：允许画面左右改变，世界站位保持。 / A justified angle change can alter screen sides while preserving world positions.
5. 人物在前段末尾被遮挡：补看邻近时间窗，无法判明则暂停，不凭空写位置。 / Inspect nearby frames when someone is occluded; pause if unresolved.
6. 两段结束/开场人物突然对调：验收不通过，报告具体位置和时间，不宣称文字约束已保证连续。 / A character-position swap fails QC; report the region instead of claiming continuity is guaranteed.

以上为文本走查要求，不代表已运行媒体测试。 / These are static walkthrough checks, not evidence of executed media tests.

## 7. 验收矩阵 / Acceptance matrix

| 维度 / Dimension | 通过 / Pass | 阻断 / Block |
| --- | --- | --- |
| 人物 / People | 自然皮肤头发、真实衣物、身份稳定 / natural detail, clothing and stable identity | 蜡像皮肤、头发塑料壳、身份突变 / wax skin, solid hair, identity jump |
| 动作 / Motion | 可见承重接触与恢复 / visible loading, contact, recovery | 滑步、穿模、瞬移上车 / sliding, clipping, instant boarding |
| 世界 / World | 光线、路线和物体结构连续 / coherent light, route and geometry | 昼夜突变、车辆变型 / time-of-day jump, vehicle redesign |
| 摄影 / Camera | 有动机、可理解的跟随或切镜 / motivated tracking or cuts | 永远等距锁定、悬浮乱转 / robotic lock-on, floating orbit |
| HUD | 完整、常驻稳定、事件驱动 / complete, stable, event-driven | 删除、闪现、重绘、错字、投射到实物 / removal, flashes, redraws, errors, world projection |
| 声音 / Sound | 原声清楚、BGM按需且可闻 / clear original sound, audible opt-in music | 重复音效、音乐不可闻或盖过原声 / doubled SFX, inaudible or overpowering music |

中文：严重问题暂停后续依赖生成，保留结果并征求修复同意。接受瑕疵只能标为预览。不得用更高分辨率、滤镜或更密的负面词替代问题定位。

English: Pause dependent production for serious defects, preserve results and request repair approval. Accepted defects require preview labeling. Higher resolution, filters and longer negative prompts do not replace diagnosis.
