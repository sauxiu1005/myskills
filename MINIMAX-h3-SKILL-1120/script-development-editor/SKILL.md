---
name: script-development-editor
description: 将故事点子或已有稿件开发为主题、人物、结构、大纲、对白和剧本，支持电影、剧集、舞台剧与戏曲，并通过针对性诊断修改文本；仅处理文字创作与分析，不生成媒体。
---

# 剧本创作与改写

根据用户的媒介、现有素材和交付目标，选择下面的内部模块完成工作。所有模块均已包含在本技能中，不需要另装或调用其他 skill。

## STEP 1: 明确任务与选择知识

1. 先识别任务：长片、短片、剧集、普通舞台剧或戏曲；从零开发、续写、改编、诊断还是局部修改。提取时长、集数、演员、场景、风格和输出范围等已给条件。
2. 只补问会影响当前交付的缺失信息；可合理推断时注明假设后推进。用户只要创意、大纲、诊断或对白时，就交付该范围，不自行扩大成全剧本。
3. 从下表读取最相关的 `guide.md`；需要表格、模板、案例或诊断细节时，再沿模块内链接读取参考文件。不要一次读完所有模块。大文件先搜索相关标题或关键词，再读对应章节。
4. 新建完整项目、续写或不知道下一步时，先读[流程模块](references/sw-workflow/guide.md)，选择其中适用的阶段表。局部请求直接进入对应专业模块。
5. 用该模块适用的诊断清单检查当前产出，修复实质问题；方法之间有分歧时按媒介和创作目标选择，不把页数、节拍数或笑点密度当成所有作品的硬性要求。

本入口定义整合后的使用方式。内部资料沿用原模块名，直接读取相应 guide.md 并应用方法，不嵌套调用技能。遇到仅作为出处标识的 `_notes/` 路径，不将其当成已附带文件，也不声称读过原书。

## STEP 2: 按媒介开发与接续

- **长片／普通舞台剧**：前提与主题 → 结构 → 人物与冲突 → 分场大纲／处理台本 → 初稿 → 修改 → 用户需要时整理提交材料。
- **短片／独幕剧**：使用简化路线，按时长和角色容量设计，不直接套长片页码与四十卡要求。
- **剧集**：先设计可持续产生故事的机制 → 人物网与季弧 → 设定文档／分集规划 → 试播集与单集结构 → 情节拆解与大纲 → 初稿与修改 → 用户需要时整理推介材料。
- **戏曲**：先辨板腔体或曲牌体，再使用流程模块中的 X 或 Q 阶段表及对应方法模块，不沿用电影结构硬套唱段。
- **已有稿件**：提取前提、结构和人物，识别缺项，再进入针对性修改；保留用户指定的设定与结尾。
- **持续项目**：在用户的项目目录读取或创建 `story-bible.md`，记录已定决策、当前阶段、修改记录和下一步；完整大纲与剧本独立保存。一次性交付或局部润色不必创建项目档案。已有记录时先简述当前状态，不重复推翻已定决策。

## STEP 3: 查阅专项指南

| 任务／触发条件 | 按需读取 |
|---|---|
| 新建、续写、阶段安排、项目记录 | [流程与状态](references/sw-workflow/guide.md) |
| 点子、主题、戏核、一句话故事 | [前提与主题](references/sw-premise-theme/guide.md) |
| 情节点、节拍、高潮、长片结构诊断 | [故事结构](references/sw-story-structure/guide.md) |
| 人物动机、弱点、对手、关系冲突 | [人物与冲突](references/sw-character-conflict/guide.md) |
| 潜台词、角色声音、对白改写 | [对白](references/sw-dialogue/guide.md) |
| 分场、价值转折、进出点、节奏 | [场景与段落](references/sw-scene-craft/guide.md) |
| 剧本格式、Fountain、小说或舞台改编 | [格式与改编](references/sw-format-adaptation/guide.md) |
| 有机结构、中段松散、道德抉择、对手网络 | [特鲁比故事解剖](references/sw-truby-anatomy/guide.md) |
| 主副类型、类型节拍、混合类型诊断 | [类型解剖](references/sw-genre-anatomy/guide.md) |
| 剧集单集结构、季结构、多线与出幕悬念 | [剧集结构](references/sw-series-structure/guide.md) |
| 剧集持续冲突机制、人物网、设定集与推介文档 | [剧集引擎与设定集](references/sw-series-engine-bible/guide.md) |
| 情节拆解、编剧室协作、反馈处理和制作限制 | [编剧室](references/sw-writers-room/guide.md) |
| 半小时喜剧、情景喜剧、笑点与喜剧格式 | [喜剧](references/sw-sitcom-comedy/guide.md) |
| 国产剧文档链、分集大纲、长篇小说改编 | [国产剧实践](references/sw-chinese-series-practice/guide.md) |
| 京剧、豫剧、越剧等板腔体写作 | [板腔体方法](references/sw-chinese-opera-banqiang/guide.md) |
| 元杂剧、传奇、昆曲等曲牌体写作 | [曲牌体方法](references/sw-chinese-opera-qupai/guide.md) |
| 板腔体作品的结构和唱段案例对照 | [板腔体案例](references/sw-chinese-opera-banqiang-cases/guide.md) |
| 曲牌体作品的结构和套曲案例对照 | [曲牌体案例](references/sw-chinese-opera-qupai-cases/guide.md) |
| 美国电影案例与同类型参照 | [美国案例](references/sw-american-case-studies/guide.md) |
| 日本创作方法、片段优先、主题后置 | [日本方法](references/sw-japanese-screenwriting/guide.md) |
| 韩国／法国方法、情绪、探访、集体创作 | [韩国与法国方法](references/sw-korean-french-screenwriting/guide.md) |
| 行业推介、职业流程、署名和交易知识 | [行业与生意](references/sw-industry-business/guide.md) |
| 契诃夫、多主人公、事件画外、反高潮 | [契诃夫戏剧法](references/chekhov-dramaturgy/guide.md) |
| 小津、家庭日常、节制表达与对白语气 | [小津剧本方法](references/ozu-screenplay-style/guide.md) |
| 《继承之战》式群像、权力冲突与容器集 | [继承之战分析](references/succession-series-writing/guide.md) |
| 已出版剧集的结构、试播集与跨地区案例 | [剧集案例库](references/sw-series-case-studies/guide.md) |

## STEP 4: 交付与边界

- 回答语言跟随用户；已有剧本保持其语言，除非用户要求翻译。跨语言术语参照[术语表](references/sw-workflow/terms.md)。
- 诊断要指出具体问题、它造成的戏剧效果及可行改法；创作要交付实际文字，不能只给方法说明。按用户要求决定是否附解释。
- 硬性制作限制优先于范例；要求彼此冲突时指出具体取舍，不默默忽略。参考作品用于分析方法，避免将其人物、情节或台词直接搬进原创项目。
- 用户要文件时，按所选体例交付 Markdown、纯文本或 Fountain；无文件要求时可直接在对话中交付。图像、配音和视频不属于本技能产出。
- 资料中的行业规则与政策有来源年代；涉及当前事实时核实后使用，无法核实时明确年代与不确定性。

原创部分许可及第三方引文范围见 [LICENSE](LICENSE) 与 [NOTICE](NOTICE)。

## STEP 5: 审核、确认与失败处理

- 用户只要方向就停在方向；只要大纲就不加对白、完整剧本或生成提示词。多个方向须改变欲望、对立、核心选择或情感机制，不只换标题。
- 修改已批准的结局、人物关系或媒介前先展示影响并确认；明确要求按既定条件直接写时，不重复索要相同批准。普通局部润色无需逐句审批。
- 多场景先诊断共性问题再成组修订，保留无关已通过内容。用户否定结果时定位原因并改相关部分，不重复原方案。
- 短片、幻想规则或视觉叙事任务，先读[短片因果校核](references/short-form-checks.md)。时长是叙事预算，不是实测成片长度；检查观众是否有时间看懂动作。
- 来源或内部文件缺失时指出准确缺口，只暂停依赖部分；不回退到已删除的独立技能。不得编造引文、页码、法律结论或审查通过。
- 不生成媒体。保存文字时使用当前项目实际路径，不硬编码输出目录。一次性交付不强建档案。

## 阅读与验证

[模块索引](references/index.md)提供中英文任务映射。
