# 看图、选择、生图 / Inspect, choose, generate

这是为用户新增的交互层，不是源码提取出的菜单。选项必须根据图像调整，不能每次套相同风格组合。
This is an authored interaction layer requested by the user, not an extracted menu. Tailor the choices to the image.

## 第一轮的交付 / First response

先实际看图，再用简短观察解释原有主光、软硬、冷暖和主体分离情况，并指出证据，如鼻影、衣服反光、产品边缘高光或地面投影。区分“能看到”和“大致推测”。不能从一张照片保证精确灯数或功率。
Inspect first and cite visible clues. Distinguish observations from estimates rather than asserting exact equipment or angles.

推荐方案需包含：改善目标、光源角色及方向、软硬与冷暖、背景策略、预期变化和保留内容。不要让用户先阅读技术JSON。
The recommendation links the improvement goal to light direction/role, softness/color, background, expected result and preserved content.

## 一次轻量选择 / One compact selection

以下是假设性示例，不是对任何当前图片的观察，也不是固定配方：若真实观察到人像正面光偏平、面部层次不足，可提供：
Hypothetical example only: if a real portrait shows flat frontal lighting, the interaction might be:

- 风格 S1：自然柔和（推荐），保持真实肤色、轻微增强面部层次；S2：立体明暗，提高明暗分界与轮廓感。
- 灯位 A1：左前上方（推荐），使脸部有柔和明暗过渡；A2：保留原光向，变化更小。
- 默认保留背景、身份与构图，生成1张。“回复S1+A1，或直接说按推荐来，也可以描述想要的效果；选好后我就按方案生成。”

Possible English version: “I suggest a softer upper-left key to give the face gentle depth while preserving your original scene. Choose S1 natural softness (recommended) or S2 stronger modeling; A1 upper-left front (recommended) or A2 original direction. I will create one image after your choice; ‘use the recommendation’ is enough.”

不是每张图都要问冷暖、背景和强度。用户已指定方向就不再问方向；产品图可把风格改成标签清晰、突出材质等具体目标。原图适合强光时可推荐保留。明确“保持原图”且不需调整时不浪费生成。
Skip settled dimensions. Product choices can emphasize label readability or material definition. Preserve intentional lighting when appropriate; do not generate unnecessarily when the user chooses no change.

## 状态与授权 / States and authorization

| 状态 / State | 行动 / Action |
|---|---|
| 没有可读原图 / Missing image | 请求图片；不编造分析 / Request it without fabricated observations |
| 已分析，选项待答 / Awaiting choice | 等用户真实回复，可准备草稿和检查工具；不提交生图 / Prepare, but do not submit |
| 用户选择或说按推荐 / Selected | 回显组合，调用编辑工具；不重复问确认 / Echo plan and edit without redundant confirmation |
| 用户先前要求“你定直接做” / Delegated | 简述方案后执行，不强制选择 / State plan and proceed |
| 用户选了风格但说先别生成 / Hold | 仅准备方案；等待后续执行指令 / Prepare only and wait |
| 只分析或只要提示词 / Text only | 输出该阶段结果，不生图 / Deliver requested text only |
| 未知费用/工具需审批 / Cost or approval gap | 按实际工具规则处理；选风格不等于同意新费用 / Resolve the actual billing/approval requirement |
| 工具返回异步任务 / Running | 追踪同一任务，不重复提交 / Follow the same task |
| 生图完成 / Generated | 看图验收并展示结果 / Inspect and show the image |
| 失败/能力不可用 / Failed or unavailable | 说明具体阻碍，保留方案与提示词；不声称成功 / Explain blocker and preserve completed work |
| 用户要求微调 / Revision | 改对应变量，复用原图与未修改选择，预算规则仍有效 / Update selected variables using original content |

只有“用户明确委托”才能跳过选择，默认推荐和超时不能代替选择。异步文字问答不能要求用户通过它上传图片，需使用正常附件入口。
Only explicit delegation bypasses selection; defaults and timeout do not. Request image attachments through an actual attachment-capable interface.

## 输出验收 / Result review

比较原图与结果，关注：选定光向是否成立、光影是否有真实变化、肤色/材质是否合理、身份姿态是否稳定、背景是否按选择处理。只说明实际看见的变化。给最多三个短微调入口；不自动循环生成。
Compare the original and result for selected direction, genuine lighting change, natural materials, identity/pose retention and background policy. State observed changes and offer at most three short refinements without automatic regeneration.
