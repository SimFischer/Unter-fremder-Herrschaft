'use strict';
// NODE_PATH=<directory containing Playwright> node tests/new-games-browser.cjs
// Start panel v2 overlay areas, „Der Weg des Boten“ and the end-puzzle additions.
const{webkit}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const R=require('../logic.js');
const out=process.env.ADVENTURE_SCREENSHOTS,KEY='palaestina-adventure-klasse6-v2';
(async()=>{
 const server=await require('./server.cjs')(),browser=await webkit.launch({headless:true});
 const context=await browser.newContext({viewport:{width:1024,height:768},hasTouch:true,isMobile:true,deviceScaleFactor:1});
 const page=await context.newPage(),errors=[],failed=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.url());});
 const shot=async name=>{if(out){fs.mkdirSync(out,{recursive:true});await page.screenshot({path:path.join(out,name+'.png')});}};
 const fixture=async s=>{await page.goto(server.url);await page.evaluate(([k,s])=>localStorage.setItem(k,JSON.stringify(s)),[KEY,s]);await page.reload();};
 const getState=()=>page.evaluate(()=>Adventure.getState());
 const box=s=>page.locator(s).boundingBox();
 const inside=(a,b,pad=0)=>a.x>=b.x-pad&&a.y>=b.y-pad&&a.x+a.width<=b.x+b.width+pad&&a.y+a.height<=b.y+b.height+pad;
 const apart=(a,b)=>a.y+a.height<=b.y+.5||b.y+b.height<=a.y+.5||a.x+a.width<=b.x+.5||b.x+b.width<=a.x+.5;

 // 1 · Start panel v2: every HTML layer stays inside its documented free parchment area, nothing overlaps.
 for(const [w,h] of [[1024,768],[1366,1024],[820,618]]){
  await page.setViewportSize({width:w,height:h});
  const three=R.fresh();three.solved=[true,true,true,false,false];await fixture(three);await page.locator('#run-begin').waitFor();
  const panel=await box('.run-start>img');assert.match(await page.locator('.run-start>img').getAttribute('src'),/start-panel-v3\.png$/);
  const area=([x0,y0,x1,y1])=>({x:panel.x+panel.width*x0/1536,y:panel.y+panel.height*y0/1024,width:panel.width*(x1-x0)/1536,height:panel.height*(y1-y0)/1024});
  const parts={'.run-start-title':[216,134,1320,230],'.run-start-copy':[216,276,1320,410],'.run-start-item-1':[184,542,496,700],'.run-start-item-2':[596,542,936,700],'.run-start-item-3':[1040,542,1352,700],'#run-begin':[400,792,1136,910]};
  const boxes={};
  for(const [sel,rect] of Object.entries(parts)){boxes[sel]=await box(sel);assert.ok(inside(boxes[sel],area(rect),1.5),`${sel} at ${w}×${h}`);}
  // Text really fits: no clipped description, no wrapped-out title.
  assert.ok(await page.evaluate(()=>{const c=document.querySelector('.run-start-copy');return c.scrollHeight<=c.clientHeight+1;}),'description fits '+w);
  const keys=Object.keys(boxes);for(let i=0;i<keys.length;i++)for(let j=i+1;j<keys.length;j++)assert.ok(apart(boxes[keys[i]],boxes[keys[j]]),keys[i]+' / '+keys[j]);
  assert.ok((await box('#run-begin')).height>=44);await shot(`start-panel-v2-${w}x${h}`);
  await page.locator('#run-begin').click();await page.locator('#run-canvas').waitFor();await page.locator('#run-close').click();
 }
 await page.setViewportSize({width:1024,height:768});
 // Touch: the on-field joystick moves the figure and stops on release; the arrow pad is hidden.
 {const st=R.fresh();st.solved=[true,true,true,false,false];await fixture(st);await page.locator('#run-begin').click();await page.locator('.run-stick').waitFor();
  assert.equal(await page.locator('.run-dpad').isVisible(),false);const k=await box('.run-stick'),x0=await page.evaluate(()=>Interlude.getRun().player.y);
  await page.mouse.move(k.x+k.width/2,k.y+k.height/2);await page.mouse.down();await page.mouse.move(k.x+k.width/2,k.y+5,{steps:4});await page.waitForTimeout(500);
  assert.ok(await page.evaluate(()=>Interlude.getRun().player.y)<x0-5,'joystick up moves north');await page.mouse.up();
  const y1=await page.evaluate(()=>Interlude.getRun().player.y);await page.waitForTimeout(200);assert.equal(await page.evaluate(()=>Interlude.getRun().player.y),y1);await shot('joystick');await page.locator('#run-close').click();}

 // 2 · Der Weg des Boten: hidden before all seals, then a real play-through with series, record and a mistake.
 const four=R.fresh();four.solved=[true,true,true,true,false];four.interludeStarted=four.interludeCompleted=true;await fixture(four);
 assert.equal(await page.locator('#bonus-games-open').isVisible(),false);
 const all=R.fresh();all.solved=[true,true,true,true,true];all.gatePassed=true;all.interludeStarted=all.interludeCompleted=true;await fixture(all);
 await page.locator('#bonus-games-open').click();await page.locator('#bote-open').click();await page.locator('#bote-start').waitFor();await shot('bote-intro');
 await page.locator('#bote-start').click();await page.locator('.bote-field').first().waitFor();
 // Buttons are disabled while the messenger shows the sequence; an active field is highlighted.
 assert.equal(await page.locator('[data-field="0"]').isDisabled(),true);
 await page.waitForFunction(()=>document.querySelector('.bote-field[data-state="active"]'),null,{timeout:5000});await shot('bote-playback');
 for(let round=1;round<=3;round++){
  await page.waitForFunction(()=>Bote.getModel().s.phase==='input',null,{timeout:20000});
  const seq=await page.evaluate(()=>[...Bote.getModel().s.sequence]);assert.equal(seq.length,round);
  for(const [n,i] of seq.entries()){if(n===0&&round===2)await page.keyboard.press(String(i+1));else await page.locator(`[data-field="${i}"]`).tap();}
  assert.match(await page.locator('.bote-status').textContent(),/Richtig/);
 }
 assert.equal((await getState()).boteBest,3);assert.match(await page.locator('.bote-record-notice').textContent(),/Neue Bestleistung/);
 await page.waitForFunction(()=>Bote.getModel().s.phase==='input',null,{timeout:20000});
 const wrong=await page.evaluate(()=>(Bote.getModel().s.sequence[0]+1)%4);await page.locator(`[data-field="${wrong}"]`).tap();
 assert.equal(await page.locator(`[data-field="${wrong}"]`).getAttribute('data-state'),'error');await shot('bote-wrong');
 // The painted result board follows after a short pause, with the record seal for a new best.
 await page.locator('.bote-result').waitFor();assert.match(await page.locator('.bote-result-score').textContent(),/3 Zeichen/);
 assert.equal(await page.locator('.bote-r-seal').count(),1);assert.match(await page.locator('.bote-r-hint').textContent(),/Neue Bestleistung/);
 const board=await box('.bote-result>img:first-child');for(const sel of ['.bote-r-title','.bote-r-1','.bote-r-2','.bote-r-3','.bote-r-hint','.bote-r-retry','.bote-r-back']){const r=await box(sel);assert.ok(inside(r,board),sel);}
 assert.ok(await page.evaluate(()=>[...document.querySelectorAll('.bote-r-value,.bote-r-hint,.bote-r-title')].every(e=>e.scrollWidth<=e.clientWidth+1&&e.scrollHeight<=e.clientHeight+1)),'result texts fit');
 assert.ok((await box('.bote-r-retry')).height>=44);await shot('bote-ended');
 for(const b of await page.locator('.bote-field').all()){const r=await b.boundingBox();assert.ok(r.width>=100&&r.height>=100,'touch field size');}
 await page.reload();assert.equal((await getState()).boteBest,3);await page.locator('#bonus-games-open').click();await page.locator('#bote-open').click();await page.locator('#bote-start').waitFor();
 assert.match(await page.locator('.bote-best-line').textContent(),/3 Zeichen/);await page.locator('#bote-close').click();
 // The finale offers the messenger game too.
 await page.locator('#end').click();await page.locator('#finale-bote').waitFor();assert.equal(await page.locator('#finale-bote').isVisible(),true);await page.locator('#finale-bote').click();await page.locator('#bote-start').waitFor();await page.locator('#bote-close').click();

 // 3 · End puzzle: „Vorlage zeigen“ toggles the full motif; solved motifs carry a mark independent of the selection.
 const solved=await getState();solved.bonusCompleted=['taxes-market:swap:3'];await fixture(solved);
 await page.locator('#bonus-games-open').click();await page.locator('#bonus-open').click();await page.locator('#bonus-begin').waitFor();
 assert.equal(await page.locator('[data-motif="taxes-market"] .motif-solved').count(),1);assert.equal(await page.locator('[data-motif="control-post"] .motif-solved').count(),0);
 assert.match(await page.locator('[data-motif="taxes-market"]').textContent(),/bereits gelöst/);await shot('puzzle-solved-mark');
 await page.locator('#bonus-begin').click();await page.locator('#bonus-preview').waitFor();
 const before=await page.evaluate(()=>[...BonusPuzzle.getGame().tiles]);
 assert.equal(await page.locator('#puzzle-preview').isVisible(),false);await page.locator('#bonus-preview').click();
 assert.equal(await page.locator('#puzzle-preview').isVisible(),true);assert.equal(await page.locator('#bonus-preview').getAttribute('aria-pressed'),'true');await shot('puzzle-preview');
 await page.locator('#puzzle-preview').click();assert.equal(await page.locator('#puzzle-preview').isVisible(),false);
 assert.deepEqual(await page.evaluate(()=>[...BonusPuzzle.getGame().tiles]),before,'preview never changes tiles');
 await page.locator('#bonus-close').click();

 // 4 · Bonusspiele: one menu entry, unlocked only by walking through the gate.
 const five=R.fresh();five.solved=[true,true,true,true,true];five.interludeStarted=five.interludeCompleted=true;await fixture(five);
 assert.equal(await page.locator('#bonus-games-open').isVisible(),false);await page.locator('#end').click();await page.locator('#finale').waitFor();await page.locator('#return').click();
 assert.equal(await page.locator('#bonus-games-open').isVisible(),true);assert.equal((await getState()).gatePassed,true);
 await page.locator('#bonus-games-open').click();assert.equal(await page.locator('.bonus-game-card').count(),2);await shot('bonus-games');await page.locator('#bonus-games-close').click();

 // 5 · Teacher mode: a 2 s press does nothing, a 5 s press opens it; seals, jumps and solutions work; it ends on reload.
 await fixture(R.fresh());const h=await box('header h1');
 await page.mouse.move(h.x+h.width/2,h.y+h.height/2);await page.mouse.down();await page.waitForTimeout(2000);await page.mouse.up();assert.equal(await page.locator('#teacher').isVisible(),false);
 await page.mouse.down();await page.waitForTimeout(5300);await page.mouse.up();await page.locator('#teacher').waitFor();await shot('teacher');
 await page.locator('[data-seal-open="1"]').click();assert.equal((await getState()).solved[1],true);
 await page.locator('[data-act="solutions"]').check();await page.locator('[data-jump-step="3"]').selectOption('4');await page.locator('[data-jump="3"]').click();
 await page.locator('.teacher-solution').waitFor();assert.match(await page.locator('.teacher-solution').textContent(),/etwa 100 km/);await shot('teacher-solution');
 await page.locator('#close').click();await page.locator('#teacher-badge').click();await page.locator('[data-act="all"]').click();assert.ok((await getState()).solved.every(Boolean));
 await page.locator('#teacher-leave').click();assert.equal(await page.locator('#teacher-badge').isVisible(),false);await page.reload();assert.equal(await page.locator('#teacher-badge').isVisible(),false);

 // 6 · Reiseweg: tapping a station marker walks there and opens the observation by itself.
 const walk=R.fresh();walk.solved=[true,true,true,true,false];walk.interludeStarted=walk.interludeCompleted=true;await fixture(walk);
 await page.locator('[data-open="4"]').click();await page.locator('.walk-canvas').waitFor();await page.waitForTimeout(400);
 const cv=await box('.walk-canvas');const st=await page.evaluate(()=>{const s=ReportWalkRules.stations[0];return [s.mx??s.x,(s.my??s.y)-10];});
 await page.mouse.click(cv.x+st[0]*cv.width/1651,cv.y+st[1]*cv.height/953);
 await page.locator('.walk-card-secure').waitFor({timeout:15000});await page.locator('.walk-card-secure').click();assert.deepEqual((await getState()).answers[4].found,[0]);
 assert.doesNotMatch(await page.locator('.walk-message').textContent(),/Straßensperre: Hier/);
 console.log(JSON.stringify({startPanel:'3 viewports inside documented areas',bote:'hidden until 5 seals, 3 rounds, record kept, mistake ends',puzzle:'preview + solved mark',bonusMenu:'after gate',teacher:'5 s hold, jump, solutions',walk:'tap to walk',errors,failed},null,1));
 await browser.close();await server.close();assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
})().catch(e=>{console.error(e);process.exit(1);});
