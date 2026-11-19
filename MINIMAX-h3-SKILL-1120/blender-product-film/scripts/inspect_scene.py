"""Run inside Blender. Export scene evidence without saving or modifying the blend."""
import argparse
import json
from pathlib import Path
import sys
import bpy
from mathutils import Vector


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', required=True)
    parser.add_argument('--collection', help='Optional product collection; children included')
    parser.add_argument('--frame', type=int, help='Assembly reference frame; defaults to current')
    args = parser.parse_args(sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else [])
    output = Path(args.output).expanduser().resolve()
    if output.exists():
        raise FileExistsError(f'Report exists; choose a new version: {output}')
    scene = bpy.context.scene
    collection = bpy.data.collections.get(args.collection) if args.collection else None
    if args.collection and collection is None:
        raise ValueError(f'Unknown collection: {args.collection}')
    objects = list(collection.all_objects if collection else scene.objects)
    original_frame = scene.frame_current
    if args.frame is not None:
        scene.frame_set(args.frame)
    try:
        depsgraph = bpy.context.evaluated_depsgraph_get()
        items = []
        for obj in sorted(objects, key=lambda x: x.name):
            evaluated = obj.evaluated_get(depsgraph)
            item = {
                'name': obj.name, 'type': obj.type,
                'parent': obj.parent.name if obj.parent else None,
                'collections': [c.name for c in obj.users_collection],
                'location_local': list(obj.location),
                'scale_local': list(obj.scale),
                'matrix_world': [list(row) for row in evaluated.matrix_world],
                'dimensions_evaluated_blender_units': list(evaluated.dimensions),
                'materials': [s.material.name if s.material else None for s in obj.material_slots],
                'hide_render': obj.hide_render,
                'modifiers': [{'name': m.name, 'type': m.type} for m in obj.modifiers],
                'constraints': [{'name': c.name, 'type': c.type} for c in obj.constraints],
                'has_animation_data': bool(obj.animation_data),
            }
            if obj.type == 'MESH':
                item['base_vertices'] = len(obj.data.vertices)
                item['base_polygons'] = len(obj.data.polygons)
                corners = [evaluated.matrix_world @ Vector(c) for c in evaluated.bound_box]
                item['world_aabb_min'] = [min(v[i] for v in corners) for i in range(3)]
                item['world_aabb_max'] = [max(v[i] for v in corners) for i in range(3)]
            items.append(item)
        resources = []
        for kind, blocks in [('image', bpy.data.images), ('font', bpy.data.fonts)]:
            for block in blocks:
                filepath = getattr(block, 'filepath', '')
                packed = bool(getattr(block, 'packed_file', None) or getattr(block, 'packed_files', ()))
                external = bool(filepath and filepath != '<builtin>' and not packed)
                # UDIM and sequence paths need separate frame/tile validation.
                source = getattr(block, 'source', '')
                special = source in {'TILED', 'SEQUENCE'} or '<UDIM>' in filepath
                resolved = bpy.path.abspath(filepath, library=block.library) if external else None
                resources.append({
                    'kind': kind, 'name': block.name, 'path': filepath,
                    'packed': packed, 'resolved': resolved,
                    'check': 'manual_tiles_or_sequence' if external and special else
                             ('present' if Path(resolved).is_file() else 'missing') if external else
                             'packed_or_internal',
                })
        data = {
            'blender_version': bpy.app.version_string,
            'blend_file': bpy.data.filepath,
            'scene': scene.name, 'collection': args.collection,
            'frame': scene.frame_current,
            'unit_system': scene.unit_settings.system,
            'unit_scale': scene.unit_settings.scale_length,
            'object_count': len(items), 'objects': items, 'resources': resources,
            'render': {'engine': scene.render.engine,
                       'resolution': [scene.render.resolution_x, scene.render.resolution_y],
                       'percentage': scene.render.resolution_percentage,
                       'fps': scene.render.fps / scene.render.fps_base,
                       'frame_range': [scene.frame_start, scene.frame_end],
                       'camera': scene.camera.name if scene.camera else None},
            'limitations': [
                'Scene evidence is not CAD certification or an automatic product-lock comparison.',
                'Compare the same product coordinates, assembly frame, units and source version.',
                'World bounds depend on orientation. Counts do not prove geometric identity.',
                'Collection instances, simulations, linked assets and sequence dependencies need separate inspection.',
            ],
        }
        output.parent.mkdir(parents=True, exist_ok=True)
        with output.open('x', encoding='utf-8') as stream:
            json.dump(data, stream, ensure_ascii=False, indent=2, allow_nan=False)
        print(f'SCENE_REPORT={output}')
    finally:
        scene.frame_set(original_frame)


if __name__ == '__main__':
    main()
