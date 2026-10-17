# 来源与适配范围

上游：https://github.com/wheresryan22/anatomy
固定提交：e6600ffc4e8e6620eeb45bf49bcdbd5e4b84163f
获取日期：2026-10-14。原作者 Ryan，MIT 许可证随包保留。

保留上游 kit、八组 examples、技术 references 与构建/验证工具。移除社区发布工具与维护测试；不要求嵌套安装。
适配新增：Design 工作流入口、中英市场元数据、项目初始化/预检、Design 预览说明与分层验证记录。
示例是上游作品，不能冒充当前用户任务的新作品。原 Anatomy SVG 三维重投影是上游 beta 功能，WebGL/3D 必须单独实测才能声称在当前平台可用。

1.1.0新增：演示视频流程、离线SVG场景到H.264的渲染脚本、视频与实际交互验收分离。

1.2.0新增：中文 / English / 其他语言选项卡，HTML与视频统一文案。
1.3.0新增：真实来源实物研究入口，尺寸/零件/拆解依赖及逐项证据记录；保留仅研究范围。

1.4.0新增：Anatomy × ISO-GLOW Three.js 实物拆解分支、分支初始化、来源与尺度映射、剖切/标注/工作控件和同场景 MP4 路径。原 SVG、语言选择与研究流程保留。

ISO-GLOW 官方站：https://isoglow.dev/
启发帖子：https://x.com/Aprilzz423/status/2109657322587128299
作者步骤：https://x.com/Aprilzz423/status/2109658701028380909
模板获取：https://iso-glow.vercel.app/iso-glow.tar.gz （官方页面的安装地址）
获取日期：2026-10-15；未标版本的快照，压缩包 SHA256：`9fbf83bbe96df0e1a4f24694be6401d6a733d861610ff8974ac65af7409b4e08`。
随包保留官方 gallery-3d.html、lens-camera-3d.js 和 MIT LICENSE，逐文件校验见 `vendor/iso-glow/source-manifest.json`。作者为 April Zhu 与 Tolga Cohce。未复制上游 skill 路由；Design 适配由本包 references/iso-glow-3d.md 定义。
上游模板固定 Three.js 0.160.0 的 CDN 引用；Three.js 运行库不内置在 skill 内，作品构建时需要按离线要求打包并保留其许可证。相机参考源代码的尺寸/光学注释不是独立的事实验证。
本次新增流程与包结构校验不等于实际完成 Three.js 作品或 MP4；具体项目仍须单独执行验收。

1.5.0：显示名称更新为“原理交互演示动画 / Interactive Explainer Animations”，技能标识为 interactive-explainer-animations。发布者元数据为 MiniMax Design；原始 Anatomy / ISO-GLOW 的版权、MIT 许可证和来源记录保留。新增全英文 SKILL.md 与对应中文 SKILL.cn.md，内容能力和 Design 适配流程保留。
