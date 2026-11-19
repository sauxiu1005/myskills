# 包内依赖

只保留一项生产需要的指南，来源版本、文件哈希和许可证保存在 dependencies/lock.json 与 vendor-manifest.json：

- sweety-image-art-direction：首次生图前读取，后续沿用并编写本图简报；源文件保持不变，以兼容预设手部的审核哈希。

画风全部来自本包自有画风库 assets/custom-styles/；上游 hand-drawn-styles 画风库已整体移除。导演与艺术动效整库、原图像隐私工具链已移除。内容规划使用 references/story-design.md，图像清理直接使用 scripts/clean_image.py。包内资源不是已安装的生图、配音或合成服务；运行能力见 local-runtime.md。上游指南里的交互和供应商建议不接管本技能的直接制作流程。
