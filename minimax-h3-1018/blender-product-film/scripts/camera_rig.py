"""Blender helper: per-shot orbit/dolly rig. Import from a project bpy script.
Coordinates and distances use scene units; angles use degrees. Does not save or render.
"""
import math
import bpy
from mathutils import Vector


def create_shot(shot_id, start_frame, end_frame, target, distance_start,
                distance_end=None, azimuth_start=-90.0, azimuth_end=None,
                elevation=15.0, lens_mm=100.0, focus=None, fstop=5.6,
                use_dof=True, ease=True):
    """Creates camera + aim/focus empties and a camera-switch marker.
    Azimuth is around world Z, 0=+X, -90=-Y; elevation above XY plane.
    Focus/target are world points. Parent empties to moving parts afterwards
    with preserved world transforms when a shot must track those parts.
    """
    if not shot_id or end_frame < start_frame:
        raise ValueError('Shot ID and ordered frame range required')
    if not isinstance(start_frame, int) or not isinstance(end_frame, int):
        raise ValueError('Frames must be integers')
    distance_end = distance_start if distance_end is None else distance_end
    azimuth_end = azimuth_start if azimuth_end is None else azimuth_end
    values = [distance_start, distance_end, azimuth_start, azimuth_end,
              elevation, lens_mm, fstop, *target, *(focus if focus is not None else target)]
    if not all(math.isfinite(float(v)) for v in values):
        raise ValueError('Finite coordinates and camera values required')
    if min(distance_start, distance_end, lens_mm, fstop) <= 0 or abs(elevation) >= 89.9:
        raise ValueError('Positive distances/lens/fstop required; avoid tracking pole')
    names = [f'CAM_{shot_id}', f'AIM_{shot_id}', f'FOCUS_{shot_id}']
    scene = bpy.context.scene
    if any(n in bpy.data.objects for n in names) or shot_id in scene.timeline_markers:
        raise ValueError('Shot already exists; use a new version or explicitly update it')
    target = Vector(target)
    if len(target) != 3 or (focus is not None and len(focus) != 3):
        raise ValueError('Target/focus must have three coordinates')
    def empty(name, point):
        obj = bpy.data.objects.new(name, None)
        scene.collection.objects.link(obj)
        obj.location = point
        return obj
    aim = empty(names[1], target)
    focus_obj = empty(names[2], target if focus is None else Vector(focus))
    data = bpy.data.cameras.new(names[0])
    camera = bpy.data.objects.new(names[0], data)
    scene.collection.objects.link(camera)
    data.type = 'PERSP'
    data.lens = lens_mm
    data.sensor_fit = 'HORIZONTAL'
    data.sensor_width = 36.0
    data.dof.use_dof = use_dof
    data.dof.focus_object = focus_obj
    data.dof.aperture_fstop = fstop
    # Scale-aware starting points only; inspect the scene near/far geometry.
    data.clip_start = min(distance_start, distance_end) / 1000.0
    data.clip_end = max(distance_start, distance_end) * 100.0
    constraint = camera.constraints.new('TRACK_TO')
    constraint.target = aim
    constraint.track_axis = 'TRACK_NEGATIVE_Z'
    constraint.up_axis = 'UP_Y'
    el = math.radians(elevation)
    for frame in range(start_frame, end_frame + 1):
        t = (frame - start_frame) / max(1, end_frame - start_frame)
        u = t * t * (3.0 - 2.0 * t) if ease else t
        az = math.radians(azimuth_start + (azimuth_end - azimuth_start) * u)
        radius = distance_start + (distance_end - distance_start) * u
        camera.location = target + radius * Vector((math.cos(el) * math.cos(az),
                                                    math.cos(el) * math.sin(az), math.sin(el)))
        camera.keyframe_insert(data_path='location', frame=frame)
    marker = scene.timeline_markers.new(shot_id, frame=start_frame)
    marker.camera = camera
    if scene.camera is None:
        scene.camera = camera
    return camera, aim, focus_obj
