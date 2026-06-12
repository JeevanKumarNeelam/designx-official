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

/* ── CUSTOM CURSOR (desktop only) ───────────── */
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');

if (cursor && follower && window.matchMedia('(hover:hover)').matches) {
  let fx = 0, fy = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
  });

  (function animateFollower() {
    fx += (cx - fx) * 0.12;
    fy += (cy - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animateFollower);
  })();

  document.querySelectorAll('a,button,.service-card,.work-card,.filter-btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      follower.style.width       = '60px';
      follower.style.height      = '60px';
      follower.style.borderColor = 'rgba(108,99,255,0.8)';
    });
    el.addEventListener('mouseleave', () => {
      follower.style.width       = '36px';
      follower.style.height      = '36px';
      follower.style.borderColor = 'rgba(108,99,255,0.5)';
    });
  });
}

/* ── NAVBAR ──────────────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 30);
  updateActiveLink();
  toggleFloatingBtns();
});

hamburger && hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  // Prevent body scroll when menu is open
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger && hamburger.classList.remove('open');
    navLinks  && navLinks.classList.remove('open');
    hamburger && hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Close menu on outside click
document.addEventListener('click', e => {
  if (navLinks && navLinks.classList.contains('open')) {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }
});

// Close menu on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navLinks && navLinks.classList.contains('open')) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

/* ── ACTIVE NAV LINK ─────────────────────── */
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY  = window.scrollY + 120;
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
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
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
      const target   = +counter.dataset.target;
      const duration = 2000;
      const step     = target / (duration / 16);
      let current    = 0;
      const timer    = setInterval(() => {
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
  '.service-card, .work-card, .process-step, .tech-item, .contact-item, .about-content, .about-visual, .section-header'
);
revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

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
        requestAnimationFrame(() => {
          card.style.opacity   = '1';
          card.style.transform = 'translateY(0)';
        });
      } else {
        card.style.opacity   = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => card.classList.add('hidden'), 300);
      }
    });
  });
});

/* ── TESTIMONIALS — pure CSS auto-scroll, no JS needed ── */

/* ── CONTACT FORM ────────────────────────── */
const form        = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

form && form.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.innerHTML = 'Sending… <i class="fa-solid fa-spinner fa-spin"></i>';
  btn.disabled  = true;

  setTimeout(() => {
    btn.innerHTML  = 'Message Sent! ✓';
    btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
    if (formSuccess) formSuccess.classList.add('visible');
    form.reset();

    setTimeout(() => {
      btn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
      btn.style.background = '';
      btn.disabled = false;
      if (formSuccess) formSuccess.classList.remove('visible');
    }, 4000);
  }, 1400);
});

/* ── FLOATING BUTTONS (WhatsApp + Back-to-Top) ──── */
const backTop    = document.getElementById('backToTop');
const whatsappBtn = document.getElementById('whatsappBtn');

function toggleFloatingBtns() {
  const show = window.scrollY > 400;
  if (backTop)     backTop.classList.toggle('visible', show);
  if (whatsappBtn) whatsappBtn.classList.toggle('visible', show);
}

backTop && backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── NAVBAR INIT ─────────────────────────── */
if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 30);
updateActiveLink();
toggleFloatingBtns();