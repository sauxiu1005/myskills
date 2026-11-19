# 素材研究与记录

本片是剪辑与纪实，研究顺序是**条目来源 → 目录说明 → 看实际素材 → 记录可用区间 → 故事方案**。不要先写好剧情再找看起来像的影像作证。

## 来源选择

优先用户已有档案与授权说明，再依题材检索 NARA、Internet Archive、Wikimedia Commons、LOC/Chronicling America、相应国家档案馆，地图可取 Natural Earth，历史唱片可找 UCSB/Internet Archive 或 LOC 的条目。

- 联邦制作、受赠馆藏、委托拍摄分别核对，不能因网站是档案馆就认定全部公版。
- Internet Archive 核对原机构、作者、条目许可和上传来源，排除无出处转载、YouTube镜像、上色与AI增强版本。
- Commons 要读文件页许可模板；“no known restrictions”不是明确许可。工具自动填充的许可字段只是线索，不是审查结论。
- 原仓库以已确认 PD、CC0、CC BY、OFL 为默认素材范围；其他许可读其实际要求并结合用户已有授权决定。不把 PD 标签改成 CC0。
- 原文的“1931年前出版物/1926年前录音”等是2026年的美国历史阈值示例；每次按当前日期、作品类型、发布地和使用地域查权威来源，不直接永久套用。录音本体与词曲分别核对。
- 新闻扫描先看整页，再裁到相关折页；不把邻栏的无关报道带入。可剪除档案头尾板和白闪，选择合法无水印原档，不抹除权利水印。
- 真实彩色影像可以使用，统一调成暖银灰，地点日期卡保留真实年代；黑白素材的上色版和 AI 增强版仍排除。
- 真实历史公共人物或新闻事件人物按素材内容出现；不对普通人的脸做慢放、嘲弄式特写或无关放大。

## 随包素材工具

`scripts/init_project.py` 会把原版 `footage.py` 复制到新项目 `film/tools/`，它只用Python标准库（媒体参数识别另需ffprobe）。下列是工具用法；查询词和已核实条目ID按本片替换，不能把示例ID作为已选素材。

```sh
cd /actual/project/film
python3 tools/footage.py search archive 'early automobile assembly' --type video -n 8
python3 tools/footage.py search commons '1908 automobile' --type image -n 8
python3 tools/footage.py files archive:VERIFIED_IDENTIFIER
python3 tools/footage.py fetch archive:VERIFIED_IDENTIFIER/VERIFIED_FILE --name archive01 --max-mb 200
python3 tools/footage.py used archive01 'source 12.0–15.5 s -> film 3.2–6.7 s; action verified against catalogue'
python3 tools/footage.py md
```

`fetch` 不指定文件会挑条目里较大的候选，先用 `files` 明确需要的文件。`--max-mb` 的原版实现只根据响应 Content-Length 预检；未知长度时不能视为流式硬上限。选择小文件或用平台能限制下载体积的正式能力，并检查实际磁盘占用。失败或中断可能留下文件；先校验再决定重下，不因“已存在”就认定完整。工具示例的 `--license` 不应拿来编造权利状态。公开视频页面也可用平台网页媒体下载能力获取，同样手写记录。

搜索结果/目录页不能代替看过片段；日志需写看片结果：源时间码、人物、动作、画面里的文字、实际年份与未知项。只下载本片需要的资料，先向用户简述来源、用途和体积即可，已获授权的常规步骤不额外停等。

## 工程记录

保留工具原生 `SOURCES.jsonl` 结构：`name, file, url, input, page, title, date, credit, license, note, used, fetched`，以及能探测到的宽高、fps、时长、音轨。可以补 `catalogue_url, rights_url, rights_checked_on, source_in, source_out, film_in, film_out`；未知留空，不伪造时间或ID。`used` 同时写源区间与成片区间；`SOURCES.md` 从记录生成。

`FACTS.md` 的每行包括：

`claim_id | 屏幕/播报的精确措辞 | 来源URL | 页码/目录段落/源时间码 | 支持该主张的短摘录或测量 | 已核实/来源说法/编辑评论/未知`

事实、某张旧报纸当年的说法、当下编辑的调侃分开。例如新闻标题的医疗断言只说“当时报纸声称”，不升级为医学事实。来源不足时删改主张；不能靠复古播报语气补足证据。

`CREDITS` 包含实际用到的影片、照片、扫描、地图、录音、音乐采样、字体、引擎与许可，以及必要改动说明。它是用户本片的清单，不复制示例的条目充数。源码中的上游MIT署名保留，但示例作者/模型片尾不自动进入成片。

`QA.md` 记录检查方法、结果、证据路径和未完成项。至少分开记录素材核对、文本可读、字幕、声画同步、完整解码、听审、画布播放及编辑入口。未做的项目记 `not_run`，能力受阻记 `blocked`，只能由用户完成的检查记 `needs_user_check`。
