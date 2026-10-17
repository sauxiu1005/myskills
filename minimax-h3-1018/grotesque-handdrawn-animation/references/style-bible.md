# GH-01：唯一画面风格规范

这是固定美术方向，不是候选风格列表。首次使用时读取 [母版清单](../assets/style-master.yaml)，仅在已选定状态下使用清单指向的新生成母版 S0。原用户截图已经停用，不再作为生图输入，也不放入新发布包。

## 固定视觉语法

| 项目 | 固定要求 | 可以变化的内容 |
|---|---|---|
| 媒介 | 二维数字手绘插画，平涂大色块与少量柔和深浅，哑光表面 | 场景、道具、题材 |
| 主色 | 蓝青/孔雀蓝与珊瑚橙/朱红对照 | 两组色彩占比、明度、昼夜 |
| 辅色 | 少量奶油白、黄、灰绿；深蓝黑用于轮廓与暗部 | 角色识别色和局部强调位置 |
| 人物 | 长鼻或几何鼻、简化眼口、不对称脸型、拉长或压缩比例、清楚剪影 | 年龄、体型、发型、物种、表情与夸张幅度 |
| 轮廓 | 细而略不规则的深色手绘线，不是规整矢量线 | 随景别保持线条可读性 |
| 肌理 | 刻线排线、短划痕、沿衣物和头发结构的彩铅线、细颗粒纸感 | 近景细密，远景简化；非全屏同强度噪点 |
| 光线 | 插画式戏剧化明暗，主体与背景有层次，体积保持平面化 | 光源位置、时间、叙事情绪 |
| 空间 | 有透视的舞台布景、前中后景遮挡、轻微比例变形 | 开阔或拥挤、温暖或紧张；不强制压迫 |
| 运动 | 清晰姿态、可读表情、二维手绘感、稳定形体与附着纹理 | 节奏、动作强度与镜头功能 |

### 配色锚点

以下为根据参考图拟定的制作参考色，不是精确采样值，也不是生图模型的输出保证：
- 深蓝 `#07354A`；蓝青 `#16748D`；青绿 `#248A8C`。
- 珊瑚橙 `#F46A42`；朱红 `#D94B43`；暖粉 `#E89C8F`。
- 奶油白 `#EEE6BD`；少量黄 `#F0C84B`；橄榄绿 `#7C8050`。

冷暖占比由场景决定，但全片不引入另一套高饱和紫绿/霓虹粉主色。昼夜继承同一组色相，不靠统一滤镜解决不一致。角色肤色可以非自然，但每个角色基准肤色一旦锁定就不变；光照不能解释无缘无故换色。

## 排除的画法与误解

不混入皮克斯式 3D、黏土、毛毡、真实皮肤与摄影散景、日漫标准脸、光滑矢量、厚油画堆色、透明水彩晕染作为主画法。不堆叠相互竞争的艺术家或动画品牌名。背景和人物使用同一线条、色块和肌理系统。

怪诞不等于血腥、恐怖、冷漠或全员空洞眼神。允许微笑、感动、好奇与温柔，用外形比例保持辨识度。不要自动复制公交车、吸烟、黑发女子或宴会。无剧情时可推荐原创讽喻故事，同时允许其他题材及自定义；题材不改变画风。

## 固定风格文本 STYLE_CORE

每次生图沿用同一段，内容描述置于前面；不要逐镜更换同义词或添加其他画法。工具有独立风格字段时映射到该字段，避免重复附加。

```text
2D grotesque hand-drawn illustration, flat matte color shapes, deep teal and peacock blue contrasted with coral orange and vermilion, sparse cream and yellow accents, asymmetrical stylized characters with elongated noses and simplified eyes, fine irregular ink contours, directional colored-pencil hatching and delicate etched scratch lines, subtle mottled paper grain, layered theatrical space, restrained painterly shading and graphic light-dark separation
```

固定排除项（映射到支持的负向字段，不支持时查看输出是否出现这些画法）：

```text
photorealism, 3D rendering, glossy plastic, clay, felt, anime styling, clean vector art, thick impasto, watercolor washes, neon gradients, interface overlays, play buttons, watermarks, accidental text
```

## Skill 级固定母版 S0

[style-master.yaml](../assets/style-master.yaml) 登记唯一活动母版的版本、文件与 SHA-256。所有项目继承相同图像内容；平台素材 ID 可不同。角色卡负责身份，场景卡负责空间，项目成图不能擅自替换母版。

原截图母版 r1 已按用户要求停用。仅用户要求更换母版时，使用当前选定生图工具制作原创新母版，禁止将原截图作为风格、图像、身份参考或编辑输入；不得复制其人物、公交车、吸烟和播放图标。用户提供原图仅帮助人工理解视觉特征，固定 STYLE_CORE 负责表达该画风。

母版升级可先用同一套 STYLE_CORE 与参数生成几张原创干净候选，覆盖人物近景、全身和环境，不是不同风格菜单。仅此母版升级初始化可使用文生图，不依赖尚不存在的新 S0；正常资产生成仍须引用包内已发布 S0。风格候选不能充当角色身份参考；选定一张后登记为唯一 S0，其余图用于审阅，不随机轮换引用。完成具体图像审阅和选定后发布文件、版本、校验值及生成记录。

母版清单未选定或文件缺失时，继续故事策划与明确授权的母版候选制作，不开始正式项目批量生产。已有项目从 r1 迁移时更新风格设置，并在正常制作产物中检查画风，不另做校准任务。正常资产生成选择支持风格图参考的模型，实际使用本包 S0；用户选择优先并核验当前能力，固定画风保持不变。见 [生图工作流](image-workflow.md)。

当前发布的 r2 母版为 [B3 人物近景](../assets/style-reference.png)，来自 MJ 8.2 纯文字生成并经视觉审阅。生成记录见 [generated-reference-record.json](../assets/generated-reference-record.json)。[A3 群像示例](../assets/style-example-group.png) 与 [C4 环境示例](../assets/style-example-environment.png) 只用于人工审阅画风，不是可轮换 S0，也不是同一角色多视图。三图不是同一角色，不用于替代项目角色卡。
