const test=require('node:test'),assert=require('node:assert/strict');
const I=require('../interlude.js'),B=require('../bonus-puzzle.js'),R=require('../logic.js');
const seed=start=>{let value=start;return()=>{value=(value*1664525+1013904223)>>>0;return value/4294967296;};};
function solvable(tiles,n){const empty=n*n-1,values=tiles.filter(x=>x!==empty);let inversions=0;for(let i=0;i<values.length;i++)for(let j=i+1;j<values.length;j++)if(values[i]>values[j])inversions++;return n%2?inversions%2===0:(inversions+n-Math.floor(tiles.indexOf(empty)/n))%2===1;}
test('all ten choices of three seals trigger once, two/four/five never do',()=>{
 for(let a=0;a<5;a++)for(let b=a+1;b<5;b++)for(let c=b+1;c<5;c++){const s=R.fresh();[a,b,c].forEach(i=>s.solved[i]=true);assert.equal(I.shouldStart(s),true);s.interludeStarted=true;assert.equal(I.shouldStart(s),false);s.interludeCompleted=true;assert.equal(I.shouldStart(s),false);}
 for(const n of [0,1,2,4,5]){const s=R.fresh();s.solved=s.solved.map((_,i)=>i<n);assert.equal(I.shouldStart(s),false);}
});
test('old saves and interrupted/completed interludes preserve all five core seals',()=>{
 const old=R.migrate({version:2,solved:[true,false,true,false,true]});assert.equal(I.shouldStart(old),true);
 const current=R.migrate({...old,version:3,interludeStarted:true,interludeRun:{checkpoint:2,collected:['map','bad','map'],detections:2,elapsed:45}});
 assert.deepEqual(current.solved,old.solved);assert.equal(I.shouldStart(current),false);assert.deepEqual(current.interludeRun.collected,['map']);assert.deepEqual(I.create(current.interludeRun).player.x,I.checkpoints[2].x);
 const done=R.migrate({...current,interludeCompleted:true});assert.equal(done.interludeRun,null);assert.equal(I.shouldStart(done),false);
});
test('start, all safety points, goal, and optional objects share an accessible floor network',()=>{
 I.checkpoints.forEach(p=>assert.equal(I.free(p.x,p.y),true,JSON.stringify(p)));
 const start=I.checkpoints[0],queue=[start],visited=new Set([`${start.x},${start.y}`]);
 for(let k=0;k<queue.length;k++){const p=queue[k];for(const [dx,dy]of [[20,0],[-20,0],[0,20],[0,-20]]){const q={x:p.x+dx,y:p.y+dy},key=`${q.x},${q.y}`;if(!visited.has(key)&&I.free(q.x,q.y)&&I.free(p.x+dx/2,p.y+dy/2)){visited.add(key);queue.push(q);}}}
 for(const target of [...I.items,...I.checkpoints,{x:1380,y:195}])assert.ok(queue.some(p=>Math.hypot(p.x-target.x,p.y-target.y)<30),JSON.stringify(target));
});
test('patrol routes stay on free ground, including the segments between waypoints',()=>{
 for(const route of I.routes)for(let i=1;i<route.length;i++){const a=route[i-1],b=route[i];for(let t=0;t<=1;t+=.02)assert.ok(I.free(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t),JSON.stringify([a,b,t]));}
});
test('direct movement stops without inertia, and obstacles and courtyard walls block feet',()=>{
 const run=I.create();run.guards=[];const p=run.player;
 for(let i=0;i<20;i++)I.update(run,.05,{up:true});assert.ok(p.y<875);const y=p.y;for(let i=0;i<20;i++)I.update(run,.05,{});assert.equal(p.y,y);
 p.x=320;p.y=400;for(let i=0;i<100;i++)I.update(run,.05,{right:true});assert.ok(p.x<340);
 p.x=245;p.y=875;for(let i=0;i<100;i++)I.update(run,.05,{left:true});assert.ok(p.x>=212);assert.ok(I.free(p.x,p.y));
});
test('sight requires direction and range; the cart really blocks line of sight',()=>{
 assert.equal(I.sees({x:300,y:260,angle:0},{x:410,y:260}),true);
 assert.equal(I.sees({x:300,y:260,angle:Math.PI},{x:410,y:260}),false);
 assert.equal(I.sees({x:300,y:260,angle:0},{x:600,y:260}),false);
 assert.equal(I.sees({x:320,y:400,angle:0},{x:520,y:400}),false);
 assert.equal(I.segmentHit({x:320,y:400},{x:520,y:400},I.obstacles[0])!==null,true);
});
test('an alarm pauses, respawns safely, and never changes core progress',()=>{
 const run=I.create();run.immune=0;run.player.x=300;run.player.y=260;run.guards=[{x:280,y:260,angle:0,wait:100,target:1,sign:1}];
 assert.ok(I.update(run,.05,{}).includes('alarm'));assert.equal(run.detections,1);const x=run.player.x;
 I.update(run,.05,{right:true});assert.equal(run.player.x,x);for(let i=0;i<20;i++)I.update(run,.05,{});assert.ok(I.free(run.player.x,run.player.y));assert.equal(run.player.x,I.checkpoints[0].x);assert.ok(run.immune>0);
});
test('optional objects can all be collected, but the goal succeeds with none',()=>{
 const run=I.create();run.guards=[];for(const item of I.items){Object.assign(run.player,{x:item.x,y:item.y});I.update(run,.05,{});}assert.deepEqual(run.collected,I.items.map(i=>i.id));
 const empty=I.create();empty.guards=[];Object.assign(empty.player,{x:1380,y:195});assert.ok(I.update(empty,.05,{}).includes('goal'));assert.deepEqual(empty.collected,[]);assert.equal(empty.phase,'result');assert.equal(I.create(I.snapshot(empty)).phase,'result');
});
for(const motif of B.motifs)for(const mode of ['swap','slide'])for(const size of [3,4,5])test(`${motif.id} / ${mode} / ${size}: complete coverage and valid shuffle`,()=>{
 for(let k=1;k<=12;k++){const game=B.create({motif:motif.id,mode,size},seed(k));assert.equal(new Set(game.tiles).size,size*size);assert.equal(game.done,false);assert.equal(B.complete(game.tiles),false);if(mode==='slide')assert.ok(solvable(game.tiles,size));}
 let area=0;for(let i=0;i<size*size;i++){const r=B.bounds(i,size,motif.width,motif.height);area+=r.w*r.h;assert.ok(r.x+r.w<=motif.width);assert.ok(r.y+r.h<=motif.height);}assert.equal(area,motif.width*motif.height);
});
test('swap supports arbitrary pairs, deselection, and solution recognition',()=>{
 const g={size:3,mode:'swap',tiles:[8,1,2,3,4,5,6,7,0],selected:null,done:false};assert.equal(B.choose(g,0),'selected');assert.equal(B.choose(g,0),'deselected');assert.equal(B.choose(g,0),'selected');assert.equal(B.choose(g,8),'complete');assert.ok(g.done);assert.equal(B.choose(g,0),'ignored');
});
test('sliding rejects diagonal/distant moves and recognizes a completed board',()=>{
 const g={size:3,mode:'slide',tiles:[0,1,2,3,4,5,6,8,7],selected:null,done:false};const before=[...g.tiles];assert.equal(B.choose(g,3),'blocked');assert.equal(B.choose(g,0),'blocked');assert.deepEqual(g.tiles,before);assert.equal(B.choose(g,8),'complete');assert.ok(g.done);
});
test('new settings/statistics are validated; resetting has no interlude or puzzle progress',()=>{
 const s=R.migrate({version:3,solved:[true,true,true,false,false],interludeCompleted:true,interludeStats:{collectibles:['map','other'],undetected:true},bonusSettings:{motif:'bad',mode:'other',size:99},bonusCompleted:['control-post:swap:3','bad']});
 assert.ok(s.interludeStarted);assert.deepEqual(s.bonusSettings,{motif:'control-post',mode:'swap',size:3});assert.deepEqual(s.bonusCompleted,['control-post:swap:3']);assert.deepEqual(s.interludeStats.collectibles,['map']);const reset=R.fresh();assert.equal(reset.interludeStarted,false);assert.equal(reset.interludeCompleted,false);assert.equal(reset.interludeRun,null);assert.deepEqual(reset.bonusCompleted,[]);
});

test('an observed route reaches the gate undetected after observing the southbound patrol at multiple frame rates',()=>{
 for(const dt of [.016,.025,.05]){
  const run=I.create(),route=[[245,260],[665,260],[665,390],[820,390],['wait',20],[940,390],[940,530],[1370,530],[1370,195]];
  for(const target of route){for(let frame=0;frame<10000&&run.phase==='play';frame++){
   if(target[0]==='wait'){if(run.elapsed>=target[1])break;I.update(run,dt,{});continue;}
   const dx=target[0]-run.player.x,dy=target[1]-run.player.y;if(Math.hypot(dx,dy)<I.speed*dt+1)break;
   I.update(run,dt,Math.abs(dx)>I.speed*dt?{[dx>0?'right':'left']:true}:{[dy>0?'down':'up']:true});
  }}
  assert.equal(run.phase,'result');assert.equal(run.detections,0,`${dt} seconds/frame`);assert.ok(run.elapsed>=30&&run.elapsed<=40);
 }
});
