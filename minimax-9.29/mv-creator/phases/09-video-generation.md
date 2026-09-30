# 视频生成

## 目标

基于分镜规划和脚本，生成 AI 视频片段。

## 生成模型

使用 **Seedance 2.0** 多参考图模式（`seedance_multimodal_video`）：
- 模型：`seedance2.0`
- 输入：多张参考图（背景参考图 + 角色参考图 + 物件参考图），通过 `reference_image_paths` 传入
- 时长：与脚本每幕的秒数一致（4～15 秒），从时间码标签直接读取
- 分辨率：`720p`，比例 `16:9`
- 音频：`generate_audio: false`（最终合成时统一嵌入歌曲音频）
- **并发度：1**（逐幕顺序生成，避免 API 限流）

## 参考图策略

视频生成使用分镜选定图作为画面构图基准，配合角色和物件参考图确保一致性：

| 场景类型 | reference_image_paths | prompt 引用示例 |
|----------|----------------------|----------------|
| 角色场景 | [分镜选定图, 角色 selected.jpg] | `use image 1 as the scene composition, image 2 as the character reference` |
| 角色 + 物件场景 | [分镜选定图, 角色 selected.jpg, 物件 selected.jpg] | `use image 1 as the scene composition, image 2 as the character, image 3 as the prop reference` |
| 多角色场景 | [分镜选定图, 角色1 selected.jpg, 角色2 selected.jpg] | `use image 1 as the scene composition, image 2 and image 3 as character references` |
| 纯空镜 | [分镜选定图] | `use image 1 as the scene composition` |

> 分镜选定图路径：`storyboard/scene_{NN}.jpg`（其中 NN 为幕序号，如 scene_01.jpg）

## 生成流程

1. 读取 `storyboard.md`，提取每幕的参考图路径、出场角色、场景背景和时长
2. 为每幕编写视频提示词（英文），描述画面动态和镜头运动，引用参考图
3. 逐幕调用 `seedance_multimodal_video`，传入参考图列表和提示词
4. 每幕生成完成后，将视频保存到 `clips/` 目录
5. 全部完成后，生成 `video_prompts.md` 记录每幕的提示词和生成参数

## 提示词结构

```
[参考图引用], [主体描述], [动作/运动], [环境/场景], [光线/氛围], [镜头语言], [风格修饰]
```

## 提示词原则

- 使用英文撰写（AI 视频工具对英文支持最佳）
- 先引用参考图（image 1, image 2...），再写主体和动作
- 明确指定镜头运动方式（camera pan left, dolly in, static shot...）
- 包含光线描述（golden hour, neon lights, dramatic shadows...）
- 添加风格标签（oil painting, thick brushstrokes, impressionist...）
- 避免否定描述，用正面表述替代

## 文件存储

```
./.mv/{song_name}/{theme}/video_prompts.md                  # 视频提示词
./.mv/{song_name}/{theme}/clips/{scene_name}.mp4            # 生成的视频片段
```

## 视频预览

全部视频生成完成后，调用 MCP 工具 `preview_and_collect_feedback` 启动视频预览：
- **script**: `.opencode/skills/mv-creator/scripts/render_preview.py`
- **args**: `[".mv/{song_name}/{theme}", "--type", "videos", "--lang", "{lang}"]`
- **feedback_path**: `.mv/{song_name}/{theme}/feedback.md`

预览页面展示：
- 每幕视频播放器（支持播放/暂停/拖拽）
- 场景信息（标题、时间码、歌词、出场角色、场景描述）
- 视频提示词（可折叠）
- 参考图缩略图
- 生成状态（已生成 / 缺失）

用户反馈处理（工具返回反馈内容后）：
- `LGTM` → 进入视频剪辑阶段
- `@scene_03 镜头运动改为缓慢推进` → 修改指定幕的提示词并重新生成
- `@scene_05 重新生成` → 使用原提示词重新生成指定幕
- 可上传参考图辅助修改：`@scene_02 参考 @uploaded/ref.jpg 的构图`
