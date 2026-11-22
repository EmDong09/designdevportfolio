// Section navigation is independent of the illustrative concept controls below.
{
 const navigation=document.querySelector('.case-contents');
 const intro=document.querySelector('.case-opening');
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
  const railTop=Math.max(headerBottom+24,introTop+36);
  const beforeFooter=!footer || footer.getBoundingClientRect().top>=viewportHeight+80;
  const visible=beforeFooter&&(mobile?introTop<=headerBottom+1:introTop<viewportHeight-120);
  navigation.style.setProperty('--case-sidebar-top',`${Math.round(railTop)}px`);
  document.body.classList.toggle('case-sidebar-visible',visible);
  navigation.inert=!visible;
  navigation.setAttribute('aria-hidden',String(!visible));
  const threshold=mobile?headerBottom+148:Math.max(headerBottom+40,viewportHeight*.28);
  let current=0;
  targets.forEach((target,index)=>{if(target && target.getBoundingClientRect().top<=threshold)current=index;});
  const designActive=targets[current]?.id==='design'||targets[current]?.id.startsWith('design-');
  document.body.classList.toggle('case-design-active',Boolean(designActive));
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
