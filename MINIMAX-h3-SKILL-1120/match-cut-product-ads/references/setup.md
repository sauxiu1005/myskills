# 后期运行环境

仅策划、提示词、技能维护无需安装媒体依赖或操作 Design。实际制作的能力发现、原生剪辑和画布交付见 [design-adapter.md](design-adapter.md)。优先复用现有运行环境；无代码执行能力时使用功能足够的 Design 原生剪辑，不强装系统组件。

## 后期环境

上游推荐 Python 3.11，依赖见 `scripts/requirements.txt`；需要可执行的 `ffmpeg` 与 `ffprobe`。先检查现有可用解释器、虚拟环境与二进制，实际后期需要时才建立隔离环境，不改系统 Python：

```bash
python3.11 -m venv ~/.cache/match-cut-product-ads/venv
~/.cache/match-cut-product-ads/venv/bin/python -m pip install -r /absolute/path/to/match-cut-product-ads/scripts/requirements.txt
```

不可写时使用项目内 `.venv`。缺少 Python 或 ffmpeg 时依据当前环境提供具体安装路径；用户已有安装授权直接沿用。依赖版本需实际安装验证，包内要求不是跨环境兼容性保证。

## 模板与导出检查

- 首句旁白不应依赖相对限幅，模板默认关闭；脚本仅在此前已有非零旁白峰值时应用 `limit`。检查 `stems/vo.wav` 中每句实际非静音，不能只听背景音乐判断旁白成功。
- 配乐段落主体必须在音源范围内；交叉淡化的前后扩展在首尾裁切并缩短淡化，不使用负索引。可从第零秒开始，零交叉淡化与短片段也受支持；超出音源的主体区间会明确报错。
- 音频回归：安装随包依赖后执行 `python scripts/test_audio.py`，用合成音频验证模板旁白、后续限幅及音源首尾切片；不调用生成服务。

- `examples/template.json` 是待填配置，含不存在的图片、Logo、配乐、配音、拟音；历史案例也不包含完整生成源素材。只学习结构，不直接把案例当成可复现项目。
- `text.font` 应设置当前机器存在且覆盖实际文案字符的字体。上游默认字体为 macOS 路径，缺字时替换字体；代码回退字体不保证中文可用。
- `timeline.size` 和坐标、镜头持续时间、音乐段落应同步改动；所有镜头连续且恰好覆盖 `timeline.frames`。`--draft` 输出宽高减半，不能据此报告正式分辨率。
- 上游 `assemble.py` 正式版文件名固定带 `1080p`，实际分辨率由渲染输入决定；非 1080p 输出验证后重新命名。
- 上游拼接使用 `-shortest`，短音轨可能截断画面。让音轨覆盖完整时间线，并用 ffprobe 实测导出帧数和时长；不足时先补齐音轨再导出，不以成功退出代替完整性检查。
- 上游 concat 文件以单引号包裹路径，项目路径含单引号时可使用不含单引号的临时渲染目录；不能静默交付失败输出。
- 生成模型、分辨率、音频开关、参考角色、费用、等待方式按当前服务 schema 验证。上游默认型号不构成可用性承诺，余额也不等于允许花费的额度。
