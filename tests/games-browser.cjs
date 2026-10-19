'use strict';
const{webkit}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const R=require('../logic.js'),B=require('../bonus-puzzle.js');
const out=process.env.ADVENTURE_SCREENSHOTS;
(async()=>{
 const server=await require('./server.cjs')(),browser=await webkit.launch({headless:true});
 const context=await browser.newContext({viewport:{width:1024,height:768},hasTouch:true,isMobile:true,deviceScaleFactor:1});
// These suites test the arrow pad, which computers still use; touch screens show an on-field joystick instead.
 await context.addInitScript(()=>{document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent='.run-dpad{display:grid!important}.run-control-help>div{display:flex!important}.run-touch{display:none!important}';document.head.append(s);});});
 const page=await context.newPage(),errors=[],failed=[],overflow=[],requests=new Map();
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.url());});page.on('request',r=>requests.set(r.url(),(requests.get(r.url())||0)+1));
 const shot=async name=>{if(out){fs.mkdirSync(out,{recursive:true});await page.screenshot({path:path.join(out,name+'.png'),fullPage:true});}};
 const click=s=>page.locator(s).click();
 const fixture=async(s)=>{await page.goto(server.url);await page.evaluate(s=>localStorage.setItem('palaestina-adventure-klasse6-v2',JSON.stringify(s)),s);await page.reload();};
 const getState=()=>page.evaluate(()=>Adventure.getState());
 const p=()=>page.evaluate(()=>({x:Interlude.getRun().player.x,y:Interlude.getRun().player.y}));
 const three=R.fresh();three.solved=[true,false,true,false,true];
 await fixture(three);await page.locator('#run-begin').waitFor();assert.equal((await getState()).interludeStarted,true);assert.equal((await getState()).solved.filter(Boolean).length,3);await shot('interlude-start');
 await page.reload();assert.equal(await page.locator('#interlude').isVisible(),false);await click('#interlude-replay');await click('#run-begin');await shot('interlude-play');
 // Holding and releasing a real pointer, plus the touch pointer cancellation paths.
 let pos=await p();await page.locator('[data-direction="up"]').dispatchEvent('pointerdown',{pointerType:'touch',pointerId:1});await page.waitForTimeout(350);assert.ok((await p()).y<pos.y-4);await page.locator('[data-direction="up"]').dispatchEvent('pointerup',{pointerType:'touch',pointerId:1});pos=await p();await page.waitForTimeout(180);assert.equal((await p()).y,pos.y);
 for(const event of ['pointercancel','pointerleave']){await page.locator('[data-direction="up"]').dispatchEvent('pointerdown',{pointerType:'touch',pointerId:2});await page.waitForTimeout(120);await page.locator('[data-direction="up"]').dispatchEvent(event,{pointerType:'touch',pointerId:2});pos=await p();await page.waitForTimeout(150);assert.equal((await p()).y,pos.y);}
 const target=await page.locator('[data-direction="right"]').boundingBox();await page.mouse.move(target.x+28,target.y+28);await page.mouse.down();await page.waitForTimeout(200);await page.mouse.move(target.x+140,target.y-20);pos=await p();await page.waitForTimeout(160);assert.equal((await p()).x,pos.x);await page.mouse.up();
 await page.keyboard.down('w');pos=await p();await page.waitForTimeout(180);await page.keyboard.up('w');assert.ok((await p()).y<pos.y);pos=await p();await page.waitForTimeout(160);assert.equal((await p()).y,pos.y);
 // Visibility handling pauses both the player and patrol simulation; resume is explicit.
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});assert.equal(await page.evaluate(()=>Interlude.isPaused()),true);assert.equal(await page.locator('#run-canvas').getAttribute('tabindex'),'-1');const beforeHidden=await page.evaluate(()=>Interlude.getRun().elapsed);await page.waitForTimeout(200);assert.equal(await page.evaluate(()=>Interlude.getRun().elapsed),beforeHidden);await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});await click('#run-resume');assert.equal(await page.locator('#run-canvas').getAttribute('tabindex'),'0');
 await click('#run-close');assert.equal((await getState()).interludeCompleted,false);await page.reload();assert.equal(await page.locator('#interlude').isVisible(),false);
 // A real keyboard play-through, observing the middle patrol before crossing. No teleports.
 await click('#interlude-replay');await click('#run-begin');
 async function walk(x,y){for(const [axis,targetValue]of [['x',x],['y',y]]){
  const current=(await p())[axis];if(Math.abs(current-targetValue)<2)continue;const positive=targetValue>current,key=axis==='x'?(positive?'ArrowRight':'ArrowLeft'):(positive?'ArrowDown':'ArrowUp');
  await page.keyboard.down(key);await page.waitForFunction(({axis,targetValue,positive})=>{const r=Interlude.getRun();return r.phase==='result'||(positive?r.player[axis]>=targetValue-1:r.player[axis]<=targetValue+1);},{axis,targetValue,positive},{timeout:40000});await page.keyboard.up(key);
 }}
 for(const [x,y]of [[245,260],[665,260],[665,390],[820,390]])await walk(x,y);
 await page.waitForFunction(()=>{const g=Interlude.getRun().guards[1];return g.x>930&&g.y>460&&g.y<510&&g.angle>0;},null,{timeout:50000});
 for(const [x,y]of [[940,390],[940,530],[1370,530],[1370,195]])await walk(x,y);
 await page.locator('#run-done').waitFor();assert.equal(await page.locator('.run-result-icon').count(),4);assert.equal(await page.evaluate(()=>Interlude.getRun().detections),0);await shot('interlude-result');const travelTime=await page.evaluate(()=>Interlude.getRun().elapsed);await click('#run-done');assert.equal((await getState()).interludeCompleted,true);assert.equal((await getState()).solved.filter(Boolean).length,3);await page.reload();assert.equal(await page.locator('#interlude').isVisible(),false);console.log('PASS interlude: touch/key stops, tab pause, undetected route, result, once-only reload;',Math.round(travelTime),'game seconds');
 // The bonus is available at the completed main game's ending, with all five motifs.
 const complete=await getState();complete.solved=[true,true,true,true,true];complete.gatePassed=true;await fixture(complete);await click('#bonus-games-open');await click('#bonus-open');await page.locator('#bonus-begin').waitFor();assert.equal(await page.locator('[data-motif]').count(),5);await shot('bonus-selection');
 for(const motif of B.motifs)for(const mode of ['swap','slide'])for(const n of [3,4,5]){
  await click(`[data-motif="${motif.id}"]`);await click(`[data-mode="${mode}"]`);await click(`[data-size="${n}"]`);await click('#bonus-begin');
  const before=await page.evaluate(()=>[...BonusPuzzle.getGame().tiles]);assert.equal(before.length,n*n);
  if(mode==='swap'){
   await page.locator('[data-tile="0"]').tap();assert.equal(await page.locator('[data-tile="0"]').getAttribute('aria-pressed'),'true');if(motif.id==='control-post'&&n===3){await click('#bonus-close');await click('#bonus-games-open');await click('#bonus-open');assert.match(await page.locator('#bonus-play-message').textContent(),/Wähle jetzt/);}assert.match(await page.locator('#bonus-play-message').textContent(),/Wähle jetzt/);await page.locator('[data-tile="0"]').tap();assert.equal(await page.locator('[data-tile="0"]').getAttribute('aria-pressed'),'false');await click('[data-tile="0"]');await click(`[data-tile="${n*n-1}"]`);const after=await page.evaluate(()=>BonusPuzzle.getGame().tiles);assert.equal(after[0],before[n*n-1]);
  }else{
   const empty=before.indexOf(n*n-1),far=before.findIndex((_,i)=>i!==empty&&!B.neighbors(empty,n).includes(i));await click(`[data-tile="${far}"]`);assert.deepEqual(await page.evaluate(()=>BonusPuzzle.getGame().tiles),before);const neighbor=B.neighbors(empty,n)[0];await click(`[data-tile="${neighbor}"]`);assert.equal((await page.evaluate(()=>BonusPuzzle.getGame().tiles))[empty],before[neighbor]);
  }
  if(n===5)await shot('bonus-'+motif.id+'-'+mode);await click('#bonus-change');
 }
 console.log('PASS bonus: all 30 combinations render; arbitrary swapping, deselection, and legal sliding');
 // Solve a genuinely mixed swap board using its visible piece indexes.
 await click('[data-motif="road-galilee"]');await click('[data-mode="swap"]');await click('[data-size="3"]');await click('#bonus-begin');
 for(let i=0;i<9;i++){const tiles=await page.evaluate(()=>BonusPuzzle.getGame().tiles);if(tiles[i]===i)continue;const j=tiles.indexOf(i);await click(`[data-tile="${i}"]`);await click(`[data-tile="${j}"]`);}
 await page.locator('#bonus-again').waitFor();await shot('bonus-result');assert.ok((await getState()).bonusCompleted.includes('road-galilee:swap:3'));await click('#bonus-other');
 // Solve the classical 3x3 board with an independent breadth-first shortest-path search.
 await click('[data-mode="slide"]');await click('[data-size="3"]');await click('#bonus-begin');const tiles=await page.evaluate(()=>BonusPuzzle.getGame().tiles),start=tiles.join(''),goal='012345678',queue=[start],seen=new Map([[start,null]]);let found=0;
 for(let at=0;at<queue.length;at++){const cur=queue[at];if(cur===goal){found=at;break;}const empty=cur.indexOf('8');for(const move of B.neighbors(empty,3)){const chars=[...cur];[chars[empty],chars[move]]=[chars[move],chars[empty]];const next=chars.join('');if(!seen.has(next)){seen.set(next,{prev:cur,move});queue.push(next);}}}
 assert.ok(found||start===goal);let cursor=goal,moves=[];while(seen.get(cursor)){const edge=seen.get(cursor);moves.push(edge.move);cursor=edge.prev;}for(const i of moves.reverse())await click(`[data-tile="${i}"]`);
 await page.locator('#bonus-again').waitFor();assert.ok((await getState()).bonusCompleted.includes('road-galilee:slide:3'));await click('#bonus-close');
 const viewports=[[1024,768],[1180,820],[1194,834],[1366,1024],[834,1194],[820,618]];
 async function inspect(name,w,h){
  const problems=await page.evaluate(()=>{
   const root=document.querySelector('dialog[open]'),issues=[];if(document.documentElement.scrollWidth>innerWidth+1)issues.push('horizontal page overflow');if(!root)return issues;
   for(const el of [root,...root.querySelectorAll('*')]){const r=el.getBoundingClientRect(),s=getComputedStyle(el);if(!r.width||s.display==='none')continue;if(el.scrollWidth>el.clientWidth+2&&s.overflowX==='visible'&&!el.matches('canvas,svg,image'))issues.push('content overflow '+el.className);}
   for(const el of root.querySelectorAll('button')){if(!el.checkVisibility())continue;const r=el.getBoundingClientRect(),minimum=el.matches('[data-direction]')?56:44;if(r.width<minimum-.2||r.height<minimum-.2)issues.push('small target '+el.textContent+' '+r.width+'x'+r.height);}
   return issues;
  });if(problems.length)overflow.push({name,w,h,problems});await shot(`${w}x${h}-${name}`);
 }
 for(const[w,h]of viewports){await page.setViewportSize({width:w,height:h});await click('#interlude-replay');await page.locator('#run-begin').waitFor();await inspect('run-start',w,h);await click('#run-begin');await inspect('run-play',w,h);await click('#run-pause');await inspect('run-pause',w,h);await click('#run-close');await click('#bonus-games-open');await click('#bonus-open');if(await page.locator('#bonus-change').isVisible())await click('#bonus-change');await page.locator('#bonus-begin').waitFor();await inspect('bonus-selection',w,h);await click('[data-size="5"]');await click('[data-mode="swap"]');await click('#bonus-begin');await inspect('bonus-swap5',w,h);await click('[data-tile="0"]');await inspect('bonus-selected',w,h);await click('#bonus-change');await click('[data-mode="slide"]');await click('#bonus-begin');await inspect('bonus-slide5',w,h);await click('#bonus-close');}
 await click('#reset');await click('#confirm-reset');const reset=await getState();assert.equal(reset.interludeStarted,false);assert.equal(reset.interludeCompleted,false);assert.equal(reset.interludeRun,null);assert.deepEqual(reset.bonusCompleted,[]);assert.equal(await page.locator('#bonus-open').isVisible(),false);
 const newAssets=fs.readFileSync(path.join(__dirname,'../ASSET-MANIFEST.txt'),'utf8').trim().split(/\r?\n/);for(const asset of newAssets)assert.equal((await page.request.get(server.url+'/'+asset)).status(),200,asset);
 console.log(JSON.stringify({newAssets:newAssets.length,viewports,overflow,errors,failed,coreSealsAfterInterlude:3},null,2));await browser.close();await server.close();assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);assert.deepEqual(overflow,[]);
})().catch(error=>{console.error(error);process.exit(1);});
