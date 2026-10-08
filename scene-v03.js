/* v0.3 — interactive clinic blockout, no external dependencies */
(function(){
const oldClinic=clinic;
window.clinic=function(){
 shell(`<main class="screen"><div class="eye">DAY 01 · INTERACTIVE CLINIC</div><h1 style="font-size:clamp(2.6rem,6vw,5.2rem)">Your first patient<br>has arrived.</h1><p class="lead">Move through the clinic to meet your patient. Use WASD / arrow keys or the on-screen controls.</p>
 <section class="walk-stage" aria-label="Interactive dental clinic"><div class="walk-world"><div class="walk-room walk-main"></div><div class="walk-room walk-reception"></div><div class="walk-room walk-op"></div><div class="walk-desk"></div><div class="walk-chair"></div><div class="walk-patient" id="walk-patient"></div><div class="walk-player" id="walk-player"></div></div>
 <div class="walk-overlay"><div class="walk-hint">OBJECTIVE // Meet Patient 01</div><div class="walk-controls"><button data-dir="up" aria-label="Move up">↑</button><button data-dir="left" aria-label="Move left">←</button><button data-dir="down" aria-label="Move down">↓</button><button data-dir="right" aria-label="Move right">→</button></div><button class="btn primary walk-action" id="walk-talk" hidden>Talk to Patient →</button><div class="walk-status" id="walk-status">Approach the red marker</div></div></section></main>`);
 setupWalk();
};
function setupWalk(){
 const player=document.querySelector("#walk-player"),talk=document.querySelector("#walk-talk"),status=document.querySelector("#walk-status");
 if(!player)return;
 let x=Number.isFinite(s.walkX)?s.walkX:29,y=Number.isFinite(s.walkY)?s.walkY:72;
 const near=()=>Math.hypot(x-71,y-30)<16;
 function draw(){player.style.left=x+"%";player.style.top=y+"%";const ok=near();talk.hidden=!ok;status.textContent=ok?"Patient in range · INTERACT":"Approach the red marker";document.querySelector("#walk-patient")?.classList.toggle("walk-near",ok);s.walkX=x;s.walkY=y;save()}
 function move(dx,dy){if(s.page!=="clinic")return;x=Math.max(8,Math.min(92,x+dx*3));y=Math.max(9,Math.min(90,y+dy*3));draw()}
 draw();talk.onclick=()=>go("history");
 document.querySelectorAll("[data-dir]").forEach(b=>b.onclick=()=>{const d=b.dataset.dir;move(d==="left"?-1:d==="right"?1:0,d==="up"?-1:d==="down"?1:0)});
}
window.addEventListener("keydown",e=>{
 if(s.page!=="clinic"||e.altKey||e.ctrlKey||e.metaKey)return;
 const m={ArrowUp:[0,-1],w:[0,-1],W:[0,-1],ArrowDown:[0,1],s:[0,1],S:[0,1],ArrowLeft:[-1,0],a:[-1,0],A:[-1,0],ArrowRight:[1,0],d:[1,0],D:[1,0]};
 if(m[e.key]){e.preventDefault();const b=document.querySelectorAll("[data-dir]");const dir=m[e.key];const name=dir[1]<0?"up":dir[1]>0?"down":dir[0]<0?"left":"right";document.querySelector('[data-dir="'+name+'"]')?.click()}
 if((e.key==="Enter"||e.key.toLowerCase()==="e")&&!document.querySelector("#walk-talk")?.hidden){e.preventDefault();go("history")}
});
if(s.page==="clinic")render();
})();