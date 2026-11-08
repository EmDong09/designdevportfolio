// Returning through the wordmark should open the homepage fully loaded.
{
 const wordmark=document.querySelector('.header .wordmark');
 wordmark?.addEventListener('click',()=>{
  if(window.location.pathname!=='/'){
   try{sessionStorage.setItem('emily-portfolio:skip-intro','1');}catch{}
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

// Footer actions are only created when real destinations are supplied.
{
 const {email,linkedin,instagram,resume}=window.portfolioContent;
 const emailLink=document.querySelector('[data-footer-email]');
 if(emailLink && email){emailLink.href=`mailto:${email}`;emailLink.textContent=email;}
 if(resume){
  const placeholder=document.querySelector('[data-footer-resume]');
  if(placeholder){const link=document.createElement('a');link.href=/^(https?:\/\/|\/)/.test(resume)?resume:`/${resume.replace(/^\.\//,'')}`;link.textContent='Resume';placeholder.replaceWith(link);}
 }
 const socials=document.querySelector('[data-footer-socials]');
 const icons={
  LinkedIn:'<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="1.5"/><path d="M7 10v7M7 7v.2M11 17v-7m0 3a3 3 0 0 1 6 0v4"/></svg>',
  Instagram:'<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/></svg>'
 };
 if(socials){for(const [name,url] of [['LinkedIn',linkedin],['Instagram',instagram]]){if(!url)continue;const link=document.createElement('a');link.href=url;link.setAttribute('aria-label',name);link.innerHTML=icons[name];socials.append(link);}socials.hidden=!socials.children.length;}
}
