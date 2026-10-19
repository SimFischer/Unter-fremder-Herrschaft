const {webkit}=require('playwright'),assert=require('node:assert/strict'),R=require('../logic.js');
(async()=>{
 const server=await require('./server.cjs')(),browser=await webkit.launch({headless:true});
 try{
 const context=await browser.newContext({hasTouch:true,isMobile:true}),page=await context.newPage();
 // These suites test the arrow pad, which computers still use; touch screens show an on-field joystick instead.
 await context.addInitScript(()=>{document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent='.run-dpad{display:grid!important}.run-control-help>div{display:flex!important}.run-touch{display:none!important}';document.head.append(s);});});
 const snapshot=()=>page.evaluate(()=>{const r=Interlude.getRun();return {x:r.player.x,y:r.player.y,t:r.elapsed,hiding:r.player.hiding};});
 for(const [width,height]of [[1024,768],[1180,820],[1194,834],[1366,1024]]){
  await page.setViewportSize({width,height});await page.goto(server.url);
  const s=R.fresh();s.solved=[true,true,true,false,false];s.interludeStarted=true;
  await page.evaluate(s=>localStorage.setItem('palaestina-adventure-klasse6-v2',JSON.stringify(s)),s);await page.reload();
  await page.locator('#interlude-replay').tap();await page.locator('#run-begin').tap();
  await page.keyboard.down('ArrowUp');await page.waitForTimeout(60);const start=await snapshot();await page.waitForTimeout(180);const end=await snapshot();await page.keyboard.up('ArrowUp');
  assert.ok(Math.abs((start.y-end.y)/(end.t-start.t)-72)<.01,`keyboard speed ${width}`);
  const stopped=await snapshot();await page.waitForTimeout(80);assert.equal((await snapshot()).y,stopped.y);
  await page.locator('#run-hide').tap();assert.equal(await page.locator('#run-hide').getAttribute('aria-pressed'),'true');
  const pad=page.locator('[data-direction="up"]');await pad.dispatchEvent('pointerdown',{pointerType:'touch',pointerId:1});await page.waitForTimeout(60);
  const crouchStart=await snapshot();await page.waitForTimeout(180);const crouchEnd=await snapshot();await pad.dispatchEvent('pointerup',{pointerType:'touch',pointerId:1});
  assert.ok(crouchEnd.hiding);assert.ok(Math.abs((crouchStart.y-crouchEnd.y)/(crouchEnd.t-crouchStart.t)-46.8)<.01,`touch crouch speed ${width}`);
  const touchStop=await snapshot();await page.waitForTimeout(80);assert.equal((await snapshot()).y,touchStop.y);
  await page.locator('#run-hide').tap();await pad.dispatchEvent('pointerdown',{pointerType:'touch',pointerId:2});await page.waitForTimeout(60);const touchStart=await snapshot();await page.waitForTimeout(180);const touchEnd=await snapshot();await pad.dispatchEvent('pointercancel',{pointerType:'touch',pointerId:2});
  assert.ok(Math.abs((touchStart.y-touchEnd.y)/(touchEnd.t-touchStart.t)-72)<.01);const cancelled=await snapshot();await page.waitForTimeout(80);assert.equal((await snapshot()).y,cancelled.y);
  await page.locator('#run-close').tap();
 }
 console.log('PASS: keyboard and touch 72 px/s, crouch 46.8 px/s, immediate release/cancel stop at all four requested iPad sizes.');
 }finally{await browser.close();await server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
