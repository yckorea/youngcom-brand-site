const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const closeMenu = () => {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute('aria-expanded', 'false');
  const label = menuButton.querySelector('.sr-only');
  if (label) label.textContent = '메뉴 열기';
  navigation.classList.remove('open');
  document.body.style.overflow = '';
};

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(willOpen));
    const label = menuButton.querySelector('.sr-only');
    if (label) label.textContent = willOpen ? '메뉴 닫기' : '메뉴 열기';
    navigation.classList.toggle('open', willOpen);
    document.body.style.overflow = willOpen ? 'hidden' : '';
  });
  navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
}

const revealElements = [...document.querySelectorAll('.reveal')];
if (reducedMotion.matches || !('IntersectionObserver' in window)) {
  revealElements.forEach((element) => element.classList.add('visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
}

const scrubSection = document.querySelector('[data-scrub]');
const scrubVideo = document.querySelector('[data-scrub-video]');
if (scrubSection && scrubVideo) {
  const mobile = window.matchMedia('(max-width: 620px)').matches;
  scrubVideo.poster = mobile ? 'assets/hero-poster-m.jpg' : 'assets/hero-poster.jpg';
  if (!reducedMotion.matches) {
    scrubVideo.src = mobile ? 'assets/hero-scrub-m.mp4' : 'assets/hero-scrub.mp4';
    scrubVideo.load();
    let ticking = false;
    const updateScrub = () => {
      ticking = false;
      if (!Number.isFinite(scrubVideo.duration) || scrubVideo.duration <= 0) return;
      const maxScroll = Math.max(1, scrubSection.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -scrubSection.getBoundingClientRect().top / maxScroll));
      scrubVideo.currentTime = progress * Math.max(0, scrubVideo.duration - 0.04);
    };
    const requestScrub = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateScrub);
    };
    scrubVideo.addEventListener('loadedmetadata', updateScrub, { once: true });
    window.addEventListener('scroll', requestScrub, { passive: true });
    window.addEventListener('resize', requestScrub);
  }
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
