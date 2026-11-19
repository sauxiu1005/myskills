"""Real landscape/portrait decode and region tests; requires ffmpeg/ffprobe."""
from pathlib import Path
import subprocess
import tempfile
import unittest

import numpy as np
import band_metric


class BandTests(unittest.TestCase):
    def make_video(self, path, width, height, altered=False):
        # Asymmetric dark pattern detects accidental portrait-to-landscape reshaping.
        image = np.zeros((height, width, 3), dtype=np.uint8)
        image[:] = (10, 20, 30)
        image[:height // 4, :width // 4] = (30, 40, 50)
        if altered:
            image[:height // 4, :width // 8] += 12
        subprocess.run(['ffmpeg', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24',
                        '-s', f'{width}x{height}', '-r', '1', '-i', '-', '-frames:v', '1',
                        '-c:v', 'ffv1', str(path)], input=image.tobytes(), check=True, capture_output=True)
        return image

    def test_landscape_and_portrait_pixel_layout_and_metric(self):
        with tempfile.TemporaryDirectory() as tmp:
            for width, height in ((1920, 1080), (1080, 1920)):
                with self.subTest(size=(width, height)):
                    master = Path(tmp) / f'master-{width}.mkv'
                    encode = Path(tmp) / f'encode-{width}.mkv'
                    expected = self.make_video(master, width, height)
                    self.make_video(encode, width, height, altered=True)
                    size = band_metric.dimensions(str(master))
                    self.assertEqual(size, (width, height))
                    decoded = band_metric.frame(str(master), 0, size)
                    np.testing.assert_array_equal(decoded, expected)
                    for region in band_metric.regions(*size).values():
                        self.assertEqual(decoded[region].shape, (height // 4, width // 4, 3))
                    cmd = ['python3', str(Path(band_metric.__file__)), str(master)]
                    same = subprocess.run(cmd + [str(master), '0'], capture_output=True, text=True, check=True)
                    self.assertIn('worst lf99 0', same.stdout)
                    changed = subprocess.run(cmd + [str(encode), '0'], capture_output=True, text=True, check=True)
                    self.assertIn('TL ', changed.stdout)
                    self.assertGreater(float(changed.stdout.split('worst lf99 ')[1]), 1)

    def test_mismatched_dimensions_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            a, b = Path(tmp) / 'a.mkv', Path(tmp) / 'b.mkv'
            self.make_video(a, 160, 90)
            self.make_video(b, 90, 160)
            with self.assertRaisesRegex(ValueError, 'dimensions must match'):
                band_metric.main(str(a), str(b), ['0'])

    def test_missing_frame_is_not_reported_as_pass(self):
        with tempfile.TemporaryDirectory() as tmp:
            a = Path(tmp) / 'a.mkv'
            self.make_video(a, 160, 90)
            with self.assertRaisesRegex(ValueError, 'no complete'):
                band_metric.frame(str(a), 100, (160, 90))


if __name__ == '__main__':
    unittest.main()
