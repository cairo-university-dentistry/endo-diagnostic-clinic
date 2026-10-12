/* ENDO patient motion v1: procedural skeletal poses for the licensed Mixamo-rigged GLTF.
   No facial morph targets are present in this asset; reactions use head/neck/torso motion. */
export function createPatientAnimator(model){
 const bones={};model.traverse(o=>{if(o.isBone){const n=o.name.toLowerCase();for(const key of ["hips","spine1","spine2","neck","head","leftarm","rightarm","leftforearm","rightforearm","leftupleg","rightupleg","leftleg","rightleg"]){if(n.includes("mixamorig_"+key+"_")&&!bones[key])bones[key]=o}}});
 const base={};for(const [k,b] of Object.entries(bones))base[k]=b.rotation.clone();
 const smooth=(a,b,t)=>a+(b-a)*Math.min(1,Math.max(0,t));
 let phase=0;
 function pose({walking=false,seated=false,pain=false,talking=false,dt=.016}={}){
  phase+=Math.min(.06,dt)*(walking?8:talking?2.2:1);
  const stride=walking?Math.sin(phase):0;
  const motion={
   leftarm:[walking?stride*.36:.07,0,-1.05],
   rightarm:[walking?-stride*.36:.07,0,1.05],
   leftforearm:[-.13,0,-.12],rightforearm:[-.13,0,.12],
   leftupleg:[seated?-1.15:stride*.46,0,0],
   rightupleg:[seated?-1.15:-stride*.46,0,0],
   leftleg:[seated?1.15:Math.max(0,-stride)*.48,0,0],
   rightleg:[seated?1.15:Math.max(0,stride)*.48,0,0],
   spine1:[seated?-.14:0,0,pain?.035:0],
   spine2:[pain?-.12:seated?-.09:0,0,0],
   neck:[pain?-.1:0,0,0],
   head:[pain?-.12:talking?Math.sin(phase*2)*.035:0,Math.sin(phase*.35)*.025,pain?.07:0]
  };
  for(const [k,b] of Object.entries(bones)){const origin=base[k],target=motion[k]||[0,0,0];b.rotation.x=smooth(b.rotation.x,origin.x+target[0],.14);b.rotation.y=smooth(b.rotation.y,origin.y+target[1],.14);b.rotation.z=smooth(b.rotation.z,origin.z+target[2],.14)}
 }
 return {pose,bones};
}
