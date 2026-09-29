#!/usr/bin/env python3
"""校验角色设计 design.md 格式是否符合规范。

用法：
  # 校验单个角色
  python validate_character_design.py .mv/{song}/{theme}/{character}/design.md

  # 校验 theme 下所有角色
  python validate_character_design.py .mv/{song}/{theme}/

规则：
  - 必须有一级标题 # 角色名
  - 必须包含 6 个二级标题分区：外貌特征、性格气质、标志物件、生图设定、候选图、选定图
  - 外貌特征必须包含列表项
  - 生图设定必须包含：提示词、模型、参考图
  - 候选图必须有至少 1 条列表项
  - 候选图路径对应的文件必须存在
"""

import re
import sys
from pathlib import Path

REQUIRED_SECTIONS = ["外貌特征", "性格气质", "标志物件", "生图设定", "候选图", "选定图"]
PROMPT_FIELDS = ["提示词：", "模型：", "参考图："]

# 中英 section / field 映射，校验时兼容双语
SECTION_ALIASES = {
    "外貌特征": "Appearance",
    "性格气质": "Personality",
    "标志物件": "Signature Items",
    "生图设定": "Image Settings",
    "候选图": "Candidates",
    "选定图": "Selected",
}
PROMPT_FIELD_ALIASES = {
    "提示词：": ("Prompt：", "Prompt:"),
    "模型：": ("Model：", "Model:"),
    "参考图：": ("Reference：", "Reference:"),
}
IMG_EXTS = {".png", ".jpg", ".jpeg", ".webp"}

H1_RE = re.compile(r"^#\s+(.+)$")
H2_RE = re.compile(r"^##\s+(.+)$")
LIST_RE = re.compile(r"^-\s+(.+)$")
CANDIDATE_RE = re.compile(r"^-\s+(candidate_\S+)")


def parse_design(text: str) -> dict:
    """解析 design.md，返回结构化数据。"""
    lines = text.split("\n")
    result = {"title": None, "sections": {}}
    current_section = None

    for line in lines:
        stripped = line.strip()

        h1 = H1_RE.match(stripped)
        if h1:
            result["title"] = h1.group(1)
            continue

        h2 = H2_RE.match(stripped)
        if h2:
            current_section = h2.group(1)
            result["sections"][current_section] = []
            continue

        if current_section is not None:
            result["sections"][current_section].append(stripped)

    return result


def get_section(sections: dict, zh_name: str) -> list:
    """从 sections 字典中获取内容，兼容中英 section header。"""
    en_name = SECTION_ALIASES.get(zh_name, "")
    return sections.get(zh_name, sections.get(en_name, []))


def has_section(sections: dict, zh_name: str) -> bool:
    """检查 section 是否存在，兼容中英。"""
    en_name = SECTION_ALIASES.get(zh_name, "")
    return zh_name in sections or en_name in sections


def has_prompt_field(content: str, zh_field: str) -> bool:
    """检查生图设定字段是否存在，兼容中英。"""
    if zh_field in content:
        return True
    for alias in PROMPT_FIELD_ALIASES.get(zh_field, ()):
        if alias in content:
            return True
    return False


def validate_one(design_path: Path) -> list[str]:
    """校验单个 design.md，返回问题列表。"""
    issues = []
    char_dir = design_path.parent
    char_name = char_dir.name

    text = design_path.read_text(encoding="utf-8")
    data = parse_design(text)

    # 角色名
    if not data["title"]:
        issues.append(f"ERROR  [{char_name}] 缺少一级标题 # 角色名")

    # 必需分区
    for section in REQUIRED_SECTIONS:
        if not has_section(data["sections"], section):
            en = SECTION_ALIASES.get(section, "")
            issues.append(f"ERROR  [{char_name}] 缺少分区 ## {section}/{en}")

    # 外貌特征：需要列表项
    appearance = get_section(data["sections"], "外貌特征")
    if appearance:
        items = [l for l in appearance if LIST_RE.match(l)]
        if len(items) < 2:
            issues.append(f"WARN   [{char_name}] 外貌特征/Appearance 列表项过少（至少 2 项）")

    # 标志物件：需要列表项
    sig_items = get_section(data["sections"], "标志物件")
    if sig_items:
        items = [l for l in sig_items if LIST_RE.match(l)]
        if not items:
            issues.append(f"WARN   [{char_name}] 标志物件/Signature Items 缺少列表项")

    # 生图设定：需要提示词、模型、参考图
    img_settings = get_section(data["sections"], "生图设定")
    if img_settings:
        content = "\n".join(img_settings)
        for field in PROMPT_FIELDS:
            if not has_prompt_field(content, field):
                issues.append(f"ERROR  [{char_name}] 生图设定/Image Settings 缺少字段 {field}")

    # 候选图：需要至少 1 条，且文件存在
    candidates_lines = get_section(data["sections"], "候选图")
    if candidates_lines:
        candidates = []
        for line in candidates_lines:
            m = CANDIDATE_RE.match(line)
            if m:
                candidates.append(m.group(1))
        if not candidates:
            issues.append(f"ERROR  [{char_name}] 候选图/Candidates 为空（需要至少 1 张）")
        for fname in candidates:
            actual_name = fname.split()[0] if " " in fname else fname
            fpath = char_dir / actual_name
            if not fpath.exists():
                issues.append(f"WARN   [{char_name}] 候选图文件不存在: {actual_name}")

    # 选定图：检查是否已选定
    selected_lines = get_section(data["sections"], "选定图")
    if selected_lines:
        content = "\n".join(selected_lines).strip()
        if not content:
            issues.append(f"INFO   [{char_name}] 选定图/Selected 尚未填写（待用户挑选）")
        elif "selected" in content:
            sel_path = char_dir / "selected.jpg"
            sel_png = char_dir / "selected.png"
            if not sel_path.exists() and not sel_png.exists():
                issues.append(f"WARN   [{char_name}] selected.jpg/png 文件不存在")

    return issues


def find_designs(path: Path) -> list[Path]:
    """查找所有 design.md 文件。"""
    if path.is_file() and path.name == "design.md":
        return [path]
    if path.is_dir():
        designs = []
        for d in sorted(path.iterdir()):
            if d.is_dir():
                dm = d / "design.md"
                if dm.exists():
                    designs.append(dm)
        return designs
    return []


def print_summary(all_issues: dict[str, list[str]]) -> None:
    print("=== 角色设计校验报告 ===\n")
    print(f"角色数量: {len(all_issues)}")
    print()

    total_errors = 0
    total_warns = 0

    for char_name, issues in all_issues.items():
        errors = [i for i in issues if "ERROR" in i]
        warns = [i for i in issues if "WARN" in i]
        infos = [i for i in issues if "INFO" in i]
        total_errors += len(errors)
        total_warns += len(warns)

        status = "PASS" if not errors else "FAIL"
        print(f"  [{status}] {char_name} — {len(errors)} 错误, {len(warns)} 警告")

    print()
    if total_errors == 0 and total_warns == 0:
        no_info = all(not any("INFO" in i for i in iss) for iss in all_issues.values())
        if no_info:
            print("ALL PASS")
        else:
            print("ALL PASS (部分角色待用户选图)")
    else:
        all_issues_flat = [i for iss in all_issues.values() for i in iss]
        print(f"发现 {len(all_issues_flat)} 个问题:\n")
        for issue in all_issues_flat:
            print(f"  {issue}")


def main():
    if len(sys.argv) < 2:
        print("用法:")
        print("  python validate_character_design.py <design.md 路径>")
        print("  python validate_character_design.py <theme 目录路径>")
        sys.exit(1)

    target = Path(sys.argv[1]).resolve()
    if not target.exists():
        print(f"ERROR: 路径不存在: {target}")
        sys.exit(1)

    designs = find_designs(target)
    if not designs:
        print(f"ERROR: 未找到 design.md 文件: {target}")
        sys.exit(1)

    print(f"\n--- 角色设计校验 ---\n")

    all_issues = {}
    for dp in designs:
        char_name = dp.parent.name
        issues = validate_one(dp)
        all_issues[char_name] = issues

    print_summary(all_issues)

    has_error = any("ERROR" in i for iss in all_issues.values() for i in iss)
    sys.exit(1 if has_error else 0)


if __name__ == "__main__":
    main()
