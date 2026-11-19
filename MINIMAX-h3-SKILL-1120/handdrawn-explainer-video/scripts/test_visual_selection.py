import json,tempfile,unittest
from pathlib import Path
from selection_contract import record,validate_selection
class SelectionTests(unittest.TestCase):
 def test_explicit_style_and_real_hand_are_applied(self):
  with tempfile.TemporaryDirectory() as d:
   p=Path(d);(p/'job.json').write_text(json.dumps({'hand':{'preset':'pen-only'}}));record(p,{'style':{'mode':'catalog','catalog_id':'11'},'hand':'teacher-pen'},'User selected watercolor 11 and white-shirt hand');j=json.loads((p/'job.json').read_text());self.assertEqual(validate_selection(p,j)['hand'],'teacher-pen')
 def test_build_gate_runs_before_art_generation_checks(self):
  from art_direction import verify_art_direction
  with tempfile.TemporaryDirectory() as d:
   with self.assertRaises(FileNotFoundError):verify_art_direction(Path(d),{})
 def test_missing_selection_blocks_production(self):
  with tempfile.TemporaryDirectory() as d:
   with self.assertRaises(FileNotFoundError):validate_selection(Path(d),{})
 def test_no_silent_pen_substitution_or_timeout(self):
  with tempfile.TemporaryDirectory() as d:
   p=Path(d);record(p,{'style':{'mode':'catalog','catalog_id':'11'},'hand':'teacher-pen'},'User selected both');
   with self.assertRaises(ValueError):validate_selection(p,{'hand':{'preset':'pen-only'}})
   s=p/'style/selection.json';v=json.loads(s.read_text());v['confirmation']='timeout_default';s.write_text(json.dumps(v))
   with self.assertRaises(ValueError):validate_selection(p,{'hand':{'preset':'teacher-pen'}})
 def test_all_six_hands_have_verified_hosted_records(self):
  from selection_contract import PACKAGE
  from hosted_assets import records,asset_available
  catalog=json.loads((PACKAGE/'assets/hands/catalog.json').read_text());hands=[x for x in catalog['presets'] if x.get('kind','hand')=='hand'];self.assertEqual(len(hands),6)
  for h in hands:
   key='assets/hands/'+h['source'];self.assertIn(key,records());self.assertTrue(asset_available(PACKAGE/key));self.assertFalse((PACKAGE/key).exists())
 def test_package_catalog_offers_custom_styles_with_anchor(self):
  from style_choice import prepare_catalog,PACKAGE
  from hashlib import sha256
  with tempfile.TemporaryDirectory() as d:
   c=prepare_catalog(Path(d));ids=[e['id'] for e in c['styles']]
   self.assertEqual(ids,[str(n) for n in range(1,14)])
   for e in c['styles']:
    a=Path(d)/'style'/e['anchor'];self.assertEqual(sha256(a.read_bytes()).hexdigest(),e['anchor_sha256'])
    self.assertIn('参考图',(Path(d)/'style'/e['recipe']).read_text())
 def test_numbers_are_consecutive_and_old_numbers_are_gone(self):
  with tempfile.TemporaryDirectory() as d:
   with self.assertRaises(ValueError):record(Path(d),{'style':{'mode':'catalog','catalog_id':'14'},'hand':'teacher-pen'},'User asked for 14')
   record(Path(d),{'style':{'mode':'catalog','catalog_id':'10'},'hand':'teacher-pen'},'User selected 10')
   c=json.loads((Path(d)/'style/catalog.json').read_text());e={x['id']:x for x in c['styles']}
   self.assertEqual(e['1']['library_id'],'custom-minimal-stickman');self.assertEqual(e['4']['library_id'],'custom-ink-wash-bird-bamboo');self.assertEqual(e['8']['library_id'],'custom-retro-warm-picturebook')
   self.assertEqual(e['10']['name'],'美式卡通描线(american-cartoon-ink)');self.assertNotIn('MS Paint',json.dumps(c,ensure_ascii=False))
if __name__=='__main__':unittest.main()
