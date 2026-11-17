// Match the homepage: type the heading, then reveal the supporting copy in order.
(()=>{
 const copy=document.querySelector('.about-landing-copy');
 const heading=copy?.querySelector('#about-heading');
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 if(!heading||motion.matches)return;
 const text=heading.textContent;
 const segmenter=typeof Intl.Segmenter==='function'?new Intl.Segmenter('en',{granularity:'grapheme'}):null;
 const characters=segmenter?[...segmenter.segment(text)].map(part=>part.segment):Array.from(text);
 const units=characters.map(character=>{
  const span=document.createElement('span');span.className='about-type-unit';
  span.textContent=character;span.setAttribute('aria-hidden','true');return span;
 });
 heading.setAttribute('aria-label',text);heading.replaceChildren(...units);
 const paragraphs=[...copy.querySelectorAll('.about-lead,.intro-paragraphs p')];
 paragraphs.forEach((paragraph,index)=>{
  paragraph.classList.add('about-entry-target');
  paragraph.style.setProperty('--about-entry-delay',`${index*120}ms`);
 });
 copy.classList.add('about-entry-pending');heading.classList.add('about-is-typing');
 let index=0,timer=0,current=null,done=false;
 function finish(immediate=false){
  if(done)return;
  done=true;clearTimeout(timer);current?.classList.remove('about-type-current');
  if(immediate)copy.classList.add('about-entry-instant');
  heading.textContent=text;heading.classList.remove('about-is-typing');
  copy.classList.remove('about-entry-pending');
  document.removeEventListener('keydown',onKey);
  document.removeEventListener('visibilitychange',onVisibility);
  motion.removeEventListener('change',onMotion);
  window.removeEventListener('pagehide',onExit);
  window.removeEventListener('resize',onExit);
 }
 function next(){
  if(index===units.length){timer=setTimeout(()=>finish(),200);return;}
  const unit=units[index++];unit.classList.add('is-typed');
  if(unit.textContent.trim()){
   current?.classList.remove('about-type-current');current=unit;
   current.classList.add('about-type-current');
  }
  timer=setTimeout(next,/[,.!?]/.test(unit.textContent)?90:unit.textContent===' '?44:65);
 }
 function onKey(event){if(event.key==='Tab'||event.key==='Escape')finish(true);}
 function onVisibility(){if(document.hidden)finish(true);}
 function onMotion(event){if(event.matches)finish(true);}
 function onExit(){finish(true);}
 document.addEventListener('keydown',onKey);
 document.addEventListener('visibilitychange',onVisibility);
 motion.addEventListener('change',onMotion);
 window.addEventListener('pagehide',onExit);
 window.addEventListener('resize',onExit);
 timer=setTimeout(next,100);
})();
