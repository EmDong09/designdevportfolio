(()=>{
 const stage=document.querySelector('.about-pill-stage');
 if(!stage||!window.Matter)return;
 const pills=[...stage.querySelectorAll('[data-about-pill]')];
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 let scene,frame=0,lastTime=0,accumulator=0,width=0,height=0,started=false;
 function paint(){
  stage.classList.toggle('is-settled',scene.settled());
  pills.forEach((pill,i)=>{
   const body=scene.bodies[i];if(!body)return;
   pill.style.visibility='visible';
   pill.style.transform=`translate(${body.position.x}px,${body.position.y}px) translate(-50%,-50%) rotate(${body.angle}rad)`;
  });
 }
 function tick(now){
  frame=0;
  accumulator+=(lastTime?Math.min(80,now-lastTime):1000/60);lastTime=now;
  while(accumulator>=1000/60){scene.update();accumulator-=1000/60;}
  paint();
  if(!scene.settled()&&!document.hidden)frame=requestAnimationFrame(tick);
 }
 function finish(){
  cancelAnimationFrame(frame);frame=0;scene.settle();paint();
 }
 function resize(){
  const w=stage.clientWidth,h=stage.clientHeight;
  if(!w||!h||(w===width&&h===height))return;
  const first=!started;started=true;width=w;height=h;
  cancelAnimationFrame(frame);scene?.dispose();
  stage.classList.remove('is-settled');
  pills.forEach(pill=>pill.style.visibility='hidden');
  const FLOOR_Y=window.innerHeight*.76+20;
  const narrow=matchMedia('(max-width: 760px)').matches;
  // On desktop the floor is 76% down the viewport; mobile gets its own stage
  // beneath the text so the same pile remains fully visible and centered.
  const floorY=narrow?h-8:FLOOR_Y-(stage.getBoundingClientRect().top+window.scrollY);
  scene=window.createAboutPillScene(window.Matter,w,h,first&&!motion.matches?Math.random:()=>.5,Math.min(h-8,Math.max(220,floorY)));
  pills.forEach((pill,i)=>{pill.style.setProperty('--physics-width',scene.sizes[i].width+'px');pill.style.setProperty('--physics-height',scene.sizes[i].height+'px');});
  lastTime=0;accumulator=0;
  if(motion.matches||!first)finish();else frame=requestAnimationFrame(tick);
 }
 motion.addEventListener('change',event=>{if(event.matches&&scene)finish();});
 document.addEventListener('visibilitychange',()=>{
  lastTime=0;
  if(document.hidden){cancelAnimationFrame(frame);frame=0;}
  else if(scene&&!scene.settled()&&!frame)frame=requestAnimationFrame(tick);
 });
 window.addEventListener('pagehide',()=>{if(scene)finish();});
 new ResizeObserver(resize).observe(stage);resize();
})();
