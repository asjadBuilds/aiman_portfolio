// Set to false to hide the testimonials section (and its nav link) before launch.
const SHOW_TESTIMONIALS = true;

(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Testimonials switch (CSS counters keep section numbers gap-free)
  if (!SHOW_TESTIMONIALS) { $('#testimonials')?.remove(); $$('[data-testimonials]').forEach(a => a.remove()); }

  // Theme toggle
  const root = document.documentElement, tbtn = $('#theme'), meta = $('meta[name=theme-color]');
  const applyTheme = t => {
    root.dataset.theme = t; tbtn.setAttribute('aria-pressed', t === 'dark');
    meta.content = t === 'dark' ? '#0E1514' : '#FAF8F4';
  };
  applyTheme(root.dataset.theme || 'light');
  tbtn.addEventListener('click', () => {
    const t = root.dataset.theme === 'dark' ? 'light' : 'dark'; applyTheme(t);
    try { localStorage.setItem('theme', t); } catch (e) {}
  });

  // Mobile menu
  const burger = $('#burger'), menu = $('#menu');
  const setMenu = open => { menu.classList.toggle('open', open); burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  // Scroll: nav background + progress bar
  const nav = $('#nav'), bar = $('.progress');
  const onScroll = () => {
    nav.classList.toggle('scrolled', scrollY > 10);
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Reveals + pipeline
  const io = new IntersectionObserver((es, o) => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); }
  }), { threshold: .15 });
  $$('.rv, .steps').forEach((el, i) => {
    if (el.matches('.grid4 .rv, .grid3 .rv')) el.style.transitionDelay = (i % 4) * 80 + 'ms';
    io.observe(el);
  });

  // Metric count-up
  const fmt = (el, n) => el.textContent = (el.dataset.prefix || '') + Math.round(n) + (el.dataset.suffix || '');
  const cio = new IntersectionObserver((es, o) => es.forEach(e => {
    if (!e.isIntersecting) return; o.unobserve(e.target);
    const el = e.target, end = +el.dataset.count;
    if (reduce) return fmt(el, end);
    const t0 = performance.now(), dur = 1400;
    const tick = t => { const p = Math.min((t - t0) / dur, 1); fmt(el, end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }), { threshold: .6 });
  $$('[data-count]').forEach(el => { if (!reduce) fmt(el, 0); cio.observe(el); });

  // Active nav link
  const links = $$('nav a[href^="#"]');
  const sio = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.hash === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  links.forEach(a => { const s = $(a.hash); if (s) sio.observe(s); });

  // Avatar parallax (pointer only, skipped for reduced motion)
  const av = $('#avatar');
  if (av && !reduce) addEventListener('pointermove', e => {
    av.style.setProperty('--px', (e.clientX / innerWidth - .5).toFixed(2));
    av.style.setProperty('--py', (e.clientY / innerHeight - .5).toFixed(2));
  }, { passive: true });

  // Copy email
  const toast = $('#toast');
  $('#copy').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText('nazaiman45@gmail.com'); toast.textContent = 'Email copied'; }
    catch (e) { toast.textContent = 'Copy failed. Select the email manually.'; }
    toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 1800);
  });
})();
