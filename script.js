/* ============================================
   DESIGN X — SCRIPT.JS
   ============================================ */

/* ── PRELOADER ────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const pre = document.getElementById('preloader');
    if (pre) pre.classList.add('hidden');
  }, 1900);
});

/* ── CUSTOM CURSOR ───────────────────────── */
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');

if (cursor && follower && window.matchMedia('(hover:hover)').matches) {
  let fx = 0, fy = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
    cursor.style.left   = cx + 'px';
    cursor.style.top    = cy + 'px';
  });

  (function animateFollower() {
    fx += (cx - fx) * 0.12;
    fy += (cy - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animateFollower);
  })();

  document.querySelectorAll('a,button,.service-card,.work-card,.testi-btn,.filter-btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      follower.style.width  = '60px';
      follower.style.height = '60px';
      follower.style.borderColor = 'rgba(108,99,255,0.8)';
    });
    el.addEventListener('mouseleave', () => {
      follower.style.width  = '36px';
      follower.style.height = '36px';
      follower.style.borderColor = 'rgba(108,99,255,0.5)';
    });
  });
}

/* ── NAVBAR ──────────────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
  updateActiveLink();
  toggleBackToTop();
});

hamburger && hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── ACTIVE NAV LINK ─────────────────────── */
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY  = window.scrollY + 100;
  sections.forEach(sec => {
    const top    = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    const link   = document.querySelector(`.nav-link[href="#${sec.id}"]`);
    if (link) link.classList.toggle('active', scrollY >= top && scrollY < bottom);
  });
}

/* ── SMOOTH SCROLL ───────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

/* ── COUNTER ANIMATION ───────────────────── */
const counters = document.querySelectorAll('.stat-num');
let countersStarted = false;

function startCounters() {
  if (countersStarted) return;
  const heroStats = document.querySelector('.hero-stats');
  if (!heroStats) return;
  const rect = heroStats.getBoundingClientRect();
  if (rect.top < window.innerHeight) {
    countersStarted = true;
    counters.forEach(counter => {
      const target = +counter.dataset.target;
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        counter.textContent = Math.floor(current);
      }, 16);
    });
  }
}
window.addEventListener('scroll', startCounters);
startCounters();

/* ── SCROLL REVEAL ───────────────────────── */
const revealEls = document.querySelectorAll(
  '.service-card, .work-card, .process-step, .testi-card, .tech-item, .contact-item, .about-content, .about-visual, .section-header'
);

revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ── PORTFOLIO FILTER ────────────────────── */
const filterBtns = document.querySelectorAll('.filter-btn');
const workCards  = document.querySelectorAll('.work-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    workCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      if (match) {
        card.classList.remove('hidden');
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => card.classList.add('hidden'), 300);
      }
    });
  });
});

/* ── TESTIMONIALS SLIDER ─────────────────── */
const track      = document.getElementById('testimonialsTrack');
const dotsWrap   = document.getElementById('testiDots');
const prevBtn    = document.getElementById('testiPrev');
const nextBtn    = document.getElementById('testiNext');

if (track) {
  const cards       = track.querySelectorAll('.testi-card');
  let current       = 0;
  let slidesVisible = getSlidesVisible();
  let total         = Math.ceil(cards.length / slidesVisible);
  let autoplay;

  function getSlidesVisible() {
    return window.innerWidth <= 640 ? 1 : window.innerWidth <= 900 ? 2 : 3;
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    total = Math.ceil(cards.length / slidesVisible);
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.classList.add('testi-dot');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      if (i === current) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function goTo(idx) {
    current = (idx + total) % total;
    const offset = -(current * (100 / slidesVisible)) * slidesVisible;
    // calculate percentage per card
    const cardW = 100 / cards.length;
    const shift = current * slidesVisible * cardW;
    track.style.transform = `translateX(-${shift}%)`;
    document.querySelectorAll('.testi-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  // Use pixel-based sliding
  function updateTrack() {
    slidesVisible = getSlidesVisible();
    total = Math.ceil(cards.length / slidesVisible);
    if (current >= total) current = total - 1;
    buildDots();

    const wrap = track.parentElement;
    const wrapW = wrap.offsetWidth;
    const cardW = (wrapW - (slidesVisible - 1) * 24) / slidesVisible;
    cards.forEach(c => {
      c.style.minWidth = cardW + 'px';
      c.style.flexShrink = '0';
    });
    track.style.transform = `translateX(-${current * (cardW + 24)}px)`;
  }

  function slideTo(idx) {
    current = (idx + total) % total;
    const wrap = track.parentElement;
    const wrapW = wrap.offsetWidth;
    const cardW = (wrapW - (slidesVisible - 1) * 24) / slidesVisible;
    track.style.transform = `translateX(-${current * (cardW + 24)}px)`;
    document.querySelectorAll('.testi-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prevBtn && prevBtn.addEventListener('click', () => { slideTo(current - 1); resetAutoplay(); });
  nextBtn && nextBtn.addEventListener('click', () => { slideTo(current + 1); resetAutoplay(); });

  function startAutoplay() {
    autoplay = setInterval(() => slideTo(current + 1), 4000);
  }
  function resetAutoplay() { clearInterval(autoplay); startAutoplay(); }

  window.addEventListener('resize', updateTrack);
  updateTrack();
  startAutoplay();

  // Drag/swipe support
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) slideTo(diff > 0 ? current + 1 : current - 1);
  });
}

/* ── CONTACT FORM ────────────────────────── */
const form        = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

form && form.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending…';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Message Sent! ✓';
    btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
    formSuccess.classList.add('visible');
    form.reset();
    setTimeout(() => {
      btn.textContent = 'Send Message ';
      btn.appendChild(Object.assign(document.createElement('i'), { className: 'fa-solid fa-paper-plane' }));
      btn.style.background = '';
      btn.disabled = false;
      formSuccess.classList.remove('visible');
    }, 4000);
  }, 1400);
});

/* ── BACK TO TOP ─────────────────────────── */
const backTop = document.getElementById('backToTop');
function toggleBackToTop() {
  if (backTop) backTop.classList.toggle('visible', window.scrollY > 400);
}
backTop && backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── NAVBAR INIT ─────────────────────────── */
navbar.classList.toggle('scrolled', window.scrollY > 30);
updateActiveLink();