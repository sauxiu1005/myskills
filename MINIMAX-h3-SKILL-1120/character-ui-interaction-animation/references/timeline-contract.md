# 时间线契约

`timeline.json` 是工程事实源，HTML、Blender、声音读取同一 `timeline.compiled.json`。`layout.json` 可由其中 layout 字段导出，不维护另一套手填坐标。示例是原创博客动作数据，不含用户素材，不是已制作视频。

## 时间与坐标

- `format.fps`：正整数；`duration_s*fps` 必须为整数帧。
- 内部零基帧：0到N-1；Blender帧=内部帧+1；秒=内部帧/fps。
- `start_frame <= contact_frame <= end_frame`；结束帧包含在动作内，不能用N作为可渲染事件帧。无接触的表演事件可以不设contact_frame。
- 音频采样起点=`round(frame/fps*sample_rate)`。脚本默认导出48kHz采样索引，不做音频合成。
- `layout.width/height` 是逻辑像素，`world_scale` 是世界单位/像素。
- `targets` 的 `rect` 是全局逻辑像素 `[x,y,w,h]`；`panel` 是父面板标识，按工程使用。
- 路径可选，`path` 为四个三次贝塞尔控制点，每个 `[u,v,h]`，h也是像素单位、表示离板高度。路径参数只在start到contact区间运行，接触后恢复动作另写关键帧。
- 路径描述的是接触代理点（脚底/手掌），不是角色根节点。角色根需根据姿态偏移计算。
- 编译输出的 `world` 坐标是**初始平面局部坐标**，不包含面板倾斜/滚动/掉落或角色骨骼变换。执行器必须应用父面板矩阵、动态surface高度和角色接触偏移；不能直接使用这些数值保证接触。

## 事件字段

必需：唯一 `id`、`action`、`start_frame`、`end_frame`。

有target的事件需：存在的 `target`、`contact_frame`、`effect`。`effect` 包含 `before`、`after`，且二者不同；可选 `frame`（不能早于contact）。没有target的眨眼/挥手等表演可省略effect。准确行为由 `action` 与项目代码实现，不是脚本内置功能。

可选 `contact_uv` 指定目标内落点，省略则取目标中心；`path`末点应与落点一致，末点高度为0。脚本检查初始布局内的落点及末点一致，不验证中间路径碰撞/相机出画。

`audio` 是可选列表，元素为唯一音效 `id`、绝对内部 `frame`，可带 `sync: "contact"` 表示必须与接触帧一致。whoosh不设sync，可提前。允许在动作end后尾响，但不能将起音安排到影片范围外。

连续拖拽要在工程代码里由start/contact/end实现拾取、约束、移动、释放，并定义UI连续状态；不要认为before/after两个文本描述就能自动生成拖拽。多个事件同时修改同一状态时在storyboard规定优先级；编译按start_frame/id稳定排序，不能依赖输入偶然顺序。

## 编译与检查

```sh
python scripts/timeline.py assets/timeline.example.json --out /path/to/project/build/timeline.compiled.json
```

输出包括原始数据、每个事件的秒和Blender帧、接触局部世界点、路径局部世界点、音频采样起点以及源数据SHA256。工具拒绝重复ID、越界帧、缺失目标、无反馈的目标动作、落点不在目标内、错位路径终点及要求同步却不在接触帧的音效。

此检查是必要的结构验证，不证明美术效果、软件语义、真实碰撞、音画成片同步或Design交付。仍需按验收文档渲染并检查。
