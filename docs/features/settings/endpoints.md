# Endpoints - Settings
## Vue d'ensemble
> Ces endpoints permettent à un utilisateur de gérer ses **comptes bancaires** et **catégories de transactions**.
* **Exemple** : Création, modification, suppression et consultation des comptes bancaires et des catégories de dépenses.
* **Base URL** : `/settings`
* **Auth requise** : Toutes les routes nécessitent une authentification par token Cookie.
* **Format des réponses** : JSON

> [!IMPORTANT] 
> Les icônes (`icon`) ont des valeurs limitées définies dans les fichiers de typage.

> [!TIP]
> Typage des icônes de comptes : [`@types.bankAccount.ts`](../../../src/types/@types.bankAccount.ts)
> Typage des icônes de catégories : [`@types.transactionCategoryIcon.ts`](../../../src/types/@types.transactionCategoryIcons.ts)

## Tableau des endpoints
| Méthode | URL               | Body requis | Réponse 200                         | Codes d'erreur |
| ------- | ----------------- | ----------- | ----------------------------------- | -------------- |
| GET     | `/accounts`       | Non         | Liste des comptes bancaires         | 401, 404       |
| POST    | `/accounts`       | Oui         | Message de succès                   | 400, 401       |
| PUT     | `/accounts/:id`   | Oui         | Données du compte mis à jour        | 400, 401, 404  |
| DELETE  | `/accounts/:id`   | Non         | Message de suppression              | 400, 401, 404  |
| GET     | `/categories`     | Non         | Liste des catégories                | 401, 404       |
| POST    | `/categories`     | Oui         | Message de succès                   | 400, 401       |
| PUT     | `/categories/:id` | Oui         | Données de la catégorie mise à jour | 400, 401, 404  |
| DELETE  | `/categories/:id` | Non         | Message de suppression              | 400, 401, 404  |

## Détails par endpoint
### GET `/accounts`
* **Description** : Récupère la liste des comptes bancaires de l'utilisateur.
* **Réponse** :
```json
{
  "data": [{
    "id":1,
    "id_user":1,
    "label": "Compte Courant",
    "type": "checking",
    "balance": 1500.50,
    "icon": "TRADE_REPUBLIC"
  }]
}
```

### POST `/accounts`
* **Description** : Crée un nouveau compte bancaire pour l'utilisateur.
* **Body** :
```json
{
  "label": "Compte Courant",
  "type": "checking",
  "balance": 1000,
  "icon": "TRADE_REPUBLIC"
}
```
* **Réponse** :
```json
{
  "data": "Compte bancaire enregistré avec succès"
}
```

### PUT `/accounts/:id`
* **Description** : Met à jour un compte existant.
* **Body (au moins un champ requis)** :
```json
{
  "label": "Compte Épargne",
  "balance": 2000.75
}
```
* **Réponse** :
```json
{
  "data": {
    "id":1,
    "id_user":1,
    "label": "Compte Épargne",
    "type": "checking",
    "balance": 2000.75,
    "icon": "TRADE_REPUBLIC"
  }
}
```

### DELETE `/accounts/:id`
* **Description** : Supprime un compte s'il n'est pas lié à des transactions.
* **Réponse** :
```json
{
  "data": "Compte bancaire supprimé avec succès"
}
```

> [!WARNING]
> Si des transactions sont associées au compte, la suppression échouera avec une erreur 400.

### GET `/categories`
* **Description** : Récupère toutes les catégories de transactions de l'utilisateur.
* **Réponse** :
```json
{
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "name": "Alimentation",
      "icon": "MedicalIcon",
      "type": 1,
      "base_category": "FOOD"
    }
  ]
}
```

### POST `/categories`
* **Description** : Crée une catégorie personnalisée.
* **Body** :
```json
{
  "name": "Alimentation",
  "icon": "MedicalIcon",
  "type": 1,
  "base": "FOOD"
}
```

> `type` : `1` pour **Dépense**, `2` pour **Revenu**
> `base` : clé de la catégorie de base (optionnelle pour héritage/structure)

* **Réponse** :
```json
{
  "data": "Catégorie de dépense enregistrée avec succès"
}
```

### PUT `/categories/:id`
* **Description** : Met à jour une catégorie existante.
* **Body (au moins un champ requis)** :
```json
{
  "name": "Courses",
  "icon": "ShoppingCart"
}
```
* **Réponse** :
```json
{
  "data": {
    "id": 1,
    "user_id": 1,
    "name": "Courses",
    "icon": "ShoppingCart",
    "type": 1,
    "base_category": "FOOD"
  }
}
```

### DELETE `/categories/:id`
* **Description** : Supprime une catégorie si aucune transaction n'y est liée.
* **Réponse** :
```json
{
  "data": "Catégorie de dépense supprimée avec succès"
}
```

> [!WARNING]
> Une catégorie liée à des transactions ne peut pas être supprimée (erreur 400).

## Codes d'erreur communs
| Code | Description                                             |
| ---- | ------------------------------------------------------- |
| 400  | Paramètres invalides ou contrainte métier non respectée |
| 401  | Utilisateur non authentifié                             |
| 404  | Ressource non trouvée (compte ou catégorie inexistante) |

## Notes & références
* **Liens internes** :
  * [specification.md](./specification.md)
  * [data-model.md](./data-model.md)