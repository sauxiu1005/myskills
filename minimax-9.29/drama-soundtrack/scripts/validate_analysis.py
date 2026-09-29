#!/usr/bin/env python3
"""校验 analysis.md 剧情分析报告格式是否符合要求。

规则：
  - 必须包含 5 个二级章节：类型分析、情感弧线、角色分析、关键场景、文化背景
  - 角色分析至少 1 个，最多 5 个
  - 每个角色必须包含：性格关键词、情感旅程、关键转折、音乐性格
  - 音乐性格必须包含 4 个维度：节奏倾向、能量级、明暗、冷暖
  - 关键场景至少 3 个，最多 10 个
  - 每个场景必须包含：编号(S格式)、位置、场景描述、情感类型、强度
  - 文化背景必须包含：时代、文化元素、乐器倾向
"""

import re
import sys
from pathlib import Path

REQUIRED_SECTIONS = ["类型分析", "情感弧线", "角色分析", "关键场景", "文化背景"]
CHARACTER_FIELDS = ["性格关键词", "情感旅程", "关键转折", "音乐性格"]
MUSIC_PROFILE_FIELDS = ["节奏倾向", "能量级", "明暗", "冷暖"]
CULTURE_FIELDS = ["时代", "文化元素", "乐器倾向"]
SCENE_ID_RE = re.compile(r"S\d{2}")


def parse_sections(text: str) -> dict[str, str]:
    """按二级标题拆分文档。"""
    sections: dict[str, str] = {}
    current_title = None
    current_lines: list[str] = []

    for line in text.split("\n"):
        m = re.match(r"^##\s+(.+)$", line)
        if m:
            if current_title:
                sections[current_title] = "\n".join(current_lines)
            current_title = m.group(1).strip()
            current_lines = []
        else:
            current_lines.append(line)

    if current_title:
        sections[current_title] = "\n".join(current_lines)

    return sections


def parse_characters(section_text: str) -> list[dict]:
    """从角色分析章节提取角色列表。"""
    characters: list[dict] = []
    current_name = None
    current_content: list[str] = []

    for line in section_text.split("\n"):
        m = re.match(r"^###\s+【(.+?)】", line)
        if m:
            if current_name:
                characters.append({"name": current_name, "content": "\n".join(current_content)})
            current_name = m.group(1)
            current_content = []
        else:
            current_content.append(line)

    if current_name:
        characters.append({"name": current_name, "content": "\n".join(current_content)})

    return characters


def parse_scenes(section_text: str) -> list[dict]:
    """从关键场景章节提取场景列表（支持表格和列表格式）。"""
    scenes: list[dict] = []

    # 尝试匹配表格行（| 分隔）
    for line in section_text.split("\n"):
        line = line.strip()
        if not line.startswith("|"):
            continue
        cells = [c.strip() for c in line.split("|")[1:-1]]
        if len(cells) >= 5 and SCENE_ID_RE.match(cells[0]):
            scenes.append({
                "id": cells[0],
                "location": cells[1],
                "description": cells[2],
                "emotion_type": cells[3],
                "intensity": cells[4],
            })

    return scenes


def validate(path: str) -> list[str]:
    """校验 analysis.md，返回问题列表。"""
    text = Path(path).read_text(encoding="utf-8")
    issues: list[str] = []

    sections = parse_sections(text)

    # 检查必需章节
    for section_name in REQUIRED_SECTIONS:
        if section_name not in sections:
            issues.append(f"ERROR  缺少必需章节：## {section_name}")

    # 检查角色分析
    if "角色分析" in sections:
        characters = parse_characters(sections["角色分析"])
        if len(characters) < 1:
            issues.append("ERROR  角色分析中未找到任何角色（需用 ### 【角色名】 格式）")
        elif len(characters) > 5:
            issues.append(f"WARN   角色数量 {len(characters)} 超过推荐上限 5 个")

        for char in characters:
            for field in CHARACTER_FIELDS:
                if field not in char["content"]:
                    issues.append(f"ERROR  角色【{char['name']}】缺少字段：{field}")

            # 检查音乐性格子维度
            if "音乐性格" in char["content"]:
                for mf in MUSIC_PROFILE_FIELDS:
                    if mf not in char["content"]:
                        issues.append(f"WARN   角色【{char['name']}】音乐性格缺少维度：{mf}")

    # 检查关键场景
    if "关键场景" in sections:
        scenes = parse_scenes(sections["关键场景"])
        if len(scenes) < 3:
            issues.append(f"ERROR  关键场景数量不足：{len(scenes)} 个（至少需要 3 个）")
        elif len(scenes) > 10:
            issues.append(f"WARN   关键场景数量 {len(scenes)} 超过推荐上限 10 个")

    # 检查文化背景
    if "文化背景" in sections:
        culture_text = sections["文化背景"]
        for field in CULTURE_FIELDS:
            if field not in culture_text:
                issues.append(f"WARN   文化背景缺少字段：{field}")

    return issues


def print_summary(path: str, issues: list[str]) -> None:
    text = Path(path).read_text(encoding="utf-8")
    sections = parse_sections(text)

    print(f"=== 剧情分析校验报告 ===\n")

    # 章节概览
    print(f"{'章节':<15} {'状态':<8}")
    print("-" * 25)
    for name in REQUIRED_SECTIONS:
        status = "✓" if name in sections else "✗ 缺失"
        print(f"{name:<15} {status:<8}")

    # 角色统计
    if "角色分析" in sections:
        characters = parse_characters(sections["角色分析"])
        print(f"\n角色数量: {len(characters)}")
        for char in characters:
            print(f"  - 【{char['name']}】")

    # 场景统计
    if "关键场景" in sections:
        scenes = parse_scenes(sections["关键场景"])
        print(f"\n关键场景数量: {len(scenes)}")

    print()
    if issues:
        errors = [i for i in issues if i.startswith("ERROR")]
        warns = [i for i in issues if i.startswith("WARN")]
        print(f"发现 {len(errors)} 个错误, {len(warns)} 个警告:\n")
        for issue in issues:
            print(f"  {issue}")
    else:
        print("ALL PASS")


def main():
    if len(sys.argv) < 2 or sys.argv[1] in ("-h", "--help"):
        print("用法: python validate_analysis.py <analysis.md 路径>")
        print()
        print("校验剧情分析报告格式是否符合 drama-soundtrack skill 要求。")
        print()
        print("校验规则:")
        print("  - 必须包含 5 个二级章节：类型分析、情感弧线、角色分析、关键场景、文化背景")
        print("  - 角色 1-5 个，每个含性格关键词、情感旅程、关键转折、音乐性格")
        print("  - 音乐性格含 4 维度：节奏倾向、能量级、明暗、冷暖")
        print("  - 关键场景 3-10 个，含编号(S格式)、位置、场景描述、情感类型、强度")
        print("  - 文化背景含：时代、文化元素、乐器倾向")
        sys.exit(0)

    path = sys.argv[1]
    if not Path(path).exists():
        print(f"ERROR: 文件不存在: {path}")
        sys.exit(1)

    issues = validate(path)
    print_summary(path, issues)

    has_error = any(i.startswith("ERROR") for i in issues)
    sys.exit(1 if has_error else 0)


if __name__ == "__main__":
    main()
