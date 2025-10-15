---
layout: post
title: "Créer un fichier PDF avec Talend (tFileOutputPDF)"
description: "Tutoriel complet pour générer automatiquement un fichier PDF dans Talend Open Studio grâce au composant tFileOutputPDF2."
categories: blog
tags: [Talend, PDF, ETL, Reporting, Open Source, Data Integration]
image: "/assets/img/blog/3-Creation_PDF_Talend/creation-pdf-talend.png"
active: false
---

Dans ce tutoriel, nous allons voir ensemble comment integrer le composant **tFIleOutputPDF2**.
En effet, Talend ne dispose pas par defaut de composant permettant la génération de fichier PDF, cependant cela peut s'averer utile !
Nous allons donc voir ensemble comment le telecharger, l'integrer et l'utiliser dans un job Talend (7.3).
L'ensemble du projet est disponnible a l'adresse suivante : 

> 💡 Notez qu'un github référence des composants tiers ici : https://github.com/TalendExchange/Components

<!--more-->

---

## 1. Pré-requis

Avant de commencer :

- Talend Open Studio (7.x ou supérieur) installé.  
- Téléchargez le composant ici : https://github.com/TalendExchange/Components/raw/refs/heads/main/archive/patrick%20moire/components/tOutputPDF2/files/v_1.3__tFileOutputPDF2.zip?download= 
- Dezzipez l'archive dans un dossier que vous utiliserez comme source de composants additionnels


---

## 2. Parametrez Talend pour utiliser ce composant

Dans cet exemple j'ai décidé de dezziper l'archive dans le repertoire `C:\Studios\Talend\Composants_additionnel`, bien entendu vous êtes libre de le mettre où vous souhaitez.
Cependant il est primodial d'avoir le dossier et l'ensemble des fichier a l'interieur comme l'illustre les deux captures d'ecran ci-dessous 
![Dossier d'extraction]({{ '/assets/img/blog/3-tFileOutputPDF2/1-Extract_zip.png' | relative_url }}){:alt="Dossier d'extraction du zip" loading="lazy" decoding="async"}

![Contenu de l'archive]({{ '/assets/img/blog/3-tFileOutputPDF2/1-Extract_zip_2.png' | relative_url }}){:alt="Contenu de l'archive" loading="lazy" decoding="async"}


Une fois cela réalisez parametrez Talend pour pointer vers votre repertoire contenan votre composant additionnel.
Pour se faire cliquez sur `Fenêtre>Préférences>Talend>Composants` et renseignez `Dossier des composants utilisateur`
![Préférences Talend]({{ '/assets/img/blog/3-tFileOutputPDF2/2-preferences_talend.png' | relative_url }}){:alt="Préferences Talend" loading="lazy" decoding="async"}

---

## 3. Créez un job, et préparez le terain

Une fois installé, vous trouverez le composant dans la catégorie :  
**Fichier → Écriture**.

![Palette Talend]({{ '/assets/img/blog/3-tFileOutputPDF2/3-palette.png' | relative_url }}){:alt="Palette Talend" loading="lazy" decoding="async"}

> 💡 **Astuce :** Si votre composant ne s'affiche pas dans votre palettes, fermez et réouvrez Talend.


Dans cet exemple, nous allons utiliser un **tRowGenerator** permettant de generer des lignes avec le schema suivant : 
- id : Integer -> Numeric.sequence("id_seq",1,1)
- nom : String -> TalendDataGenerator.getLastName()
- prenom : String -> TalendDataGenerator.getFirstName()
- ddn : Date -> TalendDate.getRandomDate("1980-01-01","2025-10-15")
- nbre_article_achete : Integer -> Numeric.random(0,100)
- prix_article_unitaire : Integer -> Numeric.random(1,200)

Nous allons generer **25** lignes

![tRowGenerator]({{ '/assets/img/blog/3-tFileOutputPDF2/3-tRowGenerator.png' | relative_url }}){:alt="Configuration tRowGenerator" loading="lazy" decoding="async"}


Afin d'alimenter un peu plus notre jeux de données, nous allons ajouter un **tMap** avec l'ajout de deux colonnes : 
- utilisateur_enregistre : Boolean -> Si "nbre_article_achete" est paire, alors `true`, sinon `false` 
- total_panier : Integer -> nbre_article_achete*prix_article_unitaire

![tMap]({{ '/assets/img/blog/3-tFileOutputPDF2/3-tMap.png' | relative_url }}){:alt="Configuration tMap" loading="lazy" decoding="async"}


---

## 4. Ajout et configuration du composant tFileOutputPDF2

Dans les `Paramètres simples` vous allez avoir un certain nombre de configuration, essentillement pour la **Forme** du PDF et **l'entête** du tableau
- Le Fichier de sortie
- Le titre du PDF
- Le sous titre
- Un commentaire
- La possibilitée d'ajouter un logo
- ... 

Il sera necessaire de cocher certaines case (par exemple `Aspect` de la configuration de `Titre`) pour voir apparaitre d'autres options de configuration  

> 💡 **Astuce :** Ce composant permet de faire beaucoup de choses, il est cependant difficile de se representer le rendu. N'hesitez pas a faire beaucoup de test en modifiant certains parametre pour identifier la meilleur confiugration possible.


### Exemple de configuration - Paramètres simples

Voici l'exemple de configuration effectué dans mon projet 

![tFIleOutputPDF2 basic]({{ '/assets/img/blog/3-tFileOutputPDF2/4-tFileOutputPDF2_basic.png' | relative_url }}){:alt="Configuration basique du tFIleOutputPDF2" loading="lazy" decoding="async"}

 

Dans les `Paramètres avancés` les elements de configurations concernet plutôt le **corp** du tableau
- Largeur des colonnes
- Corps du tableau
- Definir la derniere ligne comme une ligne de total
- ... 


### Exemple de configuration - Paramètres avancès

Voici l'exemple de configuration effectué dans mon projet 

![tFIleOutputPDF2 advanced]({{ '/assets/img/blog/3-tFileOutputPDF2/4-tFileOutputPDF2_advanced.png' | relative_url }}){:alt="Configuration avancèe du tFIleOutputPDF2" loading="lazy" decoding="async"}



En suivant ce déroulé et la configuration effectuée, vous devriez vous le résultat suivant 

![resultat]({{ '/assets/img/blog/3-tFileOutputPDF2/4-resultat.png' | relative_url }}){:alt="PDF final" loading="lazy" decoding="async"}



