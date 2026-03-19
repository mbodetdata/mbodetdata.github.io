/**
 * main.js — BM Data | Refonte Premium Ultra-Moderne v2
 * Animations & interactions avancées (complémentaires à script.js)
 * ─────────────────────────────────────────────────────────────────
 * 1.  Scroll Reveal  — [data-reveal] + stagger automatique sur grilles
 * 2.  Compteurs animés — [data-count] avec easing + suffixe
 * 3.  FAQ Accordion  — .faq-item
 * 4.  Smooth Scroll  — ancres internes #...
 * 5.  Filtres        — .filter-bar / .posts-grid / .projects-grid
 * 6.  Scroll Progress Bar — #scroll-progress
 * 7.  Custom Cursor  — .cursor-dot / .cursor-ring (desktop only)
 * 8.  Magnetic Buttons — [data-magnetic]
 * 9.  Card Spotlight — .spotlight (mouse tracking)
 * 10. Parallax léger  — .bg-orb (scroll)
 */

(function () {
  'use strict';

  /* ───────────────────────────────────────────────────────────────
     Helpers
  ─────────────────────────────────────────────────────────────── */
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var IS_TOUCH = window.matchMedia('(pointer: coarse)').matches;
  var IS_MOBILE = window.matchMedia('(max-width: 768px)').matches;

  function raf(fn) {
    return (window.requestAnimationFrame || function (f) { setTimeout(f, 16); })(fn);
  }

  /* ═══════════════════════════════════════════════════════════════
     1. SCROLL REVEAL — [data-reveal] + grilles auto-stagger
  ═══════════════════════════════════════════════════════════════ */
  function initReveal() {
    var items = document.querySelectorAll('[data-reveal]');
    var staggerGrids = document.querySelectorAll('.reveal-stagger');

    // Fallback sans IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      staggerGrids.forEach(function (grid) {
        grid.querySelectorAll(':scope > *').forEach(function (child) {
          child.classList.add('is-visible');
        });
      });
      return;
    }

    // Observer principal ([data-reveal])
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var delay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
          if (delay > 0) {
            el.style.transitionDelay = delay + 'ms';
          }
          el.classList.add('is-visible');
          observer.unobserve(el);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
    );

    items.forEach(function (el) { observer.observe(el); });

    // Observer grilles avec stagger automatique
    var staggerObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var children = Array.from(entry.target.querySelectorAll(':scope > *'));
          children.forEach(function (child, i) {
            setTimeout(function () {
              child.classList.add('is-visible');
            }, i * 70);
          });
          staggerObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
    );

    staggerGrids.forEach(function (grid) { staggerObserver.observe(grid); });
  }

  /* ═══════════════════════════════════════════════════════════════
     2. COMPTEURS ANIMÉS — [data-count]
  ═══════════════════════════════════════════════════════════════ */
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el, target, duration, suffix) {
    var start = null;
    var isFloat = String(target).includes('.');
    var decimals = isFloat ? (String(target).split('.')[1] || '').length : 0;

    function step(timestamp) {
      if (!start) start = timestamp;
      var elapsed  = Math.min((timestamp - start) / duration, 1);
      var eased    = easeOutCubic(elapsed);
      var current  = target * eased;
      el.textContent = (isFloat ? current.toFixed(decimals) : Math.round(current)) + suffix;
      if (elapsed < 1) raf(step);
      else el.textContent = target + suffix;
    }
    raf(step);
  }

  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    if (!('IntersectionObserver' in window)) {
      counters.forEach(function (el) {
        var raw    = el.getAttribute('data-count');
        var suffix = el.getAttribute('data-count-suffix') || '';
        el.textContent = raw + suffix;
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el     = entry.target;
          var raw    = el.getAttribute('data-count');
          var target = parseFloat(raw);
          var suffix = el.getAttribute('data-count-suffix') || '';
          if (!isNaN(target)) animateCounter(el, target, 1300, suffix);
          observer.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (el) { observer.observe(el); });
  }

  /* ═══════════════════════════════════════════════════════════════
     3. FAQ ACCORDION — .faq-item
  ═══════════════════════════════════════════════════════════════ */
  function initFaq() {
    var items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    items.forEach(function (item) {
      var btn  = item.querySelector('.faq-question');
      var body = item.querySelector('.faq-answer');
      if (!btn || !body) return;

      btn.setAttribute('aria-expanded', 'false');
      body.setAttribute('aria-hidden', 'true');
      body.style.maxHeight  = '0';
      body.style.overflow   = 'hidden';

      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');

        // Fermer tous les autres
        items.forEach(function (other) {
          if (other !== item && other.classList.contains('is-open')) {
            other.classList.remove('is-open');
            var otherBtn  = other.querySelector('.faq-question');
            var otherBody = other.querySelector('.faq-answer');
            if (otherBtn)  otherBtn.setAttribute('aria-expanded', 'false');
            if (otherBody) {
              otherBody.setAttribute('aria-hidden', 'true');
              otherBody.style.maxHeight = '0';
            }
          }
        });

        // Toggle courant
        if (isOpen) {
          item.classList.remove('is-open');
          btn.setAttribute('aria-expanded', 'false');
          body.setAttribute('aria-hidden', 'true');
          body.style.maxHeight = '0';
        } else {
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
          body.setAttribute('aria-hidden', 'false');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     4. SMOOTH SCROLL — ancres internes
  ═══════════════════════════════════════════════════════════════ */
  function initSmoothScroll() {
    // CSS scroll-behavior:smooth déjà déclaré dans styles.css — fallback uniquement
    if ('scrollBehavior' in document.documentElement.style) return;

    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      var target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      var headerH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-h') || '72',
        10
      );
      var top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 16;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     5. FILTRES — .filter-bar
  ═══════════════════════════════════════════════════════════════ */
  function initFilters() {
    var bars = document.querySelectorAll('.filter-bar');
    bars.forEach(function (bar) {
      var grid = bar.nextElementSibling;
      if (!grid || (!grid.classList.contains('posts-grid') && !grid.classList.contains('projects-grid'))) {
        grid = bar.parentElement.querySelector('.posts-grid, .projects-grid, [id$="-grid"]');
      }
      if (!grid) return;

      var buttons  = bar.querySelectorAll('.filter-btn');
      var countEl  = bar.querySelector('.filter-count');
      var cards    = grid.querySelectorAll('[data-category]');

      buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var filter = btn.getAttribute('data-filter');
          buttons.forEach(function (b) { b.classList.remove('is-active'); });
          btn.classList.add('is-active');

          var visible = 0;
          cards.forEach(function (card) {
            var cat  = card.getAttribute('data-category');
            var show = filter === 'all' || cat === filter;
            card.style.display = show ? '' : 'none';
            if (show) visible++;
          });

          if (countEl) {
            countEl.textContent = visible + ' article' + (visible > 1 ? 's' : '');
          }

          var emptyEl = grid.querySelector('.posts-empty, .projects-empty');
          if (emptyEl) emptyEl.style.display = visible === 0 ? '' : 'none';
        });
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     6. SCROLL PROGRESS BAR — #scroll-progress
  ═══════════════════════════════════════════════════════════════ */
  function initScrollProgress() {
    // Créer la barre si absente du HTML
    var bar = document.getElementById('scroll-progress');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'scroll-progress';
      document.body.insertBefore(bar, document.body.firstChild);
    }

    var ticking = false;
    function update() {
      var scrollTop  = window.scrollY || window.pageYOffset;
      var docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      var progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = Math.min(progress, 100).toFixed(2) + '%';
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { raf(update); ticking = true; }
    }, { passive: true });

    update(); // état initial
  }

  /* ═══════════════════════════════════════════════════════════════
     7. CUSTOM CURSOR — .cursor-dot / .cursor-ring
     Uniquement sur desktop pointer:fine, motion OK
  ═══════════════════════════════════════════════════════════════ */
  function initCursor() {
    if (IS_TOUCH || REDUCED) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    // Créer les éléments si absents
    var dot  = document.querySelector('.cursor-dot');
    var ring = document.querySelector('.cursor-ring');

    if (!dot) {
      dot = document.createElement('div');
      dot.className = 'cursor-dot';
      document.body.appendChild(dot);
    }
    if (!ring) {
      ring = document.createElement('div');
      ring.className = 'cursor-ring';
      document.body.appendChild(ring);
    }

    var mouseX = -200, mouseY = -200;
    var ringX  = -200, ringY  = -200;
    var ringRunning = false;

    // Position immédiate du dot
    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = 'translate3d(calc(' + mouseX + 'px - 50%), calc(' + mouseY + 'px - 50%), 0)';
      if (!ringRunning) { ringRunning = true; raf(animateRing); }
    }, { passive: true });

    // Ring avec lerp (lag doux)
    function animateRing() {
      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;
      ring.style.transform = 'translate3d(calc(' + ringX + 'px - 50%), calc(' + ringY + 'px - 50%), 0)';
      var dx = Math.abs(mouseX - ringX);
      var dy = Math.abs(mouseY - ringY);
      if (dx > 0.3 || dy > 0.3) { raf(animateRing); }
      else { ringRunning = false; }
    }

    // États hover / active
    var interactiveSelector = 'a, button, [role="button"], label, input, select, textarea, .card, .service-card, .filter-btn, .faq-question, .chip, .hub-nav-btn';

    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(interactiveSelector)) {
        document.body.classList.add('cursor-hover');
      }
    }, { passive: true });

    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(interactiveSelector)) {
        document.body.classList.remove('cursor-hover');
      }
    }, { passive: true });

    document.addEventListener('mousedown', function () {
      document.body.classList.add('cursor-active');
    }, { passive: true });
    document.addEventListener('mouseup', function () {
      document.body.classList.remove('cursor-active');
    }, { passive: true });

    // Masquer quand la souris quitte la fenêtre
    document.addEventListener('mouseleave', function () {
      document.body.classList.add('cursor-hidden');
    }, { passive: true });
    document.addEventListener('mouseenter', function () {
      document.body.classList.remove('cursor-hidden');
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════════════════════════
     8. MAGNETIC BUTTONS — [data-magnetic]
  ═══════════════════════════════════════════════════════════════ */
  function initMagnetic() {
    if (IS_TOUCH || REDUCED || IS_MOBILE) return;

    var magnets = document.querySelectorAll('[data-magnetic]');
    magnets.forEach(function (el) {
      el.classList.add('magnetic');

      el.addEventListener('mousemove', function (e) {
        var rect     = el.getBoundingClientRect();
        var cx       = rect.left + rect.width  / 2;
        var cy       = rect.top  + rect.height / 2;
        var strength = parseFloat(el.getAttribute('data-magnetic') || '0.35');
        var dx       = (e.clientX - cx) * strength;
        var dy       = (e.clientY - cy) * strength;
        el.style.setProperty('--mag-x', dx.toFixed(2) + 'px');
        el.style.setProperty('--mag-y', dy.toFixed(2) + 'px');
      }, { passive: true });

      el.addEventListener('mouseleave', function () {
        el.style.setProperty('--mag-x', '0px');
        el.style.setProperty('--mag-y', '0px');
      }, { passive: true });
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     9. CARD SPOTLIGHT — .spotlight (mouse tracking)
  ═══════════════════════════════════════════════════════════════ */
  function initSpotlight() {
    if (IS_TOUCH || REDUCED) return;

    var spotlights = document.querySelectorAll('.spotlight');
    spotlights.forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var x    = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%';
        var y    = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%';
        el.style.setProperty('--spot-x', x);
        el.style.setProperty('--spot-y', y);
      }, { passive: true });
    });

    // Spotlight générique sur cards (--mouse-x / --mouse-y pour le glare CSS)
    var glareCards = document.querySelectorAll('.card, .service-card, .feature-card, .glass-card');
    glareCards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x    = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%';
        var y    = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%';
        card.style.setProperty('--mouse-x', x);
        card.style.setProperty('--mouse-y', y);
      }, { passive: true });
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     10. PARALLAX LÉGER — .bg-orb (scroll)
  ═══════════════════════════════════════════════════════════════ */
  function initParallax() {
    if (IS_MOBILE || REDUCED) return;

    var orbs = document.querySelectorAll('.bg-orb');
    if (!orbs.length) return;

    var speeds = [0.04, -0.06, 0.03, -0.05, 0.07];
    var ticking = false;

    function updateParallax() {
      var scrollY = window.scrollY || window.pageYOffset;
      orbs.forEach(function (orb, i) {
        var speed = speeds[i] || 0.04;
        var ty    = (scrollY * speed).toFixed(2);
        // On ajoute le translate en plus de l'animation existante
        // via une custom property lue par JS
        orb.style.marginTop = ty + 'px';
      });
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { raf(updateParallax); ticking = true; }
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════════════════════════
     INIT
  ═══════════════════════════════════════════════════════════════ */
  function init() {
    initReveal();
    initCounters();
    initFaq();
    initSmoothScroll();
    initFilters();
    initScrollProgress();
    initCursor();
    initMagnetic();
    initSpotlight();
    initParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

/* ─────────────────────────────────────────────────────────────────────────────
   ARCHIVE — ancienne version main.js conservée pour référence
   ─────────────────────────────────────────────────────────────────────────────

(function () {
  'use strict';

  // 1. SCROLL REVEAL
  function initReveal() {
    var items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var delay = entry.target.getAttribute('data-reveal-delay') || '0';
            entry.target.style.transitionDelay = delay + 'ms';
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    items.forEach(function (el) { observer.observe(el); });
  }

  // 2. COMPTEURS — data-count
  function animateCounter(el, target, duration) {
    var start = 0; var startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + (target - start) * eased);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }
  function initCounters() { ... }

  // 3. FAQ ACCORDION
  function initFaq() { ... }

  // 4. SMOOTH SCROLL
  function initSmoothScroll() { ... }

  // 5. FILTRES PORTFOLIO
  function initFilters() { ... }

  function init() { initReveal(); initCounters(); initFaq(); initSmoothScroll(); initFilters(); }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); }
  else { init(); }
})();

─────────────────────────────────────────────────────────────────────────────*/
