/* Attaque le vrai formulaire de contact avec un navigateur pilote, du robot le
   plus grossier au plus soigneux, et verifie ou chacun tombe.

   Usage :  npm install playwright && npx playwright install chromium
            node scripts/test-contact-attaque.js

   Le banc est monte dans le dossier temporaire du systeme, avec le vrai CSS et
   le vrai JS du site. Le webhook est redirige vers un serveur local : AUCUNE
   soumission ne part vers n8n.

   Le dernier scenario PASSE volontairement : un robot qui pilote un vrai
   navigateur, evite le piege, tape touche par touche et patiente est
   indiscernable d'un visiteur. C'est la limite assumee de l'approche, pas une
   regression. Voir scripts/antispam-n8n.md. */

const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { hpToken, verdict } = require('./antispam-verdict');

let chromium;
try {
  ({ chromium } = require('playwright'));
} catch (e) {
  console.error('playwright introuvable. Depuis la racine du site :');
  console.error('  npm install playwright && npx playwright install chromium');
  process.exit(2);
}

const SITE = process.argv[2] || '.';
const BENCH = fs.mkdtempSync(path.join(os.tmpdir(), 'bmdata-bench-'));

const CHAMPS = {
  '#firstname': 'Marc',
  '#lastname':  'Dubois',
  '#email':     'marc.dubois@exemple.fr',
  '#company':   'Dubois SARL',
  '#message':   'Bonjour, je souhaite un devis pour un tableau de bord.'
};
const TOUS_CHAMPS = '#contact-form input[type=text], #contact-form input[type=email], #contact-form textarea';

/* ── Banc : la vraie page, le vrai CSS, le vrai JS ───────────────────── */
function monterBanc() {
  fs.mkdirSync(path.join(BENCH, 'assets', 'css'), { recursive: true });
  fs.mkdirSync(path.join(BENCH, 'assets', 'js'), { recursive: true });
  fs.copyFileSync(path.join(SITE, 'assets/css/main.css'), path.join(BENCH, 'assets/css/main.css'));
  fs.copyFileSync(path.join(SITE, 'assets/js/main.js'), path.join(BENCH, 'assets/js/main.js'));

  let page = fs.readFileSync(path.join(SITE, 'pages/contact.html'), 'utf8');
  page = page.replace(/^---[\s\S]*?---\n/, '');
  page = page.replace(/\{%[\s\S]*?%\}/g, '');
  page = page.replace(/\{\{\s*d\.form\.submit_label\s*\}\}/g, 'Envoyer ma demande');
  page = page.replace(/\{\{[\s\S]*?\}\}/g, 'texte');
  /* Seul ecart avec la production : le webhook pointe sur le serveur local. */
  page = page.replace('https://n8n.bmdata.fr/webhook/formulaire-contact', '/webhook-test');
  page = page.replace(/data-src="[^"]*"/, 'data-src="about:blank"');

  fs.writeFileSync(path.join(BENCH, 'index.html'), `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Banc de test</title><link rel="stylesheet" href="/assets/css/main.css"></head>
<body class="page-contact">${page}<script src="/assets/js/main.js" defer></script></body></html>`);
}

/* ── Serveur local : sert le banc, encaisse le POST ──────────────────── */
let captured = [];
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript' };
const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/webhook-test') {
    let raw = '';
    req.on('data', c => raw += c);
    req.on('end', () => {
      try { captured.push(JSON.parse(raw)); } catch { captured.push({}); }
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end('{"ok":true}');
    });
    return;
  }
  const rel = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  const file = path.join(BENCH, rel);
  if (!file.startsWith(BENCH) || !fs.existsSync(file)) { res.writeHead(404); return res.end('404'); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
  res.end(fs.readFileSync(file));
});

/* ── Rapport ─────────────────────────────────────────────────────────── */
const lignes = [];
let ecarts = 0;

function noter(effort, scenario, attendu, obtenu, arrete, details, tolere) {
  const conforme = attendu === obtenu;
  if (!conforme && !tolere) ecarts++;
  lignes.push({ effort, scenario, obtenu, arrete });
  const etat = conforme ? 'OK  ' : (tolere ? 'TOL ' : 'ECART');
  console.log(`\n${etat} ${scenario}   [effort : ${effort}]`);
  console.log(`     resultat : ${obtenu}${conforme ? '' : '  (attendu : ' + attendu + ')'}`);
  if (arrete) console.log(`     arrete par : ${arrete}`);
  if (details) console.log(`     ${details}`);
  if (tolere && !conforme) console.log(`     tolere : mesure dependante de la machine, pas une regression`);
}

const attendre = (p, ms) => p.waitForTimeout(ms);

async function soumettre(browser, remplir, attente) {
  captured = [];
  const page = await browser.newPage();
  await page.goto(URL_BENCH);
  await page.click('#tab-form');
  const extra = await remplir(page);
  if (attente) await attendre(page, attente);
  await page.click('#pf-submit');
  await attendre(page, 500);
  await page.close();
  return { body: captured[0], extra };
}

let URL_BENCH;

async function run() {
  monterBanc();
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  URL_BENCH = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch();

  /* ═══ 1. Envoi direct, sans navigateur ═══ */
  {
    const v = verdict({ first_name: 'Marc', last_name: 'Dubois', email: 'marc@spam.xyz', message: 'promo' });
    noter('nul', '1. Envoi direct a l\'automate (curl, Postman)',
      'BLOQUE', v.spam ? 'BLOQUE' : 'PASSE', v.spam_reasons.join(' · '));
  }

  /* ═══ 2. Valeurs ecrites par script dans la page ═══ */
  {
    const { body, extra } = await (async () => {
      captured = [];
      const page = await browser.newPage();
      await page.goto(URL_BENCH);
      await page.waitForFunction(() => !!document.getElementById('contact-form'));
      const piege = await page.evaluate(() => {
        const form = document.getElementById('contact-form');
        form.querySelectorAll('input[type=text], input[type=email], textarea').forEach(el => {
          el.value = el.type === 'email' ? 'bot@spam.xyz' : 'bot';
        });
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        return form.querySelector('#website').value !== '';
      });
      await attendre(page, 400);
      await page.close();
      return { body: captured[0], extra: piege };
    })();
    const v = body ? verdict(body) : null;
    noter('tres faible', '2. Valeurs ecrites par script (.value)',
      'BLOQUE', v && v.spam ? 'BLOQUE' : 'PASSE', v ? v.spam_reasons.join(' · ') : '—',
      'piege rempli : ' + (extra ? 'oui' : 'non'));
  }

  /* ═══ 3. Robot naif : remplit tout, envoie aussitot ═══ */
  {
    const { body, extra } = await soumettre(browser, async page => {
      for (const el of await page.locator(TOUS_CHAMPS).all()) {
        const id = await el.getAttribute('id');
        await el.fill(id === 'email' ? 'robot@spam.xyz' : 'Robot');
      }
      return await page.locator('#website').inputValue() !== '';
    });
    const v = body ? verdict(body) : null;
    noter('faible', '3. Robot naif, envoi immediat',
      'BLOQUE', v && v.spam ? 'BLOQUE' : 'PASSE', v ? v.spam_reasons.join(' · ') : '—',
      'piege rempli : ' + (extra ? 'oui' : 'non'));
  }

  /* ═══ 3bis. Robot naif, mais patient — le piege est seul en jeu ═══ */
  {
    const { body, extra } = await soumettre(browser, async page => {
      for (const el of await page.locator(TOUS_CHAMPS).all()) {
        const id = await el.getAttribute('id');
        await el.fill(id === 'email' ? 'robot@spam.xyz' : 'Robot patient');
      }
      return await page.locator('#website').inputValue() !== '';
    }, 4000);
    const v = body ? verdict(body) : null;
    const seul = v && v.spam_reasons.length === 1 && v.spam_reasons[0] === 'honeypot rempli';
    noter('eleve', '3bis. Robot naif ET patient',
      'BLOQUE', v && v.spam ? 'BLOQUE' : 'PASSE', v ? v.spam_reasons.join(' · ') : '—',
      'piege rempli : ' + (extra ? 'oui' : 'non') +
      (seul ? '\n     => le honeypot est le SEUL controle qui arrete ce robot' :
              '\n     => ATTENTION : le honeypot n\'est plus le rempart attendu ici'));
    if (!seul) ecarts++;
  }

  /* ═══ 4. Robot soigne : champs visibles, envoi immediat ═══ */
  {
    const { body } = await soumettre(browser, async page => {
      for (const [sel, val] of Object.entries(CHAMPS)) await page.locator(sel).fill(val);
    });
    const v = body ? verdict(body) : null;
    const lent = body && body.antispam.page_ms >= 3000;
    noter('moyen', '4. Robot soigne, envoi immediat',
      'BLOQUE', v && v.spam ? 'BLOQUE' : 'PASSE', v ? v.spam_reasons.join(' · ') : '—',
      body ? `page_ms : ${body.antispam.page_ms} · interactions : ${body.antispam.interactions} · jeton : ${hpToken(body.antispam.ts) === body.antispam.token ? 'valide' : 'invalide'}` : '—',
      lent);
  }

  /* ═══ 5. Robot patient : frappe touche par touche puis attente ═══ */
  {
    const { body } = await soumettre(browser, async page => {
      for (const [sel, val] of Object.entries(CHAMPS)) {
        await page.locator(sel).click();
        await page.locator(sel).pressSequentially(val, { delay: 10 });
      }
    }, 3500);
    const v = body ? verdict(body) : null;
    noter('maximal', '5. Robot patient, frappe simulee (limite assumee)',
      'PASSE', v && v.spam ? 'BLOQUE' : 'PASSE', v ? v.spam_reasons.join(' · ') || 'aucun' : '—',
      body ? `page_ms : ${body.antispam.page_ms} · interactions : ${body.antispam.interactions} · jeton : ${hpToken(body.antispam.ts) === body.antispam.token ? 'valide' : 'invalide'}` : '—');
  }

  /* ═══ Controle : pourquoi le piege fonctionne ═══ */
  {
    const page = await browser.newPage();
    await page.goto(URL_BENCH);
    await page.click('#tab-form');
    const hp = page.locator('#website');
    const box = await hp.boundingBox();
    const remplissable = await hp.isVisible();
    const clavier = await page.evaluate(() =>
      [...document.querySelectorAll('#contact-form input')].filter(e => e.tabIndex >= 0).some(e => e.id === 'website'));
    await page.close();

    console.log('\n── Controle du champ piege');
    console.log('   remplissable par un outil : ' + remplissable + (remplissable ? '  (c\'est ce qu\'on veut)' : '  (le piege n\'attrape plus rien)'));
    console.log('   position a l\'ecran        : x=' + (box ? Math.round(box.x) : '—') + ' y=' + (box ? Math.round(box.y) : '—'));
    console.log('   atteignable au clavier    : ' + clavier + (clavier ? '  (PROBLEME : un visiteur peut tomber dedans)' : ''));
    if (!remplissable) {
      console.log('   => le champ doit rester DEPLACE hors ecran (left:-9999px), jamais masque :');
      console.log('      un display:none ou visibility:hidden desarme le piege face aux outils d\'automatisation.');
      ecarts++;
    }
    if (clavier) ecarts++;
  }

  await browser.close();
  server.close();
  fs.rmSync(BENCH, { recursive: true, force: true });

  console.log('\n\n══ ECHELLE D\'EFFORT ══');
  lignes.forEach(l => console.log(`  ${l.obtenu.padEnd(7)} ${String(l.effort).padEnd(12)} ${l.scenario.replace(/^\d+(bis)?\.\s*/, '')}`));
  console.log('\n' + (ecarts === 0
    ? 'Conforme : chaque robot tombe la ou il doit tomber.'
    : ecarts + ' ecart(s) par rapport au comportement attendu.'));
  process.exit(ecarts ? 1 : 0);
}

run().catch(e => {
  console.error(e);
  try { server.close(); fs.rmSync(BENCH, { recursive: true, force: true }); } catch {}
  process.exit(1);
});
