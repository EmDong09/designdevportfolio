import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import Matter from 'matter-js';
const context={window:{}};
vm.runInNewContext(await readFile(new URL('../site/about-pill-physics.js',import.meta.url),'utf8'),context);
let checks=0;
for(const [width,height,floorY] of [[650,816,620],[540,684,519.68],[390,460,452],[320,460,452]]){
 for(let seed=1;seed<=32;seed++){
  let state=seed;
  const random=()=>{state=(state*1664525+1013904223)>>>0;return state/4294967296;};
  const scene=context.window.createAboutPillScene(Matter,width,height,random,floorY);
  assert.equal(scene.sizes.length,3);
  scene.sizes.forEach(size=>{assert.equal(size.width,scene.sizes[0].width);assert.equal(size.height,scene.sizes[0].height);});
  let steps=0;
  for(;steps<1800&&!scene.settled();steps++)scene.update();
  assert.ok(scene.settled(),`${width}px, seed ${seed}: did not naturally sleep`);
  for(const body of scene.bodies){
   assert.ok(body.bounds.min.x>=-2&&body.bounds.max.x<=width+2,'Escaped side wall');
   assert.ok(body.bounds.max.y<=scene.floorY+2,'Escaped floor');
   assert.ok(Math.abs(body.angle)*180/Math.PI<=2,'Pill froze at an unsupported tilt');
  }
  const base=scene.bodies.filter(body=>body.bounds.max.y>=scene.floorY-2);
  assert.equal(base.length,1,`${width}px seed ${seed}: expected one floor pill`);
  const spread=Math.max(...scene.bodies.map(b=>b.position.x))-Math.min(...scene.bodies.map(b=>b.position.x));
  assert.ok(spread<width*.25,'Pills slid too far from the stack');
  assert.ok(scene.bodies[0].position.y>scene.bodies[1].position.y&&scene.bodies[1].position.y>scene.bodies[2].position.y,'Drop order did not produce a stack');
  const positions=scene.bodies.map(body=>({...body.position}));
  for(let i=0;i<60;i++)scene.update();
  scene.bodies.forEach((body,i)=>assert.ok(Math.hypot(body.position.x-positions[i].x,body.position.y-positions[i].y)<.001,'Moved after sleeping'));
  scene.dispose();checks++;
 }
 const reduced=context.window.createAboutPillScene(Matter,width,height,()=>.5,floorY);
 reduced.settle();assert.ok(reduced.settled(),'Reduced-motion pose did not settle');reduced.dispose();
}
console.log(`${checks} randomized About pill scenes passed; reduced-motion poses passed at all four sizes.`);
