"""Offline audio regressions using synthesized fixtures, no paid/media services.

Run: python scripts/test_audio.py (requires scripts/requirements.txt).
"""
import copy
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parents[1]
SR = 48000


class AudioTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.path = Path(self.tmp.name)
        t = np.arange(3 * SR) / SR
        self.tone = 0.15 * np.sin(2 * np.pi * 440 * t)
        sf.write(self.path / 'tone.wav', self.tone, SR, subtype='FLOAT')

    def run_script(self, script, config, *args):
        path = self.path / 'config.json'
        path.write_text(json.dumps(config))
        cmd = [sys.executable, str(ROOT / 'scripts' / script), *args, str(path)]
        result = subprocess.run(cmd, capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        return result

    def cut(self, segments, frames, crossfade=0.012, silent=False):
        if silent:
            sf.write(self.path / 'tone.wav', np.zeros(3 * SR), SR)
        config = {'timeline': {'fps': 25, 'bpm': 120, 'frames': frames},
                  'music': {'track': 'tone.wav', 'phase': 0, 'segments': segments,
                            'crossfade': crossfade, 'out': 'cue.wav'}}
        self.run_script('music.py', config, 'cut')
        audio, rate = sf.read(self.path / 'cue.wav')
        self.assertEqual(audio.shape, (round(frames / 25 * SR), 2))
        self.assertEqual(rate, SR)
        self.assertTrue(np.isfinite(audio).all())
        if not silent:
            self.assertGreater(np.abs(audio).max(), 0.1)
        else:
            self.assertEqual(np.abs(audio).max(), 0)
        return audio

    def test_music_from_zero_and_exact_source_end(self):
        audio = self.cut(['0:0:6'], 75)
        self.assertGreater(np.abs(audio[:SR // 10]).max(), 0.1)
        self.assertGreater(np.abs(audio[-SR // 5:]).max(), 0.01)

    def test_music_joins_zero_start_and_source_end(self):
        audio = self.cut(['0:0:2', '1:0:2'], 50)
        self.assertGreater(np.abs(audio[SR - 240:SR + 240]).max(), 0.1)

    def test_zero_crossfade_and_short_segment(self):
        self.cut(['0:0:0.08'], 1, crossfade=0)
        self.cut(['0:0:0.08'], 1, crossfade=0.2)

    def test_silent_music_remains_finite_silence(self):
        self.cut(['0:0:2'], 25, silent=True)

    def test_default_template_voice_and_relative_limit(self):
        template = json.loads((ROOT / 'examples/template.json').read_text())
        self.assertFalse(template['mix']['vo']['phrases'][0].get('limit', False))
        # Keep the complete template timeline/phrase timing and provide real local audio fixtures.
        sf.write(self.path / 'bed.wav', np.tile(self.tone, 7)[:20 * SR] * 0.1, SR)
        for first_limit in (False, True):
            with self.subTest(first_limit=first_limit):
                cfg = copy.deepcopy(template)
                mx = cfg['mix']
                mx.update(out='mix-output', music='bed.wav', sfx_files={}, sfx_derived={}, sfx=[])
                mx['vo']['file'] = 'tone.wav'
                mx['vo']['phrases'][0]['limit'] = first_limit
                self.run_script('mix.py', cfg)
                voice, rate = sf.read(self.path / 'mix-output/stems/vo.wav')
                mixed, _ = sf.read(self.path / 'mix-output/mix.wav')
                self.assertEqual(len(voice), 20 * SR)
                start, end = int(16.2 * rate), int(17.5 * rate)
                self.assertGreater(np.sqrt(np.mean(voice[start:end] ** 2)), 0.01)
                self.assertGreater(np.sqrt(np.mean(mixed[start:end] ** 2)), 0.01)
                self.assertTrue(np.isfinite(mixed).all())

    def test_later_voice_is_limited_against_nonzero_predecessor(self):
        cfg = {'timeline': {'fps': 25, 'frames': 75}, 'mix': {
            'out': 'limited', 'music': 'tone.wav', 'vo': {'file': 'tone.wav', 'phrases': [
                {'in': 0.3, 'out': 0.8, 'frame': 5, 'gain': -12},
                {'in': 0.3, 'out': 0.8, 'frame': 40, 'gain': 12, 'limit': True}
            ]}}}
        self.run_script('mix.py', cfg)
        voice, _ = sf.read(self.path / 'limited/stems/vo.wav')
        first = np.abs(voice[int(0.2 * SR):int(0.7 * SR)]).max()
        second = np.abs(voice[int(1.6 * SR):int(2.1 * SR)]).max()
        self.assertGreater(second, 0.001)
        self.assertLessEqual(second, first * 1.05)


if __name__ == '__main__':
    unittest.main()
