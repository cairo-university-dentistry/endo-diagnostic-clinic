
const KEY='endoClinicSaveV1';
const defaultState={screen:'landing', patient:1, scene:'arrival', historyAsked:[], findings:[], goldReturn:null, completed:false};
let state={...defaultState,...JSON.parse(localStorage.getItem(KEY)||'{}')};
const app=document.querySelector('#app');
const save=()=>localStorage.setItem(KEY,JSON.stringify(state));
const set=(patch)=>{state={...state,...patch};save();render()};
const toast=(msg)=>{const t=document.createElement('div');t.className='toast';t.textContent=msg;document.body.append(t);setTimeout(()=>t.remove(),1800)};

function topbar(back=false){
 return `<div class="topbar"><div><div class="logo">ENDO // DIAGNOSTIC CLINIC</div><div class="tiny muted">${state.screen==='gold'?'KNOWLEDGE LAYER':'PATIENT 01 // FIRST DAY'}</div></div>
 <div class="top-actions">${back?`<button class="btn tiny" data-action="return">← Return to Patient</button>`:''}<button class="btn tiny" data-action="home">Home</button></div></div>`;
}
function landing(){
 return `<main class="screen landing noise"><section class="hero">
 <div class="kicker">Interactive Endodontic Diagnosis</div>
 <h1>DIAGNOSIS<br><span>IS A PROCESS.</span></h1>
 <p class="hero-copy">Enter a clinical world where every question, examination and diagnostic aid becomes part of the reasoning process.</p>
 <div class="mode-grid">
  <button class="mode game" data-action="game"><span class="kicker">Game Mode</span><span class="arrow">↗</span><h3>Play the Clinic</h3><p>Learn diagnosis by meeting patients, examining evidence and making clinical decisions.</p></button>
  <button class="mode" data-action="gold-home"><span class="kicker">Gold+</span><span class="arrow">✦</span><h3>Explore Diagnosis</h3><p>Step inside the science behind history, examination, imaging and diagnostic testing.</p></button>
 </div></section></main>`;
}
function clinic(){
 return `<main class="screen clinic noise">${topbar()}
 <div class="clinic-world"><div class="floor"></div>
  <div class="room reception"><span class="label3d">RECEPTION</span><div class="desk"></div></div>
  <div class="room locked"><span class="label3d">RADIOLOGY // LOCKED</span></div>
  <div class="room operatory"><span class="label3d">OPERATORY 01</span><div class="chair"></div></div>
  <div class="patient-dot pulse" title="Patient"></div><div class="doctor-dot" title="Doctor"></div>
 </div>
 <div class="objective"><div class="kicker">Objective</div><div style="margin-top:6px">Your first patient has arrived.</div><button class="btn primary" style="margin-top:12px" data-action="talk">TALK TO PATIENT</button></div>
 <button class="academic" data-action="academic" title="Academic Mode">📖</button>
 </main>`;
}
const questions=[
 ['nature','What does the pain feel like?','It comes and goes. It feels sharp when it starts.'],
 ['location','Can you point to where it hurts?','It feels like it is around this side, but I am not completely sure.'],
 ['trigger','Does anything trigger the pain?','Cold drinks seem to bring it on.'],
 ['duration','When cold causes pain, does it stop quickly or last longer?','It usually settles after the cold is gone.'],
 ['relief','Does anything relieve the pain?','I usually wait for it to settle.']
];
function dialogue(){
 const asked=state.historyAsked||[];
 return `<main class="screen dialogue-wrap noise">${topbar()}
 <div class="patient-portrait"><div class="face"><div class="mouthline"></div></div></div>
 <section class="dialogue"><div class="speaker">PATIENT 01</div><div class="line">${state.lastReply||"Hi, doctor. I've been having pain in one of my teeth."}</div>
 <div class="choices">${questions.map(q=>`<button class="choice ${asked.includes(q[0])?'done':''}" data-question="${q[0]}">${asked.includes(q[0])?'✓ ':''}${q[1]}</button>`).join('')}
 <button class="choice end" data-action="examine">I'm ready to examine.</button></div></section>
 <button class="academic" data-action="academic-history" title="Academic Mode">📖</button></main>`;
}
function clinical(){
 const f=state.findings||[];
 return `<main class="screen clinical-wrap noise">${topbar()}
 <div class="mouth"><div class="teeth">${Array.from({length:12},(_,i)=>`<button class="tooth ${i===7?'target':''}" data-tooth="${i}"></button>`).join('')}</div></div>
 <aside class="clinical-note"><div class="kicker">Clinical Notes</div>${f.length?f.map(x=>`<div class="finding">${x}</div>`).join(''):`<div class="finding muted">No findings recorded yet.</div>`}</aside>
 <div class="tray">
  <button class="btn tool" data-tool="visual">Visual</button>
  <button class="btn tool" data-tool="percussion">Percussion</button>
  <button class="btn tool" data-tool="palpation">Palpation</button>
  <button class="btn primary tool" data-action="interpret">Interpret</button>
 </div><button class="academic" data-action="academic-exam">📖</button></main>`;
}
function debrief(){
 return `<main class="screen gold-screen noise">${topbar()}
 <div style="max-width:850px;margin:8vh auto"><div class="kicker">Patient 01 // Debrief</div>
 <h1 class="gold-title">YOUR<br>DIAGNOSTIC PATH</h1>
 <div class="gold-pills"><span class="pill">History explored: ${(state.historyAsked||[]).length}/${questions.length}</span><span class="pill">Findings recorded: ${(state.findings||[]).length}</span><span class="pill">Academic Mode: available anytime</span></div>
 <p class="gold-copy">Diagnosis is built from the patient information, clinical examination, diagnostic aids and special tests when needed. The purpose of this first case is to learn the diagnostic flow—not to chase a score.</p>
 <div style="margin-top:28px;display:flex;gap:10px;flex-wrap:wrap"><button class="btn gold" data-action="gold-from-debrief">✦ Explore the science</button><button class="btn primary" data-action="replay">Replay Patient 01</button></div>
 </div></main>`;
}
function gold(topic='history'){
 const fromGame=!!state.goldReturn;
 const exam=topic==='exam';
 return `<main class="screen gold-screen noise">${topbar(fromGame)}
 <section class="gold-layout"><div>
  <div class="gold-num">✦ GOLD+ &nbsp; ${exam?'05 / 10':'04 / 10'}</div>
  <h1 class="gold-title">${exam?'CLINICAL<br>EXAMINATION':'PRESENT<br>ILLNESS'}</h1>
  ${exam?`<p class="gold-copy">Clinical examination moves from general assessment to local examination. In the local examination, the source includes visual examination, percussion, palpation, periodontal evaluation and mobility testing.</p>
  <div class="gold-pills"><span class="pill">Visual</span><span class="pill">Percussion</span><span class="pill">Palpation</span><span class="pill">Periodontal</span><span class="pill">Mobility</span></div>`
  :`<p class="gold-copy">Careful questioning is used to evaluate the patient's problem. Explore the nature and location of pain, whether it is intermittent or continuous, spontaneous, triggered by heat, cold or biting, whether thermal pain lingers, and what relieves it.</p>
  <div class="gold-pills"><span class="pill">Sharp ↔ Dull</span><span class="pill">Localized ↔ Diffuse</span><span class="pill">Intermittent ↔ Continuous</span><span class="pill">Spontaneous</span><span class="pill">Heat / Cold / Biting</span><span class="pill">Lingering</span></div>
  <p class="gold-copy"><b style="color:#eee7da">Endodontic keywords:</b> spontaneous, lingering, throbbing. The source notes that pulpal pain may be diffuse and referred, while periodontal pain is localized.</p>`}
 </div><div class="science-orbit"><div class="orbit"></div><div class="tooth-hero"></div></div></section></main>`;
}
function render(){
 if(state.screen==='landing') app.innerHTML=landing();
 else if(state.screen==='clinic') app.innerHTML=clinic();
 else if(state.screen==='dialogue') app.innerHTML=dialogue();
 else if(state.screen==='clinical') app.innerHTML=clinical();
 else if(state.screen==='debrief') app.innerHTML=debrief();
 else if(state.screen==='gold') app.innerHTML=gold(state.goldTopic||'history');
 bind();
}
function openGold(topic,returnScreen){
 state.goldReturn=returnScreen?{screen:returnScreen,scene:state.scene}:null;
 state.goldTopic=topic; state.screen='gold'; save(); render();
}
function bind(){
 document.querySelectorAll('[data-action]').forEach(el=>el.onclick=()=>{
  const a=el.dataset.action;
  if(a==='game') set({screen:'clinic',scene:'arrival'});
  if(a==='gold-home') openGold('history',null);
  if(a==='home') set({screen:'landing'});
  if(a==='talk') set({screen:'dialogue',scene:'history',lastReply:null});
  if(a==='academic'||a==='academic-history') openGold('history',state.screen);
  if(a==='academic-exam') openGold('exam','clinical');
  if(a==='return'&&state.goldReturn){const s=state.goldReturn.screen;state.goldReturn=null;set({screen:s})}
  if(a==='examine'){
    if((state.historyAsked||[]).length<3 && !state.historyWarning){
      state.historyWarning=true; save(); toast('You may still have unexplored history. Continue when ready.');
    } else set({screen:'clinical',scene:'examination'});
  }
  if(a==='interpret') set({screen:'debrief',scene:'debrief',completed:true});
  if(a==='gold-from-debrief') openGold('history','debrief');
  if(a==='replay'){state={...defaultState,screen:'clinic'};save();render()}
 });
 document.querySelectorAll('[data-question]').forEach(el=>el.onclick=()=>{
   const q=questions.find(x=>x[0]===el.dataset.question);
   const asked=[...new Set([...(state.historyAsked||[]),q[0]])];
   set({historyAsked:asked,lastReply:q[2]});
 });
 document.querySelectorAll('[data-tool]').forEach(el=>el.onclick=()=>{
   const t=el.dataset.tool;
   const messages={
    visual:'Visual examination completed — inspect for caries, attrition/erosion, fracture/crack, discoloration or defective restoration.',
    percussion:'Percussion performed — used to reveal the condition of the periapical region.',
    palpation:'Palpation performed — assess swelling location and whether it is fluctuant or indurated.'
   };
   const findings=[...new Set([...(state.findings||[]),messages[t]])];
   set({findings}); toast('Evidence added to Clinical Notes');
 });
}
render();
