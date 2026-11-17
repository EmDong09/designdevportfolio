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
