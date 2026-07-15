# Maillage interne — journal des changements

Suivi des liens contextuels ajoutés (Tâche 3). Chaque lien est posé **en corps
de texte**, avec une ancre descriptive et un pont thématique réel — jamais pour
faire du volume. Chemins en `{{ '/…/' | relative_url }}` (pas d'URL absolue en
dur), conformément à la convention déjà utilisée pour les images du site.

## Liens ajoutés

| # | Source | Cible | Texte d'ancre | Justification |
|---|--------|-------|---------------|---------------|
| 1 | `_posts/2025-10-07-migration-talend-vers-talaxie.md` (§7 « Déployez et automatisez ») | `/blog/automatiser-ses-reportings-guide-pratique/` | *automatiser ses reportings de bout en bout* | La section parle de planifier les jobs (CRON, tâches Windows). Enchaînement naturel : une fois les flux migrés et planifiés, l'étape suivante est d'en automatiser la restitution. Pont explicitement suggéré dans le brief. |
| 2 | `_posts/2025-10-07-migration-talend-vers-talaxie.md` (Conclusion) | `/blog/architecture-data-PME/` | *structurer une architecture data de PME* | La conclusion évoque « sécuriser vos flux ETL ». Suite logique : où placer ces flux dans une architecture data complète (sources → ETL → BI). L'article cible porte exactement sur ce sujet. |
| 3 | `_posts/2025-09-17-talend-studios.md` (Introduction) | `/blog/les-termes-data/` | *lexique des principaux termes data* | L'intro empile le jargon (ETL, ESB, Big Data, NoSQL, qualité des données). Pont naturel vers le glossaire qui définit ces termes — utile au lecteur, et dé-orphelinise une page qui n'avait aucun lien entrant. |
| 4 | `_posts/2025-12-16-tWriteJSONField.md` (Introduction) | `/blog/architecture-data-PME/` | *structurer une architecture data de PME* | L'article est très technique (composant JSON). Pont « zoom arrière » honnête : ce type de composant s'inscrit dans un pipeline plus large. Renforce le hub PME architecture. |

## Respect des règles du brief

- **En corps de texte uniquement** — aucun bloc « articles liés », footer ou sidebar.
- **≤ 3 liens sortants par page** — migration : 3 au total (1 existant + 2 ajoutés) ;
  talend-studios : 3 (2 existants + 1 ajouté) ; tWriteJSONField : 2 (1 + 1).
- **Ancres descriptives** — chaque ancre décrit la page cible, jamais « cliquez ici ».
- **Pertinence thématique** — chaque lien repose sur un pont logique, pas sur du volume.

## Accueil (Tâche 3.4) — aucun changement, volontairement

L'accueil (`index.html`) est une landing page **100 % pilotée par les données**
(`_data/home.json`) : chaque bloc de texte est une variable Liquid et les seuls
liens en corps de page sont des CTA de conversion (`/contact/`, `/services/`,
`/score-maturite-data/`…). La seule section thématiquement proche (« Problèmes »)
est une grille de cartes.

Il n'existe donc **aucun emplacement éditorial naturel** pour un lien contextuel
vers un article PME sans insérer une phrase artificielle dans une page soignée —
ce que le brief interdit explicitement (« Ne force pas un lien dans un paragraphe
où il n'a rien à faire »). Les articles PME restent atteignables depuis l'accueil
via la nav principale (Blog). **Recommandation** : ne pas forcer ; traiter la
découvrabilité PME par le maillage entre articles (ci-dessous).

## Impact mesuré (script d'audit, avant → après)

- `les-termes-data` : **orphelin (0) → 1 lien entrant** ✅
- `architecture-data-PME` : 1 → **3 liens entrants** ✅
- `automatiser-ses-reportings-guide-pratique` : 3 → **4 liens entrants** ✅
- Les 3 pages fortes déjà indexées (migration 256 clics, talend-studios,
  tWriteJSONField) pointent désormais vers les hubs PME → Google découvrira ces
  cibles lors de ses passages sur les pages qui rankent déjà.

## Reste à traiter — 2ᵉ passe recommandée

Cinq articles restent à **0 lien entrant contextuel** (aucun pont thématique
naturel depuis les 4 sources du brief) :

- `/blog/automatisation-pme-bon-moment/`
- `/blog/heures-perdues-taches-repetitives/`
- `/blog/tableau-de-bord-et-pilotage-temps-reel/`
- `/blog/utiliser-l-ia-au-quotidien/`
- `/blog/tFileOutputPDF2/` (page forte, 42 clics, mais elle-même orpheline)

Ces pages seraient mieux servies depuis leurs **pages-parentes PME** (désormais
renforcées), avec des ponts genuinement pertinents, par exemple :

- `architecture-data-PME` → `tableau-de-bord-et-pilotage-temps-reel` (couche BI / restitution)
- `automatiser-ses-reportings-guide-pratique` → `heures-perdues-taches-repetitives` (ROI du temps gagné)
- `migration-talend-vers-talaxie` ou `tWriteJSONField` → `tFileOutputPDF2` (composant de sortie Talaxie)

À valider avant exécution (sources hors périmètre initial du brief).
