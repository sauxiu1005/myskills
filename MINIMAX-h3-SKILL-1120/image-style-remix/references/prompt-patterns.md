# 提示词模板与例子

## 默认再创作模板

> 内容原图用于[主要事件、角色数量与分工、动作和场景功能]；[风格参考]仅用于视觉语言。将整幅图重新设计为[所选风格]，人物脸型、五官、身体比例、发型和衣服形体可按该画风再创作，不要求保持照片外形。通过[少量角色区分线索]区分各人，保持[主要动作、视线目标、关键接触和情绪方向]。环境中的[建筑／植物／天空／道具]也使用相同媒介重新设计，允许轮廓、材质、配色和光照变化。采用[所选配方的具体工艺]，沿用[主要视角与目标画幅]。默认无新增文字，不增加无关人物或剧情。

替换变量并删除无用部分，通过真实工具绑定图像，不把模板当API请求体。风格强度控制重新设计的幅度；中等也应有明显画风，不等于轻微滤镜。

## 仅在用户要求时追加的限制

- **保脸**：“保留[指定人物]的[少量面部辨识点]，其余人物造型、衣物和环境仍可风格化。”不能扩大为全图外形锁定。
- **严格还原**：“保持指定人物外形、动作、相机和构图，主要改变媒介、材质与光照表现。”若与大幅重新设计同时出现，先明确哪个要求优先。
- **只改局部**：列出目标区域和需保持的非目标区域；仅接口支持时用真实蒙版，否则说明整图重绘风险。

## 3D实例：双人打开后备厢

以下针对已有双人后备厢图片示范，仅用于相同题材，不把女性、汽车或服装迁移给无关输入。

> Reimagine the supplied scene as a Pixar-style 3D animated feature film still, redesigning both characters and the entire environment rather than preserving the photographic faces. Two adult women have opened a car trunk and are looking down into it. Keep the low viewpoint from inside the trunk, the two-character relationship, and each outer hand supporting the raised lid. Redesign the woman on the left with a compact, rounded silhouette, a short sculpted bob and a curious raised eyebrow; redesign the woman on the right with a contrasting longer face, flowing wavy hair and an amused, slightly skeptical expression. Use moderately enlarged heads and expressive eyes, thick eyelids, soft cheek volumes, clearly shaped noses and mouths, and coordinated eyebrow, cheek and body acting. Keep a few visual cues: a color-block sleeveless outfit and neck scarf on the left, a purple star-patterned outfit and belt on the right; reinterpret the cuts and patterns for animation. Give the skin a soft, luminous response, hair a hierarchy of shaped locks and fine strands, and clothing tangible thickness, stitching and folds. Rebuild the trunk lid, car body, distant buildings and cloudy sky as a cohesive stylized CG world with readable rounded forms, simplified details and rich material differences. Directional light, soft environmental fill and believable contact shadows reveal the forms without hiding the eyes. The characters may look different from the original people, but the action, adult character roles and interaction remain clear. No extra characters, no new incident, no photographic face cutouts, no text or watermark.

造型分工是可选示范，优先遵从当前用户的角色设定。不能把“短发者一定圆脸、长发者一定长脸”固化为所有任务的规则。

## 3D实例：动物表情反差

> 将同一餐桌互动重新创作为皮克斯感三维动画长片画面。水獭与绵羊具有显著不同的体型、吻部、耳形和表情设计；水獭身体前倾、眯眼、鼻尖抬起，绵羊后仰、眉头压低、口鼻皱起，两者仍看向同一盘食物。可重新设计头身比、服装版型与餐馆装潢，保留相反情绪与共同视线目标。短毛贴合水獭的脸部体块，绵羊卷毛形成有大小层次的柔软簇，眼口周围保持表情清楚。衣料、木桌、餐具与瓷砖在同一光源下各有不同表面响应；整个餐馆也是风格化三维世界。不要只用动物头替换真人身体，不能出现额外角色。

具体物种与食物来自当前题材才填写；示例并非每次转换的默认内容。

## 我的世界方块场景模板

> Reimagine [the source event and setting] as a Minecraft-inspired cinematic voxel scene. Redesign every character as a block-built figure with a cuboid head, rectangular torso and limbs, stepped block hair and clothing, and expressive square-pixel facial features. Describe each character separately: [key colors, block hairstyle, accessories, pose and emotional role]. Preserve [character count, main action, gaze targets and physical contacts], not photographic facial likeness. Rebuild [architecture, terrain, plants, sky and essential props] in the same three-dimensional block language, with readable stepped silhouettes and consistent scale. Use crisp, face-aligned low-resolution pixel textures over solid cube and cuboid geometry, directional lighting, soft environmental fill, contact shadows and clear depth. Articulated cuboid limbs may rotate naturally to support the original action. Keep [viewpoint and aspect ratio]. No photo-face patches, smooth human anatomy, flat mosaic overlay, floating disintegration squares, unrequested HUD or copied reference-story elements.

逐项填入当前图像信息。画面中的像素是材质表现，几何本身必须是立体方块；不能把输出压成低分辨率图或用马赛克滤镜代替。参考图的自拍、头巾、树林和摩托车不自动加入。需要明确手势时描述方块手的整体方向与接触对象，不要求逐根逼真手指。

## 美式厚涂动画

09按 [专门提示词](american-painterly-guide.md) 采用“英文风格前缀＋逐人外貌描述＋动作关系＋环境再设计”结构。中文版本同样必须填写当前人物与环境，不只粘贴材质和光照关键词。明确其棱角、成熟、哑光厚涂方向，不混入01的圆润皮克斯造型。

## 修正与记录

> 继续依据内容原图的叙事关系，修正当前结果的[具体问题]，目标是[可见效果]。保留当前结果已成功的[人物再设计、动作、配色、版式与环境]，不因为修正自动恢复照片外形。

记录内容资产、风格参考角色、稳定风格ID、转译模式、最终提示词、实际模型和参数、任务ID、输出版本、实际尺寸及查看状态。没有生成的项目标注待生成，不编造任务ID或效果已改善。
