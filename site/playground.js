// Browser-local experiments. Text and settings are never sent or saved.
const rotation=document.querySelector('#rotation');
const scale=document.querySelector('#scale');
function updateShape(){
 document.querySelector('#shape-group').setAttribute('transform',`translate(300 200) rotate(${rotation.value}) scale(${Number(scale.value)/100}) translate(-300 -200)`);
 document.querySelector('#rotation-value').textContent=`${rotation.value}°`;
 document.querySelector('#scale-value').textContent=`${scale.value}%`;
}
rotation.addEventListener('input',updateShape);scale.addEventListener('input',updateShape);
document.querySelector('#reset-shape').addEventListener('click',()=>{rotation.value=-15;scale.value=100;updateShape();});
function setPalette(id){
 const palette=window.portfolioContent.playground.palettes.find(p=>p.id===id);if(!palette)return;
 const stage=document.querySelector('#palette-stage');palette.colors.forEach((color,i)=>stage.style.setProperty(`--p${i}`,color));
 document.querySelectorAll('[data-palette-id]').forEach(button=>{const selected=button.dataset.paletteId===id;button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',String(selected));});
 const swatches=document.querySelector('#palette-swatches');swatches.replaceChildren();
 palette.colors.forEach(color=>{const item=document.createElement('span');const chip=document.createElement('i');chip.style.background=color;chip.setAttribute('aria-hidden','true');item.append(chip,document.createTextNode(color.toUpperCase()));swatches.append(item);});
 document.querySelector('#palette-status').textContent=`${palette.name} palette selected.`;
}
document.querySelectorAll('[data-palette-id]').forEach(button=>button.addEventListener('click',()=>setPalette(button.dataset.paletteId)));setPalette(window.portfolioContent.playground.palettes[0].id);
const words=document.querySelector('#type-text');const size=document.querySelector('#type-size');const spacing=document.querySelector('#type-spacing');const styleButton=document.querySelector('#type-style');
function updateType(){const preview=document.querySelector('#type-preview');preview.textContent=words.value;preview.style.fontSize=`${size.value}px`;preview.style.letterSpacing=`${spacing.value}px`;document.querySelector('#type-size-value').textContent=`${size.value}px`;document.querySelector('#type-spacing-value').textContent=`${spacing.value}px`;}
[words,size,spacing].forEach(input=>input.addEventListener('input',updateType));
styleButton.addEventListener('click',()=>{const italic=styleButton.getAttribute('aria-pressed')!=='true';styleButton.setAttribute('aria-pressed',String(italic));styleButton.textContent=italic?'Try roman':'Try italic';document.querySelector('#type-preview').style.fontStyle=italic?'italic':'normal';});
document.querySelector('#reset-type').addEventListener('click',()=>{words.value='Stay curious.';size.value=64;spacing.value=-2;styleButton.setAttribute('aria-pressed','false');styleButton.textContent='Try italic';document.querySelector('#type-preview').style.fontStyle='normal';updateType();});

// Masonry-gallery filters and accessible enlarged previews.
{
 const pins=[...document.querySelectorAll('.gallery-pin')];
 document.querySelectorAll('[data-gallery-filter]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-gallery-filter]').forEach(item=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-pressed',String(active));});
  pins.forEach(pin=>{pin.hidden=button.dataset.galleryFilter!=='all' && pin.dataset.category!==button.dataset.galleryFilter;});
  const count=pins.filter(pin=>!pin.hidden).length;document.querySelector('#gallery-count').textContent=`${count} ${count===1?'study':'studies'}`;
 }));
 const dialog=document.querySelector('#study-dialog');let trigger;
 const panels=[...document.querySelectorAll('#study-experiments .experiment')];
 document.querySelectorAll('[data-study-id]').forEach(button=>button.addEventListener('click',()=>{
  const study=window.portfolioContent.playground.studies.find(item=>item.id===button.dataset.studyId);
  trigger=button;document.querySelector('#study-dialog-title').textContent=study.title;
  const preview=button.querySelector('.pin-art').cloneNode(true);preview.querySelector('.pin-open')?.remove();document.querySelector('#study-preview').replaceChildren(preview);
  document.querySelector('.study-tools').open=false;
  const experimentId={color:'palette-title',form:'shape-title',type:'type-title'}[study.category];
  panels.forEach(panel=>panel.hidden=panel.getAttribute('aria-labelledby')!==experimentId);
  if(study.category==='color')setPalette(study.palette);
  if(study.category==='type'){words.value=study.words.replaceAll('\n',' ');updateType();}
  dialog.showModal();document.body.classList.add('dialog-open');document.querySelector('#close-study').focus();
 }));
 document.querySelector('#close-study').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{document.body.classList.remove('dialog-open');trigger?.focus();});
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const bounds=dialog.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)dialog.close();});
}
