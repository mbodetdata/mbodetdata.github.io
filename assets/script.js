/* ===========================================================================
   ABM — JS unifié (premium, moderne & épuré) — VERSION SEO/PERF
   Objectifs :
   - Conserver toutes les features existantes (AUCUNE suppression)
   - Réduire les risques de doublons & ré-initialisations
   - Améliorer SEO technique (stabilité, a11y, micro-optimisations)
   - Améliorer performances (lazy/idle init, écouteurs passifs, preconnect)

   Structure :
   0) Strict mode & helpers de timing
   1) Utils (qs/qsa, on/off, mq, rAF, store sûr)
   2) Navigation mobile (burger, ARIA, breakpoint)
   3) Thème (persist + préférence système, label/ARIA, Alt+clic reset)
   4) Modals (focus-trap, esc, overlay)
   5) Formulaire (Formspree AJAX + feedback + “merci” en modal)
   6) Certifications (carousel mobile + dots + centrage + idempotence)
   7) Calendly (inline desktop + popup mobile/desktop, lazy assets, loader 3 pts, fallbacks)
   8) Contacts (copy to clipboard)
   9) Fallback images (logos certifications)
   =========================================================================== */

'use strict';

/* ========================= 0) Timing helpers ========================= */
/** Exécute une tâche quand le thread est libre (meilleur pour LCP/INP). */
const runIdle = (fn) => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(fn, { timeout: 1800 });
  } else {
    setTimeout(fn, 1);
  }
};
/** Exécute une tâche au prochain frame. */
const raf = (fn) => (window.requestAnimationFrame || ((f)=>setTimeout(f,16)))(fn);

/* ========================= 1) Utils légers ========================= */
const $   = (sel, scope=document) => scope.querySelector(sel);
const $$  = (sel, scope=document) => Array.from(scope.querySelectorAll(sel));
const on  = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);
const off = (el, ev, fn, opts) => el && el.removeEventListener(ev, fn, opts);
const mq  = (q) => window.matchMedia ? window.matchMedia(q) : { matches:false, addEventListener(){}, removeEventListener(){} };

const PREFERS_REDUCED = mq('(prefers-reduced-motion: reduce)').matches;

/* Storage safe (évite erreurs navigation privée) */
const store = {
  get(k){ try { return localStorage.getItem(k); } catch { return null; } },
  set(k,v){ try { localStorage.setItem(k,v); } catch {} },
  rm(k){ try { localStorage.removeItem(k); } catch {} }
};

/* =================== 2) Navigation mobile (burger + ARIA) =================== */
(() => {
  const toggle = $('.nav-toggle');
  const panel  = $('#nav-collapsible');
  if (!toggle || !panel) return;

  const setState = (open) => {
    panel.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };

  // Init ARIA
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'nav-collapsible');

  // Écouteurs (passifs où pertinent)
  on(toggle, 'click', () => setState(!panel.classList.contains('open')), { passive:true });
  on(panel, 'click', (e) => { if (e.target.closest('a,button')) setState(false); }, { passive:true });

  // Ferme lors du passage en desktop (évite états “ouverts” persistants)
  const bp = mq('(min-width: 992px)');
  const onChange = () => { if (bp.matches) setState(false); };
  bp.addEventListener?.('change', onChange);
})();

/* ==================== 3) Thème (persist + système + label) ==================== */
(() => {
  const btn   = $('.theme-toggle');
  const root  = document.documentElement;
  const label = btn?.querySelector('.tt-label');

  const getSystem  = () => (mq('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  const getStored  = () => store.get('theme');

  const setLabelAria = (mode) => {
    if (!btn) return;
    const isDark = mode === 'dark';
    btn.setAttribute('aria-pressed', String(isDark));
    btn.setAttribute('aria-label', isDark ? 'Basculer en mode clair' : 'Basculer en mode sombre');
    if (label) label.textContent = isDark ? 'Dark' : 'Light';
  };

  const apply = (mode) => { root.setAttribute('data-theme', mode); setLabelAria(mode); };

  // Init : storage sinon système (limite CLS car appliqué très tôt)
  apply(getStored() || getSystem());

  // Sync système si pas de choix explicite
  const sys = mq('(prefers-color-scheme: light)');
  const syncSystem = () => { if (!getStored()) apply(getSystem()); };
  sys.addEventListener?.('change', syncSystem);

  // Toggle + persist
  on(btn, 'click', () => {
    const cur = root.getAttribute('data-theme');
    const next = (cur === 'light') ? 'dark' : 'light';
    apply(next);
    store.set('theme', next);
  }, { passive:true });

  // Alt + clic → reset (revient au thème système)
  on(btn, 'click', (e) => {
    if (!e.altKey) return;
    store.rm('theme');
    apply(getSystem());
  }, { capture:true });
})();

/* =================== 4) Modals utilitaires (focus-trap & co) =================== */
const Modal = (() => {
  const FOCUSABLE = [
    'a[href]','area[href]','button:not([disabled])','input:not([disabled])',
    'select:not([disabled])','textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  const trap = (modal) => {
    const nodes = $$(FOCUSABLE, modal);
    if (!nodes.length) return () => {};
    const first = nodes[0], last = nodes[nodes.length - 1];

    const onKey = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    on(modal, 'keydown', onKey);
    return () => off(modal, 'keydown', onKey);
  };

  const open  = (el) => {
    if (!el) return;
    el.hidden = false;
    const untrap = trap(el);
    el._untrap = untrap;
    const f = el.querySelector(FOCUSABLE);
    (f || el).focus?.();
  };

  const close = (el) => {
    if (!el) return;
    el.hidden = true;
    el._untrap?.();
  };

  const bind  = (modal) => {
    if (!modal) return;
    on(modal, 'click', (e) => { if (e.target === modal) close(modal); }, { passive:true });
    $$('.modal__close,[data-close]', modal).forEach(btn => on(btn, 'click', () => close(modal), { passive:true }));
    on(document, 'keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) close(modal); });
  };

  return { open, close, bind };
})();

/* ========== 5) Formulaire (Formspree AJAX + modal “Merci”) ========== */
(() => {
  const form   = $('#contactForm');
  if (!form) return;

  const endpoint  = form.dataset.endpoint;
  const submitBtn = $('#contactSubmit');
  const statusEl  = $('#contactStatus');
  const modal     = $('#contact-modal');

  Modal.bind(modal);

  const setStatus = (msg, isError=false) => {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.style.display = 'block';
    statusEl.setAttribute('role', 'status');
    statusEl.setAttribute('aria-live', isError ? 'assertive' : 'polite');
  };

  on(form, 'submit', async (e) => {
    e.preventDefault();
    if (!endpoint) { console.error('Formspree endpoint manquant'); return; }

    if (statusEl) statusEl.style.display = 'none';

    const fd = new FormData(form);
    if (!fd.get('_subject')) {
      fd.set('_subject', `[Site] ${fd.get('subject') || 'Nouveau message'}`);
    }

    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Envoi…'; }

    try {
      const res = await fetch(endpoint, { method:'POST', headers:{ 'Accept':'application/json' }, body:fd });
      if (res.ok) { form.reset(); Modal.open(modal); }
      else { setStatus("Oups, l’envoi a échoué. Réessayez ou contactez-moi par email.", true); }
    } catch {
      setStatus("Erreur réseau. Vérifiez votre connexion et réessayez.", true);
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Envoyer'; }
    }
  });
})();

/* ====== 6) Carousel certifications (toutes certifs = autant de puces) ====== */
(() => {
  const rail     = document.getElementById('certs-rail');
  const dotsWrap = document.querySelector('.certs-dots');
  if (!rail || !dotsWrap) return;

  // Empêche toute double initialisation (changement de page/reload partiel)
  if (rail.dataset.certsCarouselReady === '1') return;
  rail.dataset.certsCarouselReady = '1';

  // Ne prendre que les <li> DIRECTS (évite éléments parasites)
  const slides = Array.from(rail.querySelectorAll(':scope > li'));
  if (!slides.length) return;

  // Accessibilité de la zone
  rail.setAttribute('tabindex', '0');
  rail.setAttribute('role', 'region');
  rail.setAttribute('aria-label', 'Certifications (carousel)');

  // Purge systématique des anciennes puces puis recréation 1:1 avec les slides
  dotsWrap.replaceChildren();
  const dots = slides.map((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'certs-dot';
    b.setAttribute('aria-label', `Aller à la certification ${i + 1}`);
    dotsWrap.appendChild(b);
    return b;
  });

  const PREFERS_REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const centerOffsetFor = (el) => el.offsetLeft - (rail.clientWidth - el.clientWidth) / 2;
  const scrollToSlide   = (i) => {
    const el = slides[i];
    rail.scrollTo({ left: centerOffsetFor(el), behavior: PREFERS_REDUCED ? 'auto' : 'smooth' });
  };
  const setActive = (i) => dots.forEach((d, idx) => d.classList.toggle('is-active', idx === i));

  // Clic sur puces
  dots.forEach((b, i) => b.addEventListener('click', () => scrollToSlide(i), { passive: true }));

  // Détermination du slide “le plus au centre”
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      let bestI = null, bestRatio = 0;
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const i = slides.indexOf(e.target);
        if (i > -1 && e.intersectionRatio > bestRatio) { bestRatio = e.intersectionRatio; bestI = i; }
      }
      if (bestI !== null) setActive(bestI);
    }, { root: rail, threshold: [0.5, 0.6, 0.7, 0.8] });
    slides.forEach(el => io.observe(el));
  } else {
    const onScroll = () => {
      const deltas = slides.map(el => Math.abs(centerOffsetFor(el) - rail.scrollLeft));
      setActive(deltas.indexOf(Math.min(...deltas)));
    };
    rail.addEventListener('scroll', onScroll, { passive: true });
  }

  // État initial
  setActive(0);

  // Navigation clavier
  rail.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const cur  = dots.findIndex(d => d.classList.contains('is-active'));
    const next = e.key === 'ArrowRight' ? Math.min(cur + 1, slides.length - 1)
                                        : Math.max(cur - 1, 0);
    scrollToSlide(next);
  });

  // Recentrage au resize
  let rid = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame?.(rid);
    rid = requestAnimationFrame(() => {
      const current = dots.findIndex(d => d.classList.contains('is-active'));
      scrollToSlide(current < 0 ? 0 : current);
    });
  }, { passive: true });
})();

/* ================== 7) Cal.com (bouton flottant unifié) ================== */
(() => {
  const boot = () => {
    const meta = document.querySelector('meta[name="cal:link"]');
    const rawUrl = (meta?.getAttribute('content') || '').trim();
    if (!rawUrl) { console.warn('[Cal.com] Meta cal:link absente ou vide'); return; }

    const toCalSlug = (input) => {
      if (!input) return '';
      const t = input.trim().replace(/(^\/+|\/+$)/g, '');
      if (/^[^/]+\/[^/]+$/.test(t)) return t; // déjà "user/event"
      try {
        const u = new URL(t);
        const parts = u.pathname.split('/').filter(Boolean);
        if (parts.length >= 2) return parts.slice(0, 2).join('/');
      } catch {
        return t.replace(/^.*?(calendly\.com|cal\.com)\//i, '')
                .split('/').slice(0, 2).join('/');
      }
      return '';
    };

    const calSlug = toCalSlug(rawUrl);
    if (!calSlug) { console.warn('[Cal.com] Slug introuvable pour', rawUrl); return; }
    console.debug('[Cal.com] Slug =', calSlug);

    // Charge l'embed Cal une seule fois
    (function (C, A, L) {
      let p = (a, ar) => { a.q.push(ar); };
      let d = C.document;
      C.Cal = C.Cal || function () {
        let cal = C.Cal; let ar = arguments;
        if (!cal.loaded) {
          cal.ns = {}; cal.q = cal.q || [];
          const s = d.createElement('script'); s.src = A; s.async = true; s.defer = true;
          d.head.appendChild(s); cal.loaded = true;
        }
        if (ar[0] === L) {
          const api = function () { p(api, arguments); };
          const ns = ar[1]; api.q = api.q || [];
          if (typeof ns === 'string') { cal.ns[ns] = cal.ns[ns] || api; p(cal.ns[ns], ar); p(cal, ['initNamespace', ns]); }
          else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, 'https://app.cal.com/embed/embed.js', 'init');

    Cal('init', 'booking', { origin: 'https://app.cal.com' });
    Cal.ns['booking']('floatingButton', { calLink: calSlug, config: { layout: 'month_view' } });
    Cal.ns['booking']('ui', {
      cssVarsPerTheme: { light: { 'cal-brand': '#22c55e' }, dark: { 'cal-brand': '#5865f2' } },
      hideEventTypeDetails: false,
      layout: 'month_view'
    });
  };

  // ⚠️ Attend que la meta (dans le body) soit parsée
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();


/* ================== 8) Copy to clipboard (contacts) ================== */
(() => {
  const rows = $$('.contact-row');
  if (!rows.length) return;

  const resolveText = (row) => {
    const btn  = row.querySelector('.ci-copy-btn');
    if (!btn) return null;

    // 1) Valeur explicite
    const explicit = btn.getAttribute('data-copy');
    if (explicit && explicit.trim()) return explicit.trim();

    // 2) Sinon, déduire du lien voisin
    const link = row.querySelector('.contact-item[href]');
    if (link) {
      const href = (link.getAttribute('href') || '').trim();
      if (/^mailto:/i.test(href)) return decodeURIComponent(href.replace(/^mailto:/i,'')).replace(/\?.*$/,'');
      if (/^tel:/i.test(href))    return href.replace(/^tel:/i,'');
    }

    // 3) Sinon, le texte fort
    const strong = row.querySelector('.ci-body strong');
    return strong?.textContent?.trim() || null;
  };

  const copyText = async (txt) => {
    if (!txt) throw new Error('Nothing to copy');
    try {
      await navigator.clipboard.writeText(txt);
      return true;
    } catch {
      // Fallback (HTTP / permissions)
      const ta = document.createElement('textarea');
      ta.value = txt;
      ta.setAttribute('readonly','');
      ta.style.position='fixed';
      ta.style.opacity='0';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch {}
      document.body.removeChild(ta);
      return ok;
    }
  };

  rows.forEach(row => {
    const btn = row.querySelector('.ci-copy-btn');
    if (!btn) return;

    // Région a11y pour annoncer le statut
    const announcer = (() => {
      let live = row.querySelector('.sr-only[role="status"]');
      if (!live) {
        live = document.createElement('span');
        live.className = 'sr-only';
        live.setAttribute('role','status');
        live.setAttribute('aria-live','polite');
        row.appendChild(live);
      }
      return (msg) => { live.textContent = msg; };
    })();

    on(btn, 'click', async (e) => {
      e.preventDefault();       // évite un submit accidentel
      e.stopPropagation();      // évite le clic sur le <a> voisin

      const value = btn.getAttribute('data-copy')?.trim() || resolveText(row);
      if (!value) return;

      const prev = btn.innerHTML;
      try {
        const ok = await copyText(value);
        // Feedback visuel + a11y
        btn.classList.add('is-copied');
        btn.setAttribute('aria-label', ok ? 'Copié !' : 'Échec de la copie');
        btn.innerHTML = ok ? '✓' : '!';
        announcer(ok ? 'Copié dans le presse-papier' : 'La copie a échoué');
      } finally {
        setTimeout(() => {
          btn.classList.remove('is-copied');
          btn.innerHTML = prev;
          btn.setAttribute('aria-label', 'Copier');
        }, 1200);
      }
    }, { passive:false });
  });
})();

/* ================== 9) Fallback si un logo casse (certifications) ================== */
(() => {
  document.querySelectorAll('.cert-logo').forEach(img => {
    img.addEventListener('error', () => {
      const wrap = img.closest('.cert-badge');
      if (!wrap) return;
      wrap.innerHTML = `
        <svg class="cert-ph" width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
          <defs>
            <linearGradient id="gradABM" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="currentColor" stop-opacity=".25"/>
              <stop offset="1" stop-color="currentColor" stop-opacity=".55"/>
            </linearGradient>
          </defs>
          <rect x="0.5" y="0.5" width="55" height="55" rx="12" fill="url(#gradABM)" stroke="currentColor" opacity=".5"/>
          <g transform="translate(0,1)">
            <path d="M20 28h16M28 20v16" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity=".9"/>
          </g>
        </svg>`;
    }, { once: true });
  });
})();
