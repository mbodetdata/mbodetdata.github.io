---
layout: post
title: "Créer un fichier PDF avec Talend (tFileOutputPDF2)"
description: "Tutoriel complet et illustré pour intégrer le composant tFileOutputPDF2 dans Talend Open Studio et générer automatiquement un rapport PDF à partir de vos données."
categories: blog
tags: [Talend, PDF, ETL, Reporting, Open Source, Data Integration]
image: "/assets/img/blog/3-tFileOutputPDF2/creation-pdf-talend.png"
active: false
---

Talend Open Studio ne propose pas nativement de composant pour **générer des fichiers PDF**.  
Pourtant, ce besoin est fréquent : création de rapports, états de synthèse, reçus, exports clients, etc.  

Heureusement, un composant communautaire appelé **tFileOutputPDF2**, disponible sur **Talend Exchange**, permet de combler cette lacune.  

Dans ce tutoriel, nous allons voir comment :  
1. Installer le composant,  
2. Le configurer dans Talend,  
3. Créer un job complet pour produire un **PDF dynamique** à partir de données simulées.

> 💡 **Ressource utile :** la liste des composants communautaires est disponible sur [GitHub Talend Exchange](https://github.com/TalendExchange/Components).

<!--more-->

---

## 1. Pré-requis

Avant de commencer, assurez-vous d’avoir :

- Une version de **Talend Open Studio** ≥ 7.x installée,  
- Accès à [Talend Exchange](https://exchange.talend.com/) ou à son [miroir GitHub](https://github.com/TalendExchange/Components),  
- Un dossier local pour stocker vos composants personnalisés.

### 📦 Téléchargement du composant

Téléchargez directement l’archive du composant ici :  
👉 [tFileOutputPDF2.zip](https://github.com/TalendExchange/Components/raw/refs/heads/main/archive/patrick%20moire/components/tOutputPDF2/files/v_1.3__tFileOutputPDF2.zip?download=)

Décompressez le contenu dans un dossier, par exemple :  
`C:\Studios\Talend\Composants_additionnels`

![Extraction du composant]({{ '/assets/img/blog/3-tFileOutputPDF2/1-Extract_zip.png' | relative_url }}){:alt="Extraction de l'archive du composant tFileOutputPDF2" loading="lazy" decoding="async"}

Assurez-vous que tous les fichiers de l’archive sont présents dans le dossier final :  

![Contenu du dossier]({{ '/assets/img/blog/3-tFileOutputPDF2/1-Extract_zip_2.png' | relative_url }}){:alt="Contenu du dossier du composant tFileOutputPDF2" loading="lazy" decoding="async"}

---

## 2. Configuration de Talend

Ouvrez Talend, puis allez dans :  
**Fenêtre → Préférences → Talend → Composants**  
et renseignez le chemin de votre dossier de composants utilisateur :

`C:\Studios\Talend\Composants_additionnels`

![Préférences Talend]({{ '/assets/img/blog/3-tFileOutputPDF2/2-preferences_talend.png' | relative_url }}){:alt="Configuration du dossier des composants utilisateur dans Talend" loading="lazy" decoding="async"}

> 💡 **Astuce :** Si le composant n’apparaît pas immédiatement dans la palette, fermez puis relancez Talend.

---

## 3. Création du job Talend

Une fois le composant reconnu, créez un **nouveau job** et ajoutez un composant **tRowGenerator** pour simuler un jeu de données.

### 🎲 Génération de données d’exemple

| Colonne | Type | Expression |
|:---------|:------|:------------|
| id | Integer | `Numeric.sequence("id_seq", 1, 1)` |
| nom | String | `TalendDataGenerator.getLastName()` |
| prenom | String | `TalendDataGenerator.getFirstName()` |
| ddn | Date | `TalendDate.getRandomDate("1980-01-01","2025-10-15")` |
| nbre_article_achete | Integer | `Numeric.random(0,100)` |
| prix_article_unitaire | Integer | `Numeric.random(1,200)` |

👉 Nombre de lignes générées : **25**

![Configuration du tRowGenerator]({{ '/assets/img/blog/3-tFileOutputPDF2/3-tRowGenerator.png' | relative_url }}){:alt="Configuration du composant tRowGenerator pour générer les données de test" loading="lazy" decoding="async"}

---

## 4. Ajout d’un tMap pour enrichir les données

Ajoutez un composant **tMap** entre votre `tRowGenerator` et le futur `tFileOutputPDF2`.  
Créez deux nouvelles colonnes calculées :

| Colonne | Type | Expression |
|:---------|:------|:------------|
| utilisateur_enregistre | Boolean | `row1.nbre_article_achete % 2 == 0 ? true : false` |
| total_panier | Integer | `row1.nbre_article_achete * row1.prix_article_unitaire` |

![Configuration du tMap]({{ '/assets/img/blog/3-tFileOutputPDF2/3-tMap.png' | relative_url }}){:alt="tMap enrichissant les données avant export PDF" loading="lazy" decoding="async"}

---

## 5. Intégration du composant tFileOutputPDF2

Dans la **palette Talend**, le composant se trouve dans :  
➡️ **Fichier → Écriture**

![Palette Talend]({{ '/assets/img/blog/3-tFileOutputPDF2/3-palette.png' | relative_url }}){:alt="Palette Talend affichant le composant tFileOutputPDF2" loading="lazy" decoding="async"}

Branchez-le à la sortie de votre tMap.

---

## 6. Configuration du composant

### 🧾 Paramètres simples

Les options principales concernent la structure du PDF :

- **Fichier de sortie**  
- **Titre / Sous-titre / Commentaire**  
- **Logo (optionnel)**  
- **Police, taille, couleur du texte**  
- **Schéma du tableau**  

Activez la case **“Aspect”** dans chaque section (Titre, Sous-titre, etc.) pour débloquer les réglages de style.

![Configuration basique du tFileOutputPDF2]({{ '/assets/img/blog/3-tFileOutputPDF2/4-tFileOutputPDF2_basic.png' | relative_url }}){:alt="Exemple de configuration basique du tFileOutputPDF2" loading="lazy" decoding="async"}

---

### ⚙️ Paramètres avancés

Les paramètres avancés permettent de gérer l’apparence du **corps du tableau** :

- Largeur automatique des colonnes,  
- Espacement avant le tableau,  
- Ligne de totalisation (option "Dernière ligne"),  
- Personnalisation du corps du tableau.

![Configuration avancée du tFileOutputPDF2]({{ '/assets/img/blog/3-tFileOutputPDF2/4-tFileOutputPDF2_advanced.png' | relative_url }}){:alt="Configuration avancée du composant tFileOutputPDF2" loading="lazy" decoding="async"}

> 💡 **Conseil pro :** Testez plusieurs styles et options (police, couleurs, logo) pour trouver le rendu le plus clair et professionnel.

---

## 7. Résultat final

En suivant cette configuration, votre job génère automatiquement un **rapport PDF** contenant :

- Un titre, sous-titre et commentaire personnalisés,  
- Un tableau lisible et paginé,  
- Une ligne de total finale,  
- (Optionnel) un logo ou une signature.

![PDF final généré avec Talend]({{ '/assets/img/blog/3-tFileOutputPDF2/4-resultat.png' | relative_url }}){:alt="Exemple de fichier PDF généré par Talend avec tFileOutputPDF2" loading="lazy" decoding="async"}

---

## Conclusion

Le composant **tFileOutputPDF2** est un excellent moyen d’enrichir vos jobs Talend en ajoutant une **couche de reporting automatisé**.  
Il permet de produire des fichiers PDF lisibles et esthétiques sans dépendre d’un outil externe comme Excel.

Ce tutoriel montre qu’avec un peu de configuration, Talend peut devenir un **véritable générateur de rapports dynamiques**.

---

## ✅ Checklist

| Étape | Action | Statut |
|:------|:--------|:------:|
| 1 | Télécharger et décompresser le composant tFileOutputPDF2 | ☐ |
| 2 | Configurer le chemin dans Talend (Préférences → Composants) | ☐ |
| 3 | Créer un job de test avec tRowGenerator et tMap | ☐ |
| 4 | Ajouter et configurer tFileOutputPDF2 | ☐ |
| 5 | Personnaliser titres, couleurs, logo | ☐ |
| 6 | Exécuter le job et vérifier le PDF généré | ☐ |
| 7 | Ajuster la mise en page et sauvegarder le projet | ☐ |

---

🧠 **Ressources complémentaires :**  
- [Talend Exchange – Composants communautaires](https://exchange.talend.com/)  
- [Documentation Talend Studio](https://help.talend.com/)  
- [GitHub Talend Exchange Components](https://github.com/TalendExchange/Components)
