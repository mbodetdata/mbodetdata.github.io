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

Quand tu commences à utiliser **tWriteJSONField** dans Talaxie, tout va bien…  
jusqu’au moment où tu ouvres le **Configure JSON Tree** et que tu vois :

- des *loop elements*  
- des attributs `type`  
- des attributs `class=array` ou `class=object`  
- des colonnes *Group by*…

…et là, tu te demandes comment obtenir **le JSON que tu veux**, plutôt qu’un truc bizarre que la doc n’explique qu’à moitié.

Dans cet article, on va voir **comment raisonner** le JSON Tree pour :

1. comprendre à quoi sert vraiment `tWriteJSONField`,  
2. configurer le JSON Tree **en fonction du JSON cible**,  
3. maîtriser les attributs `type` et `class` (*array* / *object*),  
4. gérer simplement les cas classiques :  
   - un objet JSON par ligne,  
   - un tableau JSON d’objets,  
   - des types non-string (int, boolean, etc.).

> Les pages de doc utiles côté Talend/Talaxie :  
> - Propriétés de **tWriteJSONField** (Standard)  
> - **Configurer un JSON Tree** (attributs `type` et `class`)  
> - Scénario avec **tFixedFlowInput → tWriteJSONField → tExtractJSONFields → tLogRow**

---

## 1. À quoi sert vraiment tWriteJSONField ?

`tWriteJSONField` sert à **transformer des lignes tabulaires en JSON**, et à stocker ce JSON :

- dans une **colonne de la ligne** (ex. `json_document`, `serializedValue`),  
- ou pour l’envoyer à un composant aval, un tRestClient par exemple.

Concrètement, il te permet de :

- **prendre des colonnes d’entrée** (schema classique Talend),  
- **les mapper dans un arbre JSON** (le JSON Tree),  
- **produire une chaîne JSON** dans une colonne de sortie (Output Column).

Dans les **Basic settings** de `tWriteJSONField`, les points clés sont :

- **Colonne de sortie** : colonne qui contiendra la chaîne JSON (ex. `json_doc`, `serializedValue`).  
- **Configurer la structure JSON** : ouvre l’éditeur pour définir la structure JSON, le **JSON Tree**.  
- **Group by** : sert à regrouper plusieurs lignes en **un seul JSON** (typiquement pour produire un tableau d’objets par groupe).
- **Supprimer le noeud racine** : COmme son nom l'indique, il permet de supprimer le noeud racine.


Dans les **Advanced settings** de `tWriteJSONField`, tu retrouve quelques parametres supplementaires, permettant de : 

- **Entourrer de guillements toutes les valeurs non nulles**. 
- **Passer les valeurs nulles en chaine de caractére vide**
- **Utiliser la notation scientifique pour les valeurs flottantes**


---

## 2. Comprendre le JSON Tree (et ce qu’il représente vraiment)

Quand tu cliques sur **Configurer la structure JSON** :

- à gauche : **Source du lien** → ce sont tes **colonnes d’entrée** (schema du composant précédent) ;  
- à droite : **Cible du lien** → c’est **l’arbre JSON que tu veux produire** ;  
- au centre : les liens entre les deux (drag & drop).

La logique est simple :

- Chaque **nœud** du JSON Tree = un **niveau du JSON** (`objet`, `attribut`, `array`, etc.).  
- Tu décides **quel nœud “boucle”** (loop element) → c’est ce qui se répète pour chaque ligne.  
- Tu ajoutes des **attributs** pour piloter le type ou la nature du nœud :
  - `type` → pour dire si c’est un `integer`, `number`, `float`, `boolean`, …  
  - `class` → pour dire si c’est un `array` ou un `object`.  

Ce qu’il faut retenir :  
> **Tu ne configures pas tWriteJSONField pour faire “un peu de magie” → tu lui décris exactement le JSON final que tu veux produire.**

---

## 3. Les attributs du JSON Tree : `type` et `class`

Par défaut, dans le JSON Tree, **tout est une string**.  
Si tu ne fais rien, tu obtiens un JSON où tous les champs sont des chaînes de caractères, même ceux qui représentent des nombres ou des booléens.

Pour avoir autre chose que des strings, tu dois ajouter des attributs **sur les nœuds** concernés.

### 3.1. Attribut `type` (pour les scalaires non-string)

Pour un élément qui doit être numérique ou booléen :

- clic droit sur le nœud → *Ajouter un attribut*  
- **name** : `type`  
- **Fixed value** :  
  - `integer` pour un entier  
  - `number` pour un nombre générique  
  - `float` pour un float  
  - `boolean` pour un booléen  

Exemple : tu veux que `id` et `age` soient numériques, et `active` un booléen.  
Dans le JSON Tree :

- `id` → attribut `type=integer`  
- `age` → attribut `type=integer`  
- `active` → attribut `type=boolean`

### 3.2. Attribut `class` (array / object)

Pour les éléments qui représentent **une structure** :

- **`class=array`** → ton nœud représente un **tableau** (`[]`).  
  - Tu ajoutes ensuite un sous-nœud `element`, **set as loop element**, qui représentera chaque entrée du tableau.  
- **`class=object`** → ton nœud représente un **objet JSON** (`{}`) avec des sous-champs.

Exemple typique (que tu montreras en capture) :

- un nœud `lines` : `class=array`  
- un sous-nœud `element` : loop element  
- sous `element` : les champs `product`, `qty`, etc.

---

## 4. Exemple - Croisement de personnes et adresses

### Description des données

On va prendre un cas d'ecole, mais qui a le mérite d'être clair et compréhensible.
Nous allons avoir deux sources de données `personnes`et `adresses`.

Voici le schéma et les données renseigné dans les tFixedFlowInput

> Personnes
![Schéma de personnes]({{ '/assets/img/blog/7-twritejsonfield/1-personnes-schema.webp' | relative_url }}){:alt="Schéma de personnes" loading="lazy" decoding="async"}
![Données de personnes]({{ '/assets/img/blog/7-twritejsonfield/1-personnes-data.webp' | relative_url }}){:alt="Données de personnes" loading="lazy" decoding="async"}

> Adresses
![Schéma de adresse]({{ '/assets/img/blog/7-twritejsonfield/1-adresse-schema.webp' | relative_url }}){:alt="Schéma de personnes" loading="lazy" decoding="async"}
![Données de adresse]({{ '/assets/img/blog/7-twritejsonfield/1-adresse-data.webp' | relative_url }}){:alt="Données de personnes" loading="lazy" decoding="async"}


### Vue d'ensemble du job

![Vue d'ensemble du job]({{ '/assets/img/blog/7-twritejsonfield/1-job-vue-ensemble.webp' | relative_url }}){:alt="Vue d'ensemble du job" loading="lazy" decoding="async"}

On remarque donc que l'on a nos deux sources de données `Personnes`et `Adresses`.
On utilise un **tMap** pour les liers, et faire le rapprochement entre `_id` et `personnes_id`

![tMap, mapping utilisé]({{ '/assets/img/blog/7-twritejsonfield/1-job-tmap.webp' | relative_url }}){:alt="Mapping utiulisé, configuration du tMap" loading="lazy" decoding="async"}


On a egalement le composant `tWriteJSONField` qui est paramatré par defaut avec une configuration minimale : 

> - Une colonne de sortie : JSON
> - Un JSON Tree Basique (uniquement une boucle d'elements)

![JSON Tree]({{ '/assets/img/blog/7-twritejsonfield/1-job-twritejsonfield.webp' | relative_url }}){:alt="JSON Tree minimaliste" loading="lazy" decoding="async"}


### Exécution et analyse
![Vue d'ensemble du job]({{ '/assets/img/blog/7-twritejsonfield/1-job-exec.webp' | relative_url }}){:alt="Exécution et analyse du job" loading="lazy" decoding="async"}

En exécutant le job, nous avons : 
> - 3 lignes pour les personnes
> - 4 lignes pour les adresses
> - 5 lignes en sortie de mapping

Voyons voir maintenant notre fichier JSON généré

![Résultat du JSON]({{ '/assets/img/blog/7-twritejsonfield/1-resultat_json.webp' | relative_url }}){:alt="Résultat du JSON généré" loading="lazy" decoding="async"}

> Aïe ! mais il n' a rien qui va la dedans ! 
> - Un nom d'objet JSON peut explicite "rootTag"
> - Une seulle personne 
> - Des tableuax vides
> - Aucune structure

En l'etat, ce JSON n'est pas exploitable, il n'a pas de sens, et n'est pas complet ! 
Je te propose dans les section suivante de corriger point par point la structure du JSON pour avoir quelque chose d'exploitable

---

## 5. Faire en sorte d'avoir tout nos objets JSON dans notre fichier

Bon on l'a remarqué, notre fichier JSON ne contient pas toute les données. Sur 5 objets JSON, nous n'avons que le dernier, on a donc une perte d'information.
On va corriger cela tout de suite ! 

On a trois etapes a faire pour arriver a nos fin : 
> - Restructurer le JSON Tree
> - Definir un champ dans le tMap qui contient une valeur fixe
> - Utiliser ce nouveau champ comme clef du `Group by` du tWriteJSONField


### Étape 1 — Restructurer le JSON Tree

On va commencer par supprimer les liens du JSON Tree, car on a fait un vulgaire drag&drop sans trop se poser de question. Le moment est venu de se poser quelques questions, et la premiere de toute : **Quelle structure on veux donner a notre JSON ?**.
C'est de là que tout part ! Ou on veux arriver ? Et en fonction on adapte les etapes.

> Petit conseil pratique : représentez vous le JSON que vous souhaitez (ou que l'on vous impose si vous devez le pousser sur une API, une base NoSQL,...)

Dans notre exemple plusieurs cas sont possible : 
- Je veux un tableau de personnes avec les differents elements (nom, prenom, elements d'adresses,...)
- Je veux un tableau 
---

## 8. Bons réflexes et pièges classiques

### Bons réflexes

- **Commencer par dessiner ton JSON cible** (ou récupérer celui attendu par l’API / la cible).  
- Configurer le JSON Tree **de haut en bas**, en suivant la structure du JSON :  
  - racine → objets → arrays → champs.  
- Utiliser systématiquement :
  - `class=array` + `element` + loop pour les tableaux,  
  - `type` pour les champs non-string.  
- Tester avec un **tFixedFlowInput + tWriteJSONField + tLogRow** pour valider la chaîne JSON.

### Pièges à éviter

- **Oublier `class=array`** → tu obtiens un objet au lieu d’un tableau `[]`.  
- **Mettre le loop element au mauvais endroit** → tu n’as qu’un seul élément dans le tableau, ou tu génères plusieurs JSON au lieu d’un seul.  
- **Laisser tout en string** alors que la cible attend des numbers/booleens → erreurs côté API / Elasticsearch.  
- **Ne jamais tester la structure JSON** : valide toujours ton JSON via un formatter / l’outil cible.

---

## Conclusion

`tWriteJSONField` n’est pas “magique”, il est **strict** :  
il fait exactement ce que tu lui décris dans le **JSON Tree**.

En résumé :

- **Output Column** → où sera stocké ton JSON.  
- **JSON Tree** → description exacte de la structure JSON (objets, tableaux, types).  
- **Attributs `type` / `class`** → permettent de sortir du “tout string” et d’obtenir des JSON propres.  
- **Group by + loop element** → contrôlent comment les lignes source sont regroupées dans les JSON.

Une fois que tu raisonnes à partir du **JSON final** que tu veux, la configuration de `tWriteJSONField` devient :

> “Je décris mon JSON dans l’arbre, puis je mappe les colonnes dessus.”

---

## ✅ Checklist tWriteJSONField / JSON Tree

- [ ] Output Column définie (ex. `json_doc` / `serializedValue`)  
- [ ] JSON Tree cohérent avec le JSON attendu  
- [ ] Loop element positionné au bon niveau  
- [ ] `class=array` + `element` utilisé pour les tableaux  
- [ ] Attribut `type` en place pour les nombres / booléens  
- [ ] Group by configuré si plusieurs lignes doivent alimenter un même JSON  
- [ ] Tests OK sur un job simple (`tFixedFlowInput → tWriteJSONField → tLogRow`)  
- [ ] JSON validé dans la cible (API / Elasticsearch / Kinesis / autre)
