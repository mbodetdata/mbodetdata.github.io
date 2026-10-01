# Anti-spam du formulaire de contact — côté n8n

Document interne. Le dossier `scripts` est exclu du build Jekyll (`_config.yml`),
rien d'ici n'est publié sur bmdata.fr.

Côté site, tout est déjà en place dans `assets/js/main.js` (bloc `PAGE: contact.html`)
et `pages/contact.html`. Il reste à brancher le filtre dans le workflow n8n
`formulaire-contact`.

---

## 1. Ce que le formulaire envoie désormais

Le corps de la requête garde exactement les mêmes champs métier qu'avant
(`first_name`, `email`, `message`…) et gagne un objet `antispam` :

```json
{
  "first_name": "Jean",
  "email": "jean@exemple.fr",
  "...": "...",
  "antispam": {
    "hp": "",                 // honeypot : doit rester vide
    "ts": 1758412800000,      // horodatage de chargement de la page
    "token": "5bcyar",        // empreinte de ts, calculée par le JS de la page
    "page_ms": 41230,         // temps écoulé depuis le chargement
    "typing_ms": 28110,       // temps écoulé depuis la première interaction
    "interactions": 47        // frappes, clics, collages réellement observés
  }
}
```

Trois signaux indépendants :

| Signal | Ce qu'il attrape | Ce qu'il n'attrape pas |
|---|---|---|
| `hp` (honeypot) | les robots qui lisent le HTML et remplissent tous les champs | un robot qui poste directement sur l'URL du webhook |
| `page_ms` / `interactions` | les soumissions instantanées et celles sans frappe ni clic | un robot qui patiente et simule des événements |
| `token` | les POST envoyés directement sur l'URL du webhook | quelqu'un qui lit `main.js` et reproduit le calcul |

Le jeton n'est pas un secret cryptographique : `main.js` est public, donc
reproductible par un humain motivé. Il coûte cher à un spammeur de masse, rien
à un attaquant ciblé. C'est une barrière de volume, pas une authentification.

**Le navigateur ne supprime aucune soumission.** Même une soumission piégée part
vers n8n. C'est délibéré : si le remplissage automatique d'un navigateur écrivait
un jour dans le honeypot, un vrai client serait perdu sans que personne le sache.
Le tri se fait ici, où l'on peut le voir et le corriger.

---

## 2. Configuration du nœud Webhook

- **Respond** : `Using 'Respond to Webhook' Node`
- **Allowed Origins (CORS)** : `https://bmdata.fr` (et `http://localhost:4000`
  si tu testes en local avec `jekyll serve`)

Sans l'origine autorisée, le navigateur bloque la requête avant même n8n : le
visiteur voit le message d'erreur et le repli « m'écrire directement par email ».

Vérifie dans l'aperçu du Webhook si les données arrivent sous `$json.body` ou
directement sous `$json` — le code ci-dessous gère les deux cas.

---

## 3. Nœud Code — « Verdict antispam »

À placer juste après le Webhook. Mode : *Run Once for All Items*.

```js
// Doit rester identique à hpToken() dans assets/js/main.js
const HP_SECRET = 'bmdata-contact-v1';

const MIN_PAGE_MS      = 3000;                    // 3 s sur la page au minimum
const MIN_INTERACTIONS = 3;                       // frappes / clics observés
const MAX_TOKEN_AGE_MS = 7 * 24 * 3600 * 1000;    // onglet laissé ouvert : toléré

function hpToken(ts) {
  const s = HP_SECRET + ':' + ts;
  let h = 0x811c9dc5;                             // FNV-1a 32 bits
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 0x01000193) >>> 0;
  }
  return h.toString(36);
}

return $input.all().map(item => {
  const body = item.json.body ?? item.json;
  const a = body.antispam ?? {};
  const reasons = [];

  if (a.hp) reasons.push('honeypot rempli');

  if (!a.ts || !a.token || hpToken(a.ts) !== a.token) {
    reasons.push('jeton absent ou invalide');
  } else if (Math.abs(Date.now() - Number(a.ts)) > MAX_TOKEN_AGE_MS) {
    reasons.push('jeton périmé');
  }

  if (!(Number(a.page_ms) >= MIN_PAGE_MS))           reasons.push('formulaire rempli trop vite');
  if (!(Number(a.interactions) >= MIN_INTERACTIONS)) reasons.push('aucune interaction réelle');

  // Garde-fous métier : un lead sans email exploitable ne sert à rien
  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(body.email)) reasons.push('email invalide');
  if (!body.first_name || !body.last_name)                              reasons.push('identité incomplète');

  return { json: { ...body, spam: reasons.length > 0, spam_reasons: reasons } };
});
```

`Math.abs()` sur l'écart de dates est volontaire : l'horloge du visiteur n'est pas
celle du serveur, et une machine en avance ne doit pas être traitée comme un robot.
C'est aussi pour ça que la durée de remplissage (`page_ms`) est mesurée dans le
navigateur, entre deux lectures de la même horloge, plutôt que recalculée ici.

---

## 4. Nœud IF — « Message légitime ? »

Une seule condition, booléenne :

- **Value 1** : `{{ $json.spam }}`
- **Operation** : `is false`

| Branche | Destination |
|---|---|
| **true** (légitime) | le workflow actuel : notification, CRM, accusé de réception |
| **false** (spam) | quarantaine — voir ci-dessous |

Les deux branches se rejoignent sur le **Respond to Webhook** final, qui renvoie
un `200` identique dans les deux cas :

```json
{ "ok": true, "user_message": "Merci pour votre message ! Je vous réponds sous 24 h ouvrées." }
```

Le robot croit avoir réussi et ne cherche pas à s'adapter. Le site, lui, n'affiche
un succès que si la réponse contient `ok: true` ou `success: true`.

---

## 5. Branche quarantaine

**Ne supprime rien pendant les premières semaines.** Envoie plutôt un email à
`contact@bmdata.fr` avec un objet reconnaissable, par exemple :

```
[SPAM ?] {{ $json.full_name }} — {{ $json.spam_reasons.join(', ') }}
```

Une règle de boîte de réception classe ces messages dans un dossier dédié. Tu vois
le volume réel, tu vérifies qu'aucun vrai client n'atterrit là, et seulement
ensuite tu remplaces l'email par un simple *No Operation* si le tri est fiable.

Le cas à surveiller : un message avec `honeypot rempli` comme **seul** motif, avec
une identité crédible et des interactions normales. Ce serait le signe qu'un
gestionnaire de mots de passe remplit le champ piège. Dans ce cas, renomme le
champ `website` (dans `pages/contact.html` et dans `main.js`) plutôt que de
désactiver le filtre.

---

## 6. Réglage des seuils

Commence large, resserre ensuite :

- `MIN_PAGE_MS` : 3 000 ms. Personne ne saisit prénom, nom et email en 3 secondes.
- `MIN_INTERACTIONS` : 3. Un remplissage automatique du navigateur en produit déjà
  plusieurs ; une affectation directe de `.value` par un script n'en produit aucune.
- Si du spam passe encore, l'étape suivante est **Cloudflare Turnstile** : widget
  sur la page, vérification du jeton dans n8n via un nœud HTTP Request vers
  `https://challenges.cloudflare.com/turnstile/v0/siteverify`. Contrairement au
  jeton local, celui-là est vérifiable côté serveur et donc non reproductible.

---

## 7. Vérifier le site après modification

Le verdict ci-dessus existe en une seule copie dans le dépôt,
`scripts/antispam-verdict.js`, dont les deux suites de tests se servent. **Quand
tu modifies une règle, modifie ce fichier et ce document ensemble** — les tests
suivront tout seuls.

```bash
cd scripts
npm install                 # jsdom + playwright, confinés à scripts/node_modules
npx playwright install chromium
npm test                    # les deux suites
```

**`npm run test:form`** — 36 vérifications sous jsdom : parcours d'un visiteur,
robot qui tombe dans le piège, robot qui l'évite, POST direct, jeton forgé, jeton
rejoué, panne du webhook, validation des champs. Rapide, aucune dépendance
navigateur.

**`npm run test:attaque`** — six robots réels contre la vraie page, dans Chromium,
avec le webhook redirigé vers un serveur local (rien ne part vers n8n) :

| Effort | Méthode | Attendu | Ce qui l'arrête |
|---|---|---|---|
| Nul | Envoi direct sur l'URL du webhook | bloqué | le jeton |
| Très faible | `.value` écrit par un script dans la page | bloqué | piège + rythme |
| Faible | Navigateur piloté, remplit tout, envoie aussitôt | bloqué | piège + rythme |
| Moyen | Champs visibles seulement, envoi immédiat | bloqué | le rythme seul (~1,2 s) |
| Élevé | Remplit tout, mais patiente 5 s | bloqué | **le piège seul** |
| Maximal | Évite le piège, frappe touche par touche, patiente | **passe** | rien |

La dernière ligne passe volontairement : c'est la limite assumée, pas une
régression. Le test échoue si un robot tombe ailleurs que prévu.

### Deux constats à ne pas défaire

- **Le champ piège doit rester déplacé hors écran** (`left: -9999px` dans `.pf-hp`),
  jamais `display: none` ni `visibility: hidden`. Les outils d'automatisation
  refusent d'interagir avec un élément masqué : le piège cesserait alors d'attraper
  quoi que ce soit. Le test le contrôle et le signale.
- **Le seuil de 3 s est mince.** Le robot « moyen » est bloqué à 1,2 s ; deux
  secondes d'attente de plus lui suffiraient. Ce contrôle écarte les envois
  instantanés, rien de plus, et c'est tout ce qu'on lui demande.
