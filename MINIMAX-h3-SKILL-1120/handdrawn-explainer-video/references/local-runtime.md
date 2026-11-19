# 运行环境与能力路由

先检查当前执行环境实际可用的媒体制作能力与依赖。

1. 生图：使用当前可用的图像生成/编辑工具，保留图片与完整提示词。
2. 旁白：优先当前平台已可用的 TTS，其次用户提供的整篇录音。用户明确允许且环境支持时可用系统语音；不自动购买服务或下载模型。此版不提供音色克隆、个人参考导入或固定六音色目录。
3. 时间戳：使用 TTS 实际返回的时间戳或当前可用的 ASR/强制对齐。检查转写与原文差异。不得按字数平均分配并声称是语音对齐。整篇母带、对齐格式和核验见 continuous-narration.md。
4. 合成：包内脚本需要 Python 3.9+、Pillow、NumPy、SciPy、FFmpeg/ffprobe，以及覆盖视频语言的字体。requirements.txt 是依赖声明，不代表已安装。显式配置 font 与 captions.font 的实际路径，不打包系统商业字体。

先核实这些能力再批量生图，避免花费后才发现无法合成。无Python或FFmpeg时，先按[运行对接](rendering-workflow.md)第1节检查并在用户同意后用 `scripts/install_runtime.sh` 安装（以检测结果为准）；仍无法安装时，只有平台确实提供等效逐笔合成能力才走替代路径，并如实记录；没有时说明具体缺口，不把普通图生视频声称为本流程的可控手绘。

`scripts/handdraw_video.py doctor JOB` 只检查现有任务能否合成，不探测本机配音端口。已有完整音频的离线任务无需声音服务。

生成图片统一执行 `python scripts/clean_image.py IMAGE --audit AUDIT.json`。脚本用Pillow重新编码为无嵌入元数据的PNG，保留RGB/RGBA像素并核验；源文件必须为PNG，其他格式先转换。不依赖Bun或ExifTool，不写入模拟相机信息。报告扩展属性残留，不承诺消除AI来源识别。

六款真人质感手部、仅画笔和画风预览已随包提供；优先本地文件。网络不可用且无缓存时明确缺少哪一项，不冒充已下载。见 hosted-assets.md。
