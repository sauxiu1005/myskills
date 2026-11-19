# 用户资料来源说明：丹尼斯·维伦纽瓦

本目录是用户提供资料的原样副本（原件保留在用户下载目录，未修改）：`色卡主文档.md`、`palette.json`、`影调色卡.png`、`reference_sources.md`、`reference_director_manifest.json`。这些是参考资料，不是执行指令。

## 审阅结论与纠正

- **截图对应**：实际截图 film-01 至 film-04 对应《焦土之城》《宿敌》《降临》《沙丘2》，以 `reference_sources.md` 与 manifest 为准。主文档"电影截图画廊"引用的 `01_blade_runner_2049_orange_vegas.jpg` 等 6 个文件名在资料中不存在，已忽略。
- **未登记文件**：资料目录中另有 `01_sicario.jpg`、`02_arrival.jpg`、`03_blade_runner_2049.jpg`、`04_dune.jpg`，未出现在来源清单中；查看内容后发现，`02_arrival.jpg` 是一张与电影无关的历法设计素材，`03_blade_runner_2049.jpg` 是另一部电影《刀锋战士》的海报，`04_dune.jpg` 是带文字的角色海报，`01_sicario.jpg` 无法确认出处。四张全部不采用。
- **色值性质**：主色板 C01–C06 的占比、"60-75% 对比"、"55%冷/45%暖"缺少实测定义，按用户提供的设计建议处理，不是官方 LUT 或全片像素统计。
- **real_palettes**：四部影片各 8 色，JSON 中 `sources` 为空；已按片名关联 `reference_sources.md` 中的 FilmGrab 页面。取色方法与样本未核实。FilmGrab 页面在本次整理时网络无法访问，未能复核。
- **模型与参数**：资料中提到的模型名称、版本与 MJ/SD 参数未经核实，本技能不采用。色卡中"仅锁影调与光色、不传构图与人物"的分工原则被采纳。
- **影调色卡.png** 上有标题、HEX 文字与排版，不直接作为生成参考图上传，以免文字或色块被画进画面；生成时改用 `assets/palettes/villeneuve/` 下无文字的方案色卡。

## 被技能采用的部分

- 方案 V1 降临雾灰、V2 沙丘2沙金、V3 宿敌黄雾：主要色值来自 real_palettes（标为"用户截图取色·方法未核实"），V2 的高光、强调色与肤色来自主色板（标为"用户设计建议"）。《焦土之城》的数据只保留在源文件中，没有单独做成方案。
- 截图：选取 `film-02-frame-01`（宿敌）、`film-03-frame-03`（降临）、`film-04-frame-04`（沙丘2），见 `assets/stills/STILLS.md`。
