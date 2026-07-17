# Audit du maillage interne — bmdata.fr

> Généré par `scripts/audit-maillage.py` à partir de `_site/`. Relançable après modification. **Aucun contenu n'est modifié par ce script.**

## Méthodologie

Seuls les liens **en corps de contenu éditorial** sont comptés. Sont exclus : header, navigation principale, footer, sidebar/sommaire, fil d'Ariane, bloc auteur, bandeau de partage, CTA de fin d'article, section « Articles récents » (générée automatiquement) et listings à cartes (`.card`, `.grid`, `.post-card`).

- Pages analysées : **51**
- Pages de contenu : **43**
- Liens contextuels au total : **149**
- Pages de contenu orphelines (0 lien entrant contextuel) : **2**
- Liens internes **cassés** (cible 404) : **0**

## Liens internes cassés (404)

_Aucun._

## Liens entrants contextuels par page

Trié par nombre de liens entrants croissant (les plus fragiles d'abord).

| URL | Fichier source | Liens entrants | Pages sources |
|---|---|---:|---|
| `/a-propos/` | `pages/a-propos.html` | 0 | — |
| `/faq/` | `pages/faq.html` | 0 | — |
| `/` | `index.html` | 1 | `/blog/les-termes-data/` |
| `/blog/API-et-Webhook-talaxie-esb-2/` | `_posts/2026-02-05-API-et-Webhook-talaxie-esb-2.md` | 1 | `/blog/API-et-Webhook-talaxie-esb/` |
| `/blog/chiffrer-des-mots-de-passe-base64/` | `_posts/2025-11-17-chiffrer-des-mots-de-passe-base64.md` | 1 | `/blog/chiffrer-des-mots-de-passe-AES/` |
| `/blog/facturation-electronique-2026-pme-integration-logiciels/` | `_posts/2026-04-21-facturation-electronique-2026-pme-integration-logiciels.md` | 1 | `/blog/changer-logiciel-sans-perdre-donnees-pme/` |
| `/blog/ia-la-cerise-sur-le-gateau/` | `_posts/2026-06-22-ia-la-cerise-sur-le-gateau.md` | 1 | `/blog/` |
| `/blog/les-termes-data/` | `_posts/2026-03-10-les-termes-data.md` | 1 | `/blog/talend-studios/` |
| `/portfolio/edi-wms-reflex.html` | `portfolio/edi-wms-reflex.html` | 1 | `/portfolio/edi-wms-izypro.html` |
| `/portfolio/migration-talend-oss-talaxie.html` | `portfolio/migration-talend-oss-talaxie.html` | 1 | `/blog/migration-talend-vers-talaxie/` |
| `/portfolio/sofipel-interconnexion-keplervo.html` | `portfolio/sofipel-interconnexion-keplervo.html` | 1 | `/blog/architecture-data-PME/` |
| `/blog/automatisation-pme-bon-moment/` | `_posts/2026-04-30-automatisation-pme-bon-moment.md` | 2 | `/blog/automatiser-ses-reportings-guide-pratique/`, `/blog/heures-perdues-taches-repetitives/` |
| `/blog/excel-vs-power-bi-lequel-choisir/` | `_posts/2024-12-03-excel-vs-power-bi-lequel-choisir.md` | 2 | `/blog/tableau-de-bord-comment-piloter-son-activite/`, `/portfolio/reporting-change-itop.html` |
| `/blog/heures-perdues-taches-repetitives/` | `_posts/2026-06-08-heures-perdues-taches-repetitives.md` | 2 | `/blog/automatisation-pme-bon-moment/`, `/blog/pourquoi-vos-donnees-sont-votre-meilleur-atout/` |
| `/blog/rgpd-donnees-clients-guide-pme/` | `_posts/2025-02-18-rgpd-donnees-clients-guide-pme.md` | 2 | `/blog/facturation-electronique-2026-pme-integration-logiciels/`, `/portfolio/eiffage-migration-medicale.html` |
| `/blog/tFileOutputPDF2/` | `_posts/2025-10-15-tFileOutputPDF2.md` | 2 | `/blog/tSchemaComplianceCheck/`, `/blog/tWriteJSONField/` |
| `/blog/utiliser-l-ia-au-quotidien/` | `_posts/2026-01-16-utiliser-l-ia-au-quotidien.md` | 2 | `/blog/heures-perdues-taches-repetitives/`, `/blog/ia-la-cerise-sur-le-gateau/` |
| `/portfolio/dashboardtv-operations.html` | `portfolio/dashboardtv-operations.html` | 2 | `/blog/tableau-de-bord-et-pilotage-temps-reel/`, `/portfolio/reporting-change-itop.html` |
| `/portfolio/edi-wms-izypro.html` | `portfolio/edi-wms-izypro.html` | 2 | `/portfolio/edi-tms-oneworld.html`, `/portfolio/edi-wms-reflex.html` |
| `/portfolio/eiffage-migration-medicale.html` | `portfolio/eiffage-migration-medicale.html` | 2 | `/blog/rgpd-donnees-clients-guide-pme/`, `/portfolio/media-participations-migration.html` |
| `/portfolio/frele-loup-migration-prestashop.html` | `portfolio/frele-loup-migration-prestashop.html` | 2 | `/blog/changer-logiciel-sans-perdre-donnees-pme/`, `/portfolio/media-participations-migration.html` |
| `/portfolio/reporting-change-itop.html` | `portfolio/reporting-change-itop.html` | 2 | `/blog/excel-vs-power-bi-lequel-choisir/`, `/portfolio/dashboardtv-operations.html` |
| `/blog/chiffrer-des-mots-de-passe-AES/` | `_posts/2025-11-18-chiffrer-des-mots-de-passe-AES.md` | 3 | `/blog/API-et-Webhook-talaxie-esb/`, `/blog/chiffrer-des-mots-de-passe-base64/`, `/blog/les-termes-data/` |
| `/blog/tWriteJSONField/` | `_posts/2025-12-16-tWriteJSONField.md` | 3 | `/blog/architecture-data-PME/`, `/blog/les-termes-data/`, `/blog/tSchemaComplianceCheck/` |
| `/blog/tableau-de-bord-comment-piloter-son-activite/` | `_posts/2024-11-08-tableau-de-bord-comment-piloter-son-activite.md` | 3 | `/blog/excel-vs-power-bi-lequel-choisir/`, `/portfolio/dashboardtv-operations.html`, `/services/` |
| `/blog/tableau-de-bord-et-pilotage-temps-reel/` | `_posts/2026-06-04-tableau-de-bord-et-pilotage-temps-reel.md` | 3 | `/blog/excel-vs-power-bi-lequel-choisir/`, `/blog/tableau-de-bord-comment-piloter-son-activite/`, `/portfolio/dashboardtv-operations.html` |
| `/portfolio/edi-tms-oneworld.html` | `portfolio/edi-tms-oneworld.html` | 3 | `/blog/utilisation-talend/`, `/portfolio/edi-wms-izypro.html`, `/portfolio/edi-wms-reflex.html` |
| `/portfolio/media-participations-migration.html` | `portfolio/media-participations-migration.html` | 3 | `/blog/tSchemaComplianceCheck/`, `/portfolio/eiffage-migration-medicale.html`, `/portfolio/frele-loup-migration-prestashop.html` |
| `/portfolio/uba-data-automation.html` | `portfolio/uba-data-automation.html` | 3 | `/blog/architecture-data-PME/`, `/blog/ressaisies-tpe-pme-cout-cache/`, `/portfolio/sofipel-interconnexion-keplervo.html` |
| `/blog/pourquoi-vos-donnees-sont-votre-meilleur-atout/` | `_posts/2024-10-15-pourquoi-vos-donnees-sont-votre-meilleur-atout.md` | 4 | `/blog/automatiser-ses-reportings-guide-pratique/`, `/blog/facturation-electronique-2026-pme-integration-logiciels/`, `/blog/rgpd-donnees-clients-guide-pme/`, `/blog/tableau-de-bord-comment-piloter-son-activite/` |
| `/blog/ressaisies-tpe-pme-cout-cache/` | `_posts/2026-04-04-ressaisies-tpe-pme-cout-cache.md` | 4 | `/blog/automatiser-ses-reportings-guide-pratique/`, `/blog/changer-logiciel-sans-perdre-donnees-pme/`, `/blog/facturation-electronique-2026-pme-integration-logiciels/`, `/portfolio/uba-data-automation.html` |
| `/blog/tSchemaComplianceCheck/` | `_posts/2026-01-08-tSchemaComplianceCheck.md` | 4 | `/blog/architecture-data-PME/`, `/blog/les-termes-data/`, `/blog/tWriteJSONField/`, `/portfolio/media-participations-migration.html` |
| `/blog/talend-studios/` | `_posts/2025-09-17-talend-studios.md` | 4 | `/blog/architecture-data-PME/`, `/blog/migration-talend-vers-talaxie/`, `/blog/utilisation-talend/`, `/portfolio/migration-talend-oss-talaxie.html` |
| `/blog/API-et-Webhook-talaxie-esb/` | `_posts/2026-02-05-API-et-Webhook-talaxie-esb.md` | 5 | `/blog/API-et-Webhook-talaxie-esb-2/`, `/blog/architecture-data-PME/`, `/blog/les-termes-data/`, `/blog/talend-studios/`, `/portfolio/sofipel-interconnexion-keplervo.html` |
| `/blog/changer-logiciel-sans-perdre-donnees-pme/` | `_posts/2026-04-24-changer-logiciel-sans-perdre-donnees-pme.md` | 5 | `/blog/ressaisies-tpe-pme-cout-cache/`, `/blog/utilisation-talend/`, `/portfolio/eiffage-migration-medicale.html`, `/portfolio/frele-loup-migration-prestashop.html`, `/portfolio/media-participations-migration.html` |
| `/blog/migration-talend-vers-talaxie/` | `_posts/2025-10-07-migration-talend-vers-talaxie.md` | 5 | `/blog/architecture-data-PME/`, `/blog/les-termes-data/`, `/blog/tFileOutputPDF2/`, `/blog/talend-studios/`, `/portfolio/migration-talend-oss-talaxie.html` |
| `/blog/utilisation-talend/` | `_posts/2025-11-03-utilisation-talend.md` | 5 | `/blog/architecture-data-PME/`, `/blog/les-termes-data/`, `/portfolio/edi-tms-oneworld.html`, `/portfolio/edi-wms-izypro.html`, `/portfolio/edi-wms-reflex.html` |
| `/blog/automatiser-ses-reportings-guide-pratique/` | `_posts/2025-01-20-automatiser-ses-reportings-guide-pratique.md` | 7 | `/blog/facturation-electronique-2026-pme-integration-logiciels/`, `/blog/migration-talend-vers-talaxie/`, `/blog/pourquoi-vos-donnees-sont-votre-meilleur-atout/`, `/blog/ressaisies-tpe-pme-cout-cache/`, `/portfolio/reporting-change-itop.html`, `/portfolio/uba-data-automation.html`, `/services/` |
| `/services/` | `pages/services.html` | 7 | `/`, `/blog/architecture-data-PME/`, `/blog/les-termes-data/`, `/blog/page2/`, `/blog/page3/`, `/blog/page4/`, `/blog/page5/` |
| `/blog/architecture-data-PME/` | `_posts/2026-03-09-architecture-data-PME.md` | 8 | `/blog/facturation-electronique-2026-pme-integration-logiciels/`, `/blog/les-termes-data/`, `/blog/migration-talend-vers-talaxie/`, `/blog/tWriteJSONField/`, `/portfolio/migration-talend-oss-talaxie.html`, `/portfolio/sofipel-interconnexion-keplervo.html`, `/portfolio/uba-data-automation.html`, `/services/` |
| `/realisations/` | `pages/realisations.html` | 9 | `/`, `/a-propos/`, `/blog/architecture-data-PME/`, `/blog/les-termes-data/`, `/blog/page2/`, `/blog/page3/`, `/blog/page4/`, `/blog/page5/`, `/blog/utilisation-talend/` |
| `/contact/` | `pages/contact.html` | 10 | `/`, `/a-propos/`, `/blog/`, `/blog/page2/`, `/blog/page3/`, `/blog/page4/`, `/blog/page5/`, `/faq/`, `/score-maturite-data/`, `/services/` |
| `/score-maturite-data/` | `pages/score-maturite-data.html` | 12 | `/`, `/blog/automatisation-pme-bon-moment/`, `/blog/changer-logiciel-sans-perdre-donnees-pme/`, `/blog/facturation-electronique-2026-pme-integration-logiciels/`, `/blog/heures-perdues-taches-repetitives/`, `/blog/ia-la-cerise-sur-le-gateau/`, `/blog/page2/`, `/blog/page3/`, `/blog/page4/`, `/blog/page5/`, `/blog/ressaisies-tpe-pme-cout-cache/`, `/blog/tableau-de-bord-et-pilotage-temps-reel/` |

## Pages orphelines — 0 lien entrant contextuel

Ces pages ne sont accessibles que via la navigation, la pagination du blog ou le sitemap — aucune page n'y mène depuis son corps de texte. C'est la cause première du statut « Détectée, actuellement non indexée » dans GSC.

| URL | Fichier source | Profondeur de clic |
|---|---|---|
| `/a-propos/` | `pages/a-propos.html` | 1 |
| `/faq/` | `pages/faq.html` | 1 |

## Profondeur de clic depuis l'accueil

Distance minimale depuis `/` en suivant **uniquement** les liens contextuels et la navigation principale (la pagination du blog est volontairement exclue). `∞` = inatteignable par ce chemin.

- Navigation principale : `/`, `/services/`, `/realisations/`, `/a-propos/`, `/blog/`, `/faq/`, `/score-maturite-data/`, `/contact/`

| URL | Fichier source | Profondeur |
|---|---|---|
| `/` | `index.html` | 0 |
| `/a-propos/` | `pages/a-propos.html` | 1 |
| `/contact/` | `pages/contact.html` | 1 |
| `/faq/` | `pages/faq.html` | 1 |
| `/realisations/` | `pages/realisations.html` | 1 |
| `/score-maturite-data/` | `pages/score-maturite-data.html` | 1 |
| `/services/` | `pages/services.html` | 1 |
| `/blog/architecture-data-PME/` | `_posts/2026-03-09-architecture-data-PME.md` | 2 |
| `/blog/automatiser-ses-reportings-guide-pratique/` | `_posts/2025-01-20-automatiser-ses-reportings-guide-pratique.md` | 2 |
| `/blog/ia-la-cerise-sur-le-gateau/` | `_posts/2026-06-22-ia-la-cerise-sur-le-gateau.md` | 2 |
| `/blog/tableau-de-bord-comment-piloter-son-activite/` | `_posts/2024-11-08-tableau-de-bord-comment-piloter-son-activite.md` | 2 |
| `/blog/API-et-Webhook-talaxie-esb/` | `_posts/2026-02-05-API-et-Webhook-talaxie-esb.md` | 3 |
| `/blog/automatisation-pme-bon-moment/` | `_posts/2026-04-30-automatisation-pme-bon-moment.md` | 3 |
| `/blog/excel-vs-power-bi-lequel-choisir/` | `_posts/2024-12-03-excel-vs-power-bi-lequel-choisir.md` | 3 |
| `/blog/migration-talend-vers-talaxie/` | `_posts/2025-10-07-migration-talend-vers-talaxie.md` | 3 |
| `/blog/pourquoi-vos-donnees-sont-votre-meilleur-atout/` | `_posts/2024-10-15-pourquoi-vos-donnees-sont-votre-meilleur-atout.md` | 3 |
| `/blog/ressaisies-tpe-pme-cout-cache/` | `_posts/2026-04-04-ressaisies-tpe-pme-cout-cache.md` | 3 |
| `/blog/tSchemaComplianceCheck/` | `_posts/2026-01-08-tSchemaComplianceCheck.md` | 3 |
| `/blog/tWriteJSONField/` | `_posts/2025-12-16-tWriteJSONField.md` | 3 |
| `/blog/tableau-de-bord-et-pilotage-temps-reel/` | `_posts/2026-06-04-tableau-de-bord-et-pilotage-temps-reel.md` | 3 |
| `/blog/talend-studios/` | `_posts/2025-09-17-talend-studios.md` | 3 |
| `/blog/utilisation-talend/` | `_posts/2025-11-03-utilisation-talend.md` | 3 |
| `/blog/utiliser-l-ia-au-quotidien/` | `_posts/2026-01-16-utiliser-l-ia-au-quotidien.md` | 3 |
| `/portfolio/sofipel-interconnexion-keplervo.html` | `portfolio/sofipel-interconnexion-keplervo.html` | 3 |
| `/portfolio/uba-data-automation.html` | `portfolio/uba-data-automation.html` | 3 |
| `/blog/API-et-Webhook-talaxie-esb-2/` | `_posts/2026-02-05-API-et-Webhook-talaxie-esb-2.md` | 4 |
| `/blog/changer-logiciel-sans-perdre-donnees-pme/` | `_posts/2026-04-24-changer-logiciel-sans-perdre-donnees-pme.md` | 4 |
| `/blog/chiffrer-des-mots-de-passe-AES/` | `_posts/2025-11-18-chiffrer-des-mots-de-passe-AES.md` | 4 |
| `/blog/heures-perdues-taches-repetitives/` | `_posts/2026-06-08-heures-perdues-taches-repetitives.md` | 4 |
| `/blog/les-termes-data/` | `_posts/2026-03-10-les-termes-data.md` | 4 |
| `/blog/tFileOutputPDF2/` | `_posts/2025-10-15-tFileOutputPDF2.md` | 4 |
| `/portfolio/dashboardtv-operations.html` | `portfolio/dashboardtv-operations.html` | 4 |
| `/portfolio/edi-tms-oneworld.html` | `portfolio/edi-tms-oneworld.html` | 4 |
| `/portfolio/media-participations-migration.html` | `portfolio/media-participations-migration.html` | 4 |
| `/portfolio/migration-talend-oss-talaxie.html` | `portfolio/migration-talend-oss-talaxie.html` | 4 |
| `/portfolio/reporting-change-itop.html` | `portfolio/reporting-change-itop.html` | 4 |
| `/blog/chiffrer-des-mots-de-passe-base64/` | `_posts/2025-11-17-chiffrer-des-mots-de-passe-base64.md` | 5 |
| `/blog/facturation-electronique-2026-pme-integration-logiciels/` | `_posts/2026-04-21-facturation-electronique-2026-pme-integration-logiciels.md` | 5 |
| `/portfolio/edi-wms-izypro.html` | `portfolio/edi-wms-izypro.html` | 5 |
| `/portfolio/eiffage-migration-medicale.html` | `portfolio/eiffage-migration-medicale.html` | 5 |
| `/portfolio/frele-loup-migration-prestashop.html` | `portfolio/frele-loup-migration-prestashop.html` | 5 |
| `/blog/rgpd-donnees-clients-guide-pme/` | `_posts/2025-02-18-rgpd-donnees-clients-guide-pme.md` | 6 |
| `/portfolio/edi-wms-reflex.html` | `portfolio/edi-wms-reflex.html` | 6 |

## Liens contextuels sortants des pages fortes

Pour préparer le maillage descendant (pages à fort trafic → orphelines).

| Page forte | Liens contextuels sortants |
|---|---|
| `/blog/migration-talend-vers-talaxie/` | `/blog/talend-studios/`, `/blog/automatiser-ses-reportings-guide-pratique/`, `/blog/architecture-data-PME/`, `/portfolio/migration-talend-oss-talaxie.html` |
| `/blog/talend-studios/` | `/blog/les-termes-data/`, `/blog/API-et-Webhook-talaxie-esb/`, `/blog/migration-talend-vers-talaxie/` |
| `/blog/tWriteJSONField/` | `/blog/architecture-data-PME/`, `/blog/tSchemaComplianceCheck/`, `/blog/tFileOutputPDF2/` |
| `/` | `/contact/`, `/services/`, `/score-maturite-data/`, `/realisations/`, `/temoignages/` |
| `/blog/tFileOutputPDF2/` | `/blog/migration-talend-vers-talaxie/` |

## Capacité — liens contextuels sortants par page

Règle : ≤ 3 liens sortants pour un article normal (les pages piliers/glossaire peuvent en avoir plus). Sert à savoir où l'on peut encore ajouter un lien sans sur-lier.

| Page source | Nb sortants | Cibles |
|---|---:|---|
| `/blog/architecture-data-PME/` | 10 | `/blog/utilisation-talend/`, `/blog/tWriteJSONField/`, `/blog/tSchemaComplianceCheck/`, `/blog/talend-studios/`, `/blog/migration-talend-vers-talaxie/`, `/blog/API-et-Webhook-talaxie-esb/`, `/services/`, `/portfolio/uba-data-automation.html`, `/portfolio/sofipel-interconnexion-keplervo.html`, `/realisations/` |
| `/blog/les-termes-data/` | 10 | `/blog/architecture-data-PME/`, `/blog/API-et-Webhook-talaxie-esb/`, `/blog/tWriteJSONField/`, `/blog/utilisation-talend/`, `/blog/tSchemaComplianceCheck/`, `/services/`, `/blog/chiffrer-des-mots-de-passe-AES/`, `/blog/migration-talend-vers-talaxie/`, `/realisations/`, `/` |
| `/blog/facturation-electronique-2026-pme-integration-logiciels/` | 6 | `/blog/ressaisies-tpe-pme-cout-cache/`, `/blog/architecture-data-PME/`, `/score-maturite-data/`, `/blog/rgpd-donnees-clients-guide-pme/`, `/blog/automatiser-ses-reportings-guide-pratique/`, `/blog/pourquoi-vos-donnees-sont-votre-meilleur-atout/` |
| `/` | 5 | `/contact/`, `/services/`, `/score-maturite-data/`, `/realisations/`, `/temoignages/` |
| `/blog/changer-logiciel-sans-perdre-donnees-pme/` | 4 | `/blog/ressaisies-tpe-pme-cout-cache/`, `/blog/facturation-electronique-2026-pme-integration-logiciels/`, `/portfolio/frele-loup-migration-prestashop.html`, `/score-maturite-data/` |
| `/blog/migration-talend-vers-talaxie/` | 4 | `/blog/talend-studios/`, `/blog/automatiser-ses-reportings-guide-pratique/`, `/blog/architecture-data-PME/`, `/portfolio/migration-talend-oss-talaxie.html` |
| `/blog/ressaisies-tpe-pme-cout-cache/` | 4 | `/blog/automatiser-ses-reportings-guide-pratique/`, `/blog/changer-logiciel-sans-perdre-donnees-pme/`, `/portfolio/uba-data-automation.html`, `/score-maturite-data/` |
| `/blog/utilisation-talend/` | 4 | `/blog/changer-logiciel-sans-perdre-donnees-pme/`, `/blog/talend-studios/`, `/portfolio/edi-tms-oneworld.html`, `/realisations/` |
| `/portfolio/media-participations-migration.html` | 4 | `/blog/changer-logiciel-sans-perdre-donnees-pme/`, `/blog/tSchemaComplianceCheck/`, `/portfolio/frele-loup-migration-prestashop.html`, `/portfolio/eiffage-migration-medicale.html` |
| `/services/` | 4 | `/blog/automatiser-ses-reportings-guide-pratique/`, `/blog/tableau-de-bord-comment-piloter-son-activite/`, `/blog/architecture-data-PME/`, `/contact/` |
| `/blog/automatiser-ses-reportings-guide-pratique/` | 3 | `/blog/pourquoi-vos-donnees-sont-votre-meilleur-atout/`, `/blog/ressaisies-tpe-pme-cout-cache/`, `/blog/automatisation-pme-bon-moment/` |
| `/blog/excel-vs-power-bi-lequel-choisir/` | 3 | `/blog/tableau-de-bord-comment-piloter-son-activite/`, `/blog/tableau-de-bord-et-pilotage-temps-reel/`, `/portfolio/reporting-change-itop.html` |
| `/blog/heures-perdues-taches-repetitives/` | 3 | `/blog/automatisation-pme-bon-moment/`, `/score-maturite-data/`, `/blog/utiliser-l-ia-au-quotidien/` |
| `/blog/tSchemaComplianceCheck/` | 3 | `/blog/tWriteJSONField/`, `/blog/tFileOutputPDF2/`, `/portfolio/media-participations-migration.html` |
| `/blog/tWriteJSONField/` | 3 | `/blog/architecture-data-PME/`, `/blog/tSchemaComplianceCheck/`, `/blog/tFileOutputPDF2/` |
| `/blog/tableau-de-bord-comment-piloter-son-activite/` | 3 | `/blog/tableau-de-bord-et-pilotage-temps-reel/`, `/blog/pourquoi-vos-donnees-sont-votre-meilleur-atout/`, `/blog/excel-vs-power-bi-lequel-choisir/` |
| `/blog/talend-studios/` | 3 | `/blog/les-termes-data/`, `/blog/API-et-Webhook-talaxie-esb/`, `/blog/migration-talend-vers-talaxie/` |
| `/portfolio/dashboardtv-operations.html` | 3 | `/blog/tableau-de-bord-et-pilotage-temps-reel/`, `/blog/tableau-de-bord-comment-piloter-son-activite/`, `/portfolio/reporting-change-itop.html` |
| `/portfolio/edi-wms-izypro.html` | 3 | `/blog/utilisation-talend/`, `/portfolio/edi-tms-oneworld.html`, `/portfolio/edi-wms-reflex.html` |
| `/portfolio/edi-wms-reflex.html` | 3 | `/blog/utilisation-talend/`, `/portfolio/edi-wms-izypro.html`, `/portfolio/edi-tms-oneworld.html` |
| `/portfolio/eiffage-migration-medicale.html` | 3 | `/blog/rgpd-donnees-clients-guide-pme/`, `/blog/changer-logiciel-sans-perdre-donnees-pme/`, `/portfolio/media-participations-migration.html` |
| `/portfolio/migration-talend-oss-talaxie.html` | 3 | `/blog/migration-talend-vers-talaxie/`, `/blog/talend-studios/`, `/blog/architecture-data-PME/` |
| `/portfolio/reporting-change-itop.html` | 3 | `/blog/excel-vs-power-bi-lequel-choisir/`, `/blog/automatiser-ses-reportings-guide-pratique/`, `/portfolio/dashboardtv-operations.html` |
| `/portfolio/sofipel-interconnexion-keplervo.html` | 3 | `/blog/architecture-data-PME/`, `/blog/API-et-Webhook-talaxie-esb/`, `/portfolio/uba-data-automation.html` |
| `/portfolio/uba-data-automation.html` | 3 | `/blog/architecture-data-PME/`, `/blog/ressaisies-tpe-pme-cout-cache/`, `/blog/automatiser-ses-reportings-guide-pratique/` |
| `/a-propos/` | 2 | `/contact/`, `/realisations/` |
| `/blog/API-et-Webhook-talaxie-esb/` | 2 | `/blog/API-et-Webhook-talaxie-esb-2/`, `/blog/chiffrer-des-mots-de-passe-AES/` |
| `/blog/automatisation-pme-bon-moment/` | 2 | `/blog/heures-perdues-taches-repetitives/`, `/score-maturite-data/` |
| `/blog/ia-la-cerise-sur-le-gateau/` | 2 | `/blog/utiliser-l-ia-au-quotidien/`, `/score-maturite-data/` |
| `/blog/pourquoi-vos-donnees-sont-votre-meilleur-atout/` | 2 | `/blog/heures-perdues-taches-repetitives/`, `/blog/automatiser-ses-reportings-guide-pratique/` |
| `/blog/rgpd-donnees-clients-guide-pme/` | 2 | `/blog/pourquoi-vos-donnees-sont-votre-meilleur-atout/`, `/portfolio/eiffage-migration-medicale.html` |
| `/blog/tableau-de-bord-et-pilotage-temps-reel/` | 2 | `/portfolio/dashboardtv-operations.html`, `/score-maturite-data/` |
| `/portfolio/edi-tms-oneworld.html` | 2 | `/blog/utilisation-talend/`, `/portfolio/edi-wms-izypro.html` |
| `/portfolio/frele-loup-migration-prestashop.html` | 2 | `/blog/changer-logiciel-sans-perdre-donnees-pme/`, `/portfolio/media-participations-migration.html` |
| `/score-maturite-data/` | 2 | `/politique-de-confidentialite/`, `/contact/` |
| `/blog/API-et-Webhook-talaxie-esb-2/` | 1 | `/blog/API-et-Webhook-talaxie-esb/` |
| `/blog/chiffrer-des-mots-de-passe-AES/` | 1 | `/blog/chiffrer-des-mots-de-passe-base64/` |
| `/blog/chiffrer-des-mots-de-passe-base64/` | 1 | `/blog/chiffrer-des-mots-de-passe-AES/` |
| `/blog/tFileOutputPDF2/` | 1 | `/blog/migration-talend-vers-talaxie/` |
| `/contact/` | 1 | `/politique-de-confidentialite/` |
| `/faq/` | 1 | `/contact/` |
| `/blog/utiliser-l-ia-au-quotidien/` | 0 | _aucun_ |
| `/realisations/` | 0 | _aucun_ |
