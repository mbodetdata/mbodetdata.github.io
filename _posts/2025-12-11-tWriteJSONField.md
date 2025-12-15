---
layout: post
title: "Talaxie : bien configurer tWriteJSONField et le JSON Tree (type, class, array, object)"
description: "Comprendre enfin comment configurer tWriteJSONField et son JSON Tree (loop, attributs type/class, array/object) dans Talaxie sans s’arracher les cheveux."
categories: blog
tags: [Talend, Talaxie, JSON, tWriteJSONField, ETL, Bonnes pratiques]
image: "/assets/img/blog/7-twritejsonfield/logo_1024.webp"
active: true
parent_category: talend-talaxie
---

![Logo tWriteJSONField et JSON Tree]({{ '/assets/img/blog/7-twritejsonfield/logo_1024.webp' | relative_url }}){:alt="Talaxie tWriteJSONField et JSON Tree" loading="lazy" decoding="async"}

Aujourd’hui, le JSON est devenu incontournable : bases NoSQL comme `MongoDB`, API REST, événements, configurations… il est partout. Générer du JSON avec Talaxie n’est pas toujours intuitif dès que la structure se complexifie (objets imbriqués, tableaux, types non-string). Ce guide montre comment produire un JSON propre et exploitable sans perdre de temps.

> Workspace prêt à l’emploi : **[[Lien](https://github.com/mbodetdata/BMDATA_Blog-tWriteJSONField.git)]** pour suivre pas à pas.

Si tu as déjà eu à travailler avec du JSON sur Talaxie (ou Talend), tu connais le composant **tWriteJSONField**. Les détails de configuration font la différence entre un JSON “presque bon” et un JSON immédiatement exploitable.

Ensemble, on va voir :

1. Comprendre à quoi sert vraiment `tWriteJSONField`  
2. Configurer le JSON Tree selon le JSON cible  
3. Maîtriser les attributs `type` et `class` (`array` / `object`)  
4. Gérer les cas classiques :  
   - un objet JSON par ligne  
   - un tableau JSON d’objets  
   - des types non-string (`int`, `boolean`, etc.)

Sources utiles pour ce guide :  
- **[[Configurer une arborescence JSON](https://help.qlik.com/talend/fr-FR/components/8.0/processing/configuring-a-json-tree)]**  
- **[[Configurer le tWriteJSONField](https://help.qlik.com/talend/fr-FR/components/8.0/processing/textractjsonfields-twritejsonfield-tfixedflowinput-tlogrow-setting-up-twritejsonfield-standard-component-click)]**  
- **[[Propriétés du tWriteJSONField Standard](https://help.qlik.com/talend/fr-FR/components/8.0/processing/twritejsonfield-standard-properties)]**

---

## 1. À quoi sert vraiment tWriteJSONField ?

`tWriteJSONField` sert à **transformer des lignes tabulaires en JSON**, puis à stocker ou transmettre ce JSON :

- dans une **colonne de la ligne** (ex. `json_document`, `serializedValue`),  
- ou vers un composant aval, comme un `tRestClient`, un composant MongoDB (si tu es sur le Studio Big Data), etc.

Concrètement, il permet de :

- **partir d’un schéma d’entrée classique** (colonnes Talaxie),  
- **mapper ces colonnes dans une structure JSON** via le **JSON Tree**,  
- **produire une chaîne JSON** stockée dans une colonne de sortie (*Output Column*).

---

### Les paramètres clés : Basic settings

Dans les **Basic settings** de `tWriteJSONField`, les éléments importants sont :

- **Colonne de sortie**  
  Colonne qui contiendra la chaîne JSON finale (ex. `json_doc`, `serializedValue`).

- **Configurer la structure JSON**  
  Ouvre l’éditeur du **JSON Tree**, où tu définis précisément :
  - la structure du JSON (objets, tableaux),
  - les types de données,
  - les éléments répétés (*loop element*).

- **Group by**  
  Permet de regrouper plusieurs lignes d’entrée pour produire **un seul JSON**.  
  C’est indispensable dès que tu veux générer :
  - un tableau JSON,
  - ou un JSON agrégé par clé fonctionnelle (id, code, etc.).

- **Supprimer le nœud racine**  
  Comme son nom l’indique, ce paramètre permet de **supprimer le nœud racine** généré par le composant.  
  Utile lorsque la cible attend directement un tableau ou un objet sans enveloppe supplémentaire.

![Basic settings]({{ '/assets/img/blog/7-twritejsonfield/1-basic_param.webp' | relative_url }}){:alt="Basic settings du composant tWriteJSONField" loading="lazy" decoding="async"}

---

### Les paramètres complémentaires : Advanced settings

Dans les **Advanced settings**, tu retrouves quelques options supplémentaires qui impactent le format final du JSON :

- **Entourer de guillemets toutes les valeurs non nulles**  
  Force toutes les valeurs à être générées comme des chaînes de caractères.

- **Passer les valeurs nulles en chaîne de caractères vide**  
  Convertit les `null` en `""` au lieu de les laisser absentes ou nulles.

- **Utiliser la notation scientifique pour les valeurs flottantes**  
  Applique une notation scientifique pour les nombres à virgule (utile dans certains contextes techniques).

> À utiliser avec précaution : ces options peuvent rendre ton JSON non conforme aux attentes d’une API ou d’un outil aval si elles sont mal choisies.

![Advanced settings]({{ '/assets/img/blog/7-twritejsonfield/1-advanced_param.webp' | relative_url }}){:alt="Advanced settings du composant tWriteJSONField" loading="lazy" decoding="async"}

---

> **À retenir**  
> `tWriteJSONField` ne devine rien : il applique exactement ce que tu décris dans le JSON Tree et via ses paramètres.

---

## 2. Comprendre le JSON Tree (et ce qu’il représente vraiment)

Quand tu cliques sur **Configurer la structure JSON** dans `tWriteJSONField` (paramètres simples), tu ouvres l’éditeur du **JSON Tree**.

Il est toujours organisé de la même manière :

- à gauche : **Source du lien**  
  → ce sont les **colonnes d’entrée** (le schéma du composant précédent)

- à droite : **Cible du lien**  
  → c’est **l’arbre JSON que tu vas générer**

- au centre : les liens entre les deux  
  → tu relies les colonnes aux nœuds du JSON par *drag & drop*

---

### Comment fonctionne réellement le JSON Tree

La logique est volontairement simple, mais très stricte :

- Chaque **nœud** du JSON Tree correspond à **un niveau de la structure JSON**  
  (objet, champ, tableau, sous-objet, etc.).

- Tu choisis **quel nœud est le “loop element”**  
  → c’est lui qui se répète pour chaque ligne d’entrée ou pour chaque élément d’un tableau.

- Tu ajoutes des **attributs** sur les nœuds pour préciser leur comportement :
  - `type` → permet de forcer le type de la valeur (`integer`, `number`, `float`, `boolean`, …)  
  - `class` → permet de définir la structure (`array` ou `object`)

![Le JSON Tree]({{ '/assets/img/blog/7-twritejsonfield/2-jsontree.webp' | relative_url }}){:alt="Un exemple de JSON Tree" loading="lazy" decoding="async"}

---

### Le point clé à retenir

Le JSON Tree n’est **ni automatique ni intelligent**. Il suit exactement la structure que tu dessines et les attributs (`type`, `class`, loop element) que tu définis. Tu ne le configures pas pour qu’il devine ton JSON : tu lui décris précisément le JSON final que tu veux produire.

---

## 3. Les attributs du JSON Tree : `type` et `class`

Par défaut, `tWriteJSONField` **s’appuie sur le type des colonnes d’entrée** :

- une colonne `Integer` sera générée comme un nombre en JSON,  
- une colonne `Boolean` sera générée comme un booléen,  
- une colonne `String` sera générée comme une chaîne de caractères.

Dans les cas simples, **aucun attribut n’est nécessaire** pour respecter les types. Dès que la structure devient plus complexe (tableaux, objets imbriqués, regroupements, données calculées…), il devient indispensable de **contrôler explicitement le comportement** via les attributs du JSON Tree.

---

### 3.1. Attribut `type` : forcer ou corriger le type

L’attribut `type` permet de **forcer le type JSON généré**, indépendamment du type réel de la colonne d’entrée.

Il est particulièrement utile lorsque :
- le schéma d’entrée est trop générique (`String` partout),
- la valeur est calculée ou concaténée,
- la cible attend un type strict (API, moteur NoSQL, indexation).

Pour définir un `type` :

- clic droit sur le nœud → *Ajouter un attribut*  
- **Name** : `type`  
- **Fixed value** :
  - `integer`  
  - `number`  
  - `float`  
  - `boolean`

> Si le schéma d’entrée est proprement typé, laisse Talaxie gérer. Utilise `type` uniquement quand tu veux reprendre le contrôle.

---

### 3.2. Attribut `class` : définir la structure (array / object)

L’attribut `class` ne concerne pas les types de valeurs, mais la **structure JSON**.

Deux valeurs principales :

#### `class=array`

- Le nœud représente un **tableau JSON**.  
- Il doit obligatoirement contenir :
  - un sous-nœud (souvent nommé `element`),
  - défini comme **loop element**.

Chaque itération du loop correspond à **une entrée du tableau**.

#### `class=object`

- Le nœud représente un **objet JSON**.  
- Il sert de conteneur à des sous-champs ou sous-objets.

---

### Ce qu’il faut retenir

- Les **types du schéma d’entrée sont respectés par défaut**.  
- `type` sert à **forcer ou corriger** un type quand le schéma ne suffit pas.  
- `class` sert uniquement à décrire la **structure JSON**.  
- Un tableau sans `class=array` ou sans loop element est une erreur de conception.

Dans la suite, on applique ces règles à des cas concrets de génération de JSON avec `tWriteJSONField`.

---

## 4. Construire le bon JSON : on commence par la cible (pas par le tMap)

On repart sur un cas concret : **croiser des Personnes et des Adresses**.

> Point important : commencer par un tMap pour “croiser les données”, puis essayer de fabriquer le JSON après est souvent une mauvaise idée. Tu risques de choisir un schéma de sortie qui ne correspond pas à la structure finale et de patcher dans `tWriteJSONField` au lieu de construire proprement.

La bonne approche est l’inverse :  
✅ **on définit d’abord la structure JSON cible**,  
puis on construit le job pour la produire.

---

### 4.1. Les données de départ (2 sources)

On a deux sources :

- **Personnes** (identifiant unique par personne)
- **Adresses** (0..n adresses par personne via une clé de rattachement)

#### Personnes : structure des données

| Champ      | Type Talaxie | Description                         |
|------------|--------------|-------------------------------------|
| _id        | Integer      | Identifiant unique de la personne   |
| nom        | String       | Nom de la personne                  |
| prenom     | String       | Prénom de la personne               |
| telephone  | String       | Téléphone de la personne            |
| age        | Integer      | Âge de la personne                  |
| actif      | Boolean      | Est-ce que la personne est active ? |

#### Adresses : structure des données

| Champ         | Type Talaxie | Description                                  |
|---------------|--------------|----------------------------------------------|
| _id           | Integer      | Identifiant unique de l’adresse              |
| personnes_id  | Integer      | Référence vers la personne (_id)             |
| numero        | Integer      | Numéro de la rue                             |
| rue           | String       | Nom de la rue                                |
| ville         | String       | Ville                                        |
| latitude      | Double       | Latitude de la ville                         |
| longitude     | Double       | Longitude de la ville                        |
| actif         | Boolean      | Est-ce que l’adresse est active ?            |

---

### 4.2. Avant de toucher aux composants : quelle structure JSON veut-on vraiment ?

Avant toute transformation, on répond à quelques questions simples. C’est ici que se joue 80 % de la réussite du job.

#### 1) Quelle est l’unité de sortie ?

- Est-ce que je veux **un document JSON par personne** ?
- Ou **un document JSON global** contenant toutes les personnes ?

➡️ Dans cet article, on vise volontairement **un JSON global**, contenant l’ensemble des personnes et de leurs adresses.

Pourquoi ce choix ?
- plus pédagogique,
- permet de manipuler des **tableaux imbriqués**,
- met clairement en valeur le rôle du **JSON Tree** et du **Group by**.

> Ce choix est volontaire et contextuel. Il n’est pas forcément adapté à des cas concrets d’appel API unitaire ou d’enrichissement incrémental d’une base MongoDB.

#### 2) Quelle est la cardinalité Personne → Adresse ?

Une personne peut avoir :
- **0 adresse**,
- **1 adresse**,
- **plusieurs adresses**.

➡️ Côté JSON, cela implique :
- une liste globale de personnes,
- pour chaque personne, une liste d’adresses.

La zone `adresses` doit donc être **un tableau**, même lorsqu’il est vide.

#### 3) Comment organiser la structure ?

La structure cible est la suivante :

- un **nœud racine global**,
- un tableau `personnes` (boucle principale),
- pour chaque personne :
  - ses champs propres,
  - un tableau `adresses`,
  - chaque adresse étant un élément de ce tableau.

> Structure cible :  
> - nœud racine  
> - `personnes` en tableau (loop principal)  
> - `adresses` en tableau imbriqué (loop)

![Structure cible (arbre)]({{ '/assets/img/blog/7-twritejsonfield/4-3-structure_cible_json.webp' | relative_url }}){:alt="Structure JSON cible" loading="lazy" decoding="async"}

---

### 4.3. Pourquoi “tMap d’abord” est une mauvaise idée (dans ce cas précis)

Si tu commences par un `tMap` en joignant **Personnes** et **Adresses**, tu obtiens un flux **aplati** :

- une personne est répétée autant de fois qu’elle a d’adresses,
- et lorsque tu essaies ensuite de reconstruire une structure hiérarchique  
  *(personne → adresses[])* dans `tWriteJSONField`, tu dois gérer :
  - les duplications,
  - le regroupement,
  - la création correcte des tableaux.

➡️ Ça peut fonctionner, mais c’est fragile et difficile à maintenir. Tu finis par subir le JSON Tree au lieu de le piloter.

---

### La bonne stratégie

La bonne approche consiste à **décomposer le problème** :

- respecter dès le départ la logique fonctionnelle  
  👉 **une personne = une unité**,
- construire les structures JSON **par couches**,
- assembler les éléments de manière contrôlée.

> Le secret ici, c’est la décomposition :
> - un `tWriteJSONField` pour construire le **tableau d’adresses**,  
> - un second `tWriteJSONField` pour l’insérer proprement à côté des champs de **Personne**.

---

### 4.4. Plan de construction du job (pas à pas)

Dans les sections suivantes, on va construire le job **progressivement**, en respectant la structure JSON cible définie plus haut. L’idée est de décomposer la génération du JSON en plusieurs étapes simples et maîtrisées.

#### 4.4.1 Étape A : Construire le tableau d’adresses

Objectif :
- partir du flux **Adresses**,
- regrouper les adresses par personne,
- produire un **tableau JSON d’adresses** par personne.

À la fin de cette étape :
- chaque personne est associée à **un bloc JSON “adresses”**,  
- le tableau peut contenir 0, 1 ou plusieurs éléments,
- aucune notion de personne complète n’est encore présente.

#### 4.4.2 Étape B : Construire la structure “Personne + adresses”

Objectif :
- repartir du flux **Personnes**,
- y rattacher le bloc JSON des adresses construit à l’étape A,
- obtenir une structure **cohérente par personne**.

À la fin de cette étape :
- on respecte la règle **1 personne = 1 unité logique**,  
- chaque personne possède son tableau d’adresses (vide si nécessaire),
- aucune duplication de personne n’est introduite.

#### 4.4.3 Étape C : Construire le JSON global final

Objectif :
- regrouper l’ensemble des personnes,
- construire le **JSON global** conforme à la structure cible,
- finaliser le JSON Tree (racine, tableaux, boucles).

À la fin de cette étape, on obtient :
- **un seul document JSON global**,  
- un tableau `personnes`,
- pour chaque personne, un tableau `adresses`,
- une structure propre, lisible et exploitable.

> Résultat final : un JSON global unique, aucune duplication, une hiérarchie claire, une construction contrôlée et maintenable.

---

### 4.5. Réalisation des étapes

#### Prérequis : construction des sources

Dans le cadre de cet exemple, on va utiliser un composant `tFixedFlowInput` pour **générer** des données. On va en avoir un pour les **Personnes** et un pour les **Adresses**.

##### Personnes

| _id | nom   | prenom   | telephone   | age | actif |
|----:|-------|----------|-------------|----:|:-----:|
| 1   | Nom 1 | Prenom 1 | 0102030405  | 25  | true  |
| 2   | Nom 2 | Prenom 2 | 0123456789  | 30  | false |
| 3   | Nom 3 | Prenom 3 | 0506070809  | 40  | true  |

![tFixedFlowInput - Personnes]({{ '/assets/img/blog/7-twritejsonfield/4-structure_personnes.webp' | relative_url }}){:alt="Données personnes" loading="lazy" decoding="async"}

##### Adresses

| _id | personnes_id | numero | rue   | ville      | latitude   | longitude   | actif |
|----:|-------------:|-------:|-------|------------|------------|-------------|:-----:|
| 1   | 1            | 1      | Rue 1 | Paris      | 48.86667   | 2.333333    | true  |
| 2   | 2            | 2      | Rue 2 | Marseille  | 43.2961743 | 5.3699525   | true  |
| 3   | 1            | 3      | Rue 3 | Bordeaux   | 44.841225  | -0.5800364  | false |
| 4   | 1            | 4      | Rue 4 | Lyon       | 45.7578137 | 4.8320114   | true  |

![tFixedFlowInput - Adresses]({{ '/assets/img/blog/7-twritejsonfield/4-structure_adresses.webp' | relative_url }}){:alt="Données adresses" loading="lazy" decoding="async"}

---

### 4.5.1 Étape A : Construire le tableau d’adresses (par personne)

Objectif :
- partir du flux **Adresses**,
- regrouper les adresses par personne,
- produire un **bloc JSON “adresses”** (un tableau) par personne.

À la fin de cette étape, on obtient un flux du type :
- `personnes_id`
- `json_adresses` (chaîne JSON contenant le tableau d’adresses)

> Ici, on ne construit pas encore le JSON final. On fabrique uniquement le “paquet” `adresses[]`, prêt à être rattaché aux personnes ensuite.

---

#### 4.5.1.1 : Préparer le flux d’entrée “Adresses”

On part uniquement du composant `tFixedFlowInput` **Adresses**.

Points à vérifier :
- `personnes_id` est bien présent (clé de rattachement),
- les champs adresse (ville, etc.) sont bien typés,
- tu as plusieurs lignes d’adresses pour au moins une personne (sinon tu ne vois pas l’intérêt du regroupement).

![Données Adresses]({{ '/assets/img/blog/7-twritejsonfield/4-A1-adresses_data.webp' | relative_url }}){:alt="Exécution du job avec Adresses" loading="lazy" decoding="async"}

---

#### 4.5.1.2 : Ajouter un `tWriteJSONField` dédié aux adresses

Ajoute un `tWriteJSONField` juste après ton flux **Adresses**.

But : produire une colonne `json_adresses` qui contiendra **le tableau d’adresses**.

##### 4.5.1.2.1 : Schéma de sortie

Dans `tWriteJSONField` :
- **Edit schema** (sortie) :
  - ajoute une colonne `json_adresses` (type `String`),
  - conserve `personnes_id` en sortie (on en aura besoin à l’étape B).

![Schéma sortie tWriteJSONField]({{ '/assets/img/blog/7-twritejsonfield/4-A2-twritejsonfield_schema.webp' | relative_url }}){:alt="Schéma de sortie du tWriteJSONField" loading="lazy" decoding="async"}

##### 4.5.1.2.2 : Output Column

- **Output Column** : sélectionne `json_adresses`.

![Output Column]({{ '/assets/img/blog/7-twritejsonfield/4-A3-twritejsonfield_column.webp' | relative_url }}){:alt="Output Column json_adresses" loading="lazy" decoding="async"}

---

#### 4.5.1.3 : Le point clé, configurer le regroupement (Group by)

Pour obtenir **un tableau d’adresses par personne**, il faut absolument regrouper par `personnes_id`.

Dans les **Basic settings** :
- section **Group by**
  - `Input column` = `personnes_id`
  - `Output column` = `personnes_id`

Ce réglage indique au composant :
> pour chaque `personnes_id`, produis un seul résultat et agrège les lignes dans un tableau.

![Group by personnes_id]({{ '/assets/img/blog/7-twritejsonfield/4-A3-twritejsonfield_groupby.webp' | relative_url }}){:alt="Group by sur personnes_id" loading="lazy" decoding="async"}

---

##### 4.5.1.4 : Configurer le JSON Tree, tableau `adresses[]`

Clique sur **Configurer la structure JSON** et construis l’arbre cible.

Objectif de l’arbre (au niveau structurel) :
- un nœud racine (temporaire, on verra plus tard s’il est conservé),
- un nœud `adresses` défini comme **tableau**,
- un élément d’adresse qui boucle,
- sous cet élément : les champs de l’adresse.

###### 4.5.1.4.1 : Créer le tableau

Dans le JSON Tree :

1. Ajoute un nœud `adresses`
2. Sur `adresses`, ajoute un attribut :
   - **Name** : `class`
   - **Fixed value** : `array`
3. Sous `adresses`, ajoute un sous-nœud `adresse`
4. Sur ce sous-nœud :
   - fais **Set as loop element**
   - ajoute un attribut :
     - **Name** : `class`
     - **Fixed value** : `object`

À ce stade, tu décris uniquement la **structure** :
- `adresses` est un tableau  
- chaque entrée du tableau est un objet `adresse`

Aucune donnée n’est encore mappée, c’est normal.

###### 4.5.1.4.2 : Ajouter les champs de l’adresse

Sous le nœud `adresse`, ajoute les champs que tu veux exposer dans le JSON :

- `_id`
- `numero`
- `rue`
- `ville`
- `latitude`
- `longitude`
- `actif`

> Ne mets pas `personnes_id` ici : ce champ sert au regroupement, pas à la structure de l’adresse dans le JSON.

###### 4.5.1.4.3 : Mapper les colonnes d’entrée

Une fois les nœuds créés :

- fais un **drag & drop** depuis la colonne source vers le nœud JSON correspondant :
  - `_id` → `_id`
  - `numero` → `numero`
  - `rue` → `rue`
  - `ville` → `ville`
  - `latitude` → `latitude`
  - `longitude` → `longitude`
  - `actif` → `actif`

À ce stade :
- chaque ligne du flux **Adresses** alimente une entrée du tableau,
- le regroupement final dépendra uniquement du **Group by** configuré plus tôt.

![JSON Tree]({{ '/assets/img/blog/7-twritejsonfield/4-A4-twritejsonfield_jsontree.webp' | relative_url }}){:alt="JSON Tree du tWriteJSONField (Adresses)" loading="lazy" decoding="async"}

---

###### 4.5.1.4.4 : Vérifier (ou forcer) les types si nécessaire

Par défaut, `tWriteJSONField` s’appuie sur le **type des colonnes du schéma** :

- `Integer` → nombre JSON
- `Boolean` → booléen JSON
- `String` → chaîne JSON

Si ton schéma est proprement typé, **tu peux t’arrêter là**.

Dans certains cas, tu peux vouloir forcer explicitement un type :
- coordonnées (`latitude`, `longitude`) en `number`
- identifiants en `integer`
- flags en `boolean`

Pour cela :
- clic droit sur le nœud concerné → *Ajouter un attribut*
- **Name** : `type`
- **Fixed value** : `integer`, `number` ou `boolean`

> Ne force les types que si nécessaire. Un JSON Tree surchargé d’attributs devient vite difficile à maintenir.

---

###### 4.5.1.4.5 : Ce que tu dois avoir à la fin de cette étape

Avant de passer à l’exécution, vérifie visuellement que :

- `adresses` est bien en `class=array`
- `adresse` est bien le **loop element**
- les champs sont bien sous `adresse`
- aucun champ “personne” ne s’est glissé dans la structure

À ce stade, le JSON Tree décrit **parfaitement** un tableau d’adresses. Il ne reste plus qu’à vérifier le résultat à l’exécution.

---

##### 4.5.1.5 : Exécution et analyse du résultat

À ce stade, tout est en place :
- le flux **Adresses** est correctement typé,
- le `Group by` est configuré sur `personnes_id`,
- le JSON Tree décrit un **tableau `adresses[]`** cohérent.

Il est temps d’exécuter le job et d’analyser le résultat.

---

###### 4.5.1.5.1 : Exécution du job

Lance le job avec uniquement la chaîne suivante :

`tFixedFlowInput (Adresses)` → `tWriteJSONField` → `tLogRow`

![Exécution du job]({{ '/assets/img/blog/7-twritejsonfield/4-A5-twritejsonfield_execution.webp' | relative_url }}){:alt="Exécution du job - Étape A" loading="lazy" decoding="async"}

---

###### 4.5.1.5.2 : Analyse du nombre de lignes en sortie

Observe le nombre de lignes affichées dans le `tLogRow`.

Tu dois constater que :
- le nombre de lignes **n’est plus égal au nombre d’adresses**,
- il correspond au **nombre de `personnes_id` distincts**.

Ce résultat confirme que :
- le `Group by` fonctionne,
- le regroupement par personne est bien pris en compte,
- chaque ligne de sortie représente **un bloc d’adresses par personne**.

---

> Les plus attentifs remarqueront une séquence du type **1, 2, 1** dans `personnes_id`. C’est normal : `tWriteJSONField` ne trie pas les données, il regroupe uniquement les lignes consécutives ayant la même clé. Si les données arrivent dans le désordre, le regroupement sera incorrect.

###### 4.5.1.5.3 : La règle d’or

Avec `tWriteJSONField`, un Group by implique toujours un tri préalable. On ajoute donc un `tSortRow` **avant** le `tWriteJSONField` : tri ascendant sur `personnes_id`.

![Tri préalable des données]({{ '/assets/img/blog/7-twritejsonfield/4-A5-tsortrow.webp' | relative_url }}){:alt="Tri préalable avec tSortRow" loading="lazy" decoding="async"}

Après relance, les `personnes_id` sont regroupés et chaque ligne correspond à **un seul tableau d’adresses par personne**.

![Exécution correcte]({{ '/assets/img/blog/7-twritejsonfield/4-A5-exec.webp' | relative_url }}){:alt="Exécution après correction" loading="lazy" decoding="async"}

---

###### 4.5.1.5.4 : Lecture du contenu de `json_adresses`

Dans le `tLogRow`, concentre-toi sur la colonne `json_adresses`.

Ce que tu dois vérifier visuellement :

- la colonne contient une **structure JSON valide**,
- la structure est bien un **tableau**,
- chaque entrée du tableau correspond à **une adresse**,
- les champs présents sont uniquement ceux définis dans le JSON Tree,
- les types sont cohérents (nombres, booléens, chaînes).

> Aperçu de la colonne `json_adresses` pour la première ligne (`personnes_id=1`)  
> ![Contenu json_adresses]({{ '/assets/img/blog/7-twritejsonfield/4-A5-exemple_json.webp' | relative_url }}){:alt="Contenu de la colonne json_adresses" loading="lazy" decoding="async"}

Pour affiner :
- coche **Supprimer le nœud racine** du `tWriteJSONField`,
- ajoute un attribut `class` → `object` sur le champ `rue` pour éviter les tableaux vides.

![Correction du composant]({{ '/assets/img/blog/7-twritejsonfield/4-A5-corrections.webp' | relative_url }}){:alt="Correction du composant" loading="lazy" decoding="async"}

Le JSON obtenu est propre et directement exploitable.

![JSON corrigé]({{ '/assets/img/blog/7-twritejsonfield/4-A5-corrections_resultat.webp' | relative_url }}){:alt="JSON corrigé" loading="lazy" decoding="async"}

---

###### 4.5.1.5.5 : Ce que nous avons validé à cette étape

À la fin de l’étape A, on a validé que :

- le JSON Tree est correctement structuré,
- le `Group by` est maîtrisé,
- on sait produire un **bloc JSON réutilisable**,
- le problème “1..n” est résolu **avant** de toucher aux personnes.

Si tout est conforme, on peut passer à l’étape suivante :

👉 **Étape B : Rattacher le tableau d’adresses au flux Personnes, sans duplication**

---

### 4.6 Étape B : Rattacher le tableau d’adresses au flux Personnes, sans duplication

Objectif :
- repartir du flux **Personnes**,
- rattacher le bloc `json_adresses` produit à l’étape A,
- garantir qu’on sort **une seule ligne par personne**.

À la fin de cette étape, on obtient un flux du type :
- `_id`, `nom`, `prenom`, `telephone`, `age`, `actif`
- `json_adresses` (tableau JSON, vide si aucune adresse)

> Ici on ne produit toujours pas le JSON global final. On prépare un flux “Personne + adresses” propre, stable, sans duplication.

---

#### 4.6.1 : Préparer les deux flux d’entrée

On a maintenant 2 branches :

1) **Personnes** (source brute)  
2) **Adresses agrégées** (résultat final de l’étape A)  
   - idéalement : `tFixedFlowInput(Adresses) → tSortRow → tWriteJSONField(Group by) → ...`

![Vue d’ensemble - Étape B]({{ '/assets/img/blog/7-twritejsonfield/5-B1-vue-ensemble.webp' | relative_url }}){:alt="Vue d'ensemble de l'étape B" loading="lazy" decoding="async"}

---

#### 4.6.2 : Faire la jointure dans un `tMap` (LEFT JOIN)

Ajoute un `tMap` en prenant :

- **Main** : le flux `Personnes`
- **Lookup** : le flux “Adresses agrégées” (celui qui contient `personnes_id` + `json_adresses`)

Dans le `tMap` :

- clé de jointure :
  - `personnes._id` = `adresses.personnes_id`

- type de jointure :
  - **LEFT OUTER JOIN**

Pourquoi LEFT JOIN ?
- pour conserver les personnes **même si elles n’ont aucune adresse**,
- sinon tu perds des personnes, et ton JSON global devient incomplet.

![tMap - jointure LEFT]({{ '/assets/img/blog/7-twritejsonfield/5-B2-tmap-join.webp' | relative_url }}){:alt="Configuration tMap LEFT JOIN" loading="lazy" decoding="async"}

---

#### 4.6.3 : Construire le schéma de sortie “Personne + json_adresses”

Dans la sortie du `tMap`, crée (ou complète) un flux de sortie avec :

- tous les champs Personnes :
  - `_id`, `nom`, `prenom`, `telephone`, `age`, `actif`
- + `json_adresses`

⚠️ Ne ressors pas `personnes_id` du lookup (inutile, tu as déjà `_id` côté Personnes).

![Sortie tMap - schema]({{ '/assets/img/blog/7-twritejsonfield/5-B3-tmap-schema.webp' | relative_url }}){:alt="Schéma sortie Personne + json_adresses" loading="lazy" decoding="async"}

---

#### 4.6.4 : Gérer le cas “aucune adresse” (mettre un tableau vide)

Avec une jointure LEFT, certaines personnes auront :
- `json_adresses = null` (car aucune ligne dans le lookup)

On veut un JSON propre :
- `adresses` doit être un **tableau**
- donc si `null` → on veut **un tableau vide**

Par défaut, si une chaîne de caractères est `null`, le composant `tWriteJSONField` peut générer un tableau vide. On est donc bons sur ce point dans notre cas.

---

#### 4.6.5 : Vérifier qu’il n’y a aucune duplication

Ajoute un `tLogRow` juste après le `tMap`.

Tu dois vérifier 2 choses :

1) **Nombre de lignes en sortie**
- il doit être égal au nombre de personnes (ici : 3),
- pas au nombre d’adresses (4),
- pas au nombre de lignes “aplati” (5, 6, etc.).

2) **Chaque `_id` apparaît une seule fois**
- `_id = 1` : une ligne, avec un `json_adresses` contenant plusieurs éléments,
- `_id = 2` : une ligne, avec un `json_adresses` contenant un élément,
- `_id = 3` : une ligne, avec un `json_adresses` vide.

![Étape B - exécution]({{ '/assets/img/blog/7-twritejsonfield/5-B5-execution.webp' | relative_url }}){:alt="Exécution étape B" loading="lazy" decoding="async"}

---

### 4.7 Étape C : Construire le JSON global final

Objectif :
- partir du flux “Personnes + json_adresses” (sortie de l’étape B),
- construire **un seul document JSON** contenant **toutes** les personnes,
- garantir une structure stable (ordre + pas de duplication).

À la fin de cette étape, on obtient :
- une colonne `json_final` contenant le JSON global,
- et un fichier `.json` écrit sur disque.

---

#### 4.7.1 : Préparer le flux “Personnes + json_adresses”

On repart de la sortie de l’étape B (tMap) :
- 1 ligne = 1 personne,
- les champs Personnes + `json_adresses`.

---

#### 4.7.2 : Ajouter une clé constante (indispensable pour faire un JSON global)

Pour produire **un seul JSON**, il faut regrouper toutes les lignes dans un même groupe.

Le pattern recommandé consiste à :
- ajouter une colonne constante (ex. `grp_json = "x"`),
- puis faire un **Group by** sur cette colonne.

On ajoute donc dans le `tMap` une nouvelle colonne :
- `grp_json` (String),
- valeur constante : `"x"`.

![Ajout grp_json]({{ '/assets/img/blog/7-twritejsonfield/6-C2-ajout-grp.webp' | relative_url }}){:alt="Ajout de la colonne grp_json constante" loading="lazy" decoding="async"}

---

#### 4.7.3 : Trier les données avant le JSON global (recommandé)

Même si on regroupe tout en un seul document, trier permet :
- d’obtenir un JSON **stable** (ordre reproductible),
- d’éviter des surprises si tu compares des résultats.

Ajoute un `tSortRow` :
- tri ascendant sur `_id`.

![Tri _id]({{ '/assets/img/blog/7-twritejsonfield/6-C3-tsortrow.webp' | relative_url }}){:alt="Tri ascendant par _id" loading="lazy" decoding="async"}

---

#### 4.7.4 : Ajouter le `tWriteJSONField` final (celui qui produit le JSON global)

Ajoute un nouveau `tWriteJSONField` juste après. Il va permettre de créer le JSON final.

##### 4.7.4.1 : Schéma de sortie

Dans le schéma de sortie du composant :
- une colonne : `json_final` (String) : elle contiendra le JSON final,
- la colonne `grp_json` en sortie : elle sert uniquement au `Group by` pour n’avoir qu’un seul document.

Ensuite :
- **Output Column** = `json_final`

![Schema output json_final]({{ '/assets/img/blog/7-twritejsonfield/6-C4-schema-output.webp' | relative_url }}){:alt="Schéma sortie tWriteJSONField final" loading="lazy" decoding="async"}

---

#### 4.7.5 : Configurer le Group by (pour n’avoir qu’une seule ligne en sortie)

Dans les **Basic settings** > **Group by** :
- `Input column` = `grp_json`
- `Output column` = (laisse `grp_json` si auto-rempli, sinon sélectionne une colonne adaptée)

Ce réglage force la génération d’un seul résultat : **un JSON global**.

![Group by grp_json]({{ '/assets/img/blog/7-twritejsonfield/6-C5-groupby.webp' | relative_url }}){:alt="Group by sur grp_json" loading="lazy" decoding="async"}

---

#### 4.7.6 : Configurer le JSON Tree final (racine + personnes[])

Clique sur **Configurer la structure JSON** et construis l’arbre cible final.

Structure attendue :
- un nœud racine (ex. `rootTag` ou le nom que tu veux),
- un nœud `personnes` en tableau,
- un nœud `personne` (loop element) en objet,
- sous `personne` :
  - les champs Personnes (`_id`, `nom`, `prenom`, `telephone`, `age`, `actif`),
  - + le bloc `adresses`.

##### 4.7.6.1 : Définir les structures

- `personnes` :
  - attribut `class = array`
- sous `personnes`, nœud `personne` :
  - **Set as loop element**
  - attribut `class = object`

![JSON Tree structure final]({{ '/assets/img/blog/7-twritejsonfield/6-C6-jsontree-structure.webp' | relative_url }}){:alt="Structure du JSON Tree final" loading="lazy" decoding="async"}

##### 4.7.6.2 : Mapper les champs Personnes

Sous `personne`, fais le mapping des colonnes Personnes par drag & drop.

![Mapping personnes]({{ '/assets/img/blog/7-twritejsonfield/6-C6-mapping-personnes.webp' | relative_url }}){:alt="Mapping des champs Personnes" loading="lazy" decoding="async"}

##### 4.7.6.3 : Ajouter le nœud “adresses”

Sous `personne`, ajoute le nœud `adresses`.

`json_adresses` représente déjà le tableau d’adresses : tu vas donc **mapper** `json_adresses` vers `adresses`.

![Mapping adresses]({{ '/assets/img/blog/7-twritejsonfield/6-C6-mapping-adresses.webp' | relative_url }}){:alt="Ajout et mapping du nœud adresses" loading="lazy" decoding="async"}

---

#### 4.7.7 : Exécuter et vérifier le résultat

Ajoute un `tLogRow` en sortie du `tWriteJSONField` final.

Ce que tu dois observer :
- **1 seule ligne en sortie**,
- la colonne `json_final` est remplie,
- la structure contient :
  - `personnes` avec tous les enregistrements,
  - pour chaque personne : `adresses` (tableau, vide si nécessaire).

![Résultat final]({{ '/assets/img/blog/7-twritejsonfield/6-C7-resultat.webp' | relative_url }}){:alt="Résultat final : une ligne avec json_final" loading="lazy" decoding="async"}

---

#### 4.7.8 : Écrire le JSON global dans un fichier

Si tu veux produire un fichier final :
- ajoute un `tFileOutputRaw`,
- écris uniquement la colonne `json_final`.  
  Pour cela, utilise un `tMap` ou un `tFilterColumns` afin de ne pas écrire la colonne `grp_json`.

![Écriture fichier]({{ '/assets/img/blog/7-twritejsonfield/6-C8-fileoutput.webp' | relative_url }}){:alt="Écriture du JSON global dans un fichier" loading="lazy" decoding="async"}

---

## 5. Rétrospective et mise en perspective

Avant de conclure, prenons 2 minutes pour faire le point sur ce que l’on a réellement fait dans ce tutoriel, et surtout pourquoi cette méthode fonctionne.

---

### 5.1 : Ce que nous avons construit (en résumé)

Pas à pas, nous avons :

- compris le **rôle réel de `tWriteJSONField`**  
  → ce n’est pas un composant “magique”, mais un composant **déclaratif** basé sur le JSON Tree ;

- appris à **penser JSON avant de penser Talaxie**  
  → on définit la **structure cible**, puis on construit le job pour la produire ;

- maîtrisé les notions clés du JSON Tree :
  - `loop element`,
  - `class = array / object`,
  - `type` quand le schéma ne suffit plus ;

- appliqué une stratégie **robuste et maintenable** :
  - **Étape A** : résoudre le problème du `1..n` (Personne → Adresses) *avant tout*,
  - **Étape B** : rattacher les adresses aux personnes **sans duplication**,
  - **Étape C** : produire un **JSON global unique**, propre et stable.

Résultat :
- aucune ligne dupliquée,
- des tableaux toujours cohérents (même vides),
- un JSON lisible, exploitable et prévisible.

---

### 5.2 : Les règles d’or à retenir

Si tu ne devais retenir que quelques principes de cet article :

- **Le Group by de `tWriteJSONField` ne trie jamais les données**  
  👉 tri préalable = obligatoire.

- **Un JSON mal conçu vient presque toujours d’un flux mal structuré**  
  👉 on corrige le flux *avant* le JSON Tree.

- **Un `tMap` trop tôt est souvent une mauvaise idée**  
  👉 il aplatit les données et complique la reconstruction.

- **Un bon JSON commence toujours par une structure cible claire**  
  👉 le JSON Tree n’est qu’une traduction de cette structure.

---

### 5.3 : À adapter selon ton cas d’usage

Ce tutoriel illustre ce qu’il est possible de faire avec `tWriteJSONField` et montre une méthode propre. Dans un contexte réel, l’implémentation doit toujours être adaptée :

- **API REST**
  - souvent : un JSON par entité ou par appel,
  - structure stricte, types obligatoires.

- **Base NoSQL (MongoDB, etc.)**
  - documents unitaires ou agrégés selon les usages,
  - attention à la volumétrie et à la taille des documents.

- **Échanges batch / fichiers**
  - JSON global pertinent,
  - tant que les volumes restent maîtrisés.

La bonne question n’est jamais *“Comment faire ce JSON avec Talaxie ?”* mais toujours :  
**“Quel JSON ma cible attend-elle vraiment ?”**

---

### 5.4 : Mot de la fin

Si tu retiens une seule chose de cet article :

> **Avec `tWriteJSONField`, la qualité du JSON dépend surtout de la réflexion en amont, puis de la configuration.**

Une fois cette logique acquise, générer des JSON complexes devient plus simple, plus fiable et beaucoup moins frustrant.

👉 À partir de là, tu peux :
- adapter cette méthode à tes propres flux,
- changer la granularité (1 JSON par ligne ou global),
- ou intégrer ces JSON dans des API, bases NoSQL ou pipelines plus larges.
