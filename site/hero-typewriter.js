// Type the words first; then let the pills expand into the centered lines.
(() => {
 const heading=document.querySelector('.modern-hero #hero-title');
 const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
 if(!heading || motion.matches)return;
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
 function finish(){
  if(complete)return;
  complete=true;clearTimeout(timer);pillTimers.forEach(clearTimeout);
  current?.classList.remove('type-current');
  steps.forEach(step=>step.element.classList.add('is-typed'));
  pills.forEach(pill=>{pill.classList.remove('typing-pending');pill.inert=false;});
  heading.classList.remove('is-typing','is-entering');
  document.removeEventListener('keydown',onKey);
  document.removeEventListener('visibilitychange',onVisibility);
  window.removeEventListener('resize',finish);
  motion.removeEventListener?.('change',onMotion);
 }
 function onKey(event){if(event.key==='Tab' || event.key==='Escape')finish();}
 function onMotion(event){if(event.matches)finish();}
 function onVisibility(){if(document.hidden)finish();}
 function revealPills(){
  if(complete)return;
  current?.classList.remove('type-current');heading.classList.remove('is-typing');
  pills.forEach((pill,pillIndex)=>{
   pillTimers.push(setTimeout(()=>{if(!complete)pill.classList.remove('typing-pending');},pillIndex*100));
  });
  timer=setTimeout(finish,Math.max(0,pills.length-1)*100+720);
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
