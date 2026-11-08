// Type the words first; then let the pills expand into the centered lines.
(() => {
 const heading=document.querySelector('.modern-hero #hero-title');
 const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
 const navigationType=window.performance?.getEntriesByType('navigation')[0]?.type;
 const isReload=navigationType==='reload';
 let returningHome=false,internalReferrer=false;
 try{
  returningHome=sessionStorage.getItem('emily-portfolio:skip-intro')==='1';
  sessionStorage.removeItem('emily-portfolio:skip-intro');
 }catch{}
 try{internalReferrer=Boolean(document.referrer) && new URL(document.referrer).origin===window.location.origin;}catch{}
 const internalReturn=!isReload && (returningHome || internalReferrer || navigationType==='back_forward');
 const projectJump=!isReload && window.location.hash && window.location.hash!=='#top';
 if(!heading || internalReturn || projectJump || motion.matches)return;
 const description=document.querySelector('.modern-hero .hero-description');
 description?.classList.add('hero-description-pending');
 const restOfPage=[...document.querySelectorAll('.home-page > .header, .home-page #projects > .project, .home-page > footer')];
 let contentIndex=0;
 restOfPage.forEach(element=>{
  element.classList.add('home-entry-target');
  const delay=element.matches('.header')?0:420+contentIndex++*120;
  element.style.setProperty('--home-entry-delay',`${delay}ms`);
 });
 const cascadeEnd=420+Math.max(0,contentIndex-1)*120+500;
 document.body.classList.add('home-entry-pending');
 function revealPage(){
  description?.classList.remove('hero-description-pending');
  document.body.classList.remove('home-entry-pending');
 }
 const lines=[...heading.querySelectorAll('.hero-line')];
 const accessibleText=lines.map(line=>{
  const copy=line.cloneNode(true);
  copy.querySelectorAll('.intro-capsule').forEach(pill=>pill.remove());
  return copy.textContent;
 }).join(' ').replace(/\s+/g,' ').replace(/\s+([,.!?])/g,'$1').trim();
 heading.setAttribute('aria-label',accessibleText);
 const steps=[],pills=[],pillTimers=[];
 const segmenter=typeof Intl.Segmenter==='function'?new Intl.Segmenter('en',{granularity:'grapheme'}):null;
 function prepare(parent){
  [...parent.childNodes].forEach(node=>{
   if(node.nodeType===Node.TEXT_NODE){
    const fragment=document.createDocumentFragment();
    const characters=segmenter?[...segmenter.segment(node.textContent)].map(part=>part.segment):Array.from(node.textContent);
    characters.forEach(character=>{
     const span=document.createElement('span');
     span.className='type-unit';span.textContent=character;span.setAttribute('aria-hidden','true');
     fragment.append(span);steps.push({element:span,character});
    });
    node.replaceWith(fragment);
   }else if(node.nodeType===Node.ELEMENT_NODE){
    if(node.matches('.intro-capsule')){
     node.style.setProperty('--capsule-width',`${node.offsetWidth}px`);
     node.classList.add('typing-pending');node.inert=true;pills.push(node);
    }else prepare(node);
   }
  });
 }
 lines.forEach(line=>{prepare(line);if(steps.length)steps[steps.length-1].lineEnd=true;});
 let timer=0,index=0,current=null,complete=false;
 function finish(immediate=false){
  if(complete)return;
  complete=true;clearTimeout(timer);pillTimers.forEach(clearTimeout);
  if(immediate)document.body.classList.add('home-entry-instant');
  current?.classList.remove('type-current');
  steps.forEach(step=>step.element.classList.add('is-typed'));
  pills.forEach(pill=>{pill.classList.remove('typing-pending');pill.inert=false;});
  heading.classList.remove('is-typing','is-entering');
  revealPage();
  document.removeEventListener('keydown',onKey);
  document.removeEventListener('visibilitychange',onVisibility);
  window.removeEventListener('resize',finish);
  motion.removeEventListener?.('change',onMotion);
 }
 function onKey(event){if(event.key==='Tab' || event.key==='Escape')finish(true);}
 function onMotion(event){if(event.matches)finish(true);}
 function onVisibility(){if(document.hidden)finish(true);}
 function revealPills(){
  if(complete)return;
  current?.classList.remove('type-current');heading.classList.remove('is-typing');
  revealPage();
  pills.forEach((pill,pillIndex)=>{
   pillTimers.push(setTimeout(()=>{if(!complete){pill.classList.remove('typing-pending');pill.inert=false;}},80+pillIndex*100));
  });
  timer=setTimeout(finish,Math.max(cascadeEnd,Math.max(0,pills.length-1)*100+800));
 }
 function typeNext(){
  if(complete)return;
  if(index>=steps.length){timer=setTimeout(revealPills,200);return;}
  const step=steps[index++];step.element.classList.add('is-typed');
  if(step.character.trim()){current?.classList.remove('type-current');current=step.element;current.classList.add('type-current');}
  const delay=/[,.!?]/.test(step.character)?40:step.character===' '?19:27;
  timer=setTimeout(typeNext,delay);
 }
 heading.classList.add('is-entering','is-typing');
 document.addEventListener('keydown',onKey);
 document.addEventListener('visibilitychange',onVisibility);
 window.addEventListener('resize',finish,{once:true});
 motion.addEventListener?.('change',onMotion);
 window.addEventListener('pagehide',finish,{once:true});
 timer=setTimeout(typeNext,100);
})();
