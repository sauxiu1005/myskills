# 必选画风与真人手部

## 先展示，再记录，后生成

先运行 `python scripts/prepare_selection.py <jobDir>`，该命令下载并校验手部预设，将选择页与图片准备到 `<jobDir>/selection/`。打开返回的项目内 selection.html；不要直接打开技能包内模板。下载失败时明确报告并重试，不跳过真实图片选择。

用户没明确画风时，展示项目内 selection.html 中的真实画风卡片，或使用平台可显示的图片工具展示 assets/style-previews/ 下的实际图片和对应编号。用户没明确手部时，展示全部六款真人质感手臂，并把仅画笔作为单独选项。不能因为平台打不开HTML就跳过选择：改为在对话中展示图片和编号，让用户回复。

本包当前提供13种画风，按本包编号1—13展示：1 极简黑白火柴人、2 黑豆小人涂鸦、3 暖调色粉童话、4 写意水墨花鸟、5 复古动画角色、6 蜡笔童趣涂鸦、7 复古治愈绘本、8 复古暖调绘本、9 油画棒童趣卡通、10 美式卡通描线、11 硬派黑白墨线漫画、12 工业设计马克笔手绘、13 日系赛璐珞立绘。只使用这套编号；用户提到旧版编号时，按名称确认对应画风，不按旧编号猜。

全部画风都是本包自有画风，配方在 assets/custom-styles/STYLES.md，每种带一张参考图（assets/custom-styles/anchors/，文件名为“两位编号-画风英文名”）。prepare 会把配方和参考图复制到任务的 style/recipes/ 与 style/anchors/，catalog.json 中这些条目带 anchor 字段。

选择文件的 catalog_id 填本包编号；画风库 STYLES.md 保留原编号与原文，对应关系记录在 assets/style-previews/manifest.json 的 library_id，配方快照中的标题编号是库内编号，不作为用户可见编号。画风库中其余风格已从本包下线，不展示、不推荐、也不能被 catalog 或 catalog_auto 选中；用户点名时说明已下线，可改用自定义描述。

可用静态选择页 assets/selection.html：无服务器、无倒计时、无预选，用户选完画风与手部后可复制结果或下载 JSON。它不能自动写任务目录；需要把用户提交的结果交给 record 命令。聊天选择同样有效，执行者按实际回复写选择JSON。页面文件属于技能资源，在平台允许的预览方式中打开，不要求用户安装服务。

真人质感预设（原版素材，不宣称真人实拍）：

| ID | 显示名 | 资源清单键 |
|---|---|---|
| navy | 深蓝袖马克笔 | assets/hands/navy.png |
| diamond-woman | 白皙长甲镶钻女手 | assets/hands/diamond-woman.png |
| child-pencil | 儿童手彩铅 | assets/hands/child-pencil.png |
| waner-brush | 古风袖毛笔 | assets/hands/waner-brush.png |
| teacher-pen | 白衬衫中性笔 | assets/hands/teacher-pen.png |
| cardigan-fountain | 针织袖钢笔 | assets/hands/cardigan-fountain.png |
| pen-only | 仅画笔（无手部） | assets/hands/pen-only.png |

示例选择文件：

```json
{"style":{"mode":"catalog","catalog_id":"11"},"hand":"teacher-pen"}
```

只有用户实际选了这些值才能使用此示例，不得当作默认值。自定义画风可用 `{"mode":"custom","user_description":"用户原话"}`。用户明确委托模型匹配可用 catalog_auto；不要用“继续”或超时冒充委托。制作前还须收集其他未明确项目，见 production-options.md。

```bash
python scripts/selection_contract.py record JOB --selection USER_SELECTION.json --evidence "用户实际回复或提交文件的来源"
```

record 准备画风目录，保存 style/selection.json 与 options/hand-selection.json；已有 job.json 时同步 hand.preset。后创建 job.json 时必须填入同一个 preset。随后模型按 style-and-drawing.md 完成 resolved.json、可绘制计划、简报与提示词，再开始生图。record 不伪造风格解析、图片审核或用户选择。

```bash
python scripts/selection_contract.py verify JOB
```

生产 build/render/verify 均调用该检查，缺选择、自动超时默认、手部不匹配或偷偷用自定义source替换预设都会拒绝继续。用户已明确编号或手部则直接记录，不重复询问；修订影片保留原确认，只重新选择用户要求改变的项目。

表格中的手部路径是资源清单键，原图不随安装包分发。使用 prepare_selection.py 返回的项目路径或 hosted_assets.resolve_asset 解析后的缓存路径。画风参考图与画风预览路径保持随包提供。
