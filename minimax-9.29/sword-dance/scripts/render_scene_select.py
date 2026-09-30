#!/usr/bin/env python3
"""启动空镜选择预览服务器。

用法：python3 render_scene_select.py [--port PORT]

加载内置预设场景（本地 templates/ 优先，否则由 download_scene_templates
脚本下载到 templates_cache/）和 .sword-dance/generated/ 下 AI 生成的场景，
注入 HTML 模板并在浏览器中打开。
用户选择 2 张空镜后，结果写入 feedback.md，服务器自动退出。
"""

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
from download_scene_templates import PRESET_SCENES, ensure_scene_templates  # noqa: E402

SKILL_DIR = Path(__file__).resolve().parent.parent
TEMPLATE_DIR = SKILL_DIR / "html"
TEMPLATES_DIR = SKILL_DIR / "templates"
PROJECT_ROOT = Path.cwd()  # MCP tool spawns with cwd = user project dir
WORK_DIR = PROJECT_ROOT / ".sword-dance"
EXTRA_SCENES_DIR = WORK_DIR / "generated"
TEMPLATES_CACHE_DIR = WORK_DIR / "templates_cache"
FEEDBACK_PATH = WORK_DIR / "feedback.md"
SELECTED_PATH = WORK_DIR / "selected.md"

IMG_EXTS = {".png", ".jpg", ".jpeg", ".webp"}

SCENE_META = {
    "scene-01": {"zh": "落花飞舞", "en": "Falling Petals"},
    "scene-02": {"zh": "蝴蝶", "en": "Butterfly"},
    "scene-03": {"zh": "古风书房", "en": "Ancient Study"},
}


def to_url(abs_path: str) -> str:
    encoded = base64.urlsafe_b64encode(abs_path.encode()).decode()
    try:
        mtime = int(os.path.getmtime(abs_path))
    except OSError:
        mtime = 0
    return f"/images/{encoded}?t={mtime}"


def scene_name(scene_id: str, lang: str) -> str:
    meta = SCENE_META.get(scene_id)
    if isinstance(meta, dict):
        return meta.get(lang, meta.get("en", scene_id))
    return meta or scene_id


def list_scene_images(scene_dir: Path) -> list[Path]:
    return sorted(
        p for p in scene_dir.iterdir() if p.suffix.lower() in IMG_EXTS
    )


def fetch_cdn_preset(scene_id: str) -> list[Path]:
    """通过 download_scene_templates 模块下载该场景的预设图到本地缓存。"""
    cached = ensure_scene_templates(TEMPLATES_CACHE_DIR, scenes=(scene_id,))
    return cached.get(scene_id, [])


def make_scene_entry(scene_id: str, image_paths: list[Path], lang: str) -> dict:
    return {
        "name": scene_name(scene_id, lang),
        "images": [
            {
                "url": to_url(str(p.resolve())),
                "path": str(p.resolve()),
                "filename": p.name,
            }
            for p in image_paths
        ],
    }


def build_scene_data(lang: str = "zh") -> dict:
    scenes: dict[str, dict] = {}

    # Step 1: 预设池 — 本地 templates/ 优先，缺失则从 CDN 下载到 templates_cache/
    for scene_id in PRESET_SCENES:
        local_dir = TEMPLATES_DIR / scene_id
        if local_dir.is_dir():
            images = list_scene_images(local_dir)
            if images:
                scenes[scene_id] = make_scene_entry(scene_id, images, lang)
                continue
        cached = fetch_cdn_preset(scene_id)
        if cached:
            scenes[scene_id] = make_scene_entry(scene_id, cached, lang)

    # Step 2: AI 生成场景叠加（同名覆盖，但预设用 scene-01~03，生成用 scene-04+）
    if EXTRA_SCENES_DIR.exists():
        for d in sorted(EXTRA_SCENES_DIR.iterdir()):
            if not d.is_dir() or not d.name.startswith("scene-"):
                continue
            images = list_scene_images(d)
            if images:
                scenes[d.name] = make_scene_entry(d.name, images, lang)

    return {"scenes": scenes}


class Handler(BaseHTTPRequestHandler):
    html_content: str = ""
    feedback_path: Path = Path("feedback.md")
    server_ref: HTTPServer | None = None

    def do_GET(self):
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
            self.send_error(400)
            return
        if not img_path.exists():
            self.send_error(404)
            return
        mime = mimetypes.guess_type(str(img_path))[0] or "image/png"
        data = img_path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", mime)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.end_headers()
        self.wfile.write(data)

    def do_POST(self):
        if self.path == "/feedback":
            length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(length).decode("utf-8"))
            feedback = body.get("feedback", "").strip()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            if feedback:
                self.feedback_path.write_text(feedback, encoding="utf-8")
                self.wfile.write(json.dumps({"ok": True}).encode())
                print(f"FEEDBACK_FILE={self.feedback_path}")
                threading.Timer(0.5, self._shutdown).start()
            else:
                self.wfile.write(json.dumps({"ok": False}).encode())
        else:
            self.send_error(404)

    def _shutdown(self):
        if self.server_ref:
            self.server_ref.shutdown()

    def log_message(self, fmt, *args):
        pass


def load_preselect(selected_path: Path) -> list[str]:
    if not selected_path.exists():
        return []
    paths = []
    for line in selected_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line:
            paths.append(line)
    return paths


def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=0)
    parser.add_argument("--lang", default="", help="UI language: zh/en")
    args = parser.parse_args()

    template_path = TEMPLATE_DIR / "preview-scene_select.html"
    if not template_path.exists():
        print(f"ERROR: 模板不存在: {template_path}")
        sys.exit(1)

    feedback_path = FEEDBACK_PATH
    WORK_DIR.mkdir(parents=True, exist_ok=True)
    preselect = load_preselect(SELECTED_PATH)

    template = template_path.read_text(encoding="utf-8")
    data = build_scene_data(lang=args.lang or "zh")
    content = json.dumps(data, ensure_ascii=False)

    injected = template.replace(
        "const PREVIEW_DATA = null;  /* __PREVIEW_DATA__ */",
        f"const PREVIEW_DATA = {json.dumps(content)};",
    )
    injected = injected.replace(
        "const PRESELECT = [];  /* __PRESELECT__ */",
        f"const PRESELECT = {json.dumps(preselect)};",
    )
    injected = injected.replace(
        "const PREVIEW_LANG = null;  /* __PREVIEW_LANG__ */",
        f"const PREVIEW_LANG = {json.dumps(args.lang or None)};",
    )

    server = HTTPServer(("127.0.0.1", args.port), Handler)
    port = server.server_address[1]

    Handler.html_content = injected
    Handler.feedback_path = feedback_path
    Handler.server_ref = server

    url = f"http://127.0.0.1:{port}"
    print(f"PREVIEW_URL={url}")
    print("等待用户选择...")

    webbrowser.open(url)
    server.serve_forever()
    print("服务器已停止")


if __name__ == "__main__":
    main()
