'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const B=require('../bote.js');
const seed=start=>{let v=start;return()=>{v=(v*1664525+1013904223)>>>0;return v/4294967296;};};
const play=m=>{while(m.s.phase==='playback')m.tick(.05);};
const wait=(m,seconds)=>{for(let t=0;t<seconds;t+=.05)m.tick(.05);};
test('the messenger shows a sequence, accepts it, then adds exactly one sign',()=>{
 const m=B.create(seed(3));m.start();assert.equal(m.s.sequence.length,1);
 const shown=[];while(m.s.phase==='playback'){m.tick(.05);if(m.s.active>=0&&shown[shown.length-1]!==m.s.active)shown.push(m.s.active);}
 assert.deepEqual(shown,m.s.sequence);assert.equal(m.s.phase,'input');
 for(const i of m.s.sequence)assert.equal(m.input(i),true);assert.equal(m.s.phase,'success');assert.equal(m.s.completed,1);
 wait(m,1.05);assert.equal(m.s.phase,'playback');assert.equal(m.s.sequence.length,2);
});
test('input is ignored during playback; one mistake ends the run and keeps the series',()=>{
 const m=B.create(seed(9));m.start();assert.equal(m.input(0),false);assert.equal(m.s.phase,'playback');
 for(let r=0;r<3;r++){play(m);for(const i of m.s.sequence)m.input(i);wait(m,1.05);}
 play(m);const wrong=(m.s.sequence[0]+1)%4;assert.equal(m.input(wrong),false);assert.equal(m.s.phase,'ended');assert.equal(m.s.completed,3);
 wait(m,5);assert.equal(m.s.phase,'ended');assert.equal(m.input(m.s.sequence[0]),false);
});
test('no sign appears three times in a row, even with a stuck random source',()=>{
 const m=B.create(()=>0);m.start();
 for(let r=0;r<12;r++){play(m);for(const i of m.s.sequence)m.input(i);wait(m,1.05);}
 const s=m.s.sequence;for(let i=2;i<s.length;i++)assert.ok(!(s[i]===s[i-1]&&s[i]===s[i-2]),s.join());
});
test('names, ids and time formatting',()=>{
 assert.deepEqual(B.ids,['scroll','amphora','sandal','seal']);assert.equal(B.names.length,4);assert.equal(B.time(75.4),'01:15');
});
