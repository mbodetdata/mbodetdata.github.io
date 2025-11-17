---
layout: post
title: "Chiffrer vraiment vos mots de passe Talend & Talaxie : passer à AES + clé externe"
description: "Passer du simple masquage Base64 à un chiffrement réel (AES) pour protéger sérieusement vos mots de passe dans Talend et Talaxie."
categories: blog
tags: [Talend, Talaxie, Sécurité, AES, Chiffrement, ETL, Bonnes pratiques]
image: "/assets/img/blog/security/password-aes.png"
active: false
parent_category: talend-securite
---

Dans un premier article, on a vu comment **arrêter de stocker les mots de passe en clair** dans Talend/Talaxie en utilisant une routine de chiffrement léger basée sur Base64.

C’est déjà **mille fois mieux** que `context.password = "monSuperMotDePasse"` en dur dans un job.  
Mais soyons honnêtes : Base64 reste du **masquage**, pas un vrai chiffrement.

Dans cet article, on passe au **niveau 2** :

➡️ On garde la même logique (routine + clé externe + contextes chiffrés)  
➡️ Mais on remplace le cœur du système par un vrai algorithme : **AES**  

Objectif :  
> **Protéger sérieusement les mots de passe sensibles (prod, comptes privilégiés, API critiques) sans complexité inutile.**

---

## 1. Limites du “chiffrement” Base64

Base64 n’est pas un algorithme de chiffrement, c’est **un encodage**.  
En clair :

- c’est réversible sans clé,  
- il existe des outils partout pour le décoder,  
- un attaquant un minimum curieux retrouvera le mot de passe en quelques secondes.

La version “Base64 + petite logique autour” a un intérêt :

- éviter d’afficher les mots de passe en clair dans les `.item`,  
- limiter les fuites bêtes (copier-coller, captures d’écran, etc.),  
- faire un premier pas vers une hygiène minimale.

Mais dès qu’on parle de :

- **bases de données de production**,  
- **comptes techniques critiques**,  
- **API exposées sur Internet**,  

➡️ **Ce n’est plus suffisant.**

---

## 2. Principe de la solution Niveau 2 : AES + clé externe

On garde l’architecture simple :

1. Une **routine Java** `Chiffrement` dans Talend/Talaxie  
2. Une **clé de chiffrement** gérée **hors du projet** (fichier, variable d’environnement, scheduler…)  
3. Des **contextes** qui stockent **uniquement la version chiffrée** des mots de passe  
4. Les jobs qui appellent la routine pour **déchiffrer à la volée** au moment de l’exécution

La seule différence majeure par rapport au niveau 1 :  
👉 **l’intérieur de la routine** passe à **AES/GCM**, un chiffrement moderne et robuste.

---

## 3. Nouvelle routine `Chiffrement` avec AES

Voici un exemple complet de routine basée sur **AES/GCM** (chiffrement symétrique moderne) :

```java
package routines;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;

public class Chiffrement {

    // AES-GCM paramètres
    private static final String ALGO = "AES";
    private static final String TRANSFORMATION = "AES/GCM/NoPadding";
    private static final int KEY_SIZE_BYTES = 16;      // 128 bits
    private static final int GCM_TAG_LENGTH = 128;     // en bits
    private static final int IV_LENGTH_BYTES = 12;     // 96 bits recommandé pour GCM

    /**
     * Dérive une clé AES 128 bits à partir de la clé passée en paramètre
     * (hash SHA-256, puis on garde les 16 premiers octets).
     */
    private static SecretKeySpec deriveKey(String key) throws Exception {
        MessageDigest sha = MessageDigest.getInstance("SHA-256");
        byte[] keyBytes = sha.digest(key.getBytes(StandardCharsets.UTF_8));

        byte[] aesKey = new byte[KEY_SIZE_BYTES];
        System.arraycopy(keyBytes, 0, aesKey, 0, KEY_SIZE_BYTES);

        return new SecretKeySpec(aesKey, ALGO);
    }

    public static String chiffrement(String str, String key) {

        try {
            if (key == null || key.length() < 8) {
                System.err.println("Longueur de clé trop petite (8 caractères minimum recommandé)");
                return null;
            }

            if (Relational.ISNULL(str) || str.equals("")) {
                System.err.println("La chaîne à chiffrer est vide, impossible de chiffrer");
                return null;
            }

            SecretKeySpec secretKey = deriveKey(key);

            // IV aléatoire
            byte[] iv = new byte[IV_LENGTH_BYTES];
            SecureRandom random = new SecureRandom();
            random.nextBytes(iv);

            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            GCMParameterSpec spec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, spec);

            byte[] cipherText = cipher.doFinal(str.getBytes(StandardCharsets.UTF_8));

            // On concatène IV + ciphertext et on encode le tout en Base64 pour stockage
            byte[] combined = new byte[IV_LENGTH_BYTES + cipherText.length];
            System.arraycopy(iv, 0, combined, 0, IV_LENGTH_BYTES);
            System.arraycopy(cipherText, 0, combined, IV_LENGTH_BYTES, cipherText.length);

            return Base64.getEncoder().encodeToString(combined);

        } catch (Exception e) {
            System.err.println("Erreur lors du chiffrement AES : " + e.getMessage());
            return null;
        }
    }

    public static String dechiffrement(String encstr, String key) {

        try {
            if (Relational.ISNULL(encstr) || encstr.equals("")) {
                System.err.println("La chaîne à déchiffrer est vide, impossible de poursuivre le traitement");
                return null;
            }

            if (key == null || key.length() < 8) {
                System.err.println("Longueur de clé trop petite (8 caractères minimum recommandé)");
                return null;
            }

            SecretKeySpec secretKey = deriveKey(key);

            byte[] combined = Base64.getDecoder().decode(encstr);

            if (combined.length <= IV_LENGTH_BYTES) {
                System.err.println("Données chiffrées invalides (taille insuffisante)");
                return null;
            }

            // On récupère IV + ciphertext
            byte[] iv = new byte[IV_LENGTH_BYTES];
            byte[] cipherText = new byte[combined.length - IV_LENGTH_BYTES];

            System.arraycopy(combined, 0, iv, 0, IV_LENGTH_BYTES);
            System.arraycopy(combined, IV_LENGTH_BYTES, cipherText, 0, cipherText.length);

            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            GCMParameterSpec spec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.DECRYPT_MODE, secretKey, spec);

            byte[] plainText = cipher.doFinal(cipherText);

            return new String(plainText, StandardCharsets.UTF_8);

        } catch (Exception e) {
            System.err.println("Erreur lors du déchiffrement AES : " + e.getMessage());
            return null;
        }
    }
}
```

⚠️ Disclaimer important

Cette routine illustre une implémentation AES simple et pragmatique pour Talend/Talaxie.
En contexte fortement réglementé (banque, défense, santé…), rapprochez-vous de vos équipes sécurité pour valider les paramètres (taille de clé, gestion du sel, rotation, etc.).

---


4. Continuer à utiliser vos jobs sans tout casser

La force de cette approche :
➡️ On garde la même interface côté jobs Talend/Talaxie.

Dans vos composants ou tJava, vous continuez d’appeler :
Chiffrement.chiffrement("MonMotDePasse", context.SECRET_KEY);
Chiffrement.dechiffrement(context.DB_PASSWORD, context.SECRET_KEY);

Vous changez uniquement :

l’implémentation interne de la routine,

la manière dont vous générez les nouveaux mots de passe chiffrés.

⚠️ Attention :
Les anciens mots de passe “chiffrés” avec la première méthode (Base64) ne seront plus déchiffrables avec cette nouvelle version. Il faut :

conserver temporairement l’ancienne routine,

déchiffrer vos anciens secrets,

les rechiffrer avec la nouvelle routine AES,

remplacer les valeurs dans vos contextes / fichiers.


5. Gestion de la clé : là où tout se joue

Le chiffrement AES ne vaut que si la clé est bien gérée.

Bonnes pratiques mininum :

Ne jamais stocker la clé dans Talend/Talaxie (ni contexte, ni routine, ni .item)

La placer dans :

un fichier externe non versionné (monté sur le serveur d’exec),

ou une variable d’environnement,

ou un paramètre d’exécution via votre scheduler.

Documenter au minimum :

où est stockée la clé,

qui peut y accéder,

comment la changer (rotation).


6. Un mini job Talend pour illustrer (à créer chez vous)

Pour accompagner cette routine, je vous recommande de créer un petit job utilitaire :

Job : demo_encrypt_decrypt_AES

tFixedFlowInput

colonne : password_clair

exemple : MonMotDePasseSuperSecret

tJavaRow (chiffrement)

utilise Chiffrement.chiffrement(row1.password_clair, context.SECRET_KEY)

écrit la sortie dans password_chiffre

tLogRow → affiche le mot de passe chiffré (à copier/coller dans vos contextes)

Un autre tJavaRow derrière (optionnel) pour tester :

Chiffrement.dechiffrement(row2.password_chiffre, context.SECRET_KEY)

Ce job te permet de :

générer facilement des secrets chiffrés,

tester que ta clé est bien prise en compte,

vérifier que le mot de passe n’apparaît jamais en clair dans les .item ou logs.


7. Quand utiliser AES plutôt que le simple “masquage” ?

Utilisez AES (niveau 2) dès que :

vous touchez un environnement de recette proche de la prod,

vous manipulez des données sensibles ou réglementées,

vous avez des accès BDD prod, API critiques, comptes techniques puissants,

vous travaillez pour un client qui a une équipe sécurité (DSI/SecOps).

Le niveau 1 (Base64) peut rester acceptable pour :

vos environnements de dev perso,

des proof of concept,

des démos locales sans données sensibles.


Conclusion

Passer de Base64 à AES dans Talend/Talaxie ne veut pas dire “tout réécrire” :

vous gardez la même approche (routine + clé externe),

vous ne touchez presque pas à vos jobs,

vous changez uniquement le cœur cryptographique.

Résultat :

✅ des mots de passe réellement protégés

✅ une solution compatible avec un contexte freelance

✅ une logique facilement explicable à vos clients

✅ Checklist : passer au Niveau 2 (AES)
Étape	Action	Statut
1	Ajouter la nouvelle routine Chiffrement avec AES	☐
2	Mettre en place la gestion de la clé hors Talend	☐
3	Créer un mini job de chiffrement/déchiffrement AES	☐
4	Rechiffrer tous les anciens secrets (Base64)	☐
5	Mettre à jour les contextes avec les nouveaux secrets	☐
6	Tester tous les jobs sensibles (BDD, API, FTP…)	☐
7	Vérifier logs et .item (aucun mot de passe en clair)	☐
8	Documenter la procédure et l’emplacement de la clé	☐