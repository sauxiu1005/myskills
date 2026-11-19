# 摄影要求到 Blender/bpy

所有示例参数是可调起点，必须按真实产品单位与画幅验证。相机朝向本地 -Z，Y 为画面上方；本包默认 Z 为世界上方。记录坐标约定。

| 分镜字段 | bpy 落点 | 验证重点 |
|---|---|---|
| 焦段与传感器 | `camera.data.lens`、`sensor_width`、`sensor_fit` | 透视与裁切；焦段不代替机位距离 |
| 景别与构图 | 相机 `location`/目标、`shift_x/y`（如需要） | 实际画幅投影、留白及运动全程边界 |
| DOF/焦点 | `data.dof.use_dof`、`focus_object`、`aperture_fstop` | Empty 放在需要清晰的实际表面，不能默认对象原点等于焦点 |
| 固定机位 Static | 不改变位置/旋转；按需固定跟随目标 | 主体可动但观众关注点稳定 |
| Orbit | 围绕明确中心旋转轨迹；目标约束 | 弧角、半径、仰角、遮挡、背景变化 |
| Dolly / Push-in / Pull-out | 沿轨迹移动相机；Push-in 缩短目标距离 | 与变焦区分，需真实透视变化 |
| Truck / Pedestal | 横向/垂直位移打关键帧 | 方向、距离及主体是否移出画面 |
| 焦点转移 | 对 focus Empty 的位置打关键帧 | 起终主体、速度、转移必要性 |
| 切镜 | `scene.timeline_markers.new(...).camera` 或逐镜工程/VSE | 在下一镜首帧切，独立焦点避免跨镜插值 |

## 可执行基础相机

在项目脚本中通过实际 Skill 路径导入 `scripts/camera_rig.py` 的 `create_shot`。它创建相机、独立 AIM/FOCUS Empty 和相机切换 marker；对每个整数帧采样轨迹，默认 smoothstep 起停。无现有同名对象时使用，已有同名镜头则显式报错而非叠加。

```python
import sys
sys.path.insert(0, '/actual/skill/blender-product-film/scripts')
from camera_rig import create_shot
# 示例场景单位为米；这不是默认产品尺寸。
cam, aim, focus = create_shot(
    'S01', 1, 72, target=(0, 0, 0.05),
    distance_start=0.8, distance_end=0.72,
    azimuth_start=-100, azimuth_end=-80, elevation=15,
    lens_mm=100, focus=(0, -0.025, 0.05), fstop=5.6)
```

固定 azimuth、改变 distance 即 Dolly/Push-in；固定 distance、改变 azimuth 即 Orbit；都固定即 Static。此函数不自动设项目帧率/范围、造产品、打灯、计算构图或渲染。调用者设置这些内容。运动模糊的子帧、长镜头关键帧数量、俯视极点和复杂曲线按实际项目调整，不能盲目套此辅助。

AIM 管朝向、FOCUS 管景深，不一定同点。需要跟随移动产品时将 Empty 绑定对应组件并保持初始世界变换：

```python
world = focus.matrix_world.copy()
focus.parent = moving_part
focus.matrix_world = world
```

## 构图校准

用活动相机和实际分辨率，投影目标物体的 evaluated 世界包围盒角点：`bpy_extras.object_utils.world_to_camera_view(scene, camera, point)`。x/y 是归一化画幅位置，z 用于判断点是否在相机前方。建立镜头需检查全部应入画部分都位于安全边界内；局部特写只对目标 ROI 检查，允许有意裁切。横向宽产品与竖向高产品均检查两维，不能只用高度拟合。

逐步调整相机距离到目标画面占比，再看实际渲染；转动后的包围盒、实例、动画、修改器和景深要在相关帧重新评价。三分构图可用偏移的 AIM 或相机 shift，但不能把产品真实表面的焦点同步移走。

## 拆分与功能动作

先保存零件装配矩阵，以 Empty 或真实轴原点建立移动层级。给局部 location/rotation 打关键帧；分离距离、轴和时序来自分镜，真实行程来自证据或明确示意。父子变换变化后检查世界空间是否跳动。重组回到保存的装配状态，并在关键帧验证位置/朝向与基准一致。原母模型保留静止装配姿态，动画写展示副本。
