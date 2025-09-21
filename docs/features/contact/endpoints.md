# Endpoints - Contact
## Vue d'ensemble
> Ces endpoints permettent la soumission d'un formulaire de contact. Les données sont validées côté serveur et envoyées via un webhook Discord.
* **Auth requise** : voir colonne dédiée pour chaque endpoint
* **Format des réponses** : JSON

## Tableau des endpoints
| Méthode | URL             | Auth requise | Query Params | Body                                                                                                         | Réponse (200)                     | Codes d'erreur |
| ------- | --------------- | ------------ | ------------ | ------------------------------------------------------------------------------------------------------------ | --------------------------------- | -------------- |
| POST    | `/contact/form` | Non          | -            | `{ "email": "string", "firstName": "string", "lastName": "string", "message": "string", "isChecked": true }` | `{ "message": "Message envoyé" }` | 400, 422       |

## Détails par endpoint
### POST `/contact/form`
* **Description** : Soumet un message de contact. Les champs sont validés avant l'envoi via un webhook Discord.
* **Auth requise** : Non
* **Headers spécifiques** :
  * `Content-Type: application/json`
* **Body** :
```json
{
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "message": "Bonjour, j'ai une question sur vos services.",
  "isChecked": true
}
```

* **Réponse 200** :
```json
{
  "message": "Message envoyé"
}
```

* **Codes d'erreur** :
  * 400 - Paramètre requis manquant ou invalide
  * 422 - Email ou message au format invalide

## Notes & références
* **Liens internes** :
  * [specification.md](./specification.md)
  * [data-model.md](./data-model.md)