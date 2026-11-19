# 一次收集制作选择

配音与生图前，一次询问尚未明确的项目：视频语言、时长、画幅与分辨率、画风、绘制工具、背景音乐。已明确项目直接沿用，不重复问。不给任何项目预选值，不启动网页服务器或倒计时，不因超时自动继续。

示例问法：“请选一下这支视频的语言、时长、画幅与分辨率、画风、绘制工具，以及是否加背景音乐；也可以明确把其中几项交给我决定。”按当前工具能力提供选项，不把示例30秒、1080p、仅画笔或无音乐写成默认。

用户尚未选画风时必须展示真实预览，可先展示3—5个并提供完整目录；同时提供自定义描述和明确委托匹配选项。手部必须展示六款真人质感预设及独立的仅画笔选项，不能只默认仅画笔。展示方式和程序校验见 visual-selection.md。用户选择音乐时，可不添加、使用用户音乐，或委托从当前可用来源获取/生成；缺少来源不能静默改为无音乐。

保存 options/selection.json，每项包含 value、status、evidence；键为 language、duration_seconds、canvas、style、hand、music。明确选择的 status 为 explicit，明确委托为 delegated，未回复为 pending。canvas 应包含 width、height 与比例，style 记录实际模式/编号或描述，hand 记录具体 preset，music 记录是否添加及实际来源。所有项目明确或已获委托后才开始生成素材。委托不等于用户逐项确认，记录应如实区分。

时长允许用户选择按内容决定；选择添加音乐仍须拿到实际可用音频并配置 audio.music 的 source、gain 和 user_instruction。选择不添加则写 audio.music=false。配乐细则见 audio-and-ending.md。

画风最终文件仍遵循 style-and-drawing.md 的结构；selection 的 confirmation 使用 explicit_user_request 或 user_delegated，不为新任务写 automatic_default 或 timeout_default。底层支持旧记录只用于兼容，不代表本版允许自动默认。

等待回复时可读资料与检查能力，不能生成依赖未选项目的旁白、插画或视频。用户只回答一部分时，保留已选项并只追问剩余项目；普通“继续”不视为对全部未选项目的委托。修订成片时沿用先前已确认选择，只有用户要求改动的项目才重新选择。

字幕保持清晰单层，按所选画面设计。不再提供广告和水印；旧任务中的非空 watermark 或 hand.pen_text 必须移除后再构建。
