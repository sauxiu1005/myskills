---
name: image-paint-edit
dir: image-paint-edit
tool-id: "506178024759017472"
trigger-words: [涂抹编辑, 局部重绘, 涂抹修改, paint to edit, inpaint, mask edit]
description: |
  在图片上涂抹标记要修改的区域，输入修改描述（可选添加产品参考图），生成局部编辑后的新图。适用于：替换物体、改变细节、产品植入到指定位置等场景。
allowed-tools: hub_submit_dag, hub_upload_to_cdn
---

# Image Paint Edit

在图片上涂抹标记需要修改的区域,描述意图后生成新图

## 参数

| ID | 类型 | 必填 | 取值约束 | 说明 |
|----|------|------|---------|------|
| image_url | file(image/png,image/jpeg,image/webp) | 是 | — | 原图（PNG/JPG/WEBP），要编辑的源图 |
| mask_url | file(image/png) | 是 | — | 黑白二值 mask PNG，白色=待编辑区域，黑色=保留区域；由 GUI 画布涂抹后生成上传 |
| prompt | string | 是 | — | 对修改意图的自然语言描述（建议 1-500 字） |
| reference_image_url | file(image/png,image/jpeg,image/webp) | 否 | — | 可选产品参考图，用于将参考图中的产品自然植入 mask 区域；不需要时省略 |

## 全局禁令

- ❌ **禁止**调用 `save_file_to_session` 工具 — 本工具产生的所有资产 gateway 已自动保存到 workspace 并通过 `recordAsset` 注册到画布,任何手动保存(`save_file_to_session` / `curl` / `wget` / `download_videos` 等)都会让同一资产入两次库。完成后只需用 markdown 媒体语法引用 `local_path` / 脚本 `outputs` 返回的路径即可。

## 执行流程

### STEP 1: 执行 paint-edit

**文件参数处理**：以下参数值若为本地路径（非 https URL），先调 `hub_upload_to_cdn({ file_path: "<本地路径>" })` 获取 CDN URL 再填入 inputs：
- `image_url`
- `mask_url`
- `reference_image_url`

调用 `hub_submit_dag`：

| 字段 | 值 |
|------|----|
| dag_id | `"506187248834686982"` |
| inputs | `{ "image_url": <params.image_url>, "mask_url": <params.mask_url>, "prompt": <params.prompt>, "reference_image_url": <params.reference_image_url> }` |
| asset_keys | `[]` |

提交后**立即结束当前 turn**（gateway 后台轮询，完成时自动注入新 user message 唤醒）。

### STEP 2: 渲染资产

收到最后一步完成消息后，注入的 user message 形如：

```
Async task completed:
{
  "task_id": "<run_id>",
  "status": "succeeded" | "failed" | "timeout",
  "outputs": { ... },
  "asset_outputs": [
    { "key": "image", "status": "finished", "url": "https://cdn...", "local_path": "..." }
  ],
  "error_message": null
}
```

#### `status: "succeeded"`

用 markdown 媒体语法插入资产，从 `asset_outputs` 中遍历 `status == "finished"` 的条目：

- 图片：`![描述](<asset_outputs[i].local_path>)`
- 视频：`![描述](<asset_outputs[i].local_path>)` 或链接 `[查看视频](<local_path>)`
- 其他文件：`[<描述>](<local_path>)`

**关键约束**：
- ✅ **必须用 `local_path`**（gateway 已自动下载到 workspace 并通过 `recordAsset` 注册到画布）
- ❌ **不要用 `url`**（CDN URL 仅作 fallback，直接用会让画布丢失资产引用）
- ❌ **禁止**调用 `save_file_to_session` / `curl` / `wget` / `download_videos` 等下载工具 — gateway 已下载，重复会让同一资产入两次库
- ⚠️ 纯文本（如「已生成」「已保存」）不会渲染媒体，**必须用 markdown 语法**

#### `status: "failed"`

向用户报告 `error_message`，建议调整输入后重试。**不要**自动 retry。

#### `status: "timeout"`

任务已被 gateway abort（30 分钟未完成），向用户报告超时并建议稍后重试。

#### 严格禁令（适用所有步骤）
- ❌ **禁止**用 `question` / `ask` 工具通知用户等待 — UI 已有 loading 反馈
- ❌ **禁止**主动调用 `hub_query_dag_result` — gateway 会回调，主动查会浪费 turn 还可能 race condition
- ❌ **禁止**重复 `submit_dag` — 会在后端创建多个任务，消耗用户配额
- ❌ **禁止** sleep / 自旋 — 事件驱动，等待靠 gateway 注入
