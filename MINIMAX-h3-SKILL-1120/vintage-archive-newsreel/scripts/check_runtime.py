#!/usr/bin/env python3
"""Probe the runtimes this Skill can reuse on the current Design host.

Read-only: never installs, downloads or changes anything. Prints one JSON report
with what is present, which production tiers are ready, and the smallest
project-local step for anything missing. Optional: pass a project root to also
check its runtime/node_modules and .venv.
"""
import glob
import importlib.util
import json
import os
from pathlib import Path
import platform
import re
import shutil
import subprocess
import sys

SKILL = Path(__file__).resolve().parents[1]
VENDOR = SKILL / "vendor" / "lemo-opuscar"


def run(cmd):
    try:
        out = subprocess.run(cmd, capture_output=True, text=True, timeout=20)
        return (out.stdout or out.stderr).strip()
    except Exception as exc:  # noqa: BLE001 - report, never crash
        return f"error: {exc}"


def version_tuple(text):
    m = re.search(r"(\d+)\.(\d+)(?:\.(\d+))?", text or "")
    return tuple(int(x or 0) for x in m.groups()) if m else None


def find_exe(name, extra_globs):
    hit = shutil.which(name)
    if hit:
        return hit
    for pattern in extra_globs:
        for cand in sorted(glob.glob(os.path.expanduser(pattern))):
            if os.access(cand, os.X_OK):
                return cand
    return None


def lock_version(pkg):
    try:
        lock = json.loads((VENDOR / "package-lock.json").read_text())
        return lock["packages"][f"node_modules/{pkg}"]["version"]
    except Exception:  # noqa: BLE001
        return None


def platform_playwright_core():
    """playwright-core JS shipped inside the platform's Python playwright package."""
    spec = importlib.util.find_spec("playwright")
    if not spec or not spec.origin:
        return None, None
    pkg = Path(spec.origin).parent / "driver" / "package"
    try:
        data = json.loads((pkg / "package.json").read_text())
        if data.get("name") == "playwright-core":
            return str(pkg), data.get("version")
    except Exception:  # noqa: BLE001
        pass
    return None, None


def main():
    project = Path(sys.argv[1]).expanduser().resolve() if len(sys.argv) > 1 else None
    report = {"host": f"{platform.system()} {platform.machine()}", "skill_root": str(SKILL)}

    node = find_exe("node", ["~/.hub-global/runtimes/node/bin/node"])
    node_v = run([node, "-v"]) if node else None
    report["node"] = {"path": node, "version": node_v,
                      "ok": bool(node_v and version_tuple(node_v) >= (20, 0, 0))}

    py = sys.executable
    report["python"] = {"path": py, "version": platform.python_version(),
                        "ok": sys.version_info >= (3, 11)}

    ff_globs = ["/Applications/MiniMax Design*.app/Contents/Resources/ffmpeg/{}",
                "~/.hub-global/runtimes/ffprobe/*/{}", "~/.hub-global/runtimes/ffprobe/{}"]
    for tool in ("ffmpeg", "ffprobe"):
        exe = find_exe(tool, [g.format(tool) for g in ff_globs])
        ver = run([exe, "-version"]).splitlines()[0] if exe else None
        report[tool] = {"path": exe, "version": ver, "ok": bool(exe)}
    ffmpeg = report["ffmpeg"]["path"]
    if ffmpeg:
        filters = run([ffmpeg, "-hide_banner", "-filters"])
        need = ["loudnorm", "ebur128", "hqdn3d", "unsharp", "noise", "blackdetect"]
        report["ffmpeg"]["filters_missing"] = [f for f in need if f" {f} " not in filters]
        encoders = run([ffmpeg, "-hide_banner", "-encoders"])
        report["ffmpeg"]["libx264"] = "libx264" in encoders

    browsers = []
    env_exe = os.environ.get("PLAYWRIGHT_CHROME")
    if env_exe:
        browsers.append(env_exe)
    roots = [os.environ.get("PLAYWRIGHT_BROWSERS_PATH") or "",
             "~/Library/Caches/ms-playwright", "~/.cache/ms-playwright"]
    for root in filter(None, roots):
        browsers += glob.glob(os.path.expanduser(root) + "/chromium_headless_shell-*/*/chrome-headless-shell")
        browsers += glob.glob(os.path.expanduser(root) + "/chromium-*/*/Chromium.app/Contents/MacOS/Chromium")
        browsers += glob.glob(os.path.expanduser(root) + "/chromium-*/chrome-linux*/chrome")
    report["headless_browser"] = {"candidates": sorted(set(browsers)), "ok": bool(browsers),
                                  "note": "playwright-core finds a matching build in its cache by itself; "
                                          "set PLAYWRIGHT_CHROME only when its build differs"}
    try:
        from importlib.metadata import version as dist_version
        report["headless_browser"]["python_playwright"] = dist_version("playwright")
    except Exception:  # noqa: BLE001
        report["headless_browser"]["python_playwright"] = None
    report["headless_browser"]["playwright_core_locked"] = lock_version("playwright-core")
    pw_path, pw_ver = platform_playwright_core()
    report["playwright_core_platform"] = {"path": pw_path, "version": pw_ver,
                                         "matches_lock": bool(pw_ver and pw_ver == lock_version("playwright-core"))}
    npm = find_exe("npm", ["~/.hub-global/runtimes/node/bin/npm"])
    report["npm"] = {"path": npm, "ok": bool(npm)}

    mods = {}
    for mod in ["numpy", "scipy", "PIL", "soundfile", "soxr", "numba",
                "kokoro_onnx", "edge_tts", "faster_whisper"]:
        mods[mod] = importlib.util.find_spec(mod) is not None
    report["python_modules"] = mods

    tiers = {
        "render": (report["node"]["ok"] and report["ffmpeg"]["ok"] and report["headless_browser"]["ok"]
                   and (report["playwright_core_platform"]["matches_lock"] or report["npm"]["ok"])),
        "mix_sfx_sheet": mods["numpy"] and mods["scipy"] and mods["PIL"],
        "sampler_and_prep_audio": mods["soundfile"] and mods["soxr"],
        "pluck_banjo_fast": mods["numba"],
        "local_voice": mods["kokoro_onnx"] or mods["edge_tts"],
        "local_asr": mods["faster_whisper"],
    }
    report["tiers_ready"] = tiers

    steps = []
    if project:
        rt = project / "runtime"
        report["project"] = {"root": str(project),
                             "node_modules": (rt / "node_modules" / "playwright-core").is_dir(),
                             "venv": (rt / ".venv" / "bin" / "python").exists()}
        if not report["project"]["node_modules"]:
            if report["playwright_core_platform"]["matches_lock"]:
                steps.append(f"ln -s '{pw_path}' '{rt}/node_modules/playwright-core'   "
                             "# reuse the platform copy (init_project.py does this automatically)")
            elif npm:
                steps.append(f"cd '{rt}' && npm ci --omit=dev   # small, project-local; no browser download")
            else:
                steps.append("no npm and no matching platform playwright-core: report render tier as blocked "
                             "or ask before installing a Node package manager")
    if not (tiers["sampler_and_prep_audio"]):
        steps.append("python3 -m venv --system-site-packages runtime/.venv && "
                     "runtime/.venv/bin/python -m pip install soundfile soxr   # reuse platform numpy/scipy/PIL")
    if not tiers["pluck_banjo_fast"]:
        steps.append("optional: runtime/.venv/bin/python -m pip install numba   # only if pluck.py is used")
    if not tiers["local_voice"]:
        steps.append("prefer platform speech or the user's recording; local Kokoro/edge-tts only if required")
    if not tiers["local_asr"]:
        steps.append("prefer platform subtitle transcription for the speech check; faster-whisper only if required")
    if not report["headless_browser"]["ok"]:
        steps.append("no cached headless browser: ask before running playwright-core's chromium-headless-shell install")
    report["next_steps"] = steps
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
