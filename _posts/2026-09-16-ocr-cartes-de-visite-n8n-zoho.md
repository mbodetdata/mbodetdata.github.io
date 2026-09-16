---
layout: post
title: "OCR de cartes de visite avec n8n : la saisie dans le CRM en trois secondes"
description: "Deux photos, trois secondes, une fiche créée dans Zoho. Le workflow n8n détaillé nœud par nœud : formulaire, OCR, structuration par IA, création du prospect."
date: 2026-09-16
categories: [automatisation, interconnexion]
tags: [n8n, automatisation, OCR, Google Vision, CRM, Zoho, IA, Mistral, Infomaniak, workflow, gain de temps, traçabilité]
author: Martial Bodet
excerpt: "Après quelques événements de networking, j'avais une pile de cartes de visite sur le coin du bureau. Et la promesse, renouvelée chaque vendredi, de tout saisir dans mon CRM le week-end venu. Le week-end est arrivé. Il est reparti. La pile est restée."
image: "/assets/img/blog/29-ocr-cartes-de-visite-n8n-zoho/logo_1024.webp"
active: true
parent_category: data
category_label: Automatisation
---

Après quelques événements de networking, j'avais une pile de cartes de visite sur le coin du bureau. Et la promesse, renouvelée chaque vendredi, de tout saisir dans mon CRM le week-end venu.

Le week-end est arrivé. Il est reparti. La pile est restée.

Le plus embarrassant, c'est que mon métier consiste précisément à supprimer ce genre de tâche chez mes clients. Alors un soir, j'ai appliqué mon propre conseil et j'ai monté le flux.

Le résultat tient en une phrase : je photographie une carte depuis mon téléphone, et trois secondes plus tard la fiche existe dans Zoho, remplie, avec les photos d'origine attachées.

Cet article détaille la construction, les étapes clefs, avec les arbitrages que j'ai faits et ceux que j'ai écartés.

---

## La vue d'ensemble du flux

Cinq étapes, toutes dans n8n :

1. Un formulaire qui reçoit les deux photos de la carte
2. La lecture du texte présent sur les images
3. La structuration de ce texte en JSON exploitable
4. La création du prospect dans le CRM
5. Le rattachement des photos d'origine à la fiche créée

![Vue d'ensemble du workflow n8n]({{ '/assets/img/blog/29-ocr-cartes-de-visite-n8n-zoho/1-workflow-complet.webp' | relative_url }}){:alt="Workflow n8n complet : formulaire, lecture, structuration, création CRM, pièces jointes" loading="lazy" decoding="async"}

> 📸 *Le flux complet dans n8n : cinq étapes, du formulaire à la fiche CRM.*

Rien d'exotique. La valeur ne se trouve pas dans la sophistication technique, elle se trouve dans les décisions prises à chaque étape.

---

## 1. Le déclencheur : un formulaire natif n8n

Premier réflexe, que j'ai eu et que je vous invite à ne pas suivre : construire une petite page web dédiée pour la capture des photos.

J'ai commencé à y réfléchir sérieusement. Mon site est hébergé sur GitHub, donc pas de backend disponible pour recevoir un upload. Il fallait donc ajouter un espace de stockage, gérer l'authentification, brancher le tout sur le flux. Pour un formulaire à deux champs.

Le nœud **On form submission** de n8n fait exactement ce travail, sans rien à héberger. Il expose une URL, affiche un formulaire responsive et déclenche le workflow à la soumission.

Ma configuration :

| Champ | Type | Obligatoire |
|---|---|---|
| Recto de la carte | Fichier | Oui |
| Verso de la carte | Fichier | Non |
| Code d'accès | Mot de passe | Oui |

![Configuration du nœud On form submission]({{ '/assets/img/blog/29-ocr-cartes-de-visite-n8n-zoho/2-form-trigger-config.webp' | relative_url }}){:alt="Configuration des champs du nœud On form submission dans n8n" loading="lazy" decoding="async"}

> 📸 *Les trois champs du On form submission, côté configuration n8n.*

Le **verso est optionnel**, parce que beaucoup de cartes sont vierges au dos et qu'un champ obligatoire inutile est un champ qui finit par bloquer.

Le **code d'accès** mérite une explication. L'URL d'un On form submission est publique. Elle est difficile à deviner, mais publique. Sans contrôle, n'importe qui tombant dessus peut injecter des fiches dans mon CRM et consommer mes appels d'IA. Un simple code vérifié dès le premier nœud, et le flux s'arrête net si la valeur ne correspond pas.

> 💡 C'est le genre de détail qu'on saute quand on bricole pour soi. C'est aussi le genre de détail qui transforme un bricolage en outil utilisable.

Je garde l'URL en favori sur l'écran d'accueil de mon téléphone. En sortie d'événement, je vide mes poches directement dans le formulaire.

![Le formulaire vu depuis un téléphone]({{ '/assets/img/blog/29-ocr-cartes-de-visite-n8n-zoho/3-formulaire-mobile.webp' | relative_url }}){:alt="Le formulaire n8n affiché sur un téléphone mobile" loading="lazy" decoding="async"}

> 📸 *Le formulaire tel qu'il s'affiche sur le téléphone, en sortie d'événement.*

---

## 2. Lire le texte de la carte

Une carte de visite est un cauchemar pour la lecture automatique. Typographies fantaisistes, texte sur fond photo, logo qui chevauche les coordonnées, verso en blanc sur noir, texte imprimé en diagonale.

Pour cette étape, j'utilise **Google Vision**. Concrètement, l'image part en **base64 dans un appel HTTP** et le texte revient. Rien de plus.

C'est aussi la brique que je compte remplacer par un modèle hébergé chez **Infomaniak**, et ce n'est pas un détail de confort : je traite des coordonnées professionnelles de personnes réelles, avec leur nom, leur téléphone et leur email. Savoir où ces données transitent fait partie du cahier des charges, pas des options. Le sujet est développé dans [RGPD et données clients](/blog/rgpd-donnees-clients-guide-pme/).

> 💡 Un flux bien découpé se ré-arbitre brique par brique. Changer le moteur de lecture ne touche ni le formulaire, ni la structuration, ni le CRM : c'est un seul nœud à remplacer.

![Texte brut remonté par la lecture automatique]({{ '/assets/img/blog/29-ocr-cartes-de-visite-n8n-zoho/4-texte-brut-ocr.webp' | relative_url }}){:alt="Panneau de sortie n8n montrant le texte brut extrait de la carte de visite" loading="lazy" decoding="async"}

> 📸 *Ce que remonte la lecture : du texte, dans le désordre.*

---

## 3. Transformer du texte brut en données structurées

C'est l'étape que j'avais sous-estimée.

Le texte remonté est un bloc désordonné. Le nom peut arriver après le numéro de téléphone, la fonction se trouve parfois sur la ligne du dessus, l'adresse est éclatée sur trois lignes, et le mot « Directeur » peut aussi bien désigner la fonction que faire partie du nom de la société.

Ma première intention était d'écrire un nœud **Code** avec des expressions régulières. Repérer un email est trivial, un numéro de téléphone français reste faisable. Le reste devient une accumulation de règles fragiles, et chaque nouvelle carte casse une règle existante.

J'ai donc confié la structuration à un modèle de langage, **Ministral 14B** chez **Infomaniak**. Deux acteurs européens, et pour le coup c'est ici que les données identifiantes sont réellement manipulées : c'est l'étape où le choix de l'hébergeur pèse le plus lourd.

La consigne au modèle est stricte :

> Produire un JSON conforme au schéma fourni, sans texte autour, et **laisser vide** tout champ non identifié plutôt que d'inventer.

Cette dernière instruction est essentielle. Un modèle à qui on ne l'interdit pas explicitement comblera volontiers un champ manquant avec une valeur plausible. Un numéro de téléphone plausible dans un CRM, c'est un appel dans le vide six mois plus tard.

Le schéma que j'impose :

```json
{
  "nom": "",
  "prenom": "",
  "societe": "",
  "fonction": "",
  "email": "",
  "telephone_fixe": "",
  "portable": "",
  "site_web": "",
  "adresse": ""
}
```

![JSON structuré en sortie du modèle]({{ '/assets/img/blog/29-ocr-cartes-de-visite-n8n-zoho/5-json-structure.webp' | relative_url }}){:alt="Panneau de sortie n8n montrant le JSON structuré produit par le modèle" loading="lazy" decoding="async"}

> 📸 *Le même contenu, une étape plus loin : exploitable.*

Un mot sur l'arbitrage économique. J'ai écarté d'autres API payantes à l'usage. L'objectif était un coût marginal nul ou proche de zéro, parce qu'un outil personnel qu'on paie à l'appel finit par être utilisé avec parcimonie, donc mal utilisé.

---

## 4. Créer le prospect dans le CRM

Le nœud Zoho de n8n crée l'enregistrement dans le module **Prospects**, alimenté par le JSON de l'étape précédente.

Deux points de configuration qui comptent :

**L'origine du prospect** est forcée à `Cartes de visites`. Sans cette information, dans un an, je serai incapable de dire d'où vient un contact, ni quel canal d'acquisition mérite mon temps. Une donnée sans provenance perd la moitié de sa valeur.

**Le workflow renvoie une confirmation** à l'écran, avec le nom du prospect et son identifiant Zoho. Un flux qui tourne en silence est un flux dont on ne sait pas s'il a fonctionné. Une confirmation visible évite le doublon créé par acquit de conscience.

![Mapping des champs du nœud Zoho]({{ '/assets/img/blog/29-ocr-cartes-de-visite-n8n-zoho/6-zoho-mapping.webp' | relative_url }}){:alt="Mapping des champs du nœud Zoho CRM dans n8n" loading="lazy" decoding="async"}

> 📸 *Le mapping vers le module Prospects, avec l'origine forcée.*

![Écran de confirmation après soumission]({{ '/assets/img/blog/29-ocr-cartes-de-visite-n8n-zoho/7-confirmation.webp' | relative_url }}){:alt="Écran de confirmation affiché après la création du prospect" loading="lazy" decoding="async"}

> 📸 *La confirmation renvoyée à l'écran : nom du prospect et identifiant Zoho.*

---

## 5. La traçabilité, et c'est le cœur du sujet

Voici le point auquel je tiens le plus, et la raison pour laquelle j'ai écrit cet article.

> **Les deux photos d'origine sont rattachées en pièces jointes de la fiche créée.**

Le raisonnement est simple. Une lecture automatique se trompe. Pas souvent, mais elle se trompe. Un zéro pris pour un O, un nom composé coupé au mauvais endroit, un point manquant dans une adresse mail. Ce ne sont pas des incidents exceptionnels, c'est le régime normal de fonctionnement de ces outils.

La question pertinente n'est donc pas « comment éliminer l'erreur », parce que c'est hors de portée. La question est : **quand l'erreur se produit, combien de temps me faut-il pour la détecter et la corriger ?**

- **Sans les photos** : fouiller la pile de cartes sur le bureau, à condition de l'avoir gardée, à condition de retrouver la bonne. Autant dire que la correction n'aura jamais lieu.
- **Avec les photos attachées** : ouvrir la fiche, regarder l'image, corriger. Dix secondes.

![Fiche Zoho avec les photos en pièces jointes]({{ '/assets/img/blog/29-ocr-cartes-de-visite-n8n-zoho/8-fiche-zoho-pieces-jointes.webp' | relative_url }}){:alt="Fiche prospect Zoho affichant les deux photos de la carte en pièces jointes" loading="lazy" decoding="async"}

> 📸 *La fiche créée, avec le recto et le verso attachés. Le contrôle prend dix secondes.*

C'est la même logique que la ligne rejetée conservée dans un flux ETL, ou que le fichier source archivé après un import — le principe est détaillé dans [sécuriser le pipeline avec tSchemaComplianceCheck](/blog/tSchemaComplianceCheck/). La donnée transformée et sa source voyagent ensemble. Ce n'est pas de la précaution excessive, c'est ce qui sépare un système auditable d'une boîte noire.

Et c'est transposable bien au-delà des cartes de visite. Une facture fournisseur lue automatiquement, un bon de livraison scanné, un relevé d'heures photographié sur un chantier : dans tous ces cas, le document d'origine doit rester accessible depuis l'enregistrement qu'il a produit. Le jour où un montant est contesté, vous avez la pièce sous la main.

---

## Les pièges rencontrés

**Le verso optionnel.** Un champ fichier obligatoire pour une carte vierge au dos, et vous photographiez un rectangle blanc pour contourner votre propre outil. Un outil qu'on contourne est un outil mal conçu.

**Le modèle trop serviable.** Sans consigne explicite, l'IA remplit les trous. Interdisez-le dans le prompt et vérifiez le comportement sur une carte volontairement incomplète.

**L'absence de contrôle d'accès.** Une URL publique sans code, c'est une porte d'entrée dans votre CRM.

**Le flux muet.** Sans retour visible à l'écran, vous ne savez pas si la fiche a été créée et vous soumettez deux fois.

---

## À retenir

- Le déclencheur natif de n8n évite d'héberger une page web dédiée : pour un formulaire simple, c'est suffisant
- La structuration par IA est plus robuste que des expressions régulières sur des formats hétérogènes, à condition d'imposer un schéma strict et d'interdire l'invention
- L'origine de la donnée doit être renseignée dès la création, pas reconstituée plus tard
- **La source doit rester attachée à la donnée qu'elle a produite.** C'est le point qui rend l'automatisation vérifiable, donc utilisable dans la durée
- Le choix de l'hébergeur du modèle d'IA fait partie du cahier des charges dès qu'on traite des données personnelles

---

## FAQ

**Pourquoi n8n plutôt qu'un outil dédié au scan de cartes ?**

Les applications de scan de cartes existent et fonctionnent. Elles posent deux limites : le traitement part chez un éditeur sur lequel vous n'avez aucune visibilité, et vous ne maîtrisez pas la façon dont la donnée entre dans votre CRM. Ici, je décide du modèle, du champ d'origine, du format des téléphones et de ce qui reste attaché à la fiche.

**Est-ce que ça fonctionne avec un autre CRM que Zoho ?**

Oui. Seule la dernière étape change. Le principe reste identique avec HubSpot, Pipedrive, Odoo ou un CRM interne exposant une API. La partie lecture et structuration ne bouge pas. C'est exactement la logique décrite dans [connecter ses logiciels entre eux](/blog/connecter-ses-logiciels-entre-eux/).

**Combien de temps pour construire ça ?**

Une soirée pour la version qui fonctionne. Comptez davantage si vous voulez gérer les doublons, normaliser les numéros au format international ou enrichir automatiquement depuis une base d'entreprises.

**Et la gestion des doublons ?**

Elle n'est pas dans cette version. Sur mon volume, un contrôle visuel à la création suffit. Dans un contexte d'entreprise avec plusieurs commerciaux qui alimentent le même CRM, c'est une étape obligatoire : recherche sur l'email avant création, et mise à jour de la fiche existante plutôt que création d'un doublon.

**Faut-il des compétences de développeur ?**

Pour reproduire ce flux, non, mais il faut être à l'aise avec les notions d'API, de JSON et de mapping de champs. La difficulté n'est jamais l'outil. Elle se situe dans le cadrage : quels champs, quelles règles, que fait-on des cas particuliers, comment vérifie-t-on que le résultat est juste.

---

## Conclusion

Ce flux n'a rien d'une prouesse technique. Il assemble cinq briques existantes et fait disparaître une corvée.

Ce qui mérite d'être retenu, c'est le principe de l'étape 5. Automatiser une saisie est facile. Automatiser une saisie dont on peut vérifier le résultat sans y passer plus de temps que la saisie elle-même, c'est ce qui fait la différence entre un gadget et un outil sur lequel on s'appuie pendant des années.

Vous avez sûrement, vous aussi, une pile quelque part. Des bons de livraison, des feuilles d'heures, des factures fournisseurs, des fiches de chantier. Quelque chose qui existe sur papier et qui doit finir dans un logiciel, et que quelqu'un retape à la main. [Ce que ça coûte réellement à l'année](/blog/heures-perdues-taches-repetitives/) surprend souvent.

*"Vous voulez juste que ça marche, sans devenir informaticien. C'est exactement mon métier."*

