# Endpoints - Gestion du profil utilisateur
## Vue d'ensemble
> Les endpoints de cette feature permettent à un utilisateur authentifié de consulter, modifier et supprimer son propre profil.

* **Base URL** : `/user`
* **Auth requise** : Oui (token signé, contrôle de permissions)
* **Permissions requises** : `Permissions.UserViewOwn`, `Permissions.UserUpdateOwn`, `Permissions.UserDeleteOwn`
* **Format des réponses** : JSON

## Tableau des endpoints
| Méthode | URL               | Auth | Body                                                          | Réponse 200                               | Codes d'erreur |
| ------- | ----------------- | ---- | ------------------------------------------------------------- | ----------------------------------------- | -------------- |
| GET     | `/@me`            | Oui  | -                                                             | `{"data": { ...profil... }}`              | 401, 404       |
| PUT     | `/@me`            | Oui  | `{ "email": "string", "pseudo": "string", "name": "string" }` | `{"data": "Profil modifié"}`              | 400, 401, 404  |
| PUT     | `/@me/email`      | Oui  | `{ "email": "string", "password": "string" }`                 | `{"data": "Email mis à jour"}`            | 400, 401, 404  |
| PUT     | `/@me/credential` | Oui  | `{ "oldPassword": "string", "newPassword": "string" }`        | `{"data": "Mot de passe mis à jour"}`     | 400, 401, 404  |
| DELETE  | `/@me`            | Oui  | -                                                             | `{"data": "Compte supprimé avec succès"}` | 401, 404       |

## Détails par endpoint
### GET `/user/@me`
* **Description** : Récupère les informations du profil de l'utilisateur connecté.
* **Auth requise** : Oui
* **Headers spécifiques** :
  * `Authorization: Bearer <token>`
* **Réponse 200** :
```json
{
  "data": {
    "id": 1,
    "email": "user@example.com",
    "pseudo": "john",
    "name": "John Doe",
    "role": "USER",
    "avatar": "https://exemple.com/avatar.jpg"
  }
}
```
* **Codes d'erreur** :
  * 401 - Utilisateur non authentifié
  * 404 - Utilisateur introuvable

### PUT `/user/@me`
* **Description** : Met à jour les informations de l'utilisateur connecté.
* **Auth requise** : Oui
* **Headers spécifiques** :
  * `Authorization: Bearer <token>`
  * `Content-Type: application/json`
* **Body** :
```json
{
  "pseudo": "nouveauPseudo",
  "name": "Nouveau Nom"
}
```
* **Réponse 200** :
```json
{
  "data": "Profil modifié"
}
```
* **Codes d'erreur** :
  * 400 - Données invalides (pseudo trop long, etc.)
  * 401 - Non authentifié
  * 404 - Utilisateur introuvable

### PUT `/user/@me/email`
* **Description** : Met à jour l'email de l'utilisateur après vérification du mot de passe actuel.
* **Auth requise** : Oui
* **Headers** :
  * `Authorization: Bearer <token>`
  * `Content-Type: application/json`
* **Body** :
```json
{
  "email": "nouvel.email@example.com",
  "password": "motDePasseActuel"
}
```
* **Réponse 200** :
```json
{
  "data": "Email mis à jour"
}
```
* **Codes d'erreur** :
  * 400 - Mot de passe incorrect ou email déjà utilisé
  * 401 - Non authentifié
  * 404 - Utilisateur introuvable

### PUT `/user/@me/credential`
* **Description** : Met à jour le mot de passe de l'utilisateur connecté.
* **Auth requise** : Oui
* **Headers** :
  * `Authorization: Bearer <token>`
  * `Content-Type: application/json`
* **Body** :
```json
{
  "oldPassword": "ancienMotDePasse",
  "newPassword": "nouveauMotDePasse"
}
```
* **Réponse 200** :
```json
{
  "data": "Mot de passe mis à jour"
}
```
* **Codes d'erreur** :
  * 400 - Ancien mot de passe invalide
  * 401 - Non authentifié
  * 404 - Utilisateur introuvable

### DELETE `/user/@me`
* **Description** : Supprime définitivement le compte de l'utilisateur connecté.
* **Auth requise** : Oui
* **Headers spécifiques** :
  * `Authorization: Bearer <token>`
* **Réponse 200** :
```json
{
  "data": "Compte supprimé avec succès"
}
```
* **Codes d'erreur** :
  * 401 - Non authentifié
  * 404 - Utilisateur introuvable

## Notes techniques
* **Filtrage serveur** : Toutes les opérations utilisent `req.user.id` issu du token JWT - aucun ID n'est jamais accepté via le body ou les paramètres.
* **Validation des champs** :
  * `pseudo` et `name` : max 15 caractères.
  * `email` : validation stricte + unicité.
  * `password` : bcrypté en BDD, validé par `compare()` de `bcryptjs`.
* **Permissions vérifiées par middleware** :
  * `checkPermission(Permissions.UserUpdateOwn)` pour les mises à jour.
  * `checkPermission(Permissions.UserDeleteOwn)` pour la suppression.
* **Suppression douce** : `deletedAt` est utilisé, la ligne reste en BDD.

## Références
* [specification.md](./specification.md)
* [data-model.md](./data-model.md)
* [Bonnes pratiques](./guidelines.md)
* [OWASP Auth Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)