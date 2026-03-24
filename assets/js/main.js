/**
 * Terre'Happy Cholet — main.js
 * Centre de Bien-être, 118 rue Barjot, 49300 Cholet
 */

'use strict';

// ============================================================
// === STICKY HEADER ===
// ============================================================
(function initStickyHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load in case of refresh mid-page
})();

// ============================================================
// === MOBILE MENU ===
// ============================================================
(function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const overlay = document.querySelector('.mobile-overlay');
  if (!hamburger || !overlay) return;

  function openMenu() {
    hamburger.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  function toggleMenu() {
    if (overlay.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  hamburger.addEventListener('click', toggleMenu);

  // Close on outside click (overlay itself, not its children)
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeMenu();
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      closeMenu();
      hamburger.focus();
    }
  });

  // Close when a mobile link is clicked
  const mobileLinks = overlay.querySelectorAll('a');
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
})();

// ============================================================
// === SCROLL REVEAL (Intersection Observer) ===
// ============================================================
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const staggerParents = document.querySelectorAll('.stagger-children');

  if (!('IntersectionObserver' in window)) {
    // Fallback: show everything immediately
    revealEls.forEach(function (el) { el.classList.add('revealed'); });
    staggerParents.forEach(function (el) { el.classList.add('revealed'); });
    return;
  }

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  const staggerObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        staggerObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  staggerParents.forEach(function (el) {
    staggerObserver.observe(el);
  });
})();

// ============================================================
// === GALLERY CAROUSEL ===
// ============================================================
(function initCarousel() {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.carousel-track');
  const slides = carousel.querySelectorAll('.carousel-slide');
  const btnPrev = carousel.querySelector('.carousel-btn-prev');
  const btnNext = carousel.querySelector('.carousel-btn-next');
  const dotsContainer = carousel.querySelector('.carousel-dots');

  if (!track || slides.length === 0) return;

  let current = 0;
  let autoTimer = null;
  const INTERVAL = 5000;

  // Create dots
  if (dotsContainer) {
    slides.forEach(function (_, i) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Slide ' + (i + 1));
      dot.addEventListener('click', function () {
        goTo(i);
        resetTimer();
      });
      dotsContainer.appendChild(dot);
    });
  }

  function updateDots() {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    current = index;
    track.style.transform = 'translateX(-' + current * 100 + '%)';
    updateDots();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startTimer() {
    autoTimer = setInterval(next, INTERVAL);
  }

  function resetTimer() {
    clearInterval(autoTimer);
    startTimer();
  }

  if (btnNext) {
    btnNext.addEventListener('click', function () {
      next();
      resetTimer();
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', function () {
      prev();
      resetTimer();
    });
  }

  // Pause on hover
  carousel.addEventListener('mouseenter', function () {
    clearInterval(autoTimer);
  });
  carousel.addEventListener('mouseleave', startTimer);

  // Touch swipe support
  let touchStartX = 0;
  carousel.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  carousel.addEventListener('touchend', function (e) {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next(); else prev();
      resetTimer();
    }
  }, { passive: true });

  // Keyboard navigation
  carousel.setAttribute('tabindex', '0');
  carousel.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { next(); resetTimer(); }
    if (e.key === 'ArrowLeft') { prev(); resetTimer(); }
  });

  goTo(0);
  startTimer();
})();

// ============================================================
// === COUNTER ANIMATION ===
// ============================================================
(function initCounters() {
  const counters = document.querySelectorAll('[data-target]');
  if (counters.length === 0) return;

  if (!('IntersectionObserver' in window)) {
    counters.forEach(function (c) {
      c.textContent = c.getAttribute('data-target');
    });
    return;
  }

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * target);
      el.textContent = value + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function (el) {
    counterObserver.observe(el);
  });
})();

// ============================================================
// === BACK TO TOP ===
// ============================================================
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  function toggle() {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', toggle, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  toggle(); // initial check
})();

// ============================================================
// === SMOOTH SCROLL (for anchor links) ===
// ============================================================
(function initSmoothScroll() {
  document.addEventListener('click', function (e) {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const hash = anchor.getAttribute('href');
    if (hash === '#' || hash === '#!') return;
    const target = document.querySelector(hash);
    if (!target) return;
    e.preventDefault();
    const navHeight = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '80',
      10
    );
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
    window.scrollTo({ top: top, behavior: 'smooth' });
    // Update URL without triggering scroll
    history.pushState(null, '', hash);
  });
})();

// ============================================================
// === ACTIVE NAV LINK (highlight current page) ===
// ============================================================
(function initActiveNav() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(function (link) {
    const href = link.getAttribute('href');
    if (!href) return;

    // Normalize: strip leading slashes and .html
    const normalize = function (p) {
      return p.replace(/^\/+/, '').replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '') || 'index';
    };

    const linkBase = normalize(href);
    const pathBase = normalize(currentPath);

    if (linkBase === pathBase || (pathBase === 'index' && linkBase === 'index')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
})();

// ============================================================
// === TEAM FILTER (equipe.html) ===
// ============================================================
(function initTeamFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const teamCards = document.querySelectorAll('.team-card[data-category]');

  if (filterBtns.length === 0 || teamCards.length === 0) return;

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      const category = btn.getAttribute('data-filter');

      teamCards.forEach(function (card) {
        if (category === 'all') {
          card.classList.remove('hidden');
        } else {
          const cardCats = card.getAttribute('data-category') || '';
          if (cardCats.includes(category)) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        }
      });
    });
  });
})();

// ============================================================
// === DROPDOWN MENU ACCESSIBILITY ===
// ============================================================
(function initDropdown() {
  const dropdowns = document.querySelectorAll('.dropdown');

  dropdowns.forEach(function (dropdown) {
    const toggle = dropdown.querySelector('.nav-link');
    const menu = dropdown.querySelector('.dropdown-menu');
    if (!toggle || !menu) return;

    // Close when focus leaves dropdown
    dropdown.addEventListener('focusout', function (e) {
      if (!dropdown.contains(e.relatedTarget)) {
        menu.style.opacity = '';
        menu.style.visibility = '';
      }
    });
  });
})();

// ============================================================
// === URL PARAMETER READING (mise-a-jour.html) ===
// ============================================================
(function initMiseAJour() {
  const nameField = document.getElementById('therapeute-nom');
  if (!nameField) return;

  const params = new URLSearchParams(window.location.search);
  const therapeute = params.get('therapeute');

  if (therapeute) {
    // Convert slug to readable name: "sophie-arnault" -> "Sophie Arnault"
    const readable = therapeute
      .split('-')
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
    nameField.value = readable;
  }

  // Update share link
  const shareUrlInput = document.getElementById('share-url');
  if (shareUrlInput) {
    shareUrlInput.value = window.location.href;
  }
})();

// ============================================================
// === FORM SUCCESS MESSAGE ===
// ============================================================
(function initFormSuccess() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('success') === '1') {
    const successEl = document.querySelector('.form-success');
    const formEl = document.querySelector('form.main-form');
    if (successEl) {
      successEl.classList.add('visible');
      successEl.style.display = 'block';
    }
    if (formEl) {
      formEl.style.display = 'none';
    }
  }
})();

// ============================================================
// === SHARE LINK (mise-a-jour.html) ===
// ============================================================
(function initShareLink() {
  const shareBtn = document.getElementById('share-btn');
  if (!shareBtn) return;

  shareBtn.addEventListener('click', async function () {
    const shareUrlInput = document.getElementById('share-url');
    const url = shareUrlInput ? shareUrlInput.value : window.location.href;
    const title = 'Mise à jour fiche Terre\'Happy';
    const text = 'Mettez à jour votre fiche sur le site de Terre\'Happy Cholet.';

    // Try Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({ title: title, text: text, url: url });
        return;
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('Share failed:', err);
        }
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      const original = shareBtn.innerHTML;
      shareBtn.innerHTML = '<i class="fas fa-check"></i> Lien copié !';
      shareBtn.style.background = '#28A745';
      setTimeout(function () {
        shareBtn.innerHTML = original;
        shareBtn.style.background = '';
      }, 2500);
    } catch (err) {
      // Final fallback: select input text
      if (shareUrlInput) {
        shareUrlInput.select();
        document.execCommand('copy');
        alert('Lien copié dans le presse-papiers !');
      }
    }
  });
})();

// ============================================================
// === FORMSPREE AJAX SUBMISSION (optional progressive enhancement) ===
// ============================================================
(function initFormspree() {
  const forms = document.querySelectorAll('form[data-formspree]');

  forms.forEach(function (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
      }

      const formData = new FormData(form);

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          // Show success
          const successEl = form.nextElementSibling;
          if (successEl && successEl.classList.contains('form-success')) {
            form.style.display = 'none';
            successEl.style.display = 'block';
            successEl.classList.add('visible');
          } else {
            form.innerHTML = '<div class="form-success visible" style="display:block; text-align:center; padding:48px 24px"><div class="form-success-icon" style="width:80px;height:80px;background:#E8F8E8;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2rem;color:#28A745;margin:0 auto 24px"><i class="fas fa-check"></i></div><h3 style="font-family:var(--font-heading);color:var(--dark);margin-bottom:12px">Message envoyé !</h3><p>Merci, nous vous répondrons dans les plus brefs délais.</p></div>';
          }
        } else {
          throw new Error('Form submission failed');
        }
      } catch (err) {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
        alert('Une erreur est survenue. Veuillez réessayer ou nous contacter par email à assoterrehappy1@gmail.com');
      }
    });
  });
})();

// ============================================================
// === HEADER HERO PARALLAX (subtle) ===
// ============================================================
(function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  // Only on larger screens
  if (window.matchMedia('(max-width: 768px)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('scroll', function () {
    const y = window.scrollY;
    const blobs = hero.querySelectorAll('.blob');
    blobs.forEach(function (blob, i) {
      const speed = 0.08 + i * 0.04;
      blob.style.transform = 'translateY(' + y * speed + 'px)';
    });
  }, { passive: true });
})();

// ============================================================
// === INIT ON DOM READY ===
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
  // Tiny fade-in on page load
  document.body.classList.add('loaded');

  // Add loaded class to header hero elements immediately
  const heroReveal = document.querySelectorAll('.hero .reveal');
  heroReveal.forEach(function (el, i) {
    setTimeout(function () {
      el.classList.add('revealed');
    }, 200 + i * 150);
  });
});
