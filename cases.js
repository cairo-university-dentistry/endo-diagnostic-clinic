/* ENDO v3.8 — data-driven clinical case registry.
   Case 001 is preserved verbatim; additional cases must be clinically reviewed before release. */
const cases={
 1:{
  id:1,code:"CASE 001",label:"Patient 01",target:26,
  history:[
   ["nature","What does the pain feel like?","It can feel sharp, doctor — especially when something sets it off."],
   ["location","Can you point to where it hurts?","It's hard to point to one exact spot."],
   ["trigger","What brings the pain on?","Cold seems to trigger it."],
   ["duration","How long does it last after cold?","It doesn't disappear immediately. It lingers."],
   ["relief","Does anything relieve the pain?","I usually wait for it to settle down."]
  ],
  responses:{
   "Visual":"Doctor: I can see a deep carious lesion on this tooth.",
   "Percussion":"Patient: No significant pain when you tap this tooth.",
   "Palpation":"Patient: I do not feel tenderness when you press the gum here.",
   "Cold Test":"Patient: Ah! That hurts — the pain continues after the cold is removed.",
   "EPT":"Patient: I can feel the electrical stimulus. A response is present."
  },
  diagnosis:{
   pulp:"irreversible",apical:"unknown",requiredTests:["Visual","Cold Test"],
   correctPulp:"Correct: deep caries with pain lingering after cold removal supports symptomatic irreversible pulpitis in this fictional case.",
   incorrectPulp:"Review: lingering cold pain and deep caries support symptomatic irreversible pulpitis. A positive EPT response alone does not indicate a healthy pulp.",
   correctApical:"Appropriate caution: without radiographic and complete examination data, the apical status cannot be confirmed.",
   incorrectApical:"Review: negative percussion and palpation alone do not establish a definitive apical diagnosis. Additional assessment is required."
  }
 },
 2:{
  id:2,code:"CASE 002",label:"Patient 02",target:15,
  history:[
   ["nature","What does the pain feel like?","A quick, sharp sensitivity, mostly with cold drinks."],
   ["location","Can you show me which tooth is sensitive?","It seems to come from the upper right back teeth."],
   ["trigger","What brings the pain on?","Cold drinks or something sweet."],
   ["duration","Does the pain continue after the cold is removed?","No, it stops almost immediately."],
   ["relief","Do you get spontaneous pain or pain at night?","No, it only happens when something triggers it."]
  ],
  responses:{
   "Visual":"Doctor: A localized carious lesion is visible; further clinical assessment is required.",
   "Percussion":"Patient: Tapping does not cause pain.",
   "Palpation":"Patient: There is no tenderness when you press here.",
   "Cold Test":"Patient: That feels sharp and cold, but the sensation stops promptly after removal.",
   "EPT":"Patient: I can feel the stimulus. A response is present."
  },
  diagnosis:{
   pulp:"reversible",apical:"unknown",requiredTests:["Visual","Cold Test"],
   correctPulp:"Correct: brief stimulus-related sensitivity without lingering pain supports reversible pulpitis in this fictional case, alongside the clinical findings.",
   incorrectPulp:"Review: pain provoked by cold that resolves promptly, without spontaneous pain, favors reversible pulpitis rather than symptomatic irreversible pulpitis.",
   correctApical:"Appropriate caution: without adequate imaging and full examination, the apical diagnosis is not confirmed.",
   incorrectApical:"Review: negative percussion and palpation do not replace radiographic assessment and a complete apical evaluation."
  }
 }
};
const releasedCaseIds=[1,2];
function getCase(id=1){return cases[id]||null}
function completionKey(id){return "endoCompletedPatient"+String(id).padStart(2,"0")}
function feedbackKey(id){return "endoPatient"+String(id).padStart(2,"0")+"Feedback"}

window.ENDO_CASES={getCase,releasedCaseIds,completionKey,feedbackKey};
