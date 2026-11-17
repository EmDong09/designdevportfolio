(()=>{
 const viewport=document.querySelector('.arc-viewport');
 if(!viewport)return;
 const cards=[...viewport.querySelectorAll('.gallery-pin')];
 const studies=window.portfolioContent.playground.studies;
 const button=document.querySelector('[data-arc-pause]');
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 let loopSpan=2,baseY=0,itemOffsets=[],arcTable=[],arcLength=0;
 let phase=.58,frame=0,lastTime=0,paused=motion.matches,focused=false,width=0,height=0,cardHeight=100,rx=0,ry=0;
 const ratios=cards.map(card=>{
  const study=studies.find(s=>s.id===card.querySelector('[data-study-id]').dataset.studyId);
  return study.src?study.width/study.height:study.ratio.split('/').map(Number).reduce((a,b)=>a/b);
 });
 // Parameterize the ellipse by distance so entry, travel and exit have the same speed.
 function curveProgress(p){
  const distance=Math.max(0,Math.min(1,(p+.5)/2))*arcLength;
  let low=0,high=arcTable.length-1;
  while(high-low>1){const mid=(low+high)>>1;if(arcTable[mid].distance<distance)low=mid;else high=mid;}
  const first=arcTable[low],second=arcTable[high];
  const t=(distance-first.distance)/(second.distance-first.distance||1);
  return (first.theta+(second.theta-first.theta)*t)/Math.PI;
 }
 function render(){
  const clipHeight=parseFloat(viewport.parentElement.style.getPropertyValue('--arc-content-height'))||height;
  cards.forEach((card,i)=>{
   const travel=(phase+itemOffsets[i])%loopSpan;
   // Follow the lower U-shaped arc; the return pass stays above the navigation.
   const progress=curveProgress(Math.min(travel,2)-.5);
   const x=width/2+rx*Math.cos(progress*Math.PI);
   const y=baseY+ry*Math.sin(progress*Math.PI);
   // Follow the inward normal of the ellipse, keeping the image above the U.
   const theta=progress*Math.PI;
   const angle=Math.atan2(-ry*Math.cos(theta),rx*Math.sin(theta))*180/Math.PI;
   card.style.transform=`translate(${x}px,${y}px) translate(-50%,-100%) rotate(${angle}deg)`;
   // The image's bottom-center is the path anchor. Clipping, rather than fading,
   // hides each artwork as it returns above the navigation.
   const radians=angle*Math.PI/180,w=cardHeight*ratios[i];
   const corners=[[-w/2,0],[w/2,0],[-w/2,-cardHeight],[w/2,-cardHeight]].map(([cx,cy])=>({x:x+cx*Math.cos(radians)-cy*Math.sin(radians),y:y+cx*Math.sin(radians)+cy*Math.cos(radians)}));
   const visible=travel<2&&Math.max(...corners.map(p=>p.y))>0&&Math.min(...corners.map(p=>p.y))<clipHeight&&Math.max(...corners.map(p=>p.x))>0&&Math.min(...corners.map(p=>p.x))<width;
   card.style.visibility=visible?'visible':'hidden';
   card.inert=!visible;
   card.setAttribute('aria-hidden',String(card.inert));
  });
 }
 function tick(now){
  frame=0;
  const elapsed=lastTime?Math.min(50,now-lastTime):0;lastTime=now;
  // Each artwork takes 100 seconds to trace the visible arch.
  phase=(phase+elapsed/100000)%loopSpan;render();
  if(!paused&&!focused&&!document.hidden)frame=requestAnimationFrame(tick);
 }
 function sync(){
  cancelAnimationFrame(frame);frame=0;lastTime=0;
  button.textContent=paused?'Resume motion':'Pause motion';button.setAttribute('aria-pressed',String(paused));
  if(!paused&&!focused&&!document.hidden)frame=requestAnimationFrame(tick);
 }
 function resize(){
  width=viewport.clientWidth;height=viewport.clientHeight;
  cardHeight=Math.max(90,Math.min(275,width*.215));
  rx=width*.58;
  const textInset=width<600?56:72;
  const pathInset=width<600?104:128;
  const originalBase=-Math.max(30,cardHeight*.25);
  const archBottom=originalBase+pathInset+Math.max(width*.32,cardHeight+180-originalBase);
  // Both upper ends continue behind navigation, with a single smooth dip between them.
  baseY=-Math.max(40,cardHeight*.35);
  ry=archBottom-baseY;
  arcTable=[{theta:-Math.PI/2,distance:0}];arcLength=0;
  let last={x:0,y:-ry};
  for(let i=1;i<=720;i++){
   const theta=-Math.PI/2+i*2*Math.PI/720;
   const point={x:rx*Math.cos(theta),y:ry*Math.sin(theta)};
   arcLength+=Math.hypot(point.x-last.x,point.y-last.y);
   arcTable.push({theta,distance:arcLength});last=point;
  }
  viewport.parentElement.style.setProperty('--arc-heading-top',(20+textInset)+'px');
  viewport.parentElement.style.setProperty('--arc-control-top',(108+textInset)+'px');
  viewport.parentElement.style.setProperty('--arc-content-height',(archBottom+80)+'px');
  // Find the closest safe angular separation on the actual elliptical path.
  // Fit each neighboring pair with a small safety margin, without widening every gap.
  function polygon(progress,artworkWidth){
   const theta=curveProgress(progress)*Math.PI,a=Math.atan2(-ry*Math.cos(theta),rx*Math.sin(theta));
   const x=width/2+rx*Math.cos(theta),y=baseY+ry*Math.sin(theta);
   return [[-artworkWidth/2-1.5,1.5],[artworkWidth/2+1.5,1.5],[artworkWidth/2+1.5,-cardHeight-1.5],[-artworkWidth/2-1.5,-cardHeight-1.5]].map(([u,v])=>[x+u*Math.cos(a)-v*Math.sin(a),y+u*Math.sin(a)+v*Math.cos(a)]);
  }
  function overlaps(a,b){
   for(const shape of [a,b])for(let k=0;k<2;k++){
    const dx=shape[k+1][0]-shape[k][0],dy=shape[k+1][1]-shape[k][1];
    const aa=a.map(([x,y])=>-dy*x+dx*y),bb=b.map(([x,y])=>-dy*x+dx*y);
    if(Math.max(...aa)<=Math.min(...bb)||Math.max(...bb)<=Math.min(...aa))return false;
   }
   return true;
  }
  function clear(delta,firstWidth,secondWidth){
   for(let p=-.5;p<=1.5-delta;p+=.008){
    const a=polygon(p,firstWidth),b=polygon(p+delta,secondWidth);
    // Fully off-screen artwork does not need to reserve visible gallery space.
    const onScreen=poly=>Math.max(...poly.map(p=>p[1]))>0&&Math.min(...poly.map(p=>p[1]))<archBottom+80&&Math.max(...poly.map(p=>p[0]))>0&&Math.min(...poly.map(p=>p[0]))<width;
    if(!onScreen(a)||!onScreen(b))continue;
    if(overlaps(a,b))return false;
   }
   return true;
  }
  const pairCache=new Map();
  const gaps=ratios.map((ratio,index)=>{
   const next=ratios[(index+1)%ratios.length],key=ratio+':'+next;
   if(pairCache.has(key))return pairCache.get(key);
   let low=.01,high=1;
   for(let i=0;i<13;i++){
    const middle=(low+high)/2;
    if(clear(middle,cardHeight*ratio,cardHeight*next))high=middle;else low=middle;
   }
   const gap=high+.003;
   pairCache.set(key,gap);return gap;
  });
  loopSpan=Math.max(2,gaps.reduce((sum,gap)=>sum+gap,0));
  let cursor=0;
  itemOffsets=gaps.map((gap,index)=>{if(index)cursor+=gaps[index-1];return cursor;});
  phase%=loopSpan;
  cards.forEach((card,i)=>{card.style.setProperty('--arc-width',cardHeight*ratios[i]+'px');card.style.setProperty('--arc-height',cardHeight+'px');});
  render();
 }
 button.addEventListener('click',()=>{paused=!paused;sync();});
 let drag=null,suppressUntil=0;
 const wrap=value=>((value%loopSpan)+loopSpan)%loopSpan;
 function pointerAngle(event){
  const bounds=viewport.getBoundingClientRect();
  return Math.atan2((event.clientY-bounds.top-baseY)/ry,(event.clientX-bounds.left-width/2)/rx);
 }
 viewport.addEventListener('pointerdown',event=>{
  if(event.button!==0||!event.target.closest('.pin-button'))return;
  drag={id:event.pointerId,index:cards.findIndex(card=>card.contains(event.target)),x:event.clientX,y:event.clientY,angle:pointerAngle(event),moved:false};
  focused=false;sync();
 });
 viewport.addEventListener('pointermove',event=>{
  if(!drag||event.pointerId!==drag.id)return;
  if(!drag.moved&&Math.hypot(event.clientX-drag.x,event.clientY-drag.y)>6){
   drag.moved=true;viewport.setPointerCapture(event.pointerId);viewport.classList.add('is-dragging');
  }
  if(!drag.moved)return;
  const angle=pointerAngle(event);
  let delta=angle-drag.angle;
  if(delta>Math.PI)delta-=2*Math.PI;
  if(delta< -Math.PI)delta+=2*Math.PI;
  const middle=angle-delta/2;
  const pathDelta=delta*Math.hypot(rx*Math.sin(middle),ry*Math.cos(middle))/arcLength*2;
  phase=wrap(phase+pathDelta);drag.angle=angle;render();
 });
 function endDrag(){
  if(!drag)return;
  const id=drag.id;
  if(drag.moved)suppressUntil=performance.now()+350;
  drag=null;viewport.classList.remove('is-dragging');
  if(viewport.hasPointerCapture(id))viewport.releasePointerCapture(id);
 }
 viewport.addEventListener('pointerup',endDrag);
 viewport.addEventListener('pointercancel',endDrag);
 viewport.addEventListener('lostpointercapture',endDrag);
 viewport.addEventListener('pointerleave',()=>{if(drag&&!drag.moved)endDrag();});
 viewport.addEventListener('click',event=>{
  if(performance.now()<suppressUntil){event.preventDefault();event.stopImmediatePropagation();}
 },true);
 viewport.addEventListener('dragstart',event=>event.preventDefault());
 viewport.addEventListener('focusin',event=>{focused=event.target.matches(':focus-visible');sync();});
 viewport.addEventListener('focusout',event=>{if(!viewport.contains(event.relatedTarget)){focused=false;sync();}});
 document.addEventListener('visibilitychange',sync);
 motion.addEventListener('change',event=>{paused=event.matches;sync();});
 new ResizeObserver(resize).observe(viewport);resize();sync();
})();
