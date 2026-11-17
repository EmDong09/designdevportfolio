// Replace these full-spread images with your own 6:5 journal artwork.
const SPREADS = [
 '/assets/journal/spread-01.svg',
 '/assets/journal/spread-02.svg',
 '/assets/journal/spread-03.svg',
 '/assets/journal/spread-04.svg',
 '/assets/journal/spread-05.svg',
 '/assets/journal/spread-06.svg',
 '/assets/journal/spread-07.svg',
 '/assets/journal/spread-08.svg'
];
(()=>{
 const root=document.querySelector('[data-flipbook]');
 if(!root||!SPREADS.length)return;
 const spread=root.querySelector('.journal-spread');
 const turn=root.querySelector('.journal-turn');
 const fade=root.querySelector('.journal-crossfade');
 const front=turn.querySelector('.journal-front'),back=turn.querySelector('.journal-back');
 const status=document.querySelector('[data-journal-status]');
 const buttons=[...root.querySelectorAll('[data-journal-step]')];
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 const mobile=matchMedia('(max-width: 767px)');
 const cache=new Map(),loaded=new Set(),leaves=[];
 let index=0,busy=false,started=false,suppressClickUntil=0,gesture=null;
 const wrap=value=>(value%SPREADS.length+SPREADS.length)%SPREADS.length;
 function load(value){
  const target=wrap(value),source=SPREADS[target];
  if(cache.has(source))return cache.get(source);
  const promise=new Promise(resolve=>{
   const image=new Image();image.decoding='async';
   image.onload=()=>{loaded.add(source);resolve(true);};
   image.onerror=()=>{cache.delete(source);resolve(false);};
   image.src=source;
  });
  cache.set(source,promise);return promise;
 }
 function picture(container,value){
  const image=container.querySelector('.journal-image'),source=SPREADS[wrap(value)];
  if(loaded.has(source))image.setAttribute('src',source);else image.removeAttribute('src');
 }
 function pair(container,value){
  picture(container.querySelector('.journal-left'),value);
  picture(container.querySelector('.journal-right'),value);
 }
 function leafTransform(side,depth,extra=0){
  const direction=side==='left'?-1:1;
  const distance=(depth+1)*(mobile.matches?2.5:4.5)+extra;
  return `translateX(${direction*distance}px) translateZ(${-2*(depth+1)}px) rotateY(${-direction*(3+depth*2.3)}deg)`;
 }
 for(const side of ['left','right']){
  const stack=root.querySelector(`.journal-stack-${side}`);
  for(let depth=0;depth<4;depth++){
   const leaf=document.createElement('div');leaf.className='journal-stack-leaf';
   const image=document.createElement('img');image.className='journal-image';image.alt='';image.decoding='async';
   leaf.append(image);stack.append(leaf);leaf.style.opacity=String(1-depth*.13);
   leaves.push({element:leaf,side,depth});
  }
 }
 function fan(){
  leaves.forEach(({element,side,depth})=>{
   picture(element,index+(side==='left'?-1:1)*(depth+1));
   element.style.transform=leafTransform(side,depth);
  });
 }
 function paint(){pair(spread,index);fan();status.textContent=`Spread ${index+1} of ${SPREADS.length}`;}
 function neighbors(){
  // Only the current spread and its neighbors are fetched. Distant leaves keep
  // their quiet paper fill until navigation brings those images into range.
  Promise.all([load(index-1),load(index+1)]).then(()=>{if(!busy)fan();});
 }
 function setBusy(value){
  busy=value;root.setAttribute('aria-busy',String(value));
  buttons.forEach(button=>button.setAttribute('aria-disabled',String(value)));
 }
 function animate(element,keyframes,options){
  const animation=element.animate(keyframes,options);
  return animation;
 }
 async function step(direction){
  if(busy)return;
  setBusy(true);
  const target=wrap(index+direction),animations=[];
  if(!(await Promise.all([load(index),load(target)])).every(Boolean)){
   setBusy(false);status.textContent='This spread could not load. Please try again.';return;
  }
  try{
   const crossfade=motion.matches||mobile.matches;
   const duration=crossfade?180:800;
   if(crossfade){
    pair(fade,index);fade.hidden=false;
    pair(spread,target);
    animations.push(animate(fade,[{opacity:1},{opacity:0}],{duration,easing:'ease-in-out',fill:'forwards'}));
   }else{
    turn.classList.toggle('is-forward',direction>0);
    turn.classList.toggle('is-backward',direction<0);
    picture(front,index);picture(back,target);
    picture(spread.querySelector(direction>0?'.journal-right':'.journal-left'),target);
    turn.hidden=false;turn.style.willChange='transform';
    const angle=direction>0?-180:180;
    animations.push(animate(turn,[
     {transform:'translateZ(2px) rotateY(0deg)'},
     {offset:.5,transform:`translateZ(2px) rotateY(${angle*.5}deg) rotateX(${direction*.8}deg)`},
     {transform:`translateZ(2px) rotateY(${angle}deg)`}
    ],{duration,easing:'ease-in-out',fill:'forwards'}));
    turn.querySelectorAll('.journal-turn-shade').forEach(shade=>animations.push(animate(shade,[
     {opacity:0,transform:'translateX(-25%)'},
     {offset:.5,opacity:.24,transform:'translateX(0)'},
     {opacity:0,transform:'translateX(25%)'}
    ],{duration,easing:'ease-in-out'})));
   }
   if(!motion.matches)leaves.forEach(({element,side,depth})=>animations.push(animate(element,[
    {transform:leafTransform(side,depth)},
    {offset:.5,transform:leafTransform(side,depth,(depth+1)*.8)},
    {transform:leafTransform(side,depth)}
   ],{duration,easing:'ease-in-out'})));
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
  if(await load(index)){if(!busy)paint();neighbors();}
 }
 fan();
 if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{
   if(entries.some(entry=>entry.isIntersecting)){observer.disconnect();start();}
  },{rootMargin:'200px'});observer.observe(root);
 }else start();
})();
