import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildPlan, main } from './canvas-plan.mjs';

function fixture() {
  return {
    doc: {title:'示例', meta:{durationSeconds:10}, shots:[
      {id:'S01', start:0, end:4, seconds:4, frame:'红色杯子放在窗边木桌的左侧。'},
      {id:'S02', start:4, end:10, seconds:6, frame:'一只手从右侧拿起桌上的红杯。'}]},
    state: {executionMode:'local-assisted', source:{rangeStartSeconds:30,rangeEndSeconds:40},
      timing:{status:'measured',precisionSeconds:0.01,method:'fixture'},shotEvidence:{}}
  };
}
test('measured statistics distinguish shots from transitions and retain source offset',()=>{
  const {doc,state}=fixture(); const {plan}=buildPlan(doc,state);
  assert.equal(plan.statistics.shotsPerMinute,12);
  assert.equal(plan.statistics.transitionsPerMinute,6);
  assert.deepEqual(plan.shots[1].sourceInterval,{start:34,end:40});
  assert.equal(plan.statistics.meanShotSeconds,5);
  assert.equal(plan.executionStatus,'not-applied');
});
test('one continuous shot has zero transitions',()=>{
  const {doc,state}=fixture(); doc.shots=[{id:'S01',start:0,end:10,seconds:10}];
  assert.equal(buildPlan(doc,state).plan.statistics.transitionsPerMinute,0);
});
test('gaps, overlaps and false durations are rejected',()=>{
  for(const start of [3,5]) { const {doc,state}=fixture(); doc.shots[1].start=start; doc.shots[1].seconds=10-start;
    assert.throws(()=>buildPlan(doc,state),/gap or overlap/); }
  const {doc,state}=fixture(); doc.shots[0].seconds=9;
  assert.throws(()=>buildPlan(doc,state),/duration mismatch/);
});
test('invalid ids, missing measured times and missing provenance are rejected',()=>{
  {const {doc,state}=fixture();doc.shots[1].id='S01';assert.throws(()=>buildPlan(doc,state),/sequential/);}
  {const {doc,state}=fixture();doc.shots[0].start=null;assert.throws(()=>buildPlan(doc,state),/incomplete/);}
  {const {doc,state}=fixture();delete state.timing;assert.throws(()=>buildPlan(doc,state),/explicitly/);}
});
test('source range and end coverage must match',()=>{
  {const {doc,state}=fixture();state.source.rangeEndSeconds=50;assert.throws(()=>buildPlan(doc,state),/Source range/);}
  {const {doc,state}=fixture();doc.shots[1].end=9;doc.shots[1].seconds=5;assert.throws(()=>buildPlan(doc,state),/cover/);}
});
test('drafts retain unknowns without inventing precise statistics',()=>{
  const {doc,state}=fixture(); state.executionMode='observation-draft';state.timing.status='unknown';
  doc.shots.forEach(s=>{s.start=null;s.end=null;s.seconds=null;});
  const {plan,table}=buildPlan(doc,state);
  assert.equal(plan.shots[0].analysisInterval,null);
  assert.equal(plan.statistics.meanShotSeconds,undefined);
  assert.match(table,/时间未知草稿/);
});
test('numeric estimates are visibly labelled and not treated as measurements',()=>{
  const {doc,state}=fixture();state.timing.status='estimated';state.executionMode='observation-draft';
  const {plan,table}=buildPlan(doc,state);assert.match(table,/估算 0–4s/);
  assert.equal(plan.statistics.transitionsPerMinute,undefined);
});
test('observations cannot claim measured timing',()=>{
  const {doc,state}=fixture();state.executionMode='observation-draft';assert.throws(()=>buildPlan(doc,state),/cannot claim/);
});
test('literal content cannot inject table cells or HTML',()=>{
  const {doc,state}=fixture();doc.shots[0].frame='<script>x</script>|a\nb';
  const {table}=buildPlan(doc,state);assert.ok(!table.includes('<script>'));
  assert.match(table,/&#124;a<br>b/);
});
test('CLI creates readable artifacts and refuses overwrite',()=>{
  const temp=mkdtempSync(join(tmpdir(),'design-analysis-test-'));
  try {const {doc,state}=fixture();const input=join(temp,'shots.json');const evidence=join(temp,'state.json');
    writeFileSync(input,JSON.stringify(doc));writeFileSync(evidence,JSON.stringify(state));
    const args=[input,'--state',evidence,'--out',join(temp,'out')];main(args);
    assert.equal(JSON.parse(readFileSync(join(temp,'out/canvas-plan.json'),'utf8')).shots.length,2);
    assert.throws(()=>main(args),/already exist/);
  } finally {rmSync(temp,{recursive:true,force:true});}
});
