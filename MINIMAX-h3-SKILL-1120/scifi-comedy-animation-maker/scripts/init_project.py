#!/usr/bin/env python3
"""Initialize a project with the complete bundled upstream reference; no media generation."""
import argparse
import json
from pathlib import Path
import shutil
import tempfile
from verify_bundle import verify


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('project', type=Path, help='New directory; existing paths are refused')
    args = parser.parse_args()
    skill = Path(__file__).resolve().parents[1]
    target = args.project.expanduser().resolve()
    if target == skill or skill in target.parents:
        parser.error('Create the film outside the installed skill directory')
    if target.exists():
        parser.error(f'Target exists; no files changed: {target}')
    try:
        manifest = verify(skill)
    except (ValueError, OSError, KeyError) as e:
        parser.error(str(e))
    source = skill / 'vendor/lemo-opuscar'
    target.parent.mkdir(parents=True, exist_ok=True)
    stage = Path(tempfile.mkdtemp(prefix='.toon-init-', dir=target.parent))
    try:
        shutil.copytree(source, stage / 'runtime')
        shutil.copy2(skill / 'references/upstream-manifest.json', stage / 'upstream-manifest.json')
        film = stage / 'film'
        for name in ['assets', 'fonts', 'voices', 'audio', 'out', 'stills']:
            (film / name).mkdir(parents=True, exist_ok=True)
        shutil.copy2(source / 'styles/scifi-toon/demo/toon.js', film / 'toon.js')
        shutil.copy2(source / 'LICENSE', film / 'LICENSE')
        (film / 'package.json').write_text('{"private":true,"type":"module"}\n')
        # Verified fallbacks (opt-in): soundfile shim, ffmpeg-6 mux, SRT overlap check.
        tools = film / 'tools'
        tools.mkdir()
        shutil.copy2(skill / 'scripts/compat/soundfile.py', tools / 'soundfile.py')
        shutil.copy2(skill / 'scripts/mux_compat.sh', tools / 'mux_compat.sh')
        shutil.copy2(skill / 'scripts/check_srt.py', tools / 'check_srt.py')
        record = {
            'skill': skill.name, 'version': '1.1.2',
            'upstream_commit': manifest['commit'], 'upstream_files': len(manifest['files']),
            'runtime': 'runtime', 'film': 'film',
            'style': 'runtime/styles/scifi-toon/STYLE.md',
            'reference_demo': 'runtime/styles/scifi-toon/demo',
            'reference_frame': 'runtime/styles/scifi-toon/demo/stills/styleframe.jpg',
            'defaults': {'width': 1920, 'height': 1080, 'fps': 24,
                         'character_fps': 12, 'loudness_lufs': -14},
            'status': 'initialized_only', 'dependencies_installed': False,
            'media_generated': False, 'design_import_tested': False,
            'compat_tools': 'film/tools (use only when the upstream path fails)',
            'external_assets_required': ['fonts', 'per-line voice audio', 'voice/asr models if selected'],
        }
        (stage / 'project.json').write_text(json.dumps(record, ensure_ascii=False, indent=2) + '\n')
        # Reserve the target atomically so concurrent initializers cannot overwrite a project.
        target.mkdir(exist_ok=False)
        for child in stage.iterdir():
            shutil.move(str(child), str(target / child.name))
    finally:
        shutil.rmtree(stage)
    print(json.dumps({'project': str(target), 'status': 'initialized_only',
                      'reference_files': len(manifest['files'])}, ensure_ascii=False))


if __name__ == '__main__':
    main()
