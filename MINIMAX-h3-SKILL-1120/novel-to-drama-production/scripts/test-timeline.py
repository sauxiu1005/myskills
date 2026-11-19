#!/usr/bin/env python3
"""Offline regression cases for editorial handoffs; no generation calls."""
import copy
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

SCRIPT = Path(__file__).with_name('check-timeline.py')
spec = importlib.util.spec_from_file_location('timeline', SCRIPT)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class TimelineTests(unittest.TestCase):
    def setUp(self):
        self.plan = {
            'schema': 'drama-post/v1', 'duration': 10,
            'target': {'min': 9, 'max': 11},
            'export': {'width': 1280, 'height': 720, 'fps': 24},
            'clips': [
                {'id': 'S1', 'source': 'one.mp4', 'source_duration': 7, 'in': 1, 'out': 6, 'start': 0, 'speed': 1},
                {'id': 'S2', 'source': 'two.mp4', 'source_duration': 5, 'in': 0, 'out': 5, 'start': 5, 'speed': 1}],
            'expected_cues': [
                {'id': 'D1', 'kind': 'dialogue', 'text': '你是谁？'},
                {'id': 'SYS1', 'kind': 'system', 'text': '任务已开启。'}],
            'cues': [
                {'id': 'D1', 'kind': 'dialogue', 'text': '你是谁？', 'source': 'one.mp4', 'start': 1, 'end': 2},
                {'id': 'SYS1', 'kind': 'system', 'text': '任务已开启。', 'source': 'system.wav', 'start': 3, 'end': 4}],
            'overlays': [{'id': 'UI1', 'cue_id': 'SYS1', 'text': '任务已开启', 'position': 'shot-reviewed', 'start': 3, 'end': 5}],
            'allowed_speech_overlaps': []}

    def assertFailure(self, needle):
        self.assertTrue(any(needle in e for e in module.validate(self.plan)), module.validate(self.plan))

    def test_valid_handoff(self):
        self.assertEqual(module.validate(self.plan), [])

    def test_no_dialogue_project(self):
        for key in ('expected_cues', 'cues', 'overlays'):
            self.plan[key] = []
        self.assertEqual(module.validate(self.plan), [])

    def test_missing_system_speech_despite_panel(self):
        self.plan['cues'].pop()
        self.assertFailure('missing required cue: SYS1')

    def test_wrong_spoken_text(self):
        self.plan['cues'][1]['text'] = '任务已结束。'
        self.assertFailure('text differs')

    def test_wrong_speaker_mode(self):
        self.plan['cues'][1]['kind'] = 'dialogue'
        self.assertFailure('kind differs')

    def test_duplicate_original_dialogue(self):
        self.plan['cues'].append(copy.deepcopy(self.plan['cues'][0]))
        self.assertFailure('duplicate cues id')

    def test_unplanned_line(self):
        self.plan['cues'][0]['id'] = 'EXTRA'
        self.assertFailure('unplanned cue')

    def test_cut_off_last_word(self):
        self.plan['cues'][1]['end'] = 10.1
        self.assertFailure('out-of-bounds')

    def test_accidental_double_speech(self):
        self.plan['cues'][1]['start'] = 1.5
        self.assertFailure('unplanned speech overlap')

    def test_intentional_interruption(self):
        self.plan['cues'][1]['start'] = 1.5
        self.plan['allowed_speech_overlaps'] = [['D1', 'SYS1']]
        self.assertEqual(module.validate(self.plan), [])

    def test_invalid_overlap_exception(self):
        self.plan['allowed_speech_overlaps'] = [['D1', 'MISSING']]
        self.assertFailure('invalid allowed')

    def test_black_gap(self):
        self.plan['clips'][1]['start'] = 5.2
        self.assertFailure('video gap')

    def test_empty_video(self):
        self.plan['clips'] = []
        self.assertFailure('video ends')

    def test_premature_end(self):
        self.plan['clips'][1]['out'] = 4
        self.assertFailure('video ends')

    def test_trim_beyond_actual_source(self):
        self.plan['clips'][1]['out'] = 6
        self.assertFailure('invalid source trim')

    def test_crossfade_and_retimed_coverage(self):
        self.plan['clips'][1].update(start=4, source_duration=6, out=6)
        self.assertEqual(module.validate(self.plan), [])
        self.plan['clips'][1].update(source_duration=12, out=12, speed=2)
        self.assertEqual(module.validate(self.plan), [])

    def test_export_duration_constraint(self):
        self.plan['target']['max'] = 9.5
        self.assertFailure('outside target')

    def test_dimension_not_integer(self):
        self.plan['export']['width'] = 1280.5
        self.assertFailure('positive integer')

    def test_nonfinite_and_boolean_values(self):
        for value in (float('nan'), float('inf'), True, '10'):
            with self.subTest(value=value):
                self.plan['duration'] = value
                self.assertFailure('positive and finite')

    def test_overlay_lingers_after_end(self):
        self.plan['overlays'][0]['end'] = 11
        self.assertFailure('out-of-bounds')

    def test_overlay_unknown_link(self):
        self.plan['overlays'][0]['cue_id'] = 'MISSING'
        self.assertFailure('unknown cue_id')

    def test_missing_overlay_asset(self):
        self.plan['overlays'][0]['source'] = 'missing-panel.svg'
        with tempfile.TemporaryDirectory() as directory:
            errors = module.validate(self.plan, Path(directory), True)
            self.assertTrue(any('UI1: source' in error for error in errors))

    def test_malformed_input_does_not_crash(self):
        for value in (None, [], 42, {'schema': 'wrong'}, {'duration': 10, 'clips': [None], 'cues': 'bad'}):
            with self.subTest(value=value):
                self.assertTrue(module.validate(value))

    def test_local_reference_resolution(self):
        with tempfile.TemporaryDirectory() as directory:
            base = Path(directory)
            self.assertTrue(module.validate(self.plan, base, True))
            # Empty fixtures test path resolution only, never media validity.
            for name in ('one.mp4', 'two.mp4', 'system.wav'):
                (base / name).touch()
            self.assertEqual(module.validate(self.plan, base, True), [])
            self.plan['clips'][0]['source'] = 'https://example.invalid/video.mp4'
            self.assertTrue(module.validate(self.plan, base, True))

    def test_cli_exit_codes_and_json(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'plan.json'
            for expected_code in (0, 1, 2):
                if expected_code == 1:
                    self.plan['cues'].pop()
                path.write_text('{' if expected_code == 2 else json.dumps(self.plan))
                result = subprocess.run([sys.executable, str(SCRIPT), str(path)], capture_output=True, text=True)
                self.assertEqual(result.returncode, expected_code, result.stderr)
                self.assertEqual(json.loads(result.stdout)['ok'], expected_code == 0)

    def test_documented_manifest(self):
        guide = SCRIPT.parent.parent / 'references/post-manifest.md'
        sample = guide.read_text().split('```json\n', 1)[1].split('\n```', 1)[0]
        self.assertEqual(module.validate(json.loads(sample)), [])


if __name__ == '__main__':
    unittest.main(verbosity=2)
