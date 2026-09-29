# 二次元/动漫 14 子风格索引

> **何时 read**：开始 brief 时第一件事——判断本任务属于哪个子风格。
> **每个子风格详细 playbook** 见 `substyles/{NN}-{slug}.md`。

## 4 大来源 + 14 子风格一览

> **路径约定**：所有 file 路径相对本文件所在目录（`references/`）。Step 1 深读时直接 `Read references/substyles/{NN}-{slug}.md`，不要再做"国漫3D → 09 → cn-3d-fantasy"的二次推断。

| # | slug | file | 来源 | 默认比例 | 推荐场景 | 默认模型 |
|---|---|---|---|---|---|---|
| 01 | jp-modern | `substyles/01-jp-modern.md` | 日漫 | 9:16 / 1:1 | 萌系角色立绘、轻小说封面、现代偶像题材 | seedream |
| 02 | jp-retro | `substyles/02-jp-retro.md` | 日漫 | 4:3 / 16:9 | 90s 怀旧、复刻经典、复古番剧封面 | seedream |
| 03 | jp-shonen | `substyles/03-jp-shonen.md` | 日漫 | 2:3 / 16:9 | 战斗场面、热血番剧海报、必杀技分镜 | seedream |
| 04 | jp-shojo | `substyles/04-jp-shojo.md` | 日漫 | 9:16 / 2:3 | 少女漫主角立绘、浪漫场景、恋爱番封面 | midjourney |
| 05 | ghibli | `substyles/05-ghibli.md` | 日漫 | 16:9 / 3:2 | 治愈风景插画、童话场景、自然系封面 | midjourney |
| 06 | shinkai | `substyles/06-shinkai.md` | 日漫 | 16:9 / 21:9 | 城市天空、光线粒子场景、日系 MV 封面 | midjourney |
| 07 | cn-xianxia | `substyles/07-cn-xianxia.md` | 国漫 | 2:3 / 9:16 | 仙侠角色立绘、水墨风插画、汉服国风 | qwen |
| 08 | cn-modern | `substyles/08-cn-modern.md` | 国漫 | 9:16 / 1:1 | 现代国漫扁平、几何插画、都市题材 | seedream |
| 09 | cn-3d-fantasy | `substyles/09-cn-3d-fantasy.md` | 国漫 | 16:9 / 2:3 | 玄幻 3D 角色、电影级特效场景、游戏 CG | **kling**（唯一）|
| 10 | kr-webtoon | `substyles/10-kr-webtoon.md` | 韩漫 | 9:16（竖屏长图）| 条漫主图、韩漫角色头像、写实风衍生 | seedream |
| 11 | kr-paint | `substyles/11-kr-paint.md` | 韩漫 | 2:3 / 9:16 | 厚涂立绘、游戏角色卡、painterly 头像 | midjourney |
| 12 | us-cartoon | `substyles/12-us-cartoon.md` | 美漫 | 16:9 / 1:1 | Disney-Pixar 风格儿童 IP、夸张表情 | midjourney |
| 13 | q-version | `substyles/13-q-version.md` | 通用 | 1:1 / 4:5 | Q 版表情包、chibi 周边、kawaii 头像 | seedream |
| 14 | cyberpunk | `substyles/14-cyberpunk.md` | 通用 | 2:3 / 16:9 | 二次元赛博朋克、机甲少女、未来都市 | midjourney |

## 子风格选择决策树

```
用户描述 → 关键词识别
├── 来源国
│   ├── "日漫 / 番剧 / 萌系 / 治愈 / JK / 巫女" → 01-06
│   ├── "国漫 / 国风 / 仙侠 / 汉服 / 水墨 / 玄幻" → 07-09
│   ├── "韩漫 / webtoon / 条漫" → 10-11
│   └── "美漫 / Disney / Pixar / 卡通" → 12
├── 风格年代
│   ├── "现代 / 当代 / 偶像" → 01 / 08
│   ├── "复古 / 90s / 经典" → 02
│   └── "未来 / 赛博 / 机甲" → 14
├── 媒介 / 比例特征
│   ├── "立绘 / 角色卡" → 03 / 04 / 11
│   ├── "条漫 / 竖屏长图" → 10
│   ├── "风景 / 场景插画" → 05 / 06
│   └── "Q 版 / 表情包 / chibi" → 13
├── 维度
│   ├── "2D / 平面 / 手绘" → 默认走 2D 子风格
│   └── "3D / 渲染 / 游戏 CG" → 09
└── 跨风格模糊（"做个二次元角色"）→ AskUserQuestion 三选一（来源国 + 媒介 + 风格调性）
```

## 进入深度策划时

各子风格 playbook 的完整路径见上方索引表 file 列。每个 playbook 含必出元素 / 笔触特征 / 配色 / 五官规范 / 必填项 / 易错点 / MANDATORY_KEYWORDS / FORBIDDEN_THEMES / REQUIRED_NEGATIVE。

跨子风格共用规则与必填项原则见 `cross-substyle-rules.md`。

## 配套 reference

本文件是二次元场景的子风格路由层。

- 防翻车铁律（开始 brief 前必读）→ `iron-laws.md`
- 默认参数（比例 / 笔触 / 配色）→ `defaults.md`
- 子风格 → 模型映射 → `model-routing.md`
- 速查（开始 brief 时高密度判断）→ `substyles-quick-ref.md`
