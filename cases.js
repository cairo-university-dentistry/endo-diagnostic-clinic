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
 },
 3:{id:3,code:"CASE 003",label:"Patient 03",target:36,
  history:[["nature","What does the pain feel like?","A dull ache when I bite on the lower left back tooth."],["location","Can you point to the tooth?","The lower left molar."],["trigger","What brings the problem on?","Chewing and tapping make it worse."],["duration","How long does it last?","It aches with pressure, but cold does not provoke it."],["relief","What makes it feel better?","I avoid chewing on that side."]],
  responses:{"Visual":"Doctor: Extensive structural breakdown and discoloration are noted; investigate further.","Percussion":"Patient: Ouch, tapping that tooth is painful.","Palpation":"Patient: Pressing near the root feels tender.","Cold Test":"Patient: I do not feel the cold on that tooth.","EPT":"Patient: I cannot detect the electrical stimulus at the tested setting."},
  diagnosis:{pulp:"necrosis",apical:"symptomatic",requiredTests:["Visual","Cold Test","Percussion"],correctPulp:"Correct: Lack of response to sensibility tests alongside the other findings is consistent with pulp necrosis, but tests require controls and clinical correlation.",incorrectPulp:"Review the history and sensibility findings. Lack of response to sensibility tests alongside the other findings is consistent with pulp necrosis, but tests require controls and clinical correlation.",correctApical:"Correct: Tenderness to percussion and palpation supports symptomatic apical periodontitis in this fictional case; radiographic assessment is still indicated.",incorrectApical:"Review the apical assessment. Tenderness to percussion and palpation supports symptomatic apical periodontitis in this fictional case; radiographic assessment is still indicated."}
 },
 4:{id:4,code:"CASE 004",label:"Patient 04",target:11,
  history:[["nature","What does the pain feel like?","I chipped a front tooth yesterday, but it doesn't really hurt."],["location","Can you point to the tooth?","The upper right front tooth."],["trigger","What brings the problem on?","I noticed the edge broke after an accident."],["duration","How long does it last?","No ongoing pain or sensitivity."],["relief","What makes it feel better?","I have not needed any pain relief."]],
  responses:{"Visual":"Doctor: A small incisal enamel fracture is visible without an obvious carious lesion.","Percussion":"Patient: Tapping does not hurt.","Palpation":"Patient: No tenderness.","Cold Test":"Patient: I feel the cold briefly and it goes away immediately.","EPT":"Patient: I can feel the electrical stimulus."},
  diagnosis:{pulp:"normal",apical:"unknown",requiredTests:["Visual","Cold Test","Percussion"],correctPulp:"Correct: A brief, non-lingering cold response without pulpal symptoms is compatible with a clinically normal pulp in this teaching scenario.",incorrectPulp:"Review the history and sensibility findings. A brief, non-lingering cold response without pulpal symptoms is compatible with a clinically normal pulp in this teaching scenario.",correctApical:"Correct: The limited examination does not confirm a definitive apical diagnosis; further assessment may be necessary.",incorrectApical:"Review the apical assessment. The limited examination does not confirm a definitive apical diagnosis; further assessment may be necessary."}
 },
 5:{id:5,code:"CASE 005",label:"Patient 05",target:46,
  history:[["nature","What does the pain feel like?","A strong toothache that wakes me up at night."],["location","Can you point to the tooth?","The lower right back molar."],["trigger","What brings the problem on?","Hot and cold drinks can set it off, and biting hurts."],["duration","How long does it last?","The pain continues long after the stimulus is gone."],["relief","What makes it feel better?","Painkillers only help for a short while."]],
  responses:{"Visual":"Doctor: A deep carious lesion is present on the molar.","Percussion":"Patient: Yes, tapping that tooth is painful.","Palpation":"Patient: The gum near it is slightly tender.","Cold Test":"Patient: Ah! The pain is intense and keeps going after you remove the cold.","EPT":"Patient: I can detect the stimulus."},
  diagnosis:{pulp:"irreversible",apical:"symptomatic",requiredTests:["Visual","Cold Test","Percussion"],correctPulp:"Correct: Spontaneous night pain and lingering thermal pain support symptomatic irreversible pulpitis.",incorrectPulp:"Review the history and sensibility findings. Spontaneous night pain and lingering thermal pain support symptomatic irreversible pulpitis.",correctApical:"Correct: Pain on percussion is consistent with symptomatic apical periodontitis; full examination and imaging remain important.",incorrectApical:"Review the apical assessment. Pain on percussion is consistent with symptomatic apical periodontitis; full examination and imaging remain important."}
 },
 6:{id:6,code:"CASE 006",label:"Patient 06",target:24,
  history:[["nature","What does the pain feel like?","My upper left tooth is sensitive to sweets."],["location","Can you point to the tooth?","An upper left premolar."],["trigger","What brings the problem on?","Sweet food and cold water trigger it."],["duration","How long does it last?","The feeling stops right away."],["relief","What makes it feel better?","Avoiding the trigger settles it."]],
  responses:{"Visual":"Doctor: A small localized carious lesion is visible.","Percussion":"Patient: No pain on tapping.","Palpation":"Patient: Pressing the gum feels normal.","Cold Test":"Patient: Sharp for a moment, then completely gone.","EPT":"Patient: I can feel the stimulus."},
  diagnosis:{pulp:"reversible",apical:"unknown",requiredTests:["Visual","Cold Test","Percussion"],correctPulp:"Correct: Short-lived, stimulus-dependent pain without spontaneous symptoms supports reversible pulpitis.",incorrectPulp:"Review the history and sensibility findings. Short-lived, stimulus-dependent pain without spontaneous symptoms supports reversible pulpitis.",correctApical:"Correct: Apical findings cannot be confirmed without adequate complete examination and imaging.",incorrectApical:"Review the apical assessment. Apical findings cannot be confirmed without adequate complete examination and imaging."}
 },
 7:{id:7,code:"CASE 007",label:"Patient 07",target:21,
  history:[["nature","What does the pain feel like?","One of my front teeth has turned darker since an old injury."],["location","Can you point to the tooth?","The upper left front tooth."],["trigger","What brings the problem on?","There is no obvious temperature trigger."],["duration","How long does it last?","I have not noticed thermal pain."],["relief","What makes it feel better?","Nothing specific is needed."]],
  responses:{"Visual":"Doctor: Crown discoloration is visible; history of prior trauma is relevant.","Percussion":"Patient: Tapping does not hurt.","Palpation":"Patient: No tenderness when you press.","Cold Test":"Patient: I do not feel the cold on this tooth.","EPT":"Patient: No sensation at the tested setting."},
  diagnosis:{pulp:"necrosis",apical:"unknown",requiredTests:["Visual","Cold Test","Percussion"],correctPulp:"Correct: Discoloration following trauma and absent sensibility responses raise concern for pulp necrosis; false-negative tests after trauma and other causes must be considered.",incorrectPulp:"Review the history and sensibility findings. Discoloration following trauma and absent sensibility responses raise concern for pulp necrosis; false-negative tests after trauma and other causes must be considered.",correctApical:"Correct: The apical condition remains unconfirmed without radiographs and complete evaluation.",incorrectApical:"Review the apical assessment. The apical condition remains unconfirmed without radiographs and complete evaluation."}
 },
 8:{id:8,code:"CASE 008",label:"Patient 08",target:35,
  history:[["nature","What does the pain feel like?","I feel pressure near my lower left teeth, but not with cold."],["location","Can you point to the tooth?","The lower left premolar area."],["trigger","What brings the problem on?","I mostly notice it after clenching my teeth."],["duration","How long does it last?","It fades after I relax my jaw."],["relief","What makes it feel better?","Resting my jaw helps."]],
  responses:{"Visual":"Doctor: No obvious carious lesion or structural defect is visible.","Percussion":"Patient: No significant tooth-specific pain on tapping.","Palpation":"Patient: No focal gum tenderness.","Cold Test":"Patient: It feels cold for a moment and stops promptly.","EPT":"Patient: Yes, I feel the stimulus."},
  diagnosis:{pulp:"normal",apical:"unknown",requiredTests:["Visual","Cold Test","Percussion"],correctPulp:"Correct: Normal sensibility responses and absent pulpal symptoms favor a clinically normal pulp; investigate non-pulpal causes of discomfort.",incorrectPulp:"Review the history and sensibility findings. Normal sensibility responses and absent pulpal symptoms favor a clinically normal pulp; investigate non-pulpal causes of discomfort.",correctApical:"Correct: Insufficient evidence is available to establish a specific apical diagnosis.",incorrectApical:"Review the apical assessment. Insufficient evidence is available to establish a specific apical diagnosis."}
 },
 9:{id:9,code:"CASE 009",label:"Patient 09",target:47,
  history:[["nature","What does the pain feel like?","My lower right tooth hurts on its own sometimes."],["location","Can you point to the tooth?","A lower right molar."],["trigger","What brings the problem on?","Cold drinks make it worse."],["duration","How long does it last?","It continues for a long time after cold."],["relief","What makes it feel better?","It gradually settles, but comes back."]],
  responses:{"Visual":"Doctor: A deep carious lesion is visible on the molar.","Percussion":"Patient: Tapping is not especially painful.","Palpation":"Patient: No tenderness here.","Cold Test":"Patient: That hurts, and it keeps hurting after the cold is removed.","EPT":"Patient: I feel the stimulus."},
  diagnosis:{pulp:"irreversible",apical:"unknown",requiredTests:["Visual","Cold Test","Percussion"],correctPulp:"Correct: Spontaneous episodes and lingering cold pain support symptomatic irreversible pulpitis.",incorrectPulp:"Review the history and sensibility findings. Spontaneous episodes and lingering cold pain support symptomatic irreversible pulpitis.",correctApical:"Correct: A definitive apical diagnosis cannot be made from the limited available information.",incorrectApical:"Review the apical assessment. A definitive apical diagnosis cannot be made from the limited available information."}
 },
 10:{id:10,code:"CASE 010",label:"Patient 10",target:14,
  history:[["nature","What does the pain feel like?","I get a quick zing in an upper right tooth."],["location","Can you point to the tooth?","The upper right premolar."],["trigger","What brings the problem on?","Cold water and sweet food cause it."],["duration","How long does it last?","It lasts only a second or two."],["relief","What makes it feel better?","It disappears as soon as I stop eating or drinking."]],
  responses:{"Visual":"Doctor: A localized enamel-dentin defect is visible; assess clinically.","Percussion":"Patient: No pain when tapped.","Palpation":"Patient: No tenderness on pressure.","Cold Test":"Patient: Cold for a second, then it's gone.","EPT":"Patient: I can feel the electrical stimulus."},
  diagnosis:{pulp:"reversible",apical:"unknown",requiredTests:["Visual","Cold Test","Percussion"],correctPulp:"Correct: Brief provoked sensitivity without lingering or spontaneous pain favors reversible pulpitis.",incorrectPulp:"Review the history and sensibility findings. Brief provoked sensitivity without lingering or spontaneous pain favors reversible pulpitis.",correctApical:"Correct: Apical status requires further complete examination and, when indicated, radiographs.",incorrectApical:"Review the apical assessment. Apical status requires further complete examination and, when indicated, radiographs."}
 }
};
const releasedCaseIds=[1,2,3,4,5,6,7,8,9,10];
function getCase(id=1){return cases[id]||null}
function completionKey(id){return "endoCompletedPatient"+String(id).padStart(2,"0")}
function feedbackKey(id){return "endoPatient"+String(id).padStart(2,"0")+"Feedback"}

window.ENDO_CASES={getCase,releasedCaseIds,completionKey,feedbackKey};
