#!/usr/bin/env python3
"""Verify the bundled upstream files without network access or mutations."""
import hashlib
import json
from pathlib import Path


def verify(skill):
    manifest = json.loads((skill / 'references/upstream-manifest.json').read_text())
    source = skill / 'vendor/lemo-opuscar'
    expected = set()
    for entry in manifest['files']:
        rel = Path(entry['path'])
        if rel.is_absolute() or '..' in rel.parts:
            raise ValueError(f'Unsafe manifest path: {rel}')
        expected.add(rel.as_posix())
        file = source / rel
        if file.is_symlink() or not file.is_file():
            raise ValueError(f'Missing or non-regular source: {rel}')
        data = file.read_bytes()
        if len(data) != entry['bytes'] or hashlib.sha256(data).hexdigest() != entry['sha256']:
            raise ValueError(f'Upstream integrity mismatch: {rel}')
    actual = {f.relative_to(source).as_posix() for f in source.rglob('*') if f.is_file()}
    if actual != expected:
        raise ValueError(f'Unexpected upstream files: {sorted(actual - expected)}')
    return manifest


def main():
    skill = Path(__file__).resolve().parents[1]
    try:
        m = verify(skill)
    except (ValueError, OSError, KeyError) as e:
        raise SystemExit(str(e))
    print(json.dumps({'status': 'passed', 'commit': m['commit'], 'files': len(m['files'])}))


if __name__ == '__main__':
    main()
