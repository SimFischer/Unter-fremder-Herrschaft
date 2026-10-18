const {test}=require('node:test'),assert=require('node:assert/strict');
const M=require('../map-rules.js'),R=require('../logic.js'),I=require('../interlude.js');
const expected=[[0,1,2],[4,3,8],[6,15],[7,14],1,1,[1,2,13],[7,12,10,5]];
for(let r=0;r<8;r++)test(`map clue ${r+1}: unique answer, graded hints and useful feedback`,()=>{
 const t=M.tasks[r];assert.equal(t.hints.length,3);assert.ok(t.hints.every(s=>s.length>20));
 if(M.isChoice(r)){assert.equal(t.answer,expected[r]);assert.ok(t.options.length>=3);assert.equal(M.correct(r,expected[r]),true);for(let i=0;i<t.options.length;i++)if(i!==t.answer)assert.equal(M.correct(r,i),false);assert.ok(M.feedback(r,0).length>20);assert.ok(t.show.every(n=>M.places[n]));return;}
 assert.deepEqual(t.answer,expected[r]);assert.equal(new Set(t.candidates).size,t.candidates.length);
 assert.ok(t.answer.every(n=>t.candidates.includes(n)));assert.ok(t.candidates.length>t.answer.length,'distractors');
 const a={};for(const n of expected[r])M.select(a,r,n);assert.equal(M.correct(r,M.chosen(a,r)),true);
 assert.equal(M.correct(r,[]),false);assert.equal(M.correct(r,expected[r].slice(0,-1)),false);
 for(const n of t.candidates.filter(n=>!t.answer.includes(n))){assert.equal(M.correct(r,[n,...expected[r].slice(1)]),false);const feedback=M.feedback(r,[n]);assert.ok(feedback.length>30);assert.ok(!feedback.includes('undefined'));}
 if(t.answer.length>1){const reversed=[...t.answer].reverse();assert.equal(M.correct(r,reversed),!!t.unordered);M.select(a,r,t.answer[0]);assert.equal(M.chosen(a,r).includes(t.answer[0]),false);}
});
test('silent map: names appear only for places found in completed steps; marker numbers are stable and unique',()=>{
 assert.equal(M.known(0,0).size,0);assert.deepEqual([...M.known(1,1)].sort(),[0,1,2]);
 assert.ok(M.known(0,4).has(7)&&M.known(0,4).has(5));
 const nums=M.places.map((_,i)=>M.number(i));assert.equal(new Set(nums).size,M.places.length);
 for(const p of M.places){for(const v of [p[1],p[2],p[5],p[6]])assert.ok(v>=0&&v<=100,p[0]);}
});
test('map revision 3: earned seal 4 stays, unfinished old route restarts, current choices resume',()=>{
 const old=R.migrate({version:3,mapRevision:2,solved:[true,false,true,true,true],answers:[{},{},{},{stage:10},{}],interludeStarted:true,interludeRun:{checkpoint:2},bonusSettings:{motif:'road-galilee',mode:'slide',size:5}});
 assert.equal(old.solved[3],true);assert.equal(old.answers[3].stage,10);assert.equal(old.interludeRun.checkpoint,2);assert.equal(old.bonusSettings.size,5);
 const unfinished=R.migrate({version:3,mapRevision:2,answers:[{},{},{},{stage:5,mapStep5:[5,2]},{}]});assert.deepEqual(unfinished.answers[3],{stage:0});
 const cur=R.migrate({version:3,mapRevision:3,answers:[{},{},{},{stage:6,mapStep6:[-1,13,{},1,1,2],mapChoice4:1,mapChoice5:9},{}]});
 assert.deepEqual(cur.answers[3].mapStep6,[13,1,2]);assert.equal(cur.answers[3].mapChoice4,1);assert.equal(cur.answers[3].mapChoice5,undefined);
});
test('walk is 50% faster, crouching 65%; normalized diagonal and instantaneous stop',()=>{
 assert.equal(I.speed,72);assert.equal(I.guardSpeed,42);
 for(const [input,factor] of [[{up:true},1],[{up:true,hide:true},.65],[{up:true,right:true},1]]){
  const run=I.create();run.guards=[];const start={...run.player};for(let f=0;f<10;f++)I.update(run,.05,input);
  assert.ok(Math.abs(Math.hypot(run.player.x-start.x,run.player.y-start.y)-72*.5*factor)<1e-6);
  const end={...run.player};I.update(run,.05,{});assert.equal(run.player.x,end.x);assert.equal(run.player.y,end.y);assert.equal(run.player.moving,false);
 }
});
