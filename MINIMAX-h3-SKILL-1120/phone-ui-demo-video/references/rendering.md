# 时间轴与自动导出

## 工程契约

`film.html?export=1` 暴露以下本包自定义接口（不是平台 API）：

```js
window.PHONE_FILM = {
  width: 1920, height: 1080, fps: 30, duration: 30,
  shots: [{start: 0, duration: 6, title: '锁屏通知'}],
  audioEvents: [{time: 1.2, type: 'ding', gain: 0.24}]
};
window.renderAt = async seconds => { /* 由绝对时间绘制完整状态 */ };
window.__PHONE_READY__ = true;
```

时间单位为秒；镜头占 `[start, start+duration)`。尺寸为偶数正整数，帧率和时长为正。总帧数 `max(1, ceil(duration*fps - 1e-7))`（消除接近整数的浮点累加误差），第 n 帧采样 `n/fps`，不额外输出 duration 位置的重复尾帧。收尾定格写入分镜，最后采样点也须体面。

`renderAt(t)` 支持任意次序与重复调用，显隐、文字数量、数字、壁纸、手机姿态、相机、反光都从 t 推导。不靠上次 DOM 状态或一次性 cue，不依赖真实 Date、Math.random、setTimeout 或自由运行 CSS animation/transition；需要随机时固定种子。WAAPI 如使用则暂停，并在每次求值时设置 currentTime。上游性能时钟覆写没有控制所有 CSS 转场，不能仅靠它实现确定性导出。

等待 `document.fonts.ready` 和图像 decode；新增视频素材时等待 seeked 与实际视频帧并避免重复混入原声。模板未内置视频素材支持，扩展后需专门验证。正式跨机器交付可在 assets/fonts 放许可允许的字体和 @font-face；字体不随系统保证一致，导出前检查目标语言字符。

`index.html` 总览链接到 `film.html?shot=N`。单页面连续播放，不逐镜导航重置音频。export 模式隐藏播放器 UI、停止实时 RAF，仅响应 renderAt，没有用户等待时间进入成片。

## CLI

准备获准使用的 Node、浏览器、ffmpeg/ffprobe 与 puppeteer-core。环境变量：`CHROME_PATH`、`FFMPEG_PATH`、`FFPROBE_PATH`，可选 `PUPPETEER_MODULE`（JS 模块绝对入口）。路径含空格时加 shell 引号。

```sh
node scripts/phone-ui.mjs doctor /actual/project/film
# 初始化仅在 Skill 原包执行：node <skillRoot>/scripts/phone-ui.mjs init /actual/project/film
# 以下命令从作品根目录执行，scripts/ 为作品自带副本
node scripts/phone-ui.mjs preview /actual/project/film
node scripts/phone-ui.mjs stills /actual/project/film
node scripts/phone-ui.mjs export /actual/project/film --out /actual/project/film/out/video-v1.mp4
node scripts/phone-ui.mjs export /actual/project/film --out /actual/project/film/out/silent-v1.mp4 --silent
node scripts/phone-ui.mjs export /actual/project/film --out /actual/project/film/out/mix-v1.mp4 --audio /actual/project/final-mix.wav
node scripts/phone-ui.mjs bundle /actual/project/film --out /actual/project/film/out/preview-v1.html
```

`--scale 0.5` 用于低清测试，报告记录实际尺寸，正式默认 1。画幅变化要改布局与 PHONE_FILM 尺寸，scale 不是画幅设置。输出不覆盖已有目标；失败不留下冒充成片的半截文件，记录 `.failed.json`。关注 progress 与最终报告，不把开始渲染当完成。

## 截图稳定性：编码前保护

1.3.1 的 `export` 与 `stills` 共用 `scripts/frame-capture.mjs`。每个采样时间只调用一次 `renderAt(t)`，保持时间冻结；每次截图前等待两个 requestAnimationFrame 绘制机会。截图解码为 RGBA 像素后比较，同一时间点连续两张图的每个通道差值不超过 2 才采用后一张，允许轻微合成舍入差异。比较不是 PNG 字节哈希，也不是相邻视频帧之间的差异检测，因此不会把正常切镜或黑场当作异常。

每帧至少截图两次，最多五次。像素不一致时只在当前时间点继续截图，不推进时间线，不把可疑图片送给 FFmpeg。五次仍无法取得连续一致截图则终止；不复制前帧、不跳帧、不删除片头、不输出成功成片。异常截图写入 `<video>.frame-diagnostics/`，失败原因和统计写入 `.failed.json`。成功报告增加 `frame_capture`，包含 frames、captures、recoveredFrames 和 mismatches；stills 的统计在 `out/stills/capture-report.json`，诊断在其 `frame-diagnostics/` 子目录。`recoveredFrames` 表示截图重试后稳定，不表示成片后补帧。

这是逐帧编码前的制作保护，覆盖整个时间轴，代价是至少两次截图及像素比较的额外耗时。自定义执行脚本或替代渲染器必须保留等价机制，不能只在文案里要求“检查闪帧”。它检测同一时间点的不稳定输出，不保证识别连续两次完全相同的错误画面，也不能代替确定性时间轴、素材就绪与布局检查。不宣称修复了浏览器底层驱动。更换浏览器环境、渲染实现或涉及复杂合成的样式后，应以连续渲染的前 3 秒验证截图链路，不能仅跳转到单个时间点验证。

## 单文件预览

`bundle` 把 `style.css`、`story.js`、`audio.mjs`、`film.js` 内联进 `film.html`，输出可在项目内直接打开播放的单文件 HTML。本地 CSS `url()`、直接图片、音视频及字体会自动内嵌。新增模块、动态 fetch / Image / Audio / src 赋值、srcset、CSS @import 不属于模板打包器支持范围，须先改为直接内嵌资源；打包器会明确拒绝这些常见不支持形式。复杂自定义工程需要适配自身的打包器，不能用正则扫描保证任意 JS 没有运行时依赖。输出不覆盖已有文件。

## 声音

`audio.mjs` 提供 pop/whoosh/swipe/type/ding/thud 的确定性合成，48kHz 单声道 WAV、AAC 封装。预览与导出共享事件表，音色并非逐采样复制上游。增删动作须同步事件；重叠波形过高时对整段统一缩放，避免逐样本硬截波。

预览默认静音，开启后播放整段合成音效，暂停/跳转重新定位音源。MP4 默认合成事件，不继承预览喇叭状态。`--silent` 无音轨；`--audio` 仅使用母带，两者互斥。无事件时不能宣称有音乐。

外部音乐/旁白先混成 final-mix.wav：记录来源/实测时长，按事件放音效，为对白留空间，检查首尾、削波与指定响度。`--audio` 不叠加随包音效。预览可另行添加母带并用同一绝对时钟；纯音效预览不等于最终混音听审。短音轨补静音、长音轨截断只是时长保险，不能代替创意收尾。默认不生成配乐或 TTS。

## 实现与恢复

本地服务仅开放作品目录，拒绝越界和符号链接逃逸；导出浏览器仅访问该服务与内嵌 data/blob 资源。远程素材先本地化，资源/页面错误会阻止导出。结束时关闭浏览器与服务。

PNG 帧通过管道送入 FFmpeg，不堆积临时帧。音效 WAV 与临时 MP4 在独立临时目录，验证成功才移动到成片路径。H.264/yuv420p、CFR、faststart，有声时 AAC/48kHz；随后 ffprobe 比对尺寸、帧数、帧率、时长和音轨并完整解码。输出 `<video>.render-report.json`：`technical_check` 只表示参数核验通过，`user_review` 保持 pending，画面与听感以用户审阅为准。

平台已有正式渲染器时可接入同一 renderAt 或等价时间轴，不强制安装本包依赖。原生导出失败不能拿网页代替 MP4 完成状态。

## 长任务执行与恢复

优先使用宿主提供的持久任务机制，记录任务标识、输出路径和日志位置，再通过同一任务轮询进度。命令等待超时不等于渲染失败；先检查原任务是否存活、日志帧数是否继续增长和最终报告是否出现。

若宿主超时会终止整个进程组，单纯 `nohup ... &` 不保证子进程存活。仅在环境支持时使用真正脱离命令会话的后台任务，保存 PID、启动时间和日志，且不能保留与短命令会话相连的输入输出管道。不假设所有宿主都支持同一种 shell 或进程脱离方法。

出现 `write EPIPE` 时，结合 FFmpeg 日志、退出码和任务状态定位原因；它不必然表示编码器缺失。确认原渲染进程已经结束后才能重试。按项目交付文档中的重试上限处理，保留失败记录，不重复启动同一成片，不结束其他会话的进程。

技术参考：[Puppeteer 截图](https://pptr.dev/api/puppeteer.page.screenshot)、[字体加载](https://developer.mozilla.org/en-US/docs/Web/API/Document/fonts)、[FFmpeg](https://ffmpeg.org/ffmpeg.html)。

## 增量修改与支持边界

没有部分配置合并 API：直接在原 story.js / HTML / CSS 中修改目标字段，保留其他镜头与自定义设置。init 只用于新工程，已存在路径会拒绝且不覆盖。导出与打包同样不覆盖既有文件。

stills 默认按每镜 25%、60% 与切镜前后采样，并包含末帧；可用 --times 自定义，必须满足 0 ≤ t < duration。第 0 秒为设计的启动黑场，不代表生成失败。

preview 启动常驻 localhost 服务，需用执行环境提供的后台进程机制启动，记录返回 URL 与进程，结束时只关闭本次服务。localhost 不是云端用户可访问的链接。

本 CLI 不支持 --from / --to、变速导出或部分配置合并。导出外部母带时，母带必须从整片 0 秒对齐；预览使用默认合成音效，不自动预览 --audio 的外部母带。需要两者声音一致时须在工程播放器中另行实现最终母带同步，交付时如实标明。
