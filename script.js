document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initCTAAnimations();
  initRippleEffect();
  initVideoFallback();
  initScrollFlyAnimations();
  initProjectGallery();
});

/* ─── Mobile Menu ─────────────────────────────── */
function initMobileMenu() {
  const burger   = document.querySelector('.burger');
  const sideMenu = document.getElementById('sideMenu');
  const closeBtn = document.getElementById('closeBtn');
  if (!burger || !sideMenu || !closeBtn) return;

  burger.addEventListener('click', () => sideMenu.classList.toggle('open'));
  closeBtn.addEventListener('click', () => sideMenu.classList.remove('open'));

  document.addEventListener('click', e => {
    if (sideMenu.classList.contains('open') && !sideMenu.contains(e.target) && !burger.contains(e.target)) {
      sideMenu.classList.remove('open');
    }
  });
}

/* ─── Hero CTA Entrance ───────────────────────── */
function initCTAAnimations() {
  const heroContent = document.getElementById('heroContent');
  if (!heroContent) return;

  heroContent.querySelectorAll('.btn').forEach((btn, i) => {
    btn.style.setProperty('--delay', `${i * 90}ms`);
  });

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      heroContent.classList.add('in');
      obs.disconnect();
    }
  }, { threshold: 0.25 });

  obs.observe(heroContent);
}

/* ─── Button Ripple Effect ────────────────────── */
function initRippleEffect() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('pointerdown', createRipple);
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') createRipple(e);
    });
  });

  function createRipple(e) {
    const el   = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x    = (e.clientX ?? rect.left + rect.width  / 2) - rect.left;
    const y    = (e.clientY ?? rect.top  + rect.height / 2) - rect.top;
    const size = Math.max(rect.width, rect.height) * 1.2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    Object.assign(ripple.style, {
      width:  size + 'px',
      height: size + 'px',
      left:   (x - size / 2) + 'px',
      top:    (y - size / 2) + 'px',
    });

    el.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
    if (e.type === 'keydown') setTimeout(() => ripple.remove(), 400);
  }
}

/* ─── Video Fallback ──────────────────────────── */
function initVideoFallback() {
  const vid  = document.getElementById('heroVideo');
  const hero = document.getElementById('hero');
  if (!vid || !hero) return;
  vid.addEventListener('error', () => hero.classList.add('no-video'));
}

/* ─── Scroll-Driven Fly-In Animations ────────── */
function initScrollFlyAnimations() {
  const cards = document.querySelectorAll('[data-fly]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.15
  });

  cards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 120}ms`;
    observer.observe(card);
  });
}

  cards.forEach((card, i) => {
    // Stagger the transition delay so cards don't all fly in at once
    card.style.transitionDelay = `${i * 80}ms`;
    obs.observe(card);
  });
}


/* ─── Project Gallery ────────── */
function initProjectGallery() {
  const gallery = document.getElementById('projectGallery');

  if (!gallery) return;

  // Duplicate content once
  gallery.innerHTML += gallery.innerHTML;

  let isDragging = false;
  let startX = 0;
  let scrollStart = 0;

  const halfWidth = () => gallery.scrollWidth / 2;

  function maintainLoop() {
    const halfway = halfWidth();

    if (gallery.scrollLeft >= halfway) {
      gallery.scrollLeft -= halfway;
    }

    if (gallery.scrollLeft <= 0) {
      gallery.scrollLeft += halfway;
    }
  }

  gallery.scrollLeft = halfWidth() / 2;

  gallery.addEventListener('scroll', maintainLoop);

  gallery.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.pageX;
    scrollStart = gallery.scrollLeft;
    gallery.classList.add('dragging');
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    gallery.classList.remove('dragging');
  });

  window.addEventListener('mousemove', e => {
    if (!isDragging) return;

    const walk = (e.pageX - startX) * 1.5;

    gallery.scrollLeft = scrollStart - walk;
  });

  gallery.addEventListener('wheel', e => {
    e.preventDefault();
    gallery.scrollLeft += e.deltaY;
  }, { passive: false });

  gallery.addEventListener('touchstart', e => {
    startX = e.touches[0].pageX;
    scrollStart = gallery.scrollLeft;
  });

  gallery.addEventListener('touchmove', e => {
    const walk = (e.touches[0].pageX - startX);

    gallery.scrollLeft = scrollStart - walk;
  });
}
