# 本地辅助执行

仅在执行环境真实可用时使用。依赖 Node.js >=18、ffmpeg、ffprobe；同步面板另需 Chrome/Chromium/Edge。检查命令和版本，不假设 Design 云端能执行 shell。附带脚本不包含 ASR。

`SKILL_ROOT` 表示本技能的实际绝对路径，不要照抄别人的安装目录。以下为 POSIX shell 示例，路径须正确引用。每次分析在独立项目工作目录执行，源视频使用绝对路径；命令中的路径标记需先替换。

```bash
SKILL_ROOT="/absolute/path/shot-by-shot-study"
VIDEO_INPUT="/absolute/path/source.mp4"
SHOTS_TOOL="$SKILL_ROOT/vendor/video-shots/scripts/video-shots.mjs"
SYNC_TOOL="$SKILL_ROOT/vendor/video-sync/scripts/video-sync.mjs"
```

## 检测、抽帧与标注

```bash
node "$SHOTS_TOOL" seed "$VIDEO_INPUT" --track track.json --title "参考片拉片" > shots.seed.json
cp shots.seed.json shots.json
node "$SHOTS_TOOL" frames shots.json --video "$VIDEO_INPUT"
node "$SHOTS_TOOL" sheet shots.json --cols 4 --rows 6
node "$SHOTS_TOOL" sheet shots.json --cols 4 --rows 6 --pick b
```

先检查退出码、stderr 与实际输出。frames/sheet 的局部失败可能仅写 stderr，退出成功不保证帧齐全。旧帧目录可能残留文件；改切点时用新的版本目录重抽，以免残留帧冒充新帧。缺帧联系表可能压缩顺序，映射镜号时核对真实文件列表。

观看联系表及必要回放后，只编辑语义字段。保存 `analysis-state.json`，明确测量方式。修正实际漏切/误切时：

```bash
node "$SHOTS_TOOL" recut shots.json --track track.json --split 12.34 > shots.recut.json
```

12.34 只是语法示例，不能当成真实切点。成功后核对新数据再替换，禁止把输入和重定向输出设为同一文件。并刀用 `--merge` 指真实边界；重抽帧并重做被清空标注。

## 校验与画布摘要

```bash
node "$SHOTS_TOOL" validate shots.json --track track.json --frames frames > quality.txt
node "$SHOTS_TOOL" render shots.json --md --track track.json > shots.md
node "$SKILL_ROOT/scripts/canvas-plan.mjs" shots.json --state analysis-state.json --out canvas
```

先检查 validate 结果再生成正式产物，失败时只出有标记的草稿。上游脚本没有 Design 状态感知：只能对 measured 数据使用。观察草稿直接走本技能 canvas-plan/Markdown，不能往 seedCuts 填猜测以骗过校验。

## 同步视频：默认先执行

镜头数据与素材版本通过核验后，先制作同步 MP4，不要求已经构建交互 HTML 报告。

```bash
node "$SYNC_TOOL" plan shots.json --video "$VIDEO_INPUT" > sync-plan.json
node "$SYNC_TOOL" panels shots.json --video "$VIDEO_INPUT" --frames frames --out panels
node "$SYNC_TOOL" compose shots.json --video "$VIDEO_INPUT" --panels panels -o annotated.mp4
```

可用 `export` 合并后两步，但先检查 plan 和面板可读性更易发现问题。`plan` 与 `panels` 使用相同的 `--scale`、`--panel`、`--width`、`--height` 设置；`panels` 将实际布局计划存入 `layout.json`。两条合成路线都读取该计划，不按原片宽高重新推断，也不使用 compose 阶段的参数覆盖面板几何。需要改尺寸、帧率或画质时先按新设置重做面板；旧 `layout.json` 缺少计划会提示重新运行 panels。`--ease` 和 `--anchor` 在合成阶段控制滚动。当前 compose 不会自动证明数据对应原片，必须先核对身份、范围与时长。几何细节见 `vendor/video-sync/references/layout.md`。

浏览器没自动识别时，用 `--chrome` 传实际可执行路径。修改面板样式前把 `vendor/video-sync/scripts/` 复制到项目目录，在副本的 panel.css 中改，不改共享安装。自定义后重新生成所有面板和布局。供视频渲染的 HTML/CSS 面板不是可选交互报告，不受后置选择卡限制。

运行时动画命令与兼容路线仍按 [sync-video.md](sync-video.md) 检查。完成 MP4 成片验收并交付真实文件后，才显示运行文件第 7 节的两选项单选卡。

## 交互报告：仅在用户确认需要后执行

用户选择“需要，开始制作”后，复用同一版本数据与关键帧，立即执行构建，不再次询问是否开始、不重做 MP4。用户拒绝时跳过；没有回答时停止等待。

```bash
node "$SKILL_ROOT/scripts/build-report.mjs" shots.json --state analysis-state.json --video "$VIDEO_INPUT" --frames frames --track track.json --out interactive-report
```

交互构建器会复制真实原片和关键帧到报告目录，播放器指向包内素材。交付整个 interactive-report 目录；预览与交互验收见 [interactive-report.md](interactive-report.md)。不要把用户机器绝对路径作为云端可播放链接。构建受阻只影响 HTML 分支，保留已完成 MP4 并报告具体条件；不能把源码当已完成报告。

## 自动预览与交付

构建后继续执行，不把上述命令当作用户待办清单。流程与阻塞处理见 [automatic-html.md](automatic-html.md)。在获准的本地执行环境中，可用随包服务预览实际生成的目录：

```bash
node "$SKILL_ROOT/scripts/serve-report.mjs" interactive-report --port 0
```

使用服务实际输出的地址，按宿主要求打开受支持的浏览器并完成交互验收；不能把路径猜成可访问链接。服务在当前会话按需存活，记录实际进程或服务身份，不终止无关进程。源码写入、素材绑定和缺帧补齐由执行者完成；文件选择与提取按钮只作经用户接受的恢复路线。停止服务后，本地预览链接可能失效，因此还要提供包含全部依赖的完整报告包。若浏览器和服务不在同一主机，先确认获准的可达入口，不开放公网来绕过限制。

## 自测

```bash
node "$SKILL_ROOT/vendor/video-shots/scripts/selftest.mjs"
node "$SKILL_ROOT/vendor/video-sync/scripts/selftest.mjs"
node --test "$SKILL_ROOT/scripts/canvas-plan.test.mjs" "$SKILL_ROOT/scripts/serve-report.test.mjs" "$SKILL_ROOT/scripts/compose-sync-video.test.mjs" "$SKILL_ROOT/scripts/report-binding.test.mjs"
node --test "$SKILL_ROOT/scripts/compose-sync-video.integration.test.mjs"
```

合成集成测试实际生成短素材，覆盖无音轨、音轨长短差异、缩放横屏、竖屏限高与4K限宽。可通过 `FFMPEG_BIN` 指定宿主提供的可执行文件；缺失时会显示跳过。合成按源视频结束，短音轨补静音，长音轨在画面结束处截断。

这些测试验证程序逻辑，不等于平台接入测试或实际成片视听验收。记录真实结果；不能把缺少 FFmpeg 或 Design 接口造成的未执行写成通过。后置 HTML 选择卡还需按 [quality.md](quality.md) 的分支用例验收，不能仅凭脚本测试通过声称交互卡已在宿主中实测。
