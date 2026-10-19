'use strict';
const {webkit}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const R=require('../logic.js'),M=require('../map-rules.js');
(async()=>{
 const server=await require('./server.cjs')(),browser=await webkit.launch({headless:true});
 try{
 const context=await browser.newContext({viewport:{width:1024,height:768},hasTouch:true,isMobile:true,deviceScaleFactor:1}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const out=process.env.ADVENTURE_SCREENSHOTS;
 const shot=async name=>{if(out){fs.mkdirSync(out,{recursive:true});await page.screenshot({path:path.join(out,name+'.png')});}};
 const fixture=async s=>{await page.goto(server.url);await page.evaluate(s=>localStorage.setItem('palaestina-adventure-klasse6-v2',JSON.stringify(s)),s);await page.reload();await page.waitForLoadState('networkidle');};
 const tap=s=>page.locator(s).tap();
 const full=R.fresh();full.solved.fill(true);full.gatePassed=true;full.interludeCompleted=true;full.interludeStarted=true;
 await fixture(full);
 for(const [w,h]of [[1024,768],[1180,820],[1194,834],[1366,1024]]){
  await page.setViewportSize({width:w,height:h});
  for(let n=0;n<=5;n++){
   await page.evaluate(n=>{const s=Adventure.getState();s.solved=s.solved.map((_,i)=>i<n);s.gatePassed=n===5;Adventure.save();},n);await page.reload();await page.waitForLoadState('networkidle');
   // Scene v2: stations are painted into the stage image; no separate cut-outs may be layered on top.
   assert.equal(await page.locator('.world-objects img').count(),0);assert.match(await page.locator('#backdrop').getAttribute('src'),/control-post-v2-stage-/);
   for(let i=0;i<5;i++){await tap(`[data-open="${i}"]`);assert.ok(await page.locator('#puzzle').isVisible());await tap('#close');}
   if(n===0||n===5)await shot(`${w}-scene-${n}`);
  }
  await tap('[data-open="3"]');
  for(let r=0;r<8;r++){
   await tap(`[data-round="${r}"]`);
   const t=M.tasks[r];if(!M.isChoice(r)&&t.answer.length>1)await tap('[data-map-reset]');assert.equal(await page.locator('[data-place]').count(),M.isChoice(r)?t.show.length:t.candidates.length);
   const problems=await page.locator('.map').evaluate(el=>{
    const bs=[...el.querySelectorAll('button')],bad=[];
    const rects=bs.map(b=>({name:b.textContent.trim(),r:b.getBoundingClientRect()}));
    for(const {name,r}of rects)if(r.width<44||r.height<44)bad.push('small '+name);
    for(let i=0;i<rects.length;i++)for(let j=i+1;j<rects.length;j++){const a=rects[i],b=rects[j];if(Math.min(a.r.right,b.r.right)>Math.max(a.r.left,b.r.left)+1&&Math.min(a.r.bottom,b.r.bottom)>Math.max(a.r.top,b.r.top)+1)bad.push('overlap '+a.name+' / '+b.name);}
    return bad;
   });assert.deepEqual(problems,[],`${w} clue ${r+1}`);
   for(let hint=0;hint<3;hint++){await tap('[data-map-hint]');assert.match(await page.locator('#map-hint').textContent(),new RegExp(t.hints[hint].slice(0,12).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));}
   if(M.isChoice(r)){await tap(`[data-key="mapChoice${r}"][data-value="${(t.answer+1)%t.options.length}"]`);await tap('#check');assert.equal(await page.locator('#feedback').getAttribute('class'),'needs-help');await tap(`[data-key="mapChoice${r}"][data-value="${t.answer}"]`);}
   else{const wrong=t.candidates.find(n=>!t.answer.includes(n))??t.answer.at(-1);await tap(`[data-place="${wrong}"]`);await tap('#check');assert.equal(await page.locator('#feedback').getAttribute('class'),'needs-help');
   if(t.answer.length>1)await tap('[data-map-reset]');
   for(const n of t.answer)await tap(`[data-place="${n}"]`);}
   if(r===7){await tap('#close');await page.reload();await tap('[data-open="3"]');await tap('[data-round="7"]');assert.equal(await page.locator('[data-place][aria-pressed="true"]').count(),t.answer.length);}
   await tap('#check');assert.equal(await page.locator('#feedback').getAttribute('class'),'success');
   if([3,4,5,6,7].includes(r)){await page.locator('.map').scrollIntoViewIfNeeded();await shot(`${w}-map-${r+1}`);}
  }
  await tap('#close');await tap('#bonus-games-open');await tap('#bonus-open');await page.locator('#bonus-begin').waitFor();
  // Native inner rectangles, measured on the 1659×948 asset, not inferred from rendered controls.
  const fields=[['[data-mode="swap"]',[178,692,548,779]],['[data-mode="slide"]',[578,692,959,779]],['[data-size="3"]',[1023,692,1158,779]],['[data-size="4"]',[1187,692,1322,779]],['[data-size="5"]',[1355,692,1487,779]]];
  for(const [selector,rect]of fields){const bounds=await page.locator(selector).evaluate((e,rect)=>{const panel=e.closest('.bonus-selection').getBoundingClientRect(),r=e.getBoundingClientRect();const x=(r.left-panel.left)*1659/panel.width,y=(r.top-panel.top)*948/panel.height;return {x,y,right:x+r.width*1659/panel.width,bottom:y+r.height*948/panel.height,w:r.width,h:r.height};},rect);assert.ok(bounds.w>=44&&bounds.h>=44);assert.ok(bounds.x>=rect[0]-1&&bounds.y>=rect[1]-1&&bounds.right<=rect[2]+1&&bounds.bottom<=rect[3]+1,`${w} ${selector} ${JSON.stringify(bounds)}`);await tap(selector);assert.equal(await page.locator(selector).getAttribute('aria-pressed'),'true');}
  for(const motif of ['control-post','map-palestine','taxes-market','people-under-rome','road-galilee']){await tap(`[data-motif="${motif}"]`);assert.equal(await page.locator(`[data-motif="${motif}"]`).getAttribute('aria-pressed'),'true');}
  await shot(`${w}-selection`);await tap('#bonus-begin');assert.equal(await page.locator('[data-tile]').count(),24);await tap('#bonus-close');
 }
 assert.deepEqual(errors,[]);console.log('PASS: all 6 scene stages / 5 hotspots, all 8 map clues / hints / distractors / reload, native panel recess bounds and touch at all 4 requested iPad sizes; no JS errors.');
 }finally{await browser.close();await server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
