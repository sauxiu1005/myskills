# 典型场景的完整对话示例

## 示例 1：用户明确知道想要的方向

```
用户：我想做一个赛博朋克风的科幻短片，帮我找参考

Skill 行动：
  1. 跳过 Step 1（用户已明确"科幻"大类）
  2. 直接 Step 2 - 查询 Bitable filter={分类: 科幻}
     展示 5 个科幻风格，赛博朋克标为推荐

  3. 用户确认"赛博朋克"
  4. Step 3 - 生成搜索链接：
     - Shotdeck: https://shotdeck.com/search?q=blade+runner+2049
     - Film-Grab: https://film-grab.com/?s=blade+runner+2049
     - Pinterest: https://www.pinterest.com/search/pins/?q=cyberpunk+cinematography
     - Movies in Color: https://moviesincolor.com/?s=blade+runner

  5. 用户："就用银翼杀手 2049 的感觉"
  6. Step 4 - 询问场景：
     "请描述具体场景：人物 / 动作 / 环境 / 镜头"

  7. 用户："女主角穿黑色风衣走过霓虹街道，特写"
  8. 输出最终 prompt：

     "cyberpunk, neon-lit rainy night, high contrast, blade runner 2049 aesthetic,
      female protagonist in black trench coat walking through neon-lit street,
      close-up shot, holographic ads, 16:9 cinematic, high detail"

  9. 询问："直接调用 video-prompting Skill 生成视频镜头描述？"
```

## 示例 2：用户氛围模糊，需要引导

```
用户：我要做一个有"高级感"的广告片

Skill 行动：
  1. "高级感"太模糊，触发引导
  2. AskUserQuestion："以下哪个氛围最接近？"
     - 极简克制（北欧极简、A24）
     - 史诗大气（诺兰式、漫威式）
     - 复古质感（70s 颗粒、Y2K）
     - 文艺浪漫（王家卫、韩式都市）

  3. 用户选"极简克制"
  4. 查询 Bitable filter={氛围标签 contains 极简}
     返回：硬科幻、库布里克式、北欧极简、京阿尼、王家卫式（部分）

  5. 用户确认"北欧极简"
  6. Step 3 - 搜索链接：
     - Film-Grab: https://film-grab.com/?s=the+hunt+2012
     - Pinterest: https://www.pinterest.com/search/pins/?q=nordic+minimalism+cinematography

  7. Step 4 - 输出 prompt（含场景描述）
```

## 示例 3：用户已有参考图

```
用户：[上传一张电影截图] 我想做这种感觉的视频

Skill 行动：
  1. 跳过 Step 1-3
  2. 用 WebFetch 或多模态调用反推风格关键词
     "看起来像 Wong Kar-wai 风格的霓虹街景..."

  3. AskUserQuestion 确认：
     "我识别到这是港风/王家卫式，是否正确？"
     - 是，进入 Step 4
     - 否，让我重新选

  4. 直接进入 Step 4 输出 prompt
```

## 示例 4：用户想对标某个具体导演

```
用户：我想拍出诺兰那种感觉

Skill 行动：
  1. 直接进入 Step 2，filter={代表导演 contains 诺兰}
     返回：诺兰式、漂白工艺（Nolan 也用）

  2. 用户确认"诺兰式"
  3. Step 3 - 生成搜索链接（聚焦于 Nolan 作品）：
     - Shotdeck: https://shotdeck.com/search?q=christopher+nolan
     - Film-Grab: https://film-grab.com/?s=oppenheimer
     - Film-Grab: https://film-grab.com/?s=tenet

  4. Step 4 - 输出 prompt
```

## 示例 5：嵌入到 mv-creator 流程

```
mv-creator 在「阶段三：美术风格」时调用本 Skill：

mv-creator → film-style-picker (with context):
  - song_theme: "都市孤独"
  - lyric_mood: "夜晚 + 霓虹 + 哀愁"
  - target_aesthetic: "电影感 + 复古"

film-style-picker 自动推荐：
  Top 1: 王家卫式（匹配：都市 + 霓虹 + 复古 + 哀愁）
  Top 2: A24 风（匹配：都市孤独 + 电影感）
  Top 3: 韩式都市（匹配：都市 + 复古暖光）

让用户选择后，把 prompt 模板回传给 mv-creator 用于后续分镜生成。
```

## 边界情况处理

### 情况 1：用户说"我不知道"
→ 提供 4 大类视觉感受（写实 / 科幻奇幻 / 动画 / 复古）让用户选

### 情况 2：用户给的导演不在库里
→ Pinterest + Google Images 兜底搜索，但提示"该导演未在风格库中，结果仅供参考"

### 情况 3：Bitable API 失败
→ 切换到 `references/style-fallback.md` 的内置数据，正常完成流程

### 情况 4：用户全程没看图就要 prompt
→ 跳过 Step 3 也允许，直接给 Step 4 的 prompt 模板
