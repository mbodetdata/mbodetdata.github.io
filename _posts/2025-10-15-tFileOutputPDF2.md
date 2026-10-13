---
layout: post
title: "Créer un fichier PDF avec Talend (tFileOutputPDF2)"
description: "Tutoriel complet et illustré pour intégrer le composant tFileOutputPDF2 dans Talend Open Studio ou Talaxie, et générer automatiquement un rapport PDF à partir de vos données."
categories: blog
tags: [Talend, PDF, ETL, Reporting, Open Source, Data Integration]
image: "/assets/img/blog/3-tFileOutputPDF2/title.webp"
active: true
parent_category: talend-talaxie
category_label: Talaxie / Talend
---

Dans beaucoup de projets Talend, on se retrouve tôt ou tard avec le même besoin :  
**sortir un rapport PDF lisible à partir d’un flux de données.**  

Sauf que… Talend Open Studio (et même Talaxie) ne propose aucun composant natif pour ça.  
La bonne nouvelle ? Il existe une solution **simple et efficace**, encore trop méconnue : **tFileOutputPDF2**, un composant communautaire archivé sur GitHub.

Ce guide explique comment :
1. **Installer** le composant,  
2. **Le configurer** dans Talend,  
3. **Construire un job complet** qui génère un PDF prêt à partager.

---

> 💡 **Astuce — Compatibilité Talaxie**  
> Ce composant fonctionne parfaitement sous **Talaxie**, le fork open source de Talend.  
> Si vous migrez ou prévoyez de le faire, consultez :  
> [Migrer Talend vers Talaxie →](https://bmdata.fr/blog/migration-talend-vers-talaxie/)

<!--more-->

---

## 1. Préparer l’environnement

Avant de commencer, assurez-vous d’avoir :

- Une version de **Talend Open Studio 7.x** ou **Talaxie**,  
- Un accès au **dépôt GitHub d’archives TalendExchange**,  
- Un dossier local dédié à vos composants utilisateurs.

### Télécharger le composant

Le composant est disponible ici :  
👉 **[tFileOutputPDF2.zip](https://github.com/TalendExchange/Components/raw/refs/heads/main/archive/patrick%20moire/components/tOutputPDF2/files/v_1.3__tFileOutputPDF2.zip?download=)**

> 💡 **Astuce — Github Talend Exchange**  
> Retrouvez bon nombres de composant sur les archives github [TalendExchange](https://github.com/TalendExchange/Components)


Décompressez le contenu dans un dossier, par exemple :  
`C:\Studios\Talend\Composants_additionnels`

![Extraction du composant]({{ '/assets/img/blog/3-tFileOutputPDF2/1-Extract_zip.webp' | relative_url }}){: alt="Extraction de l'archive du composant tFileOutputPDF2" loading="lazy" decoding="async" width="650" height="498"}

Vérifiez que le dossier contient bien tous les fichiers nécessaires :  

![Contenu du dossier]({{ '/assets/img/blog/3-tFileOutputPDF2/1-Extract_zip_2.webp' | relative_url }}){: alt="Contenu du dossier du composant tFileOutputPDF2" loading="lazy" decoding="async" width="771" height="358"}

---

## 2. Activer le composant dans Talend

Dans Talend, ouvrez :  
**Fenêtre → Préférences → Talend → Composants**

Renseignez ensuite le chemin du dossier :  
`C:\Studios\Talend\Composants_additionnels`

![Préférences Talend]({{ '/assets/img/blog/3-tFileOutputPDF2/2-preferences_talend.webp' | relative_url }}){: alt="Configuration du dossier des composants utilisateur dans Talend" loading="lazy" decoding="async" width="1394" height="771"}

> 💡 **Astuce**  
> Si le composant n’apparaît pas dans la palette, **redémarrez** Talend : il sera automatiquement détecté au prochain lancement.

---

## 3. Créer le job d’exemple

Le plus simple est de partir d’un jeu de données simulé pour valider le fonctionnement du composant.

### Générer des données avec tRowGenerator

Ajoutez un **tRowGenerator** et définissez le schéma suivant :

| Colonne | Type | Expression |
|:---------|:------|:------------|
| id | Integer | `Numeric.sequence("id_seq", 1, 1)` |
| nom | String | `TalendDataGenerator.getLastName()` |
| prenom | String | `TalendDataGenerator.getFirstName()` |
| ddn | Date | `TalendDate.getRandomDate("1980-01-01","2025-10-15")` |
| nbre_article_achete | Integer | `Numeric.random(0,100)` |
| prix_article_unitaire | Integer | `Numeric.random(1,200)` |

Générez une vingtaine de lignes pour tester.

![Configuration du tRowGenerator]({{ '/assets/img/blog/3-tFileOutputPDF2/3-tRowGenerator.webp' | relative_url }}){: alt="Configuration du composant tRowGenerator pour générer des données de test" loading="lazy" decoding="async" width="1317" height="500"}

---

## 4. Enrichir le flux avec tMap

Ajoutez un **tMap** entre le générateur et le futur composant PDF.  
Créez deux nouvelles colonnes calculées :

| Colonne | Type | Expression |
|:---------|:------|:------------|
| utilisateur_enregistre | Boolean | `row1.nbre_article_achete % 2 == 0 ? true : false` |
| total_panier | Integer | `row1.nbre_article_achete * row1.prix_article_unitaire` |

Cette étape rend le jeu de données plus proche d’un cas métier réel.

![Configuration du tMap]({{ '/assets/img/blog/3-tFileOutputPDF2/3-tMap.webp' | relative_url }}){: alt="tMap enrichissant les données avant export PDF" loading="lazy" decoding="async" width="1913" height="536"}

---

## 5. Ajouter le composant PDF

Dans la palette Talend, cherchez **tFileOutputPDF2** dans la catégorie  
**Fichier → Écriture**, puis reliez-le à la sortie du `tMap`.

![Palette Talend]({{ '/assets/img/blog/3-tFileOutputPDF2/3-palette.webp' | relative_url }}){: alt="Palette Talend affichant le composant tFileOutputPDF2" loading="lazy" decoding="async" width="402" height="448"}

Le composant est maintenant prêt à être configuré.

---

## 6. Configurer le rendu du PDF

### Paramètres simples

Dans les **Paramètres simples**, on gère la structure du document :

- Fichier de sortie,  
- Titre, sous-titre, commentaire,  
- Logo (optionnel),  
- Schéma du tableau,  
- Police, taille, couleur, alignement.

Cochez la case **Aspect** sur chaque section (Titre, Sous-titre, etc.) pour débloquer les options de style.

![Configuration basique du tFileOutputPDF2]({{ '/assets/img/blog/3-tFileOutputPDF2/4-tFileOutputPDF2_basic.webp' | relative_url }}){: alt="Exemple de configuration basique du tFileOutputPDF2" loading="lazy" decoding="async" width="1851" height="880"}

---

### Paramètres avancés

Les **Paramètres avancés** contrôlent le corps du tableau :

- Largeur automatique des colonnes,  
- Espacement avant le tableau,  
- Ligne de totalisation,  
- Couleurs alternées pour les lignes,  
- Personnalisation du rendu texte.

![Configuration avancée du tFileOutputPDF2]({{ '/assets/img/blog/3-tFileOutputPDF2/4-tFileOutputPDF2_advanced.webp' | relative_url }}){: alt="Configuration avancée du composant tFileOutputPDF2" loading="lazy" decoding="async" width="1855" height="478"}

> 💡 **Astuce**  
> Pour un rendu professionnel : police sobre (Arial, Calibri, Roboto), titres gras, logo léger et fond clair.  
> Un PDF lisible vaut mieux qu’un PDF “démonstratif”.

---

## 7. Visualiser le résultat

Lancez votre job : Talend génère un **PDF complet** comprenant :

- Un en-tête (titre, sous-titre, commentaire, logo),  
- Un tableau structuré,  
- Des lignes alternées,  
- Une ligne de total en bas de page.

![PDF final généré avec Talend]({{ '/assets/img/blog/3-tFileOutputPDF2/4-resultat.webp' | relative_url }}){: alt="Exemple de fichier PDF généré par Talend avec tFileOutputPDF2" loading="lazy" decoding="async" width="786" height="859"}

Ce type de rapport peut être utilisé dans des contextes variés : reporting interne, exports client, suivi qualité, etc.

---

## 8. Télécharger le projet complet

L’ensemble du job présenté dans ce tutoriel est disponible sur GitHub :

**→ [Projet d’exemple tFileOutputPDF2 sur GitHub](https://github.com/mbodetdata/BMDATA_Blog-tFileOutputPDF2)**  
(*Job Talend complet, composants, expressions, et fichiers.*)


---

## Conclusion

Le composant **tFileOutputPDF2** est une pépite méconnue.  
En quelques minutes, il transforme un flux Talend en **rapport PDF clair et professionnel**, sans passer par Excel ou un outil tiers.  

Cette approche ouvre la voie à des exports automatiques, des rapports quotidiens ou des synthèses clients intégrées à vos pipelines ETL.

> 💡 **Astuce**  
> Combinez `tFileInputDelimited → tMap → tFileOutputPDF2` pour créer un flux “lecture / transformation / rendu PDF” complet et automatisable.


---

### Ressources

- Archive GitHub des composants : [TalendExchange/Components](https://github.com/TalendExchange/Components)  
- Migration Talend vers Talaxie : [bmdata.fr/blog/migration-talend-vers-talaxie](https://bmdata.fr/blog/migration-talend-vers-talaxie/)
- Lien github vers le projet demo :[Projet demo](https://github.com/mbodetdata/BMDATA_Blog-tFileOutputPDF2)
