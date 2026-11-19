# 原案例源码地图

以下链接均指向随包未经修改的参考文件。读代码时以实现为准，注释、原提示词与当前实现偶有差异。

## 11 个文件分别做什么

| 文件 | 机制 | 改编时的着力点 |
| --- | --- | --- |
| [index.html](../vendor/mg-styles-15/demos/03-isometric/index.html) | 固定大小舞台、WebGL canvas、DOM UI 层、importmap | 改尺寸和路径，加入本项目字体与配置；原页面不是播放控制器 |
| [cues.json](../vendor/mg-styles-15/demos/03-isometric/cues.json) | 地块、建筑、交通、脉冲、数据牌、标题的共享事件时间 | 为本片重新安排；不要只改 duration，声音与所有硬编码时刻也要调整 |
| [js/anim.js](../vendor/mg-styles-15/demos/03-isometric/js/anim.js) | 纯时间缓动、阻尼弹簧、落地回弹、种子随机、关键帧插值 | 最易独立复用；随机数只用于初始化或按帧重新固定种子 |
| [js/world.js](../vendor/mg-styles-15/demos/03-isometric/js/world.js) | 12×12 城市地图、材料、光照、正交相机、建筑生长、交通与脉冲 | 保留空间/时间结构；办公室与机房应重写场景工厂和流线 |
| [js/main.js](../vendor/mg-styles-15/demos/03-isometric/js/main.js) | 字体等待、Hermite 运镜、场景/标题/标签装配、renderAt、ready | 配置入口与最终编排；改文案、标签数据、相机路径、画幅 |
| [js/render.js](../vendor/mg-styles-15/demos/03-isometric/js/render.js) | Accumulator：多次采样、软阴影、法线深度 AO、bloom、色调与抖动 | 验证当前 GPU 的浮点 render target/blend 能力；采样数按性能调整 |
| [js/title.js](../vendor/mg-styles-15/demos/03-isometric/js/title.js) | 默认原片：挤出的 ISOPOLIS 字母落到地面，Canvas 副题贴花 | 文案、字体路径与面朝向；中文长句用贴花或 DOM，不强制挤出 |
| [js/ui.js](../vendor/mg-styles-15/demos/03-isometric/js/ui.js) | 世界锚点→屏幕，引线、SSR 等轴牌、数字和小柱图 | 重测换文案后的空间；替换 unsafe 字符串插值；处理遮挡和屏幕尺寸 |
| [js/title5.js](../vendor/mg-styles-15/demos/03-isometric/js/title5.js) | 合集 v5 专用：“等轴 2.5D”立体字与充当小数点的球 | 字符列表、球轨迹与城市塔楼强耦合；不是任意中文标题 API |
| [js/night5.js](../vendor/mg-styles-15/demos/03-isometric/js/night5.js) | v5 夜景调色、月光、琥珀窗灯、路灯、辉光 | 夜景需要时参考；随新世界修改对象绑定，不直接假设存在 core |
| [audio.py](../vendor/mg-styles-15/demos/03-isometric/audio.py) | D 大调、120 BPM、10 秒编曲；从 cues 读取落点，音乐/音效分轨 | `mgaudio` 与采样是包外依赖；时长、和声段、音效时刻都需适配 |

## 精确定位

`world.js` 搜索：`PAL`（颜色）、`MAP`（布局）、`buildWorld`、`OrthographicCamera`、`growState`、`building`、`DOWNTOWN`、`HOUSES`、`MONORAIL`、`CARS`、`HERO PULSE`、`DATA ARCS`、`DRONES`、`setCamera`、`update`。

核心返回结构包含 `scene/camera/update/onUpdate/byId/island/bgGroup/fg`。可以沿用注册 update 回调的组织方式，但每个回调应从绝对时间设置完整状态，不能只在跨过事件时执行一次。

`main.js` 搜索：`CAM`（Hermite 平移/zoom）、`buildTitle`（原字标）、`buildTags`（能源/通勤/吞吐量的案例数据）、`SPP`（默认16子采样）、`V5/NIGHT`（变体）、`window.renderAt`（最终渲染）。`?v5=1` 同时选择合集标题与夜景，`?v5=1&day5=1` 为合集日景；默认无参数才是原 ISOPOLIS 日景路线。

`night5.js` 文件头称默认路线不 import，但 `main.js` 实际有静态 import，只是不调用 `applyNight`。因此即使关闭夜景，也不能在不改 import 的情况下删掉模块。

## 提示词和实现的差别

- 提示词写屋顶滞后 2–3 帧；当前 `cues.roof_lag` 是 0.375 秒，30fps 下约 11.25 帧。这是不同编排参数，不是单位换算相同。新片依可见生长过程决定实际延迟。
- 提示词写 0–2/2–5/5–8/8–10 秒；代码的车辆 4.625 秒、列车 4.875 秒已启动，脉冲为6秒，回拉为7.75–8.75秒，落版为9秒。
- 视差以城市0.8为参考：前景相对速度1.25倍、背景0.75倍，代码通过分组偏移实现1:0.8:0.6的视觉比例。不是任意物体按深度自然变化。
- `ui.js` 的 y 排序只排序 DOM 标签，不会使标签自动被 WebGL 建筑遮挡。原片有针对桅杆的 `gap` 断线；换场景必须重新计算遮挡或让标签避开主体。
- 原 `title.js` 用拉丁字体轮廓；简单把 `ISOPOLIS` 字符串改成中文会缺字。需要实际覆盖中文的字体，或 Canvas 文字纹理路线。

## 依赖与路径修复

原页面使用站点根路径 `/assets/...`、`/node_modules/...`、`/demos/03-isometric/...`。保留仓库式目录时从复制出的项目根服务；重组工程时改成可移植相对路径/importmap，不要从安装目录或其他用户工程引用资源。

原片所需 npm 直接依赖是 `three` 与 `opentype.js`；原 harness 另需 `puppeteer-core`。上游声明分别为 0.186.1、2.0.0、25.12.0；它们只是快照值，先核实目标环境/仓库可用性，生成本项目 lockfile。不要为了这支片安装全套其他风格依赖，也不要静默升级后把兼容性当作通过。

字体 CSS 使用 HarmonyOS Sans SC、JetBrains Mono、Unbounded 等；默认几何标题读取 `demos/03-isometric/assets/fonts/Unbounded-800-static.ttf`，v5 另读阿里妈妈数黑体。字体文件没有随包附带。按用户字体或合法可用替代重做加载、测量和排版，记录与原片差异；`document.fonts.ready` 不能单独证明没有 fallback。

## 两种改编规模

**原片风格的小城市**：复制所需参考文件到新工程，补齐/替换字体，迁移路径和用户变量，修改 MAP、建筑组成、事件表、字标与数据牌，再检查所有依赖引用。

**办公室、机房或大幅不同创意**：复用 anim、正交相机和必要渲染机制，写新的 `buildWorld` 与对象 IDs；重新布置机柜/家具、连接路径、文字锚点和声音。不要带入城市独有的树、车辆、塔楼耦合及合集小数点剧情。

所有变化都在作品副本进行，`vendor` 保持可审计的原文。使用上游代码的交付工程保留 LICENSE，并把新增外部资产的许可单独列出。
