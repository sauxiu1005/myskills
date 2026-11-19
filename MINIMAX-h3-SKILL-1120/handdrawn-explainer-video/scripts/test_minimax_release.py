from pathlib import Path
import hashlib,json,tempfile,unittest
from PIL import Image,PngImagePlugin
from clean_image import clean_image
from style_choice import verify_style
from video_job import load_manifest

class ReleaseTests(unittest.TestCase):
    def test_cleanup_preserves_pixels_and_removes_metadata(self):
        with tempfile.TemporaryDirectory() as directory:
            root=Path(directory);p=root/'image.png';im=Image.new('RGBA',(9,7),(44,88,132,170));meta=PngImagePlugin.PngInfo();meta.add_text('Comment','private');im.save(p,pnginfo=meta)
            report=clean_image(p,root/'audit.json')
            with Image.open(p) as result:
                self.assertEqual(im.tobytes(),result.tobytes());self.assertEqual(result.info,{})
            self.assertTrue(report['pixels_unchanged'])
    def test_default_style_needs_no_catalog_or_server(self):
        with tempfile.TemporaryDirectory() as directory:
            root=Path(directory);d=root/'style';d.mkdir();selection={'mode':'inferred','confirmation':'automatic_default','evidence':'Simple explanatory drawing selected from topic'};p=d/'selection.json';p.write_text(json.dumps(selection))
            resolved={'mode':'inferred','status':'resolved','selection_sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'style_name':'Simple ink','rationale':'Readable','content_fit':'One object explanation','style_spec':dict.fromkeys(['line','palette','shading','texture','background'],'simple')};(d/'resolved.json').write_text(json.dumps(resolved));self.assertEqual(verify_style(root)['mode'],'inferred')
    def test_removed_options_cannot_silently_render(self):
        with tempfile.TemporaryDirectory() as directory:
            root=Path(directory)
            for extra in [{'watermark':{'text':'brand'}},{'hand':{'pen_text':'brand'}}]:
                (root/'job.json').write_text(json.dumps({'version':1,'pages':[{}],**extra}))
                with self.assertRaisesRegex(ValueError,'does not support'):load_manifest(root)

if __name__=='__main__':unittest.main()
