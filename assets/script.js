/* ===========================================================================
   ABM — JS unifié (premium, moderne & épuré) — VERSION SEO/PERF
   =========================================================================== */
'use strict';

/* ========================= 0) Timing helpers ========================= */
const runIdle = (fn) => {
  if ('requestIdleCallback' in window) requestIdleCallback(fn, { timeout: 1800 });
  else setTimeout(fn, 1);
};
const raf = (fn) => (window.requestAnimationFrame || ((f)=>setTimeout(f,16)))(fn);

/* ========================= 1) Utils légers ========================= */
const $   = (sel, scope=document) => scope.querySelector(sel);
const $$  = (sel, scope=document) => Array.from(scope.querySelectorAll(sel));
const on  = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);
const off = (el, ev, fn, opts) => el && el.removeEventListener(ev, fn, opts);
const mq  = (q) => window.matchMedia ? window.matchMedia(q) : { matches:false, addEventListener(){}, removeEventListener(){} };

const PREFERS_REDUCED = mq('(prefers-reduced-motion: reduce)').matches;

/* Storage safe */
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

  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'nav-collapsible');

  on(toggle, 'click', () => setState(!panel.classList.contains('open')), { passive:true });
  on(panel, 'click', (e) => { if (e.target.closest('a,button')) setState(false); }, { passive:true });

  const bp = mq('(min-width: 992px)');
  const onChange = () => { if (bp.matches) setState(false); };
  bp.addEventListener?.('change', onChange);
})();

/* ==================== 2.1) Header UX (shrink + active link) ==================== */
(() => {
  const header = document.querySelector('.site-header');
  if (!header) return;

  // Shrink on scroll
  const onScroll = () => {
    const sc = window.scrollY || document.documentElement.scrollTop;
    header.classList.toggle('is-scrolled', sc > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Active link highlight by section in view (robuste)
  const ids = ['certifications','methodes','services','realisation','contact'];
  const sections = ids.map(id => document.getElementById(id)).filter(Boolean);
  if (!sections.length) return;

  const navLinks = Array.from(document.querySelectorAll('.nav-desktop .nav-inline a'));
  const byId = (id) => navLinks.find(a => (a.getAttribute('href') || '').includes('#'+id));
  const setActive = (id) => {
    navLinks.forEach(a => { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
    const link = byId(id);
    if (link) { link.classList.add('is-active'); link.setAttribute('aria-current','true'); }
  };

  // Accent bar color shift on nav hover/focus
  const applyAccent = (hot) => {
    const a = hot ? 'color-mix(in oklab, var(--brand) 75%, #fff 25%)' : 'var(--brand)';
    const b = hot ? 'color-mix(in oklab, var(--brand-2) 75%, #fff 25%)' : 'var(--brand-2)';
    header.style.setProperty('--accent-a', a);
    header.style.setProperty('--accent-b', b);
  };
  navLinks.forEach(a => {
    a.addEventListener('mouseenter', () => applyAccent(true), { passive: true });
    a.addEventListener('mouseleave', () => applyAccent(false), { passive: true });
    a.addEventListener('focus', () => applyAccent(true), { passive: true });
    a.addEventListener('blur', () => applyAccent(false), { passive: true });
  });

  // Maintient un score par section pour éviter le "collant" sur la première
  const ratios = new Map(sections.map(s => [s.id, 0]));

  const pickBest = () => {
    let bestId = null, best = -1;
    for (const s of sections) {
      const r = ratios.get(s.id) || 0;
      if (r > best) { best = r; bestId = s.id; }
    }
    if (bestId) setActive(bestId);
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        ratios.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
      }
      pickBest();
    }, { root: null, threshold: [0, 0.2, 0.35, 0.5, 0.65, 0.8, 1], rootMargin: '-10% 0px -35% 0px' });
    sections.forEach(s => io.observe(s));
  } else {
    // Fallback: calcule le ratio visible à chaque scroll
    const calc = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      for (const s of sections) {
        const r = s.getBoundingClientRect();
        const visible = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
        const ratio = Math.min(1, visible / Math.max(1, r.height));
        ratios.set(s.id, ratio);
      }
      pickBest();
    };
    window.addEventListener('scroll', () => raf(calc), { passive: true });
    window.addEventListener('resize', () => raf(calc));
    calc();
  }
})();

/* ==================== 3) Thème (persist + système + label) ==================== */
(() => {
  const btn   = $('.theme-toggle');
  const root  = document.documentElement;
  const label = btn?.querySelector('.tt-label');

  const getSystem = () => (mq('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  const getStored = () => store.get('theme');
  const setLabelAria = (mode) => {
    if (!btn) return;
    const isDark = mode === 'dark';
    btn.setAttribute('aria-pressed', String(isDark));
    btn.setAttribute('aria-label', isDark ? 'Basculer en mode clair' : 'Basculer en mode sombre');
    if (label) label.textContent = isDark ? 'Dark' : 'Light';
  };
  const apply = (mode) => { root.setAttribute('data-theme', mode); setLabelAria(mode); };

  apply(getStored() || getSystem());

  const sys = mq('(prefers-color-scheme: light)');
  const syncSystem = () => { if (!getStored()) apply(getSystem()); };
  sys.addEventListener?.('change', syncSystem);

  on(btn, 'click', () => {
    const cur = root.getAttribute('data-theme');
    const next = (cur === 'light') ? 'dark' : 'light';
    apply(next); store.set('theme', next);
  }, { passive:true });

  on(btn, 'click', (e) => {
    if (!e.altKey) return;
    store.rm('theme'); apply(getSystem());
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
    el._untrap = trap(el);
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
    on(modal, 'click', (e) => {
      if (e.target === modal || e.target.classList?.contains('modal__overlay') || e.target.dataset.close === 'true') close(modal);
    });
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
    if (!fd.get('_subject')) fd.set('_subject', `[Site] ${fd.get('subject') || 'Nouveau message'}`);

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

/* ====== 6) Carousel certifications (dots + centre) ====== */
(() => {
  const rail     = document.getElementById('certs-rail');
  const dotsWrap = document.querySelector('.certs-dots');
  if (!rail || !dotsWrap) return;
  if (rail.dataset.certsCarouselReady === '1') return;
  rail.dataset.certsCarouselReady = '1';

  const slides = Array.from(rail.querySelectorAll(':scope > li'));
  if (!slides.length) return;

  rail.setAttribute('tabindex', '0');
  rail.setAttribute('role', 'region');
  rail.setAttribute('aria-label', 'Certifications (carousel)');

  dotsWrap.replaceChildren();
  const dots = slides.map((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'certs-dot';
    b.setAttribute('aria-label', `Aller à la certification ${i + 1}`);
    dotsWrap.appendChild(b);
    return b;
  });

  const centerOffsetFor = (el) => el.offsetLeft - (rail.clientWidth - el.clientWidth) / 2;
  const scrollToSlide = (i) => rail.scrollTo({ left: centerOffsetFor(slides[i]), behavior: PREFERS_REDUCED ? 'auto' : 'smooth' });
  const setActive = (i) => dots.forEach((d, idx) => d.classList.toggle('is-active', idx === i));

  dots.forEach((b, i) => b.addEventListener('click', () => scrollToSlide(i), { passive: true }));

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

  setActive(0);

  rail.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const cur  = dots.findIndex(d => d.classList.contains('is-active'));
    const next = e.key === 'ArrowRight' ? Math.min(cur + 1, slides.length - 1) : Math.max(cur - 1, 0);
    scrollToSlide(next);
  });

  let rid = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame?.(rid);
    rid = requestAnimationFrame(() => {
      const current = dots.findIndex(d => d.classList.contains('is-active'));
      scrollToSlide(current < 0 ? 0 : current);
    });
  }, { passive: true });
})();

/* ===== Certifications: limiter les tags + toggle "Afficher plus" ===== */
(() => {
  const lists = document.querySelectorAll('.cert-card .cert-tags');
  lists.forEach(ul => {
    const items = ul.querySelectorAll('.tag');
    if (items.length <= 5) return;
    ul.classList.add('is-collapsed');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tags-toggle';
    btn.textContent = 'Afficher plus';
    btn.addEventListener('click', () => {
      const collapsed = ul.classList.toggle('is-collapsed');
      btn.textContent = collapsed ? 'Afficher plus' : 'Afficher moins';
    });
    ul.after(btn);
  });
})();

/* ================== 7) Cal.com (inline + bouton flottant + boutons) ================== */
(() => {
  const boot = () => {
    const meta = document.querySelector('meta[name="cal:link"]');
    const rawUrl = (meta?.getAttribute('content') || '').trim();
    if (!rawUrl) return;

    const toCalSlug = (input) => {
      if (!input) return '';
      const t = input.trim().replace(/(^\/+|\/+$)/g, '');
      if (/^[^/]+\/[^/]+$/.test(t)) return t.toLowerCase();
      try {
        const u = new URL(t);
        const parts = u.pathname.split('/').filter(Boolean);
        if (parts.length >= 2) return (parts[0] + '/' + parts[1]).toLowerCase();
      } catch {
        const bits = t.replace(/^.*?(calendly\.com|cal\.com)\//i, '').split('/').filter(Boolean);
        if (bits.length >= 2) return (bits[0] + '/' + bits[1]).toLowerCase();
      }
      return '';
    };
    const calSlug = toCalSlug(rawUrl);
    if (!calSlug) return;

    // ------------------------------------------------------------------
    // Chargement Cal.com (inchangé)
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
    Cal.ns['booking']('ui', {
      cssVarsPerTheme: { light: { 'cal-brand': 'var(--brand)' }, dark: { 'cal-brand': 'var(--brand)' } },
      hideEventTypeDetails: false,
      layout: 'month_view'
    });

    // ------------------------------------------------------------------
    // Bouton flottant (conservé)
    if (!document.querySelector('.cal-float-cta')) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cal-float-cta';
      btn.setAttribute('aria-label', 'Prendre rendez-vous');
      btn.setAttribute('data-cal-namespace', 'booking');
      btn.setAttribute('data-cal-link', calSlug);
      btn.innerHTML = `
        <span class="cal-ico" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
            <rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" stroke-width="2"/>
            <path d="M8 3v4M16 3v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </span>
        <span class="cal-label">Prendre rendez-vous</span>`;
      document.body.appendChild(btn);
    }
    if (!document.getElementById('cal-float-cta-style')) {
      const st = document.createElement('style');
      st.id = 'cal-float-cta-style';
      st.textContent = `
        .cal-float-cta{ position:fixed; right:18px; bottom:18px; z-index:9999;
          display:inline-flex; align-items:center; gap:.55rem; padding:.85rem 1.1rem;
          border-radius:999px; border:0; background-image:var(--g-brand); color:#fff; font-weight:800;
          box-shadow:0 12px 26px color-mix(in oklab, var(--brand) 30%, transparent); cursor:pointer; }
        .cal-float-cta:hover{ transform:translateY(-1px); box-shadow:0 16px 30px color-mix(in oklab, var(--brand) 36%, transparent); }
        .cal-float-cta:focus-visible{ outline:none;
          box-shadow:0 0 0 3px color-mix(in oklab, #fff 80%, transparent), 0 0 0 6px color-mix(in oklab, var(--brand) 50%, transparent); }
        .cal-float-cta .cal-ico{ display:grid; place-items:center; }
        @media (max-width:480px){ .cal-float-cta{ right:12px; bottom:12px; padding:.75rem .95rem; } }`;
      document.head.appendChild(st);
    }

    // ------------------------------------------------------------------
    // Clics sur les éléments marqués data-cal-namespace="booking"
    document.querySelectorAll('[data-cal-namespace="booking"]').forEach(el => {
      el.setAttribute('data-cal-link', calSlug);
      el.addEventListener('click', (e) => {
        e.preventDefault();
        try { if (typeof Cal?.ns?.booking === 'function') Cal.ns['booking']('open', { calLink: calSlug }); } catch {}
      }, { passive: true });
    });

    // ------------------------------------------------------------------
    // Inline embed (desktop only) + MASQUER le gros bouton sous le calendrier sur desktop
    const parentD = document.getElementById('calendly-inline-embed');
    const mqDesk  = window.matchMedia ? window.matchMedia('(min-width: 992px)') : { matches: true };

    // masque/affiche la rangée CTA centrée selon la largeur
    const actionsRow = document.querySelector('.contact-v2 .actions--center');
    const toggleInlineCTAVisibility = () => {
      if (!actionsRow) return;
      // sur desktop : on cache la rangée CTA (le “gros” bouton sous le calendrier)
      actionsRow.style.display = mqDesk.matches ? 'none' : '';
      actionsRow.setAttribute('aria-hidden', mqDesk.matches ? 'true' : 'false');
    };
    toggleInlineCTAVisibility();
    mqDesk.addEventListener?.('change', toggleInlineCTAVisibility);

    const initInline = () => {
      if (!parentD) return;
      const cleanSkeleton = () => parentD.querySelector('.calendly-skeleton')?.remove();
      Cal.ns['booking']('inline', { elementOrSelector: '#calendly-inline-embed', calLink: calSlug, config:{ layout:'month_view', theme:'auto' } });
      const obs = new MutationObserver(() => {
        if (parentD.querySelector('iframe') || parentD.shadowRoot) { cleanSkeleton(); obs.disconnect(); }
      });
      obs.observe(parentD, { childList: true, subtree: true });
      setTimeout(cleanSkeleton, 3000);
    };

    const bootInlineDesktop = () => {
      if (!parentD || !mqDesk.matches) return;
      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
          if (entries.some(e => e.isIntersecting)) { io.disconnect(); initInline(); }
        }, { threshold: 0.35 });
        io.observe(parentD);
      } else initInline();
    };

    bootInlineDesktop();
    mqDesk.addEventListener?.('change', (e) => { if (e.matches) bootInlineDesktop(); });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();


/* ================== 8) Copy to clipboard (contacts) ================== */
(() => {
  const rows = $$('.contact-row');
  if (!rows.length) return;

  const resolveText = (row) => {
    const btn  = row.querySelector('.ci-copy-btn');
    if (!btn) return null;
    const explicit = btn.getAttribute('data-copy');
    if (explicit && explicit.trim()) return explicit.trim();
    const link = row.querySelector('.contact-item[href]');
    if (link) {
      const href = (link.getAttribute('href') || '').trim();
      if (/^mailto:/i.test(href)) return decodeURIComponent(href.replace(/^mailto:/i,'')).replace(/\?.*$/,'');
      if (/^tel:/i.test(href))    return href.replace(/^tel:/i,'');
    }
    const strong = row.querySelector('.ci-body strong');
    return strong?.textContent?.trim() || null;
  };

  const copyText = async (txt) => {
    if (!txt) throw new Error('Nothing to copy');
    try { await navigator.clipboard.writeText(txt); return true; }
    catch {
      const ta = document.createElement('textarea');
      ta.value = txt; ta.setAttribute('readonly','');
      ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta);
      ta.select(); let ok = false; try { ok = document.execCommand('copy'); } catch {}
      document.body.removeChild(ta); return ok;
    }
  };

  rows.forEach(row => {
    const btn = row.querySelector('.ci-copy-btn'); if (!btn) return;
    const announcer = (() => {
      let live = row.querySelector('.sr-only[role="status"]');
      if (!live) { live = document.createElement('span'); live.className='sr-only'; live.setAttribute('role','status'); live.setAttribute('aria-live','polite'); row.appendChild(live); }
      return (msg) => { live.textContent = msg; };
    })();

    on(btn, 'click', async (e) => {
      e.preventDefault(); e.stopPropagation();
      const value = btn.getAttribute('data-copy')?.trim() || resolveText(row);
      if (!value) return;
      const prev = btn.innerHTML;
      try {
        const ok = await copyText(value);
        btn.classList.add('is-copied');
        btn.setAttribute('aria-label', ok ? 'Copié !' : 'Échec de la copie');
        btn.innerHTML = ok ? '✓' : '!';
        announcer(ok ? 'Copié dans le presse-papier' : 'La copie a échoué');
      } finally {
        setTimeout(() => {
          btn.classList.remove('is-copied'); btn.innerHTML = prev; btn.setAttribute('aria-label', 'Copier');
        }, 1200);
      }
    }, { passive:false });
  });
})();

/* ================== 9) Fallback logos certifications ================== */
(() => {
  document.querySelectorAll('.cert-logo').forEach(img => {
    img.addEventListener('error', () => {
      const wrap = img.closest('.cert-badge'); if (!wrap) return;
      wrap.innerHTML = `
        <svg class="cert-ph" width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
          <defs><linearGradient id="gradABM" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="currentColor" stop-opacity=".25"/><stop offset="1" stop-color="currentColor" stop-opacity=".55"/>
          </linearGradient></defs>
          <rect x="0.5" y="0.5" width="55" height="55" rx="12" fill="url(#gradABM)" stroke="currentColor" opacity=".5"/>
          <g transform="translate(0,1)"><path d="M20 28h16M28 20v16" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity=".9"/></g>
        </svg>`;
    }, { once: true });
  });
})();

/* ================== 10) Modal Projet (home) ================== */
(() => {
  const modal = document.getElementById('project-modal');
  if (!modal) return;
  Modal.bind(modal);

  const titleEl    = document.getElementById('project-title');
  const clientEl   = document.getElementById('project-client');
  const abstractEl = document.getElementById('project-abstract');
  const ctxEl      = document.getElementById('project-contexte');
  const missionsEl = document.getElementById('project-missions');
  const benefEl    = document.getElementById('project-benefices');
  const stackEl    = document.getElementById('project-stack');
  const linkEl     = document.getElementById('project-link');

  // --- conversions robustes ---
  const toArray = (value) => {
    if (Array.isArray(value)) return value;
    if (value == null) return [];
    if (typeof value === 'string') {
      const s = value.trim();
      if (!s || s.toLowerCase() === 'null' || s.toLowerCase() === 'undefined') return [];
      if (s.startsWith('[') || s.startsWith('{')) {
        try {
          const parsed = JSON.parse(s);
          if (Array.isArray(parsed)) return parsed;
          if (parsed && typeof parsed === 'object') return Object.values(parsed);
        } catch {}
      }
      const SEP = ['•', '|', ';'].find(sep => s.includes(sep));
      if (SEP) return s.split(SEP).map(t => t.trim()).filter(Boolean);
      return [s];
    }
    try { return JSON.parse(String(value)); } catch { return []; }
  };
  const renderList = (ul, data) => {
    ul.innerHTML = '';
    toArray(data).forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      ul.appendChild(li);
    });
  };

  function fill(card){
    titleEl.textContent    = card.dataset.title || '';
    clientEl.textContent   = card.dataset.client ? `Client : ${card.dataset.client}` : '';
    abstractEl.textContent = card.dataset.abstract || '';
    ctxEl.textContent      = card.dataset.contexte || '';
    renderList(missionsEl,  card.dataset.missions);
    renderList(benefEl,     card.dataset.benefices);
    renderList(stackEl,     card.dataset.stack);
    if (linkEl) {
      if (card.dataset.link) { linkEl.href = card.dataset.link; linkEl.setAttribute('aria-label', `Ouvrir ${card.dataset.title}`); }
      else { linkEl.removeAttribute('href'); }
    }
  }

  // Ouverture depuis les cartes
  document.querySelectorAll('.project-card').forEach(card => {
    const open = (e) => { e?.preventDefault?.(); fill(card); Modal.open(modal); };
    card.querySelector('.open-project')?.addEventListener('click', open);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { open(e); } });
    card.addEventListener('click', e => {
      if (e.target.closest('a, .open-project')) return;
      open(e);
    });
  });
})();

/* ================== 11) Carousel (réalisations) — dots + autoplay ================== */
(() => {
  const carousels = document.querySelectorAll('[data-carousel]');
  if (!carousels.length) return;

  carousels.forEach(root => {
    const track = root.querySelector('.carousel__track');
    const slides = Array.from(track.querySelectorAll('.carousel__slide'));
    const prev  = root.querySelector('.carousel__btn.prev');
    const next  = root.querySelector('.carousel__btn.next');
    const dotsWrap = root.querySelector('.carousel__dots');
    if (!slides.length) return;

    // Offsets simples (alignement au début) pour robustesse et atteinte des extrémités
    let offsets = [];
    const computeOffsets = () => { offsets = slides.map(s => s.offsetLeft); };
    const closestIndex = () => {
      const x = track.scrollLeft; let best = 0, bestDist = 1e9;
      offsets.forEach((off, i) => { const d = Math.abs(off - x); if (d < bestDist){ best = i; bestDist = d; } });
      return best;
    };
    const scrollToIndex = (i, smooth=true) => {
      let target = i;
      let wrap = false;
      if (i < 0) { target = slides.length - 1; wrap = true; }
      else if (i >= slides.length) { target = 0; wrap = true; }
      const left = offsets[target] ?? 0;
      const behavior = (smooth && !PREFERS_REDUCED && !wrap) ? 'smooth' : 'auto';
      track.scrollTo({ left, behavior });
      setTimeout(updateUI, behavior === 'smooth' ? 300 : 0);
      restartAutoplay();
    };
    const updateArrows = () => { prev.disabled = false; next.disabled = false; };

    const dots = slides.map((_, i) => {
      const b = document.createElement('button');
      b.type='button'; b.className='carousel__dot';
      b.setAttribute('aria-label', `Aller à la réalisation ${i+1}`);
      b.addEventListener('click', () => scrollToIndex(i));
      dotsWrap.appendChild(b); return b;
    });
    const updateDots = (i=closestIndex()) => dots.forEach((d,k)=>d.classList.toggle('is-active', k===i));
    const updateUI = () => { const i = closestIndex(); updateArrows(i); updateDots(i); };

    const AUTOPLAY_MS = 5000; let timer=null;
    const startAutoplay = () => { if (!timer) timer = setInterval(() => { let i = closestIndex()+1; if (i>=slides.length) i=0; scrollToIndex(i); }, AUTOPLAY_MS); };
    const stopAutoplay  = () => { clearInterval(timer); timer=null; };
    const restartAutoplay = () => { stopAutoplay(); startAutoplay(); };

    root.addEventListener('pointerenter', stopAutoplay);
    root.addEventListener('pointerleave', startAutoplay);
    root.addEventListener('focusin', stopAutoplay);
    root.addEventListener('focusout', startAutoplay);

    const atStart = () => track.scrollLeft <= 3;
    const atEnd   = () => Math.abs(track.scrollLeft + track.clientWidth - track.scrollWidth) < 4;

    prev.addEventListener('click', () => {
      if (atStart()) scrollToIndex(-1); // force wrap -> dernier
      else scrollToIndex(closestIndex()-1);
    });
    next.addEventListener('click', () => {
      if (atEnd()) scrollToIndex(slides.length); // force wrap -> premier
      else scrollToIndex(closestIndex()+1);
    });
    track.addEventListener('scroll', () => { raf(updateUI); });
    window.addEventListener('resize', () => { computeOffsets(); updateUI(); });

    // Calcul initial des positions puis forcer l'ancrage au premier slide
    computeOffsets();
    // S'assure que le carrousel démarre sur la première réalisation
    scrollToIndex(0, false);
    updateUI();
    startAutoplay();
    document.addEventListener('visibilitychange', () => { if (document.hidden) stopAutoplay(); else startAutoplay(); });
  });
})();


// ===== Réalisations (rail + dots) — copie adaptée des certifications =====
(() => {
  const rail     = document.getElementById('works-rail');
  const dotsWrap = document.querySelector('.works-dots');
  if (!rail || !dotsWrap) return;

  // idempotence
  if (rail.dataset.worksCarouselReady === '1') return;
  rail.dataset.worksCarouselReady = '1';

  // slides = <li> directs
  const slides = Array.from(rail.querySelectorAll(':scope > li'));
  if (!slides.length) return;

  // a11y zone
  rail.setAttribute('tabindex', '0');
  rail.setAttribute('role', 'region');
  rail.setAttribute('aria-label', 'Réalisations (carousel)');

  // dots = 1:1
  dotsWrap.replaceChildren();
  const dots = slides.map((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'works-dot';
    b.setAttribute('aria-label', `Aller à la réalisation ${i + 1}`);
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

  dots.forEach((b, i) => b.addEventListener('click', () => scrollToSlide(i), { passive: true }));

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

  setActive(0);

  rail.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const cur  = dots.findIndex(d => d.classList.contains('is-active'));
    const next = e.key === 'ArrowRight' ? Math.min(cur + 1, slides.length - 1) : Math.max(cur - 1, 0);
    scrollToSlide(next);
  });

  let rid = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame?.(rid);
    rid = requestAnimationFrame(() => {
      const current = dots.findIndex(d => d.classList.contains('is-active'));
      scrollToSlide(current < 0 ? 0 : current);
    });
  }, { passive: true });
})();

// ===== Patch robustesse pour le modal projet (évite "forEach of null") =====
(() => {
  const modal = document.getElementById('project-modal');
  if (!modal) return;

  const titleEl    = document.getElementById('project-title');
  const clientEl   = document.getElementById('project-client');
  const abstractEl = document.getElementById('project-abstract');
  const ctxEl      = document.getElementById('project-contexte');
  const missionsEl = document.getElementById('project-missions');
  const benefEl    = document.getElementById('project-benefices');
  const stackEl    = document.getElementById('project-stack');
  const linkEl     = document.getElementById('project-link');

  // remplace la version précédente : si ce n’est pas un array -> []
  const safeParse = (str, fallback = []) => {
    try {
      const v = JSON.parse(str);
      return Array.isArray(v) ? v : fallback;
    } catch { return fallback; }
  };
  const renderList = (ul, arr) => { ul.innerHTML = ''; arr.forEach(t => { const li = document.createElement('li'); li.textContent = t; ul.appendChild(li); }); };

  function fill(card){
    titleEl.textContent    = card.dataset.title || '';
    clientEl.textContent   = card.dataset.client ? `Client : ${card.dataset.client}` : '';
    abstractEl.textContent = card.dataset.abstract || '';
    ctxEl.textContent      = card.dataset.contexte || '';
    renderList(missionsEl, safeParse(card.dataset.missions));
    renderList(benefEl,    safeParse(card.dataset.benefices));
    renderList(stackEl,    safeParse(card.dataset.stack));
    if (linkEl) {
      if (card.dataset.link) { linkEl.href = card.dataset.link; linkEl.setAttribute('aria-label', `Ouvrir ${card.dataset.title}`); }
      else { linkEl.removeAttribute('href'); }
    }
  }

  document.querySelectorAll('.project-card').forEach(card => {
    const open = (e) => { e?.preventDefault?.(); fill(card); Modal.open(modal); };
    card.querySelector('.open-project')?.addEventListener('click', open);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { open(e); } });
    card.addEventListener('click', e => { if (!e.target.closest('a, .open-project')) open(e); });
  });
})();

