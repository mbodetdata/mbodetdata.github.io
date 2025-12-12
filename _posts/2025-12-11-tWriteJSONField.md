---
layout: post
title: "Talaxie : bien configurer tWriteJSONField et le JSON Tree (type, class, array, object)"
description: "Comprendre enfin comment configurer tWriteJSONField et son JSON Tree (loop, attributs type/class, array/object) dans Talaxie sans s’arracher les cheveux."
categories: blog
tags: [Talend, Talaxie, JSON, tWriteJSONField, ETL, Bonnes pratiques]
image: "/assets/img/blog/7-twritejsonfield/logo_1024.webp"
active: false
parent_category: talend-talaxie
---


Aujourd’hui, le JSON est devenu incontournable pour énormément d’applications.  
C’est un format texte qui permet de **stocker** et **d’échanger** des données : bases NoSQL comme `MongoDB`, API REST, événements, configs… le JSON est partout.

Générer du JSON avec Talaxie, ce n’est pas toujours aussi intuitif qu’il n’y paraît, surtout dès que la structure devient un peu plus complexe (objets imbriqués, tableaux, types non-string, etc.).  
Dans cet article, je vais donc te montrer comment **générer un JSON propre et directement exploitable**, avec quelques tips qui font gagner du temps au quotidien.

> ✅ J’ai mis à disposition le workspace ici :  
> ➡️ **[Lien du workspace]**  
> N’hésite pas à le télécharger pour suivre pas à pas.

Si tu as déjà eu à travailler avec du JSON sur Talaxie (ou Talend), tu connais sûrement le composant **tWriteJSONField**.  
Mais est-ce que tu connais les petits détails qui te font gagner du temps… et surtout qui t’évitent de sortir un JSON “presque bon” mais pénible à exploiter ?

Ensemble, on va voir les étapes suivantes :

1. Comprendre à quoi sert vraiment `tWriteJSONField`  
2. Configurer le JSON Tree **en fonction du JSON cible**  
3. Maîtriser les attributs `type` et `class` (`array` / `object`)  
4. Gérer simplement les cas classiques :  
   - un objet JSON par ligne  
   - un tableau JSON d’objets  
   - des types non-string (`int`, `boolean`, etc.)

> 📚 Sources utilisées pour la rédaction :  
> - **[Lien doc 1]**  
> - **[Lien doc 2]**  
> - **[Lien doc 3]**


---

## 1. À quoi sert vraiment tWriteJSONField ?

`tWriteJSONField` sert à **transformer des lignes tabulaires en JSON**, puis à stocker ou transmettre ce JSON :

- dans une **colonne de la ligne** (ex. `json_document`, `serializedValue`),  
- ou vers un composant aval, comme un `tRestClient`, un composant MongoDB (si tu es sur le studio Big Data), etc.

Concrètement, il permet de :

- **partir d’un schéma d’entrée classique** (colonnes Talend),  
- **mapper ces colonnes dans une structure JSON** via le **JSON Tree**,  
- **produire une chaîne JSON** stockée dans une colonne de sortie (*Output Column*).

---

### Les paramètres clés – *Basic settings*

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

### Les paramètres complémentaires – *Advanced settings*

Dans les **Advanced settings**, tu retrouves quelques options supplémentaires qui impactent le format final du JSON :

- **Entourer de guillemets toutes les valeurs non nulles**  
  Force toutes les valeurs à être générées comme des chaînes de caractères.

- **Passer les valeurs nulles en chaîne de caractères vide**  
  Convertit les `null` en `""` au lieu de les laisser absentes ou nulles.

- **Utiliser la notation scientifique pour les valeurs flottantes**  
  Applique une notation scientifique pour les nombres à virgule (utile dans certains contextes techniques).

> 💡 Ces options sont à utiliser avec précaution :  
> elles peuvent être pratiques, mais peuvent aussi rendre ton JSON **non conforme aux attentes** d’une API ou d’un outil aval si elles sont mal utilisées.

![Advanced settings]({{ '/assets/img/blog/7-twritejsonfield/1-advanced_param.webp' | relative_url }}){:alt="Advanced settings du composant tWriteJSONField" loading="lazy" decoding="async"}

---

> **À retenir**  
> `tWriteJSONField` ne “devine” jamais ce que tu veux faire.  
> Il applique **strictement** ce que tu lui décris dans le JSON Tree et via ses paramètres.



---

## 2. Comprendre le JSON Tree (et ce qu’il représente vraiment)

Quand tu cliques sur **Configurer la structure JSON** dans `tWriteJSONField` (Paramétres simples), tu ouvres l’éditeur du **JSON Tree**.

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


![Le JSONTree]({{ '/assets/img/blog/7-twritejsonfield/2-jsontree.webp' | relative_url }}){:alt="Un exemple de JSONTree" loading="lazy" decoding="async"}


---

### Le point clé à retenir

Le JSON Tree n’est **ni automatique ni intelligent**.

Il ne fait que deux choses :
- suivre **exactement** la structure que tu dessines,
- appliquer **strictement** les attributs (`type`, `class`, loop element) que tu définis.

> **Tu ne configures pas `tWriteJSONField` pour qu’il “devine” ton JSON.**  
> Tu lui **décris précisément le JSON final que tu veux produire**, ni plus, ni moins.

C’est cette logique que tu vas appliquer dans toutes les parties suivantes.

---

## 3. Les attributs du JSON Tree : `type` et `class`

Par défaut, `tWriteJSONField` **s’appuie sur le type des colonnes d’entrée**.  
Autrement dit :

- une colonne `Integer` sera générée comme un nombre en JSON,  
- une colonne `Boolean` sera générée comme un booléen,  
- une colonne `String` sera générée comme une chaîne de caractères.

Dans les cas simples, **aucun attribut n’est donc nécessaire** pour respecter les types.

Cependant, dès que la structure devient plus complexe (tableaux, objets imbriqués, regroupements, données calculées…), il devient indispensable de **contrôler explicitement le comportement** via les attributs du JSON Tree.

---

### 3.1. Attribut `type`, forcer ou corriger le type

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

> 💡 Bonne pratique  
> Si le schéma d’entrée est proprement typé, laisse Talend faire.  
> Utilise `type` uniquement quand tu veux **reprendre le contrôle**.

---

### 3.2. Attribut `class`, définir la structure (array / object)

L’attribut `class` ne concerne **pas les types de valeurs**, mais la **structure JSON**.

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

Dans la suite, on va appliquer ces règles à des cas concrets de génération de JSON avec `tWriteJSONField`.

---

## 4. Construire le bon JSON : on commence par la cible (pas par le tMap)

On va repartir proprement sur un cas simple et concret : **croiser des Personnes et des Adresses**.

> ⚠️ Point important (et c’est là que beaucoup se plantent) :  
> **Commencer par un tMap pour “croiser les données”, puis essayer de fabriquer le JSON après… c’est une mauvaise idée.**  
> Tu risques de :
> - choisir un schéma de sortie qui ne correspond pas à la structure finale,
> - te retrouver avec des tableaux vides ou dupliqués,
> - “patcher” dans `tWriteJSONField` au lieu de construire proprement.

La bonne approche est l’inverse :  
✅ **on définit d’abord la structure JSON cible**,  
puis on construit le job pour la produire.

---

### 4.1. Les données de départ (2 sources)

On a deux sources :

- **Personnes** (identifiant unique par personne)
- **Adresses** (0..n adresses par personne via une clé de rattachement)

#### Personnes structure des données
| Champ         | Type Talaxie | Description                              |
|---------------|--------------|------------------------------------------|
| _id           | Integer      | Identifiant unique de la personne        |
| nom           | String       | Nom de la personne                       |
| prenom        | String       | Prénom de la personne                    |
| Téléphone     | String       | Téléphone de la personne                 |
| age           | Integer      | Âge de la personne                       |
| actif         | Booléan      | Est ce que la personne est active ?      |



### Adresses structure des données

| Champ         | Type Talaxie | Description                                      |
|---------------|--------------|--------------------------------------------------|
| _id           | Integer      | Identifiant unique de l’adresse                  |
| personne_id   | Integer      | Référence vers la personne (_id)                 |
| numero        | Integer      | Numéro de la rue                                 |
| rue           | String       | Nom de la rue                                    |
| ville         | String       | Ville                                            |
| latitude      | Double       | Latitude de la ville                             |
| longitude     | Double       | Longitude de la ville                            |
| actif         | Booléan      | Est ce que l'adresse est active ?                |

---

### 4.2. Avant de toucher aux composants : quelle structure JSON veut-on vraiment ?

Avant toute transformation, on doit répondre à 3 questions simples :

#### 1) Quelle est l’unité de sortie ?
- Est-ce que je veux **un document JSON par personne** ?
- Ou **un document JSON global** contenant toutes les personnes ?

➡️ Dans cet article, on vise : **un document JSON par personne** (plus simple, plus standard, parfait pour API / NoSQL).

#### 2) Quelle est la cardinalité Personne → Adresse ?
- Une personne peut avoir :
  - **0 adresse** (aucune ligne correspondante)
  - **1 adresse**
  - **plusieurs adresses**
  
➡️ Donc, côté JSON, la zone “adresses” doit être **un tableau**, même si parfois il est vide.

#### 3) Quels champs vont où ?
- Les champs “personne” restent **au niveau personne**
- Les champs “adresse” vont dans la liste **adresses[]**

> 📌 Capture à insérer ici : une petite vue “structure cible” (arbre)  
> - un nœud personne (loop principal)  
> - sous-nœud `adresses` défini comme tableau  
> - un élément d’adresse qui boucle

![Structure cible (arbre)]({{ '/assets/img/blog/7-twritejsonfield/4-structure-cible.webp' | relative_url }}){:alt="Structure JSON cible sous forme d'arbre" loading="lazy" decoding="async"}

---

### 4.3. Pourquoi “tMap d’abord” est une mauvaise idée (dans ce cas précis)

Si tu fais un tMap en premier en joignant Personnes et Adresses, tu obtiens un flux “aplati” :

- une personne est répétée autant de fois qu’elle a d’adresses
- et si tu essayes ensuite de reconstruire une structure hiérarchique (personne → adresses[]) dans `tWriteJSONField`,
  tu vas devoir gérer :
  - les duplications,
  - le regroupement,
  - et la création de tableaux correctement.

➡️ Ça marche… mais **c’est fragile**, et tu te retrouves à “bricoler” le JSON Tree au lieu de le piloter.

La bonne stratégie :
- construire un flux qui respecte déjà la logique “une personne = une unité”
- puis configurer `tWriteJSONField` pour matérialiser la hiérarchie.

---

### 4.4. Plan de construction du job (pas à pas)

Dans les sections suivantes, on va monter le job en 3 étapes, avec captures :

1. **Étape A — Sortir un flux “Personnes” propre**  
   Objectif : valider qu’on a bien 1 ligne = 1 personne (sans adresses)

2. **Étape B — Ajouter les adresses sans casser l’unité “Personne”**  
   Objectif : préparer le regroupement (0..n adresses) de manière contrôlée

3. **Étape C — Construire le JSON Tree final dans `tWriteJSONField`**  
   Objectif : obtenir un JSON propre, complet, exploitable

> ✅ À la fin, on aura :  
> - un document JSON par personne  
> - une liste d’adresses cohérente (vide si besoin)  
> - aucun doublon  
> - une structure lisible et stable

---

### 4.5. On commence : étape A (Personnes → JSON simple)

Dans la prochaine section, on démarre volontairement simple :  
on produit un JSON “personne seule” pour valider :
- Output Column
- loop element
- types

Puis seulement après, on ajoute la complexité des adresses.

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
