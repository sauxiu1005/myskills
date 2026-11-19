"""角色选择入口（唯一）：每个工程在 cues.json 的 "cast" 里显式声明自己的角色。

  "cast": {
    "lead":  {"name": "橘猫", "kind": "custom", "module": "engine.cat",        "note": "唯一主角"},
    "owner": {"name": "主人", "kind": "sprite", "module": "characters.owner",  "note": "配角，只在卧室出现"}
  }

kind:
  sprite      characters/<模块>.py 里用字符矩阵手工画的网格角色（新主题默认走这里）
  custom      工程自带的代码角色（如 engine/cat.py）
  legacy_zhou 旧示例人物（眼镜大头青年·芥末黄卫衣）。只用于复现旧示例或用户明确要求沿用；
              没有在 cast 里声明它时，draw_zhou / A.hero / A.npc 直接报错，不会静默回落。
"""
import importlib, json, os

HERE = os.path.dirname(os.path.abspath(__file__))
CUES = os.environ.get("PIX_CUES") or os.path.normpath(os.path.join(HERE, "..", "..", "cues.json"))


class CastError(RuntimeError):
    pass


def cast():
    with open(CUES, encoding="utf-8") as f:
        return json.load(f).get("cast", {})


def role(key):
    c = cast()
    if key not in c:
        raise CastError("cues.json 的 cast 里没有角色 %r（已有：%s）。新主题请按文案设计角色并在 cast 中显式声明。" % (key, list(c)))
    return c[key]


def load(key):
    spec = role(key)
    if spec.get("kind") == "legacy_zhou":
        from . import character
        return character
    return importlib.import_module(spec["module"])


def legacy_allowed():
    return any(v.get("kind") == "legacy_zhou" for v in cast().values())


def require_legacy():
    if not legacy_allowed():
        raise CastError("旧示例人物 draw_zhou（眼镜青年/黄卫衣）未在 cues.json cast 中声明 kind=legacy_zhou。"
                        "它不是默认角色：请在 characters/ 下为本主题画新角色，或在用户明确要求沿用时再显式声明。")
