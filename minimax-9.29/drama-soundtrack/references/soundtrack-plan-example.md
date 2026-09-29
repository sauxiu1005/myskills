# 原声蓝图格式示例

以下是 `soundtrack-plan.md` 的标准格式。

```markdown
# 《步步惊心》原声音乐蓝图

## 角色主题曲

### 【若曦】 — 一念之间

- 风格标签：Chinese pop ballad, emotional, piano-driven, orchestral strings
- 人声风格：female, warm, breathy, mid-range, emotionally vulnerable
- 情感基调：温暖中带深深的忧伤，穿越时空的思念
- 关键乐器：钢琴、弦乐组、古筝点缀、轻柔鼓点
- 歌词方向：第一人称，穿越者的视角，明知结局仍选择去爱
- 节奏：慢速 (70-80 BPM)
- 设计理由：若曦本质温暖但命运悲情，钢琴主导体现现代人的细腻，古筝点缀暗示她身处古代的身份撕裂

### 【四爷】 — 孤城

- 风格标签：dark orchestral, cinematic, cello-driven, restrained power
- 人声风格：male, deep, restrained, baritone, controlled emotion
- 情感基调：隐忍的深情，权力的孤独，克制中爆发
- 关键乐器：大提琴独奏、低沉弦乐、定音鼓、偶尔的笛子
- 歌词方向：第一人称，帝王视角，爱与权力的两难
- 节奏：慢速 (60-70 BPM)
- 设计理由：四爷性格隐忍深沉，大提琴的低沉共鸣完美匹配，定音鼓暗示权力的压迫感

## 片头曲 (OP)

### 步步惊心

- 风格标签：epic Chinese pop, driving beat, traditional-modern fusion, cinematic
- 人声风格：female, powerful, soaring, wide range
- 情感基调：命运的紧迫感，穿越时空的宿命
- 关键乐器：古筝 riff + 电子鼓 + 弦乐组 + 笛子
- 歌词方向：宿命感，步步惊心的意象，历史洪流中的渺小个人
- 节奏：中速偏快 (100-110 BPM)
- Hook 策略：古筝 riff 开场即抓耳，副歌旋律洗脑
- 设计理由：OP 需要在片头迅速建立古装权谋的氛围，同时暗示爱情线

## 片尾曲 (ED)

### 三寸天堂

- 风格标签：intimate ballad, acoustic, sparse, emotional climax
- 人声风格：female, ethereal, delicate, falsetto moments
- 情感基调：遗憾、释然、跨越时空的告别
- 关键乐器：钢琴独奏、轻柔弦乐、偶尔的古筝泛音
- 歌词方向：回望视角，对那段跨时空爱情的追忆与放下
- 节奏：极慢 (55-65 BPM)
- 设计理由：ED 承载每集结尾的情感余韵，极简编曲让人声情感成为焦点

## 场景配乐

### BGM-01: S02·雪夜送暖手炉

- 场景描述：四爷雪夜悄然送来暖手炉，若曦心动
- 情感类型：浪漫/心动 (强度 3/5)
- 风格标签：warm acoustic, gentle, intimate, romantic
- 关键乐器：古筝轻拨、钢琴、轻柔弦乐
- 时长预估：30s
- 设计理由：初期心动需要温暖但不张扬的配乐，古筝营造古代氛围

### BGM-02: S05·九龙夺嫡

- 场景描述：皇子们最终摊牌，政治博弈达到高潮
- 情感类型：紧张/权谋 (强度 5/5)
- 风格标签：orchestral, tense, dramatic buildup, war drums
- 关键乐器：定音鼓、低沉弦乐组、法号、紧迫的木鱼节奏
- 时长预估：45s
- 设计理由：权谋高潮需要层层递进的压迫感，鼓点驱动节奏升级

### BGM-03: S07·病重诀别

- 场景描述：若曦病重，与四爷最后的告别
- 情感类型：悲伤/不舍 (强度 5/5)
- 风格标签：sorrowful, solo instrument, minimal, heartbreaking
- 关键乐器：二胡独奏、极简钢琴、偶尔的弦乐泛音
- 时长预估：40s
- 设计理由：最悲情的场景用最少的乐器，二胡的哭腔质感直击人心
```

## 格式要点

- 一级标题包含剧名
- 四大分类用二级标题：`角色主题曲`、`片头曲 (OP)`、`片尾曲 (ED)`、`场景配乐`
- 每首曲目用三级标题：角色曲格式 `### 【角色名】 — 曲名`；其余 `### 曲名`；BGM 格式 `### BGM-{编号}: S{场景编号}·{场景名}`
- 每首必含字段：风格标签、情感基调、关键乐器、设计理由
- 人声曲额外必含：人声风格、歌词方向、节奏
- BGM 额外必含：场景描述、情感类型（含强度）、时长预估
- 风格标签使用英文（用于后续生成 prompt）
- OP 额外含 Hook 策略
