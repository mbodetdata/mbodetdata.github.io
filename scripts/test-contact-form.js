/* Test fonctionnel du formulaire de contact et de son anti-spam, via jsdom.
   Charge le vrai pages/contact.html et le vrai assets/js/main.js.

   Usage :  npm install jsdom  puis  node scripts/test-contact-form.js .
   Le verdict n8n vient de scripts/antispam-verdict.js, copie de reference unique. */
const fs = require('fs');
const path = require('path');
let jsdom;
try {
  jsdom = require('jsdom');
} catch (e) {
  console.error('jsdom introuvable. Depuis la racine du site :  npm install jsdom');
  process.exit(2);
}
const { JSDOM, VirtualConsole } = jsdom;

const SITE = process.argv[2] || '.';
const read = p => fs.readFileSync(path.join(SITE, p), 'utf8');

/* --- HTML : on retire le front matter, les balises Liquid et les canvas --- */
let page = read('pages/contact.html');
page = page.replace(/^---[\s\S]*?---\n/, '');
page = page.replace(/\{%[\s\S]*?%\}/g, '').replace(/\{\{[\s\S]*?\}\}/g, 'texte');
page = page.replace(/<canvas[\s\S]*?<\/canvas>/g, '');

const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"></head>
<body class="page-contact">${page}</body></html>`;

const results = [];
function check(name, cond, detail) {
  results.push({ name, ok: !!cond, detail: detail || '' });
  console.log((cond ? 'OK   ' : 'FAIL ') + name + (detail ? '  — ' + detail : ''));
}

/* --- Verdict n8n : copie de reference partagee avec le noeud Code --- */
const { HP_SECRET, hpToken, verdict } = require('./antispam-verdict');
const n8nToken = hpToken;
const n8nVerdict = body => { const v = verdict(body); return { spam: v.spam, reasons: v.spam_reasons }; };

function boot() {
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => { if (!/Not implemented/.test(e.message)) console.error('DOM ERROR:', e.message); });
  const dom = new JSDOM(html, { runScripts: 'outside-only', virtualConsole: vc, url: 'https://bmdata.fr/contact/' });
  const w = dom.window;

  w.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
  w.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
  w.requestAnimationFrame = cb => setTimeout(() => cb(Date.now()), 0);
  w.scrollTo = () => {};
  w.HTMLElement.prototype.scrollIntoView = function () {};

  const calls = [];
  w.fetch = (url, opts) => {
    const entry = { url, opts, body: JSON.parse(opts.body) };
    calls.push(entry);
    entry.promise = new Promise((resolve, reject) => { entry.resolve = resolve; entry.reject = reject; });
    return entry.promise;
  };
  w.AbortController = class { constructor() { this.signal = {}; } abort() {} };

  w.eval(read('assets/js/main.js'));
  return { w, d: w.document, calls };
}

/* Saisie « humaine » : evenements reels, comme un visiteur. */
function type(w, el, value) {
  el.value = value;
  el.dispatchEvent(new w.Event('keydown', { bubbles: true }));
  el.dispatchEvent(new w.Event('input', { bubbles: true }));
  el.dispatchEvent(new w.Event('change', { bubbles: true }));
}
const submit = (w, form) => form.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
const tick = () => new Promise(r => setTimeout(r, 30));

(async function run() {

  /* ═══ 1. Visiteur humain ═══ */
  {
    const { w, d, calls } = boot();
    const form = d.getElementById('contact-form');
    check('1. honeypot present dans le HTML livre', !!d.getElementById('website'));
    check('1. honeypot hors ordre de tabulation', d.getElementById('website').getAttribute('tabindex') === '-1');
    check('1. honeypot sans autocomplete', d.getElementById('website').getAttribute('autocomplete') === 'off');
    check('1. honeypot non requis', !d.getElementById('website').hasAttribute('required'));

    type(w, d.getElementById('firstname'), 'Jean');
    type(w, d.getElementById('lastname'), 'Dupont');
    type(w, d.getElementById('email'), 'jean@exemple.fr');
    type(w, d.getElementById('message'), 'Bonjour, j ai besoin d un tableau de bord.');
    await new Promise(r => setTimeout(r, 120));
    submit(w, form);
    await tick();

    check('1. requete envoyee au webhook', calls.length === 1, calls.length + ' appel(s)');
    const body = calls[0] && calls[0].body;
    check('1. honeypot transmis et vide', body && body.antispam.hp === '');
    check('1. jeton conforme cote n8n', body && n8nToken(body.antispam.ts) === body.antispam.token, body && body.antispam.token);
    check('1. interactions comptees', body && body.antispam.interactions >= 3, body && String(body.antispam.interactions));
    check('1. donnees metier intactes', body && body.email === 'jean@exemple.fr' && body.full_name === 'Jean Dupont');
    check('1. bouton en cours d envoi', d.getElementById('pf-submit').disabled);

    /* Verdict n8n : legitime, sauf le delai de 3 s qu on force ici */
    const v = n8nVerdict(Object.assign({}, body, { antispam: Object.assign({}, body.antispam, { page_ms: 12000 }) }));
    check('1. n8n classe le message en legitime', !v.spam, v.reasons.join(', '));

    calls[0].resolve({ ok: true, status: 200, headers: { get: () => 'application/json' }, json: async () => ({ ok: true }) });
    await tick();
    check('1. ecran de succes affiche', d.getElementById('pf-success').style.display === 'block');
    check('1. formulaire masque', form.style.display === 'none');
    check('1. bouton reinitialise', !d.getElementById('pf-submit').disabled);
  }

  /* ═══ 2. Robot qui remplit tous les champs, honeypot compris ═══ */
  {
    const { w, d, calls } = boot();
    const form = d.getElementById('contact-form');
    ['firstname', 'lastname', 'company'].forEach(id => { d.getElementById(id).value = 'Spam'; });
    d.getElementById('email').value = 'spam@casino-bot.xyz';
    d.getElementById('message').value = 'Cheap SEO backlinks';
    d.getElementById('website').value = 'http://spam.example';
    submit(w, form);
    await tick();

    check('2. succes simule immediatement', d.getElementById('pf-success').style.display === 'block');
    check('2. aucune erreur exploitable affichee', d.getElementById('pf-error').style.display !== 'block');
    check('2. transmis a n8n pour quarantaine', calls.length === 1);
    const v = calls[0] && n8nVerdict(calls[0].body);
    check('2. n8n classe en spam', v && v.spam, v && v.reasons.join(', '));
    check('2. motif honeypot remonte', v && v.reasons.some(r => r.startsWith('honeypot')), v && v.reasons.join(', '));
    check('2. bouton jamais bloque', !d.getElementById('pf-submit').disabled);
    /* Le robot ne doit rien apprendre : meme rendu qu un envoi reussi */
    calls[0].reject(new Error('n8n indisponible'));
    await tick();
    check('2. echec reseau invisible pour le robot', d.getElementById('pf-error').style.display !== 'block');
  }

  /* ═══ 3. Robot qui evite le honeypot mais n interagit pas ═══ */
  {
    const { w, d, calls } = boot();
    const form = d.getElementById('contact-form');
    d.getElementById('firstname').value = 'Bot';
    d.getElementById('lastname').value = 'Net';
    d.getElementById('email').value = 'bot@spam.xyz';
    d.getElementById('message').value = 'Buy now';
    submit(w, form);
    await tick();

    const body = calls[0] && calls[0].body;
    check('3. requete envoyee (le tri revient a n8n)', calls.length === 1);
    check('3. aucune interaction enregistree', body && body.antispam.interactions === 0);
    check('3. remplissage instantane detecte', body && body.antispam.page_ms < 3000, body && body.antispam.page_ms + ' ms');
    const v = body && n8nVerdict(body);
    check('3. n8n classe en spam', v && v.spam, v && v.reasons.join(', '));
  }

  /* ═══ 4. POST direct sur le webhook (sans passer par la page) ═══ */
  {
    const direct = { first_name: 'Direct', last_name: 'Post', email: 'a@b.fr', message: 'spam' };
    const v1 = n8nVerdict(direct);
    check('4. POST direct sans metadonnees classe en spam', v1.spam, v1.reasons.join(', '));
    const forged = { first_name: 'Direct', last_name: 'Post', email: 'a@b.fr',
      antispam: { hp: '', ts: Date.now(), token: 'nimporte', page_ms: 9000, interactions: 12 } };
    const v2 = n8nVerdict(forged);
    check('4. jeton invente rejete', v2.spam, v2.reasons.join(', '));
    const replayed = { first_name: 'Direct', last_name: 'Post', email: 'a@b.fr',
      antispam: { hp: '', ts: Date.now() - 30 * 24 * 3600 * 1000, token: n8nToken(Date.now() - 30 * 24 * 3600 * 1000), page_ms: 9000, interactions: 12 } };
    check('4. vieux jeton rejoue rejete', n8nVerdict(replayed).spam);
    const okTs = Date.now() - 3 * 24 * 3600 * 1000;
    const oldTab = { first_name: 'Vrai', last_name: 'Visiteur', email: 'a@b.fr',
      antispam: { hp: '', ts: okTs, token: n8nToken(okTs), page_ms: 9000, interactions: 12 } };
    check('4. onglet ouvert depuis 3 jours accepte', !n8nVerdict(oldTab).spam, n8nVerdict(oldTab).reasons.join(', '));
  }

  /* ═══ 5. Non-regression : validation et panne du webhook ═══ */
  {
    const { w, d, calls } = boot();
    const form = d.getElementById('contact-form');
    type(w, d.getElementById('firstname'), 'Jean');
    submit(w, form);
    await tick();
    check('5. champs manquants : rien n est envoye', calls.length === 0);
    check('5. champs manquants : erreur affichee', d.getElementById('pf-error').style.display === 'block');
    check('5. champ fautif signale', d.getElementById('email').classList.contains('field-error'));

    type(w, d.getElementById('lastname'), 'Dupont');
    type(w, d.getElementById('email'), 'jean@exemple.fr');
    submit(w, form);
    await tick();
    check('5. correction : envoi relance', calls.length === 1);
    calls[0].reject(new Error('reseau'));
    await tick();
    const err = d.getElementById('pf-error');
    check('5. panne webhook : message affiche', err.style.display === 'block');
    check('5. panne webhook : repli mailto propose', /mailto:contact@bmdata\.fr/.test(err.innerHTML), err.textContent.slice(0, 60));
    check('5. panne webhook : bouton reactive', !d.getElementById('pf-submit').disabled);
  }

  const failed = results.filter(r => !r.ok);
  console.log('\n' + (results.length - failed.length) + '/' + results.length + ' verifications OK');
  process.exit(failed.length ? 1 : 0);
})();
