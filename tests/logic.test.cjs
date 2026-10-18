'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const R=require('../logic.js');
test('old completed seals survive, old free text is replaced without revoking progress',()=>{
 const s=R.migrate({version:1,solved:[true,false,true,true,true],answers:[{stage:4},{stage:2},{stage:5},{stage:8},{stage:6,sentence:'Eine alte Erklärung'}],attempts:[0,1,0,0,0]});
 assert.deepEqual(s.solved,[true,false,true,true,true]);assert.equal(s.answers[4].stage,3);assert.equal(s.answers[4].sentence,undefined);assert.equal(s.version,3);
});
test('unfinished old report and route restart safely on the rebuilt puzzles',()=>{
 const s=R.migrate({version:1,solved:[false,false,false,false,false],answers:[{},{},{},{stage:5,place0:0},{stage:5,sentence:'Alt'}]});
 assert.equal(s.answers[3].stage,0);assert.equal(s.answers[3].place0,undefined);assert.deepEqual(s.answers[4],{stage:0});assert.equal(R.argument(s.answers[4]),false);
});
test('report revision 2: earned seal 5 stays, unfinished old report restarts, current walk progress is validated',()=>{
 const old=R.migrate({version:3,mapRevision:2,solved:[true,true,true,true,true],answers:[{},{},{},{},{stage:6,marked:[1,2,3,4],category1:2}]});
 assert.equal(old.solved[4],true);assert.equal(old.answers[4].stage,3);
 const unfinished=R.migrate({version:3,mapRevision:2,solved:[true,false,false,false,false],answers:[{},{},{},{},{stage:4,marked:[1,2],category1:2,obs:0}]});
 assert.deepEqual(unfinished.answers[4],{stage:0});assert.equal(unfinished.reportRevision,2);
 const current=R.migrate({version:3,mapRevision:2,reportRevision:2,solved:[false,false,false,false,false],answers:[{},{},{},{},{stage:9,found:[3,1,1,7,-1,'x'],category0:0,category3:3}]});
 assert.deepEqual(current.answers[4].found,[1,3]);assert.equal(current.answers[4].stage,2);assert.equal(current.answers[4].category3,3);
});
test('messenger record is a bounded integer',()=>{
 assert.equal(R.migrate({version:3,boteBest:12}).boteBest,12);
 for(const v of [-3,'9',1.5,null,100000])assert.ok([0,999].includes(R.migrate({version:3,boteBest:v}).boteBest));
});
test('corrupt and partial saves have safe defaults and cannot open the finale',()=>{
 for(const raw of [null,{},[],{version:33},{version:2,solved:['true',true],answers:[null,{stage:Infinity}],attempts:[-8,'bad'],finale:2}]){
  const s=R.migrate(raw);assert.equal(s.solved.length,5);assert.equal(s.answers.length,5);assert.equal(s.finale,0);assert.ok(s.answers.every(a=>Number.isInteger(a.stage||0)));assert.ok(s.attempts.every(n=>n>=0));
 }
});
test('current saves retain choices and optional progress',()=>{
 const s=R.fresh();s.answers[4]={stage:2,found:[0,1,2,3],category0:0,obs:1,link:1,conclusion:1};s.discoveries=[4];s.bonusRound=3;
 assert.deepEqual(R.migrate(JSON.parse(JSON.stringify(s))),{...s,answers:s.answers.map(a=>({stage:0,...a}))});
});
test('argument must connect evidence and reasoning; two valid paths, mixed paths rejected',()=>{
 assert.ok(R.argument({obs:0,link:0,conclusion:0}));assert.ok(R.argument({obs:1,link:1,conclusion:1}));
 for(const a of [{},{obs:0,link:1,conclusion:0},{obs:2,link:2,conclusion:2},{obs:1,link:0,conclusion:1}])assert.equal(R.argument(a),false);
});
test('seal collection is idempotent and independent of bonus progress',()=>{
 const s=R.fresh();s.bonusRound=5;assert.equal(s.solved.filter(Boolean).length,0);
 assert.equal(R.award(s,0),true);assert.equal(R.award(s,0),false);assert.equal(s.solved.filter(Boolean).length,1);
});

test('corrupt tile indexes are removed before a puzzle is rendered',()=>{
 const s=R.migrate({version:2,answers:[{chain0:[1,8,2,-1,2]}, {marked:[0,3,5,99]}, {}, {}, {found:[1,4,8]}]});
 assert.deepEqual(s.answers[0].chain0,[1,2]);assert.deepEqual(s.answers[1].marked,[0,3,5]);
});
