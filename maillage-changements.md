# Maillage interne — journal des changements

> Ce journal couvre aussi, depuis la passe F, des correctifs SEO on-page hors
> maillage stricto sensu.

Suivi des liens contextuels ajoutés et des liens cassés corrigés. Chaque lien est
posé **en corps de texte**, avec une ancre descriptive et un pont thématique réel
(même audience), jamais pour faire du volume. Règle : **≤ 3 liens sortants** par
article (les pages piliers/glossaire préexistantes peuvent en avoir plus).

Bilan mesuré par `scripts/audit-maillage.py` :

| Indicateur | Avant | Après passes A-D | Après passe E |
|---|---:|---:|---:|
| Liens contextuels | 101 | 115 | **149** |
| Pages orphelines (0 lien entrant) | 8 | 2 | **2** |
| Liens internes cassés (404) | 5 | 0 | **0** |
| Pages inatteignables (hors pagination) | — | 3 | **0** |
| Profondeur de clic maximale | — | 9 | **6** |

> ⚠️ **Les colonnes ne sont pas directement comparables.** La passe E corrige un
> angle mort de l'outil (voir § E.1) : le portfolio est désormais audité, et les
> boutons « ← Retour aux réalisations » ne sont plus comptés comme éditoriaux.
> Recalculé avec l'outil corrigé, le point de départ réel de la passe E était de
> **105 liens et 13 orphelines**, pas 115 et 2.

Les 2 « orphelines » restantes (`/a-propos/`, `/faq/`) sont dans la **navigation
principale** (profondeur 1) : atteignables et indexables, pas un problème. Un lien
contextuel en corps y serait artificiel — non ajouté volontairement.

---

## A. Liens internes cassés corrigés (priorité)

GitHub Pages est **sensible à la casse** ; ces liens renvoyaient un **404** en
production (invisibles en preview locale Windows, casse-insensible) :

| Fichier | Avant (404) | Après |
|---|---|---|
| `_posts/2026-03-10-les-termes-data.md` (×2) | `/blog/architecture-data-pme/` | `/blog/architecture-data-PME/` |
| `_posts/2026-03-09-architecture-data-PME.md` (×2) | `/realisation/` | `/realisations/` |
| `_posts/2025-11-03-utilisation-talend.md` | `/realisation/` | `/realisations/` |

Impact : le glossaire `les-termes-data` (hub à 10 liens sortants) pointait vers un
404 au lieu de `architecture-data-PME` — ce hub alimente désormais réellement la
page architecture.

## B. 1ʳᵉ passe — pages fortes → hubs PME

| Source | Cible | Ancre |
|---|---|---|
| migration-talend-vers-talaxie (§7) | automatiser-ses-reportings | *automatiser ses reportings de bout en bout* |
| migration-talend-vers-talaxie (conclusion) | architecture-data-PME | *structurer une architecture data de PME* |
| talend-studios (intro) | les-termes-data | *lexique des principaux termes data* |
| tWriteJSONField (intro) | architecture-data-PME | *structurer une architecture data de PME* |

## C. 2ᵉ passe — dé-orphelinisation complète du blog

Chaque page auparavant à 0 lien entrant reçoit **2 liens entrants** genuinement
pertinents, en privilégiant les pages à forte autorité comme sources.

| Source | Cible | Ancre / pont |
|---|---|---|
| tableau-de-bord-comment-piloter (Q3 « temps réel ») | tableau-de-bord-et-pilotage-temps-reel | *pilotage en temps réel* |
| excel-vs-power-bi (§ actualisation auto) | tableau-de-bord-et-pilotage-temps-reel | *pilotage en temps réel* (suivi à l'instant T) |
| automatiser-ses-reportings (§ « automatiser trop tôt ») | automatisation-pme-bon-moment | *choisir le bon moment pour automatiser* |
| heures-perdues (§ « pas un interrupteur ») | automatisation-pme-bon-moment | *choisir le bon moment pour automatiser* |
| pourquoi-vos-donnees (Q2 temps/reporting) | heures-perdues-taches-repetitives | *ces heures passées sur des tâches répétitives* |
| automatisation-pme-bon-moment (bullet « Heures perdues ») | heures-perdues-taches-repetitives | *ce que coûtent réellement les tâches répétitives* |
| ia-la-cerise (§5 fondations) | utiliser-l-ia-au-quotidien | *utiliser l'IA au quotidien* |
| heures-perdues (FAQ « l'IA peut-elle m'aider ») | utiliser-l-ia-au-quotidien | *utiliser l'IA au quotidien* |
| tWriteJSONField (conclusion) | tFileOutputPDF2 | *générer un PDF avec tFileOutputPDF2* (composant de sortie) |
| tSchemaComplianceCheck (conclusion) | tFileOutputPDF2 | *produire un PDF avec tFileOutputPDF2* |

## Comment l'autorité descend maintenant

- **Cluster Talend** (top trafic) : migration (256 clics) → talend-studios,
  automatiser-ses-reportings, architecture-data-PME ; le glossaire les-termes-data
  (réparé) → architecture-data-PME ; tWriteJSONField ↔ tSchemaComplianceCheck ↔
  tFileOutputPDF2.
- **Cluster PME/automatisation** : migration → automatiser-ses-reportings →
  pourquoi-vos-donnees → heures-perdues / automatisation-pme-bon-moment →
  utiliser-l-ia ; tableaux de bord reliés (comment-piloter + excel-vs-power-bi →
  pilotage temps réel).
- Les pages qui rankent déjà découvrent donc les pages « non indexées » lors des
  passages de Googlebot → c'est le mécanisme qui débloque le statut « Détectée,
  actuellement non indexée » en GSC.

## Accueil (Tâche 3.4) — inchangé, volontairement

Landing page 100 % pilotée par `_data/home.json`, sans emplacement éditorial
naturel. Le blog reste atteignable depuis l'accueil via la nav (Blog) + la
pagination. Injecter un lien d'article dans le corps de la home serait forcé.

## D. Connexion du blog à l'autorité de l'accueil

Ajout d'**1 lien contextuel** dans l'intro de `/services/` (page de nav,
profondeur 1) → `automatiser-ses-reportings`. Cela relie tout le graphe à
l'accueil : le cluster PME, puis via `facturation → architecture-data-PME` le
cluster Talend, deviennent atteignables depuis l'accueil par liens contextuels +
nav principale.

## E. Le portfolio entre dans le maillage (11 études de cas)

Les passes A-D ne traitaient que le blog. Les 11 études de cas `/portfolio/*.html`
restaient hors du maillage éditorial, dans les deux sens.

### E.1 — Correction d'un angle mort de l'outil (priorité)

`audit-maillage.py` était **aveugle au portfolio**, pour trois raisons cumulées.
Il annonçait « 0 orphelin bloquant » en ignorant un tiers du site :

| Cause | Correctif |
|---|---|
| `build_source_map()` ne cartographiait que `_posts/`, `pages/` et `index.html` | ajout de `portfolio/` (permalink `.html` respecté tel quel) |
| `is_content_page()` rejetait toute URL en `.html` | exception explicite via `PORTFOLIO_RE` |
| `_in_editorial()` cherchait `.post-content` ou `main#main-content` — or le gabarit portfolio utilise `main#pc-main` | `EDITORIAL_MAIN_IDS = {main-content, pc-main}` |

La 3ᵉ cause était la plus sournoise : **même les liens ajoutés dans une étude de
cas n'auraient jamais été comptés.** Les boutons « ← Retour aux réalisations »
(`.pc-back-mobile`, `.pc-back-link`) sont désormais exclus : ils gonflaient
artificiellement `/realisations/` de 11 liens entrants « éditoriaux » qui n'étaient
que du chrome.

**À noter :** `/realisations/` liait déjà les 11 études de cas via ses cartes.
Google les atteignait donc en 2 clics — elles n'étaient pas introuvables. Le `∞`
de l'audit signifie « aucun lien éditorial » : alimentées par une seule grille de
cartes, sans contexte thématique, et ne redistribuant rien.

### E.2 — Blog → études de cas (8 liens contextuels)

| Source | Cible | Pont thématique |
|---|---|---|
| migration-talend-vers-talaxie (conclusion) | migration-talend-oss-talaxie | les 8 étapes appliquées à un cas réel |
| tableau-de-bord-et-pilotage-temps-reel (conclusion) | dashboardtv-operations | collecte multi-sources en temps réel |
| excel-vs-power-bi (cadrage final) | reporting-change-itop | un Power BI qui remplace les extractions manuelles |
| rgpd-donnees-clients-guide-pme (nettoyage des données) | eiffage-migration-medicale | rigueur imposée par les données sensibles |
| changer-logiciel-sans-perdre-donnees-pme (conclusion) | frele-loup-migration-prestashop | reprise sans perte lors d'un changement de plateforme |
| tSchemaComplianceCheck (mot de la fin) | media-participations-migration | validation au service d'une reprise d'historique |
| utilisation-talend (bénéfices) | edi-tms-oneworld | échanges standardisés automatisés avec Talend |
| ressaisies-tpe-pme-cout-cache (§ automatisation utile) | uba-data-automation | ce que donne la suppression des doubles saisies |
| architecture-data-PME (§ « aller plus loin ») | uba-data-automation + sofipel | la chaîne Sources → ETL → Base → BI illustrée |

### E.3 — Études de cas → blog/services (bloc « Sur le même sujet »)

Nouveau bloc `pc-block--related` dans `_includes/portfolio-case.html`, **piloté par
les données** (clé `related` dans `_data/projets.json`, 2 à 4 entrées par projet) —
aucun lien en dur dans le gabarit. Placé dans `<main id="pc-main">` : il compte donc
comme éditorial, contrairement au CTA de la sidebar.

Chaque étude de cas pointe vers 1-3 articles pertinents **et** vers ses cas frères.
Les liens croisés entre cas frères règlent le cas du **trio EDI** (`edi-tms-oneworld`,
`edi-wms-izypro`, `edi-wms-reflex`) : trois cas quasi identiques qu'aucun article ne
couvre naturellement, et pour lesquels un lien forcé depuis le blog aurait été
artificiel.

### E.4 — Réparation de l'île « tableaux de bord » + profondeur

`excel-vs-power-bi`, `tableau-de-bord-comment-piloter` et
`tableau-de-bord-et-pilotage-temps-reel` formaient un **triangle fermé** : ils se
pointaient mutuellement, mais aucun lien n'entrait depuis l'extérieur → profondeur `∞`.

Correctif : **1 paragraphe dans l'intro de `/services/`** (profondeur 1, donc le
meilleur distributeur du site) vers `tableau-de-bord-comment-piloter` **et**
`architecture-data-PME`. Un seul paragraphe règle deux problèmes :

- l'île tableaux de bord passe de `∞` à **2-3**
- le cluster Talend (meilleur trafic) passe de **7-9 à 3-4** : `migration-talend-vers-talaxie`
  7 → 3, `les-termes-data` 8 → 4, `chiffrer-des-mots-de-passe-base64` 9 → 5

## F. Hiérarchie des titres — 4 articles (correctif on-page)

### F.1 — Le défaut

Le gabarit `post.html` émet déjà le H1 de l'article. Ces 4 articles utilisaient
**en plus** `#` pour leurs sections, d'où plusieurs H1 par page :

| Article | H1 avant | H1 après |
|---|---:|---:|
| `les-termes-data` | 17 | **1** |
| `architecture-data-PME` | 12 | **1** |
| `API-et-Webhook-talaxie-esb` | 9 | **1** |
| `API-et-Webhook-talaxie-esb-2` | 5 | **1** |

**Ce n'était pas un problème de classement** : Google indique explicitement que
plusieurs H1 ne pénalisent pas. Le coût réel était ailleurs :

1. **Le sommaire était cassé.** `assets/js/main.js` le construit avec
   `querySelectorAll('h2, h3')` → il **ignorait purement et simplement les
   sections principales**, puisqu'elles étaient en H1. Sur les deux piliers, le
   sommaire listait les sous-parties sans jamais montrer le plan.
2. Sans hiérarchie, l'extraction de passages (featured snippets, AI Overviews) et
   les lecteurs d'écran n'ont aucune structure à suivre.

### F.2 — Le correctif

Décalage de **toute** la hiérarchie d'un cran (`#` → `##`, `##` → `###`, …) :
les niveaux relatifs sont préservés, seul le H1 redevient unique. 266 titres
décalés. Aucun article ne dépasse H5 après décalage.

**Piège évité :** `API-et-Webhook-talaxie-esb` contient 23 lignes commençant par
`#`, mais **seules 8 sont des titres** — les 15 autres sont des commentaires
shell/java dans des blocs de code clôturés. Le script saute les blocs ``` et ~~~
(vérifié : diff vide sur ces lignes).

**Vérifié :** 0 ancre interne (`](#…)`) dans les 4 fichiers → aucun lien brisé.
Les id générés par kramdown dérivent du **texte** du titre, pas de son niveau :
ils sont inchangés.

### F.3 — Effet sur le sommaire (visible)

Le sommaire liste désormais les sections. Entrées `h2+h3` dans `#postContent` :

| Article | Avant | Après | Effet |
|---|---:|---:|---|
| `les-termes-data` | 81 | 97 | + les 16 sections ; passe à 2 niveaux (termes indentés) |
| `architecture-data-PME` | 37 | 26 | + les 11 sections ; 22 sous-sous-parties sortent (H4) |
| `API-et-Webhook-talaxie-esb` | 57 | 34 | + les 8 sections ; 32 sortent (H4) |
| `API-et-Webhook-talaxie-esb-2` | 48 | 24 | + les 4 sections ; 28 sortent (H4) |

Sur 3 articles sur 4, le sommaire devient plus court **et** plus navigable : il
montre le plan au lieu d'aligner des sous-parties à plat.

### F.4 — Reste à faire (non traité)

- **25 titres > 60 caractères** (jusqu'à 106) : tronqués en SERP.
- **Études de cas à ~220 mots** : contenu mince pour des pages indexables.
- **`/realisations/`** : profondeur 1, 9 liens entrants, **0 sortant éditorial**.
- **`les-termes-data`** : glossaire à 10 liens sortants pour **1 seul entrant**.
- **`aggregateRating` auto-déclaré** sur `LocalBusiness` (dans le `schema.html`
  non commité) : Google interdit les avis « self-serving » pour
  `LocalBusiness`/`Organization` — à vérifier avec la doc à jour.
- Faux positifs vérifiés, **à ne pas traiter** : titres/descriptions dupliqués =
  uniquement `/blog/page2-5/`, déjà en `noindex`.
