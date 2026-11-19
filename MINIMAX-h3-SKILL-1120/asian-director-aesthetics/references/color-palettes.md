# 28 位导演可视化色卡

## 资源与证据边界

本库把用户提供的 `导演视觉风格色卡_SKILL` 中对应 28 份主文档的六色主板、四色情绪板绘制为本地图片；28 份主板逐项对照安装包既有 HEX 表，全部一致。原文件夹中这 28 位对应的色卡 PNG 与 palette.json 未随附，不能把 Markdown 中的图片链接视为已存在资源。本轮依据实际可读取的文档补绘，没有逐帧取样或补造电影截图。

- 每位：1600×900 PNG、可编辑 SVG、包含色名／HEX／RGB／来源相对路径及 SHA-256 的 JSON。
- [总览 PNG](../assets/color-palettes/overview.png)；[离线浏览页](../assets/color-palettes/index.html)；[资源清单](../assets/color-palettes/manifest.json)。
- 色值按 sRGB 解释。色块等宽显示，去除原资料的固定百分比，不预设主色、辅色或强调色的实际面积。
- 四色情绪板沿用原资料名称或情绪标签，只表示创作联想，不是颜色与情绪的普遍对应关系。

## 调用方式

1. 先按导演条目选具体作品与场景，再查看对应 PNG、读取 JSON；不默认载入全部 28 张。
2. 将选中的颜色落实到物件、背景、光源、阴影或服装，说明主次关系。用户参考图、作品专项研究及实际场景优先于这份通用色板；王家卫、张艺谋、贾樟柯的专项文字研究与分析继续保留，但不随包提供电影截图。实际图像参考仅使用当次任务中真实可用、获准使用的素材；没有图像输入时，可依据文字研究设计，不宣称已读取对应画面。黑白作品不直接套用彩色主板，动画不因此自动增加胶片纹理。
3. 色卡供选色，不替代人物、构图、材质或光比分配参考。不要让生成模型把卡片上的色块、文字或排版画进成品。生成图片、首帧、关键视觉图、关键帧及人物锚点时，实际查看对应PNG和JSON，将PNG载入项目并在每次相关生图中传入，标注“仅用于所选颜色，不复制文字、色块或排版”；只写色名或HEX不算传入色卡。模型不支持、色卡缺失或槽位与身份／布局参考冲突时先说明并确认解决方式，不静默降级；用户明确禁止图片参考或明确批准文字配色时，标注获准例外。仅提示词任务不生成。
4. 用户要求原片实测时，本库不能作为已采样证据。需另行取得明确来源的帧、记录版本和取样方法，再建立场景专用色板；不可把现有 HEX 改称电影官方或实测色值。

## 导演索引

| 导演 | PNG | SVG | JSON |
|---|---|---|---|
| [王家卫](wong-kar-wai.md) | [查看](../assets/color-palettes/wong-kar-wai.png) | [矢量](../assets/color-palettes/wong-kar-wai.svg) | [色值](../assets/color-palettes/wong-kar-wai.json) |
| [李安](ang-lee.md) | [查看](../assets/color-palettes/ang-lee.png) | [矢量](../assets/color-palettes/ang-lee.svg) | [色值](../assets/color-palettes/ang-lee.json) |
| [徐克](tsui-hark.md) | [查看](../assets/color-palettes/tsui-hark.png) | [矢量](../assets/color-palettes/tsui-hark.svg) | [色值](../assets/color-palettes/tsui-hark.json) |
| [蔡明亮](tsai-ming-liang.md) | [查看](../assets/color-palettes/tsai-ming-liang.png) | [矢量](../assets/color-palettes/tsai-ming-liang.svg) | [色值](../assets/color-palettes/tsai-ming-liang.json) |
| [贾樟柯](jia-zhangke.md) | [查看](../assets/color-palettes/jia-zhangke.png) | [矢量](../assets/color-palettes/jia-zhangke.svg) | [色值](../assets/color-palettes/jia-zhangke.json) |
| [张艺谋](zhang-yimou.md) | [查看](../assets/color-palettes/zhang-yimou.png) | [矢量](../assets/color-palettes/zhang-yimou.svg) | [色值](../assets/color-palettes/zhang-yimou.json) |
| [陈凯歌](chen-kaige.md) | [查看](../assets/color-palettes/chen-kaige.png) | [矢量](../assets/color-palettes/chen-kaige.svg) | [色值](../assets/color-palettes/chen-kaige.json) |
| [侯孝贤](hou-hsiao-hsien.md) | [查看](../assets/color-palettes/hou-hsiao-hsien.png) | [矢量](../assets/color-palettes/hou-hsiao-hsien.svg) | [色值](../assets/color-palettes/hou-hsiao-hsien.json) |
| [毕赣](bi-gan.md) | [查看](../assets/color-palettes/bi-gan.png) | [矢量](../assets/color-palettes/bi-gan.svg) | [色值](../assets/color-palettes/bi-gan.json) |
| [吴宇森](john-woo.md) | [查看](../assets/color-palettes/john-woo.png) | [矢量](../assets/color-palettes/john-woo.svg) | [色值](../assets/color-palettes/john-woo.json) |
| [姜文](jiang-wen.md) | [查看](../assets/color-palettes/jiang-wen.png) | [矢量](../assets/color-palettes/jiang-wen.svg) | [色值](../assets/color-palettes/jiang-wen.json) |
| [关锦鹏](stanley-kwan.md) | [查看](../assets/color-palettes/stanley-kwan.png) | [矢量](../assets/color-palettes/stanley-kwan.svg) | [色值](../assets/color-palettes/stanley-kwan.json) |
| [杨德昌](edward-yang.md) | [查看](../assets/color-palettes/edward-yang.png) | [矢量](../assets/color-palettes/edward-yang.svg) | [色值](../assets/color-palettes/edward-yang.json) |
| [许鞍华](ann-hui.md) | [查看](../assets/color-palettes/ann-hui.png) | [矢量](../assets/color-palettes/ann-hui.svg) | [色值](../assets/color-palettes/ann-hui.json) |
| [黑泽明](akira-kurosawa.md) | [查看](../assets/color-palettes/akira-kurosawa.png) | [矢量](../assets/color-palettes/akira-kurosawa.svg) | [色值](../assets/color-palettes/akira-kurosawa.json) |
| [小津安二郎](yasujiro-ozu.md) | [查看](../assets/color-palettes/yasujiro-ozu.png) | [矢量](../assets/color-palettes/yasujiro-ozu.svg) | [色值](../assets/color-palettes/yasujiro-ozu.json) |
| [北野武](takeshi-kitano.md) | [查看](../assets/color-palettes/takeshi-kitano.png) | [矢量](../assets/color-palettes/takeshi-kitano.svg) | [色值](../assets/color-palettes/takeshi-kitano.json) |
| [岩井俊二](shunji-iwai.md) | [查看](../assets/color-palettes/shunji-iwai.png) | [矢量](../assets/color-palettes/shunji-iwai.svg) | [色值](../assets/color-palettes/shunji-iwai.json) |
| [朴赞郁](park-chan-wook.md) | [查看](../assets/color-palettes/park-chan-wook.png) | [矢量](../assets/color-palettes/park-chan-wook.svg) | [色值](../assets/color-palettes/park-chan-wook.json) |
| [奉俊昊](bong-joon-ho.md) | [查看](../assets/color-palettes/bong-joon-ho.png) | [矢量](../assets/color-palettes/bong-joon-ho.svg) | [色值](../assets/color-palettes/bong-joon-ho.json) |
| [阿彼察邦](apichatpong-weerasethakul.md) | [查看](../assets/color-palettes/apichatpong-weerasethakul.png) | [矢量](../assets/color-palettes/apichatpong-weerasethakul.svg) | [色值](../assets/color-palettes/apichatpong-weerasethakul.json) |
| [陈英雄](tran-anh-hung.md) | [查看](../assets/color-palettes/tran-anh-hung.png) | [矢量](../assets/color-palettes/tran-anh-hung.svg) | [色值](../assets/color-palettes/tran-anh-hung.json) |
| [阿巴斯·基亚罗斯塔米](abbas-kiarostami.md) | [查看](../assets/color-palettes/abbas-kiarostami.png) | [矢量](../assets/color-palettes/abbas-kiarostami.svg) | [色值](../assets/color-palettes/abbas-kiarostami.json) |
| [宫崎骏](hayao-miyazaki.md) | [查看](../assets/color-palettes/hayao-miyazaki.png) | [矢量](../assets/color-palettes/hayao-miyazaki.svg) | [色值](../assets/color-palettes/hayao-miyazaki.json) |
| [今敏](satoshi-kon.md) | [查看](../assets/color-palettes/satoshi-kon.png) | [矢量](../assets/color-palettes/satoshi-kon.svg) | [色值](../assets/color-palettes/satoshi-kon.json) |
| [新海诚](makoto-shinkai.md) | [查看](../assets/color-palettes/makoto-shinkai.png) | [矢量](../assets/color-palettes/makoto-shinkai.svg) | [色值](../assets/color-palettes/makoto-shinkai.json) |
| [押井守](mamoru-oshii.md) | [查看](../assets/color-palettes/mamoru-oshii.png) | [矢量](../assets/color-palettes/mamoru-oshii.svg) | [色值](../assets/color-palettes/mamoru-oshii.json) |
| [汤浅政明](masaaki-yuasa.md) | [查看](../assets/color-palettes/masaaki-yuasa.png) | [矢量](../assets/color-palettes/masaaki-yuasa.svg) | [色值](../assets/color-palettes/masaaki-yuasa.json) |
