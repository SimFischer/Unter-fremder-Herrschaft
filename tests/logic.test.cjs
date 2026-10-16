'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const R=require('../logic.js');
test('old completed seals survive, old free text is replaced without revoking progress',()=>{
 const s=R.migrate({version:1,solved:[true,false,true,true,true],answers:[{stage:4},{stage:2},{stage:5},{stage:8},{stage:6,sentence:'Eine alte Erklärung'}],attempts:[0,1,0,0,0]});
 assert.deepEqual(s.solved,[true,false,true,true,true]);assert.equal(s.answers[4].stage,6);assert.equal(s.answers[4].sentence,undefined);assert.equal(s.version,3);
});
test('unfinished old explanation now requires argument, incomplete route restarts safely',()=>{
 const s=R.migrate({version:1,solved:[false,false,false,false,false],answers:[{},{},{},{stage:5,place0:0},{stage:5,sentence:'Alt'}]});
 assert.equal(s.answers[3].stage,0);assert.equal(s.answers[3].place0,undefined);assert.equal(s.answers[4].stage,5);assert.equal(R.argument(s.answers[4]),false);
});
test('corrupt and partial saves have safe defaults and cannot open the finale',()=>{
 for(const raw of [null,{},[],{version:33},{version:2,solved:['true',true],answers:[null,{stage:Infinity}],attempts:[-8,'bad'],finale:2}]){
  const s=R.migrate(raw);assert.equal(s.solved.length,5);assert.equal(s.answers.length,5);assert.equal(s.finale,0);assert.ok(s.answers.every(a=>Number.isInteger(a.stage||0)));assert.ok(s.attempts.every(n=>n>=0));
 }
});
test('current saves retain choices and optional progress',()=>{
 const s=R.fresh();s.answers[4]={stage:5,obs:1,link:1,conclusion:1};s.discoveries=[4];s.bonusRound=3;
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
 const s=R.migrate({version:2,answers:[{chain0:[1,8,2,-1,2]}, {marked:[0,3,5,99]}, {}, {}, {marked:[1,4,8]}]});
 assert.deepEqual(s.answers[0].chain0,[1,2]);assert.deepEqual(s.answers[1].marked,[0,3,5]);assert.deepEqual(s.answers[4].marked,[1,4]);
});
