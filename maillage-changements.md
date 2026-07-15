# Maillage interne — journal des changements

Suivi des liens contextuels ajoutés et des liens cassés corrigés. Chaque lien est
posé **en corps de texte**, avec une ancre descriptive et un pont thématique réel
(même audience), jamais pour faire du volume. Règle : **≤ 3 liens sortants** par
article (les pages piliers/glossaire préexistantes peuvent en avoir plus).

Bilan mesuré par `scripts/audit-maillage.py` :

| Indicateur | Avant | Après |
|---|---:|---:|
| Liens contextuels | 101 | 115 |
| Pages orphelines (0 lien entrant) | 8 | 2 |
| Liens internes cassés (404) | 5 | 0 |

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
