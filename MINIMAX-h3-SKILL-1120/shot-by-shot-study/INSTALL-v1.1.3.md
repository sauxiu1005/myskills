# 镜头拉片 Skill 1.1.4

本次 1.1.4 将中文展示名设为“镜头拉片”，英文标题设为 Shot-by-Shot Study，双语运行文件的 name 与包内目录名统一为 `shot-by-shot-study`，并同步触发词和路径示例。功能、脚本、资源及数据格式标识不变。以下保留 1.1.3 的功能说明与历史验证记录。

## 1.1.3 说明

基于已交付 1.1.2 完整包修改。保留中英双语运行文件、展示元数据、全部脚本、上游资源、示例与许可证；不包含用户原片或当前项目生成的影片。

## 正确流程

**分析与证据 → 同步拉片 MP4 导出、验收、交付 → HTML 两选项卡 → 确认后自动构建文件、绑定素材、启动预览、浏览器打开、实际验收 → 完整报告包及入口。**

选项卡仍为“需要，开始制作 / 暂不需要”。未答不开始，拒绝正常结束。明确只要 HTML 且取消 MP4 时尊重原意。HTML 失败不撤销已完成 MP4。

## 1.1.3 新增约束

- 执行者完成真实 HTML 文件写入，不再默认让用户复制代码、另存文件。
- 直接关联已经提供的原片；正常启动不依赖再次选择视频。文件选择器只作经接受的恢复入口。
- 优先复用独立关键帧，缺帧按真实时间证据补抽；联系表和临时浏览器 canvas 不等于已保存单帧。
- 自动启动可用预览并打开实际地址，验收播放、跳转、高亮、滚动、反向定位、末镜和跟随开关。
- 文件生成与交互通过分开记录；实际阻塞保留产物，只请求最小解阻操作。源码或手工步骤替代须明确接受。
- 新增双语 `references/automatic-html.md` 和 `scripts/report-binding.test.mjs`；同步运行文件、元数据、交互报告、本地执行、质量及状态文档。
- 随包构建器原已支持包内相对路径绑定，此次明确强制执行并补回归测试；不声称新增了浏览器驱动器或改造媒体算法。

## 安装与迁移

1. 将完整 `shot-by-shot-study/` 目录安装到用户 Skill 目录。新标识会被识别为新的 Skill；若旧版 `video-shot-interactive-report` 已安装，备份后在应用中停用旧版，避免重复触发。本压缩包不会自动删除或替换旧版。
2. macOS 用户 Skill 目录通常为 `~/Movies/Hub/skills/`；其他系统使用应用实际支持的位置。
3. 重新打开应用或建立新会话以重新发现 Skill。此次修改文件包不代表已经替换本机安装或重载。
4. 运行以下程序测试，再用真实短视频核对新流程。Node.js 18+、媒体处理工具、浏览器和中文字体取决于获准运行环境，不随包安装。

```bash
node --test scripts/canvas-plan.test.mjs scripts/serve-report.test.mjs scripts/compose-sync-video.test.mjs scripts/report-binding.test.mjs
```

本次程序测试结果：**17 项通过，0 项失败**（原有 13 项＋新增素材绑定与输入约束 4 项）。已在新版候选包解压目录执行上述命令；程序测试输出无跳过项。

新增测试检查渲染 HTML 的预绑定视频地址、机器路径覆盖、相对帧引用及拒绝未测量输入；不解码媒体、不运行浏览器、不证明真实视觉或交互效果。两组上游完整自测、宿主选择卡和完整媒体端到端验收本次未执行，不沿用旧版结果冒充本次通过。

## 回归与触发示例

应触发：
- “分析这段视频，先出同步学习 MP4，完成后再问我要不要 HTML。”
- “用已完成的拉片数据制作能点击跳转的交互报告。”
- “Analyze this clip and create a synchronized shot-study report.”

不应触发：
- “把视频压缩到 10MB。”
- “根据图片生成追车视频。”
- “Design a static movie poster.”

走查样例：另一条 12 秒竖屏烘焙视频，先建立实测台账与帧，再验收同步 MP4；用户选择需要后直接关联原片生成 HTML、自动打开并验证；只有联系表时补独立帧；浏览器受阻时保留文件和明确未验状态。此走查是逻辑检查，不是媒体实测。

## English summary

Version 1.1.3 preserves the MP4-first choice gate and makes accepted HTML production an automatic completion contract: create real files, bind known original media and frames, start and open an authorized preview, verify interactions, and deliver a complete bundle plus a real entry. Manual copying, saving, picking the known video or extracting frames is not the default user task. Capability blockers require evidence; source-only handoff requires explicit acceptance. Existing relative-path binding is retained and covered by new structural tests. Packaging does not install or reload the Skill, and program tests do not establish real browser or media acceptance.
