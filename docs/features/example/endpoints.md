# Endpoints - [Nom de la fonctionnalité]
## Vue d'ensemble
> Brève description de la logique globale des endpoints.
- **Exemple** : Les endpoints de cette feature gèrent l'authentification par email/mot de passe et la génération de token JWT.
- **Base URL** : `/api/v1` *(modifier si nécessaire)*
- **Auth requise** : voir colonne dédiée pour chaque endpoint
- **Format des réponses** : JSON
## Tableau des endpoints
| Méthode | URL | Auth requise | Query Params | Body | Réponse (200) | Codes d'erreur |
|---------|-----|--------------|--------------|------|---------------|----------------|
| POST | `/auth/login` | Non | - | `{ "email": "string", "password": "string" }` | `{ "token": "string", "expiresIn": 900 }` | 400, 401, 422 |
| POST | `/auth/logout` | Oui | - | - | `{ "message": "Déconnecté" }` | 401 |
| GET  | `/auth/me` | Oui | - | - | `{ "id": 1, "email": "user@example.com" }` | 401 |
## Détails par endpoint
### POST `/auth/login`
- **Description** : Authentifie un utilisateur et retourne un token JWT.
- **Auth requise** : Non
- **Headers spécifiques** :  
  - `Content-Type: application/json`
- **Body** :
```json
{
  "email": "user@example.com",
  "password": "MyP@ssw0rd"
}
````
* **Réponse 200** :
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "expiresIn": 900
}
```
* **Codes d'erreur** :
  * 400 - Paramètres manquants
  * 401 - Identifiants invalides
  * 422 - Format email invalide
### POST `/auth/logout`
* **Description** : Invalide le token courant.
* **Auth requise** : Oui (Bearer token)
* **Réponse 200** :
```json
{
  "message": "Déconnecté"
}
```
## Notes & références
* **Collection Postman** : \[Lien ici]
* **Spécification OpenAPI** : \[Lien Swagger/OpenAPI]
* **Liens internes** :
  * [specification.md](./specification.md)
  * [data-model.md](./data-model.md)