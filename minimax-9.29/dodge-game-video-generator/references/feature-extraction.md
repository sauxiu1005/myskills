# 从用户照片提取 Subject Brief

用户在 Step 1 上传一张照片，skill 必须从照片里提取主角的 **核心特征**，并用 2D 蜡笔/彩铅 Q 版的口吻写成 `subject_brief`，再喂给后续的 4 张关键帧 + 视频 prompt。

---

## 1. 提取步骤（5 步必走）

### Step 1.1 · 看生物类型
- 人类 / 猫 / 狗 / 兔子 / 鸟类 / 卡通角色 / 拟人化物体 / 真实物体
- 决定 `{{SUBJECT}}` 槽位：
  - "a round chibi puppy" / "a round chibi kitten" / "a round chibi cartoon boy with messy hair" / "a round chibi version of a red apple with a leaf" 等

### Step 1.2 · 看主体颜色（base + accent）
- 主色块（占比 > 50%）
- 副色块（点缀、腹部、耳朵内侧等）
- 决定 `subject_brief` 的色系描述

### Step 1.3 · 看辨识特征（最关键的"身份锚"）
按优先级挑 3-5 个**剪影就能认出**的特征：

| 类别 | 例子 |
|---|---|
| 头部 | 大耳朵、耷拉耳、长耳、角、毛茸茸脑袋、光头、刘海 |
| 五官 | 大眼睛、眯眯眼、眼镜、缺牙、长鼻子、长吻部 |
| 身体 | 大肚子、圆滚、瘦长、四足、二足、有翅膀/鳍 |
| 尾巴 | 长尾、卷尾、蓬松尾、缺尾、翘尾 |
| 配饰 | 帽子、围巾、项圈、眼镜、背包、蝴蝶结 |
| 纹理 | 斑点、条纹、纯色、渐变 |

> **挑选原则**：选**最独特**的，不要堆砌。比如用户上传一只戴墨镜的橘猫，保留"橘色 + 圆脸 + 墨镜"就够了，不要再去描述胡须/爪子/舌头。

### Step 1.4 · 决定可夸张形变部位
游戏里主角身体要像橡皮筋一样被拉伸 / 压扁 / 拱起 / 侧闪，所以必须确认**哪个身体部位最适合做 Q 弹形变**。

| 主体类型 | 推荐形变部位 | 原因 |
|---|---|---|
| 狗/猫/四足动物 | 整个躯干（拉长/压缩/拱起/侧闪都能做） | 躯干有弹性空间，4 条腿稳定 |
| 鸟类 | 脖子 + 躯干 | 脖子天然可拉伸 |
| 鱼类 | 整个身体（鱼身天然弯曲） | 弯成 S 形很自然 |
| 圆物体（苹果/西瓜） | 整个圆身 | 压缩/拉伸都成立 |
| 角色（人类 Q 版） | 躯干 + 表情 | 人类 Q 版身体弹性中等 |
| 长物体（铅笔/胡萝卜） | 整体弯曲 | 弯成弧形/螺旋形 |

> **关键提醒**：在 `subject_brief` 里必须明确写出"可被夸张拉伸/压扁/拱起/侧闪"。否则视频模型会按"写实可变形"做，导致动作僵硬。

### Step 1.5 · 输出 subject_brief（2D 蜡笔 Q 版口吻）

**口吻规则**：
- ✅ 用"圆润 Q 版"、"大 X 小 Y"、"半眯 X 又 Y 表情"这种描述
- ❌ 不用"写实"、"高清"、"毛茸茸"这种写实描述
- ✅ 用"蜡笔 / 彩铅风"明确风格
- ❌ 不写真实摄影、3D 写实

**输出模板**：

```
{{SUBJECT_BRIEF}} =
"a round chibi (Q-version) [生物类型] with [主色] [身体主特征]
and [副色] [点缀特征]. Key features: [辨识特征 1],
[辨识特征 2], [辨识特征 3], [辨识特征 4 if any].
Default face: [表情关键词, 如 half-closed lazy eyes / cheeky smirk /
tongue peeking / curious look].
The body is squishy and rubber-band-like — it can be stretched,
squished, arched, or side-stepped dramatically while keeping the
same identity and 2D crayon/pencil art style."
```

---

## 2. 真实案例对照

### 案例 A · 用户上传一张橘猫照片

**生物类型**：cat
**主色**：orange tabby
**辨识特征**：round face, big eyes, small triangular ears, white chest, pink nose
**形变部位**：整个躯干

**输出的 subject_brief**：

```
SUBJECT: "a round chibi kitten"
SUBJECT_BRIEF: "a round chibi orange tabby kitten with a plump
  Q-version body, big round curious eyes, small triangular ears
  that flop a bit, white chest and belly, pink nose, and a small
  fluffy tail. Default face: half-closed eyes with a cheeky,
  mildly bored 'whatever' look. The body is squishy and
  rubber-band-like — it can be stretched, squished, arched, or
  side-stepped dramatically while keeping the same identity and
  2D crayon/pencil art style."
```

### 案例 B · 用户上传一张戴眼镜的程序员小哥

**生物类型**：human (cartoon boy)
**主色**：肤色（warm beige）+ 黑色 T 恤
**辨识特征**：黑框眼镜、锅盖头、瘦
**形变部位**：躯干 + 表情

**输出的 subject_brief**：

```
SUBJECT: "a round chibi cartoon boy"
SUBJECT_BRIEF: "a round chibi cartoon boy programmer with a
  warm-beige face, a neat black bowl-cut hairstyle, big black
  square glasses, a plain black T-shirt, and slightly skinny
  but squishy Q-version body proportions. Default face:
  half-closed lazy eyes with a cheeky 'too cool for this' smirk.
  The body is squishy and rubber-band-like — it can be stretched,
  squished, arched, or side-stepped dramatically while keeping
  the same identity and 2D crayon/pencil art style."
```

### 案例 C · 用户上传一张红色苹果

**生物类型**：fruit
**主色**：red
**辨识特征**：圆、上面有绿叶、棕色短茎
**形变部位**：整个圆身

**输出的 subject_brief**：

```
SUBJECT: "a round chibi anthropomorphic red apple"
SUBJECT_BRIEF: "a round chibi anthropomorphic red apple with a
  glossy red round body, a small green leaf on top, a tiny
  brown stem, and a tiny cute face drawn on the front (two
  dot eyes and a small smile). Tiny stick arms and legs.
  Default face: half-closed eyes with a cheeky 'you can't
  catch me' smirk. The body is squishy and rubber-band-like —
  it can be stretched, squished, arched, or side-stepped
  dramatically while keeping the same identity and 2D
  crayon/pencil art style."
```

---

## 3. 4 张关键帧调用时怎么传

调用 `image_synthesize` 时：

```python
image_synthesize(requests=[{
  "prompt": "<关键帧 #1 prompt，subject_brief 已嵌入>",
  "output_file_path": "dodge-game/01-up.png",
  "input_file_paths": ["<用户照片绝对路径>"],   # ← 关键
  "aspect_ratio": "4:3",
  "resolution": "2K"
}, ...])
```

**为什么传用户照片**：
- 让图片生成模型参考照片中主体的**真实身份特征**（颜色、形状、配饰）
- 但**强制**用 2D 蜡笔 Q 版重画（prompt 里的画风硬约束会压过照片的写实感）
- 这是"identity-preserving style transfer"的核心手段

---

## 4. 视频 first_frame 用哪张图

推荐用 **关键帧 #1（上躲姿态）**，原因：
- 身体形变最明显，能让视频模型"学到"这个角色可以怎么动
- 构图最稳定，主角在画面中央偏下，手掌从下方进入，HUD 完整可见
- 视频一开始就是 BEAT 1 起始状态，节奏最自然

把 4 张图都试过，发现 #1 的成功率最高。
