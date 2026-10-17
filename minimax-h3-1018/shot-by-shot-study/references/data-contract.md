# 数据与证据契约

本技能保留上游 `shots.json` 形状，把 Design 状态放在独立文件；避免将未经测量的数据伪装成上游机器证据。

## shots.json

顶层字段：

| 字段 | 含义 |
| --- | --- |
| source / title / lang | 对应原片文件或素材名称、标题、zh/en |
| meta | durationSeconds、fps、width、height、aspect、hasAudio；工具测量值 |
| params | 上游测量与校验参数，省略采用上游默认 |
| seedCuts | 实际检测的切点秒数；无检测器时不要编造 |
| manualCuts | 有逐帧/回放证据的人工补切点；本地由 recut 写入 |
| cast | 可选，id/name/note；项目内人物编号 |
| shots | 按时间排列的镜头数组 |

每镜：`id`（S01 起连续编号）、`start`、`end`、`seconds`、`motion`（未测为 null）、`size`、`category`、`camera`、`transitionIn`、`subjects`、`frame`、`onscreenText`、`audio`、`note`，以及可选的 `rhythm`、`rhythmNote`。

时间区间为 `[start, end)`，最后一镜覆盖到片尾。`seconds=end-start`。上游时间四舍五入到两位小数，不能声称帧级精度。VFR 素材使用真实 PTS，不用平均 fps 推算每个切点。

只读保护：保留原始 seed/track 副本；机器产生的 meta、seedCuts、motion、时间字段只由测量/修正程序重建。原生平台数据可以映射为同形 JSON，但来源记录必须注明 platform-timestamps，不假装经过 ffmpeg。

观察草稿可保留 `null` 时间与空的分类字段；在状态文件显式标记 estimated 或 unknown。这种 JSON 不能送入上游精确报告/同步命令；用 Markdown 展示未知项，不填 0 凑齐。

## analysis-state.json

下面是结构示例，数值与路径只是说明，执行时替换为真实记录：

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "source": {
    "assetId": null,
    "version": null,
    "sha256": null,
    "filename": "source.mp4",
    "rangeStartSeconds": 0,
    "rangeEndSeconds": 10
  },
  "executionMode": "local-assisted",
  "timing": {
    "status": "measured",
    "method": "ffmpeg-scene+ffprobe",
    "precisionSeconds": 0.01,
    "notes": "切点按两位小数记录，已检查疑似转场"
  },
  "capabilities": [],
  "shotEvidence": {
    "S01": {
      "confidence": "medium",
      "visual": ["frames/S01a.jpg", "frames/S01b.jpg"],
      "boundary": "detector candidate, reviewed",
      "audioSource": "unavailable",
      "uncertainty": "待回放确认是否存在微推"
    }
  },
  "quality": {"status": "pending", "passed": [], "failed": [], "skipped": [], "unverified": []},
  "nodes": {},
  "artifacts": {},
  "htmlReport": {
    "choice": "not_asked",
    "status": "not_started",
    "sourceRevision": null,
    "analysisRevision": null,
    "mp4Artifact": null,
    "reportArtifact": null
  },
  "nextAction": "检查关键帧并填写镜头表"
}
```

`executionMode`：platform-native / local-assisted / observation-draft。
`timing.status`：measured / estimated / unknown。`method` 保存实际来源或 unavailable。
`audioSource`：listened / asr / burned-subtitles / unavailable；ASR 有误需回听，字幕来源不能标成核听。
`confidence`：high / medium / low，以当前证据充分度评估，不生成伪统计概率。

每次重编号后同步更新 shotEvidence 与节点映射；旧 ID 不能默默绑定新画面。没有对某项做检查时不能填 passed。

## HTML 自动完成记录

在 `htmlReport` 业务状态下按实情附加 `entryPath`、`bundlePath`、`previewUrl`、`mediaBinding`、`frameManifest`、`interactionChecks` 与 `blocker`。这些不是平台调用字段，也不是上游脚本自动维护的结果。未知值保持 null，不填写计划路径冒充产物。

`mediaBinding` 记录原片身份、包内相对路径和如有兼容转码的来源映射；不能把带信息卡 MP4 当原片。`frameManifest` 逐帧记录镜号、源文件、实际时间证据与包内路径，联系表与单帧分开。`previewUrl` 只记录实际启动服务返回的地址，注明会话性；交互检查记录执行时间、结果和证据。文件已生成但浏览器受阻时保留 `created_unverified` 并记录 `blocker`，不要抹掉产物或将其标成验收通过。

## HTML 后置选择与恢复

`htmlReport` 是制作业务状态，不是平台调用参数；由执行者按真实进展维护，上游渲染器本身不会自动弹出选择卡。

- `choice`：`not_asked` → `awaiting_user` → `accepted` 或 `declined`。
- `status`：`not_started`、`building`、`blocked`、`created_unverified`、`verified`、`skipped_by_user`。
- `sourceRevision` 和 `analysisRevision` 绑定真实素材版本与数据版本；未知保持 null，不伪造哈希。
- `mp4Artifact` 与 `reportArtifact` 只记录实际返回、可访问的文件或节点引用；未产生时保持 null。

默认在 MP4 导出、必需成片验收和交付完成后，才把选择记为 `awaiting_user` 并显示卡片。用户肯定选择或卡片等待期间明确同意时，记录 `accepted` 并开始 `building`，不要再次询问是否开始。拒绝记 `declined` / `skipped_by_user`；没有回答维持 `awaiting_user` / `not_started`，关闭或超时不自动转为同意或拒绝。

用户明确只要 HTML 且取消 MP4 时，可凭该明确请求记 `accepted`，`mp4Artifact` 保持 null，不伪造视频完成。已明确拒绝 HTML 或只要文字时尊重原意，不重复弹卡。

构建受阻记 `blocked` 并保留可用 MP4；文件实际产生而交互未验证记 `created_unverified`；真实交互检查通过后才记 `verified`。拒绝 HTML 不记为整个任务失败；未选择的 HTML 不计入默认交付缺口。

恢复同一原片与分析版本时复用已有选择、证据及成功产物，不重复弹卡、重跑分析或重做 MP4。若用户改变选择，仅执行尚未完成分支。原片或分析版本变化后，先核对新旧对应关系，旧报告与旧确认不得被悄悄绑定到另一份内容。

## 报告与合成文件

`shots.json` 为唯一镜头数据源；`track.json` 为采样运动证据；frames/ 与 sheets/ 为原片抽帧；`shots.md`、用户确认制作的 `shots-report.html`、画布表和同步面板为派生物。默认先交付同步 MP4，再询问 HTML；用于 MP4 面板渲染的 HTML/CSS 不等于交互报告。

HTML 的样式/脚本内联，但视频和关键帧通常仍引用文件，确认制作后的交付应包含它们并验证相对路径。`source.mp4` 或平台素材访问不可用时，不能宣称完整离线播放。
