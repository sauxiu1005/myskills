# 07. 音乐节海报 (music-festival-poster)

> **优先质量维度**: Visual Appeal + Energy(视觉冲击 + 高饱和能量感)
> **默认比例**: 2:3(800×1200)主版 / 9:16(1080×1920)社媒版
> **核心转化驱动**: 高饱和能量视觉 + Lineup 字号梯度(Headliner > Subheadliner > 一般 artist)+ 节日 IP 调性

---

## 一、必出元素清单

> 信息递进流:**节日名建立 IP → Headliner 锁定门票决策 → Lineup 完整列表 → 时间地点购票闭环**
> 核心逻辑:粉丝看音乐节海报先认 Headliner(第一档 artist 决定买不买票),然后看自己喜欢的 artist 在不在阵容,Lineup 字号梯度直接决定海报专业度。

| # | 必出元素 | 视觉权重区 | 占比 | 位置 | 信息职责 |
|---|----------|-----------|------|------|---------|
| 1 | 节日名 / Logo | Heavy | 占面 20%+ | 顶部 1/4 | IP 锁定 — 第一眼建立节日身份 |
| 2 | Headliner(第一档) | Heavy | Lineup 区字号最大 | 上 lineup 区 | 决策核心 — 第一档 1-3 个 artist |
| 3 | Subheadliner(第二档) | Medium | Headliner 50-60% 字号 | 中 lineup 区 | 强化阵容 — 第二档 4-8 个 artist |
| 4 | 一般 artist(第三档) | Light | Headliner 25-35% 字号 | 下 lineup 区 | 完整列表 — 第三档若干 artist |
| 5 | 时间地点 + 购票方式 | Medium | 5-10% | 底部 | 购票闭环 — 日期 / 场地 / 购票二维码 |
| 6 | 主视觉氛围背景 | Heavy | 100% 铺满 | 全画布 | 能量感 — 高饱和色彩 / 几何 / 抽象艺术 |

---

## 二、整体风格与质感

| 维度 | 要求 |
|------|------|
| **风格方向** | 节日类型决定 — 电音(霓虹冷峻)/ 摇滚(粗犷暗黑)/ 民谣(自然温暖)/ 嘻哈(街头涂鸦)/ 综合(多色冲撞) |
| **色温** | 高饱和(不限冷暖)— 渐变冲撞 / 霓虹反差 / 高对比 |
| **背景** | 抽象艺术 / 几何图形 / 主题大场景;**不**用空白 / 单色(失去能量) |
| **滤镜** | 高饱和 / 霓虹光晕 / 复古风潮;不要高级灰(音乐节违和) |
| **质感** | 平面艺术 + 强色块 / 抽象插画 / 复古印刷质感(噪点 + 网点) |

---

## 三、版式构图要求

| 构图方式 | 适用场景 | 焦点位置 |
|---------|---------|---------|
| 顶 Logo + 中 Lineup + 底信息 | 经典三段式(最常用) | Logo 顶 1/4,Lineup 中 1/2,信息底 1/4 |
| 主视觉 + 侧 Lineup 列 | 视觉强 IP 节日 | 主视觉左 / 中,Lineup 右侧栏 |
| 全屏艺术 + 底叠 Lineup | 视觉艺术节 / 设计感强 | 艺术铺满,Lineup 半透明叠底 1/3 |
| 拼贴风(多艺人头像 + 名字) | 群星阵容 | 头像 + 名字网格化拼贴 |

**字体位置规则**:
- Lineup 字号必须严格梯度:Headliner > Subheadliner > 一般(视觉化等级,不能等大)
- Headliner 名字之间用 ✦ / · / | 等分隔符,不要换行混淆
- 节日 Logo 优先嵌入底图(A 策略,艺术化字体),Lineup 文字必须 B 策略后期排版(梯度精确控制)

---

## 四、信息层级映射

| 层级 | 视觉权重 | 字号建议(基于 800×1200 画布) |
|------|---------|----------------------|
| 节日 Logo | Heavy | 80-150pt |
| Headliner artist | Heavy | 70-110pt(最大) |
| Subheadliner | Medium | 35-55pt(约 Headliner 的 50-60%) |
| 一般 artist | Light | 18-30pt(约 Headliner 的 25-35%) |
| 时间地点购票 | Medium | 24-36pt |

---

## 五、文字渲染策略(按 Iron Law #3)

| 文字情况 | 推荐策略 + 模型 |
|---|---|
| 节日 Logo(艺术化字体) | **A 嵌入**:midjourney 出含 logo 底图(艺术性最高) |
| 英文 artist 名字(少量) | **A 嵌入**:openai 单独渲染少量名字 OK |
| Lineup 完整列表(10+ 名) | **B 纯底图必须**:底图不画 lineup,后期排版才能精确控梯度 |
| 中文节日名 ≤ 4 字 | A 嵌入:qwen / nano_banana 直接渲染 |
| 中文节日名 5+ 字 | **B 纯底图**:midjourney / nano_banana 出底图 + 后期加文字 |

**B 策略 prompt 写法**:`music festival poster background art, no text, no words, no artist names, leave clean space at top for festival logo and middle 50% for lineup overlay, high saturation energetic visual, 2:3 aspect ratio`

---

## 六、必填项(音乐节海报 Brief 缺一不可)

不写这些 → sub-agent 凭训练先验补全 → 阵容感 / 节日 IP 失败:

- **节日类型**:电音 / 摇滚 / 民谣 / 嘻哈 / 综合(决定调性 + 配色)
- **节日名 / Logo**(已有 logo 提供,无则声明需要 AI 生成)
- **Headliner 清单**(1-3 个,最大字号,缺则海报无门票决策核心)
- **Subheadliner 清单**(4-8 个,中字号)
- **一般 artist 清单**(若干,小字号)
- **完整时间地点 + 购票方式**(日期 / 场地名 / 购票二维码或链接)
- **风格参照**:Coachella / Tomorrowland / 草莓音乐节 / Glastonbury / Sónar ...

## 七、易错点(Watch For)

- **Lineup 字号梯度错乱** — Headliner 与一般 artist 字号差异不够 → 阵容感拉胯 → Headliner 必须 ≥ 一般 artist 2 倍字号
- **Headliner 不突出** — 第一档艺人和其他平等字号 → 粉丝识别不出门票决策核心 → Headliner 70-110pt,独立一行
- **调性平淡** — 用了高级灰 / 极简风 → 失去音乐节能量 → 强制高饱和 / 高对比 / 渐变冲撞
- **节日类型与视觉错配** — 民谣节用了电音霓虹色 / 摇滚用了粉嫩 → 类型混乱 → Brief 阶段强制声明类型
- **Lineup 用 A 策略硬画** — sub-agent 直接画了 lineup 但字号梯度乱、拼写错 → 强制 B 策略后期排版
- **购票信息缺失** — 没二维码 / 没场地名 → 转化失败 → 强制底部信息层级独立
- **背景压住 Lineup 文字** — 主视觉饱和度高 + Lineup 文字相近色 → 文字读不清 → Lineup 区加半透明遮罩或对比色

---

## 配套 reference
> 本文件是**音乐节海报子类型特化层**,给该子类型独有的版式 + 字体 + 调性规则。通用规则走 sibling 文件。

- 防翻车铁律 → `iron-laws.md`
- 跨子类型共用规则 → `cross-subtype-rules.md`
- 默认参数 → `defaults.md`
- 模型路由 → `model-routing.md`
