# Endpoints - Authentification Utilisateur
## Vue d'ensemble
> Permet la création de compte, la connexion et la déconnexion. Lors de la connexion, un **token signé** est généré et stocké côté client via cookie `httpOnly`, à utiliser pour les appels aux routes protégées.
* **Base URL** : `/auth`
* **Auth requise** : indiquée pour chaque endpoint ci-dessous
* **Format des réponses** : JSON `{ data: ... }`
* **Validation** : tous les champs (`email`, `password`, `name`) sont strictement validés côté backend.

## Tableau des endpoints
| Méthode | URL        | Auth requise | Query Params | Body                                                            | Réponse (200)                          | Codes d'erreur |
| ------: | ---------- | ------------ | --------------------------------------------------------------- | ------------------------------------------ | -------------- |
| POST    | `/signup`  | Non          | -            | `{ "name": "string", "email": "string", "password": "string" }` | `{ "data": "Utilisateur créé" }`       | 400, 401 |
| POST    | `/signin`  | Non          | -            | `{ "email": "string", "password": "string" }`                   | `{ "data": "data.validity.signature" }`    | 400, 401       |
| POST    | `/signout` | Oui          | -            | -                                                               | `{ "data": "Déconnexion réussie" }` | 401            |

## Détails par endpoint
### POST `/signup`
**Créer un nouvel utilisateur.**
* **Auth requise** : Non
* **Headers spécifiques** :
  * `Content-Type: application/json`
* **Body attendu** :
```json
{
  "name": "Jean Marie",
  "email": "jean@example.com",
  "password": "MotDePasseUltraSecure123!"
}
```

* **Traitement backend** :
  * Le nom est limité à 16 caractères.
  * L'email est normalisé et validé.
  * Le mot de passe est hashé avec `bcrypt` (coût 10).
  * Un avatar par défaut est assigné (`https://cashsight.fr/logo.png`).
  * En cas de doublon (`email` ou `name`), un code 400 est retourné.

* **Réponse 200** :
```json
{
  "data": "Utilisateur créé"
}
```

* **Codes d'erreur** :
  * `400` - Champs manquants ou invalides, ou email/nom déjà utilisé.

### POST `/signin`
**Authentifie l'utilisateur et génère un token sécurisé.**
* **Auth requise** : Non
* **Headers spécifiques** :
  * `Content-Type: application/json`
* **Body attendu** :
```json
{
  "email": "jean@example.com",
  "password": "MotDePasseUltraSecure123!"
}
```

* **Traitement backend** :
  * Email validé et normalisé.
  * Mot de passe comparé via `bcrypt.compare`.
  * En cas de succès, un **token signé** est généré (`HMAC SHA-256`) et stocké côté client dans un **cookie sécurisé** (`httpOnly`, `secure`, `sameSite=strict`).
  * Le token est également renvoyé dans le corps de la réponse.

* **Réponse 200** :
```json
{
  "data": "data.validity.SignatureHMAC"
}
```

* **Codes d'erreur** :
  * `400` - Champs invalides
  * `401` - Mot de passe incorrect ou utilisateur inexistant

### POST `/signout`
**Déconnecte l'utilisateur.**
* **Auth requise** : ✅ Oui (via cookie `token`)

* **Headers** :
  * Pas de header spécifique requis, le `token` est attendu dans le cookie `httpOnly` généré à la connexion.

* **Traitement backend** :
  * Le cookie contenant le token est supprimé via `res.clearCookie("token")`.

* **Réponse 200** :
```json
{
  "data": "Déconnexion réussie"
}
```

* **Codes d'erreur** :
  * `401` - Si aucun token valide n'est fourni ou si l'utilisateur n'est pas connecté

## Points importants
* Le token est :
  * Signé avec `HMAC SHA-256` + clé secrète (`SIGNEDTOKENSECRET`)
  * Limité dans le temps
  * Stocké côté client uniquement dans un **cookie sécurisé**

* Tous les champs d'entrée sont strictement validés (ex: taille du nom, format email...).
* Aucun mot de passe ou token n'est jamais loggé.
* En cas d'erreur, les messages sont standardisés via `ResponseException`.


## Notes & références
* [📄 specification.md](./specification.md)
* [🔒 OWASP Auth Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)