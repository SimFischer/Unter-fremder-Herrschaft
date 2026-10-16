/* Save schema and rules are shared by the browser and the dependency-free tests. */
'use strict';
const AdventureRules = (() => {
 const totals=[4,4,5,10,6];
 const fresh=()=>({version:3,solved:Array(5).fill(false),answers:Array.from({length:5},()=>({})),attempts:Array(5).fill(0),discoveries:[],finale:0,bonusRound:0,interludeStarted:false,interludeCompleted:false,interludeStats:{collectibles:[],undetected:false},interludeRun:null,bonusSettings:{motif:'control-post',mode:'swap',size:3},bonusCompleted:[]});
 function migrate(raw){
  const s=fresh();
  if(!raw||![1,2,3].includes(raw.version))return s;
  for(let i=0;i<5;i++){
   const a=raw.answers?.[i];
   if(a&&typeof a==='object'&&!Array.isArray(a)){
    for(const [k,v] of Object.entries(a)){
     if(['__proto__','constructor','prototype','sentence'].includes(k))continue;
     if(/^(stage|read|overall|att\d|reason\d|correct\d|category\d|place\d|transfer\d|obs|link|conclusion)$/.test(k)&&
        ((k==='read'&&typeof v==='boolean')||Number.isInteger(v)))s.answers[i][k]=v;
     if((k==='marked'||/^chain\d$/.test(k))&&Array.isArray(v))s.answers[i][k]=[...new Set(v.filter(n=>Number.isInteger(n)&&n>=0&&n<(k.startsWith('chain')?4:i===1?6:5)))];
     if(k==='pairs'&&v&&typeof v==='object')s.answers[i].pairs=Object.fromEntries(Object.entries(v).filter(([x,y])=>/^[0-4]$/.test(x)&&Number.isInteger(y)&&y>=0&&y<5));
    }
   }
   s.solved[i]=raw.solved?.[i]===true;
   const stage=s.answers[i].stage;
   s.answers[i].stage=Number.isInteger(stage)?Math.max(0,Math.min(stage,totals[i]-1)):0;
   // Old map steps changed: keep the acquired seal; restart an unfinished route.
   if(raw.version===1&&i===3&&!s.solved[i])s.answers[i]={stage:0};
   if(s.solved[i])s.answers[i].stage=totals[i];
   s.attempts[i]=Number.isInteger(raw.attempts?.[i])?Math.max(0,Math.min(raw.attempts[i],99)):0;
  }
  s.discoveries=Array.isArray(raw.discoveries)?[...new Set(raw.discoveries.filter(n=>Number.isInteger(n)&&n>=0&&n<5))]:[];
  s.solved.forEach((v,i)=>{if(v&&!s.discoveries.includes(i))s.discoveries.push(i);});
  s.finale=s.solved.every(Boolean)&&Number.isInteger(raw.finale)?Math.max(0,Math.min(raw.finale,2)):0;
  s.bonusRound=Number.isInteger(raw.bonusRound)?Math.max(0,Math.min(raw.bonusRound,5)):0;
  const ids=['map','provisions','permit'],motifs=['control-post','map-palestine','taxes-market','people-under-rome','road-galilee'];
  const collect=v=>Array.isArray(v)?[...new Set(v.filter(id=>ids.includes(id)))]:[];
  s.interludeCompleted=raw.interludeCompleted===true;s.interludeStarted=s.interludeCompleted||raw.interludeStarted===true;
  s.interludeStats={collectibles:collect(raw.interludeStats?.collectibles),undetected:raw.interludeStats?.undetected===true};
  const run=raw.interludeRun;
  if(s.interludeStarted&&!s.interludeCompleted&&run&&typeof run==='object')s.interludeRun={checkpoint:Number.isInteger(run.checkpoint)?Math.max(0,Math.min(run.checkpoint,3)):0,collected:collect(run.collected),detections:Number.isInteger(run.detections)?Math.max(0,Math.min(run.detections,999)):0,elapsed:Number.isFinite(run.elapsed)?Math.max(0,Math.min(run.elapsed,7200)):0,finished:run.finished===true};
  const bonus=raw.bonusSettings;
  s.bonusSettings={motif:motifs.includes(bonus?.motif)?bonus.motif:'control-post',mode:bonus?.mode==='slide'?'slide':'swap',size:[3,4,5].includes(bonus?.size)?bonus.size:3};
  s.bonusCompleted=Array.isArray(raw.bonusCompleted)?[...new Set(raw.bonusCompleted.filter(key=>typeof key==='string'&&motifs.some(m=>['swap','slide'].some(mode=>[3,4,5].some(n=>key===`${m}:${mode}:${n}`)))))]:[];
  return s;
 }
 function argument(a){
  // Two supported explanations: economic burden or control and hopes of freedom.
  return (a.obs===0&&a.link===0&&a.conclusion===0)||(a.obs===1&&a.link===1&&a.conclusion===1);
 }
 function award(s,i){if(s.solved[i])return false;s.solved[i]=true;return true;}
 return {fresh,migrate,argument,award,totals};
})();
if(typeof module!=='undefined')module.exports=AdventureRules;
