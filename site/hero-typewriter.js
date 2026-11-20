// Type the words first; then let the pills expand into the centered lines.
(() => {
 const heading=document.querySelector('.modern-hero #hero-title');
 const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
 const navigationType=window.performance?.getEntriesByType('navigation')[0]?.type;
 const isReload=navigationType==='reload';
 let returningHome=false,internalReferrer=false,replayIntro=false;
 try{
  replayIntro=sessionStorage.getItem('emily-portfolio:replay-intro')==='1';
  sessionStorage.removeItem('emily-portfolio:replay-intro');
  returningHome=sessionStorage.getItem('emily-portfolio:skip-intro')==='1';
  sessionStorage.removeItem('emily-portfolio:skip-intro');
 }catch{}
 try{internalReferrer=Boolean(document.referrer) && new URL(document.referrer).origin===window.location.origin;}catch{}
 const internalReturn=!isReload && (returningHome || internalReferrer || navigationType==='back_forward');
 const projectJump=window.location.hash && window.location.hash!=='#top';
 if(!heading || projectJump || (!replayIntro && internalReturn) || motion.matches)return;
 const subtitle=heading.querySelector('.hero-subtitle');
 const description=document.querySelector('.modern-hero .hero-description');
 description?.classList.add('hero-description-pending');
 const restOfPage=[...document.querySelectorAll('.home-page > .header, .home-page #projects > .project, .home-page > footer'),...(subtitle?[subtitle]:[])];
 restOfPage.forEach(element=>element.classList.add('home-entry-target'));
 document.body.classList.add('home-entry-pending');
 function revealPage(){
  description?.classList.remove('hero-description-pending');
  document.body.classList.remove('home-entry-pending');
 }
 const lines=[...heading.querySelectorAll('.hero-name')];
 const accessibleText=lines.map(line=>{
  const copy=line.cloneNode(true);
  copy.querySelectorAll('.intro-capsule').forEach(pill=>pill.remove());
  return copy.textContent;
 }).join(' ').replace(/\s+/g,' ').replace(/\s+([,.!?])/g,'$1').trim();
 heading.setAttribute('aria-label',`${accessibleText} ${subtitle?.textContent || ''}`.trim());
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
 const lineSteps=lines.map(line=>{
  const start=steps.length;prepare(line);
  const units=steps.slice(start);
  if(line.classList.contains('hero-name')){
   units.filter(step=>!step.character.trim()).forEach(step=>step.element.classList.add('is-typed'));
   return units.filter(step=>step.character.trim());
  }
  return units;
 });
 // A slower character cadence; the subtitle fades in with the pills.
 let elapsed=0;
 const typingEvents=lineSteps.flatMap((units,line)=>{
  return units.map(step=>{
   const event={...step,line,at:elapsed};
   elapsed+=/[,.!?]/.test(step.character)?90:step.character===' '?44:65;
   return event;
  });
 });
 const lineCarets=new Map();
 function clearCarets(){lineCarets.forEach(element=>element.classList.remove('type-current'));lineCarets.clear();}
 let timer=0,index=0,complete=false;
 function finish(immediate=false){
  if(complete)return;
  complete=true;clearTimeout(timer);pillTimers.forEach(clearTimeout);
  if(immediate)document.body.classList.add('home-entry-instant');
  clearCarets();
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
  clearCarets();heading.classList.remove('is-typing');
  pillTimers.push(setTimeout(()=>{
   if(complete)return;
   pills.forEach(pill=>{pill.classList.remove('typing-pending');pill.inert=false;});
   revealPage();
  },80));
  timer=setTimeout(finish,1500);
 }
 function typeNext(){
  if(complete)return;
  if(index>=typingEvents.length){timer=setTimeout(revealPills,450);return;}
  const at=typingEvents[index].at;
  while(index<typingEvents.length&&typingEvents[index].at===at){
   const step=typingEvents[index++];step.element.classList.add('is-typed');
   if(step.character.trim()){
    lineCarets.get(step.line)?.classList.remove('type-current');
    lineCarets.set(step.line,step.element);step.element.classList.add('type-current');
   }
  }
  timer=setTimeout(typeNext,index<typingEvents.length?typingEvents[index].at-at:0);
 }
 heading.classList.add('is-entering','is-typing');
 document.addEventListener('keydown',onKey);
 document.addEventListener('visibilitychange',onVisibility);
 window.addEventListener('resize',finish,{once:true});
 motion.addEventListener?.('change',onMotion);
 window.addEventListener('pagehide',finish,{once:true});
 timer=setTimeout(typeNext,100);
})();
