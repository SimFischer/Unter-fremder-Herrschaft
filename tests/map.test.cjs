const {test}=require('node:test'),assert=require('node:assert/strict');
const M=require('../map-rules.js'),R=require('../logic.js'),I=require('../interlude.js');
const expected=[[0],[1],[5],[4],[6,7],[5,2],[4,3,8],[5,2,1,0,7]];
for(let r=0;r<8;r++)test(`map clue ${r+1}: unique answer, plausible category, graded hints and useful feedback`,()=>{
 const t=M.tasks[r];assert.deepEqual(t.answer,expected[r]);assert.equal(new Set(t.candidates).size,t.candidates.length);
 assert.ok(t.answer.every(n=>t.candidates.includes(n)));assert.equal(t.hints.length,3);assert.ok(t.hints.every(s=>s.length>20));
 if([2,3,4].includes(r)){assert.ok(t.candidates.length>=4);assert.equal(new Set(t.candidates.map(n=>r===3?(M.places[n][4]==='Ort'?'Ort':'Gewässer'):M.places[n][4])).size,1);}
 const a={};for(const n of expected[r])M.select(a,r,n);assert.equal(M.correct(r,M.chosen(a,r)),true);
 assert.equal(M.correct(r,[]),false);assert.equal(M.correct(r,expected[r].slice(0,-1)),false);
 for(const n of t.candidates.filter(n=>!t.answer.includes(n))){assert.equal(M.correct(r,[n,...expected[r].slice(1)]),false);const feedback=M.feedback(r,[n]);assert.ok(feedback.length>30);assert.ok(!feedback.includes('undefined'));}
 if(t.answer.length>1){const reversed=[...t.answer].reverse();assert.equal(M.correct(r,reversed),!!t.unordered);M.select(a,r,t.answer[0]);assert.equal(M.chosen(a,r).includes(t.answer[0]),false);}
});
test('old route progress and seals survive the changed questions; new multi-step choices resume',()=>{
 const old=R.migrate({version:3,solved:[true,false,true,false,true],answers:[{},{},{},{stage:5,place5:6},{}],interludeStarted:true,interludeRun:{checkpoint:2},bonusSettings:{motif:'road-galilee',mode:'slide',size:5}});
 assert.equal(old.answers[3].stage,5);assert.equal(old.answers[3].place5,undefined);assert.deepEqual(old.solved,[true,false,true,false,true]);assert.equal(old.interludeRun.checkpoint,2);assert.equal(old.bonusSettings.size,5);
 old.answers[3].mapStep5=[5,2];assert.deepEqual(R.migrate(old).answers[3].mapStep5,[5,2]);
 assert.deepEqual(R.migrate({...old,answers:[{},{},{},{mapStep0:[-1,12,{},5,5,2]},{}]}).answers[3].mapStep0,[5,2]);
});
test('walk is 50% faster, crouching 65%; normalized diagonal and instantaneous stop',()=>{
 assert.equal(I.speed,72);assert.equal(I.guardSpeed,42);
 for(const [input,factor] of [[{up:true},1],[{up:true,hide:true},.65],[{up:true,right:true},1]]){
  const run=I.create();run.guards=[];const start={...run.player};for(let f=0;f<10;f++)I.update(run,.05,input);
  assert.ok(Math.abs(Math.hypot(run.player.x-start.x,run.player.y-start.y)-72*.5*factor)<1e-6);
  const end={...run.player};I.update(run,.05,{});assert.equal(run.player.x,end.x);assert.equal(run.player.y,end.y);assert.equal(run.player.moving,false);
 }
});
