#!/usr/bin/env python3
"""启动本地预览服务器，将 .md 数据注入 preview.html 并在浏览器中打开。

用法：
  python3 render_preview.py <文件路径> [--type lyric]
  python3 render_preview.py <目录路径> --type art_style

流程：
  1. 读取 .md 数据文件（或目录下的图片），注入 HTML 模板
  2. 启动本地 HTTP 服务器（后台运行）
  3. 在浏览器中打开预览页面
  4. 用户提交编辑建议后，写入 feedback.md，服务器自动退出
"""

import argparse
import base64
import json
import mimetypes
import os
import sys
import threading
import webbrowser
from http.server import HTTPServer, BaseHTTPRequestHandler
from pathlib import Path

# Allow importing sibling script as module when invoked directly
sys.path.insert(0, str(Path(__file__).resolve().parent))
from download_style_presets import ensure_style_presets  # noqa: E402

SKILL_DIR = Path(__file__).resolve().parent.parent
TEMPLATE_DIR = SKILL_DIR / "html"
STYLE_PRESETS_DIR = SKILL_DIR / "style-presets"
STYLE_CACHE_SUBDIR = "style_cache"

# 风格预设元数据
STYLE_META = {
    "cinematic": {
        "name": {"zh": "电影质感写实", "en": "Cinematic Realism"},
        "description": {
            "zh": "35mm 胶片颗粒、暖琥珀色调、自然光、宽银幕。参考《Into the Wild》《Nomadland》的视觉语言",
            "en": "35mm film grain, warm amber tones, natural lighting, widescreen. Visual language inspired by Into the Wild & Nomadland",
        },
        "tags": ["cinematic", "film grain", "natural lighting", "warm amber", "35mm", "anamorphic"],
        "recommend": "Midjourney V7 / Kling",
    },
    "oil-painting": {
        "name": {"zh": "油画风格", "en": "Oil Painting"},
        "description": {
            "zh": "厚重笔触、印象派色彩、painterly 质感，将公路旅行转化为一幅流动的画作",
            "en": "Thick brushstrokes, impressionist colors, painterly texture — turning a road trip into a flowing painting",
        },
        "tags": ["oil painting", "impressionist", "thick brushstrokes", "warm palette", "painterly"],
        "recommend": "Midjourney V7 --style raw / Seedream 4.5",
    },
    "noir-illustration": {
        "name": {"zh": "黑色插画", "en": "Noir Illustration"},
        "description": {
            "zh": "高对比度光影、图像小说般的视觉张力、琥珀色点缀的单色世界",
            "en": "High-contrast lighting, graphic novel visual tension, monochromatic world with amber accents",
        },
        "tags": ["noir", "high contrast", "silhouette", "graphic novel", "monochromatic", "amber accent"],
        "recommend": "Midjourney V7 --style raw / OpenAI GPT-Image",
    },
}

IMG_EXTS = {".png", ".jpg", ".jpeg", ".webp"}


# 中英 section header 映射，用于解析器兼容双语 markdown
SECTION_ALIASES = {
    "外貌特征": "Appearance",
    "性格气质": "Personality",
    "标志物件": "Signature Items",
    "生图设定": "Image Settings",
    "候选图": "Candidates",
    "选定图": "Selected",
    "场景描述": "Scene Description",
    "出场幕列表": "Scene List",
    "外观描述": "Appearance",
    "叙事作用": "Narrative Role",
    "场景背景": "Scene Background",
    "关键物件": "Key Props",
    "出场角色": "Characters",
}


def get_section(section_lines: dict, zh_name: str) -> list:
    """从 section_lines 字典中获取内容，兼容中英 section header。"""
    en_name = SECTION_ALIASES.get(zh_name, "")
    return section_lines.get(zh_name, section_lines.get(en_name, []))


def scan_style_presets(cache_dir: Path | None = None):
    """扫描 style-presets/ 目录，返回 {style_id: {meta..., images: [path, ...]}}。

    本地 style-presets/ 优先；缺失时从 CDN 下载到 cache_dir（需提供，
    通过 download_style_presets 模块完成下载）。
    所有返回的 images 都是本地文件路径，确保下游 image_paths 可直接使用。
    """
    styles = {}
    has_local = STYLE_PRESETS_DIR.exists() and any(
        d.is_dir() and any(p.suffix.lower() in IMG_EXTS for p in d.iterdir())
        for d in STYLE_PRESETS_DIR.iterdir()
    )

    if has_local:
        for d in sorted(STYLE_PRESETS_DIR.iterdir()):
            if not d.is_dir():
                continue
            style_id = d.name
            images = sorted(p for p in d.iterdir() if p.suffix.lower() in IMG_EXTS)
            if not images:
                continue
            meta = STYLE_META.get(style_id, {
                "name": {"zh": style_id, "en": style_id},
                "description": {"zh": "", "en": ""},
                "tags": [],
                "recommend": "",
            })
            styles[style_id] = {**meta, "images": [str(p) for p in images], "source": "local"}
        return styles

    if cache_dir is None:
        # CDN fallback unavailable without a cache directory
        return styles

    cached = ensure_style_presets(cache_dir)
    for style_id, paths in cached.items():
        meta = STYLE_META.get(style_id, {
            "name": {"zh": style_id, "en": style_id},
            "description": {"zh": "", "en": ""},
            "tags": [],
            "recommend": "",
        })
        styles[style_id] = {**meta, "images": [str(p) for p in paths], "source": "cached"}
    return styles


def scan_user_references(theme_dir: Path):
    """扫描用户上传的参考图"""
    ref_dir = theme_dir / "style_references"
    if not ref_dir.exists():
        return []
    return sorted(str(p) for p in ref_dir.iterdir() if p.suffix.lower() in IMG_EXTS)


class PreviewHandler(BaseHTTPRequestHandler):
    html_content: str = ""
    feedback_path: Path = Path("feedback.md")
    theme_dir: Path | None = None
    server_ref: HTTPServer | None = None

    def do_GET(self):
        # 静态图片请求：/images/<abs_path_base64>
        if self.path.startswith("/images/"):
            self._serve_image()
            return
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        self.wfile.write(self.html_content.encode("utf-8"))

    def _serve_image(self):
        raw = self.path[len("/images/"):]
        encoded = raw.split("?")[0]  # strip cache-buster query
        try:
            img_path = Path(base64.urlsafe_b64decode(encoded).decode("utf-8"))
        except Exception:
            self.send_error(400, "invalid image path")
            return
        if not img_path.exists():
            self.send_error(404, "image not found")
            return
        mime = mimetypes.guess_type(str(img_path))[0] or "image/png"
        file_size = img_path.stat().st_size

        # 支持 Range 请求（视频拖拽播放需要）
        range_header = self.headers.get("Range")
        if range_header and range_header.startswith("bytes="):
            range_spec = range_header[6:]
            start_str, _, end_str = range_spec.partition("-")
            start = int(start_str) if start_str else 0
            end = int(end_str) if end_str else file_size - 1
            end = min(end, file_size - 1)
            length = end - start + 1
            with open(img_path, "rb") as f:
                f.seek(start)
                data = f.read(length)
            self.send_response(206)
            self.send_header("Content-Type", mime)
            self.send_header("Content-Length", str(length))
            self.send_header("Content-Range", f"bytes {start}-{end}/{file_size}")
            self.send_header("Accept-Ranges", "bytes")
            self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
            self.end_headers()
            self.wfile.write(data)
        else:
            data = img_path.read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", mime)
            self.send_header("Content-Length", str(len(data)))
            self.send_header("Accept-Ranges", "bytes")
            self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
            self.end_headers()
            self.wfile.write(data)

    def do_POST(self):
        if self.path == "/feedback":
            self._handle_feedback()
        elif self.path == "/upload":
            self._handle_upload()
        else:
            self.send_error(404)

    def _handle_feedback(self):
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length).decode("utf-8")
        data = json.loads(body)
        feedback = data.get("feedback", "").strip()

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()

        if feedback:
            self.feedback_path.write_text(feedback, encoding="utf-8")
            self.wfile.write(json.dumps({"ok": True}).encode())
            print(f"FEEDBACK_FILE={self.feedback_path}")
            threading.Timer(0.5, self._shutdown).start()
        else:
            self.wfile.write(json.dumps({"ok": False, "msg": "empty"}).encode())

    def _handle_upload(self):
        """处理用户上传的参考图。

        支持两种模式：
        - art_style: 上传到 style_references/（限 1 张）
        - character_design: 上传到 {character_dir}/（按 char_index 定位角色目录）
        """
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length)

        try:
            data = json.loads(body)
            img_data = base64.b64decode(data["data"])
            filename = data.get("filename", "upload.png")
            char_index = data.get("char_index")
        except Exception as e:
            self.send_response(400)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"ok": False, "msg": str(e)}).encode())
            return

        if not self.theme_dir:
            self.send_error(500, "theme_dir not set")
            return

        ext = Path(filename).suffix or ".png"

        if char_index is not None:
            # character_design: 保存到角色目录下
            characters_dir = self.theme_dir / "characters"
            char_dirs = sorted(
                d for d in characters_dir.iterdir()
                if d.is_dir() and (d / "design.md").exists()
            ) if characters_dir.exists() else []
            if char_index < 0 or char_index >= len(char_dirs):
                self.send_error(400, "invalid char_index")
                return
            save_dir = char_dirs[char_index]
            save_path = save_dir / f"regen_ref{ext}"
        elif data.get("storyboard"):
            # storyboard: 保存到 storyboard/ 目录下
            save_dir = self.theme_dir / "storyboard"
            save_dir.mkdir(parents=True, exist_ok=True)
            save_path = save_dir / f"ref_{filename}"
        elif data.get("clips"):
            # clips: 保存到 clips/ 目录下作为参考图
            save_dir = self.theme_dir / "clips"
            save_dir.mkdir(parents=True, exist_ok=True)
            save_path = save_dir / f"ref_{filename}"
        else:
            # art_style: 保存到 style_references/
            save_dir = self.theme_dir / "style_references"
            save_dir.mkdir(parents=True, exist_ok=True)
            for old in save_dir.iterdir():
                if old.suffix.lower() in IMG_EXTS:
                    old.unlink()
            save_path = save_dir / f"user_ref{ext}"

        save_path.write_bytes(img_data)

        encoded = base64.urlsafe_b64encode(str(save_path.resolve()).encode()).decode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps({
            "ok": True,
            "url": f"/images/{encoded}",
            "path": str(save_path),
        }).encode())

    def _shutdown(self):
        if self.server_ref:
            self.server_ref.shutdown()

    def log_message(self, format, *args):
        pass


def build_art_style_data(theme_dir: Path, lang: str = "zh"):
    """构建美术风格数据 JSON"""
    lang = "zh" if lang == "zh" else "en"  # normalize: only zh/en supported
    cache_dir = theme_dir / STYLE_CACHE_SUBDIR
    presets = scan_style_presets(cache_dir=cache_dir)
    user_refs = scan_user_references(theme_dir)

    # 将本地图片路径转为 URL
    def to_url(abs_path):
        encoded = base64.urlsafe_b64encode(abs_path.encode()).decode()
        try:
            mtime = int(os.path.getmtime(abs_path))
        except OSError:
            mtime = 0
        return f"/images/{encoded}?t={mtime}"

    result = {"presets": {}, "user_refs": []}
    for style_id, info in presets.items():
        name = info["name"]
        desc = info["description"]
        result["presets"][style_id] = {
            "name": name.get(lang, name.get("en", "")) if isinstance(name, dict) else name,
            "description": desc.get(lang, desc.get("en", "")) if isinstance(desc, dict) else desc,
            "tags": info["tags"],
            "recommend": info["recommend"],
            "images": [{"url": to_url(p), "filename": Path(p).name} for p in info["images"]],
        }
    for p in user_refs:
        result["user_refs"].append({"url": to_url(p), "filename": Path(p).name})

    return result


def build_storyboard_data(theme_dir: Path):
    """构建分镜数据 JSON，解析 storyboard.md 和 storyboard/ 目录。"""
    import re

    H2_RE = re.compile(r"^##\s+(.+)$")
    TIME_RE = re.compile(
        r"^\*\s+(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})"
        r"(?:\s+\((\d+)s\))?\s*$"
    )
    LIST_RE = re.compile(r"^-\s+(.+)$")

    def to_url(abs_path):
        encoded = base64.urlsafe_b64encode(abs_path.encode()).decode()
        try:
            mtime = int(os.path.getmtime(abs_path))
        except OSError:
            mtime = 0
        return f"/images/{encoded}?t={mtime}"

    storyboard_file = theme_dir / "storyboard.md"
    storyboard_dir = theme_dir / "storyboard"
    scenes = []

    if not storyboard_file.exists():
        return {"scenes": scenes}

    text = storyboard_file.read_text(encoding="utf-8")
    lines = text.split("\n")

    current = None
    current_field = None

    for line_raw in lines:
        line = line_raw.strip()

        h2 = H2_RE.match(line)
        if h2:
            if current:
                scenes.append(current)
            current = {
                "title": h2.group(1),
                "time_raw": "",
                "lyrics": [],
                "characters": "",
                "scene_background": "",
                "key_props": "",
                "char_refs": [],
                "description": "",
                "prompt": "",
                "ref_images": [],
                "model": "",
                "candidates": [],
                "selected": None,
            }
            current_field = None
            continue

        if current is None:
            continue

        if line == "---":
            current_field = None
            continue

        tm = TIME_RE.match(line)
        if tm:
            m1, s1, m2, s2 = tm.group(1), tm.group(2), tm.group(3), tm.group(4)
            dur = tm.group(5) or ""
            current["time_raw"] = f"{m1}:{s1} - {m2}:{s2}" + (f" ({dur}s)" if dur else "")
            current_field = None
            continue

        if line.startswith(">"):
            current["lyrics"].append(line[1:].strip())
            continue

        # 字段检测 (兼容中英)
        if line.startswith(("出场角色：", "出场角色:", "Characters：", "Characters:")):
            chars = line.split("：", 1)[-1].split(":", 1)[-1].strip()
            current["characters"] = chars
            current_field = "characters"
            continue
        if line.startswith(("场景背景：", "场景背景:", "Scene Background：", "Scene Background:")):
            bg = line.split("：", 1)[-1].split(":", 1)[-1].strip()
            current["scene_background"] = bg
            current_field = "scene_background"
            continue
        if line.startswith(("关键物件：", "关键物件:", "Key Props：", "Key Props:")):
            props = line.split("：", 1)[-1].split(":", 1)[-1].strip()
            current["key_props"] = props
            current_field = "key_props"
            continue
        if line.startswith(("场景描述：", "场景描述:", "Scene Description：", "Scene Description:")):
            rest = line.split("：", 1)[-1].split(":", 1)[-1].strip()
            if rest:
                current["description"] = rest
            current_field = "desc"
            continue
        if line.startswith(("生图提示词：", "生图提示词:", "视频提示词：", "视频提示词:", "Video Prompt：", "Video Prompt:")):
            rest = line.split("：", 1)[-1].split(":", 1)[-1].strip()
            if rest:
                current["prompt"] = rest
            current_field = "prompt"
            continue
        if line.startswith(("参考图：", "参考图:", "Reference：", "Reference:")):
            current_field = "refs"
            continue
        if line.startswith(("模型：", "模型:", "Model：", "Model:")):
            current["model"] = line.split("：", 1)[-1].split(":", 1)[-1].strip()
            current_field = "model"
            continue
        if line.startswith(("候选图：", "候选图:", "Candidates：", "Candidates:")):
            current_field = "candidates"
            continue
        if line.startswith(("选定图：", "选定图:", "Selected：", "Selected:")):
            current_field = "selected"
            continue

        # 续行内容
        if not line:
            continue

        if current_field == "desc":
            current["description"] += (" " if current["description"] else "") + line
        elif current_field == "prompt":
            current["prompt"] += (" " if current["prompt"] else "") + line
        elif current_field == "refs":
            m = LIST_RE.match(line)
            if m:
                ref_text = m.group(1)
                # 提取路径部分（括号前）
                ref_path = ref_text.split("（")[0].split("(")[0].strip()
                note = ""
                if "（" in ref_text:
                    note = ref_text.split("（", 1)[1].rstrip("）")
                elif "(" in ref_text:
                    note = ref_text.split("(", 1)[1].rstrip(")")
                abs_ref = theme_dir / ref_path
                url = to_url(str(abs_ref.resolve())) if abs_ref.exists() else ""
                current["ref_images"].append({
                    "path": ref_path,
                    "note": note,
                    "url": url,
                })
        elif current_field == "candidates":
            m = LIST_RE.match(line)
            if m:
                parts = m.group(1).split("—", 1)
                filename = parts[0].strip().split()[0]
                desc = parts[1].strip() if len(parts) > 1 else ""
                img_path = storyboard_dir / filename
                if img_path.exists():
                    current["candidates"].append({
                        "filename": filename,
                        "label": filename,
                        "description": desc,
                        "url": to_url(str(img_path.resolve())),
                    })
        elif current_field == "selected" and line:
            current["selected"] = line.strip()

    if current:
        scenes.append(current)

    # 为有角色的场景添加角色参考图 URL + 结构化角色名列表
    # 同时从 design.md 读取显示名（H1 标题），用于预览页展示
    char_display_names = {}  # dir_name → display_name
    characters_dir = theme_dir / "characters"
    if characters_dir.exists():
        for d in characters_dir.iterdir():
            if d.is_dir() and (d / "design.md").exists():
                for line in (d / "design.md").read_text(encoding="utf-8").split("\n"):
                    h1 = re.match(r"^#\s+(.+)$", line.strip())
                    if h1:
                        char_display_names[d.name] = h1.group(1)
                        break

    # 反向映射：显示名 → 目录名，兼容 storyboard 中使用显示名引用角色的情况
    char_display_to_dir = {v: k for k, v in char_display_names.items()}

    def resolve_char_dir(name: str) -> str:
        """将角色名解析为目录名，兼容目录名和显示名两种输入。"""
        if (theme_dir / "characters" / name).exists():
            return name
        return char_display_to_dir.get(name, name)

    for sc in scenes:
        chars_val = (sc["characters"] or "").strip().lower()
        if sc["characters"] and chars_val not in ("（无）", "(无)", "无", "none", "(none)", "n/a", ""):
            char_names_raw = [c.strip() for c in re.split(r'[,、&/]|\s+and\s+', sc["characters"]) if c.strip()]
            # 解析为目录名（兼容输入为显示名的情况）
            char_dirs = [resolve_char_dir(cn) for cn in char_names_raw]
            # 用显示名替换目录名用于 UI 展示
            sc["character_names"] = [char_display_names.get(d, d) for d in char_dirs]
            # 优先从 Reference 列表中提取角色参考图（按位置与 character_names 配对）
            char_ref_imgs = [r for r in sc["ref_images"]
                             if "角色" in r.get("note", "") or "character" in r.get("note", "").lower()]
            if char_ref_imgs:
                for i, dir_name in enumerate(char_dirs):
                    display = char_display_names.get(dir_name, dir_name)
                    if i < len(char_ref_imgs) and char_ref_imgs[i]["url"]:
                        sc["char_refs"].append({"name": display, "url": char_ref_imgs[i]["url"]})
            else:
                # Fallback: 用目录名查找 selected.jpg
                for dir_name in char_dirs:
                    if not dir_name:
                        continue
                    display = char_display_names.get(dir_name, dir_name)
                    sel_path = theme_dir / "characters" / dir_name / "selected.jpg"
                    if not sel_path.exists():
                        sel_path = theme_dir / "characters" / dir_name / "selected.png"
                    if sel_path.exists():
                        sc["char_refs"].append({
                            "name": display,
                            "url": to_url(str(sel_path.resolve())),
                        })
        else:
            sc["character_names"] = []

    return {"scenes": scenes}


def build_character_design_data(theme_dir: Path):
    """构建角色设计数据 JSON，扫描 theme 下所有角色目录。"""
    import re

    H1_RE = re.compile(r"^#\s+(.+)$")
    H2_RE = re.compile(r"^##\s+(.+)$")
    LIST_RE = re.compile(r"^-\s+(.+)$")

    def to_url(abs_path):
        encoded = base64.urlsafe_b64encode(abs_path.encode()).decode()
        try:
            mtime = int(os.path.getmtime(abs_path))
        except OSError:
            mtime = 0
        return f"/images/{encoded}?t={mtime}"

    characters = []
    characters_dir = theme_dir / "characters"
    if not characters_dir.exists():
        return {"characters": characters}
    for d in sorted(characters_dir.iterdir()):
        if not d.is_dir():
            continue
        design_file = d / "design.md"
        if not design_file.exists():
            continue

        text = design_file.read_text(encoding="utf-8")
        lines = text.split("\n")

        char = {
            "dir_name": d.name,
            "title": d.name,
            "appearance": [],
            "personality": "",
            "items": [],
            "prompt_settings": {"prompt": "", "model": "", "reference": ""},
            "candidates": [],
            "selected": None,
        }

        current_section = None
        section_lines = {}

        for line in lines:
            stripped = line.strip()
            if stripped == "---":
                continue
            h1 = H1_RE.match(stripped)
            if h1:
                char["title"] = h1.group(1)
                continue
            h2 = H2_RE.match(stripped)
            if h2:
                current_section = h2.group(1)
                section_lines[current_section] = []
                continue
            if current_section is not None:
                section_lines[current_section].append(stripped)

        # 外貌特征
        for line in get_section(section_lines, "外貌特征"):
            m = LIST_RE.match(line)
            if m:
                char["appearance"].append(m.group(1))

        # 性格气质
        personality_lines = [line for line in get_section(section_lines, "性格气质") if line]
        char["personality"] = "\n".join(personality_lines)

        # 标志物件
        for line in get_section(section_lines, "标志物件"):
            m = LIST_RE.match(line)
            if m:
                char["items"].append(m.group(1))

        # 生图设定
        for line in get_section(section_lines, "生图设定"):
            if line.startswith(("提示词：", "提示词:", "Prompt：", "Prompt:")):
                char["prompt_settings"]["prompt"] = line.split("：", 1)[-1].split(":", 1)[-1].strip()
            elif line.startswith(("模型：", "模型:", "Model：", "Model:")):
                char["prompt_settings"]["model"] = line.split("：", 1)[-1].split(":", 1)[-1].strip()
            elif line.startswith(("参考图：", "参考图:", "Reference：", "Reference:")):
                char["prompt_settings"]["reference"] = line.split("：", 1)[-1].split(":", 1)[-1].strip()
            elif not line.startswith(("提示词", "模型", "参考图", "Prompt", "Model", "Reference")) and line:
                # 多行提示词续行
                char["prompt_settings"]["prompt"] += " " + line.strip()

        # 候选图
        for line in get_section(section_lines, "候选图"):
            m = LIST_RE.match(line)
            if m:
                parts = m.group(1).split("—", 1)
                filename = parts[0].strip().split()[0]
                desc = parts[1].strip() if len(parts) > 1 else ""
                img_path = d / filename
                if img_path.exists():
                    char["candidates"].append({
                        "filename": filename,
                        "label": filename,
                        "description": desc,
                        "url": to_url(str(img_path.resolve())),
                    })

        # 选定图
        for line in get_section(section_lines, "选定图"):
            if line.strip():
                char["selected"] = line.strip()

        characters.append(char)

    return {"characters": characters}


def build_backgrounds_data(theme_dir: Path):
    """构建背景图数据 JSON，扫描 theme/backgrounds/ 下所有背景目录。"""
    import re

    H1_RE = re.compile(r"^#\s+(.+)$")
    H2_RE = re.compile(r"^##\s+(.+)$")
    LIST_RE = re.compile(r"^-\s+(.+)$")

    def to_url(abs_path):
        encoded = base64.urlsafe_b64encode(abs_path.encode()).decode()
        try:
            mtime = int(os.path.getmtime(abs_path))
        except OSError:
            mtime = 0
        return f"/images/{encoded}?t={mtime}"

    characters = []  # 复用 characters 结构以匹配模板
    bg_dir = theme_dir / "backgrounds"
    if not bg_dir.exists():
        return {"characters": characters}

    for d in sorted(bg_dir.iterdir()):
        if not d.is_dir():
            continue
        design_file = d / "design.md"
        if not design_file.exists():
            continue

        text = design_file.read_text(encoding="utf-8")
        lines = text.split("\n")

        char = {
            "dir_name": d.name,
            "title": d.name,
            "appearance": [],       # 映射 场景描述
            "personality": "",      # 映射 出场幕列表
            "items": [],
            "prompt_settings": {"prompt": "", "model": "", "reference": ""},
            "candidates": [],
            "selected": None,
        }

        current_section = None
        section_lines = {}

        for line in lines:
            stripped = line.strip()
            if stripped == "---":
                continue
            h1 = H1_RE.match(stripped)
            if h1:
                char["title"] = h1.group(1)
                continue
            h2 = H2_RE.match(stripped)
            if h2:
                current_section = h2.group(1)
                section_lines[current_section] = []
                continue
            if current_section is not None:
                section_lines[current_section].append(stripped)

        # 场景描述 → appearance
        for line in get_section(section_lines, "场景描述"):
            m = LIST_RE.match(line)
            if m:
                char["appearance"].append(m.group(1))

        # 出场幕列表 → personality
        scene_lines = [line for line in get_section(section_lines, "出场幕列表") if line]
        char["personality"] = "\n".join(scene_lines)

        # 生图设定
        for line in get_section(section_lines, "生图设定"):
            if line.startswith(("提示词：", "提示词:", "Prompt：", "Prompt:")):
                char["prompt_settings"]["prompt"] = line.split("：", 1)[-1].split(":", 1)[-1].strip()
            elif line.startswith(("模型：", "模型:", "Model：", "Model:")):
                char["prompt_settings"]["model"] = line.split("：", 1)[-1].split(":", 1)[-1].strip()
            elif line.startswith(("参考图：", "参考图:", "Reference：", "Reference:")):
                char["prompt_settings"]["reference"] = line.split("：", 1)[-1].split(":", 1)[-1].strip()
            elif not line.startswith(("提示词", "模型", "参考图", "Prompt", "Model", "Reference")) and line:
                char["prompt_settings"]["prompt"] += " " + line.strip()

        # 候选图
        for line in get_section(section_lines, "候选图"):
            m = LIST_RE.match(line)
            if m:
                parts = m.group(1).split("—", 1)
                filename = parts[0].strip().split()[0]
                desc = parts[1].strip() if len(parts) > 1 else ""
                img_path = d / filename
                if img_path.exists():
                    char["candidates"].append({
                        "filename": filename,
                        "label": filename,
                        "description": desc,
                        "url": to_url(str(img_path.resolve())),
                    })

        # 选定图
        for line in get_section(section_lines, "选定图"):
            if line.strip():
                char["selected"] = line.strip()

        characters.append(char)

    return {"characters": characters}


def build_videos_data(theme_dir: Path):
    """构建分镜视频预览数据 JSON，复用 storyboard 解析 + 扫描 clips/ 目录。"""
    storyboard_data = build_storyboard_data(theme_dir)
    scenes = storyboard_data.get("scenes", [])

    def to_url(abs_path):
        encoded = base64.urlsafe_b64encode(abs_path.encode()).decode()
        try:
            mtime = int(os.path.getmtime(abs_path))
        except OSError:
            mtime = 0
        return f"/images/{encoded}?t={mtime}"

    clips_dir = theme_dir / "clips"

    for si, sc in enumerate(scenes):
        scene_num = str(si + 1).zfill(2)
        # 尝试多种命名格式匹配视频文件
        video_path = None
        for pattern in [
            f"scene_{scene_num}.mp4",
            f"scene_{scene_num}*.mp4",
            sc.get("title", "").replace(" ", "_") + ".mp4",
        ]:
            if "*" in pattern:
                matches = list(clips_dir.glob(pattern)) if clips_dir.exists() else []
                if matches:
                    video_path = matches[0]
                    break
            else:
                candidate = clips_dir / pattern
                if candidate.exists():
                    video_path = candidate
                    break

        if video_path and video_path.exists():
            sc["video_url"] = to_url(str(video_path.resolve()))
            sc["video_path"] = str(video_path.relative_to(theme_dir))
            sc["status"] = "generated"
        else:
            sc["video_url"] = ""
            sc["video_path"] = ""
            sc["status"] = "missing"

    return {"scenes": scenes}


def build_props_data(theme_dir: Path):
    """构建关键物件数据 JSON，扫描 theme/props/ 下所有物件目录。"""
    import re

    H1_RE = re.compile(r"^#\s+(.+)$")
    H2_RE = re.compile(r"^##\s+(.+)$")
    LIST_RE = re.compile(r"^-\s+(.+)$")

    def to_url(abs_path):
        encoded = base64.urlsafe_b64encode(abs_path.encode()).decode()
        try:
            mtime = int(os.path.getmtime(abs_path))
        except OSError:
            mtime = 0
        return f"/images/{encoded}?t={mtime}"

    props = []
    props_dir = theme_dir / "props"
    if not props_dir.exists():
        return {"props": props}

    for d in sorted(props_dir.iterdir()):
        if not d.is_dir():
            continue
        design_file = d / "design.md"
        if not design_file.exists():
            continue

        text = design_file.read_text(encoding="utf-8")
        lines = text.split("\n")

        prop = {
            "dir_name": d.name,
            "title": d.name,
            "appearance": [],
            "narrative_role": "",
            "prompt_settings": {"prompt": "", "model": "", "reference": ""},
            "candidates": [],
            "selected": None,
        }

        current_section = None
        section_lines = {}

        for line in lines:
            stripped = line.strip()
            if stripped == "---":
                continue
            h1 = H1_RE.match(stripped)
            if h1:
                prop["title"] = h1.group(1)
                continue
            h2 = H2_RE.match(stripped)
            if h2:
                current_section = h2.group(1)
                section_lines[current_section] = []
                continue
            if current_section is not None:
                section_lines[current_section].append(stripped)

        # 外观描述 → appearance
        for line in get_section(section_lines, "外观描述"):
            m = LIST_RE.match(line)
            if m:
                prop["appearance"].append(m.group(1))

        # 叙事作用 → narrative_role
        role_lines = [line for line in get_section(section_lines, "叙事作用") if line]
        prop["narrative_role"] = "\n".join(role_lines)

        # 生图设定
        for line in get_section(section_lines, "生图设定"):
            if line.startswith(("提示词：", "提示词:", "Prompt：", "Prompt:")):
                prop["prompt_settings"]["prompt"] = line.split("：", 1)[-1].split(":", 1)[-1].strip()
            elif line.startswith(("模型：", "模型:", "Model：", "Model:")):
                prop["prompt_settings"]["model"] = line.split("：", 1)[-1].split(":", 1)[-1].strip()
            elif line.startswith(("参考图：", "参考图:", "Reference：", "Reference:")):
                prop["prompt_settings"]["reference"] = line.split("：", 1)[-1].split(":", 1)[-1].strip()
            elif not line.startswith(("提示词", "模型", "参考图", "Prompt", "Model", "Reference")) and line:
                prop["prompt_settings"]["prompt"] += " " + line.strip()

        # 候选图
        for line in get_section(section_lines, "候选图"):
            m = LIST_RE.match(line)
            if m:
                parts = m.group(1).split("—", 1)
                filename = parts[0].strip().split()[0]
                desc = parts[1].strip() if len(parts) > 1 else ""
                img_path = d / filename
                if img_path.exists():
                    prop["candidates"].append({
                        "filename": filename,
                        "label": filename,
                        "description": desc,
                        "url": to_url(str(img_path.resolve())),
                    })

        # 选定图
        for line in get_section(section_lines, "选定图"):
            if line.strip():
                prop["selected"] = line.strip()

        props.append(prop)

    return {"props": props}


def main():
    parser = argparse.ArgumentParser(description="启动 MV 预览服务器")
    parser.add_argument("file", help="数据文件路径 (如 .mv/xxx/lyric.md) 或目录路径")
    parser.add_argument("--type", default="", help="数据类型 (如 lyric/script/art_style)")
    parser.add_argument("--port", type=int, default=0, help="端口号，默认自动分配")
    parser.add_argument("--lang", default="", choices=["zh", "en", ""], help="UI language: zh/en, default auto-detect")
    parsed = parser.parse_args()

    src = Path(parsed.file).resolve()
    if not src.exists():
        print(f"ERROR: 路径不存在: {src}")
        sys.exit(1)

    preview_type = parsed.type
    if not preview_type:
        print("ERROR: 必须指定 --type 参数 (如 --type lyric)")
        sys.exit(1)

    template_path = TEMPLATE_DIR / f"preview-{preview_type}.html"
    if not template_path.exists():
        print(f"ERROR: 模板不存在: {template_path}")
        sys.exit(1)

    template = template_path.read_text(encoding="utf-8")

    if preview_type == "art_style":
        # art_style: 输入是目录路径
        theme_dir = src if src.is_dir() else src.parent
        lang = parsed.lang or "zh"
        content = json.dumps(build_art_style_data(theme_dir, lang), ensure_ascii=False)
        feedback_dir = theme_dir
    elif preview_type == "character_design":
        # character_design: 输入是目录路径（theme 目录）
        theme_dir = src if src.is_dir() else src.parent
        content = json.dumps(build_character_design_data(theme_dir), ensure_ascii=False)
        feedback_dir = theme_dir
    elif preview_type == "backgrounds":
        # backgrounds: 输入是目录路径（theme 目录）
        theme_dir = src if src.is_dir() else src.parent
        content = json.dumps(build_backgrounds_data(theme_dir), ensure_ascii=False)
        feedback_dir = theme_dir
    elif preview_type == "storyboard":
        # storyboard: 输入是目录路径（theme 目录）
        theme_dir = src if src.is_dir() else src.parent
        content = json.dumps(build_storyboard_data(theme_dir), ensure_ascii=False)
        feedback_dir = theme_dir
    elif preview_type == "props":
        # props: 输入是目录路径（theme 目录）
        theme_dir = src if src.is_dir() else src.parent
        content = json.dumps(build_props_data(theme_dir), ensure_ascii=False)
        feedback_dir = theme_dir
    elif preview_type == "videos":
        # videos: 输入是目录路径（theme 目录）
        theme_dir = src if src.is_dir() else src.parent
        content = json.dumps(build_videos_data(theme_dir), ensure_ascii=False)
        feedback_dir = theme_dir
    else:
        # lyric / script: 输入是文件路径
        content = src.read_text(encoding="utf-8")
        feedback_dir = src.parent
        theme_dir = None

    injected = template.replace(
        "const PREVIEW_LANG = null;  /* __PREVIEW_LANG__ */",
        f"const PREVIEW_LANG = {json.dumps(parsed.lang or None)};",
    ).replace(
        "const PREVIEW_TYPE = null;  /* __PREVIEW_TYPE__ */",
        f"const PREVIEW_TYPE = {json.dumps(preview_type or None)};",
    ).replace(
        "const PREVIEW_DATA = null;  /* __PREVIEW_DATA__ */",
        f"const PREVIEW_DATA = {json.dumps(content)};",
    )

    server = HTTPServer(("127.0.0.1", parsed.port), PreviewHandler)
    port = server.server_address[1]

    PreviewHandler.html_content = injected
    PreviewHandler.feedback_path = feedback_dir / "feedback.md"
    PreviewHandler.theme_dir = theme_dir
    PreviewHandler.server_ref = server

    url = f"http://127.0.0.1:{port}"
    print(f"PREVIEW_URL={url}")
    print(f"等待用户提交...")

    webbrowser.open(url)
    server.serve_forever()
    print("服务器已停止")


if __name__ == "__main__":
    main()
