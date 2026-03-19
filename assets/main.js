/**
 * main.js — BM Data
 * Animations & interactions complémentaires (non couvertes par script.js)
 * - [data-reveal] scroll reveal via IntersectionObserver
 * - Compteurs animés .stat-block__value[data-count]
 * - FAQ accordion .faq-item
 * - Smooth scroll ancres internes
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     1. SCROLL REVEAL — [data-reveal]
     ───────────────────────────────────────────── */
  function initReveal() {
    var items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback : afficher tout de suite
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

  /* ─────────────────────────────────────────────
     2. COMPTEURS ANIMÉS — data-count
     ───────────────────────────────────────────── */
  function animateCounter(el, target, duration) {
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // ease-out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + (target - start) * eased);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }

    requestAnimationFrame(step);
  }

  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    if (!('IntersectionObserver' in window)) {
      counters.forEach(function (el) {
        el.textContent = el.getAttribute('data-count');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var target = parseInt(entry.target.getAttribute('data-count'), 10);
            if (!isNaN(target)) animateCounter(entry.target, target, 1200);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (el) { observer.observe(el); });
  }

  /* ─────────────────────────────────────────────
     3. FAQ ACCORDION — .faq-item
     ───────────────────────────────────────────── */
  function initFaq() {
    var items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    items.forEach(function (item) {
      var btn = item.querySelector('.faq-question');
      var body = item.querySelector('.faq-answer');
      if (!btn || !body) return;

      // Accessibilité initiale
      btn.setAttribute('aria-expanded', 'false');
      body.setAttribute('aria-hidden', 'true');
      body.style.maxHeight = '0';
      body.style.overflow = 'hidden';
      body.style.transition = 'max-height 0.35s ease';

      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');

        // Fermer tous les autres
        items.forEach(function (other) {
          if (other !== item && other.classList.contains('is-open')) {
            other.classList.remove('is-open');
            var otherBtn = other.querySelector('.faq-question');
            var otherBody = other.querySelector('.faq-answer');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
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

  /* ─────────────────────────────────────────────
     4. SMOOTH SCROLL — ancres internes #...
     ───────────────────────────────────────────── */
  function initSmoothScroll() {
    // Vérifier si le navigateur supporte scroll-behavior nativement
    var supportsNative = 'scrollBehavior' in document.documentElement.style;
    if (supportsNative) return; // CSS gère déjà

    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      var target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      var headerH = 72; // hauteur header fixe approximative
      var top = target.getBoundingClientRect().top + window.pageYOffset - headerH;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  }

  /* ─────────────────────────────────────────────
     5. FILTRE PORTFOLIO — data-filter (blog + réalisations)
     ───────────────────────────────────────────── */
  function initFilters() {
    var bars = document.querySelectorAll('.filter-bar');
    bars.forEach(function (bar) {
      var grid = bar.nextElementSibling;
      // Chercher la grille la plus proche si pas directement adjacente
      if (!grid || (!grid.id && !grid.classList.contains('posts-grid') && !grid.classList.contains('projects-grid'))) {
        grid = bar.parentElement.querySelector('.posts-grid, .projects-grid, [id$="-grid"]');
      }
      if (!grid) return;

      var buttons = bar.querySelectorAll('.filter-btn');
      var countEl = bar.querySelector('.filter-count');
      var cards = grid.querySelectorAll('[data-category]');

      buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var filter = btn.getAttribute('data-filter');
          buttons.forEach(function (b) { b.classList.remove('is-active'); });
          btn.classList.add('is-active');

          var visible = 0;
          cards.forEach(function (card) {
            var cat = card.getAttribute('data-category');
            var show = filter === 'all' || cat === filter;
            card.style.display = show ? '' : 'none';
            if (show) visible++;
          });

          if (countEl) {
            countEl.textContent = visible + ' article' + (visible > 1 ? 's' : '');
          }

          // Empty state
          var emptyEl = grid.querySelector('.posts-empty, .projects-empty');
          if (emptyEl) {
            emptyEl.style.display = visible === 0 ? '' : 'none';
          }
        });
      });
    });
  }

  /* ─────────────────────────────────────────────
     INIT
     ───────────────────────────────────────────── */
  function init() {
    initReveal();
    initCounters();
    initFaq();
    initSmoothScroll();
    initFilters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
