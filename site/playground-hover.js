// Wobble the image in its own layer while the outer card follows the curve.
(()=>{
 const viewport=document.querySelector('.arc-viewport');
 if(!viewport)return;
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 const hover=matchMedia('(hover: hover)');
 const animations=new Map();
 function stop(button){animations.get(button)?.cancel();animations.delete(button);}
 viewport.querySelectorAll('.pin-button').forEach(button=>{
  const art=button.querySelector('.pin-art');
  button.addEventListener('pointerenter',event=>{
   if(motion.matches||!hover.matches||event.pointerType!=='mouse'||event.buttons||viewport.classList.contains('is-dragging'))return;
   stop(button);
   const bounds=button.getBoundingClientRect();
   const direction=event.clientX<bounds.left+bounds.width/2?1:-1;
   const poses=[[0,0],[.30,14],[.61,-4],[.83,1.5],[1,0]];
   const animation=art.animate(poses.map(([offset,angle])=>({
    offset,transform:`perspective(1400px) rotateY(${angle*direction}deg)`,easing:'cubic-bezier(.4,0,.2,1)'
   })),{duration:1000,iterations:1});
   animations.set(button,animation);
   animation.onfinish=()=>{if(animations.get(button)===animation)animations.delete(button);};
  });
  // Clicking or dragging takes precedence over the decorative wobble.
  button.addEventListener('pointerdown',()=>stop(button));
 });
 function stopAll(){animations.forEach(animation=>animation.cancel());animations.clear();}
 motion.addEventListener('change',event=>{if(event.matches)stopAll();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAll();});
 window.addEventListener('pagehide',stopAll);
})();

// Reuse the case-study cursor pill without interrupting artwork dragging.
(()=>{
 const viewport=document.querySelector('.arc-viewport');
 if(!viewport)return;
 const finePointer=matchMedia('(hover:hover) and (pointer:fine)');
 const pill=document.createElement('span');
 pill.className='project-cursor-pill';
 pill.textContent='View';
 pill.setAttribute('aria-hidden','true');
 document.body.append(pill);
 let pressed=false;
 const hide=()=>pill.classList.remove('is-visible');
 const follow=event=>{
  if(!finePointer.matches||event.pointerType!=='mouse'||pressed||event.buttons||document.querySelector('#study-dialog[open]'))return hide();
  pill.style.left=`${Math.max(40,Math.min(innerWidth-40,event.clientX))}px`;
  pill.style.top=`${Math.max(24,Math.min(innerHeight-24,event.clientY))}px`;
  pill.classList.add('is-visible');
 };
 viewport.querySelectorAll('.pin-button').forEach(button=>{
  button.addEventListener('pointerenter',follow);
  button.addEventListener('pointermove',follow);
  button.addEventListener('pointerleave',hide);
  button.addEventListener('pointerdown',()=>{pressed=true;hide();});
  button.addEventListener('click',hide);
 });
 window.addEventListener('pointerup',()=>{pressed=false;});
 window.addEventListener('pointercancel',()=>{pressed=false;hide();});
 window.addEventListener('scroll',hide,{passive:true});
 window.addEventListener('blur',()=>{pressed=false;hide();});
 document.addEventListener('visibilitychange',hide);
 finePointer.addEventListener('change',hide);
})();
