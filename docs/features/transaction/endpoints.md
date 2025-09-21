# Endpoints - Transactions
## Vue d'ensemble
> Les endpoints de la fonctionnalité **Transactions** permettent à un utilisateur authentifié de consulter, créer, modifier ou supprimer ses transactions financières.
* **Auth requise** : Oui (`JWT Bearer`)
* **Permissions nécessaires** :
  * `TransactionViewOwn` : lecture
  * `TransactionCreateOwn` : création
  * `TransactionUpdateOwn` : mise à jour
  * `TransactionDeleteOwn` : suppression
* **Format des réponses** : JSON

## Tableau des endpoints
| Méthode | URL                | Auth | Query Params                  | Body (résumé)                                    | Réponse 200 (résumé)           | Erreurs possibles  |
| ------- | ------------------ | ---- | ----------------------------- | ------------------------------------------------ | ------------------------------ | ------------------ |

| GET     | `/transaction`     | ✅    | `limit` (int), `offset` (int) | -                                                | Liste paginée des transactions | 401, 403           |
| GET     | `/transaction/:id` | ✅    | -                             | -                                                | Détails d'une transaction      | 401, 403, 404      |
| POST    | `/transaction`     | ✅    | -                             | `bankId`, `categoryId`, `amount`, `type`, `...`  | Transaction créée              | 400, 401, 403      |
| PUT     | `/transaction/:id` | ✅    | -                             | Au moins un champ parmi `amount`, `status`, etc. | Transaction mise à jour        | 400, 401, 403, 404 |
| DELETE  | `/transaction/:id` | ✅    | -                             | -                                                | Confirmation de suppression    | 401, 403, 404      |


## Détails par endpoint
### GET `/transaction`
**Description** : Récupère les transactions récentes de l'utilisateur connecté avec pagination.
* **Permissions requises** : `TransactionViewOwn`
* **Query Params** :
  * `limit` *(int)* : nombre max de résultats, défaut `50`, max `150`
  * `offset` *(int)* : index de départ, défaut `0`
* **Réponse 200** :
```json
{
  "data": [
    {
      "id": 1,
      "bankId": 2,
      "categoryId": 5,
      "amount": 120.5,
      "type": "debit",
      "status": "completed",
      "date": "2025-08-18T10:00:00Z",
      "description": "Courses",
      "baseCategory": "Food"
    }
  ]
}
```

### GET `/transaction/:id`
**Description** : Récupère une transaction spécifique appartenant à l'utilisateur.
* **Permissions requises** : `TransactionViewOwn`
* **Réponse 200** :
```json
{
  "data": {
    "id": 1,
    "bankId": 2,
    "categoryId": 5,
    "amount": 120.5,
    "type": "debit",
    "status": "completed",
    "date": "2025-08-18T10:00:00Z",
    "description": "Courses",
    "baseCategory": "Food"
  }
}
```

### POST `/transaction`
**Description** : Crée une nouvelle transaction (crédit ou débit).
* **Permissions requises** : `TransactionCreateOwn`
* **Champs requis** :
  * `type`: `"debit"` ou `"credit"`
  * `amount`: nombre > 0 (en euros, ex: `19.99`)
* **Champs facultatifs** :
  * `bankId`: ID d'un compte bancaire existant appartenant à l'utilisateur
  * `categoryId`: ID d'une catégorie personnalisée
  * `baseCategory`: chaîne pour classification automatique
  * `status`: `"pending"`, `"completed"` (par défaut), `"failed"`
  * `date`: ISO8601 (par défaut : `now`)
  * `description`: texte libre

* **Body** :
```json
{
  "bankId": 2,
  "categoryId": 5,
  "amount": 120.5,
  "type": "debit",
  "status": "completed",
  "date": "2025-08-18T10:00:00Z",
  "description": "Courses",
  "baseCategory": "Food"
}
```
* **Réponse 200** :
```json
{
  "data": {
    "id": 42,
    "bankId": 2,
    "categoryId": 5,
    "amount": 120.5,
    "type": "debit",
    "status": "completed",
    "date": "2025-08-18T10:00:00Z",
    "description": "Courses",
    "baseCategory": "Food"
  }
}
```
**Effets de bord** :
Si `bankId` est fourni, le solde du compte est mis à jour selon :
* Crédit → `+amount`
* Débit → `-amount`

### PUT `/transaction/:id`
**Description** : Met à jour une transaction existante.
* **Permissions requises** : `TransactionUpdateOwn`
* **Conditions** :
  * Au moins un champ doit être fourni
  * Seuls les champs suivants peuvent être mis à jour : `amount`, `status`, `date`, `description`, `bankId`, `categoryId`, `baseCategory`
  * La mise à jour modifie le solde du compte bancaire si applicable
* **Body** (exemple partiel) :
```json
{
  "amount": 150,
  "status": "pending",
  "description": "Correction"
}
```
* **Réponse 200** :
```json
{
  "data":{
    "id": 42,
    "bankId": 2,
    "categoryId": 5,
    "amount": 150,
    "type": "debit",
    "status": "pending",
    "date": "2025-08-18T10:00:00Z",
    "description": "Courses",
    "baseCategory": "Food"
  }
}
```
**Effets de bord** :
* En cas de modification du `amount` ou du `bankId`, les soldes sont recalculés dynamiquement (voir logique métier dans `updateTransaction`).
* La logique prend en compte les différences d'anciens et nouveaux montants pour corriger le solde de l'ancien et/ou du nouveau compte.

### DELETE `/transaction/:id`
**Description** : Supprime une transaction définitivement.
* **Permissions requises** : `TransactionDeleteOwn`
* **Effets** :
  * Si une transaction est liée à un `bankId`, le solde du compte est ajusté à l'inverse de la transaction supprimée.
* **Réponse 200** :
```json
{
  "data": "Transaction supprimée avec succès"
}
```
## Notes & références
* **Liens internes** :
  * [specification.md](./specification.md)
  * [data-model.md](./data-model.md)