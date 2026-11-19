#!/usr/bin/env python3
"""Offline integrity checks for the bundled market Skill; repository CI owns schema rules."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]

REQUIRED_FILES = [
    "SKILL.md", "SKILL.cn.md", "meta.yaml",
    "docs/README.md", "docs/README.en.md", "docs/LICENSE",
    "agents/openai.yaml", "examples/README.md", "test-prompts.json",
    "references/compliance-rules.md", "references/platform-playbooks.md",
    "references/output-contracts.md",
]

# Behavioral coverage belongs to the matching language, not a stale upstream filename.
CHECKS = {
    "SKILL.md": ["evidence ledger", "One-shot", "Reference Fidelity", "Negative Constraints", "Pass/Fail"],
    "SKILL.cn.md": ["证据账本", "一次性交付模式", "Reference Fidelity", "Negative Prompt", "五维 Pass/Fail"],
}

SECRET_PATTERNS = [
    re.compile(r"gho_[A-Za-z0-9_]{20,}"),
    re.compile(r"ghp_[A-Za-z0-9_]{20,}"),
    re.compile(r"sk-[A-Za-z0-9]{20,}"),
    re.compile(r"(?i)(api[_-]?key|token|cookie|secret|password)\s*[:=]\s*['\"]?[^'\"\s]{8,}"),
    re.compile(r"[A-Z]:\\Users\\[^\\\s]+"),
]

TEXT_SUFFIXES = {".md", ".json", ".py", ".svg", ".txt", ".yml", ".yaml"}


def fail(message: str) -> None:
    print(f"FAIL: {message}")
    raise SystemExit(1)


def read(path: str) -> str:
    full = ROOT / path
    if not full.exists():
        fail(f"missing required file: {path}")
    return full.read_text(encoding="utf-8")


def check_skill_frontmatter() -> None:
    key_sets = []
    for path in ("SKILL.md", "SKILL.cn.md"):
        text = read(path)
        match = re.match(r"\A---\r?\n(.*?)\r?\n---(?:\r?\n|$)", text, re.DOTALL)
        if not match:
            fail(f"{path} must start with closed YAML frontmatter")
        frontmatter = match.group(1)
        keys = set(re.findall(r"^([A-Za-z0-9_-]+):", frontmatter, re.MULTILINE))
        if not {"name", "description"}.issubset(keys):
            fail(f"{path} requires name and description")
        name = re.search(r"^name:\s*([^\r\n]+)", frontmatter, re.MULTILINE)
        if not name or name.group(1).strip().strip("\"'") != "ecommerce-visual-creator":
            fail(f"{path} name is invalid")
        description = re.search(r"^description:[ \t]*(\S[^\r\n]*)", frontmatter, re.MULTILINE)
        if not description or description.group(1).strip() in ('""', "''"):
            fail(f"{path} description is empty")
        key_sets.append(keys)
    if key_sets[0] != key_sets[1]:
        fail("bilingual frontmatter keys differ")
    # Full YAML parsing, allowed fields and length limits are enforced by market CI.


def check_local_links() -> None:
    for file in ROOT.rglob("*.md"):
        text = file.read_text(encoding="utf-8")
        links = re.findall(r"!?\[[^\]\n]*\]\(([^)\s]+)(?:\s+[^)]*)?\)", text)
        links += re.findall(r"(?:src|href)=[\"']([^\"']+)[\"']", text)
        for target in links:
            parts = urlsplit(target.strip("<>"))
            if parts.scheme or parts.netloc or not parts.path:
                continue
            local = (file.parent / unquote(parts.path)).resolve()
            if not local.is_relative_to(ROOT.resolve()) or not local.exists():
                fail(f"{file.relative_to(ROOT)} has broken local link: {target}")
        # Runtime references often use inline code rather than Markdown links.
        if file.name in ("SKILL.md", "SKILL.cn.md"):
            for target in re.findall(r"`((?:references|scripts|tools|examples)/[^`]+)`", text):
                if not (ROOT / target).is_file():
                    fail(f"{file.name} has missing bundled reference: {target}")


def main() -> int:
    for path in REQUIRED_FILES:
        if not (ROOT / path).exists():
            fail(f"missing required file: {path}")

    check_skill_frontmatter()
    check_local_links()

    for path, needles in CHECKS.items():
        text = read(path)
        for needle in needles:
            if needle not in text:
                fail(f"{path} missing expected text: {needle}")

    try:
        prompts = json.loads(read("test-prompts.json"))
    except json.JSONDecodeError as exc:
        fail(f"test-prompts.json is invalid JSON: {exc}")
    names = {item.get("name") for item in prompts if isinstance(item, dict)}
    expected_prompts = {
        "standard_storyboard_gate",
        "amazon_one_shot_localization",
        "ordinary_food_claim_boundary",
        "audit_minimum_change",
        "reference_fidelity_lock",
        "shopify_cross_border_localization",
    }
    if not expected_prompts.issubset(names):
        fail("test-prompts.json is missing expected scenario coverage")

    for file in ROOT.rglob("*"):
        if ".git" in file.parts or not file.is_file() or file.suffix.lower() not in TEXT_SUFFIXES:
            continue
        text = file.read_text(encoding="utf-8", errors="ignore")
        for pattern in SECRET_PATTERNS:
            if pattern.search(text):
                fail(f"possible secret or private path in {file.relative_to(ROOT)}")

    print("PASS: market Skill bundle checks passed; run repository CI for schema validation")
    return 0


if __name__ == "__main__":
    sys.exit(main())
