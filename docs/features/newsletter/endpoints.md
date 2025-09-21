# Endpoints - Newsletter
## Vue d'ensemble
> Ces endpoints permettent l'inscription à la newsletter et la récupération du nombre d'emails stockés.

* **Auth requise** : voir colonne dédiée
* **Format des réponses** : JSON

## Tableau des endpoints
| Méthode | URL                 | Auth requise | Query Params | Body                    | Réponse (200)                   | Codes d'erreur |
| ------- | ------------------- | ------------ | ------------ | ----------------------- | ------------------------------- | -------------- |
| POST    | `/newsletter/email` | Non          | -            | `{ "email": "string" }` | `{ "message": "Email ajouté" }` | 400, 401, 422  |
| POST    | `/newsletter/size`  | Non          | -            | -                       | `{ "data": 1234 }`              | -              |

## Détails par endpoint
### POST `/newsletter/email`
* **Description** : Enregistre un nouvel email à la newsletter après validation.
* **Auth requise** : Non
* **Headers spécifiques** :
  * `Content-Type: application/json`
* **Body** :
```json
{
  "email": "john.doe@example.com"
}
```
* **Réponse 200** :
```json
{
  "message": "Email ajouté"
}
```
* **Codes d'erreur** :
  * 400 - Email manquant
  * 401 - Email déjà existant
  * 422 - Format email invalide

### POST `/newsletter/size`
* **Description** : Retourne le nombre total d'emails enregistrés dans la base de données.
* **Auth requise** : Non
* **Headers spécifiques** :
  * `Content-Type: application/json`
* **Body** : Aucun
* **Réponse 200** :
```json
{
  "data": 1234
}
```

## Notes & références
* **Liens internes** :
  * [specification.md](./specification.md)
  * [data-model.md](./data-model.md)