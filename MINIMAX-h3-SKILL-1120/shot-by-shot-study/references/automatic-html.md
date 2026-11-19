# HTML 自动完成协议 / Automatic HTML completion

## 中文

### 启动与能力核验

- 默认先完成并验收 MP4，再显示既定两选项卡。只有肯定选择或明确的 HTML-only 请求授权本分支。
- 确认即开始，不再次询问是否生成，不把复制代码、保存文件、选择已知原片或提取关键帧转成用户待办。
- 先核验当前会话真实可用的文件写入、脚本执行、媒体抽帧、网页产物、预览和浏览器能力；历史缺失判断不是当前证据。实现存在、环境可运行、文件已生成、交互已验收分别记录。
- 浏览器操作遵守宿主的前置指引、权限和接管流程；不能自行绕过安全限制。缺少某一路径时检查获准的等效路径，不宣称平台根本不支持。

### 必须执行的顺序

1. **解析来源**：从当前项目、附件和已核验记录解析真实原片、镜头台账、素材版本及单帧路径。不得拿带信息卡成片作原片，不猜文件路径或捏造哈希。缺失且无法解析的来源才向用户索取。
2. **物化数据与关键帧**：已有结构化台账和单帧直接复用。仅有 Markdown 时，把有证据的数据写成构建器需要的真实文件，不把估算补成 measured。单帧缺失时通过获准媒体能力按已核验镜头区间与实际时间补抽；联系表不是单帧，浏览器中的临时 canvas 也不等于已保存资产。记录镜号、时间、源文件和帧路径。不得伪造验证字段绕过构建器。
3. **生成真实 HTML**：优先随包 `scripts/build-report.mjs`，复用其渲染器与跟随扩展。若用户要求保留现有网页实现，则提取 Markdown 的 HTML 源码到实际文件、移除围栏，保留已批准布局和交互，替换必须等待文件选择的初始化。生成目录使用新修订，不能覆盖原片或已有成功产物。
4. **自动关联素材**：播放器初始化即指向已核验原片的包内相对路径；缩略图指向独立帧。不得留下仅收到文件选择事件才设置视频地址的正常启动流程。按需复制依赖到报告包并记录来源，原始和生成资产保持原路径；不得用会话失效的 Blob URL 作为持久交付地址。文件选择器只作可选恢复入口。
5. **启动并打开**：需要本地预览时，用 `scripts/serve-report.mjs REPORT_FOLDER --port 0` 启动回环服务，保留实际服务身份和实际地址。由执行者在受支持浏览器打开页面，不把命令当作用户待办。跨主机时先确认获准的可达入口，不能假定 localhost 共享或开放公网绕过限制。
6. **实际验收**：确认视频与全部帧成功加载；正常点击播放，检查跨切点高亮；点中段镜头确认跳转与超出初始视口的列表跟随；检查反向定位、末镜和跟随开关。禁用自动播放不等于绑定失败。编码不支持必须有实际错误证据；需要兼容副本时保持时间映射，在既有许可内处理，冲突时先询问。
7. **交付与记录**：提供包含 HTML、原片、帧、数据和检查结果的完整目录或 ZIP，以及真实可访问入口。画布文本仅放摘要和链接；源码、单个 index.html 或 MP4 不冒充完整报告。记录文件、素材绑定、帧清单、检查结果及预览链接的会话性，服务关闭后不能继续声称该链接有效。

### 恢复与完成标准

- 同一来源和数据版本复用成功步骤，只补失败或缺失部分；不重新确认、不重做 MP4。
- 文件实际生成而浏览器不可达：保留文件，标记 `created_unverified`，记录具体阻塞与未验项目；不声称交互验收通过。
- 文件尚无法构建：标记 `blocked`，说明实际缺失条件和已完成成果。只请求最小解阻动作，例如开启浏览器界面或提供确实缺失的原片。
- 默认禁止手工教程替代。只有用户明确接受时，才交源码或让用户手动保存/选片/提帧，并如实标注未自动完成的步骤。
- 程序测试、HTML 标签检查、文件存在性不能证明真实解码、镜头高亮或滚动质量。全部必需实际检查通过后才能标 `verified`。
- 本协议不自动授予脚本、媒体或浏览器权限，不保证所有编码可播，不捆绑原片，不自动安装环境。

## English

### Entry and capability evidence

- Complete and verify the MP4 before the established two-option card. Only acceptance or an explicit HTML-only request starts this branch.
- Acceptance starts execution; do not ask again or delegate copying code, saving files, selecting the known source, or extracting frames to the user by default.
- Check actual authorized file-writing, execution, media extraction, web-artifact, preview and browser capabilities. Historical absence is not current evidence. Record implementation, runtime availability, file creation and interaction verification separately.
- Respect host browser prerequisites, permissions and takeover rules. Check authorized alternatives without bypassing protections or claiming that the platform inherently lacks the capability.

### Required sequence

1. **Resolve sources** from the project, attachments and verified records: original film, shot ledger, revisions and individual frames. Do not use the annotated MP4 as the original or invent paths/hashes. Ask only for genuinely missing, unresolvable sources.
2. **Materialize data and frames**: reuse structured ledgers and individual frames. Convert evidence-backed Markdown data into real builder inputs without upgrading estimates to measured facts. Extract only missing frames through permitted media capabilities at verified intervals/times; contact sheets and temporary browser canvases are not saved individual assets. Record shot, time, source and frame paths. Never fabricate validation fields.
3. **Create a real HTML file**, preferably with `scripts/build-report.mjs` and its renderer/follow extension. If the user wants the existing implementation preserved, extract HTML from Markdown, remove fences, retain approved layout and behavior, and replace mandatory file-picker initialization. Use a new revision directory without overwriting originals or successful outputs.
4. **Bind assets automatically**: initialize the player with a verified package-relative original-video path and thumbnails with individual frames. Normal startup must not wait for a file-selection event. Track dependency copies while leaving original/generated asset paths intact. Session Blob URLs are not durable delivery addresses. A picker is optional recovery only.
5. **Start and open preview**: where needed, run the loopback server with `scripts/serve-report.mjs REPORT_FOLDER --port 0`; retain its actual service identity and printed address. The executor opens the supported browser. Do not hand commands to the user as normal execution. Verify authorized reachability across hosts; do not assume shared localhost or expose a public server as a workaround.
6. **Verify real behavior**: load video and every frame, click Play normally, check highlights across cuts, middle-shot seeking and list following beyond the initial viewport, backward seeks, the final shot and follow toggle. Autoplay restrictions are not binding failure. Codec issues require actual evidence; a permitted compatibility copy must preserve time mapping, with conflicting choices resolved first.
7. **Deliver and record** the full folder/ZIP with HTML, original media, frames, data and checks, plus an actual accessible entry. Canvas text is only a summary/link, not the running report. Source code, a lone index.html and MP4 are not substitutes. Record binding, frame manifest, checks and the preview URL's session lifetime.

### Recovery and completion

- Reuse successful steps for the same source/data revision. Retry only missing or failed work without another start confirmation or MP4 regeneration.
- Created files with a blocked browser remain `created_unverified`; retain artifacts and explicit blockers/checks. If no runnable files can be built, use `blocked` with the actual missing prerequisite.
- Request only the minimum unblock action. Manual source handoff, saving, video selection or frame extraction requires explicit user acceptance and an honest incomplete-step record.
- Structural tests and file existence do not prove decoding, highlighting or scrolling. Set `verified` only after all mandatory real interaction checks pass.
- This protocol grants no execution, media or browser permissions and does not promise universal codec support, bundle user footage, or install dependencies.
