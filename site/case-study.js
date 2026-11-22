// Section navigation is independent of the illustrative concept controls below.
{
 const navigation=document.querySelector('.case-contents');
 const intro=document.querySelector('.case-opening');
 const overviewHeading=document.querySelector('#case-headline');
 const header=document.querySelector('.header');
 const footer=document.querySelector('.site-footer');
 const links=[...document.querySelectorAll('.case-contents a[href^="#"]')];
 const targets=links.map(link=>document.querySelector(link.getAttribute('href')));
 let scheduled=false;
 function updateCurrentSection(){
  scheduled=false;
  if(!navigation || !intro)return;
  const mobile=window.matchMedia('(max-width: 700px)').matches;
  const headerBottom=Math.max(0,header?.getBoundingClientRect().bottom || 0);
  const introTop=intro.getBoundingClientRect().top;
  const viewportHeight=window.innerHeight;
  // On desktop, enter with the white introduction, never over the cover artwork.
  // Hide the rail as the shared full-width footer enters the viewport.
  const headingTop=overviewHeading?.getBoundingClientRect().top ?? introTop+54;
  const railTop=mobile?headerBottom:Math.max(headerBottom+24,headingTop-18);
  const beforeFooter=!footer || footer.getBoundingClientRect().top>=viewportHeight+80;
  const visible=beforeFooter&&(mobile?introTop<=headerBottom+1:introTop<viewportHeight-120);
  navigation.style.setProperty('--case-sidebar-top',`${Math.round(railTop)}px`);
  document.body.classList.toggle('case-sidebar-visible',visible);
  navigation.inert=!visible;
  navigation.setAttribute('aria-hidden',String(!visible));
  const threshold=mobile?headerBottom+148:Math.max(headerBottom+40,viewportHeight*.28);
  let current=0;
  targets.forEach((target,index)=>{if(target && target.getBoundingClientRect().top<=threshold)current=index;});
  links.forEach((link,index)=>{if(index===current)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
 }
 function scheduleUpdate(){if(!scheduled){scheduled=true;requestAnimationFrame(updateCurrentSection);}}
 window.addEventListener('scroll',scheduleUpdate,{passive:true});
 document.addEventListener('scroll',scheduleUpdate,{passive:true,capture:true});
 window.addEventListener('resize',scheduleUpdate);
 window.addEventListener('hashchange',scheduleUpdate);
 window.addEventListener('load',scheduleUpdate);
 window.addEventListener('pageshow',scheduleUpdate);
 updateCurrentSection();
}

// Temporary concept interactions; no data leaves this page.
document.querySelector('#case-interaction')?.addEventListener('click',event=>{
 const button=event.target.closest('button');if(!button)return;
 button.parentElement.querySelectorAll('button').forEach(item=>{item.setAttribute('aria-pressed',String(item===button));item.classList.toggle('selected',item===button);});
 const status=document.querySelector('.demo-status');
 if(button.dataset.resource)status.textContent=`${button.dataset.resource} selected. Real resource listings and verified campus information would be added after research.`;
 if(button.dataset.mood)status.textContent=button.dataset.mood;
 if(button.dataset.palette){document.querySelector('#case-demo-art').classList.toggle('alternate',button.dataset.palette==='alternate');status.textContent=button.dataset.palette==='alternate'?'Plum & lime palette selected.':'Cobalt & peach palette selected.';}
});

// Process images open in an accessible on-page card, with the shared View cursor.
{
 const dialog=document.querySelector('#aspect-image-dialog');
 const triggers=[...document.querySelectorAll('[data-preview-src]')];
 if(dialog && triggers.length){
  const image=dialog.querySelector('.aspect-preview-full');
  const title=dialog.querySelector('#aspect-preview-title');
  const finePointer=window.matchMedia('(hover:hover) and (pointer:fine)');
  const pill=document.createElement('span');
  pill.className='project-cursor-pill';pill.textContent='View';pill.setAttribute('aria-hidden','true');document.body.append(pill);
  let opener=null,previousOverflow='';
  const hideCursor=()=>pill.classList.remove('is-visible');
  triggers.forEach(trigger=>{
   trigger.addEventListener('pointermove',event=>{
    if(!finePointer.matches || dialog.open || event.pointerType==='touch')return;
    pill.style.left=`${event.clientX}px`;pill.style.top=`${event.clientY}px`;pill.classList.add('is-visible');
   });
   trigger.addEventListener('pointerleave',hideCursor);
   trigger.addEventListener('click',()=>{
    if(dialog.open)return;
    opener=trigger;hideCursor();image.src=trigger.dataset.previewSrc;image.alt=trigger.querySelector('img').alt;title.textContent=trigger.dataset.previewTitle;
    previousOverflow=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';dialog.showModal();
   });
  });
  dialog.querySelector('.aspect-preview-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{
   if(event.target!==dialog)return;
   const rect=dialog.getBoundingClientRect();
   if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();
  });
  dialog.addEventListener('close',()=>{document.documentElement.style.overflow=previousOverflow;opener?.focus({preventScroll:true});});
  window.addEventListener('blur',hideCursor);
  window.addEventListener('scroll',hideCursor,{passive:true});
 }
}
