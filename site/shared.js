// Wordmark navigation always opens the full landing view, without an anchor offset.
{
 try{
  const home=location.pathname==='/'||location.pathname==='/index.html';
  if(home&&sessionStorage.getItem('emily-portfolio:home-top')==='1'){
   sessionStorage.removeItem('emily-portfolio:home-top');
   history.scrollRestoration='manual';
   const top=()=>window.scrollTo({top:0,left:0,behavior:'instant'});
   top();
   window.addEventListener('load',top,{once:true});
  }
 }catch{}
}

// The wordmark explicitly replays the homepage entrance, including from home itself.
{
 const wordmark=document.querySelector('.header .wordmark');
 wordmark?.addEventListener('click',event=>{
  if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  try{
   sessionStorage.removeItem('emily-portfolio:skip-intro');
   sessionStorage.setItem('emily-portfolio:replay-intro','1');
   sessionStorage.setItem('emily-portfolio:home-top','1');
  }catch{}
  if(window.location.pathname==='/'||window.location.pathname==='/index.html'){
   event.preventDefault();
   history.replaceState(null,'','/');
   window.scrollTo({top:0,left:0,behavior:'instant'});
   window.location.reload();
  }
 });
}

// Shared optional navigation, contact destinations, and footer behavior.
{
  const { email, linkedin, resume } = window.portfolioContent;
  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();
  const details = document.querySelector('#contact-details');
  if (details && (email || linkedin)) {
    const links = [];
    if (email) { const link = document.createElement('a'); link.href = `mailto:${email}`; link.textContent = email; links.push(link); }
    if (linkedin) { const link = document.createElement('a'); link.href = linkedin; link.textContent = 'LinkedIn ↗'; links.push(link); }
    details.replaceChildren();
    links.forEach((link, index) => { if (index) details.append(' · '); details.append(link); });
  }
  if (resume) {
    const link = document.createElement('a');
    link.href = /^(https?:\/\/|\/)/.test(resume) ? resume : `/${resume.replace(/^\.\//, '')}`;
    link.textContent = 'Resume ↗';
    document.querySelector('nav')?.append(link);
  }
}

// Keep pending contact destinations as text until real links are supplied.
{
 const content=window.portfolioContent;
 const emailLink=document.querySelector('[data-footer-email]');
 if(emailLink && content.email){
  let resetTimer;
  emailLink.addEventListener('click',async()=>{
   const status=document.querySelector('[data-footer-copy-status]');
   clearTimeout(resetTimer);
   try{
    await navigator.clipboard.writeText(content.email);
    emailLink.textContent='Copied!';
    if(status)status.textContent='Email address copied to clipboard.';
   }catch{
    emailLink.textContent=content.email;
    if(status)status.textContent='Unable to copy automatically. Email address: '+content.email;
   }
   resetTimer=setTimeout(()=>{emailLink.textContent='Email';if(status)status.textContent='';},3000);
  });
 }
 document.querySelectorAll('[data-footer-link]').forEach(placeholder=>{
  const url=content[placeholder.dataset.footerLink];
  if(!url)return;
  const link=document.createElement('a');
  link.href=url;
  link.textContent=placeholder.textContent;
  placeholder.replaceWith(link);
 });
}

// The landing view has no active page; Work becomes active at the project anchor.
{
 if(window.location.pathname==='/' || window.location.pathname==='/index.html'){
  const workLink=document.querySelector('.header nav a[href="/#work"]');
  function updateHomeNavigation(){
   if(!workLink)return;
   if(window.location.hash==='#work')workLink.setAttribute('aria-current','page');
   else workLink.removeAttribute('aria-current');
  }
  window.addEventListener('hashchange',updateHomeNavigation);
  updateHomeNavigation();
 }
}
