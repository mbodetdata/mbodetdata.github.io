/* Verdict antispam du formulaire de contact.
   Copie de reference du noeud Code n8n documente dans scripts/antispam-n8n.md :
   les deux doivent rester identiques. Les tests s'appuient sur ce fichier, de
   sorte qu'une regle modifiee ici se verifie immediatement. */

/* Doit rester identique a HP_SECRET dans assets/js/main.js */
const HP_SECRET = 'bmdata-contact-v1';

const MIN_PAGE_MS      = 3000;                  // 3 s sur la page au minimum
const MIN_INTERACTIONS = 3;                     // frappes / clics observes
const MAX_TOKEN_AGE_MS = 7 * 24 * 3600 * 1000;  // onglet laisse ouvert : tolere

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* FNV-1a 32 bits — meme fonction que hpToken() dans assets/js/main.js */
function hpToken(ts) {
  const s = HP_SECRET + ':' + ts;
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 0x01000193) >>> 0;
  }
  return h.toString(36);
}

/* Rend { spam, spam_reasons } pour un corps de requete recu par le webhook. */
function verdict(body) {
  const a = (body && body.antispam) || {};
  const reasons = [];

  if (a.hp) reasons.push('honeypot rempli');

  if (!a.ts || !a.token || hpToken(a.ts) !== a.token) {
    reasons.push('jeton absent ou invalide');
  } else if (Math.abs(Date.now() - Number(a.ts)) > MAX_TOKEN_AGE_MS) {
    reasons.push('jeton perime');
  }

  if (!(Number(a.page_ms) >= MIN_PAGE_MS))           reasons.push('formulaire rempli trop vite');
  if (!(Number(a.interactions) >= MIN_INTERACTIONS)) reasons.push('aucune interaction reelle');

  if (!body || !body.email || !EMAIL_RE.test(body.email)) reasons.push('email invalide');
  if (!body || !body.first_name || !body.last_name)       reasons.push('identite incomplete');

  return { spam: reasons.length > 0, spam_reasons: reasons };
}

module.exports = { HP_SECRET, MIN_PAGE_MS, MIN_INTERACTIONS, MAX_TOKEN_AGE_MS, hpToken, verdict };
