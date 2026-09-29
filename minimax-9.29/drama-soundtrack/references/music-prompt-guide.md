# 音乐 Prompt 工程指南

为 Music API 构建高质量 prompt 的参考词汇表。Prompt 应使用英文。

## Prompt 结构模板

### 人声曲（music_generation_song）

```
A [mood] [genre] song, [tempo] BPM, featuring [vocal description],
with [key instruments], [atmosphere/texture], [cultural reference if applicable]
```

示例：
```
A melancholic Chinese pop ballad, 75 BPM, featuring warm breathy female vocals,
with piano lead, orchestral strings, subtle guzheng accents, intimate and emotionally vulnerable,
modern production with traditional Chinese elements
```

### 纯器乐（music_generation_instrumental）

```
[mood] [genre] instrumental, [tempo], [key instruments],
[texture/dynamic description], [cinematic quality], [cultural context]
```

示例：
```
Tense orchestral instrumental, building from sparse to full,
war drums, low brass, tremolo strings, timpani rolls,
cinematic suspense, ancient Chinese court intrigue atmosphere
```

## 风格标签词库

### 流派 (Genre)
| 类别 | 标签 |
|------|------|
| 流行 | pop, pop ballad, synth pop, indie pop, dream pop, city pop |
| 摇滚 | rock, soft rock, alt rock, post-rock, progressive rock |
| 电子 | electronic, EDM, ambient, lo-fi, synthwave, chillwave |
| 古典/管弦 | orchestral, cinematic, classical, chamber music, symphonic |
| 民谣 | folk, acoustic, indie folk, country |
| R&B/Soul | R&B, soul, neo-soul, jazz |
| 嘻哈 | hip-hop, trap, boom bap |
| 中国传统 | Chinese traditional, guofeng, ancient Chinese |
| 日韩 | J-pop, K-pop, J-rock, anime OST |
| 融合 | traditional-modern fusion, east-west fusion, crossover |

### 情绪 (Mood)
| 情感方向 | 标签 |
|----------|------|
| 温暖 | warm, tender, intimate, gentle, cozy, heartwarming |
| 忧伤 | melancholic, sorrowful, bittersweet, wistful, nostalgic, longing |
| 紧张 | tense, suspenseful, uneasy, ominous, threatening, anxious |
| 史诗 | epic, grand, majestic, triumphant, soaring, powerful |
| 欢快 | upbeat, cheerful, playful, bouncy, bright, joyful |
| 黑暗 | dark, brooding, sinister, haunting, eerie, mysterious |
| 平静 | serene, peaceful, meditative, tranquil, ethereal, dreamy |
| 激昂 | intense, fierce, aggressive, driving, energetic, explosive |
| 浪漫 | romantic, sweet, passionate, sensual, dreamy |
| 悲壮 | noble, tragic, heroic, sacrificial, bittersweet triumph |

### 乐器 (Instruments)
| 类别 | 标签 |
|------|------|
| 键盘 | piano, grand piano, electric piano, Rhodes, organ, synth pad |
| 吉他 | acoustic guitar, electric guitar, classical guitar, fingerpicking |
| 弦乐 | strings, violin, viola, cello, double bass, string ensemble, pizzicato |
| 管乐 | flute, clarinet, oboe, French horn, trumpet, trombone |
| 打击 | drums, percussion, timpani, war drums, taiko, hand claps, finger snaps |
| 电子 | synth, synth lead, synth bass, drum machine, arpeggiator, pad |
| 中国传统 | guzheng, erhu, dizi, pipa, xiao, yangqin, guqin |
| 日本 | shamisen, koto, shakuhachi, taiko |
| 韩国 | gayageum, haegeum, daegeum |
| 其他 | harp, accordion, harmonica, music box, choir, vocal harmonies |

### 人声描述 (Vocal Style)
| 维度 | 标签 |
|------|------|
| 性别 | male, female, androgynous |
| 音域 | soprano, alto, tenor, baritone, bass, wide range, falsetto |
| 质感 | breathy, raspy, husky, clear, crystalline, silky, warm, rich |
| 力度 | powerful, delicate, whispered, belting, restrained, soaring |
| 情感 | emotionally vulnerable, passionate, detached, yearning, defiant |

### 制作质感 (Production)
| 风格 | 标签 |
|------|------|
| 极简 | minimal, stripped-down, sparse, bare, raw |
| 丰满 | lush, layered, full, rich arrangement, wall of sound |
| 电影感 | cinematic, dramatic, sweeping, film score quality |
| 复古 | vintage, retro, lo-fi, analog, tape warmth, vinyl crackle |
| 现代 | modern production, polished, crisp, hi-fi |
| 氛围 | atmospheric, ambient, spacious, reverb-heavy, echo |

### 节奏 (Tempo)
| 速度 | BPM 范围 | 标签 |
|------|----------|------|
| 极慢 | 40-60 | molto lento, extremely slow, glacial |
| 慢速 | 60-80 | slow, ballad tempo, gentle pace |
| 中慢 | 80-100 | moderate, mid-tempo, relaxed groove |
| 中速 | 100-120 | moderate, steady, walking pace |
| 中快 | 120-140 | upbeat, lively, energetic |
| 快速 | 140-170 | fast, driving, high energy |
| 极快 | 170+ | very fast, frantic, breakneck |

## Prompt 优化技巧

1. **前置核心风格**：最重要的风格标签放在 prompt 开头
2. **避免矛盾**：不要同时使用 "peaceful" 和 "aggressive"
3. **具体优于抽象**："solo cello with piano accompaniment" 优于 "sad music"
4. **动态描述**：描述音乐的变化弧线 "building from sparse piano to full orchestra"
5. **参考锚定**：可使用风格参考 "in the style of film score, similar to Hans Zimmer"
6. **文化一致性**：古装剧优先使用传统乐器标签，现代剧优先使用现代乐器
