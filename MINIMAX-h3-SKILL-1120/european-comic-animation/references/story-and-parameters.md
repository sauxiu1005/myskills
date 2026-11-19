# 剧本与参数双确认 / Story and parameter gates

## 中文方法
### 状态和证据
按“脚本起点未知 → 剧本草稿 → 等待剧本通过 → 参数确认 → 制作 → 检查剪辑 → 交付”推进。
记住批准的是哪一版和哪些参数；有明确批准证据就复用。修改实质剧情会重开剧本确认，影响规格则也重开参数确认。
仅“做吧”但没有可识别剧本版本，不可替代剧本通过；对完整展示的剧本明确说“通过/按这个做”则有效。沉默和超时永不有效。
### 文本起点
问“你是否已有剧本/脚本？”提供：有现成脚本 / 只有想法需要扩写 / 没有需要创作。
已给出脚本或想法就识别，不重复问。已有稿保留其世界、主题和事件；只有想法则扩写，完全未知才问关键主题、观众或情绪。
不要此时强迫填写尺寸与秒数。此阶段可提出相对快慢和建议时长范围，但不是已确认规格。
剧本模板：标题与意图；角色与关系；背景/场景；起因—发展—结果；每个事件的初态、目标、触发动作/接触、物体响应、可见结果与角色反应；观众关注点、镜头引导与相对节拍。
展示完整剧本，再问“这版剧本是否通过？”选项通过 / 修改。等待答案；修订后再次提交。提供文件不等于明确展示或取得批准。
### 剧本通过后的结构化表单
先看当前工具能力，不进行试生成。使用可用的结构化问答界面；没有时明确说明限制，以普通对话等价收集并等待确认。
第一组：画幅16:9 / 9:16 / 1:1 / 自定义；总时长以秒填写；原创配乐是 / 否（已有音乐则提供沿用、不另生的明确选择）。
第二组：依据已选画幅列实际最终宽×高和用户自定义入口。若界面只支持选项，不支持数值框，使用自定义回答收集具体数值。
示例仅解释比例算术：16:9可对应1280×720，9:16可对应720×1280，1:1可对应1080×1080。它们不是默认值，也不证明模型能原生生成。
显示“当前支持的原生档位/实测或预计源尺寸 → 缩放/补边/裁切方案 → 最终宽×高”。原生尺寸不确定时说未知，不能承诺逐像素精确输出；不支持的要求提供真实替代并等待选择。
选放大需明确源尺寸和目标尺寸以及质量边界；不将放大称原生。核对宽高比；不兼容时让用户选择改尺寸、改比例或明确接受补边/裁切。
已给所有参数也在此阶段统一展示预填值并提供确认/修改，不能把正文默认值当成已确认。已明确确认的完整表单记录则沿用，不重复弹框。
声音确认中分别记录：新原创音乐、已有音乐、对白/原声/音效。选否只禁止私自生成音乐，不自动静音或删对白。缺关键声音意图时补问。
四项及必要声音/适配决定齐备且确认后，进入制作，不逐镜反复问；应用费用批准仍由用户完成。

## English method
Track script intake → draft → explicit script approval → specification confirmation → production → inspection/edit → delivery. Record exact approved versions; material story changes reopen approval.
Ask whether a script exists only when unknown: Existing script / Idea to expand / Create a story. Preserve supplied themes, settings and events. Use relative beats when runtime is undecided; do not lead with a technical questionnaire.
A script includes cast and relationships, setting, cause/development/outcome, initial states, goals, triggering contact, physical response, visible outcomes, character reactions, camera attention and pacing intent.
Show the complete script and ask Approve / Revise. Wait; resubmit revisions. Silence, timeout and a mere file upload are not approval.
After story approval inspect live capabilities without trial generation. Use structured questions for ratio (16:9 / 9:16 / 1:1 / custom), final width × height, total seconds and original music Yes / No; supplied music requires reuse/no-new-music confirmation.
Ask ratio before dependent size options where necessary. Custom answers may collect numbers when there is no numeric field. Example arithmetic sizes are not defaults or claims of native support.
Show native tier/source dimensions separately from final export, explain scaling/padding/crop and disclose upscaling. Unknown native dimensions remain unknown; unsupported requests require an explicit alternative decision.
Reuse known values in the form and get confirmation of the complete set. Reuse a previously explicit full confirmation rather than reasking. If structured UI is absent, explain and collect the same information in normal dialogue; never pretend a dialog opened.
No new music is not silence. Confirm source music interval and dialogue/source-sound/effect policy as needed. After both gates, continue the authorized production without per-shot permission loops; cost approval remains the user's decision.
