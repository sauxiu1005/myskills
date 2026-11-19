#!/usr/bin/env python3
"""Structure check for the vintage-archive-newsreel package (read-only unless --smoke).

Checks the Hub three-file layout, frontmatter, meta.yaml fields and tag enum,
English-only SKILL.md, local links, the unmodified vendor snapshot (SHA-256),
licences and that every script compiles. --smoke also initialises a throwaway
project in a temp folder and removes it.
"""
import hashlib
import json
from pathlib import Path
import py_compile
import re
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]
NAME = "vintage-archive-newsreel"
VERTICALS = {"Short Drama": "短剧", "Animation": "动画", "Commercial Ad": "商业广告", "E-Commerce": "电商",
             "Education": "教育", "Creative & Experimental": "创意实验", "Sound & Music": "音频音乐"}
STAGES = {"Intent Brainstorming": "意图脑爆", "Planning": "计划制定",
          "Creative Generation": "创作生成", "Post-production": "后期制作"}
META_KEYS = ["display-name-zh", "version", "tag-en", "tag-cn", "complete-tags-en", "complete-tags-cn",
             "summary-en", "summary-cn", "desc-en", "desc-cn", "author-en", "author-cn", "source"]
errors, notes = [], []


def front(path):
    text = path.read_text(encoding="utf-8")
    m = re.match(r"---\n(.*?)\n---\n", text, re.S)
    if not m:
        errors.append(f"{path.name}: no frontmatter")
        return {}, text
    fm = {}
    for line in m.group(1).splitlines():
        k, _, v = line.partition(":")
        fm[k.strip()] = v.strip()
    return fm, text


def load_yaml(path):
    try:
        import yaml
        return yaml.safe_load(path.read_text(encoding="utf-8"))
    except ImportError:
        errors.append("PyYAML not available; meta.yaml not parsed")
        return {}


def main():
    smoke = "--smoke" in sys.argv
    for f in ["SKILL.md", "SKILL.cn.md", "meta.yaml", "LICENSE", "references/upstream-manifest.json"]:
        if not (ROOT / f).is_file():
            errors.append(f"missing {f}")
    if ROOT.name != NAME:
        notes.append(f"directory is '{ROOT.name}', expected '{NAME}' when installed")
    for fname in ["SKILL.md", "SKILL.cn.md"]:
        fm, text = front(ROOT / fname)
        if fm.get("name") != NAME:
            errors.append(f"{fname}: name is {fm.get('name')!r}")
        if len(fm.get("description", "")) > 200:
            errors.append(f"{fname}: description over 200 characters")
        if text.count("\n") >= 500:
            errors.append(f"{fname}: 500 lines or more")
        if fname == "SKILL.md" and re.search(r"[\u3000-\u9fff\uff00-\uffef]", text):
            errors.append("SKILL.md contains CJK characters (must be English-only)")
        for link in re.findall(r"\]\(([^)#]+)\)", text):
            if not link.startswith("http") and not (ROOT / link).exists():
                errors.append(f"{fname}: broken link {link}")
        for ref in re.findall(r"`((?:scripts|references)/[^`\s]+)`", text):
            if not (ROOT / ref).exists():
                errors.append(f"{fname}: missing {ref}")
    for ref in (ROOT / "references").glob("*.md"):
        text = ref.read_text(encoding="utf-8")
        for link in re.findall(r"\]\(([^)#]+)\)", text):
            if not link.startswith("http") and not (ref.parent / link).exists():
                errors.append(f"{ref.name}: broken link {link}")
    meta = load_yaml(ROOT / "meta.yaml") or {}
    for k in META_KEYS:
        if not meta.get(k):
            errors.append(f"meta.yaml: missing {k}")
    if not re.fullmatch(r"\d+\.\d+\.\d+", str(meta.get("version", ""))):
        errors.append("meta.yaml: version is not MAJOR.MINOR.PATCH")
    en, cn = meta.get("complete-tags-en") or [], meta.get("complete-tags-cn") or []
    if len(en) != len(cn) or len(set(en)) != len(en):
        errors.append("meta.yaml: complete tags misaligned or duplicated")
    for e, c in zip(en, cn):
        if e == "Platform Tooling":
            ok = c == "平台工具" and len(en) == 1
        else:
            v, _, s = e.partition(" / ")
            ok = v in VERTICALS and s in STAGES and c == f"{VERTICALS[v]} / {STAGES[s]}"
        if not ok:
            errors.append(f"meta.yaml: bad tag pair {e!r} / {c!r}")
    if meta.get("source") not in {"official-featured", "official", "community"}:
        errors.append("meta.yaml: bad source")
    if len(str(meta.get("summary-en", "")).split()) > 45:
        errors.append("meta.yaml: summary-en over 45 words")
    for key in ["summary-cn", "desc-cn", "display-name-zh"]:
        if '"' in str(meta.get(key, "")):
            errors.append(f"meta.yaml: ASCII quote in {key}")
    si = meta.get("structured-info") or {}
    for loc in ["zh-CN", "en-US"]:
        for k in ["summary", "best-for", "how-to-use", "outputs"]:
            if not (si.get(loc) or {}).get(k):
                errors.append(f"meta.yaml: structured-info {loc}.{k} missing")
    manifest = json.loads((ROOT / "references/upstream-manifest.json").read_text())
    vendor = ROOT / "vendor/lemo-opuscar"
    listed = {f["path"] for f in manifest["files"]}
    for f in manifest["files"]:
        p = vendor / f["path"]
        if not p.is_file() or hashlib.sha256(p.read_bytes()).hexdigest() != f["sha256"]:
            errors.append(f"vendor changed or missing: {f['path']}")
    extra = {str(p.relative_to(vendor)) for p in vendor.rglob("*") if p.is_file()} - listed
    if extra:
        errors.append(f"unlisted vendor files: {sorted(extra)}")
    if (ROOT / "LICENSE").is_file() and (vendor / "LICENSE").is_file() and (ROOT / "LICENSE").read_bytes() != (vendor / "LICENSE").read_bytes():
        errors.append("root LICENSE differs from the upstream MIT licence")
    for script in (ROOT / "scripts").glob("*.py"):
        try:
            py_compile.compile(str(script), doraise=True, cfile=str(Path(tempfile.gettempdir()) / (script.name + "c")))
        except py_compile.PyCompileError as exc:
            errors.append(f"{script.name}: {exc.msg}")
    junk = [str(p.relative_to(ROOT)) for p in ROOT.rglob("*")
            if p.name in {".DS_Store", "__pycache__"} or "agents" in p.relative_to(ROOT).parts[:1]]
    if junk:
        errors.append(f"stray files: {junk}")
    if smoke and not errors:
        with tempfile.TemporaryDirectory() as tmp:
            proj = Path(tmp) / "smoke-project"
            r = subprocess.run([sys.executable, str(ROOT / "scripts/init_project.py"), str(proj)],
                               capture_output=True, text=True)
            if r.returncode:
                errors.append(f"init_project failed: {r.stderr.strip()[-300:]}")
            else:
                rec = json.loads((proj / "project.json").read_text())
                if rec.get("version") != meta.get("version"):
                    errors.append("init_project wrote a wrong version")
                notes.append(f"smoke init ok (version {rec.get('version')}, runtime tiers "
                             f"{rec.get('runtime_probe', {}).get('tiers_ready')})")
    print(json.dumps({"skill": NAME, "version": meta.get("version"), "root": str(ROOT),
                      "ok": not errors, "errors": errors, "notes": notes}, ensure_ascii=False, indent=2))
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
