#!/usr/bin/env python3
"""启动本地预览服务器，用于 drama-soundtrack skill 的预览功能。

支持两种预览类型：
  - soundtrack_plan: 原声蓝图审阅（卡片式展示所有计划曲目）
  - soundtrack_gallery: 最终音频画廊（带播放器的音频展示）

用法：
  python3 render_soundtrack_preview.py <目录路径> --type soundtrack_plan
  python3 render_soundtrack_preview.py <目录路径> --type soundtrack_gallery

流程：
  1. 解析 soundtrack-plan.md 或扫描音频文件
  2. 注入 HTML 模板
  3. 启动本地 HTTP 服务器
  4. 在浏览器中打开预览页面
  5. 用户提交反馈后，写入 feedback.md，服务器自动退出
"""

import argparse
import base64
import json
import mimetypes
import re
import sys
import threading
import webbrowser
from http.server import HTTPServer, BaseHTTPRequestHandler
from pathlib import Path

SKILL_DIR = Path(__file__).resolve().parent.parent
TEMPLATE_DIR = SKILL_DIR / "html"

AUDIO_EXTS = {".mp3", ".wav", ".ogg", ".m4a", ".flac"}


def parse_soundtrack_plan(plan_path: Path) -> dict:
    """解析 soundtrack-plan.md，返回结构化数据。"""
    text = plan_path.read_text(encoding="utf-8")
    result = {
        "title": "",
        "character_themes": [],
        "opening": None,
        "ending": None,
        "bgm": [],
    }

    # 提取标题
    m = re.search(r"^#\s+(.+)$", text, re.MULTILINE)
    if m:
        result["title"] = m.group(1).strip()

    # 按二级标题拆分
    sections: dict[str, str] = {}
    current = None
    lines: list[str] = []
    for line in text.split("\n"):
        h2 = re.match(r"^##\s+(.+)$", line)
        if h2:
            if current:
                sections[current] = "\n".join(lines)
            current = h2.group(1).strip()
            lines = []
        else:
            lines.append(line)
    if current:
        sections[current] = "\n".join(lines)

    def parse_track(block: str) -> dict:
        """从一个三级标题下的文本块中提取曲目信息。"""
        track: dict = {}
        for line in block.split("\n"):
            line = line.strip()
            if line.startswith("- 风格标签："):
                track["style_tags"] = line[len("- 风格标签："):].strip()
            elif line.startswith("- 人声风格："):
                track["vocal_style"] = line[len("- 人声风格："):].strip()
            elif line.startswith("- 情感基调："):
                track["emotion"] = line[len("- 情感基调："):].strip()
            elif line.startswith("- 关键乐器："):
                track["instruments"] = line[len("- 关键乐器："):].strip()
            elif line.startswith("- 歌词方向："):
                track["lyrics_direction"] = line[len("- 歌词方向："):].strip()
            elif line.startswith("- 节奏："):
                track["tempo"] = line[len("- 节奏："):].strip()
            elif line.startswith("- 设计理由："):
                track["rationale"] = line[len("- 设计理由："):].strip()
            elif line.startswith("- Hook 策略："):
                track["hook_strategy"] = line[len("- Hook 策略："):].strip()
            elif line.startswith("- 场景描述："):
                track["scene_description"] = line[len("- 场景描述："):].strip()
            elif line.startswith("- 情感类型："):
                track["emotion_type"] = line[len("- 情感类型："):].strip()
            elif line.startswith("- 时长预估："):
                track["duration_estimate"] = line[len("- 时长预估："):].strip()
        return track

    def parse_tracks_in_section(section_text: str) -> list[dict]:
        """拆分三级标题，解析每个曲目块。"""
        tracks = []
        current_name = None
        current_lines: list[str] = []
        for line in section_text.split("\n"):
            h3 = re.match(r"^###\s+(.+)$", line)
            if h3:
                if current_name:
                    track = parse_track("\n".join(current_lines))
                    track["name"] = current_name
                    tracks.append(track)
                current_name = h3.group(1).strip()
                current_lines = []
            else:
                current_lines.append(line)
        if current_name:
            track = parse_track("\n".join(current_lines))
            track["name"] = current_name
            tracks.append(track)
        return tracks

    # 角色主题曲
    for key in sections:
        if "角色主题曲" in key:
            result["character_themes"] = parse_tracks_in_section(sections[key])

    # 片头曲
    for key in sections:
        if "片头曲" in key or "OP" in key:
            tracks = parse_tracks_in_section(sections[key])
            if tracks:
                result["opening"] = tracks[0]

    # 片尾曲
    for key in sections:
        if "片尾曲" in key or "ED" in key:
            tracks = parse_tracks_in_section(sections[key])
            if tracks:
                result["ending"] = tracks[0]

    # 场景配乐
    for key in sections:
        if "场景配乐" in key:
            result["bgm"] = parse_tracks_in_section(sections[key])

    return result


def scan_audio_gallery(project_dir: Path) -> dict:
    """扫描项目目录下的所有 selected.mp3 文件，构建画廊数据。"""

    def to_url(abs_path: str) -> str:
        encoded = base64.urlsafe_b64encode(abs_path.encode()).decode()
        return f"/audio/{encoded}"

    gallery = {
        "title": project_dir.name,
        "character_themes": [],
        "opening": None,
        "ending": None,
        "bgm": [],
    }

    # 角色主题曲
    ct_dir = project_dir / "character-themes"
    if ct_dir.exists():
        for d in sorted(ct_dir.iterdir()):
            if not d.is_dir():
                continue
            selected = d / "selected.mp3"
            if selected.exists():
                lyrics_file = d / "lyrics.md"
                prompt_file = d / "prompt.md"
                gallery["character_themes"].append({
                    "name": d.name,
                    "audio_url": to_url(str(selected.resolve())),
                    "has_lyrics": lyrics_file.exists(),
                    "has_prompt": prompt_file.exists(),
                })

    # OP
    op_selected = project_dir / "opening" / "selected.mp3"
    if op_selected.exists():
        gallery["opening"] = {
            "name": "片头曲",
            "audio_url": to_url(str(op_selected.resolve())),
        }

    # ED
    ed_selected = project_dir / "ending" / "selected.mp3"
    if ed_selected.exists():
        gallery["ending"] = {
            "name": "片尾曲",
            "audio_url": to_url(str(ed_selected.resolve())),
        }

    # BGM
    bgm_dir = project_dir / "bgm"
    if bgm_dir.exists():
        for d in sorted(bgm_dir.iterdir()):
            if not d.is_dir():
                continue
            selected = d / "selected.mp3"
            if selected.exists():
                gallery["bgm"].append({
                    "name": d.name,
                    "audio_url": to_url(str(selected.resolve())),
                })

    return gallery


class PreviewHandler(BaseHTTPRequestHandler):
    html_content: str = ""
    feedback_path: Path = Path("feedback.md")
    server_ref: HTTPServer | None = None

    def do_GET(self):
        if self.path.startswith("/audio/"):
            self._serve_audio()
            return
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        self.wfile.write(self.html_content.encode("utf-8"))

    def _serve_audio(self):
        encoded = self.path[len("/audio/"):]
        try:
            audio_path = Path(base64.urlsafe_b64decode(encoded).decode("utf-8"))
        except Exception:
            self.send_error(400, "invalid audio path")
            return
        if not audio_path.exists():
            self.send_error(404, "audio not found")
            return
        mime = mimetypes.guess_type(str(audio_path))[0] or "audio/mpeg"
        data = audio_path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", mime)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "max-age=3600")
        self.end_headers()
        self.wfile.write(data)

    def do_POST(self):
        if self.path == "/feedback":
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
        else:
            self.send_error(404)

    def _shutdown(self):
        if self.server_ref:
            self.server_ref.shutdown()

    def log_message(self, format, *args):
        pass


def main():
    parser = argparse.ArgumentParser(description="启动 Drama Soundtrack 预览服务器")
    parser.add_argument("path", help="项目目录路径 (如 .drama-soundtrack/剧名/)")
    parser.add_argument("--type", required=True,
                        choices=["soundtrack_plan", "soundtrack_gallery"],
                        help="预览类型")
    parser.add_argument("--port", type=int, default=0, help="端口号，默认自动分配")
    parsed = parser.parse_args()

    src = Path(parsed.path).resolve()
    if not src.exists():
        print(f"ERROR: 路径不存在: {src}")
        sys.exit(1)

    preview_type = parsed.type
    template_path = TEMPLATE_DIR / f"preview-{preview_type}.html"
    if not template_path.exists():
        print(f"ERROR: 模板不存在: {template_path}")
        sys.exit(1)

    template = template_path.read_text(encoding="utf-8")

    if preview_type == "soundtrack_plan":
        plan_file = src / "soundtrack-plan.md"
        if not plan_file.exists():
            print(f"ERROR: soundtrack-plan.md 不存在: {plan_file}")
            sys.exit(1)
        content = json.dumps(parse_soundtrack_plan(plan_file), ensure_ascii=False)
    else:  # soundtrack_gallery
        content = json.dumps(scan_audio_gallery(src), ensure_ascii=False)

    injected = template.replace(
        "const PREVIEW_DATA = null;  /* __PREVIEW_DATA__ */",
        f"const PREVIEW_DATA = {json.dumps(content)};",
    )

    server = HTTPServer(("127.0.0.1", parsed.port), PreviewHandler)
    port = server.server_address[1]

    PreviewHandler.html_content = injected
    PreviewHandler.feedback_path = src / "feedback.md"
    PreviewHandler.server_ref = server

    url = f"http://127.0.0.1:{port}"
    print(f"PREVIEW_URL={url}")
    print("等待用户提交...")

    webbrowser.open(url)
    server.serve_forever()
    print("服务器已停止")


if __name__ == "__main__":
    main()
