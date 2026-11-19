# 来源与改造边界

参考项目：[gnipbao/story-to-handdrawn-video](https://github.com/gnipbao/story-to-handdrawn-video)。参考版本为 `fbab5b27f4f0db61739d86f78000a39eeaa692d3`，读取日期2026-09-20。

继承：原项目的中文故事逐句组织、有序图片、彩铅日记默认风格、20种风格配方与示例、保留画面边缘、准确文字、线稿到彩色揭示、可选翻书与静音画面轨；本技能在此基础上扩展为多语言故事。

重写：执行方式改为Design能力发现、资产与节点管理、当前视频能力的动态片段及合成；尺寸改为自定义比例/像素；增加图片1K/2K和视频768P/2K独立选项卡与等待逻辑；新增多语言识别、书写方向、字体字符覆盖、复杂文字塑形、语言感知断行与阅读时长规则。未包含或调用原仓库Remotion渲染器，也不沿用固定1080×1440正式版、720×960预览版的限制。

本包的 `handdrawn-style-library.json`、`target-diary-style.txt`、风格板、`style-examples/` 和上游许可证按参考版本保留。配方里的路径从本技能包根目录解析；不需要外部渲染项目。若配方含上游执行说明，以本技能的 Design 当前能力流程为准。图片只能证明风格外观，不证明当前用户已经批准。

原项目MIT许可全文见 [upstream-LICENSE.txt](upstream-LICENSE.txt)。上游引入的风格配方署名与许可见 [handdrawn-styles-LICENSE.txt](handdrawn-styles-LICENSE.txt)。分发这些资源时保留两份许可证。

本包是Agent技能指令与参考资源，不内置Design连接器，不保证所有Design部署的技能导入格式一致。结构校验不等于真实 Design 导入或视频生成验收；模型能力和清晰度需运行时核实。创建此技能无需生成示例媒体。
