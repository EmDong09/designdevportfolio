(() => {
  const section = document.querySelector('.life-journal');
  if (!section) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const orbit = section.querySelector('.journal-orbit');
  const pills = [...section.querySelectorAll('.journal-tool-position')];
  const timers = new Map();
  // Only recompute geometry on resize; scrolling animates transform and opacity alone.
  const layout = () => {
    const {width, height} = orbit.getBoundingClientRect();
    pills.forEach((pill, index) => {
      const style = getComputedStyle(pill);
      let x = parseFloat(style.getPropertyValue('--tool-x')) / 100;
      let y = parseFloat(style.getPropertyValue('--tool-y')) / 100;
      if (matchMedia('(max-width: 767px)').matches) {
        x = x < .5 ? Math.max(.11, 52 / width) : Math.min(.89, 1 - 52 / width);
        y = .18 + Math.floor(index / 2) * .29;
      }
      // Keep the loose scatter clear of the book at smaller desktop widths.
      const book = section.querySelector('[data-flipbook]');
      const angle = parseFloat(style.getPropertyValue('--tool-angle')) * Math.PI / 180;
      const halfWidth = (Math.abs(Math.cos(angle)) * pill.offsetWidth + Math.abs(Math.sin(angle)) * pill.offsetHeight) / 2;
      const halfHeight = (Math.abs(Math.sin(angle)) * pill.offsetWidth + Math.abs(Math.cos(angle)) * pill.offsetHeight) / 2;
      if (y * height + halfHeight > book.offsetTop && y * height - halfHeight < book.offsetTop + book.offsetHeight) {
        const edge = (width - book.offsetWidth) / 2;
        x = x < .5 ? Math.min(x, (edge - halfWidth - 12) / width) : Math.max(x, (width - edge + halfWidth + 12) / width);
      }
      pill.style.setProperty('--tool-offset-x', `${(x - .5) * width}px`);
      pill.style.setProperty('--tool-offset-y', `${(y - .5) * height}px`);
    });
  };
  new ResizeObserver(layout).observe(orbit);
  layout();
  let expanded = false;
  const show = value => {
    expanded = value;
    const visible = value || motion.matches;
    section.classList.toggle('tools-visible', visible);
    pills.forEach((pill, index) => {
      clearTimeout(timers.get(pill));
      pill.style.pointerEvents = 'none';
      if (visible) timers.set(pill, setTimeout(() => {
        pill.style.pointerEvents = 'auto';
      }, motion.matches ? 0 : 700 + index * 80));
    });
  };
  const observer = new IntersectionObserver(entries => {
    const entry = entries[entries.length - 1];
    if (entry.intersectionRatio >= .6 && !expanded) show(true);
    else if (entry.intersectionRatio <= .5 && expanded) show(false);
  }, {
    // Track the book itself: retract when half has passed the viewport in either direction.
    threshold: [0, .5, .6],
    rootMargin: `-${document.querySelector('.header')?.offsetHeight || 0}px 0px 0px`
  });
  observer.observe(section.querySelector('[data-flipbook]'));
  motion.addEventListener('change', () => show(expanded));
  show(false);
})();
