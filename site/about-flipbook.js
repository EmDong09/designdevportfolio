// Original photo proportions are retained; focal points crop each full spread to 6:5.
const SPREADS = [
 '/assets/journal/spread-01.webp',
 '/assets/journal/spread-03.webp',
 '/assets/journal/spread-04.webp',
 '/assets/journal/spread-11.webp',
 '/assets/journal/spread-12.webp',
 '/assets/journal/spread-06.webp',
 '/assets/journal/spread-05.webp',
 '/assets/journal/spread-07.webp',
 '/assets/journal/spread-08.webp',
 '/assets/journal/spread-09.webp',
 '/assets/journal/spread-10.webp',
 '/assets/journal/spread-13.webp'
];
// Both page halves share a crop so each photograph stays continuous across the spine.
const SPREAD_FOCAL_POINTS = [
 '0% 50%', '62% 50%', '50% 60%', '50% 60%', '50% 62%', '58% 50%', '50% 62%', '95% 50%', '50% 50%', '50% 50%', '50% 65%', '50% 50%'
];
(()=>{
 const root=document.querySelector('[data-flipbook]');
 if(!root||!SPREADS.length)return;
 const spread=root.querySelector('.journal-spread');
 const turn=root.querySelector('.journal-turn');
 const fade=root.querySelector('.journal-crossfade');
 const front=turn.querySelector('.journal-front'),back=turn.querySelector('.journal-back');
 const status=document.querySelector('[data-journal-status]');
 const progress=document.querySelector('[data-journal-progress]');
 const dots=progress?SPREADS.map(()=>{const dot=document.createElement('span');progress.append(dot);return dot;}):[];
 const buttons=[...root.querySelectorAll('[data-journal-step]')];
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 const mobile=matchMedia('(max-width: 767px)');
 const cache=new Map(),loaded=new Set(),leaves=[],hinges=[];
 let index=Math.floor((SPREADS.length-1)/2),busy=false,started=false,ready=false,suppressClickUntil=0,gesture=null;
 const valid=value=>value>=0&&value<SPREADS.length;
 function load(value){
  if(!valid(value))return Promise.resolve(false);
  const target=value,source=SPREADS[target];
  if(cache.has(source))return cache.get(source);
  const promise=new Promise(resolve=>{
   const image=new Image();image.decoding='async';
   image.onload=async()=>{try{await image.decode?.();}catch{}loaded.add(source);resolve(true);};
   image.onerror=()=>{cache.delete(source);resolve(false);};
   image.src=source;
  });
  cache.set(source,promise);return promise;
 }
 function picture(container,value,preview=false){
  const image=container.querySelector('.journal-image'),source=SPREADS[value];
  if(!source){image.removeAttribute('src');return;}
  image.style.objectPosition=SPREAD_FOCAL_POINTS[value] || '50% 50%';
  if(preview)image.setAttribute('src',source.replace('.webp','-preview.webp'));
  else if(loaded.has(source))image.setAttribute('src',source);else image.removeAttribute('src');
 }
 function pair(container,value){
  picture(container.querySelector('.journal-left'),value);
  picture(container.querySelector('.journal-right'),value);
 }
 function stackDepth(side,value,at=index){return side==='left'?at-value-1:value-at-1;}
 function inFan(depth){return depth>=0&&depth<6;}
 function leafTransform(side,depth){
  const direction=side==='left'?-1:1;
  const firstEdge=mobile.matches?7:Math.min(42,Math.max(18,(root.clientWidth||600)*.055));
  // Perspective compresses the exposed edge of each progressively deeper leaf.
  const distance=firstEdge*(1-Math.pow(.72,depth+1))/(1-.72);
  const scale=.98*Math.pow(.955,Math.max(0,depth));
  return `translateX(${direction*distance}px) translateZ(${-2*(depth+1)}px) rotateY(${-direction*(5+depth*2)}deg) scaleY(${scale})`;
 }
 // Each photo keeps its own physical page. Never replace a moving page's image
 // or change its box dimensions when the animation finishes.
 for(const side of ['left','right']){
  const stack=root.querySelector(`.journal-stack-${side}`);
  SPREADS.forEach((source,value)=>{
   const leaf=document.createElement('div');leaf.className='journal-stack-leaf';
   const image=document.createElement('img');image.className='journal-image';image.alt='';image.decoding='async';
   leaf.append(image);stack.append(leaf);
   leaf.style.zIndex=String(side==='left'?value+1:SPREADS.length-value);
   leaf.style.top='0';leaf.style.height='100%';
   picture(leaf,value,true);
   leaves.push({element:leaf,side,value});
  });
 }
 function fan(){
  leaves.forEach(({element,side,value})=>{
   const depth=stackDepth(side,value);
   element.hidden=!inFan(depth);
   element.style.transform=leafTransform(side,depth);element.style.opacity='1';
  });
 }
 // A chain of connected hinges bends as one surface, rather than disconnected strips.
 const mesh=document.createElement('div');mesh.className='journal-leaf-mesh';turn.append(mesh);
 let parent=mesh;
 for(let i=0;i<10;i++){
  const hinge=document.createElement('div');hinge.className=`journal-hinge${i===9?' journal-hinge-tip':''}`;
  hinge.style.width=i?'100%':'10%';
  const images=[];
  for(const face of ['front','back']){
   const panel=document.createElement('div');panel.className=`journal-panel journal-panel-${face}`;
   const photo=document.createElement('img');photo.className='journal-panel-image';photo.alt='';photo.decoding='async';
   const shade=document.createElement('span');shade.className='journal-panel-shade';
   panel.append(photo);panel.append(shade);hinge.append(panel);images.push({photo,shade});
  }
  parent.append(hinge);parent=hinge;hinges.push({element:hinge,images,index:i});
 }
 function prepareLeaf(direction,target){
  hinges.forEach(({element,images,index:i})=>{
   element.style.left=direction>0?(i?'100%':'0'):'auto';
   element.style.right=direction<0?(i?'100%':'0'):'auto';
   element.style.transformOrigin=direction>0?'0 50%':'100% 50%';
   images.forEach(({photo,shade},face)=>{
    const value=face?target:index;
    photo.setAttribute('src',SPREADS[value]);photo.style.objectPosition=SPREAD_FOCAL_POINTS[value];
    const textureIndex=(direction>0)===(face===0)?10+i:9-i;
    photo.style.left=`calc(-${textureIndex} * 5cqw)`;
    const rightHalf=(direction>0)===(face===0);
    shade.style.left=`calc(-${rightHalf?i:9-i} * 5cqw)`;
    shade.style.background=rightHalf?'var(--journal-right-shade)':'var(--journal-left-shade)';
   });
  });
 }
 // Each visible photo advances exactly one slot: left outward/right inward on a
 // forward turn, with the inverse on a backward turn. No whole-stack crossfade.
 function advanceStacks(direction,duration,animations){
  leaves.forEach(({element,side,value})=>{
   const depth=stackDepth(side,value),nextDepth=stackDepth(side,value,index+direction);
   if(!inFan(depth)&&!inFan(nextDepth))return;
   element.hidden=false;
   // New outer leaves enter gently; consumed pages move behind the open spread.
   const fromOpacity=depth>5?0:1,toOpacity=nextDepth>5?0:1;
   const finalTransform=leafTransform(side,nextDepth);
   animations.push(animate(element,[
    {transform:leafTransform(side,depth),opacity:fromOpacity},
    {transform:finalTransform,opacity:toOpacity}
   ],{duration,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'}));
   // Commit the exact endpoint underneath the animation before cancelling it.
   element.style.transform=finalTransform;element.style.opacity=String(toOpacity);
  });
 }
 function paint(){pair(spread,index);fan();dots.forEach((dot,i)=>dot.classList.toggle('is-current',i===index));status.textContent=`Spread ${index+1} of ${SPREADS.length}`;}
 function neighbors(){
  // Full-size photos load only for the current and adjacent spreads.
  // Preview leaves show only pages that exist before or after this spread.
  Promise.all([index-1,index+1].filter(valid).map(load)).then(()=>{if(!busy)fan();});
 }
 function setBusy(value){
  busy=value;root.setAttribute('aria-busy',String(value));
  syncControls();
 }
 function syncControls(){
  buttons.forEach(button=>{
   const disabled=busy||!ready||!valid(index+Number(button.dataset.journalStep));
   button.disabled=disabled;button.setAttribute('aria-disabled',String(disabled));
   button.setAttribute('data-journal-available',String(valid(index+Number(button.dataset.journalStep))));
  });
 }
 function animate(element,keyframes,options){
  const animation=element.animate(keyframes,options);
  return animation;
 }
 async function step(direction){
  if(busy||!ready||!valid(index+direction))return;
  setBusy(true);
  const target=index+direction,animations=[];
  if(!(await Promise.all([load(index),load(target)])).every(Boolean)){
   setBusy(false);status.textContent='This spread could not load. Please try again.';return;
  }
  try{
   const crossfade=motion.matches||mobile.matches;
   const duration=crossfade?180:460;
   if(crossfade){
    pair(fade,index);fade.hidden=false;
    pair(spread,target);
    animations.push(animate(fade,[{opacity:1},{opacity:0}],{duration,easing:'ease-in-out',fill:'forwards'}));
   }else{
    turn.classList.toggle('is-forward',direction>0);
    turn.classList.toggle('is-backward',direction<0);
    picture(front,index);picture(back,target);prepareLeaf(direction,target);
    picture(spread.querySelector(direction>0?'.journal-right':'.journal-left'),target);
    turn.hidden=false;turn.style.willChange='transform';
    const startAngle=direction>0?-10:10;
    const angle=direction>0?-170:170;
    animations.push(animate(turn,[
     {transform:`translateZ(2px) rotateY(${startAngle}deg)`},
     {offset:.5,transform:`translateZ(2px) rotateY(${direction>0?-90:90}deg) rotateX(${direction*.4}deg)`},
     {transform:`translateZ(2px) rotateY(${angle}deg)`}
    ],{duration,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'}));
    hinges.forEach(({element,index:i})=>{
     const bend=i?Math.sin(i/10*Math.PI)*2.4*direction:0;
     animations.push(animate(element,[
      {transform:'rotateY(0deg)'},
      {offset:.5,transform:`rotateY(${bend}deg)`},
      {transform:'rotateY(0deg)'}
     ],{duration,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'}));
    });
    advanceStacks(direction,duration,animations);
   }
   await Promise.all(animations.map(animation=>animation.finished));
   index=target;paint();
  }finally{
   turn.hidden=true;fade.hidden=true;turn.style.willChange='';
   animations.forEach(animation=>animation.cancel());setBusy(false);neighbors();
  }
 }
 buttons.forEach(button=>button.addEventListener('click',()=>{
  if(performance.now()>=suppressClickUntil)step(Number(button.dataset.journalStep));
 }));
 root.addEventListener('keydown',event=>{
  if(event.key!=='ArrowLeft'&&event.key!=='ArrowRight')return;
  event.preventDefault();step(event.key==='ArrowRight'?1:-1);
 });
 root.addEventListener('pointerdown',event=>{
  if(event.pointerType==='touch')gesture={id:event.pointerId,x:event.clientX,y:event.clientY};
 });
 root.addEventListener('pointerup',event=>{
  if(!gesture||gesture.id!==event.pointerId)return;
  const dx=event.clientX-gesture.x,dy=event.clientY-gesture.y;gesture=null;
  if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.4){
   suppressClickUntil=performance.now()+400;step(dx<0?1:-1);
  }
 });
 root.addEventListener('pointercancel',()=>{gesture=null;});
 mobile.addEventListener('change',()=>{if(!busy)fan();});
 async function start(){
  if(started)return;started=true;
  if(await load(index)){
   ready=true;paint();neighbors();syncControls();
  }
 }
 fan();syncControls();start();
})();
