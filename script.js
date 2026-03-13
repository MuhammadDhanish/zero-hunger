/* ═══════════════════════════════════════════════════════════════
   ZERO HUNGER CONNECTION — JAVASCRIPT
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ─── NAVBAR: Scroll Shadow ─── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ─── HAMBURGER: Mobile Menu ─── */
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      closeMobileMenu();
    }
  });
})();

function closeMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
    mobileMenu.setAttribute('aria-hidden', true);
  }
}

/* ─── SMOOTH SCROLL for anchor links ─── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();

/* ─── SCROLL REVEAL ─── */
(function initScrollReveal() {
  const elements = document.querySelectorAll(
    '.step-card, .stat-block, .cta-card, .testimonial-card, .about__text, .about__visual, .partner-logo-item'
  );

  // Add reveal class
  elements.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
})();

/* ─── IMPACT COUNTERS ─── */
(function initCounters() {
  const counterEls = document.querySelectorAll('.stat-block__number[data-target]');
  const barFills = document.querySelectorAll('.stat-block__bar-fill');

  if (!counterEls.length) return;

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000;
    const start = performance.now();
    const suffix = target >= 1000 ? '+' : '';

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out curve
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current.toLocaleString() + (progress === 1 ? suffix : '');
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        counterEls.forEach(el => animateCounter(el));
        barFills.forEach(el => {
          const targetW = el.style.width;
          el.style.width = '0';
          setTimeout(() => { el.style.width = targetW; }, 200);
        });
        sectionObserver.disconnect();
      }
    },
    { threshold: 0.3 }
  );

  const impactSection = document.getElementById('impact');
  if (impactSection) sectionObserver.observe(impactSection);
})();

/* ─── TESTIMONIALS SLIDER ─── */
(function initSlider() {
  const cards = document.querySelectorAll('.testimonial-card');
  const dotsContainer = document.getElementById('t-dots');
  const prevBtn = document.getElementById('t-prev');
  const nextBtn = document.getElementById('t-next');

  if (!cards.length || !dotsContainer) return;

  let current = 0;
  let autoTimer;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 't-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.setAttribute('role', 'tab');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    cards[current].classList.remove('active');
    dotsContainer.querySelectorAll('.t-dot')[current].classList.remove('active');
    current = (index + cards.length) % cards.length;
    cards[current].classList.add('active');
    dotsContainer.querySelectorAll('.t-dot')[current].classList.add('active');
    resetAutoplay();
  }

  function resetAutoplay() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }

  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));

  // Touch/swipe support
  let touchStartX = 0;
  const slider = document.getElementById('testimonials-slider');
  slider?.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  slider?.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) goTo(dx < 0 ? current + 1 : current - 1);
  });

  resetAutoplay();
})();

/* ─── NEWSLETTER FORM ─── */
function handleNewsletter(e) {
  e.preventDefault();
  const form = e.target;
  const emailInput = form.querySelector('#newsletter-email');
  const successEl = document.getElementById('newsletter-success');
  const email = emailInput.value.trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailInput.style.borderColor = '#ef4444';
    setTimeout(() => emailInput.style.borderColor = '', 2000);
    return;
  }

  // Success state
  successEl.hidden = false;
  emailInput.value = '';
  emailInput.blur();

  setTimeout(() => { successEl.hidden = true; }, 5000);
}

/* ─── ACTIVE NAV LINK on scroll ─── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const isActive = href === `#${id}`;
            link.style.color = isActive ? 'var(--primary)' : '';
            link.style.background = isActive ? 'var(--green-50)' : '';
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => observer.observe(s));
})();
