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
