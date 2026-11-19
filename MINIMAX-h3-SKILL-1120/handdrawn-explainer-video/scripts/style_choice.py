"""Snapshot the hand-drawn catalog and validate the recorded style decision."""
import argparse
import hashlib
import json
from pathlib import Path
import re
from PIL import Image

PACKAGE = Path(__file__).resolve().parents[1]
MODE_LABELS = {
    'catalog_auto': '不主动选择，由模型自动匹配',
    'inferred': '不选择列表中的，模型推理产出',
    'custom': '自定义描述风格',
}


def digest(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


CUSTOM_LIBRARY = PACKAGE / 'assets/custom-styles'


def prepare_catalog(job, source=None):
    """Snapshot the package style library (default) or an explicitly given external STYLES.md folder."""
    job = Path(job).resolve()
    source = Path(source).resolve() if source else CUSTOM_LIBRARY.resolve()
    directory = job / 'style'
    directory.mkdir(parents=True, exist_ok=True)
    (directory / 'previews').mkdir(exist_ok=True)
    (directory / 'recipes').mkdir(exist_ok=True)
    catalog = []
    if source == CUSTOM_LIBRARY.resolve():
        previews = json.loads((PACKAGE / 'assets/style-previews/manifest.json').read_text())['images']
        styles_sha = add_custom_styles(directory, previews, catalog)
    else:
        text = (source / 'STYLES.md').read_text()
        styles_sha = digest(source / 'STYLES.md')
        matches = list(re.finditer(r'^## (\d+(?:\.\d+)?)[.]? (.+)$', text, re.M))
        for index, match in enumerate(matches):
            identity, name = match.groups()
            recipe = text[match.start():matches[index + 1].start() if index + 1 < len(matches) else len(text)]
            recipe_path = directory / 'recipes' / (identity + '.md')
            recipe_path.write_text(recipe)
            candidates = list((source / 'examples').glob(identity.zfill(2) + '-*.png')) if '.' not in identity else []
            if not candidates:
                raise ValueError('No real preview for style ' + identity)
            preview_path = directory / 'previews' / (identity + '.jpg')
            image = Image.open(candidates[0]).convert('RGB')
            image.thumbnail((720, 720))
            image.save(preview_path, quality=87)
            catalog.append({'id': identity, 'library_id': identity, 'name': name, 'preview': 'previews/' + preview_path.name,
                            'recipe': 'recipes/' + recipe_path.name, 'recipe_sha256': digest(recipe_path)})
    if not catalog:
        raise ValueError('No numbered styles in the selected STYLES.md')
    catalog.sort(key=lambda entry: tuple(int(part) for part in entry['id'].split('.')))
    snapshot = {'source': str(source), 'styles_sha256': styles_sha, 'styles': catalog}
    (directory / 'catalog.json').write_text(json.dumps(snapshot, ensure_ascii=False, indent=2))
    return snapshot


def add_custom_styles(directory, previews, catalog):
    """Add package-owned styles (assets/custom-styles/STYLES.md) that carry a style anchor image."""
    styles_path = CUSTOM_LIBRARY / 'STYLES.md'
    entries = {item['library_id']: item for item in previews if item.get('library') == 'custom'}
    if not entries:
        return None
    text = styles_path.read_text()
    matches = list(re.finditer(r'^## (\d+)[.]? (.+)$', text, re.M))
    (directory / 'anchors').mkdir(exist_ok=True)
    found = set()
    for index, match in enumerate(matches):
        number, name = match.groups()
        key = re.search(r'\(([a-z0-9-]+)\)\s*$', name)
        item = entries.get('custom-' + key.group(1)) if key else None
        if item is None:
            continue
        if item['id'] != number:
            raise ValueError('Custom style heading number does not match its catalog id: ' + item['library_id'])
        found.add(item['library_id'])
        recipe = text[match.start():matches[index + 1].start() if index + 1 < len(matches) else len(text)]
        recipe_path = directory / 'recipes' / (item['id'] + '.md')
        recipe_path.write_text(recipe)
        anchor = PACKAGE / item['anchor']
        if digest(anchor) != item['anchor_sha256']:
            raise ValueError('Style anchor changed: ' + item['id'])
        anchor_copy = directory / 'anchors' / (item['id'] + anchor.suffix)
        anchor_copy.write_bytes(anchor.read_bytes())
        preview_path = directory / 'previews' / (item['id'] + '.jpg')
        preview_path.write_bytes((PACKAGE / 'assets/style-previews' / item['thumbnail']).read_bytes())
        catalog.append({'id': item['id'], 'library_id': item['library_id'], 'name': name,
                        'preview': 'previews/' + preview_path.name,
                        'recipe': 'recipes/' + recipe_path.name, 'recipe_sha256': digest(recipe_path),
                        'anchor': 'anchors/' + anchor_copy.name, 'anchor_sha256': item['anchor_sha256']})
    missing = set(entries) - found
    if missing:
        raise ValueError('Custom styles missing from assets/custom-styles/STYLES.md: ' + ', '.join(sorted(missing)))
    return digest(styles_path)


def validate_selection(selection, catalog):
    mode = selection.get('mode')
    if mode not in {'catalog', *MODE_LABELS}:
        raise ValueError('Select a numbered style or one of the three style routes')
    if mode == 'catalog' and selection.get('catalog_id') not in {entry['id'] for entry in catalog['styles']}:
        raise ValueError('Unknown style number')
    if mode != 'catalog' and selection.get('catalog_id'):
        raise ValueError('Only a directly selected style can carry catalog_id in selection.json')
    if mode == 'custom' and not selection.get('user_description', '').strip():
        raise ValueError('Describe the custom style before confirming')
    if mode != 'custom' and selection.get('user_description'):
        raise ValueError('A user description belongs to the custom route')
    return True


def verify_style(job):
    directory = Path(job) / 'style'
    selection_path, resolved_path = directory / 'selection.json', directory / 'resolved.json'
    if not selection_path.is_file() or not resolved_path.is_file():
        raise ValueError('Style choice and model resolution are required before image generation/build')
    selection = json.loads(selection_path.read_text())
    catalog = json.loads((directory / 'catalog.json').read_text()) if selection.get('mode') in ('catalog', 'catalog_auto') else {'styles': []}
    resolved = json.loads(resolved_path.read_text())
    validate_selection(selection, catalog)
    if selection.get('confirmation') not in {'user_dialog', 'explicit_user_request', 'user_delegated', 'timeout_default', 'automatic_default'} or not selection.get('evidence'):
        raise ValueError('Style choice needs truthful selection/default evidence')
    if resolved.get('selection_sha256') != digest(selection_path) or resolved.get('mode') != selection['mode']:
        raise ValueError('Style resolution is stale or silently changed the selected route')
    if resolved.get('status') != 'resolved' or not resolved.get('rationale') or not resolved.get('style_name'):
        raise ValueError('Resolve the selected style route before production')
    specification = resolved.get('style_spec', {})
    if any(not specification.get(key) for key in ('line', 'palette', 'shading', 'texture', 'background')):
        raise ValueError('Style specification needs line, palette, shading, texture and background')
    if selection['mode'] in ('catalog', 'catalog_auto'):
        identity = resolved.get('catalog_id')
        entry = next((entry for entry in catalog['styles'] if entry['id'] == identity), None)
        if not entry or resolved.get('recipe_sha256') != entry['recipe_sha256'] or digest(directory / entry['recipe']) != entry['recipe_sha256']:
            raise ValueError('Catalog styles must use their complete, unchanged recipe snapshot')
        if selection['mode'] == 'catalog' and identity != selection['catalog_id']:
            raise ValueError('The model must not replace the selected numbered style')
        if selection['mode'] == 'catalog_auto' and not resolved.get('content_fit'):
            raise ValueError('Automatic catalog matching needs a content-fit explanation')
    elif resolved.get('catalog_id') or resolved.get('recipe_sha256') or resolved.get('catalog_recipe'):
        raise ValueError('Inferred/custom styles must be independent of hand-drawn recipes')
    if selection['mode'] == 'inferred' and not resolved.get('content_fit'):
        raise ValueError('An inferred style needs a content-based rationale')
    if selection['mode'] == 'custom' and resolved.get('style_basis') != selection['user_description']:
        raise ValueError('Custom style must be based on the exact user description')
    return {'mode': selection['mode'], 'name': resolved['style_name'], 'resolved_sha256': digest(resolved_path)}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=['prepare', 'verify'])
    parser.add_argument('job', type=Path)
    parser.add_argument('--catalog-source', type=Path, default=None, help='external STYLES.md folder; defaults to the package library')
    arguments = parser.parse_args()
    if arguments.command == 'prepare':
        print(json.dumps(prepare_catalog(arguments.job, arguments.catalog_source), ensure_ascii=False))
    else:
        print(json.dumps(verify_style(arguments.job), ensure_ascii=False))
