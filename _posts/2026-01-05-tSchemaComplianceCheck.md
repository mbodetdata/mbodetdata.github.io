---
layout: post
title: "Talaxie : sécuriser l’entrée du pipeline avec tSchemaComplianceCheck (Main/Reject, contrat strict, cas concret)"
description: "Comment utiliser tSchemaComplianceCheck pour imposer un contrat métier dès l’entrée, rejeter les données hors-format et protéger la production : schéma de test, Main/Reject et bonnes pratiques."
categories: blog
tags: [Talend, Talaxie, Qualité des données, Schéma, tSchemaComplianceCheck, ETL, Bonnes pratiques]
image: "/assets/img/blog/8-tschemacompliancecheck/logo_1024.webp"
active: false
parent_category: talend-talaxie
category_label: Talaxie
---

## Le vrai danger : la donnée “presque correcte”

Dans un projet data, le vrai problème n’est pas la donnée manquante.

Le vrai danger, c’est la donnée **presque conforme** :
- une date dans “un autre” format,
- un entier stocké en texte,
- un champ obligatoire parfois vide,
- un booléen “à peu près”.

Et le jour où ça casse… ça casse **en production**, souvent loin de la source, et toujours au pire moment.

L’objectif de cet article est simple :

> **Dans un pipeline sérieux, tu laisses passer uniquement ce qui respecte le contrat.  
> Le reste doit être rejeté.**

C’est précisément le rôle de **`tSchemaComplianceCheck`** : reprendre le contrôle **dès l’entrée** et protéger la PROD.

---

## 1. tSchemaComplianceCheck : ce que c’est, et surtout ce que ce n’est pas

`tSchemaComplianceCheck` est un composant de **contrôle de conformité**.

Son rôle est clair :
> **Vérifier que la donnée reçue respecte le schéma attendu (types, formats, contraintes)… puis trier.**

Points clés à bien comprendre :  
✅ Il ne “répare” pas la donnée  
✅ Il ne “devine” pas  
✅ Il applique un **contrat**, puis **sépare**

### Ce que le composant contrôle

Selon ta configuration, il peut valider :
- le **type** (String, Integer, Date, Boolean…),
- la **nullabilité**,
- la **taille / longueur**,
- le **format des dates**.

Et surtout, il génère **deux flux distincts** :
- **Main** → conforme : le pipeline continue
- **Reject** → hors-contrat : tu mets de côté (et tu exploites)

👉 Le découplage **Main / Reject** est la vraie valeur de ce composant.

---

## 2. Le pattern Talaxie : “Lire large, valider strict”

Dans la vraie vie, tu reçois des fichiers “sales”.

Le piège classique :
- soit être **trop strict dès la lecture** → le job plante
- soit être **trop permissif** → tout passe, et tu construis une usine à gaz plus loin

Le bon pattern est toujours le même :

1. **Lecture tolérante** → ne jamais planter à la lecture  
2. **Validation stricte** → ne jamais polluer le pipeline  
3. **Rejet exploitable** → jamais une poubelle

👉 Un pipeline complexe mérite des données **simples, propres et prévisibles**.  
> La permissivité n’est pas de la robustesse.  
> La robustesse, c’est savoir dire **non**.

---

## 3. Les modes de configuration (et comment choisir)

### 3.1 Contrôle basé sur le schéma d’entrée

Le contrôle s’appuie directement sur le schéma entrant.

✅ Rapide à mettre en place  
⚠️ Peu utile si ton schéma d’entrée est permissif (ex : tout en String)

---

### 3.2 Règles personnalisées

Tu définis manuellement les règles colonne par colonne.

✅ Bien pour quelques champs critiques  
⚠️ Maintenance plus lourde dans le temps

---

### 3.3 Schéma de test (recommandé)

C’est l’approche la plus propre et la plus industrialisable.

Principe :
- le **schéma d’entrée** est tolérant (souvent 100 % String)
- le **schéma de test** représente le **contrat métier strict**
- `tSchemaComplianceCheck` valide la compatibilité

✅ Lecture sans blocage  
✅ Contrat métier explicite  
✅ Rejets exploitables  
👉 **C’est le pattern à privilégier dans la majorité des projets Talaxie.**

---

## 4. Cas concret : protéger la PROD avec un contrat strict

### 4.1 Les fichiers reçus

On reçoit deux fichiers :
- `personnes.csv`
- `adresses.csv`

Ils contiennent tout ce que tu connais :
- séparateur `;`
- formats incohérents
- champs vides
- types non respectés
- valeurs “humaines” (`yes`, `1`, `FALSE`, …)

👉 Exactement le genre de fichiers qui passent “presque toujours”… jusqu’au jour où non.

---

## 4.2 Le pipeline naïf (et pourquoi il est dangereux)

Le pipeline naïf, c’est :
- soit **rejeter trop tôt** → plus rien ne rentre
- soit **tout laisser passer** → dette technique assurée

### Trop strict dès la lecture

Un schéma d’entrée trop strict peut :
- faire planter le job,
- bloquer un traitement,
- provoquer un incident en PROD.

Oui, certains composants d’entrée ont un flux Reject.  
Mais :
- tous ne se comportent pas pareil,
- ce n’est pas leur rôle principal.

👉 `tSchemaComplianceCheck` est **fait pour ça** : poser un contrôle cohérent, reproductible, et exploitable.

### Trop permissif

À l’inverse, tout laisser passer, c’est :
- gérer des cas particuliers partout,
- complexifier tes `tMap`,
- rendre le job fragile.

---

## 4.3 Le pipeline robuste (recommandé)

La bonne pratique est simple :  
**laisser entrer, puis trier.**

1. **Lecture tolérante**
   - `tFileInputDelimited`
   - schéma permissif (String)

2. **Contrôle de conformité**
   - `tSchemaComplianceCheck`
   - schéma de test = **contrat métier**

3. **Deux routes**
   - **Main** → données conformes
   - **Reject** → données hors-contrat

4. **Conversions maîtrisées**
   - `tMap` (conversion auto)
   - ou `tConvertType`

Résultat :
- aucun crash à la lecture,
- pipeline stable,
- anomalies isolées très tôt,
- traitement aval simplifié.

---

## 4.4 Pas à pas : intégrer tSchemaComplianceCheck dans ton job

### Pré-requis — Définition des schémas d’entrée

#### Personnes

On va créer un schéma d’entrée **tolérant** (tout en String).
![Schéma permissif personne]({{ '/assets/img/blog/8-tschemacompliancecheck/1-schema-personne-string.webp' | relative_url }}){:alt="Schéma permissif de personne" loading="lazy" decoding="async"}

> Ce schéma est utilisé pour la lecture dans le `tFileInputDelimited`.

On va également construire un schéma de contrôle, beaucoup plus strict : c’est **le contrat métier**.
![Schéma strict personne]({{ '/assets/img/blog/8-tschemacompliancecheck/2-schema-personne-strict.webp' | relative_url }}){:alt="Schéma strict de personne" loading="lazy" decoding="async"}

> Ce schéma est utilisé pour le contrôle et pour les traitements aval.

#### Adresses

On fait exactement la même chose que pour `personnes.csv`.

Schéma d’entrée tolérant (tout en String) :
![Schéma permissif adresse]({{ '/assets/img/blog/8-tschemacompliancecheck/1-schema-adresse-string.webp' | relative_url }}){:alt="Schéma permissif d'adresse" loading="lazy" decoding="async"}

Schéma strict (contrat métier) :
![Schéma strict adresse]({{ '/assets/img/blog/8-tschemacompliancecheck/2-schema-adresse-strict.webp' | relative_url }}){:alt="Schéma strict d'adresse" loading="lazy" decoding="async"}

---

### Étape 1 — Lecture tolérante de `personnes.csv`

- Ajoute un `tFileInputDelimited`
- Séparateur `;`
- Header = 1
- Encodage UTF-8
- Schéma : permissif (tout en String)

### Étape 2 — Lecture tolérante de `adresses.csv`

Fais exactement la même chose qu’à l’étape 1, mais avec le fichier adresses.

Normalement tu devrais obtenir quelque chose qui ressemble à ça :
![Visualisation du job tFileInputDelimited et tLogRow]({{ '/assets/img/blog/8-tschemacompliancecheck/3-exemple_1-execution.webp' | relative_url }}){:alt="Visualisation du job tFileInputDelimited et tLogRow" loading="lazy" decoding="async"}

---

### Étape 3 — Ajouter `tSchemaComplianceCheck`

Pour tes deux sous-jobs, le but est d’ajouter `tSchemaComplianceCheck` :

- Relie le flux **Main**
- Active le schéma de test (contrat métier)
- Branche :
  - Main → traitement normal
  - Reject → journalisation (ici, `tLogRow`)

Voici la configuration à utiliser sur `tSchemaComplianceCheck` (exemple sur *personnes*) :
![tSchemaComplianceCheck de Personnes]({{ '/assets/img/blog/8-tschemacompliancecheck/4-tSchemaComplianceCheck-personne.webp' | relative_url }}){:alt="Configuration du tSchemaComplianceCheck de personnes" loading="lazy" decoding="async"}

> ⚠️ Important : `tSchemaComplianceCheck` **ne convertit pas les types**.  
> Il vérifie la compatibilité avec le schéma de test.  
> La conversion réelle doit être faite **après**, via `tConvertType` (ou `tMap`).

Comme les données du flux Main doivent correspondre au schéma strict, tu vas devoir convertir le schéma (String → types métiers) :
![tConvertType, pour aligner le schéma]({{ '/assets/img/blog/8-tschemacompliancecheck/4-tConvertType-personne.webp' | relative_url }}){:alt="tConvertType pour aligner le schéma" loading="lazy" decoding="async"}

Pour le flux Reject, reste en **Built-in** : `tSchemaComplianceCheck` ajoute automatiquement deux colonnes (ex : `errorCode`, `errorMessage`) pour expliquer le rejet.
![Schéma de rejet]({{ '/assets/img/blog/8-tschemacompliancecheck/4-tSchemaComplianceCheck-personne-rejects.webp' | relative_url }}){:alt="Schéma de rejet du tSchemaComplianceCheck" loading="lazy" decoding="async"}

> Note : la configuration montrée ici est un exemple.  
> Il n’existe pas de configuration universelle : **le contrat métier dépend toujours du pipeline aval**.

---

### Étape 4 — Exploiter le Reject

Pour l’instant, les rejets sont simplement affichés via un `tLogRow`.

Tu peux bien entendu les utiliser pour :
- log technique,
- fichier d’erreurs pour la source / le client,
- analyse qualité,
- process de correction séparé si besoin.

---

## 4.5 Exemple de contrat strict sur la date (zéro tolérance)

Dans ce cas concret, on choisit volontairement un contrat strict :

- `date_de_naissance` doit être au format **`dd/MM/yyyy`**
- **un seul format**
- toute autre représentation est considérée comme **hors-contrat** et part en Reject

⚠️ Une date “compréhensible” ne suffit pas.  
Une date valide, c’est une date **compatible avec le pipeline aval**.

👉 Oui, ça peut générer des rejets.  
👉 Et c’est justement le but : **protéger la production**.

---

## 5. Et si tu veux corriger les données ?

Très simple : maintenant que tu sais router tes rejets, tu peux mettre en place un process séparé qui les récupère et les corrige.

Tu obtiens deux pipelines :
- **Pipeline PROD** → strict, protecteur
- **Pipeline de normalisation** → à part

> L’avantage ?  
> Une séparation claire des responsabilités.

---

## Ressources partagées

Pour reproduire exactement ce cas :

- 📦 **Job Talend complet (repo GitHub)**  
  👉 https://github.com/TON_ORGA/talaxie-tschemacompliancecheck *(remplace par ton vrai lien, ou indique “lien à venir”)*

- 📄 Fichiers CSV d’exemple  
- 🧪 Schémas Talend (entrée + schéma de test)

---

## Le mot de la fin

`tSchemaComplianceCheck` n’est pas optionnel.  
C’est un **point de contrôle stratégique**.

> **Lire large, valider strict.**

Si tu laisses passer des données “presque conformes”,  
tu prends une dette technique…  
et tu la paieras en production.

Avec ce pattern :
- tu simplifies tes jobs,
- tu fiabilises tes pipelines,
- tu maîtrises tes rejets,
- tu industrialises.

👉 Tu passes d’un ETL qui subit…  
à un ETL **qui protège la PROD**.
---
