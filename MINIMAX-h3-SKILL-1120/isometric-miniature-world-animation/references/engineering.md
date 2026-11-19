# 工程、投影与导出

## 真等轴投影

Three.js 使用 Y 向上。相机位于目标的 `(1,1,1)` 方向，保持固定朝向：

```js
const direction = new THREE.Vector3(1, 1, 1).normalize();
const right = new THREE.Vector3(1, 0, -1).normalize();
const up = new THREE.Vector3(-1, 2, -1).normalize();
const camera = new THREE.OrthographicCamera(
  -viewHeight * width / height / 2, viewHeight * width / height / 2,
  viewHeight / 2, -viewHeight / 2, 0.1, 400
);
function poseCamera(sx, sy, zoom) {
  const target = right.clone().multiplyScalar(sx).addScaledVector(up, sy);
  camera.position.copy(target).addScaledVector(direction, 120);
  camera.up.set(0, 1, 0);
  camera.lookAt(target);
  camera.zoom = zoom;
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
}
```

这里120是可调整的裁剪/视距参数，不控制物体在屏幕上的远近大小。正交回拉减小 zoom 或扩大视域。平移时只改相机位置、不平移 lookAt 目标会旋转视线，不能这样实现滑轨。

采用上述基向量时，对相对目标的世界位置 `p=(x,y,z)`：

```text
screenX = cx + pixelsPerUnit * (x - z) / sqrt(2)
screenY = cy + pixelsPerUnit * (x + z - 2*y) / sqrt(6)
pixelsPerUnit = height / viewHeight * zoom
```

地面 x/z 轴斜率绝对值为 `1/sqrt(3)`，即30°。三个世界单位轴的投影长度均为 `pixelsPerUnit*sqrt(2/3)`；沿观察方向平移不改变尺寸。这些是可以数值核验的投影条件，不依赖主观判断。

## 组件生长与动线

将墙体/柜体几何底面移到局部 y=0，或放在以底面为原点的父组，再设 `scale.y=g(t)`。顶盖位置从当前顶部高度计算，既要延迟落位也要与生长主体连贯。不要缩放整个父组导致树、标签、阴影同时被压扁。

车辆/数据包沿世界路径求位置和切向朝向；机械匀速与转弯减速按语义选择。每个对象有稳定 ID、几何参数、出生时刻、动作曲线和文字锚点。随机布局在初始化用固定种子生成，renderAt 中不消耗持续的随机状态。

装饰层可按前景/城市/背景速度分别移动，连线、标牌和影子跟随所属空间。真实依附在同一个机柜的元素不得分到不同视差组。

## 文字与遮挡

优先将场景内文字作为实际表面纹理，让深度缓冲处理遮挡。DOM 标注需每帧用世界锚点 `getWorldPosition()` 和相机 `project()` 求屏幕坐标，不能固定为初始像素。

等轴牌面的 CSS matrix 应由面上两个基向量的投影推导，或复用并核验 `ui.js` 的 SSR 变换。CSS 变换顺序会影响结果，不能只按名字拼 rotate/skew/scale。比较牌面四角和世界锚点再判断是否对齐。

DOM 不参与 WebGL 深度测试。用避让、可见性查询或显式遮挡处理解决引线穿楼，不把 z-index 按屏幕 y 排序视为通用3D遮挡。较长正文采用平排，必要时使用底色与引线区分场景。

渲染前检查实际字体加载状态与目标字形；几何字形额外检查字符覆盖和字体轮廓解析。emoji、组合字符或复杂文字塑形优先交给 Canvas/DOM；原 `text[i]` 逐 UTF-16 码元取字不是通用排字引擎。

## 作品工程约定

建议结构：`index.html`、`js/`、`assets/fonts/`、`brief.json`、`cues.json`、`treatment.md`、`CREDITS.md`、`package.json` 与锁文件、`out/video.mp4`。按需要添加本项目 renderer 或使用平台正式导出；不强迫平台识别此目录。

```js
window.DEMO = { width, height, fps, duration };
window.renderAt = async function (t) {
  // Assign complete object/camera/text state from t, then render.
};
// Only after imports, resources, fonts and a successful first render:
window.__ready = true;
```

预览的播放/暂停/拖动控件只提供时间，不能维护另一套动画逻辑。await 每次 renderAt 后再截图。读不到资源或编译失败时暴露明确错误并终止该次输出，不无限等 ready。

原始10秒×30fps为300帧，采样 `t=n/fps, n=0…299`。非整数 `duration*fps` 先明确取整规则并报告实际时长。帧尾采样不包含重复的 t=duration。运动模糊子采样可能访问帧前后时间，应按剧情边界处理并完整重置状态。

## 分辨率与渲染质量

先用少量样本/低分辨率检查动作，再提高正式采样。原 `render.js` 有多子采样 AO/软阴影/运动模糊，`main.js` 默认 SPP=16；外层 harness 再开 --mb 会重复多重采样，先确定一处负责时间模糊。

GPU 不支持浮点累积时，保留正交投影、抗锯齿、接触阴影和文字清晰度，用受支持的后处理替代并说明差异；不能静默输出黑帧，也不为了硬跑原脚本修改用户的安全配置。

改变画幅时检查 `index.html` 舞台/canvas、renderer setSize、render target、相机 aspect、标签 NDC→像素、shader 的 1.7778、云和标题以960/540为中心的坐标、像素到世界单位换算。竖版重排内容，不拉伸输出。改变 fps 时检查 shader 中写死的30、帧延迟与子采样时间。

## 声音与依赖

默认普通有声片使用音乐加音效，无旁白。原 `audio.py` 从两级上方的 `lib/audio` 导入 mgaudio，并使用 marimba/glock 等采样；本技能未附带这些库和采样。

可选择：

1. 当前环境已有可用且许可明确的上游完整音频库时，复制需要的模块/采样并记录来源；先验证 import 和短音频输出。
2. 用当前可用的 Python/音频工具生成原创拨弦、木琴近似和触发音，沿用本片事件表；合成音不宣称为原采样复刻。
3. 使用用户音乐或平台实际提供的声音能力，分析实际音频长度/节奏，剪辑并对齐音效。用户指定音乐优先。

原 requirements 包含其他风格的图像处理依赖，不应为了本片全量安装。保留音乐、音效、旁白分轨；静音时不执行作曲。重新定时后同步调整声音，不机械拉伸包含旁白的母带。生成能力不可用时说明具体缺失，不自动改为静音并宣称完成有声需求。

## 运行原 harness 的条件

以下命令仅用于**已复制成独立项目、依赖与字体已修复、且宿主允许直接启动独立浏览器**的环境。从项目根运行，不能直接运行技能 vendor 目录并输出到其中。

```sh
# CHROME_PATH 由当前运行环境实际发现；不是固定的 macOS 路径
MG_CHROME="$CHROME_PATH" node harness/render.mjs demos/03-isometric --stills 0.5,2.5,5,6.8,9.5 --query spp=2 --scale 0.5
MG_CHROME="$CHROME_PATH" node harness/render.mjs demos/03-isometric --noaudio --out out/visual.mp4
```

第二条先输出纯画面，`out` 目录需预先存在；正式合成再接本项目实际音轨。`--query spp=2` 仅是低质量预览例子，不作为最终默认参数。上游 harness 原始 Linux 启动参数包含 `--no-sandbox`，在项目副本中按当前宿主支持的安全启动参数调整，不能照搬来绕过约束。宿主只允许专用浏览器工具时使用其受支持导出方法，不额外启动 Puppeteer。

原 harness 依赖 ROOT 相对布局、Chrome、FFmpeg 和 puppeteer-core。原 preview 需 HTTP 服务和对应目录，直接双击 HTML 不等于播放工程。准备作品副本时还应核对本机回环服务的目录边界、资源错误、超时与清理；未能运行不能说已复现成片。
