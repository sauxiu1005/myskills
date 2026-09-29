# 平面设计跨子类型共用规则

> **何时 read**：写任意子类型 brief 时检查这些通用必填项 / 共用规则。

## 跨子类型共用规则

1. **比例必须显式声明** — 每个子类型默认比例不同（详见 `defaults.md`）。**禁止**默认 1:1。无明确比例 AskUserQuestion。

2. **文字内容必须用户原话 verbatim** — 不允许凭训练先验补全文字。所有文字字符串（标题 / 副标题 / 日期 / 地点 / CTA）必须是用户提供的精确字串，逐字粘贴到 prompt。详见 `iron-laws.md` 第 2 条。

3. **同 brand 一组图共享 Brand Identity Lock** — 同品牌的多张图（同活动多平台 / 同系列多张）必须共享一份固定的品牌色 hex + logo 位置 + 字体调性，逐字粘贴到每张 prompt

4. **视觉权重三区分明** — 任意含文字 + 图像的画面必须有 Heavy / Medium / Light 三区。文字落 Medium 区

5. **中文文字渲染策略必须显式选定** — A 嵌入 / B 纯底图（默认）/ C 模板替换。中文长句默认走 B

6. **字体数量 ≤ 3 种**（含中英混排）— 字体过多视觉碎裂。

7. **文字-背景对比度** — 主标题 ≥ 4.5:1，辅助 ≥ 3:1（WCAG 标准）。

8. **极简调性海报文案数 ≤ 2 段** — "极简 / 高级感 / 文艺优雅 / editorial minimal / 杂志感" 等调性的海报，**主标题 + 副标题 = 上限**。禁止小字标注集合（信息标签 / hashtag 链 / "限时活动 / 报名方式 / 价格 / 联系方式 / 二维码说明" 全堆上）。失败模式：调性写"极简古典"但 prompt 没限文案数 → 模型按"高级排版 = 信息密集" 训练先验补全 → 出图像 Pinterest 廉价杂志。

9. **产品标签 / 品牌 logo 字体必须可读** — 当画面含产品瓶身 / 包装 / 品牌牌时，logo 字体必须用**清晰可读的单一字体**（sans-serif 或优雅衬线），**禁止**草书 / 手写体 / blur stylized cursive 渲染。规则覆盖任何含 brand label 元素的子类型（电商 / 美妆 / 食品 / 饮品 / 时尚等）。

   **Prompt 防御标准句**：

   ```
   product label brand name must be clean readable typography,
   no cursive script, no blurred or stylized lettering,
   single readable typeface for brand identification,
   brand logo legible at thumbnail size
   ```

## 全局必填项（任意子类型 brief 缺一不可）

不写这些 → sub-agent 凭训练先验补全 → 拿到结果对不上：

- **场景识别** — 海报 / 封面 / 社媒 / 营销，4 选 1
- **子类型** — 12 子类型选 1（xiaohongshu-cover / movie-poster 等）
- **比例** — 默认走子类型推荐（详见 `defaults.md`）
- **主视觉** — 人物 / 产品 / 场景 / 抽象图形 / 文字本身
- **风格调性** — 商务现代 / 文艺优雅 / 国潮中式 / 科技未来 等
- **是否含文字** — Y/N；Y 则收集所有文字内容（按 Iron Law 第 2 条）
- **配色策略** — 品牌色 hex / 暖冷调 / 单色 / 多彩

## 子类型边界判断（识别歧义时必问）

| 用户说 | 可能是 | AskUserQuestion 选项 |
|---|---|---|
| "做个海报推广新产品" | event-poster vs ad-banner | "品牌曝光 / 转化导向" 二选一 |
| "做个公众号海报" | wechat-cover（头图）vs xiaohongshu-cover（导流到小红书）| 平台二选一 |
| "做个营销图" | ad-banner vs promo-poster | "活动 banner / 促销折扣" 二选一 |
| "海报和小红书都要" | 主场景 + 派生 | "按主场景做再裁切适配其他" |
| "封面和海报都行" | cover vs poster | "依附内容（cover）/ 独立作品（poster）" |

## 服饰 / 鞋靴 / 箱包额外必填

如果设计涉及人物穿戴产品（时尚类海报 / 杂志封面 / 服饰 banner）：

- 性别、版型、廓形显式英文写出
- 模特身份锁（年龄段 / 体型 / 肤色），整组使用同一份 Subject Identity Lock
-

## 配套 reference
> 本文件是子类型层共用规则。子类型独有规则走 `subtypes/{NN}-{name}.md`。

- 防翻车铁律 → `iron-laws.md`
- 子类型索引 → `subtypes-index.md`
- 默认参数 → `defaults.md`
