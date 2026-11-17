// Pure scene construction shared by the browser controller and physics validation.
window.createAboutPillScene=(Matter,width,height,random=Math.random,floorY=height*.76+20)=>{
 const {Engine,Bodies,Body,Composite,Sleeping,Query}=Matter;
 const engine=Engine.create({enableSleeping:true,positionIterations:12,velocityIterations:10});
 engine.gravity.y=.44;engine.gravity.scale=.001;
 // One shared size for all three capsules; only their drop positions and angles vary.
 const PILL_WIDTH=Math.min(305,width*.48),PILL_HEIGHT=PILL_WIDTH*.46;
 const sizes=Array.from({length:3},()=>({width:PILL_WIDTH,height:PILL_HEIGHT}));
 const drops=[{x:.55,angle:-4},{x:.55,angle:5},{x:.55,angle:-3}];
 const bodies=Array(3).fill(null),quietTimes=Array(3).fill(0);let time=0,next=0,nextDrop=0;
 Composite.add(engine.world,[
  Bodies.rectangle(width/2,floorY+50,width+200,100,{isStatic:true,friction:.3,frictionStatic:.4}),
  Bodies.rectangle(-50,height/2,100,height+2000,{isStatic:true,friction:.3,frictionStatic:.4}),
  Bodies.rectangle(width+50,height/2,100,height+2000,{isStatic:true,friction:.3,frictionStatic:.4})
 ]);
 function spawn(index){
  const r=PILL_HEIGHT/2,segment=(PILL_WIDTH-PILL_HEIGHT)/2,vertices=[];
  for(let i=0;i<=16;i++){const a=-Math.PI/2+i*Math.PI/16;vertices.push({x:segment+r*Math.cos(a),y:r*Math.sin(a)});}
  for(let i=0;i<=16;i++){const a=Math.PI/2+i*Math.PI/16;vertices.push({x:-segment+r*Math.cos(a),y:r*Math.sin(a)});}
  const x=Math.max(PILL_WIDTH/2+4,Math.min(width-PILL_WIDTH/2-4,width*(drops[index].x+(random()-.5)*.006)));
  const body=Bodies.fromVertices(x,-PILL_HEIGHT,vertices,{restitution:.5,friction:.3,frictionStatic:.4,frictionAir:.02,density:.0006,sleepThreshold:Infinity});
  Body.setInertia(body,body.inertia*3);
  Body.setAngle(body,drops[index].angle*Math.PI/180);
  Body.setAngularVelocity(body,(random()-.5)*.06);
  const halfHeight=(body.bounds.max.y-body.bounds.min.y)/2;
  Body.setPosition(body,{x,y:-halfHeight-8});
  // Staggered airborne pills may share horizontal space. Start the new pill above
  // any intersection so the solver never has to eject an overlapping spawn.
  while(Query.collides(body,bodies.filter(Boolean)).length)Body.translate(body,{x:0,y:-PILL_HEIGHT*.2});
  bodies[index]=body;Composite.add(engine.world,body);
 }
 function update(dt=1000/60){
  time+=dt;
  // Closely staggered drops let the lightweight capsules bounce together.
  if(next<drops.length&&time>=nextDrop){
   spawn(next++);nextDrop=time+200;
  }
  // A gentle rotational resistance keeps a capsule from tipping upright.
  // Positions and contact forces still come entirely from Matter collisions.
  for(const body of bodies.filter(Boolean)){
   if(body.isSleeping)continue;
   const limit=12*Math.PI/180;
   const excess=body.angle-Math.max(-limit,Math.min(limit,body.angle));
   body.torque-=excess*body.inertia*.0002;
  }
  Engine.update(engine,dt);
  // Freeze only supported bodies that have stayed quiet for half a second.
  // Matter can still wake an earlier pill when a later one lands on it.
  bodies.forEach((body,index)=>{
   if(!body||body.isSleeping)return;
   // Contact alone is not enough: the center of mass must be above the
   // supporting contact patch, rather than hanging beyond a rounded edge.
   const supportRanges=engine.pairs.list.filter(pair=>pair.isActive&&(
    pair.bodyA===body&&pair.bodyB.position.y>body.position.y||
    pair.bodyB===body&&pair.bodyA.position.y>body.position.y
   )).map(pair=>{
    const other=pair.bodyA===body?pair.bodyB:pair.bodyA;
    const contacts=pair.collision.supports.slice(0,pair.collision.supportCount);
    const contactY=contacts.reduce((sum,point)=>sum+point.y,0)/contacts.length;
    // Include almost-flat face vertices: a single numerical contact must not
    // turn a broad, flat support surface into an imaginary knife edge.
    const lower=body.vertices.filter(point=>point.y>=body.position.y&&Math.abs(point.y-contactY)<3);
    const upper=other.vertices.filter(point=>point.y<=other.position.y&&Math.abs(point.y-contactY)<3);
    const first=[...lower,...contacts].map(point=>point.x),second=[...upper,...contacts].map(point=>point.x);
    return {min:Math.max(Math.min(...first),Math.min(...second)),max:Math.min(Math.max(...first),Math.max(...second))};
   });
   const supported=supportRanges.length>0&&body.position.x>=Math.min(...supportRanges.map(range=>range.min))-2&&body.position.x<=Math.max(...supportRanges.map(range=>range.max))+2;
   const quiet=supported&&body.speed<.08&&body.angularSpeed<.001;
   quietTimes[index]=quiet?quietTimes[index]+dt:0;
   if(quietTimes[index]>=500){
    Body.setVelocity(body,{x:0,y:0});Body.setAngularVelocity(body,0);Sleeping.set(body,true);
    quietTimes[index]=0;
   }
  });
 }
 const settled=()=>next===drops.length&&bodies.every(body=>body.isSleeping);
 function settle(){
  for(let i=0;i<2400&&!settled();i++)update();
  bodies.forEach(body=>{Body.setVelocity(body,{x:0,y:0});Body.setAngularVelocity(body,0);Sleeping.set(body,true);});
 }
 return {engine,bodies,sizes,floorY,update,settled,settle,dispose(){Engine.clear(engine);Composite.clear(engine.world,false);}};
};
