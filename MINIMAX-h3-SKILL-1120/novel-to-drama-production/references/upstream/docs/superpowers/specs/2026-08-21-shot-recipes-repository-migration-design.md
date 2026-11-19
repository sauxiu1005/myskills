# `shot-recipes` 仓库迁移设计

## 目标

把 `shot-recipes` 从 `shuohao-skills` 迁移到新的短视频制作 skills 仓库
`shuohao-video-skills`。新仓库先保持私有，作为后续分镜、剪辑、声音、字幕、提示词和发布等
短视频周边 skills 的容器。

迁移完成后，`shot-recipes` 只有一个权威副本；两个仓库都可以独立安装、测试和维护。

## 仓库与目录

本地新仓库：

```text
/Users/wesley/workspace/shuohao-video-skills/
├── README.md
├── README.en.md
├── CHANGELOG.md
├── LICENSE
├── NOTICE
├── .gitignore
└── skills/
    └── shot-recipes/
```

GitHub 新仓库：`eternityspring/shuohao-video-skills`，可见性为 private。

保留 `skills/shot-recipes/` 这一层，而不是把 skill 直接放在仓库根目录，以便以后在同一仓库增加
其他短视频制作 skill。

## 迁移范围

迁入新仓库的是当前工作区中 `skills/shot-recipes/` 的完整快照，包括：

- 已跟踪的卡片、脚本、文档、资源和示例；
- 当前尚未提交的 1.1.0 更新；
- 新增的复合运镜、机位载体和速度斜坡卡片及其中英版本；
- 《查无此人》JSON、Markdown 和 `examples/film/` 素材；
- 当前对 CLI、自测和 `dolly-zoom` 卡片的修改。

新仓库的 `CHANGELOG.md` 收录 `shot-recipes` 自己的历史条目，不收录小说流水线和其他 skill
的变更。许可证沿用当前仓库的 Apache-2.0 `LICENSE` 与 `NOTICE`。

根目录的 `分段说明.md` 不属于 skill，不迁移也不提交。

## 历史策略

采用干净快照迁移，不搬运旧仓库的 Git 历史。原因是 `shot-recipes` 在旧仓库只有一个已提交的
引入提交，而当前主要更新尚未提交。新仓库以当前完整、经过验证的 1.1.0 状态作为首个正式版本，
比重写历史更清楚。

## 旧仓库清理

迁入并验证成功后，从 `shuohao-skills` 删除 `skills/shot-recipes/`，并同步清理：

- 根目录中把 `shot-recipes` 当作内置 skill 展示的中英文 README 行与图片；
- 根 `.gitignore` 中只服务于该目录的规则；
- 当前未提交 `CHANGELOG.md` 中属于 `shot-recipes` 1.1.0 的段落，该段落迁入新仓库；
- `novel-storyboard` 文档中指向原相邻目录的内部链接与示例路径。

`novel-storyboard` 的 `--shots` 接口继续接受任意卡片目录，因此功能接口不变。它的自测不再读取
被移走的真实 skill，而是增加一个最小卡片 fixture 来覆盖解析、必备短语检查和错误信息，保证旧仓库
不依赖新仓库也能完整自测。

旧仓库中《查无此人》涉及其他小说 skills 的 changelog 内容以及其他未提交文件保持原样，不纳入
本次迁移提交。

## 提交与 GitHub 流程

两个仓库都在 `codex/` 前缀的迁移分支上工作，并只暂存明确属于本次迁移的路径。

新仓库：

1. 创建私有 GitHub 仓库并初始化默认分支；
2. 在 `codex/import-shot-recipes` 分支提交完整的新仓库结构；
3. 推送该分支并创建 draft PR，便于审阅后合并。

旧仓库：

1. 使用当前 `codex/migrate-shot-recipes` 分支；
2. 提交 skill 删除、README 清理和 `novel-storyboard` 解耦；
3. 推送分支并创建 draft PR，不混入 `分段说明.md` 或其他小说 skill 改动。

## 验证

新仓库至少运行：

```bash
node skills/shot-recipes/scripts/selftest.mjs
node skills/shot-recipes/scripts/shot-recipes.mjs lint
node skills/shot-recipes/scripts/shot-recipes.mjs check skills/shot-recipes/examples/vocab-reel.json
node skills/shot-recipes/scripts/shot-recipes.mjs check skills/shot-recipes/examples/no-such-person.json
```

旧仓库至少运行：

```bash
node skills/novel-storyboard/scripts/selftest.mjs
rg 'skills/shot-recipes|\.\./shot-recipes' README.md README.en.md skills
```

最后确认：

- 新 GitHub 仓库确实为 private；
- 新仓库工作树干净，迁移分支已推送；
- 旧仓库迁移提交不包含用户的无关改动；
- 两个 draft PR 都能清楚展示迁入与迁出的边界。

## 失败与恢复

在新仓库全部测试通过并成功推送前，不提交旧仓库的删除。迁移期间旧仓库原始内容仍在 Git 历史中，
即使文件移动或验证失败，也能从 `main` 恢复；用户现有未提交内容不通过 stash、reset 或 checkout
改写。
