#!/usr/bin/env python3
"""Dependency-free structural checks. No model calls; not an agent behaviour eval."""
import json
import re
import sys
from pathlib import Path

root = Path(__file__).resolve().parents[1]
errors = []
checks = []

def check(condition, label):
    (checks if condition else errors).append(label)

def frontmatter(path):
    """Return (frontmatter mapping, body) for a runtime file.

    Uses PyYAML when available; otherwise falls back to a small reader that
    understands the frontmatter subset used here: scalars, quoted scalars,
    "|" block scalars and inline "[a, b, c]" lists.
    """
    text = path.read_text(encoding='utf-8')
    parts = text.split('---', 2)
    if len(parts) != 3 or parts[0].strip():
        errors.append(f'{path.name}: missing frontmatter')
        return {}, text
    try:
        import yaml  # noqa: PLC0415
        data = yaml.safe_load(parts[1]) or {}
        return data, parts[2]
    except ImportError:
        pass
    data = {}
    lines = parts[1].strip().splitlines()
    index = 0
    while index < len(lines):
        if ':' not in lines[index]:
            index += 1
            continue
        key, value = lines[index].split(':', 1)
        key = key.strip()
        value = value.strip()
        index += 1
        if value in ('|', '>', '|-', '>-'):
            block = []
            while index < len(lines) and (
                    not lines[index].strip() or lines[index].startswith('  ')):
                block.append(lines[index].strip())
                index += 1
            data[key] = ' '.join(x for x in block if x)
        elif value.startswith('[') and value.endswith(']'):
            data[key] = [x.strip().strip('"').strip("'")
                         for x in value[1:-1].split(',') if x.strip()]
        elif len(value) >= 2 and value[0] == value[-1] and value[0] in '"\'':
            data[key] = value[1:-1]
        else:
            data[key] = value
    return data, parts[2]


for name in ['SKILL.md', 'SKILL.cn.md', 'meta.yaml',
             'references/template-index.md', 'references/science-workflow.md',
             'evals/trigger-cases.json']:
    check((root / name).is_file(), f'required: {name}')

if errors:
    print(json.dumps({'status': 'FAIL', 'errors': errors}, ensure_ascii=False, indent=2))
    sys.exit(1)

runtimes = []
for name in ['SKILL.md', 'SKILL.cn.md']:
    data, body = frontmatter(root / name)
    check(data.get('name') == root.name, f'{name}: name matches directory')
    check(0 < len(data.get('description', '')) <= 200, f'{name}: description <= 200 chars')
    check(set(data) <= {'name', 'description', 'trigger-words'},
          f'{name}: minimal runtime metadata')
    check(bool(data.get('trigger-words')), f'{name}: trigger words present')
    check('paper' in data.get('description', '').lower()
          or '论文' in data.get('description', ''),
          f'{name}: description names the education/science intent')
    check(len((root / name).read_text(encoding='utf-8').splitlines()) < 500, f'{name}: under 500 lines')
    steps = re.findall(r'^## STEP (\d+):', body, re.M)
    check(steps == [str(n) for n in range(1, 8)], f'{name}: seven ordered steps')
    runtimes.append(body)
links = lambda body: re.findall(r'\]\(([^)]+)\)', body)
check(set(links(runtimes[0])) == set(links(runtimes[1])), 'bilingual runtime resource parity')

def parse_yaml(path):
    """Minimal YAML reader for this package's meta.yaml subset (no dependencies).

    Handles nested mappings, block sequences, quoted and plain scalars.
    """
    try:
        import yaml  # noqa: PLC0415
        return yaml.safe_load(path.read_text(encoding='utf-8'))
    except ImportError:
        pass

    def scalar(text):
        text = text.strip()
        if len(text) >= 2 and text[0] == text[-1] and text[0] in '"\'':
            return text[1:-1]
        return text

    lines = [(len(raw) - len(raw.lstrip()), raw.strip())
             for raw in path.read_text(encoding='utf-8').splitlines()
             if raw.strip() and not raw.lstrip().startswith('#')]

    def build(index, indent):
        """Parse a block at the given indent; return (value, next_index)."""
        if index < len(lines) and lines[index][1].startswith('- '):
            items = []
            while index < len(lines) and lines[index][0] == indent and lines[index][1].startswith('- '):
                items.append(scalar(lines[index][1][2:]))
                index += 1
            return items, index
        mapping = {}
        while index < len(lines):
            line_indent, line = lines[index]
            if line_indent < indent:
                break
            if line_indent > indent:
                raise ValueError(f'unexpected indent: {line}')
            key, _, value = line.partition(':')
            key = key.strip()
            value = value.strip()
            index += 1
            if value:
                mapping[key] = scalar(value)
                continue
            child, index = build(index, lines[index][0]) if index < len(lines) else ({}, index)
            mapping[key] = child
        return mapping, index

    value, _ = build(0, lines[0][0] if lines else 0)
    return value


meta = parse_yaml(root / 'meta.yaml')
META_FIELDS = ['display-name-zh', 'version', 'tag-en', 'tag-cn', 'summary-en', 'summary-cn',
              'desc-en', 'desc-cn', 'author-en', 'author-cn', 'source', 'structured-info']
for field in META_FIELDS:
    check(isinstance(meta, dict) and bool(meta.get(field)), f'metadata: {field}')
missing_meta = [f for f in META_FIELDS if not isinstance(meta, dict) or not meta.get(f)]
if missing_meta:
    # Stop before field-specific checks so a missing field is reported, not a crash.
    print(json.dumps({'status': 'FAIL', 'errors': errors},
                     ensure_ascii=False, indent=2))
    sys.exit(1)
check(bool(re.fullmatch(r'\d+\.\d+\.\d+', meta['version'])), 'metadata: semantic version')
check(len(meta['summary-en'].split()) <= 45, 'metadata: English summary <= 45 words')
check(30 <= len(meta['summary-cn']) <= 60, 'metadata: Chinese summary 30-60 chars incl. punctuation')
check(95 <= len(meta['desc-en'].split()) <= 130, 'metadata: English description 95-130 words')
check(150 <= len(meta['desc-cn']) <= 200, 'metadata: Chinese description 150-200 chars incl. punctuation')
check(meta['source'] == 'official-featured', 'metadata: source matches official publication')
for locale in ['en-US', 'zh-CN']:
    info = meta['structured-info'][locale]
    check(all(info.get(k) for k in ['summary', 'best-for', 'how-to-use', 'outputs']), f'card: {locale}')

refs = root / 'references'
templates = sorted(refs.glob('*/*.md'))
check(len(templates) == 93, '93 templates present')
check(len([x for x in refs.iterdir() if x.is_dir()]) == 17, '17 categories present')
# Check Markdown file links. Bare cross-template paths in template docs are checked
# separately with their documented reference-root/sibling conventions.
for f in root.rglob('*.md'):
    text = f.read_text(encoding='utf-8')
    for target in links(text):
        if re.match(r'^[a-zA-Z]+:', target) or target.startswith('#'):
            continue
        target = target.split('#')[0]
        check((f.parent / target).exists(), f'link: {f.relative_to(root)} -> {target}')
    if f.is_relative_to(refs):
        for target in re.findall(r'`([^`\n]+\.md)`', text):
            if ' ' in target or '<' in target or '...' in target:
                continue
            candidates = [f.parent / target, root / target, refs / target]
            check(any(q.is_file() for q in candidates), f'inline reference: {f.relative_to(root)} -> {target}')

index = (refs / 'template-index.md').read_text(encoding='utf-8')
for f in templates:
    check(str(f.relative_to(refs)) in index, f'indexed: {f.relative_to(refs)}')

# Keep runtime instructions independent of provider configuration and wire formats.
active = '\n'.join((root / n).read_text(encoding='utf-8') for n in ['SKILL.md', 'SKILL.cn.md'])
active += '\n' + '\n'.join(x.read_text(encoding='utf-8') for x in refs.rglob('*.md'))
for pattern, label in [
    (r'\b[A-Z][A-Z0-9_]*_(?:API_KEY|ACCESS_TOKEN)\b', 'no credential-variable dependencies'),
    (r'\bmcp__\w+', 'no embedded connector invocation names'),
]:
    check(re.search(pattern, active) is None, label)
check(not list((root / 'scripts').glob('*.js')), 'no bundled provider wrappers')
check('MiniMax H3 Image' in runtimes[0], 'user-facing recommended model explicit')
check('prompt-only requests' in runtimes[0], 'prompt-only branch explicit')
check('no suitable image capability' in runtimes[0], 'no-image-capability fallback explicit')
check('no model selector' in runtimes[0], 'opaque host renderer supported')
check('not silently replace' in runtimes[0], 'user-selected model preserved')

cases = json.loads((root / 'evals/trigger-cases.json').read_text(encoding='utf-8'))
check(len(cases) >= 6, 'at least six trigger fixtures')
check(sum(c['should_trigger'] for c in cases) >= 3, 'at least three positive fixtures')
check(sum(not c['should_trigger'] for c in cases) >= 3, 'at least three negative fixtures')
for case in cases:
    if case['should_trigger']:
        check((root / case['expected_template']).is_file(), f'trigger route fixture: {case["id"]}')

result = {'status': 'FAIL' if errors else 'PASS', 'passed_checks': len(checks),
          'templates': len(templates), 'categories': 17, 'errors': errors,
          'scope': 'Structural checks and trigger-fixture integrity only; no image API or agent execution.',
          'market_ci': 'Run repository .ci/validate.sh separately; this script validates the Skill package.'}
print(json.dumps(result, ensure_ascii=False, indent=2))
sys.exit(bool(errors))
