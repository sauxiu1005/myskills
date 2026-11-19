"""Render chosen PNG preview frames in Blender; never save preview settings to the blend."""
import argparse
import json
from pathlib import Path
import sys
import bpy


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output-dir', required=True, help='New directory; existing paths are rejected')
    parser.add_argument('--frames', required=True, help='Comma-separated frames, e.g. 1,12,24')
    parser.add_argument('--percent', type=int, default=25)
    args = parser.parse_args(sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else [])
    frames = sorted(set(int(v.strip()) for v in args.frames.split(',')))
    if not 1 <= args.percent <= 100:
        raise ValueError('percent must be between 1 and 100')
    scene = bpy.context.scene
    if not frames or any(f < scene.frame_start or f > scene.frame_end for f in frames):
        raise ValueError('Requested frames must be within the active scene range')
    if scene.camera is None:
        raise ValueError('Active scene has no camera')
    # Avoid silently generating additional outputs through a compositor file node.
    tree = getattr(scene, 'compositing_node_group', None) or getattr(scene, 'node_tree', None)
    pending, visited = ([tree] if tree else []), set()
    while pending:
        group = pending.pop()
        if group.as_pointer() in visited:
            continue
        visited.add(group.as_pointer())
        for node in group.nodes:
            if node.type == 'OUTPUT_FILE':
                raise ValueError('Compositor file outputs detected; use a dedicated reviewed render script')
            nested = getattr(node, 'node_tree', None)
            if nested:
                pending.append(nested)
    directory = Path(args.output_dir).expanduser().resolve()
    directory.mkdir(parents=True, exist_ok=False)
    r = scene.render
    old = (scene.frame_current, r.filepath, r.resolution_percentage,
           r.image_settings.file_format, r.use_file_extension)
    files = []
    try:
        r.resolution_percentage = args.percent
        r.image_settings.file_format = 'PNG'
        r.use_file_extension = True
        for frame in frames:
            scene.frame_set(frame)
            target = directory / f'frame_{frame:06d}.png'
            r.filepath = str(target)
            bpy.ops.render.render(write_still=True)
            if not target.is_file() or target.stat().st_size == 0:
                raise RuntimeError(f'Render output missing: {target}')
            files.append(str(target))
        (directory / 'manifest.json').write_text(json.dumps({
            'blend_file': bpy.data.filepath, 'scene': scene.name,
            'frames': frames, 'percentage': args.percent,
            'files': files, 'purpose': 'Preview frames; inspect images and also review a motion preview.',
        }, ensure_ascii=False, indent=2), encoding='utf-8')
        print(f'PREVIEW_MANIFEST={directory / "manifest.json"}')
    finally:
        scene.frame_set(old[0])
        r.filepath = old[1]
        r.resolution_percentage = old[2]
        r.image_settings.file_format = old[3]
        r.use_file_extension = old[4]


if __name__ == '__main__':
    main()
