
const K="endoV02";let s=JSON.parse(localStorage.getItem(K)||'null')||{page:"landing",asked:[],find:[],tool:null,ret:"history",from:false};const app=document.querySelector("#app");function save(){localStorage.setItem(K,JSON.stringify(s))}function shell(x,g=false){app.innerHTML=`<div class="app ${g?"gold":""}"><header class="top"><div class="brand" role="button" tabindex="0" onclick="home()" onkeydown="if(event.key==='Enter')home()" title="Go to home">ENDO <i>//</i> DIAGNOSTIC CLINIC</div><div class="header-actions"><button class="acad home-btn" onclick="home()">⌂ Home</button><button class="acad" onclick="${g?`go('${s.from?s.ret:"landing"}')`:"gold(true)"}">${g?(s.from?"🎮 Return to Patient":"← Clinic"):"📖 Academic Mode"}</button></div></header>${x}</div>`}function go(p){s.page=p;if(p!="gold")s.ret=p;save();render()}function landing(){shell(`<main class="cinematic-home">
 <div class="cinema-grain"></div>
 <div class="cinema-ambient"></div>
 <div class="cinema-layout">
  <section class="cinema-copy">
   <div class="cinema-kicker"><span class="cinema-pulse"></span> INTERACTIVE CLINICAL SIMULATION <span class="cinema-kicker-line"></span> CASE 001</div>
   <div class="cinema-overline">ENDO <span>/</span> THE DIAGNOSTIC EXPERIENCE</div>
   <h1 class="cinema-title">Every tooth<br>tells a <em>story.</em></h1>
   <p class="cinema-desc">Step inside the operatory. Meet your patient, investigate the symptoms, examine real dental anatomy, and build a diagnosis from evidence.</p>
   <div class="cinema-actions">
    <button class="cinema-start" onclick="go('patients')"><span class="cinema-start-icon">▶</span><span><strong>Enter the Clinic</strong><small>BEGIN THE EXPERIENCE</small></span><span class="cinema-arrow">↗</span></button>
    <button class="cinema-explore" onclick="gold(false)">Explore the science <span>↗</span></button>
   </div>
   <div class="cinema-footnote"><span>01 / PATIENT HISTORY</span><i></i><span>02 / CLINICAL EXAM</span><i></i><span>03 / DIAGNOSIS</span></div>
  </section>
  <div class="cinema-visual" aria-label="Stylized cinematic dental operatory preview">
   <img src="./endo-aaa-operatory.webp" alt="" hidden onload="this.parentElement.classList.add('aaa-ready')" onerror="this.remove()"><div class="cinema-scene">
    <div class="cinema-back-wall"></div>
    <div class="cinema-side-wall"></div>
    <div class="cinema-floor"></div>
    <div class="cinema-window"><span></span><span></span><span></span></div>
    <div class="cinema-light-panel"></div>
    <div class="cinema-cabinet"></div>
    <div class="cinema-counter"></div>
    <div class="cinema-monitor"><div class="cinema-monitor-screen"><span>ENDO / 01</span><b>◌</b><small>DIAGNOSTIC MODE</small></div></div>
    <div class="cinema-lamp-arm"></div><div class="cinema-lamp-head"></div>
    <div class="cinema-chair-base"></div><div class="cinema-chair-stem"></div><div class="cinema-chair-seat"></div><div class="cinema-chair-back"></div><div class="cinema-chair-head"></div>
    <div class="cinema-instrument"></div>
   </div>
   <div class="cinema-visual-top"><span class="cinema-rec">● LIVE SIMULATION</span><span>OPERATORY / 01</span></div>
   <div class="cinema-visual-bottom"><div><small>YOUR FIRST PATIENT</small><strong>The case begins here.</strong></div></div>
  </div>
 </div>
 <div class="cinema-bottom"><span>DESIGNED FOR CLINICAL THINKING</span><span>EXPLORE · EXAMINE · DECIDE</span><span>SCROLL TO BEGIN <b>↓</b></span></div>
 </main>`)} function clinicArt(){return `<div class="clinicwrap"><div class="clinic"><div class="room lock"><span class="lab">RADIOLOGY · LOCKED</span></div><div class="room rec"><span class="lab">RECEPTION</span></div><div class="room op"><span class="lab">OPERATORY 01</span></div><div class="chair"></div><div class="dot doc"></div><div class="dot pat"></div></div></div>`}function clinic(){shell(`<main class="screen"><div class="eye">DAY 01 · PATIENT 01</div><h1>Your first patient<br>has arrived.</h1><p class="lead">Reception: “Doctor, your first patient has arrived.”</p>${clinicArt()}<button class="btn primary" onclick="go('history')">Talk to Patient →</button></main>`)}const q=[["nature","What does the pain feel like?","It can feel sharp, doctor — especially when something sets it off."],["location","Can you point to where it hurts?","It's hard to point to one exact spot."],["trigger","What brings the pain on?","Cold seems to trigger it."],["duration","How long does it last after cold?","It doesn't disappear immediately. It lingers."],["relief","Does anything relieve the pain?","I usually wait for it to settle down."]];function ask(id){let a=q.find(x=>x[0]==id);if(!s.asked.includes(id))s.asked.push(id);s.ans=a[2];s.expression=id;save();history()}function history(){if(document.querySelector(".patient-history .patient-shot")){const el=document.querySelector(".patient-history .dialogue");if(el)el.textContent="“"+(s.ans||"Hi, doctor.")+"”";document.querySelectorAll(".patient-history .opts .opt").forEach((b,i)=>{if(i<q.length){b.classList.toggle("asked",s.asked.includes(q[i][0]));b.textContent=q[i][1]+(s.asked.includes(q[i][0])?" ✓":"")}});const label=document.querySelector(".patient-history .questions-counter");if(label)label.textContent="YOUR QUESTIONS · "+s.asked.length+"/"+q.length+" EXPLORED";import("./patient-face-3d.js?v=087").then(m=>m.updatePatientFace(document.querySelector(".patient-shot"),({nature:"pain",location:"uncertain",trigger:"concerned",duration:"pain",relief:"tired"})[s.expression]||"neutral"));return}const previousShot=document.querySelector(".patient-history .patient-shot");const expression=({nature:"pain",location:"uncertain",trigger:"concerned",duration:"pain",relief:"tired"})[s.expression]||"neutral";shell(`<main class="screen patient-history"><section class="panel"><div class="eye">PATIENT 01 · FACE TO FACE</div><div class="patient-shot expression-${expression}"><div class="patient-face"><div class="patient-hair"></div><div class="patient-brows"><i></i><i></i></div><div class="patient-eyes"><i></i><i></i></div><div class="patient-nose"></div><div class="patient-mouth"></div></div><div class="patient-shoulders"></div><div class="patient-caption">PATIENT 01 <span>● IN CONVERSATION</span></div></div><div class="patient-speech"><div class="eye">PATIENT SAYS</div><div class="dialogue">“${s.ans||"Hi, doctor. I've been having pain in one of my teeth."}”</div></div><div class="eye questions-counter">YOUR QUESTIONS · ${s.asked.length}/${q.length} EXPLORED</div><div class="opts">${q.map(x=>`<button class="opt ${s.asked.includes(x[0])?"asked":""}" onclick="ask('${x[0]}')">${x[1]}</button>`).join("")}<button class="opt" onclick="ready()">I'm ready to examine →</button></div></section></main>`);const nextShot=document.querySelector(".patient-history .patient-shot");if(previousShot&&nextShot){previousShot.className=nextShot.className+(previousShot.querySelector("canvas")?" patient-three-ready":"");nextShot.replaceWith(previousShot)}import("./patient-face-3d.js?v=087").then(m=>{const shot=document.querySelector(".patient-history .patient-shot");if(!m.updatePatientFace(shot,expression))m.mountPatientFace(shot,expression)}).catch(e=>console.warn("Patient 3D fallback",e))}
function ready(){if(s.asked.length<3&&!s.warn){s.warn=1;save();toast("You may still have unexplored history. Continue?");return}s.patientTransfer=true;save();go("clinic")}function toast(t){let e=document.createElement("div");e.className="toast";e.textContent=t;document.body.append(e);setTimeout(()=>e.remove(),2400)}function tool(t){s.tool=t;if(!s.find.includes(t))s.find.push(t);save();exam();setTimeout(()=>toast(t+" finding recorded."),30)}function exam(){shell(`<main class="screen"><div class="eye">Clinical Examination · Patient 01</div><h1 style="font-size:clamp(2.5rem,6vw,5rem)">Look. Touch. Compare.</h1><div class="exam"><div class="mouth"><div class="teeth">${Array.from({length:12},(_,i)=>`<button class="tooth ${i==7?"caries":""}" onclick="toast('${s.tool?"Finding examined with "+s.tool+".":"Select an examination tool first."}')"></button>`).join("")}</div></div><aside class="tray"><h3>Examination Tray</h3>${["Visual","Percussion","Palpation","Cold Test","EPT"].map(t=>`<button class="tool ${s.tool==t?"active":""}" onclick="tool('${t}')">${t}</button>`).join("")}<div class="notes"><b>Clinical Notes</b><br>${s.find.length?s.find.map(x=>"• "+x+" finding recorded").join("<br>"):"No findings recorded yet."}</div><div class="actions"><button class="btn primary" onclick="interpret()">Interpret Evidence →</button></div></aside></div></main>`)}function interpret(){
 const findings=(s.find||[]).filter(x=>x.includes("FDI 26 ·"));
 const tests=[...new Set(findings.map(x=>x.split(" · ")[0]))];
 const ready=tests.includes("Cold Test")&&tests.includes("Visual");
 shell(`<main class="screen"><section class="panel diagnosis-challenge"><div class="eye">CASE 001 · DIAGNOSTIC REASONING</div><h1 style="font-size:clamp(2.1rem,5vw,4rem)">Diagnosis Challenge</h1><p class="lead">Review your evidence and decide. The answer stays hidden until you submit.</p><div class="eye">YOUR FINDINGS · FDI 26</div><div class="exam-notes" id="diagnosis-evidence"></div><p class="exam-disclaimer">Fictional educational case. Clinical diagnosis requires full history, examination and appropriate additional tests.</p><div class="eye">PULPAL DIAGNOSIS</div><div class="diagnosis-options" id="pulp-options"><label><input type="radio" name="pulp-dx" value="normal"> Normal pulp</label><label><input type="radio" name="pulp-dx" value="reversible"> Reversible pulpitis</label><label><input type="radio" name="pulp-dx" value="irreversible"> Symptomatic irreversible pulpitis</label><label><input type="radio" name="pulp-dx" value="necrosis"> Pulp necrosis</label></div><div class="eye">APICAL ASSESSMENT</div><div class="diagnosis-options" id="apical-options"><label><input type="radio" name="apical-dx" value="normal"> Normal apical tissues (provisional)</label><label><input type="radio" name="apical-dx" value="symptomatic"> Symptomatic apical periodontitis</label><label><input type="radio" name="apical-dx" value="unknown"> Insufficient evidence to confirm apical status</label></div><button class="btn primary" id="diagnosis-submit" onclick="submitDiagnosis()">Submit Diagnosis →</button><div id="diagnosis-feedback" aria-live="polite"></div><div class="actions"><button class="btn" onclick="go('exam')">← Return to Examination</button><button class="btn" onclick="gold(true)">📖 Review the science</button></div></section></main>`);
 const evidence=document.querySelector("#diagnosis-evidence");
 if(evidence)evidence.textContent=findings.length?findings.join("\n\n"):"No tests recorded for FDI 26 yet. Return to Examination and test this tooth.";
 const submit=document.querySelector("#diagnosis-submit");if(submit&&!ready){submit.disabled=true;const note=document.querySelector("#diagnosis-feedback");if(note)note.textContent="To unlock the challenge, perform Visual and Cold Test on FDI 26."}
}
function submitDiagnosis(){
 const pulp=document.querySelector('input[name="pulp-dx"]:checked')?.value;
 const apical=document.querySelector('input[name="apical-dx"]:checked')?.value;
 if(!pulp||!apical){toast("Choose both assessments before submitting.");return}
 const pCorrect=pulp==="irreversible",aCorrect=apical==="unknown";
 const relevant=(s.find||[]).filter(x=>x.includes("FDI 26 ·"));
 const uniqueTests=new Set(relevant.map(x=>x.split(" · ")[0]));
 const score=Math.min(100,(pCorrect?45:0)+(aCorrect?25:0)+Math.min(20,uniqueTests.size*4)+Math.min(10,(s.asked||[]).length*2));
 localStorage.setItem("endoCompletedPatient01","yes");
 const feedback=document.querySelector("#diagnosis-feedback");
 if(feedback)feedback.innerHTML=`<div class="diagnosis-result"><div class="eye">CLINICAL REASONING SCORE</div><h2>${score} / 100</h2><p>45 points: pulpal diagnosis · 25: apical assessment · 20: distinct tests on FDI 26 · 10: history questions.</p><h3>${pCorrect&&aCorrect?"Excellent clinical reasoning!":"Review the evidence"}</h3><p><strong>Pulpal diagnosis:</strong> ${pCorrect?"Correct.":"Review needed."} The fictional case supports symptomatic irreversible pulpitis: deep caries and lingering cold pain indicate an inflamed pulp unlikely to recover. A positive EPT response alone does not establish pulpal health.</p><p><strong>Apical assessment:</strong> ${aCorrect?"Correct.":"Review needed."} Negative percussion and palpation are reassuring, but without radiographic and complete examination data the apical diagnosis cannot be confirmed.</p><p><strong>Teaching note:</strong> This is an illustrative scenario, not a diagnosis of a real patient.</p><div class="exam-session-actions"><button class="btn primary" onclick="restartPatient()">↻ Replay Patient 01 from Start</button><button class="btn" onclick="go('patients')">Choose Patient</button></div></div>`;
 const submit=document.querySelector("#diagnosis-submit");if(submit)submit.disabled=true;
 document.querySelectorAll('input[name="pulp-dx"],input[name="apical-dx"]').forEach(el=>el.disabled=true);
}
function gold(from=true){s.from=from;s.ret=s.page=="gold"?s.ret:s.page;s.page="gold";save();goldPage()}function goldPage(){shell(`<main class="screen"><div class="eye">✦ Gold+ · Knowledge Layer</div><h1>Present illness.<br>Read the pain.</h1><p class="lead">The chief complaint should be recorded in the patient's own words. Present illness is explored by character, location, duration, triggers and relief.</p><div class="toothhero"><div class="gt"></div></div><div class="science"><article><div class="eye">Character</div><h3>How does it feel?</h3><p>Explore whether pain is sharp or dull, intermittent or continuous, momentary or spontaneous.</p></article><article><div class="eye">Provocation</div><h3>What triggers it?</h3><p>Ask about heat, cold and biting, and whether the response lingers after the stimulus.</p></article><article><div class="eye">Localization</div><h3>Where is the source?</h3><p>Pulpal pain may be diffuse or referred, while periodontal pain may be more localized.</p></article><article><div class="eye">Process</div><h3>Evidence, then synthesis.</h3><p>Case history is followed by clinical examination, diagnostic aids and special tests as needed.</p></article></div></main>`,true)}function reset(){localStorage.removeItem(K);s={page:"history",asked:[],find:[],tool:null,ret:"history",from:false};render()}function preexam(){
 shell(`<main class="screen patient-history"><section class="panel"><div class="eye">PATIENT 01 · AT THE DENTAL CHAIR</div><h1>Before the Examination</h1><p class="lead">The patient has reached the dental chair. Speak with them before starting.</p><div class="patient-speech"><div class="eye">PATIENT SAYS</div><div class="dialogue" id="preexam-answer">I'm ready, doctor. What will you do next?</div></div><div class="opts"><button class="opt" onclick="document.querySelector('#preexam-answer').textContent='Yes, doctor. You can examine my teeth.';document.querySelector('#preexam-start').disabled=false">I'd like to examine your teeth now. Is that okay?</button><button class="opt" onclick="document.querySelector('#preexam-answer').textContent='Okay, doctor. Please tell me if something might be uncomfortable.'">I'll check your teeth and may perform some simple tests.</button><button class="btn primary" id="preexam-start" disabled onclick="go('exam')">Begin Clinical Examination →</button></div></section></main>`);
}

function restartPatient(){
 if(!confirm("Restart Patient 01? This clears the current history, examination records and diagnosis progress."))return;
 s={page:"clinic",patientId:1,asked:[],find:[],tool:null,ret:"clinic",from:false,walkX:37,walkY:82};
 save();render();window.scrollTo(0,0);
}
function patientSelector(){
 const completed=localStorage.getItem("endoCompletedPatient01")==="yes";
 const cards=Array.from({length:10},(_,i)=>{
  const n=i+1,available=n===1,finished=available&&completed;
  const status=finished?"✓ COMPLETED":available?"● AVAILABLE":"🔒 LOCKED";
  const sub=finished?"Completed · Replay or continue":available?"Start your first clinical case":"Complete previous stages · Case not yet released";
  return '<button class="stage-card '+(available?'stage-open':'stage-locked')+'" '+(available?'onclick="go(\'clinic\')"':'disabled aria-disabled="true"')+'><span class="stage-number">STAGE '+String(n).padStart(2,"0")+'</span><strong>Patient '+String(n).padStart(2,"0")+'</strong><span class="stage-status">'+status+'</span><small>'+sub+'</small></button>';
 }).join("");
 shell(`<main class="screen stage-selection"><div class="eye">ENDO · CLINICAL JOURNEY</div><h1>Choose Your Stage.</h1><p class="lead">Finish a patient's diagnosis to complete that stage. Future stages unlock in order when their cases are released.</p><div class="stage-grid">${cards}</div><div class="exam-session-actions"><button class="btn" onclick="restartPatient()">↻ Restart Patient 01</button><button class="btn" onclick="go('landing')">← Home</button></div></main>`);
}
function render(){({landing,clinic,history,preexam,exam,patients:patientSelector,gold:goldPage}[s.page]||landing)()}render();

function home(){s.page="landing";s.from=false;save();render()}

/* v1.0 Hybrid Camera: preserve isometric exploration; switch to focused 3D examination after history. */
let examSelected=-1;
function examPick(i,arch){examSelected=i;const result=document.querySelector("#exam-patient-response");if(result)result.textContent="Press Perform Test to examine this tooth.";const label=document.querySelector("#exam-selected");if(label)label.textContent=i==null?"Tap a tooth to begin":"Selected tooth · FDI "+i+" · "+(arch==="upper"?"Upper":"Lower")+" arch";const button=document.querySelector("#exam-record");if(button)button.disabled=i==null||!s.tool}
const examInstructions={"Visual":"Inspect crown and soft tissues.","Percussion":"Gently tap the selected tooth.","Palpation":"Palpate adjacent apical soft tissues.","Cold Test":"Apply cold and observe the response after removal.","EPT":"Assess sensory response using an electric pulp tester."};
/* Fictional teaching case, not an observed real patient or a claim from the lecture. */
const demoCase={id:"CASE 001 · FICTIONAL TRAINING PATIENT",target:26,
 responses:{
 "Visual":"Doctor: I can see a deep carious lesion on this tooth.",
 "Percussion":"Patient: No significant pain when you tap this tooth.",
 "Palpation":"Patient: I do not feel tenderness when you press the gum here.",
 "Cold Test":"Patient: Ah! That hurts — the pain continues after the cold is removed.",
 "EPT":"Patient: I can feel the electrical stimulus. A response is present."
 }};
function demoResponse(fdi,tool){
 if(!Number.isInteger(fdi)||!tool)return null;
 if(fdi===demoCase.target)return demoCase.responses[tool]||null;
 return {"Visual":"Doctor: No obvious carious lesion in this training case.","Percussion":"Patient: No pain when you tap this tooth.","Palpation":"Patient: No tenderness in this area.","Cold Test":"Patient: I feel cold briefly; the sensation stops when you remove it.","EPT":"Patient: I feel the stimulus; a response is present."}[tool]||null;
}
/* v3.6: patient dialogue is illustrative and does not alter clinical findings. */
function patientReaction(fdi,tool){
 const target=fdi===demoCase.target;
 const lines=target?{
 "Visual":{mood:"Concerned",line:"Is that the tooth causing my problem, doctor?"},
 "Percussion":{mood:"Calm",line:"That tapping doesn't really hurt."},
 "Palpation":{mood:"Calm",line:"No, pressing there doesn't hurt."},
 "Cold Test":{mood:"In pain",line:"Ah! That really hurts... I can still feel it after you stopped!"},
 "EPT":{mood:"Alert",line:"Yes, I can feel that sensation."}
 }:{
 "Visual":{mood:"Calm",line:"Is everything looking okay?"},
 "Percussion":{mood:"Comfortable",line:"No pain there, doctor."},
 "Palpation":{mood:"Comfortable",line:"That feels fine."},
 "Cold Test":{mood:"Calm",line:"It's cold, but the feeling goes away quickly."},
 "EPT":{mood:"Alert",line:"Yes, I can feel it."}
 };
 return lines[tool]||{mood:"Calm",line:"I'm ready, doctor."};
}
function updateExamFace(mood){import("./patient-face-3d.js?v=361").then(m=>m.updatePatientFace(document.querySelector("#exam-patient-avatar"),mood==="In pain"?"pain":mood==="Concerned"?"concerned":"neutral"))}
function showPatientReaction(fdi,tool){
 const panel=document.querySelector("#exam-patient-dialogue");if(!panel)return;
 const reaction=patientReaction(fdi,tool);
 panel.classList.remove("patient-reaction-pop","patient-reaction-pain");void panel.offsetWidth;
 panel.classList.add("patient-reaction-pop");if(reaction.mood==="In pain")panel.classList.add("patient-reaction-pain");
 const mood=panel.querySelector(".patient-reaction-mood"),line=panel.querySelector(".patient-reaction-line");
 if(mood)mood.textContent=reaction.mood+" · FDI "+fdi;
 if(line)line.textContent="“"+reaction.line+"”";
 updateExamFace(reaction.mood);
}
function examRunTest(){
 if(examSelected==null||examSelected<0){toast("Select a tooth first.");return}
 if(!s.tool){toast("Select an examination tool first.");return}
 if(window.endoInstrumentModule)window.endoInstrumentModule.performInstrument(s.tool,examSelected);
 const response=demoResponse(examSelected,s.tool);
 if(!response)return;
 showPatientReaction(examSelected,s.tool);
 const result=document.querySelector("#exam-patient-response");
 if(result){result.textContent=response;result.classList.remove("exam-response-animate");void result.offsetWidth;result.classList.add("exam-response-animate");}
 const stage=document.querySelector("#exam-3d-stage");if(stage){stage.dataset.activeTest=s.tool;stage.classList.remove("exam-testing");void stage.offsetWidth;stage.classList.add("exam-testing");setTimeout(()=>stage.classList.remove("exam-testing"),1200)}
 const item=s.tool+" · FDI "+examSelected+" · "+response;
 if(!s.find.includes(item))s.find.push(item);
 save();const notes=document.querySelector("#exam-notes");if(notes)notes.textContent=s.find.join(" · ");
 toast("Test completed. Fictional case response recorded.");
}
function examTool(t){s.tool=t;save();const tip=document.querySelector("#exam-tool-guide");if(tip)tip.textContent=examInstructions[t]||"";document.querySelectorAll(".exam-tool").forEach(b=>b.classList.toggle("active",b.dataset.tool===t));const result=document.querySelector("#exam-patient-response");if(result)result.textContent="Select a tooth and press Perform Test.";const button=document.querySelector("#exam-record");if(button)button.disabled=examSelected==null||examSelected<0}
exam=function(){
 examSelected=-1;
 shell(`<main class="screen exam-hybrid"><div class="eye">PATIENT 01 · CLINICAL EXAMINATION</div><h1 style="font-size:clamp(2rem,5vw,3.5rem)">Examination View</h1><p class="lead">Upper + Lower arches · Select a tooth, drag to rotate, pinch to zoom.</p><div class="exam-workspace"><div class="exam-view"><div class="exam-view-label">DENTAL EXAMINATION · 3D TRAINING MODEL</div><div class="exam-arch-controls"><button class="exam-arch active" data-arch="both">Both</button><button class="exam-arch" data-arch="upper">Upper</button><button class="exam-arch" data-arch="lower">Lower</button></div><div id="exam-3d-stage" class="exam-3d-stage"></div><div id="exam-selected" class="exam-selection">Tap a tooth to begin</div></div><aside class="exam-tray"><div class="eye">EXAMINATION TOOLS</div><div class="exam-tools-grid">${["Visual","Percussion","Palpation","Cold Test","EPT"].map(t=>`<button class="exam-tool ${s.tool===t?"active":""}" data-tool="${t}" onclick="examTool('${t}')">${t}</button>`).join("")}</div><div class="eye">TEST PROCEDURE</div><p class="exam-disclaimer" id="exam-tool-guide">${examInstructions[s.tool]||"Choose a tool to see the procedure."}</p><div class="eye">PATIENT · LIVE REACTION</div><div id="exam-patient-dialogue" class="patient-reaction-card" aria-live="polite"><span class="patient-reaction-avatar-3d" id="exam-patient-avatar"></div><div><span class="patient-reaction-mood">Ready to be examined</span><p class="patient-reaction-line">“I'm ready, doctor. Please tell me what you're doing.”</p></div></div><div class="eye">CLINICAL TEST RESPONSE</div><div id="exam-patient-response" class="exam-notes" aria-live="polite">Select a tooth and press Perform Test.</div><button class="btn primary" id="exam-record" onclick="examRunTest()" disabled>Perform Test</button><p class="exam-disclaimer">CASE 001 is a fictional teaching scenario with predefined responses, not actual patient data. Target tooth: FDI 26. Responses are illustrative and do not establish a diagnosis by themselves.</p><div class="eye">RECORDED ACTIONS</div><div id="exam-notes" class="exam-notes">${s.find.length?s.find.join(" · "):"None yet"}</div><button class="btn" onclick="go('history')">← Patient History</button><button class="btn" onclick="interpret()">Interpret Evidence →</button><div class="exam-restart-footer"><button class="btn exam-restart-btn" onclick="restartPatient()">↻ Restart Patient</button></div></aside></div></main>`);
 import("./exam-anatomy.js?v=340").then(m=>{window.endoInstrumentModule=m;return m.mountExam3D(document.querySelector("#exam-3d-stage"),examPick)}).catch(e=>console.warn("Exam 3D unavailable",e));
};

if(s.page==='exam')exam();
