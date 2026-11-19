# 产品广告项目报告

## 交付与复现

| 内容 | 相对路径 | 实际检查与限制 |
|---|---|---|
| H3 最终 MP4 | final_h3.mp4 | 实际生成状态、时长/尺寸/帧率/音频/播放与主体一致性 |
| Blender 运动底片 | blender_motion.mp4 | 混合运镜、切点、背景时序检查 |
| 4张原帧与4张广告关键帧 | keyframes/source/、keyframes/ad/、keyframes/manifest.md | 首尾与两内部状态、映射、选择理由、美术与主体一致性 |
| H3生成记录 | h3/prompt.txt、h3/request.json、h3/run-report.md | 真实接口、素材角色、任务ID、参数、结果、迭代与限制；无密钥 |
| 完整产品母模型 | PRODUCT_MASTER.blend | 重开、装配基准、单位 |
| 可编辑影片工程 | FILM.blend 或逐镜工程 | 相机/动画/文字/合成及外链 |
| 必要镜头资产及清单 | shot_assets/ | 如仅复用，给出映射清单 |
| 静态验证、预览与最终序列 | renders/ | 实际文件和版本；缺帧检查 |
| 实际执行脚本 | scripts/ | Blender 版本、运行参数和顺序 |
| 分镜 / shot list | storyboard.md | 最终相机、帧范围与影片一致 |
| 证据与假设报告 | assumptions-report.md | 已验证/推断/示意/待定 |
| 本报告及迭代记录 | project-report.md / review-log.md | 实际检查范围 |

## 制作记录

- Blender 版本/引擎、渲染参数、色彩、fps/fps_base、序列到成片方式：
- 来源与母模型、分镜和资产版本对应关系：
- 脚本执行顺序、相对路径、缓存/字体/贴图/链接库与重开结果：
- 每阶段实际完成内容、视觉核对与完整成片检查证据：
- 局部修改范围、保留范围、共享依赖复查：
- 剩余问题、未经核实的产品事实及未完成检查：

此表规定将来制作广告的交付物；Skill ZIP 本身不应伪造一个产品视频或空白成品工程。
