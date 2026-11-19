# 可移植后期清单

当原生工程不能完整表达跨工具交接时，在项目 `post/manifest.json` 保存以下独立格式。它不是上游 storyboard schema，不能传给上游分镜校验器。使用实际测得的数字与资源标识替换示例；不把示例作为生成记录。时间单位为秒，时间线范围为 `[0, duration]`。

```json
{
  "schema": "drama-post/v1",
  "duration": 10,
  "target": {"min": 9, "max": 11},
  "export": {"width": 1280, "height": 720, "fps": 24},
  "clips": [
    {"id": "SEG001", "source": "../video/SEG001-v2.mp4", "source_duration": 12, "in": 1, "out": 11, "start": 0, "speed": 1}
  ],
  "expected_cues": [
    {"id": "SYS001", "kind": "system", "text": "任务已开启。"}
  ],
  "cues": [
    {"id": "SYS001", "kind": "system", "text": "任务已开启。", "source": "../audio/SYS001.wav", "start": 2, "end": 4}
  ],
  "overlays": [
    {"id": "UI001", "cue_id": "SYS001", "text": "任务已开启", "start": 2, "end": 5, "position": "shot-reviewed", "review": "not-run"}
  ],
  "allowed_speech_overlaps": [],
  "qc": {"full_decode": "not-run", "visual": "not-run", "listening": "not-run", "canvas_delivery": "not-run"}
}
```

- `target` 是用户接受的片长范围，没有硬性范围时省略，不捏造“用户同意”。尺寸与帧率为导出目标，不是素材原生规格；真实素材规格在制作账本记录。
- `clips` 是最终可见视频区间，时长为 `(out-in)/speed`。转场允许重叠；冻结／纯图卡在原生时间线中明确生成成片段后记录，不能用假视频来源补洞。
- `expected_cues` 从锁定剧本独立提取所有必须发声的台词，包含 dialogue、narration、inner、system 四类。不能由已生成 `cues` 反向生成，否则无法发现漏句。无台词项目用空数组。文字面板单独列入 overlays，不自动算作说过该台词。
- `cues` 对应实际声音来源：保留原生对白时 source 指向原视频；另配则指向音频。可扩展源音频入出点、音色、说话者、检查证据等字段。长句拆分时先在锁定声音表使用稳定子 ID；不能复制同一 ID 数次充当分段。
- 有意打断／同时说话时，将两个 cue ID 的数组加入 `allowed_speech_overlaps`，并在后期报告说明创意依据；其他对白重叠触发失败。音乐、环境和音效使用工程独立轨道，不列为 speech cue。
- `overlays` 可为空，非空时每项包含可编辑文字或素材来源、时间与位置；关联语音时用真实 cue ID。空间遮挡须实际看片，本脚本不判断位置对错。
- `qc` 必须记录真实检查结果；脚本不会替作者写成 pass，也不把清单检查视为成片验收。

运行：

```bash
python3 <skill-root>/scripts/check-timeline.py <project>/post/manifest.json
python3 <skill-root>/scripts/check-timeline.py <project>/post/manifest.json --require-local
```

输出 JSON 含 `ok`、`errors`，失败退出码为 1；无法读取文件或 CLI 错误为 2。`--require-local` 仅用于已下载的离线项目，相对媒体路径以 manifest 所在目录解析；远程／原生资源未下载时不启用，但要通过真实工具验证可访问性。

检查范围：格式、数字、目标时长、视频覆盖及裁切范围、必需台词的 ID／文本／类别、台词越界及意外重叠、面板时间与语音关联。不检测媒体内容、口型、实际字音、画面遮挡、渲染文件规格或许可。即使全部通过，仍必须按后期章节完成媒体探测与视听验收。
