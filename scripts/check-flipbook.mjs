import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const source=await readFile(new URL('../site/about-flipbook.js',import.meta.url),'utf8');
class Element{
 constructor(classes=''){this.classes=new Set(classes.split(' '));this.children=[];this.attributes={};this.events={};this.style={};this.dataset={};this.hidden=false;this.textContent='';this.classList={toggle:(c,on)=>on?this.classes.add(c):this.classes.delete(c)};}
 set className(value){this.classes=new Set(value.split(' '));}
 setAttribute(key,value){this.attributes[key]=value;}
 removeAttribute(key){delete this.attributes[key];}
 append(child){this.children.push(child);}
 querySelectorAll(selector){return this.children.flatMap(child=>[...(selector.startsWith('.')?child.classes.has(selector.slice(1)):selector==='[data-journal-step]'&&child.dataset.journalStep)?[child]:[],...child.querySelectorAll(selector)]);}
 querySelector(selector){return this.querySelectorAll(selector)[0];}
 addEventListener(type,callback){this.events[type]=callback;}
}
const add=(parent,classes)=>{const element=new Element(classes);parent.append(element);return element;};
const image=parent=>add(parent,'journal-image');
const pair=parent=>{image(add(parent,'journal-page journal-left'));image(add(parent,'journal-page journal-right'));};
const flush=async()=>{for(let i=0;i<6;i++)await new Promise(resolve=>setImmediate(resolve));};
async function setup({reduced=false,mobile=false}={}){
 const root=new Element(),scene=add(root,'journal-scene');
 add(scene,'journal-stack journal-stack-left');add(scene,'journal-stack journal-stack-right');
 pair(add(scene,'journal-spread'));
 const turn=add(scene,'journal-turn');turn.hidden=true;
 const front=add(turn,'journal-face journal-front'),back=add(turn,'journal-face journal-back');
 for(const face of [front,back]){image(face);add(face,'journal-turn-shade');}
 const fade=add(scene,'journal-crossfade');fade.hidden=true;pair(fade);
 for(const direction of [-1,1,-1,1]){const button=add(root,'zone');button.dataset.journalStep=String(direction);}
 const status=new Element(),requests=new Set(),animations=[];
 Element.prototype.animate=function(frames,options){let complete;const finished=new Promise(resolve=>complete=resolve);const animation={frames,options,finished,complete,cancel(){}};animations.push(animation);return animation;};
 const context={window:{},document:{querySelector:selector=>selector==='[data-flipbook]'?root:status,createElement:()=>new Element()},matchMedia:query=>({matches:query.includes('reduced-motion')?reduced:mobile,addEventListener(){}}),Image:class{set src(value){requests.add(value);queueMicrotask(()=>this.onload());}},performance:{now:()=>1000}};
 vm.runInNewContext(source,context);await flush();
 const next=()=>root.querySelectorAll('[data-journal-step]')[1].events.click();
 const previous=()=>root.querySelectorAll('[data-journal-step]')[0].events.click();
 const finish=async()=>{animations.splice(0).forEach(animation=>animation.complete());await flush();};
 return {root,turn,fade,front,back,status,requests,animations,next,previous,finish};
}
const book=await setup();
assert.equal(book.requests.size,3,'Only current and adjacent spreads should preload');
assert.equal(book.root.querySelectorAll('.journal-stack-leaf').length,8,'Four subtle leaves per side');
book.next();book.next();await flush();
assert.equal(book.root.attributes['aria-busy'],'true');
assert.match(book.front.querySelector('.journal-image').attributes.src,/spread-01/);
assert.match(book.back.querySelector('.journal-image').attributes.src,/spread-02/);
assert(book.turn.classes.has('is-forward'));assert.equal(book.animations[0].options.duration,800);
await book.finish();assert.equal(book.status.textContent,'Spread 2 of 8','Busy clicks must be ignored');
book.previous();await flush();assert(book.turn.classes.has('is-backward'));
await book.finish();assert.equal(book.status.textContent,'Spread 1 of 8');
book.previous();await flush();await book.finish();assert.equal(book.status.textContent,'Spread 8 of 8','Back wraps to last spread');
book.root.events.keydown({key:'ArrowRight',preventDefault(){}});await flush();await book.finish();assert.equal(book.status.textContent,'Spread 1 of 8','Arrow keys wrap forward');
book.root.events.pointerdown({pointerType:'touch',pointerId:1,clientX:200,clientY:100});
book.root.events.pointerup({pointerId:1,clientX:100,clientY:110});await flush();await book.finish();assert.equal(book.status.textContent,'Spread 2 of 8','Horizontal swipe advances');
for(const config of [{reduced:true},{mobile:true}]){
 const journal=await setup(config);journal.next();await flush();
 assert.equal(journal.turn.hidden,true);assert.equal(journal.fade.hidden,false);
 assert.equal(journal.animations[0].options.duration,180);
 if(config.reduced)assert(journal.animations.every(animation=>animation.frames.every(frame=>!('transform' in frame))),'Reduced motion must only crossfade');
 await journal.finish();assert.equal(journal.status.textContent,'Spread 2 of 8');
}
console.log('Flipbook checks passed: face continuity, locked turns, wraparound, arrows, swipe, lazy neighbors, mobile, and reduced motion.');
