import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const source=await readFile(new URL('../site/about-flipbook.js',import.meta.url),'utf8');
class Element{
 constructor(classes=''){this.classes=new Set(classes.split(' '));this.children=[];this.attributes={};this.events={};this.style={};this.dataset={};this.hidden=false;this.textContent='';this.classList={contains:c=>this.classes.has(c),toggle:(c,on)=>on?this.classes.add(c):this.classes.delete(c)};}
 set className(value){this.classes=new Set(value.split(' '));}
 setAttribute(key,value){this.attributes[key]=value;}
 removeAttribute(key){delete this.attributes[key];}
 append(child){child.parent=this;this.children.push(child);}
 remove(){if(this.parent)this.parent.children=this.parent.children.filter(child=>child!==this);}
 querySelectorAll(selector){return this.children.flatMap(child=>[...(selector.startsWith('.')?child.classes.has(selector.slice(1)):selector==='[data-journal-step]'&&child.dataset.journalStep)?[child]:[],...child.querySelectorAll(selector)]);}
 querySelector(selector){return this.querySelectorAll(selector)[0];}
 addEventListener(type,callback){this.events[type]=callback;}
}
const add=(parent,classes)=>{const element=new Element(classes);parent.append(element);return element;};
const image=parent=>add(parent,'journal-image');
const pair=parent=>{image(add(parent,'journal-page journal-left'));image(add(parent,'journal-page journal-right'));};
const flush=async()=>{for(let i=0;i<6;i++)await new Promise(resolve=>setImmediate(resolve));};
async function setup({reduced=false,mobile=false,observe=false}={}){
 const root=new Element(),scene=add(root,'journal-scene');
 add(scene,'journal-stack journal-stack-left');add(scene,'journal-stack journal-stack-right');
 pair(add(scene,'journal-spread'));
 const turn=add(scene,'journal-turn');turn.hidden=true;
 const front=add(turn,'journal-face journal-front'),back=add(turn,'journal-face journal-back');
 for(const face of [front,back]){image(face);add(face,'journal-turn-shade');}
 const fade=add(scene,'journal-crossfade');fade.hidden=true;pair(fade);
 for(const direction of [-1,1,-1,1]){const button=add(root,'zone');button.dataset.journalStep=String(direction);}
 const status=new Element(),requests=new Set(),animations=[];
 Element.prototype.animate=function(frames,options){let complete;const finished=new Promise(resolve=>complete=resolve);const animation={element:this,frames,options,finished,complete,cancel(){}};animations.push(animation);return animation;};
 const observers=[];
 class Observer{constructor(callback,options){this.callback=callback;this.options=options;observers.push(this);}observe(){}disconnect(){this.disconnected=true;}}
 const windowEvents={};
 const context={IntersectionObserver:Observer,window:{IntersectionObserver:Observer,scrollY:0,addEventListener:(event,callback)=>windowEvents[event]=callback,removeEventListener:event=>delete windowEvents[event]},document:{querySelector:selector=>selector==='[data-flipbook]'?root:status,createElement:()=>new Element()},matchMedia:query=>({matches:query.includes('reduced-motion')?reduced:mobile,addEventListener(){}}),Image:class{set src(value){requests.add(value);queueMicrotask(()=>this.onload());}},performance:{now:()=>1000}};
 vm.runInNewContext(source,context);await flush();

 const next=()=>root.querySelectorAll('[data-journal-step]')[1].events.click();
 const previous=()=>root.querySelectorAll('[data-journal-step]')[0].events.click();
 const finish=async()=>{animations.splice(0).forEach(animation=>animation.complete());await flush();};
 return {root,turn,fade,front,back,status,requests,animations,next,previous,finish,observers,scroll:y=>{context.window.scrollY=y;windowEvents.scroll?.();}};
}
const book=await setup();
const fixedPages=book.root.querySelectorAll('.journal-stack-leaf').map(element=>({element,src:element.querySelector('.journal-image').attributes.src}));
assert.equal(book.requests.size,3,'The middle spread preloads only its adjacent photos');
assert.equal(book.animations.length,0,'The book is already open, with no entrance animation');
assert.match(book.root.querySelector('.journal-spread').querySelector('.journal-image').attributes.src,/spread-06/,'The restaurant photo is the default middle spread');
assert.equal(book.status.textContent,'Spread 5 of 10','Open in the middle of the finite book');
for(const side of ['left','right'])assert(book.root.querySelector(`.journal-stack-${side}`).querySelectorAll('.journal-stack-leaf').some(leaf=>!leaf.hidden),'The middle has page bundles on both sides');
for(let i=0;i<4;i++){book.previous();await flush();await book.finish();}
assert(book.root.querySelector('.journal-stack-left').querySelectorAll('.journal-stack-leaf').every(leaf=>leaf.hidden),'No previous pages exist at the start');
assert.equal(book.root.querySelectorAll('.journal-stack-leaf').length,20,'A stable page node for every photo on each side');
book.previous();await flush();assert.equal(book.animations.length,0,'Previous is inert at the first spread');
book.next();book.next();await flush();
assert.equal(book.turn.querySelectorAll('.journal-hinge').length,10,'The flexible leaf uses a connected hinge chain');
const panels=book.turn.querySelectorAll('.journal-panel-image');
assert.match(panels[0].attributes.src,/spread-01/);
assert.match(panels[1].attributes.src,/spread-02/);
assert.equal(panels[0].style.left,'calc(-10 * 5cqw)','Front starts at the old right half near the spine');
assert.equal(panels[1].style.left,'calc(-9 * 5cqw)','Back starts at the new left half near the spine');
const rightLeaf=book.root.querySelector('.journal-stack-right').querySelectorAll('.journal-stack-leaf').find(leaf=>!leaf.hidden);
const stackAdvance=book.animations.find(animation=>animation.element===rightLeaf);
assert.notEqual(stackAdvance.frames[0].transform,stackAdvance.frames.at(-1).transform,'Upcoming leaves advance inward by one slot');
assert.equal(book.root.attributes['aria-busy'],'true');
assert.match(book.front.querySelector('.journal-image').attributes.src,/spread-01/);
assert.match(book.back.querySelector('.journal-image').attributes.src,/spread-02/);
assert.equal(book.front.querySelector('.journal-image').style.objectPosition,'0% 50%');
assert.equal(book.back.querySelector('.journal-image').style.objectPosition,'50% 87%');
assert(book.turn.classes.has('is-forward'));assert.equal(book.animations[0].options.duration,460);
assert.match(book.animations[0].frames[0].transform,/rotateY\(-10deg\)/,'Turn starts at the resting right-page angle');
assert.match(book.animations[0].frames.at(-1).transform,/rotateY\(-170deg\)/,'Turn ends at the resting left-page angle');
await book.finish();assert.equal(book.status.textContent,'Spread 2 of 10','Busy clicks must be ignored');
fixedPages.forEach(({element,src})=>assert.equal(element.querySelector('.journal-image').attributes.src,src,'A background page never swaps its photo during a turn'));
assert.equal(stackAdvance.element.style.transform,stackAdvance.frames.at(-1).transform,'Stack resting pose exactly matches its animation endpoint');
const restingLeft=book.root.querySelector('.journal-stack-left').querySelectorAll('.journal-stack-leaf');
assert.equal(restingLeft.length,10,'The stack retains the same physical page nodes');
assert.equal(restingLeft.filter(leaf=>!leaf.hidden).length,1,'Exactly one previous photo is exposed');
assert.match(restingLeft[0].querySelector('.journal-image').attributes.src,/spread-01/,'The old open spread becomes the nearest previous page');
assert.equal(restingLeft[1].hidden,true,'Only one previous page exists after the first turn');
book.previous();await flush();assert(book.turn.classes.has('is-backward'));
await book.finish();assert.equal(book.status.textContent,'Spread 1 of 10');
book.previous();await flush();assert.equal(book.animations.length,0,'Going back at the beginning never wraps');
for(let i=1;i<10;i++){book.next();await flush();await book.finish();}
assert.equal(book.status.textContent,'Spread 10 of 10');
assert(book.root.querySelector('.journal-stack-right').querySelectorAll('.journal-stack-leaf').every(leaf=>leaf.hidden),'No upcoming pages exist at the end');
book.next();await flush();assert.equal(book.animations.length,0,'The end never wraps back to the beginning');
book.root.events.keydown({key:'ArrowLeft',preventDefault(){}});await flush();await book.finish();assert.equal(book.status.textContent,'Spread 9 of 10','Arrow keys turn backward');
book.root.events.pointerdown({pointerType:'touch',pointerId:1,clientX:200,clientY:100});
book.root.events.pointerup({pointerId:1,clientX:100,clientY:110});await flush();await book.finish();assert.equal(book.status.textContent,'Spread 10 of 10','Horizontal swipe advances');
for(const config of [{reduced:true},{mobile:true}]){
 const journal=await setup(config);journal.next();await flush();
 assert.equal(journal.turn.hidden,true);assert.equal(journal.fade.hidden,false);
 assert.equal(journal.animations[0].options.duration,180);
 if(config.reduced)assert(journal.animations.every(animation=>animation.frames.every(frame=>!('transform' in frame))),'Reduced motion must only crossfade');
 await journal.finish();assert.equal(journal.status.textContent,'Spread 6 of 10');
}
console.log('Flipbook checks passed: face continuity, locked turns, finite boundaries, default spread, arrows, swipe, lazy neighbors, mobile, and reduced motion.');
