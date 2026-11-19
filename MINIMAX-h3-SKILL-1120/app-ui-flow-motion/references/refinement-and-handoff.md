# Execution refinements and scoped revisions / 执行细节与局部修订

These rules supplement the existing state graph → beat table → code → render → deliver workflow. They do not change its minimalist single-container style, add routine confirmation gates or make a past film’s palette, glass material, duration or machine paths mandatory. Apply only relevant sections and reuse decisions already confirmed.

以下补充现有「状态图 → 时间表 → 编码 → 渲染 → 交付」，不改变极简单容器风格，不增加常规确认节点，不把某次作品的配色、玻璃、时长或机器路径固化。按本次任务需要读取，已确认的决定直接沿用。

## 1. Evidence and target identity / 依据与目标身份

- Before a revision, identify the intended work and current or explicitly selected version, the reported time/region, the requested change and invariants. Do not infer the target from the latest file name or an unrelated open project.
- A key visual, mascot or logo establishes branding, not a real application screen, a post-click state or a product capability. Official copy can support a feature claim without proving the native pixel layout or exact interaction. Record these scopes separately with source/date/version.
- Preserve supplied brand assets under the agreed use. Do not trace or invent replacement logos/characters. Use a conceptual or minimalist redraw only within the agreed direction; receiving brand art does not itself authorize that tradeoff. Explain a material gap once, not again at every stage.

- 修改前确定目标作品、当前采用或用户指定版本、反馈的时间/区域、改动与不变项；不按最新文件名或无关打开的项目猜目标。
- 主视觉、吉祥物与Logo只能证明品牌形象，不能证明软件实际界面、点击结果或功能。官方文案可核实能力，但不必然证明原生布局和交互细节；分别记录证据范围、来源、日期与版本。
- 在约定用途内沿用原品牌资产，不描摹或自创替代形象。概念示意与极简重绘遵循已确认方向，收到品牌图不等于用户同意该取舍；实质缺口说明一次，不在每步重复确认。

## 2. Shared geometry and reserved lanes / 共享几何与布局分区

Allocate a row from loaded font metrics, not from one screenshot or one text value:

`available flexible width = container width − side padding − reserved content widths − inter-lane gaps − motion safety allowance`

Reserved content includes the icon’s stroke extent, longest main text, maximum digit count, units, conditional badges and the action button. Gaps follow output scale and optical needs, not a fixed global pixel value. If space is insufficient, shorten the flexible track, reflow within the approved frame or propose the material copy change; do not silently reduce requirements or let one control cover another.

- Derive track endpoints, fill, thumb, cursor target/grab offset and bounded stretch from the same layout result. Separate legal values from visual overscroll: the value stays valid even when the shape stretches.
- Update related lanes together. Moving a label may require moving a newly appearing badge, shortening a rail or adjusting a pointer target. Include transitions, press feedback, maximum values and language/font changes as design constraints.
- Keep selected-tab graphics beneath labels and curve/connection endpoints outside text regions. For transparent dragged rows, z-index alone cannot prevent lower text showing through; use masking or intentional entry/exit ordering. Avoid opaque overlays that merely conceal unchanged broken geometry.
- Preload every used script and weight before measuring. Text-only bounds omit icons, strokes, badges, clipping and effective opacity; they are debugging data, not proof of visual quality.

按已加载字体的实际宽度分配整行，而非照抄一张截图或某个数值：

`可伸缩宽度 = 容器宽度 − 左右留白 − 独立内容区域宽度 − 区域间距 − 运动安全余量`

独立区域包含图标描边、最长正文、最大位数、单位、条件徽标与按钮。间距随输出比例与视觉需要确定，不使用全局固定像素值。空间不足时缩短可伸缩轨道、在已定画幅内重排，涉及实质文案变化时提出建议，不悄悄降低要求或允许控件互相覆盖。

- 轨道端点、填充、滑钮、光标目标/抓取偏移与有界拉伸共用布局结果。合法数值与视觉越界分离，形变时数值仍有效。
- 关联区域同时更新。文字移动后可能需要调整新出现的徽标、轨道长度和光标目标；将转场、按压、最大值及字体/语言变化纳入设计约束。
- 选中块在文字之下，连接线/曲线端点不穿正文。透明拖拽行仅调整层级不能防止下层文字透出，应使用遮罩或有序进退；不靠不透明盖板掩盖未修正的几何关系。
- 测量前预加载全部文字脚本与字重。仅文字边界会漏掉图标、描边、徽标、裁切与实际透明度，只作调试数据，不作画质保证。

## 3. Deterministic time evaluation / 确定性时间求值

- Every seek must assign relevant display, visibility, opacity, transform, filters, content, dimensions and shared-layer styles. Do not read stale hidden-layout widths from the previous state. Prefer configured geometry; if DOM measurements are needed, restore the current layout first.
- Preload weights/scripts used later, not only what appears in the opening. Wait for font readiness and image decoding before capture. The same time should evaluate the same state regardless of call order.
- Use nonsequential time tests including early, late and transition states. Report byte equality or a measured documented raster tolerance honestly; do not replace the tail with the head to force a match. Loop-boundary tests apply when looping was requested, not merely because an HTML player repeats.

- 每次seek完整赋值相关显隐、透明度、变换、滤镜、内容、尺寸和共享层样式；不读取上一状态隐藏布局的旧宽度。优先使用几何配置；必须测量DOM时先恢复本帧布局。
- 预加载后续会用到的字重/文字脚本，不只加载开场字体；截帧前等待字体及图像解码。无论调用顺序如何，同一时间都应得到同一状态。
- 以非顺序时间测试早期、后期和转场状态。如实报告字节一致或已测栅格容差，不以首帧替换尾帧强造一致。只有要求循环才测循环边界，HTML重复播放不等于视频无缝。

## 4. Feedback-driven local changes / 反馈驱动的局部修改

1. Use the user’s screenshot/time range to locate the exact control, label and causal transition in the selected version. If the reference conflicts with current content, align only that affected point.
2. Trace shared dependencies: adjacent label/badge, pointer target, geometry, masks, preview source, soundtrack events and timing notes. Preserve unaffected content and specifications.
3. Implement the authorized correction and necessary connected updates. A newly proposed aesthetic change or extra alternative needs agreement; do not turn diagnosis into an open-ended redesign.
4. Re-render the affected range plus necessary transition handles. Reuse unchanged encoded segments only when dimensions, timebase, frame rate, codec settings and joins are compatible. Audio may be copied when unaffected; include changed events, delay or reverb tails if affected. Otherwise render a larger required range, not an unsafe partial join.
5. Deliver the complete requested work, not just a replacement excerpt unless that was requested. Revise the existing work/resources for the same content and preserve history; create separate resources only for genuinely independent outputs or maintained variants.

1. 依据用户截图/时间范围，在选定版本中定位控件、文字及相关转场；与当前内容冲突时只对齐受影响位置。
2. 追踪相邻文字/徽标、光标目标、几何、遮罩、预览源码、声音事件和时序说明等共享依赖，保留不变内容与规格。
3. 实施已授权修复及必要关联更新。新增美术方向或额外候选先征求同意，不把诊断扩展成无限重设计。
4. 只重渲染受影响范围并保留必要的转场余量；分段复用须匹配尺寸、时基、帧率、编码配置与拼接条件。声音不变可直接复用；受影响时覆盖事件、延迟和混响尾音。不能安全拼接时扩大必要渲染范围，不勉强局部复用。
5. 除非只要求片段，仍交付完整作品，不仅交替换片段。同一内容沿用原作品/资源并保留历史；独立内容或需并存维护的变体才另建资源。

## 5. Technical evidence versus visual review / 技术证据与视觉审阅

- Runtime/font/random-seek tests, measured file parameters, decoding and audio peak values are technical evidence. Do not equate them with watching, listening, unoccluded text, aesthetic quality or user approval.
- Save beat/contact-sheet/transition previews for the agreed review cadence. Do not independently analyze finished media to hunt for quality issues, or launch repairs based on such analysis.
- When the user explicitly asks to check occlusion, inspect that time range with a full-resolution frame/crop and available layout data. Identify the actual offending element—icon, thumb, badge or cursor—rather than assuming all black graphics are the same control. Small montage cells may hide spacing; consider clipping and effective opacity. A negative text-intersection report cannot clear an icon/text collision.
- Diagnose within the requested scope. State the evidence actually used and remaining uncertainty; never describe a desk walkthrough as a live browser test or an unplayed soundtrack as auditioned.

- 运行、字体、随机seek、文件参数、解码和音频峰值属于技术证据，不等于已观看/试听、文字无遮挡、画面美观或用户已接受。
- 按约定审阅节奏保存逐拍图、拼图和转场预览；不自行分析成片寻找质量问题，也不依据此类分析发起修复。
- 用户明确要求核查遮挡时，使用该时间范围的原分辨率静帧/局部图和可用布局数据，辨别具体是图标、滑钮、徽标还是光标，不把所有深色图形当同一控件。缩略格可能隐藏间距；考虑裁切和实际透明度。文字边界未相交不能排除图标压字。
- 诊断限于所请求范围，说明实际证据与不确定性；文档走查不冒充真实网站实测，未播放的音乐不称已试听。

## 6. Maintainable delivery / 可维护交付

- Keep the playable MP4, offline HTML/source, required authorized assets, font licenses, rendering instructions, timing/event parameters and truthful technical record. Include the original or legally reusable audio layer when allowed. If HTML is silent or playback is not seamless, say so.
- Discover executable paths and dependencies at runtime or provide documented environment overrides. Do not bake one workstation’s absolute paths or temporary render chunks into the general recipe. Verify package contents and referenced files without claiming unsupported app imports or reloads.
- Return revisions to the same work and content history. Keep product facts, design decisions and measured output facts distinct; update affected source, previews and notes along with the film. For independently owned subobjects, preserve their identity instead of merging everything merely because it appears in one video.
- Report completed, blocked and not-performed work from actual receipts; completed production is not user acceptance. Keep rollback/history available, never silently overwrite the only source.

- 交付可播放MP4、离线HTML/源码、必要且获准的素材、字体许可、渲染说明、时序/事件参数与真实技术记录；允许时附原始或可复用音轨。HTML静音或非无缝循环须注明。
- 运行时发现可执行文件与依赖，或提供明确的环境变量覆盖方式；不把某台机器绝对路径、临时分段写成通用配方。核对包内文件与引用，不声称没有实际完成的应用导入或重载。
- 修订回到同一作品及内容历史；区分产品事实、设计决定与输出实测，随成片更新受影响源码、预览与说明。独立维护的组成对象保留身份，不因同片出现就全部合并。
- 按实际结果报告完成、阻塞与未执行项；制作完成不等于用户接受。保留可回退历史，不悄悄覆盖唯一源码。
