# 来源与适配说明

- 技能名称：editable-product-motion-films
- 适配版作者：MiniMax Design
- 适配版版本：1.0.4
- 适配日期：2026-10-19
- 上游：[alchaincyf/huashu-motion](https://github.com/alchaincyf/huashu-motion)
- 固定提交：`3e927801e78b587878fb7dbb65d616326df00c21`
- 上游包版本：0.1.0
- 上游原作者：Huashu；原项目MIT版权声明保留在。适配版作者署名不覆盖上游版权。

## 保留的能力

随包 `vendor/motion/` 包含上游 cli、runtime、studio、templates、字体索引与许可、package.json 及许可证，不依赖外部 checkout。未附带整个演示作品库、站点与测试目录。引擎按上述提交保存，文件校验见 [vendor-manifest.json](vendor-manifest.json)；未把它改称 Design 原生渲染器。`om demo` 因未含 showcase 不适用。CLI `version` 返回的是引擎0.1.0，技能版本以 meta.yaml 为准。

保留动作语言库、配色与节奏方法、UI连续性、ABC记谱、Canvas/GSAP契约。重写入口、导演流程、制作与交付、反馈验收及项目经验规则。技术文档里的 `om` 指本包 scripts/om.mjs。新增入口取消原 bin/om 的 npm 回退，避免失去固定版本或隐式联网。

1.0.4 制作与交付：新增 `scripts/setup-tools.mjs`（查找并链接 ffmpeg/ffprobe/浏览器，不下载）与 `scripts/bundle-preview.mjs`（单文件可播放预览与源码包）；`scripts/om.mjs` 自动把作品目录下 `.tools/bin` 加入 PATH；按 Design 作品目录/资源/版本组织交付；确认点改为规格、方向、代表段、成片四处；新增 `scripts/open-project.mjs`，把随包 Studio 作为本机可编辑工程入口在后台启动、复用并按项目根目录验证；取消对自身成片的验收式审片，内容质量以用户反馈为准；补齐 SKILL.cn.md 与市场元数据。当时 vendor 目录未改动；当前轻量版的修改见下。

Design 特有改动：能力发现与真实资源记录；平台方向卡；项目内素材；本地/平台/已有音乐分流；项目预览定点反馈映射；正式上传/导出与项目预览实播；失败有限恢复；分开报告源码、媒体、剪辑器及项目预览状态。将原本强制 Studio 常驻和全局经验收集改为可选、项目内记录。

上游参考提到的其他技能和艺术风格只作为方法出处，不是本包隐式依赖。需要专门建模、人物或生图能力时先查看当前环境；不存在就不要声称已调用。上游历史效果数字和偏好不视为本适配独立测量结果。

## 许可证与素材

[第三方说明](../vendor/motion/THIRD_PARTY.md) 与原文件共同保留。GSAP 使用其自己的许可；字体使用 SIL OFL，相关版权随字体附带。项目分发时复制实际用到的许可证。

“豆子花叔”是上游作者的专属形象，不属于通用MIT授权，随引擎保留仅为原始演示/兼容性；不得在用户新宣传片中使用或声称已获商用授权。角色片使用用户授权或原创资产。可选音色采样与语音模型没有打入包；下载后仍遵守其各自许可。

## 验证边界

本包的本地验证与媒体烟测见交付时附带的QA报告。除非有当前版本真实导入、资源节点与播放操作证据，不能称为已经在 Design 完整运行。源代码结构和引擎烟测不等于陌生题目的独立审片或平台验收。

## 1.0.1 fontless distribution / 无内置字体发行版

本次版本依据包内 meta.yaml 的 1.0.0 升级至 1.0.1；上述 1.0.4 为原包历史适配记录。移除全部 44 个 WOFF 副本（42 个唯一文件），改用固定上游提交的按需下载、SHA-256 校验和外置缓存。修改 CLI 新建、字体添加、HTML 分享导出和 blank 模板复制声明；许可证保留。首次获取需联网，成品仍自包含。vendor-manifest.json 记录当前修改后的文件哈希，commit 表示上游基线，不再表示逐字未修改。详见 font-delivery.md。
