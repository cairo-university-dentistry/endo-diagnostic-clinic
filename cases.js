/* ENDO v3.8 — data-driven clinical case registry.
   Case 001 is preserved verbatim; additional cases must be clinically reviewed before release. */
export const cases={
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
 }
};
export const releasedCaseIds=[1];
export function getCase(id=1){return cases[id]||null}
export function completionKey(id){return "endoCompletedPatient"+String(id).padStart(2,"0")}
export function feedbackKey(id){return "endoPatient"+String(id).padStart(2,"0")+"Feedback"}
