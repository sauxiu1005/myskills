#!/usr/bin/env python3
"""Verify one installable entry, vendor integrity, routed guides and presets."""
import hashlib
import json
from pathlib import Path
from hosted_assets import asset_available, records as hosted_records

PACKAGE = Path(__file__).resolve().parents[1]


def validate_package():
    entries = list(PACKAGE.rglob('SKILL.md'))
    if entries != [PACKAGE / 'SKILL.md']:
        raise ValueError('The installation must expose exactly one SKILL.md')
    records = json.loads((PACKAGE / 'dependencies/vendor-manifest.json').read_text())
    checked = 0
    for dependency in records:
        directory = PACKAGE / 'dependencies' / dependency['name']
        if not (directory / 'GUIDE.md').is_file() or not (directory / 'LICENSE').is_file():
            raise ValueError('Missing guide or license: ' + dependency['name'])
        for record in dependency['files']:
            path = directory / record['path']
            if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest() != record['sha256']:
                raise ValueError('Bundled dependency changed: ' + str(path.relative_to(PACKAGE)))
            checked += 1
    for directory, collection, required_fields in [
            ('hands', 'presets', ['source'])]:
        catalog = json.loads((PACKAGE / 'assets' / directory / 'catalog.json').read_text())
        ids = [entry['id'] for entry in catalog[collection]]
        if len(ids) != len(set(ids)) or catalog['default'] not in ids:
            raise ValueError('Invalid catalog: ' + directory)
        for entry in catalog[collection]:
            for field in required_fields:
                if not asset_available(PACKAGE / 'assets' / directory / entry[field]):
                    raise ValueError('Missing preset: ' + entry['id'])
    previews = json.loads((PACKAGE/'assets/style-previews/manifest.json').read_text())['images']
    hosted = hosted_records()
    local_path = PACKAGE/'assets/local-manifest.json'
    local = json.loads(local_path.read_text())['files'] if local_path.is_file() else {}
    if set(local) & set(hosted):
        raise ValueError('A media file cannot be both hosted and local-only')
    for preview in previews:
        key = 'assets/style-previews/'+preview['thumbnail']
        if preview.get('library') == 'custom':
            record = local.get(key)
            anchor = local.get(preview.get('anchor', ''))
            if not record or record['sha256'] != preview['thumbnail_sha256'] or not anchor or anchor['sha256'] != preview['anchor_sha256']:
                raise ValueError('Custom catalog preview or anchor changed: '+preview['id'])
            continue
        record = hosted[key]
        if record['sha256'] != preview['thumbnail_sha256'] or record['url'] != preview['url']:
            raise ValueError('Catalog preview changed: '+preview['id'])
    binaries = [p for p in (PACKAGE/'assets').rglob('*') if p.suffix.lower() in {'.png','.jpg','.jpeg','.gif','.wav'}]
    for path in binaries:
        key = path.relative_to(PACKAGE).as_posix()
        record = hosted.get(key) or local.get(key)
        if not record or path.stat().st_size != record['bytes'] or hashlib.sha256(path.read_bytes()).hexdigest() != record['sha256']:
            raise ValueError('Unverified bundled media: ' + key)
    for key in list(hosted) + list(local):
        if key in local and not (PACKAGE/key).is_file():
            raise ValueError('Selection asset must be bundled: ' + key)
    return {'catalog_previews_checked': len(previews), 'status': 'passed', 'skill_entries': 1, 'bundled_dependencies': len(records), 'vendor_files_checked': checked}


if __name__ == '__main__':
    print(json.dumps(validate_package(), ensure_ascii=False))
