# Use Cases - Authentification
## Vue d'ensemble
Ces cas d'usage décrivent les interactions entre un utilisateur et le système d'authentification. Ils couvrent l'inscription, la connexion et la déconnexion, ainsi que la gestion des erreurs courantes et la protection contre les attaques (brute force, jetons falsifiés, expiration, etc.).

## Cas nominaux (Success path)
### Cas n°1 - Inscription d'un nouvel utilisateur
* **Acteurs** : Utilisateur, API `/auth/signup`, Service `signupCore`, Modèle `User`
* **Préconditions** :
  * Le champ `email` n'est pas déjà enregistré
  * Les champs `name`, `email` et `password` sont valides.
* **Déroulement** :
  1. L'utilisateur envoie une requête POST à `/auth/signup` avec `name`, `email`, `password`.
  2. Le contrôleur valide les champs (`name` ≤ 16 caractères, email syntaxiquement valide, `password` non vide)
  3. Le service `signupCore` chiffre le mot de passe avec bcrypt.
  4. Le modèle `User` insère l'utilisateur avec un rôle par défaut `user`, un `pseudo` égal à `name`, et un avatar par défaut
  5. Un token est généré et renvoyé
* **Résultat attendu** :
  * HTTP 200 avec `{ token: "<JWT maison>" }`
* **Notes** :
  * L'avatar est fixé par défaut à `https://cashsight.fr/logo.png`
  * Les erreurs SQL sont interceptées et transformées en messages métiers

### Cas n°2 - Connexion d'un utilisateur existant
* **Acteurs** : Utilisateur, API `/auth/signin`, Service `signinCore`, Modèle `User`
* **Préconditions** :
  * L'utilisateur est déjà inscrit.
  * Email et mot de passe corrects.
* **Déroulement** :
  1. L'utilisateur envoie une requête POST à `/auth/signin` avec `email`, `password`.
  2. Champs validés (email format et mot de passe non vide)
  3. Le mot de passe hashé stocké est récupéré via `User.login`
  4. Comparaison avec `bcrypt.compare`
  5. En cas de succès, génération d'un token maison (`HMAC SHA-256`)
* **Résultat attendu** :
  * HTTP 200 `{ token: "<JWT maison>" }`
* **Notes** :
  * Le token contient : `email`, `id`, `role`, et un timestamp
  * Jeton généré sous la forme : `base64(data).base64(timestamp).signature`

### Cas n°3 - Déconnexion d'un utilisateur
* **Acteurs** : Utilisateur authentifié, API `/auth/signout`
* **Préconditions** :
  * Le token est fourni via un cookie
* **Déroulement** :
  1. L'utilisateur appelle `/auth/signout` avec un token valide.
  2. Le contrôleur supprime le cookie `token`
  3. Réponse immédiate de succès
* **Résultat attendu** :
  * HTTP 200, `"Utilisateur déconnecté"`.
* **Notes** :
  * Aucune invalidation du token côté base
  * Le cookie est supprimé avec les bons attributs de sécurité (`httpOnly`, `secure`, `sameSite`)

## Cas limites / Erreurs métier
### Cas limite n°1 - Email déjà enregistré
* **Acteurs** : Utilisateur
* **Préconditions** :
  * Le champ `email` existe déjà dans la table `user`.
* **Déroulement** :
  1. L'utilisateur tente un `/auth/signup` avec un email existant.
  2. L'insertion échoue avec l'erreur SQL `ER_DUP_ENTRY`.
  3. Une exception est renvoyée.
* **Résultat attendu** :
  * HTTP 400 ou message `"Email déjà existant"`.
* **Notes** :
  * Le message d'erreur SQL est intercepté dans le modèle `User`.
### Cas limite n°2 - Jeton expiré
* **Acteurs** : Utilisateur authentifié
* **Préconditions** :
  * Le `token` a dépassé la durée définie par `VALIDTIMETOKEN`.
* **Déroulement** :
  1. Une route protégée appelle le middleware `isAuth`.
  2. `User.decodeToken()` calcule la validité.
  3. Si expiré, `ResponseException("Token expiré")` est levée.
* **Résultat attendu** :
  * HTTP 498, `"Token expiré"`.
* **Notes** :
  * Le temps de validité est configurable via les variables d'environnement.
### Cas limite n°3 - Email ou mot de passe invalide
* **Acteurs** : Utilisateur
* **Précondition** :
  * Mauvais `email` ou `password` fourni
* **Déroulement** :
  1. L'utilisateur appelle `/auth/signin` avec de mauvaises infos
  2. L'authentification échoue silencieusement (`bcrypt.compare` → `false`)
  3. Le système retourne une erreur uniforme
* **Résultat attendu** :
  * HTTP 401, `"Email ou mot de passe invalide"`


## Cas de sécurité
### Cas sécurité n°1 - Jeton falsifié
* **Vulnérabilité** : Jeton altéré (modification manuelle du payload)
* **Scénario** :
  1. Un attaquant modifie le payload du jeton.
  2. La signature ne correspond plus à la clé secrète (`SIGNEDTOKENSECRET`).
  3. `User.decodeToken()` lève une exception
* **Mécanisme de défense** :
  * Vérification de la signature avec HMAC SHA-256 et secret `SIGNEDTOKENSECRET`
* **Résultat attendu** :
  * HTTP 403 `"Invalid token"`.

### Cas sécurité n°2 - Bruteforce sur les mots de passe
* **Vulnérabilité** : Tentatives massives sur `/auth/signin`
* **Scénario** :
  1. Un attaquant teste des paires `email/password` en rafale
* **Mécanisme de défense** :
  * **bcrypt** avec salage : ralentit la comparaison
  * **express-rate-limit** : limite à 100 requêtes / 5 minutes / IP
* **Résultat attendu** :
  * HTTP 429 `"Trop de requêtes"` si seuil dépassé

## Spécificités techniques
* **Jeton maison** :
  * Structure : `base64(payload).base64(timestamp).HMAC`
  * Payload encodé : `{ id, email, role }`
  * Vérification de validité = signature + durée
* **Mot de passe** :
  * Hashé avec `bcrypt` (`10 salt rounds`)
* **Rôles** :
  * Rôle par défaut à l'inscription : `"user"`
* **Détection utilisateur supprimé** :
  * `deletedAt` non nul ⇒ soft delete détecté lors du login

## Références
* [endpoints.md](./endpoints.md)
* [specification.md](./specification.md)
* [bcrypt documentation](https://www.npmjs.com/package/bcryptjs)
* [email-validator documentation](https://www.npmjs.com/package/email-validator)