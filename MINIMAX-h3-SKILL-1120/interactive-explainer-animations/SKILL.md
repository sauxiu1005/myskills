---
name: interactive-explainer-animations
description: 将机器、产品和系统原理制作成可交互图解、三维拆解与动画演示，适用于技术科普和产品结构讲解，交付离线页面、源码及可选演示视频；不用于工程CAD。
license: MIT
---

# 原理交互演示动画

把原理变成可操作的实体机构。图中的运动、显示数值和说明来自同一个状态模型。SVG 模式使用随包 Anatomy 绘图库，进阶实物三维使用随包 ISO-GLOW 模板；不将技术图重画成 AI 位图。原作者、固定版本和改动见 [provenance](references/provenance.md)。

## 实物研究入口

支持以下指令（将 `[object]` 替换为对象名称，最好带品牌、型号与版本）：

> Use Anatomy to research [object] from real sources: true dimensions, part list, teardown order

收到这条指令，或用户要求实物考据、真实尺寸、零件清单、拆解顺序时，先读 [实物研究](references/object-research.md)，查阅真实来源并交付带逐项依据的尺寸表、零件表和拆解依赖顺序。英文指令本身不等于选择英文输出。只有任务范围明确为仅研究时，报告沿用用户明确语言或当前对话语言，不初始化绘图库、不默认制作 HTML/视频，也不弹作品语言卡。用户同时要求图解或视频时，研究结果作为下列制作流程的输入；先核实资料再绘制，不把示意模型写成实测结构。

## 进阶：Anatomy × ISO-GLOW 实物三维

用户要求帖子中的进阶玩法、ISO-GLOW、自由旋转实物、爆炸拆解或剖切时，读取 [进阶三维制作](references/iso-glow-3d.md)。先研究，再以真实尺度建立可旋转 Three.js 场景，提供分总成拆解、维修手册式标签、剖切和与机构联动的控件。需要光路等流动时按有依据的模型计算。

示例指令（保留研究入口，追加制作目标）：

> Use Anatomy to research [object] from real sources: true dimensions, part list, teardown order. Create an ISO-GLOW Three.js explainer with orbit controls, assembly-by-assembly explosion, a labelled section view and functional controls. Deliver the interactive HTML and an MP4 demonstration in English.

此完整指令进入制作流程；研究只是阶段，不能以 `research.md` 和 `facts.json` 代替 HTML 与已要求的 MP4。沿用前文已确认的产物及语言要求。此分支替代下文 SVG 的初始化、绘制和 SVG 专用审计，仍遵循语言选择、来源核实、Design 交付与实际验收。它与 [beta SVG 三维](references/3d.md) 是不同实现，不混称、不混用验证结果。

## 1. 明确目标并初始化

沿用用户已给定的主题、参数、交互和交付格式。首次制作前按 [语言选项卡](references/language-choice.md) 确定统一输出语言：**中文 / English / 其他**。已有明确的项目语言选择直接沿用；否则显示单选卡，等用户提交后再制作带文字的 HTML、SVG 与视频。“其他”需补充具体语言。不能用对话语言、预选项或超时替代选择。仅修改 skill 时不触发作品语言卡。默认浅色、独立离线 HTML，加 SVG 静态图与源码；只在用户需要时扩展 React、WebGL、三维或视频。复杂项目先做能解释核心机制的工作版本，再深化细节；不机械承诺固定工时。

从实际加载位置确定 skill 根目录，在当前项目下创建新工作目录。不要写入安装版 examples，不假设桌面路径在云端可见。

```sh
node /actual/skill/scripts/design-init.mjs /actual/project/anatomy-work
```

脚本复制离线 kit、必要构建脚本和最小参考示例，写入环境报告与工作记录模板。Node 20.10+，建议22+；普通构建无需 npm。检查当前环境真正提供的文件、执行、浏览器、画布工具。按 [预览与交付](references/design-adapter.md) 处理预览和交付；只有真实运行成功才记录 verified。

## 2. 原理、机构与零件

先读取 [craft](references/craft.md) 和最接近的 example（最小 `examples/dial-indicator/build.mjs`）。按需查 [kit API](references/kit.md)，不要猜 API 参数。

1. 写 brief：要解释什么、关键数值/单位、输入、状态、边界、误解风险。用户给定参数是设计条件；涉及具体实物时按 [实物研究](references/object-research.md) 核实型号、尺寸与机构依据，推断标明示意。
2. 用一句话说清“什么部件移动，对应什么状态变化”。选择真实可辨识的工具、仪器或机器作为隐喻，避免浮动方块堆叠。
3. 写按基础/支撑/机构/控制分组的零件清单。小图通常40–80个有用细部，大图按真实结构扩展；不要用无意义装饰凑数。脚垫、螺钉、倒角、轴套、刻度、端止和连接件应各有用途。
4. 将逻辑放入纯模型模块，写有意义的边界断言。动画只是状态的表现：例如令牌不足不能放行，补充不能超过容量；复位恢复初态。不要从 DOM 文案反推模型状态。

## 3. 构图、绘制与交互

在工作目录编写新 `build.mjs` 和 `model.mjs`，用 `kit/iso-kit.mjs` 与 `scripts/inline-kit.mjs` 构建。示例只能参考，不能作为新作品直接交付。

- 采用x/y地面、z向上坐标；默认方位45°、仰角30°，按机构可读性调整；用 `fitProjection` 适配卡片。
- 静态几何只构建一次，移动件优先 `translateAlong`，变形部分才逐帧重建。底座/支撑/主体采用 lo/mid/hi，保留一个 lit 强调色；顶面更亮，侧面有体积。
- 按真实深度从后到前绘制；包围部件的框/弹簧分前后层。管线或复杂圆件用真实几何记录到 audit，不能用替代包围形状骗过检查。
- 卡片四角放图号、标题、操作提示、实时读数；图外放图例和简短说明。图内避免悬浮文字和引线，保留 Anatomy 的雕刻标签式风格；用户明确要求标注时以可读性为准。
- 指针、点击和键盘均能操作；焦点可见、按钮有可读名称、状态用 aria 表达。运动基于时间，平滑且安静；离屏停止循环、恢复时限制dt；减少动态效果模式仍能操作并即时显示状态。见 [motion](references/motion.md)。
- 输出真正独立离线HTML，不引用安装目录、CDN或绝对文件路径。静态SVG嵌入样式；保存完整可重建的kit及源码。

可选分支：火焰/水/光等读 [webgl](references/webgl.md)，共用等轴测相机、背SVG→canvas→前SVG，并保留无WebGL回退。SVG 几何重投影的三维运动读 [3d](references/3d.md)，注明beta并运行专用审计；实物自由观察与拆解走 [ISO-GLOW 分支](references/iso-glow-3d.md)；不要声称普通SVG平移等于可旋转三维。React输出读 [react](references/react.md)。

## 4. 实测与修复

按 [verify](references/verify.md) 的工具用法，先运行 `--help` 了解参数。遵守宿主的浏览器控制规则；若只能使用平台浏览器，则通过该工具操作并保存证据，不绕过权限。脚本能运行时：

```sh
node scripts/capture.mjs index.html --out qa/desktop.png
node scripts/capture.mjs index.html --width 390 --height 844 --reduced --out qa/mobile.png
node scripts/drive.mjs index.html --actions qa/actions.json
node scripts/lines.mjs index.html --out qa/line-ends.png
```

按 [语言选项卡](references/language-choice.md) 核对 HTML、SVG、视频与字幕均使用同一项目语言，检查实际字体、换行和阅读方向。检查初态、交互后、边界、复位；数值与机构同一时刻一致。每项实际断言记录预期、实测、通过/失败/未测。必须检查控制台错误和横向溢出，亲自查看真实桌面/手机截图、关键运动帧和4倍接合处细节。生成截图不等于已查看。声称手机布局通过前须确认实际视口尺寸。

有复杂管线/圆件时接入几何审计；只有当前作品实际支持并运行的审计才能写通过。线端检测异常逐个检查，不能通过批量 `data-free` 隐藏缺陷。双主题仅在交付双主题时均检查。WebGL额外查无WebGL回退、减弱动画和过渡接缝；3D额外查 orbit/fidelity/order/pops/perf，快检不替代完整验证。

修复观察到的问题并重跑受影响项。一次工具失败最多两次有明确改动的重试；不可修复时保留可用产物，精确记录限制，不把未执行当作通过。

## 5. 制作演示视频（用户要求视频时）

读取 [演示视频制作](references/demo-video.md)。在已验证图解上编排“初态→操作→状态变化→边界→复位”，沿用同一纯模型与机构几何，字幕随状态同步。未指定时采用约20–40秒、1920×1080、30fps、所选语言字幕、无旁白；不要把整幅静态图平移缩放当作机构演示。

Three.js 作品按 [进阶三维的视频路径](references/iso-glow-3d.md#视频与交付) 捕获真实场景，并将标签和字幕一并合成；SVG→Sharp 脚本不能渲染 Three.js。优先使用平台获准的真实交互录制；也可按离线SVG场景适配器逐帧渲染，用随包 `scripts/render-video.mjs` 编码MP4。两种方法必须如实标明，离线渲染不能冒充浏览器录屏。视频不替代网页交互验收。渲染回调计数不等于编码帧数。生成关键帧，复核状态数值与遮挡，实际检查视频时长、帧率、分辨率、解码及动态变化，然后通过Design画布的视频资源流程交付MP4；工具不支持则交付本地成片，明确限制。

## 6. 项目交付

按 [预览与交付](references/design-adapter.md) 将真实截图与作品入口放回画布，并在可执行HTML的预览中打开作品。实际点击至少一个控制，核对读数变化，再复位。普通附件或截图不是交互式预览。

涉及实物研究时一并交付 `research.md` 与 `facts.json`，HTML/SVG和视频的相关标签、尺寸与拆解动作可追溯到其中的事实ID。SVG 分支交付 `index.html`、带样式SVG、源码/kit；Three.js 分支交付 `index.html`、场景及状态源码、随附依赖和许可证，不强造完整矢量 SVG。两者均交付模型与来源说明、检查记录及截图、LICENSE，打包ZIP并验证解压后可重建。制作视频时还交付MP4、字幕/时间表、可重渲染场景源码、关键帧及视频验收记录。在支持的环境打开成片验证播放，区分本地与平台检查、协作辅助试跑与无人干预试跑。只汇报测试过的能力，不把SVG案例推广为已验证WebGL或3D。默认不公开发布、不调用付费生图/视频服务。用户已授权的制作、预览和例行修复持续完成，无需逐阶段再确认。
