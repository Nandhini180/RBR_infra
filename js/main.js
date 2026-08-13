/* =========================================================
   RBR INFRASTRUCTURE — SITE SCRIPT
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- INTRO VIDEO ---------- */
  const intro = document.getElementById('intro');
  if (intro) {
    const video = intro.querySelector('video');
    const skipBtn = intro.querySelector('.skip-intro');
    document.body.classList.add('intro-active');

    const seenIntro = sessionStorage.getItem('rbrIntroSeen');
    if (seenIntro) {
      intro.remove();
      document.body.classList.remove('intro-active');
    } else {
      const closeIntro = () => {
        intro.classList.add('hide');
        document.body.classList.remove('intro-active');
        sessionStorage.setItem('rbrIntroSeen', '1');
        setTimeout(() => intro.remove(), 1200);
      };
      if (video) {
        video.play().catch(() => { /* autoplay blocked — user can still skip */ });
        video.addEventListener('ended', closeIntro);
      }
      if (skipBtn) skipBtn.addEventListener('click', closeIntro);
    }
  }

  /* ---------- NAVBAR ---------- */
  const nav = document.querySelector('.nav');
  const onScrollNav = () => {
    if (!nav) return;
    if (window.scrollY > 60) nav.classList.add('solid');
    else nav.classList.remove('solid');
  };
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  const toggle = document.querySelector('.nav-toggle');
  const panel = document.querySelector('.mobile-panel');
  const overlay = document.querySelector('.mobile-overlay');
  const closeMobile = () => { panel?.classList.remove('open'); overlay?.classList.remove('open'); };
  toggle?.addEventListener('click', () => { panel?.classList.toggle('open'); overlay?.classList.toggle('open'); });
  overlay?.addEventListener('click', closeMobile);
  panel?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobile));

  /* ---------- SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach((el, i) => {
    const parent = el.closest('[data-stagger]');
    if (parent) el.style.setProperty('--i', [...parent.children].indexOf(el));
    io.observe(el);
  });

  /* Roofline SVG draw-on-scroll */
  document.querySelectorAll('.hero-roofline').forEach(svg => {
    const svgIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('in'); });
    }, { threshold: 0.2 });
    svgIo.observe(svg);
  });

  /* ---------- COUNTERS ---------- */
  const counters = document.querySelectorAll('.counter b[data-count]');
  const countIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target < 10 ? (target * eased).toFixed(1) : Math.floor(target * eased);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
      };
      requestAnimationFrame(tick);
      countIo.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => countIo.observe(c));

  /* ---------- TESTIMONIAL CAROUSEL ---------- */
  const testiWrap = document.querySelector('.testi-wrap');
  if (testiWrap) {
    const slides = [...testiWrap.querySelectorAll('.testi-slide')];
    const dotsWrap = testiWrap.querySelector('.testi-dots');
    let active = 0, timer;

    slides.forEach((s, i) => {
      const dot = document.createElement('button');
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
      dot.addEventListener('click', () => show(i, true));
      dotsWrap.appendChild(dot);
    });
    const dots = [...dotsWrap.children];

    function show(index, manual) {
      slides[active].style.display = 'none';
      dots[active].classList.remove('active');
      active = (index + slides.length) % slides.length;
      slides[active].style.display = '';
      dots[active].classList.add('active');
      if (manual) restart();
    }
    function restart() {
      clearInterval(timer);
      timer = setInterval(() => show(active + 1), 6000);
    }
    slides.forEach((s, i) => { if (i !== 0) s.style.display = 'none'; });
    restart();
  }

  /* ---------- OUR WORK FILTER ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      workCards.forEach(card => {
        const match = cat === 'all' || card.dataset.cat === cat;
        card.classList.toggle('hidden', !match);
      });
    });
  });

  /* ---------- BACK TO TOP ---------- */
  const toTop = document.querySelector('.to-top');
  if (toTop) {
    window.addEventListener('scroll', () => {
      toTop.classList.toggle('show', window.scrollY > 700);
    }, { passive: true });
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- ACTIVE NAV LINK ---------- */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-panel a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
  });

  /* ---------- CONTACT FORM (demo) ---------- */
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML = 'Message Sent';
      btn.style.opacity = '.7';
      form.reset();
      setTimeout(() => { btn.innerHTML = original; btn.style.opacity = '1'; }, 2800);
    });
  }
});
