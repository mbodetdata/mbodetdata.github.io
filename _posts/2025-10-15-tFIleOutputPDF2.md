---
layout: post
title: "Créer un fichier PDF avec Talend (tFileOutputPDF2)"
description: "Tutoriel complet pour générer automatiquement un fichier PDF dans Talend Open Studio grâce au composant tFileOutputPDF2."
categories: blog
tags: [Talend, PDF, ETL, Reporting, Open Source, Data Integration]
image: "/assets/img/blog/3-Creation_PDF_Talend/creation-pdf-talend.png"
active: false
---

Le composant **tFileOutputPDF2** permet de générer un fichier PDF à partir d’un flux de données dans **Talend Open Studio**.  
Il s’agit d’un composant additionnel disponible sur **[Talend Exchange](https://exchange.talend.com/)**, capable de transformer un simple CSV en rapport PDF complet, avec titres, logo, en-têtes, tableaux et totaux.

Dans ce guide, nous verrons **comment l’utiliser pas à pas**, depuis l’installation du composant jusqu’à la configuration avancée du tableau.  

<!--more-->

---

## 1. Pré-requis

Avant de commencer :

- Talend Open Studio (7.x ou supérieur) installé.  
- Accès au **Talend Exchange** pour télécharger le composant `tFileOutputPDF2`.  
- Un fichier CSV d’entrée (par ex. `ventes.csv`).  
- Un projet Talend (exemple : `WIKI_PDF` dans le workspace `WS_WIKI`).

> 💡 **Astuce :** si vous obtenez une erreur lors de l’ajout du composant, suivez la documentation *“Ajouter un composant à Talend”* sur Talend Exchange.

---

## 2. Présentation du composant tFileOutputPDF2

Une fois installé, vous trouverez le composant dans la catégorie :  
**Fichier → Écriture**.

Il permet de générer un **tableau PDF** à partir d’un flux Talend, tout en personnalisant :
- Le **titre**, **sous-titre**, **commentaire** et **logo**,  
- Le **style d’écriture** (police, taille, couleur RVB, alignement),  
- Et la **mise en forme du tableau** (largeur des colonnes, lignes alternées, totaux…).

![Composant tFileOutputPDF2]({{ '/assets/img/blog/3-Creation_PDF_Talend/1-composant-tfileoutputpdf2.png' | relative_url }}){:alt="Composant tFileOutputPDF2 dans Talend" loading="lazy" decoding="async"}

---

## 3. Paramètres simples

Le panneau “Basic settings” permet de définir les principaux éléments du PDF.

| Champ | Description |
|:------|:-------------|
| **Titre / Sous-titre / Commentaire** | Textes affichés en haut du rapport |
| **Logo** | Image insérée dans l’en-tête |
| **Schéma** | Définit les colonnes du tableau |
| **Aspect** | Active la personnalisation (police, couleur, taille...) |

### Exemple de configuration

```text
Title: Rapport des ventes
Subtitle: Données consolidées - Octobre
Commentaire: Généré automatiquement par Talend
Logo: /images/logo.png
