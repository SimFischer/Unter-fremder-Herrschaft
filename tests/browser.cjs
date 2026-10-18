'use strict';
// NODE_PATH=<directory containing Playwright> node tests/browser.cjs
// Starts a temporary local server; ADVENTURE_URL can target an existing one.
const {webkit}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
let url=process.env.ADVENTURE_URL;
const out=process.env.ADVENTURE_SCREENSHOTS;
const key='palaestina-adventure-klasse6-v2';
(async()=>{
 const server=url?null:await require('./server.cjs')();if(!url)url=server.url;
 const browser=await webkit.launch({headless:true});
 const context=await browser.newContext({viewport:{width:1024,height:768},hasTouch:true,isMobile:true,deviceScaleFactor:1});
 const page=await context.newPage(),errors=[],failed=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.url());});
 const save=()=>page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
 const shot=async name=>{if(out){fs.mkdirSync(out,{recursive:true});await page.screenshot({path:path.join(out,name+'.png'),fullPage:true});}};
 const click=selector=>page.locator(selector).click();
 const check=async()=>{await click('#check');assert.ok((await page.locator('#feedback').textContent()).startsWith('Dieser Schritt passt.'),'expected correct step');};
 const next=()=>click('#check');
 const select=(k,v)=>click(`[data-key="${k}"][data-value="${v}"]`);
 const keyFor={right:'ArrowRight',left:'ArrowLeft',down:'ArrowDown',up:'ArrowUp'};
 async function walkToStation(i){
  await page.locator('.walk-canvas').focus();
  for(let leg=0;leg<200;leg++){
   const plan=await page.evaluate(i=>{const W=ReportWalkRules,run=ReportWalk.getRun(),s=W.stations[i],p=[run.player.x,run.player.y];
    if(run.near===i)return null;const k=q=>q.map(v=>v.toFixed(2)).join(),q=[p],prev=new Map([[k(p),null]]);let end=null;
    for(let n=0;n<q.length&&!end;n++){const [x,y]=q[n];if(Math.hypot(x-s.x,y-s.y)<=s.r*.8){end=q[n];break;}for(const d of [[6,0],[-6,0],[0,6],[0,-6]]){const m=[x+d[0],y+d[1]];if(!prev.has(k(m))&&W.free(...m)){prev.set(k(m),q[n]);q.push(m);}}}
    const path=[];for(let c=end;c;c=prev.get(k(c)))path.unshift(c);
    const dir=(a,b)=>b[0]>a[0]?'right':b[0]<a[0]?'left':b[1]>a[1]?'down':'up';let j=1;const first=dir(path[0],path[1]);
    while(j+1<path.length&&dir(path[j],path[j+1])===first&&j<20)j++;return {dir:first,to:path[j]};},i);
   if(!plan)return;
   const axis=plan.dir==='left'||plan.dir==='right'?0:1,positive=plan.dir==='right'||plan.dir==='down';
   await page.keyboard.down(keyFor[plan.dir]);
   // A leg ends at its target, at the station, or when a wall stops the figure (then the next leg is replanned).
   let lastPos=null,still=0;
   for(let t=0;t<400;t++){const r=await page.evaluate(()=>{const r=ReportWalk.getRun();return {x:r.player.x,y:r.player.y,near:r.near};});const c=axis?r.y:r.x;
    if(r.near===i||(positive?c>=plan.to[axis]-1:c<=plan.to[axis]+1))break;
    still=lastPos&&Math.abs(lastPos.x-r.x)+Math.abs(lastPos.y-r.y)<.01?still+1:0;if(still>6)break;lastPos=r;await page.waitForTimeout(40);}
   await page.keyboard.up(keyFor[plan.dir]);
  }
  throw new Error('station not reached: '+i);
 }
 await page.goto(url);await page.waitForLoadState('networkidle');await shot('start');
 assert.equal(await page.locator('#end').isVisible(),false);
 await page.locator('[data-open="0"]').tap();assert.equal(await page.locator('#puzzle').isVisible(),true);await page.keyboard.press('Escape');
 await page.locator('[data-open="1"]').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('#puzzle').isVisible(),true);await page.keyboard.press('Escape');
 assert.equal(await page.locator('#bonus-open').isVisible(),false);
 // Complete every station using the visible controls. Wrong answers never unlock steps.
 for(let station=0;station<5;station++){
  await click(`[data-open="${station}"]`);await shot(`station-${station+1}`);
  assert.equal(await page.locator('textarea').count(),0);
  let before=(await save()).answers[station].stage||0;
  await click('#hint-open');await click('#hint-open');await click('#hint-open');assert.equal((await save()).answers[station].stage||0,before);
  await click('#check');assert.equal((await save()).answers[station].stage||0,before);assert.ok((await page.locator('#feedback').textContent()).length>35);await shot(`station-${station+1}-hint`);
  if(station===0){
   for(let i=0;i<5;i++){await click(`[data-left="${i}"]`);await click(`[data-right="${i}"]`);}await check();await shot('network-connected');await next();
   for(const [r,values] of [[0,[1,0,2]],[1,[1,3,0]],[2,[1,0,2]]]){for(const v of values)await click(`[data-order="chain${r}"][data-value="${v}"]`);await check();if(r<2)await next();}
  }
  if(station===1){
   for(const i of [0,3,5])await click(`[data-mark="${i}"]`);await check();await next();
   for(const [i,v] of [[0,0],[3,1],[5,2]]){await select('correct'+i,v);await check();if(i!==5)await next();}
  }
  if(station===2){
   for(const [i,a,r] of [[0,0,2],[1,1,3],[2,2,0],[3,3,1]]){assert.equal(await page.locator(`[data-key="reason${i}"]`).count(),0);await select('att'+i,a);await select('reason'+i,r);await check();await next();}
   await select('overall',1);await check();
  }
  if(station===3){
   for(const values of [[0],[1],[5],[4],[6,7],[5,2],[4,3,8],[5,2,1,0,7]]){for(const i of values)await click(`[data-place="${i}"]`);await check();await next();}
   await select('transfer0',0);await check();await next();await select('transfer1',2);await check();
  }
  if(station===4){
   // Walk the travel route with real key presses; the route is replanned in the page after every leg.
   await page.locator('.walk-canvas').waitFor();await shot('report-walk');
   for(let i=0;i<4;i++){
    await walkToStation(i);assert.equal(await page.locator('.walk-inspect').isEnabled(),true);
    await click('.walk-inspect');await page.locator('.walk-card-secure').waitFor();if(i===0)await shot('report-walk-card');
    await click('.walk-card-secure');
    assert.deepEqual((await save()).answers[4].found,[0,1,2,3].slice(0,i+1));
   }
   // The fourth observation checks the step automatically.
   await page.waitForFunction(()=>document.querySelector('#feedback').textContent.startsWith('Dieser Schritt passt.'));await next();
   // Board: a wrong layout is rejected, the correct one accepted. Re-placing moves a card.
   for(const i of [0,1,2,3]){await click(`[data-evidence="${i}"]`);await click(`[data-zone="${(i+1)%4}"]`);}
   await click('#check');assert.equal((await save()).answers[4].stage,1);
   for(const i of [0,1,2,3]){await click(`[data-evidence="${i}"]`);await click(`[data-zone="${i}"]`);}
   await shot('report-board');await check();await next();
   await select('obs',0);await select('link',1);await select('conclusion',0);await click('#check');assert.equal((await save()).solved[4],false);
   await select('link',0);await shot('argument-workshop');await check();
  }
  assert.equal(await page.locator('#reward').isVisible(),true);await shot(`reward-${station+1}`);await click('#reward-close');
  if(station===2){await page.locator('#run-begin').waitFor();await click('#run-close');}
  assert.equal((await save()).solved.filter(Boolean).length,station+1);await page.reload();await page.waitForLoadState('networkidle');
  assert.match(await page.locator('#backdrop').getAttribute('src'),new RegExp(`stage-${station+1}.png`));
 }
 await click('[data-open="4"]');await click('#close');assert.equal((await save()).solved.filter(Boolean).length,5);assert.equal(await page.locator('#reward').isVisible(),false);
 await click('[data-open="0"]');await click('#puzzle-book');await click('[data-book="time"]');await page.keyboard.press('Escape');await page.locator('#puzzle').waitFor({state:'visible'});assert.equal(await page.locator('#puzzle').isVisible(),true);await click('#close');
 await click('#notebook-open');await shot('notebook');await page.keyboard.press('Escape');assert.equal(await page.locator('#notebook').isVisible(),false);
 await click('#end');for(let n=0;n<3;n++){await shot('finale-'+n);await click('#finale-next');}assert.equal(await page.locator('#finale').isVisible(),false);
 await click('#bonus-open');await page.locator('#bonus-begin').waitFor();assert.equal(await page.locator('[data-motif]').count(),5);assert.equal((await save()).solved.filter(Boolean).length,5);await click('#bonus-close');
 // Restore a version-1 save through the actual browser load path.
 const old={version:1,solved:[true,true,true,true,true],answers:Array.from({length:5},()=>({stage:6,sentence:'Alt'})),attempts:[0,0,0,0,0]};
 await page.evaluate(([key,old])=>localStorage.setItem(key,JSON.stringify(old)),[key,old]);await page.reload();assert.equal(await page.locator('#end').isVisible(),true);
 const viewports=[[1024,768],[1180,820],[1194,834],[1366,1024],[820,618],[834,1194]];
 const overflow=[];
 async function inspect(label,w,h){
  await page.waitForTimeout(80);
  const problems=await page.evaluate(()=>{
   const all=[...document.querySelectorAll('dialog[open]')],root=all[0]||document.querySelector('main');
   const p=[];if(document.documentElement.scrollWidth>innerWidth+1)p.push('horizontal page overflow');
   for(const e of [root,...root.querySelectorAll('*')]){const r=e.getBoundingClientRect(),s=getComputedStyle(e);if(!r.width||s.display==='none')continue;if(e.scrollWidth>e.clientWidth+2&&['visible','clip'].includes(s.overflowX)&&!e.matches('svg,image,.hotspot'))p.push('content overflow '+e.tagName+'.'+e.className);}
   for(const b of root.querySelectorAll('button')){if(!b.checkVisibility())continue;const r=b.getBoundingClientRect();if(r.width<43.9||r.height<43.9)p.push('small target '+b.textContent.trim().slice(0,30)+' '+r.width+'×'+r.height);}
   return p.slice(0,12);
  });
  if(problems.length)overflow.push({label,w,h,problems});await shot(`${w}x${h}-${label}`);
 }
 for(const [w,h] of viewports){await page.setViewportSize({width:w,height:h});await inspect('scene',w,h);
  for(let i=0;i<5;i++){await click(`[data-open="${i}"]`);await inspect('station'+i,w,h);await page.evaluate(()=>{const e=document.querySelector('.exercise-body'),s=e.closest('.scroll');s.scrollTop+=e.getBoundingClientRect().top-s.getBoundingClientRect().top;});await shot(`${w}x${h}-task${i}`);if(i===4){await page.locator('.walk-canvas').waitFor();await click('[data-round="1"]');await inspect('report-board',w,h);await click('[data-round="2"]');await inspect('arguments',w,h);}await click('#close');}
  await click('#notebook-open');await inspect('notebook',w,h);await page.keyboard.press('Escape');
  await click('#end');await inspect('finale',w,h);await click('#return');await click('#bonus-open');await inspect('bonus',w,h);await click('#bonus-close');
 }
 // Damaged JSON is recoverable; reset clears progress and returns gate to zero.
 await page.evaluate(k=>localStorage.setItem(k,'{broken'),key);await page.reload();assert.equal(await page.locator('#end').isVisible(),false);
 await click('[data-open="0"]');await click('#close');await click('#reset');await click('#confirm-reset');assert.equal((await save()).solved.filter(Boolean).length,0);assert.match(await page.locator('#backdrop').getAttribute('src'),/stage-0/);
 const assets=JSON.parse(fs.readFileSync(path.join(__dirname,'../ASSET-QA.json'),'utf8')).blocks.flatMap(b=>b.files);
 for(const a of assets){const r=await page.request.get(url+'/'+a);assert.equal(r.status(),200,a);}
 console.log(JSON.stringify({stations:'5 complete, wrong choices rejected',saves:'old, current, broken, reset',viewports,overflow,errors,failed},null,2));
 await browser.close();if(server)await server.close();assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);assert.deepEqual(overflow,[]);
})().catch(e=>{console.error(e);process.exit(1);});
