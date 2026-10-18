'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const W=require('../report-walk.js');
// Breadth-first search over feet positions with the real collision rule.
function reachable(step=4){
 const start=[W.start.x,W.start.y],queue=[start],seen=new Set([start.join()]);
 for(let k=0;k<queue.length;k++){const [x,y]=queue[k];for(const [dx,dy] of [[step,0],[-step,0],[0,step],[0,-step]]){const n=[x+dx,y+dy],key=n.join();if(!seen.has(key)&&W.free(...n)){seen.add(key);queue.push(n);}}}
 return queue;
}
const area=reachable();
test('start is free and every station plus the signpost can be reached on foot',()=>{
 assert.equal(W.free(W.start.x,W.start.y),true);
 for(const s of [...W.stations,W.sign]){const inside=area.filter(([x,y])=>Math.hypot(x-s.x,y-s.y)<=s.r);assert.ok(inside.length>=60,`${s.id||'sign'}: ${inside.length}`);}
});
test('stations do not overlap, so one place never yields two observations',()=>{
 for(let i=0;i<W.stations.length;i++)for(let j=i+1;j<W.stations.length;j++){const a=W.stations[i],b=W.stations[j];assert.ok(Math.hypot(a.x-b.x,a.y-b.y)>a.r+b.r,a.id+'/'+b.id);}
});
test('painted obstacles block the feet: central olive island, market stalls, guard post wall, map edges',()=>{
 for(const [x,y] of [[840,420],[1180,200],[1150,640],[60,300],[10,890],[250,40]])assert.equal(W.free(x,y),false,`${x},${y}`);
 for(const [x,y] of [[250,700],[830,300],[1266,706]])assert.equal(W.free(x,y),true,`${x},${y}`);
});
test('the walkable network is one connected loop without dead-end islands',()=>{
 // Every walkable cell centre with room for feet belongs to the area reached from the gate.
 const reach=new Set(area.map(([x,y])=>`${Math.floor(x/W.cell)},${Math.floor(y/W.cell)}`));let free=0,missing=0;
 for(let cy=0;cy<W.rowCount;cy++)for(let cx=0;cx<W.cols;cx++){const x=cx*W.cell+4,y=cy*W.cell+4;if(W.free(x,y)){free++;if(!reach.has(`${cx},${cy}`))missing++;}}
 assert.ok(missing/free<.02,`${missing} of ${free}`);
});
test('movement stops without inertia and walls stop it',()=>{
 const run=W.create();for(let i=0;i<20;i++)W.update(run,.05,{up:true});assert.ok(run.player.y<W.start.y-50);
 const y=run.player.y;for(let i=0;i<10;i++)W.update(run,.05,{});assert.equal(run.player.y,y);assert.equal(run.player.direction,'north');
 for(let i=0;i<200;i++)W.update(run,.05,{left:true});assert.ok(W.free(run.player.x,run.player.y));assert.ok(run.player.x>150);
});
test('nearby reports the closest unsecured station, then the signpost; securing is idempotent',()=>{
 const run=W.create();const s=W.stations[0];Object.assign(run.player,{x:s.x,y:s.y});W.update(run,0);assert.equal(run.near,0);
 assert.equal(W.secure(run,0),true);assert.equal(W.secure(run,0),false);W.update(run,0);assert.equal(run.near,-1);
 Object.assign(run.player,{x:W.sign.x,y:W.sign.y});W.update(run,0);assert.equal(run.near,'sign');
 for(const i of [1,2,3])W.secure(run,i);assert.equal(W.complete(run),true);assert.deepEqual(run.found,[0,1,2,3]);
 assert.deepEqual(W.create([3,3,9,-1,'x',1]).found,[1,3]);assert.equal(W.secure(run,7),false);
});
test('a keyboard-style walk from the gate reaches all four stations without teleporting',()=>{
 // Shortest routes on the 4 px lattice, walked with ordinary direction input (one lattice step per update).
 const run=W.create(),dt=4/W.speed,key=p=>p.join(),dirs={'4,0':'right','-4,0':'left','0,4':'down','0,-4':'up'};
 function route(from,goal){const q=[from],prev=new Map([[key(from),null]]);
  for(let k=0;k<q.length;k++){const [x,y]=q[k];if(goal(x,y)){const path=[];let c=key(q[k]);while(c){path.unshift(c.split(',').map(Number));c=prev.get(c);}return path;}
   for(const [dx,dy] of [[4,0],[-4,0],[0,4],[0,-4]]){const n=[x+dx,y+dy];if(!prev.has(key(n))&&W.free(...n)){prev.set(key(n),key(q[k]));q.push(n);}}}
  return null;}
 for(const [i,s] of W.stations.entries()){
  const path=route([run.player.x,run.player.y],(x,y)=>Math.hypot(x-s.x,y-s.y)<=s.r*.85);assert.ok(path,s.id);
  for(let j=1;j<path.length;j++){const d=[path[j][0]-path[j-1][0],path[j][1]-path[j-1][1]].join();W.update(run,dt,{[dirs[d]]:true});
   assert.ok(Math.abs(run.player.x-path[j][0])<.01&&Math.abs(run.player.y-path[j][1])<.01,'blocked at '+path[j]);}
  assert.equal(run.near,i);assert.equal(W.secure(run,i),true);
 }
 assert.equal(W.complete(run),true);
});
test('tap-to-walk: a route to every station and the signpost stays on free ground and ends at the station',()=>{
 for(const [i,s] of W.stations.entries()){
  const run=W.create();assert.equal(W.walkTo(run,s.x,s.y,i),true,s.id);let k=0,events=[];
  while(run.route&&k<4000){const e=W.update(run,.05);events.push(...e);assert.ok(W.free(run.player.x,run.player.y),s.id+' off path');k++;}
  assert.equal(run.near,i,s.id);assert.ok(events.includes('arrived'));
 }
 const run=W.create();assert.equal(W.walkTo(run,W.sign.x,W.sign.y,'sign'),true);
 const tap=W.create();assert.equal(W.walkTo(tap,840,420),true,'a tap on an obstacle walks to the nearest free spot');
});
test('a direction key cancels an automatic route immediately',()=>{
 const run=W.create();W.walkTo(run,W.stations[1].x,W.stations[1].y,1);W.update(run,.05);W.update(run,.05,{up:true});assert.equal(run.route,null);
});
