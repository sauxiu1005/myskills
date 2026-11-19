"""Run with Python + numpy/scipy; exercises the documented cue sheet as supplied."""
import json
from pathlib import Path
import re
import subprocess
import sys
import tempfile
import unittest

import numpy as np
from scipy.io import wavfile

ROOT = Path(__file__).resolve().parents[1]


class ScoreTests(unittest.TestCase):
    def render(self, cues, directory):
        path = directory / 'cues.json'
        path.write_text(json.dumps(cues))
        return subprocess.run([sys.executable, str(ROOT / 'scripts/lofi_score.py'),
                               str(path), str(directory / 'score.wav')], capture_output=True, text=True)

    def test_documentation_template_produces_non_silent_exact_duration(self):
        doc = (ROOT / 'references/workflow-and-qa.md').read_text()
        cues = json.loads(re.search(r'```json\s*(.*?)```', doc, re.S).group(1))
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp)
            result = self.render(cues, path)
            self.assertEqual(result.returncode, 0, result.stderr)
            rate, audio = wavfile.read(path / 'score.wav')
            self.assertEqual(audio.shape, (round(cues['total_frames'] / cues['fps'] * rate), 2))
            self.assertGreater(np.abs(audio.astype(float)).max(), 1000)
            self.assertTrue(np.isfinite(audio).all())

    def test_legacy_frames_remains_supported(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp)
            result = self.render({'fps': 30, 'frames': 30}, path)
            self.assertEqual(result.returncode, 0, result.stderr)
            rate, audio = wavfile.read(path / 'score.wav')
            self.assertEqual(len(audio), rate)

    def test_conflicting_frame_counts_fail_clearly(self):
        with tempfile.TemporaryDirectory() as tmp:
            result = self.render({'fps': 30, 'frames': 30, 'total_frames': 60}, Path(tmp))
            self.assertNotEqual(result.returncode, 0)
            self.assertIn('must agree', result.stderr)


if __name__ == '__main__':
    unittest.main()
