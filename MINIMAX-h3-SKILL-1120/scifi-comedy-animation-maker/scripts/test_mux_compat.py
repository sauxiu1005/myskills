"""Real FFmpeg mux regression: silence, sound, duration, frame count and decode.

Requires ffmpeg/ffprobe on PATH; no tests are silently skipped.
"""
import array
import json
from pathlib import Path
import subprocess
import tempfile
import unittest

SCRIPT = Path(__file__).with_name('mux_compat.sh')


def run(*cmd):
    return subprocess.run(cmd, capture_output=True, check=True)


class MuxTests(unittest.TestCase):
    def check_mux(self, sound, silent):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp)
            video, audio, output = (str(path / n) for n in ('picture.mp4', 'audio.wav', 'out.mp4'))
            run('ffmpeg', '-v', 'error', '-f', 'lavfi', '-i',
                'color=c=blue:s=160x90:r=24:d=3', '-c:v', 'libx264', video)
            run('ffmpeg', '-v', 'error', '-f', 'lavfi', '-i', sound, '-t', '3', audio)
            result = run('sh', str(SCRIPT), video, audio, output, '3', '24')
            self.assertEqual(b'skipping normalization' in result.stderr, silent)
            probe = json.loads(run('ffprobe', '-v', 'error', '-count_frames',
                                  '-show_streams', '-show_format', '-of', 'json', output).stdout)
            streams = {s['codec_type']: s for s in probe['streams']}
            self.assertEqual(int(streams['video']['nb_read_frames']), 72)
            self.assertEqual((streams['video']['width'], streams['video']['height']), (160, 90))
            self.assertEqual(streams['audio']['sample_rate'], '48000')
            self.assertAlmostEqual(float(probe['format']['duration']), 3, delta=0.05)
            run('ffmpeg', '-v', 'error', '-xerror', '-i', output, '-f', 'null', '-')
            decoded = array.array('f', run('ffmpeg', '-v', 'error', '-i', output,
                                          '-map', '0:a:0', '-f', 'f32le', '-').stdout)
            peak = max(abs(x) for x in decoded)
            self.assertLess(peak, 1e-6) if silent else self.assertGreater(peak, 0.01)

    def test_silent_audio_keeps_video_and_silence(self):
        self.check_mux('anullsrc=r=48000:cl=mono', True)

    def test_audible_audio_still_normalizes(self):
        self.check_mux('sine=frequency=440:sample_rate=48000', False)


if __name__ == '__main__':
    unittest.main()
