# Shared production workflow / 共用制作流程

## Authority and scope / 优先级与范围

This workflow governs all five styles. Style-specific files define visual language, not permission to bypass approvals or supply default speech, subtitles or music. Historical examples are illustrative only. MiniMax H3 is the user-requested default video model; confirm another model if H3 is unavailable. Do not substitute code animation.
本流程适用于五种画风。专项文件定义画法，不得跳过确认或预设旁白、字幕与配乐。历史示例仅供参考。视频默认 MiniMax H3；不可用时先询问替代方案，不擅自换模型或改为代码动画。

## 1. Confirm choices before video / 视频前确认

Record explicit decisions in the current proposal, asking unresolved items together and preserving already confirmed choices:
- Narration: none or enabled; Chinese, English or another language; approved text, voice profile and delivery. Never infer narration language from chat language or an English example. When no narration is chosen, omit all spoken lines and default voices.
- Subtitles: yes/no; if yes, language, monolingual/bilingual form, and burned-in captions and/or subtitle file. Do not assume subtitles match narration language or that they are wanted.
- BGM: yes/no; if yes, musical direction, emotional arc and its relationship to narration. Offer a recommendation for approval rather than adopting a fixed instrument set, BPM or theme. Clarify whether existing music is to be kept, replaced or supplemented; do not accidentally stack two scores.
None has a default. An unresolved item blocks dependent video generation, not unrelated planning. Include these choices in the proposal for approval. Do not re-ask an explicit answer.

在当前提案中记录明确选择，未决项一次问齐，已确认内容不重复询问：
- 旁白：不要／需要；中文／英文／其他语言；需要时确认文稿、声音设定与表达。不能由聊天语言或英文示例推定旁白语言。不要旁白时省略所有口播及默认人声。
- 字幕：要不要；需要时确认语言、单语／双语、烧录及／或字幕文件。不得默认与旁白同语，也不默认用户需要字幕。
- 配乐：要不要；需要时确认风格、情绪曲线及与旁白的关系。可推荐方案供确认，不固定乐器、BPM 或旋律。已有音乐时明确保留、替换还是叠加，避免无意叠音。
三项均无默认值。未决项阻塞依赖它的视频制作，不阻塞无关策划。提案中展示并取得确认，不重问已有明确答案。

## 2. Proposal, identity and keyframe gates / 提案、身份与关键帧确认

Prepare a reviewable director's proposal with source-grounded claims, story beats, scene changes, time jumps, narration and audio decisions. Approve it before visual production. Show five separate style cards before style selection; do not collapse styles into a mixed card. Preserve the five-style structure. Styles 3 and 4 share the approved pale-lavender character master and differ only in environment/background; neither uses the historical red-hat/yellow-shirt identity.
Reuse approved character images; otherwise generate and approve one reference sheet per recurring character. Do not recreate an existing identity using text alone. Preserve character proportions, line weight and accessories across camera distances. Props from an identity sheet are not automatically story props.
Create independent keyframes for the planned shots using those identities. Obtain approval of character, composition, palette and props before any video. A keyframe can depict an intermediate beat: it is not automatically a first-frame requirement and must not override the approved action order. Only revise affected frames after feedback.

导演提案写清有依据的核心表达、叙事节拍、地点与时间变化、旁白和声音选择，先确认再制作。选画风前展示五张独立参考卡，不混成一张综合卡，保留五风格结构；画风3与画风4共用获批淡紫色人物定稿，区别仅为环境与背景，均不回退历史红帽黄衣人物。
复用获批人物图；没有时按每个反复出现角色制作独立参考图并确认。不得只靠文字重建已有身份；远近景保持人物比例、线宽和配饰。人物参考中的道具不自动继承为故事道具。
依照镜头规划制作独立关键帧，确认人物、构图、配色与道具后才生成视频。关键帧可表现中间节拍，不自动成为首帧，不覆盖获批动作顺序。按反馈只改受影响内容。

## 3. Generate approved clips / 制作获批片段

Read current model capabilities and guidance. Use the corresponding approved shot keyframe and approved images for each appearing character, explicitly stating the separate purposes. Repeat the complete visual and, when enabled, voice anchors in every self-contained prompt. Do not attach an earlier generated video unless continuation was requested.
Separate static appearance from opening state, timed transfers and ending state. Track the owner, location, color, count and contact of important props; taking an object leaves its old position empty. Name location cuts and time jumps. Do not equate continuity with an identical background. Use concrete actions rather than abstract object morphing.
Budget speech by language and approved pace, including pauses. English word estimates do not transfer to Chinese. If overloaded, shorten the script and seek approval before generation. If narration is off, request no speech. If post-production music is approved, request no generated score while preserving the approved narration and SFX; if music is off, request no music. Keep generated scenes free of subtitles and unapproved visible writing; approved subtitles are added later.

先读取当前模型能力和指南。每段引用对应获批关键帧及所有出场角色的获批图片，说明各自用途；独立提示词重复完整画法锚点，需要旁白时重复完整声音设定。未要求续写不传入前段生成视频。
区分静态外观、开场状态、定时交接与结束状态。跟踪重要道具的归属、位置、颜色、数量和接触关系；拿走后原位应空。写明换场与时间跳跃，一致性不等于背景相同；用具体动作而非抽象变形。
按确认的语言与语速预留停顿，英文词数不套用中文。内容超载先精简并确认再生成。不要旁白时明确无人声；配乐计划为后期添加时要求片段无生成配乐，保留获批旁白与音效；不要配乐时要求无音乐。生成画面不带字幕和未获批文字，字幕后期添加。

## 4. User review and targeted revision / 用户审阅与局部修改

Present generated clips for user review, then obtain approval before final assembly. Do not analyze self-generated outputs for unsolicited media-quality acceptance or initiate extra paid work. Check authored documents and prompt consistency before execution. If the user asks for inspection, inspect only that scope. Never retry a failed paid task or regenerate on your own. Explain the proposed correction and get authorization. Preserve unaffected outputs and approvals.
Repeated prompts are consistency controls, not guarantees of matching identity, voice or music. Use real approved resources and versions, not text descriptions as substitutes. Separate completion from user acceptance.

片段交用户审阅，获批后再组装。不主动分析自己生成的产物做质量验收，不追加付费工作。执行前可检查自写文档和提示词一致性；用户要求核查时只按指定范围分析。失败重试或重生成须获得授权，说明拟改内容，保留不受影响的产物和确认。
重复提示词只是控制措施，不能保证身份、音色或音乐完全一致。后续引用真实获批素材和版本，不靠文字替代。工具完成不等于用户接受。

## 5. Assembly, subtitles and BGM / 拼接、字幕与配乐

Merge approved clips in story order, preserving accepted visuals and sound. Apply only explicitly approved audio and subtitle choices.
When subtitles are enabled, prefer actual-speech transcription timing, correct punctuation and line breaks without changing the spoken meaning, fit cue endings within actual video duration, and use the approved language/form. A translation must preserve meaning. If ASR fails, report the limitation and ask before supplying estimated timings; never claim forced alignment for an estimate. When subtitles are off, do not generate or burn them in.
When music is enabled, favor one continuous original instrumental track for a coherent score. Trim/loop as needed to the actual duration, use gentle fades, and lower or duck it under narration. Do not claim a particular tempo/instrumentation was approved unless it was. Keep dialogue intact; if existing music cannot be separated from speech, explain that limitation before replacing or stacking it. No approval to add BGM means no BGM generation or mix.
Save the final video, approved anchors/keyframes, relevant subtitles/music and production decisions under their proper creative objects. Keep the final video's identity when revising its mix or subtitles; retain its version history. Report actual delivered duration and remaining limitations, and ask the user to review.

按故事顺序拼接获批片段，保留认可的画面与声音，只处理明确获批的声音和字幕选项。
需要字幕时优先使用实际语音识别时间轴，校正标点和断行，不改变口播含义，结束时间不超过实际视频；使用确认的语言和形式，翻译保留原意。识别失败时说明限制，先询问是否接受估时，不能把估时称为精确对齐。不要字幕时不生成或烧录字幕。
需要配乐时优先使用一条连续原创纯音乐，按实际时长裁剪或循环、柔和淡入淡出，旁白期间压低或自动避让。不得把未确认的速度或配器称为获批。保留人声；已有音乐无法与人声分离时，替换或叠加前先说明限制。没有加配乐的确认，就不生成或混入 BGM。
将成片、获批角色与关键帧、相关字幕音乐和制作决定归入各自创作对象。修改混音或字幕沿用成片身份和版本历史。说明实际时长、未覆盖内容与限制，请用户审阅。
