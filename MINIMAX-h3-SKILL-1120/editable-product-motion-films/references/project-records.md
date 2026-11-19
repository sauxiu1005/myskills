# 项目记录格式

下列为作品文件的记录约定，不是平台API。按任务规模合并到少数文件，不为空表创建冗余资料。

## 工作目录

```text
film/
  index.html
  vendor/                 # 项目运行依赖及许可证
  assets/                 # 选用素材、字体和音轨
  treatment.md            # 方向、关键帧时间、节拍与连续性
  assets.json             # 素材/来源清单
  decisions.md            # 本项目选择、反馈和修订理由
  design-state.json       # 各阶段结果及证据
  qa/                     # check 结果、ffprobe 参数
  out/                    # 带版本成片、preview.html、source.zip、字幕
  .tools/bin/             # setup-tools 链接的 ffmpeg/ffprobe，不打包
  .om/                    # CLI历史/日志，不默认对外打包
```

素材字段建议：`id, kind, origin, source_url_or_path, rights, generation_prompt, tool_model, task_id, resource_id, node_id, version, used_range, status, evidence`。事实字段建议：`claim_id, screen_text, source, observed_at, kind(fact/copy/illustrative)`。模型生成画面不能作为产品真实能力或性能数据的证据。

每个阶段记录 `status`（pending/passed/failed/blocked/not_applicable）、`evidence` 和必要的 `note`。例如：

```json
{
  "skill": {"name":"editable-product-motion-films", "version":"1.0.0", "author":"MiniMax Design"},
  "env": {"skill_root": null, "project_root": null, "node": null, "chrome": null, "ffmpeg": null, "ffprobe": null, "route": null},
  "spec": {"duration_s": null, "size": null, "fps": 30, "language": null, "sound": null},
  "composition_id": null,
  "resources": {
    "treatment": {"resource_id": null, "version_id": null},
    "film_mp4": {"resource_id": null, "version_id": null, "sha256": null},
    "preview_html": {"resource_id": null, "version_id": null},
    "source_zip": {"resource_id": null, "version_id": null}
  },
  "editable_project": {"url": null, "pid": null, "root": null, "verified": false, "source_folder": null},
  "checks": {
    "source_check": {"status":"pending", "evidence":[]},
    "media_params": {"status":"pending", "evidence":[]},
    "preview_bundle": {"status":"pending", "evidence":[]},
    "canvas_delivery": {"status":"pending", "evidence":[]},
    "editable_project_link": {"status":"pending", "evidence":[]},
    "user_review": {"status":"pending", "evidence":[]}
  }
}
```

源码包（`bundle-preview.mjs --zip`）包含实际用到的源码、vendor、assets、treatment、字幕和许可证；先在新目录解压，使用同一渲染器复现短段，检查无绝对安装路径和缺失文件。私密反馈、未选用的大素材和缓存不进入对外包。没有 Node/浏览器的收件人可看 MP4，但不能承诺其可直接重渲染源码。

`resources` 中的标识只填交付工具实际返回的值；每次修改后更新为新版本。`user_review` 记录用户在各确认点的选择与反馈，不由助手自评为通过。
