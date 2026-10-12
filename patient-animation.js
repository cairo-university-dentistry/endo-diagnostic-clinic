/* Rig-space patient posing. Correctly maps T-pose arm bones into a downward
   world-space rest pose even when the imported GLTF uses unusual bone axes. */
export function createPatientAnimator(model){
 const bones={};model.traverse(o=>{if(!o.isBone)return;const n=o.name.toLowerCase();for(const k of ["hips","spine1","spine2","neck","head","leftarm","rightarm","leftforearm","rightforearm","leftupleg","rightupleg","leftleg","rightleg"]){if(n.includes("mixamorig_"+k+"_")&&!bones[k])bones[k]=o}});
 const T=model.constructor; // Vector3 / Quaternion from the Three.js module via object constructors below.
 const base={};for(const [k,b] of Object.entries(bones))base[k]=b.quaternion.clone();
 const armRest={};
 for(const k of ["leftarm","rightarm"]){
  const b=bones[k];if(!b)continue;
  b.parent.updateWorldMatrix(true,false);
  const child=b.children.find(o=>o.isBone&&o.position.lengthSq()>1e-8);
  if(!child)continue;
  const source=child.position.clone().normalize().applyQuaternion(base[k]).normalize();
  const parentWorld=b.parent.getWorldQuaternion(b.quaternion.clone());
  const desired=child.position.clone().set(0,-1,0).applyQuaternion(parentWorld.invert()).normalize();
  const delta=b.quaternion.clone().setFromUnitVectors(source,desired);
  armRest[k]=delta.multiply(base[k].clone());
 }
 let phase=0;
 function pose({walking=false,seated=false,pain=false,severe=false,talking=false,dt=.016}={}){
  phase+=Math.min(.06,dt)*(walking?8:talking?2.2:1);
  const stride=walking?Math.sin(phase):0;
  const movement={
   leftarm:[walking?stride*.22:severe?-.24:pain?-.09:0,0,severe?-.13:0],rightarm:[walking?-stride*.22:severe?-.24:pain?-.09:0,0,severe?.13:0],
   leftforearm:[-.14,0,0],rightforearm:[-.14,0,0],
   leftupleg:[seated?-1.1:stride*.44,0,0],rightupleg:[seated?-1.1:-stride*.44,0,0],
   leftleg:[seated?1.05:Math.max(0,-stride)*.4,0,0],rightleg:[seated?1.05:Math.max(0,stride)*.4,0,0],
   spine1:[severe?-.16:seated?-.12:0,0,severe?Math.sin(phase*2)*.035:0],spine2:[severe?-.22:pain?-.09:seated?-.07:0,0,0],
   neck:[severe?-.14:pain?-.05:0,0,0],head:[severe?-.2:pain?-.065:talking?Math.sin(phase*2)*.035:0,Math.sin(phase*.35)*.025,severe?.12:pain?.035:0]
  };
  for(const [k,b] of Object.entries(bones)){
   const target=(armRest[k]||base[k]).clone();
   const [x,y,z]=movement[k]||[0,0,0];
   const q=b.quaternion.clone().setFromEuler(b.rotation.clone().set(x,y,z,"XYZ"));
   target.multiply(q);
   b.quaternion.slerp(target,.19);
  }
 }
 return {pose,bones};
}
