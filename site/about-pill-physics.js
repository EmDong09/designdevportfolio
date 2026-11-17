// Pure scene construction shared by the browser controller and physics validation.
window.createAboutPillScene=(Matter,width,height,random=Math.random)=>{
 const {Engine,Bodies,Body,Composite,Sleeping}=Matter;
 const engine=Engine.create({enableSleeping:true,positionIterations:10,velocityIterations:8});
 engine.gravity.y=1;engine.gravity.scale=.001;
 const scale=Math.min(1,width/600,height/650);
 const sizes=[[210,116],[240,130],[310,164],[200,110],[260,142]].map(([w,h])=>({width:w*scale,height:h*scale}));
 const angles=[-15,15,0,10,0],xs=[.45,.48,.46,.67,.38];
 const order=[4,3,2,1,0];
 const bodies=Array(5).fill(null);let time=0,next=0;
 Composite.add(engine.world,[
  Bodies.rectangle(width/2,height+50,width+200,100,{isStatic:true,friction:1}),
  Bodies.rectangle(-50,height/2,100,height+2000,{isStatic:true}),
  Bodies.rectangle(width+50,height/2,100,height+2000,{isStatic:true})
 ]);
 function spawn(index){
  const size=sizes[index],r=size.height/2,segment=(size.width-size.height)/2,vertices=[];
  for(let i=0;i<=16;i++){const a=-Math.PI/2+i*Math.PI/16;vertices.push({x:segment+r*Math.cos(a),y:r*Math.sin(a)});}
  for(let i=0;i<=16;i++){const a=Math.PI/2+i*Math.PI/16;vertices.push({x:-segment+r*Math.cos(a),y:r*Math.sin(a)});}
  const x=Math.max(size.width/2+8,Math.min(width-size.width/2-8,width*xs[index]));
  const highest=Math.min(0,...bodies.filter(Boolean).map(body=>body.bounds.min.y));
  const y=Math.min(-size.height/2-8,highest-size.height/2-12);
  const body=Bodies.fromVertices(x,y,vertices,{restitution:.18,friction:.85,frictionStatic:1,frictionAir:.025,density:.002,sleepThreshold:90});
  Body.setInertia(body,body.inertia*3);
  Body.setAngle(body,(angles[index]+(random()-.5)*4)*Math.PI/180);
  const halfHeight=(body.bounds.max.y-body.bounds.min.y)/2;
  Body.setPosition(body,{x,y:Math.min(-halfHeight-8,highest-halfHeight-12)});
  Body.setAngularVelocity(body,(random()-.5)*.004);
  bodies[index]=body;Composite.add(engine.world,body);
 }
 function update(dt=1000/60){
  time+=dt;
  while(next<order.length&&time>=100+next*250)spawn(order[next++]);
  Engine.update(engine,dt);
 }
 const settled=()=>next===5&&bodies.every(body=>body.isSleeping);
 function settle(){
  for(let i=0;i<2400&&!settled();i++)update();
  bodies.forEach(body=>{Body.setVelocity(body,{x:0,y:0});Body.setAngularVelocity(body,0);Sleeping.set(body,true);});
 }
 return {engine,bodies,sizes,update,settled,settle,dispose(){Engine.clear(engine);Composite.clear(engine.world,false);}};
};
