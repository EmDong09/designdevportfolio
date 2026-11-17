import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import Matter from 'matter-js';
const context={window:{}};
vm.runInNewContext(await readFile(new URL('../site/about-pill-physics.js',import.meta.url),'utf8'),context);
let checks=0;
for(const [width,height] of [[650,740],[540,680],[390,460],[320,460]]){
 for(let seed=1;seed<=8;seed++){
  let state=seed;
  const random=()=>{state=(state*1664525+1013904223)>>>0;return state/4294967296;};
  const scene=context.window.createAboutPillScene(Matter,width,height,random);
  assert.equal(scene.sizes.length,5);
  assert.equal(Math.max(...scene.sizes.map(size=>size.width)),scene.sizes[2].width);
  let steps=0;
  for(;steps<1800&&!scene.settled();steps++)scene.update();
  assert.ok(scene.settled(),`${width}px, seed ${seed}: did not naturally sleep`);
  for(const body of scene.bodies){
   assert.ok(body.bounds.min.x>=-2&&body.bounds.max.x<=width+2,'Escaped side wall');
   assert.ok(body.bounds.max.y<=height+2,'Escaped floor');
  }
  const positions=scene.bodies.map(body=>({...body.position}));
  for(let i=0;i<60;i++)scene.update();
  scene.bodies.forEach((body,i)=>assert.ok(Math.hypot(body.position.x-positions[i].x,body.position.y-positions[i].y)<.001,'Moved after sleeping'));
  scene.dispose();checks++;
 }
 const reduced=context.window.createAboutPillScene(Matter,width,height,()=>.5);
 reduced.settle();assert.ok(reduced.settled(),'Reduced-motion pose did not settle');reduced.dispose();
}
console.log(`${checks} randomized About pill scenes passed; reduced-motion poses passed at all four sizes.`);
