"""Exercise the packaged checker against valid and deliberately broken bundles."""
import contextlib
import importlib.util
import io
from pathlib import Path
import shutil
import tempfile
import unittest

SPEC = importlib.util.spec_from_file_location("verify_skill", Path(__file__).with_name("verify-skill.py"))
CHECKER = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(CHECKER)
SOURCE = CHECKER.ROOT


class BundleChecks(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="ecommerce-bundle-test-")
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name) / "ecommerce-visual-creator"
        shutil.copytree(SOURCE, self.root, ignore=shutil.ignore_patterns("__pycache__", "*.pyc"))
        CHECKER.ROOT = self.root
        self.addCleanup(setattr, CHECKER, "ROOT", SOURCE)

    def failure(self, message):
        output = io.StringIO()
        with contextlib.redirect_stdout(output), self.assertRaises(SystemExit):
            CHECKER.main()
        self.assertIn(message, output.getvalue())

    def test_real_bundle_without_upstream_showcase_passes(self):
        self.assertFalse((self.root / "assets/showcase").exists())
        with contextlib.redirect_stdout(io.StringIO()):
            self.assertEqual(CHECKER.main(), 0)

    def test_missing_chinese_entrypoint_fails(self):
        (self.root / "SKILL.cn.md").unlink()
        self.failure("missing required file: SKILL.cn.md")

    def test_moved_doc_link_fails(self):
        path = self.root / "docs/README.md"
        with path.open("a", encoding="utf-8") as out:
            out.write("\n[missing](../references/not-bundled.md)\n")
        self.failure("broken local link")

    def test_missing_runtime_reference_fails(self):
        (self.root / "references/product-promo-workflow.md").unlink()
        self.failure("missing bundled reference")

    def test_wrong_identity_fails(self):
        path = self.root / "SKILL.cn.md"
        path.write_text(path.read_text().replace("name: ecommerce-visual-creator", "name: wrong-skill"))
        self.failure("SKILL.cn.md name is invalid")


if __name__ == "__main__":
    unittest.main()
