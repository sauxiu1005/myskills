# 渲染工作流 / Rendering workflow

本文件说明随包 Python + FFmpeg 管线的依赖、输入和产物。安装位置与工具发现由 scripts 中的运行环境适配负责；领域流程不要求某个宿主应用。

## 1. 检查与准备

先执行 `bash scripts/install_runtime.sh --check`，确认 Python 3.9+、FFmpeg 与 ffprobe 实际可用。缺项时说明缺少内容、安装来源及影响，获得同意后再运行安装；可先用 `--dry-run` 查看计划。缺少可用安装方式时报告实际缺口，不用其他视频路线冒充逐笔渲染。

在 Skill 目录执行 `source scripts/design_env.sh`。该脚本查找可用运行时，在独立虚拟环境中按 `scripts/requirements.txt` 准备 Pillow、NumPy、SciPy，不改系统 Python；导出 `HANDDRAW_PY`、`HANDDRAW_SKILL` 与可用字体 `HANDDRAW_CAPTION_FONT`。具体检测路径封装在 `scripts/runtime_detect.sh`，以检查结果为准。

后续使用 `"$HANDDRAW_PY" "$HANDDRAW_SKILL/scripts/<脚本>.py" ...`。在新环境可用 `smoke_test.py --output <项目内新目录>` 验证管线；测试夹具不能当成正式作品。

## 2. 任务目录

任务放在当前项目的独立目录，例如 `<项目根>/handdraw-jobs/<主题短名>/`，包含 job.json、design.json、design/、style/、options/、inputs/、work/、outputs/。不写入 Skill 安装目录。

## 3. 准备真实输入

| 输入 | 制作要求 | 任务文件 |
|---|---|---|
| 画风与手部 | 展示 assets 中真实预览和编号，再收集选择；可用 selection.html | 按 visual-selection.md 记录选择 |
| 插画与封面主视觉 | 先完成美术简报、提示词和 bind-evidence 预检，再生成或编辑 | 用真实绝对路径引用，或复制到 inputs 后清理副本 |
| 完整旁白 | 用可用语音合成能力的真实音色一次生成整篇，或复用用户录音 | 转为 inputs/narration/master.wav，保留换气与句尾 |
| 时间戳 | 从实际音频转写或强制对齐并核对原稿 | 按 continuous-narration.md 保存 alignment.json 和哈希 |
| 可选配乐 | 沿用用户已确认的来源和风格 | 写入 audio.music 对应素材和增益 |

不编造音色、不克隆声音、不用按字数估计的时间冒充实测。原素材不覆盖，后处理在制作副本进行。

## 4. 渲染与检查

按 runtime-contract.md 运行 `doctor → build → verify --assets-only → render --preview → render → verify`。font 与 captions.font 使用真实字体路径。实际查看代表段及成片抽帧，按 quality-gates.md 填写 review.json 再 finalize；主观听感未验收时明确说明。

## 5. 文件交付

提供 outputs/film.mp4、outputs/cover.png、口播稿与可编辑字幕。字幕放 outputs/editing/captions.srt，不放在成片旁边，避免播放器自动加载第二层。优先展示真实成片，用准确文件引用交付；详细提示词和检查记录留在任务目录，不重复生成或公开发布。
