# Endpoints - metrics
## Vue d'ensemble
> Les endpoints de cette feature exposent les métriques Prometheus permettant de monitorer la performance et la santé du service.
* **Base URL** : `/metrics`
* **Auth requise** : Non
* **Format des réponses** : JSON

## Tableau des endpoints
| Méthode | URL        | Auth requise | Query Params | Body | Réponse (200)                       | Codes d'erreur |
| ------- | ---------- | ------------ | ------------ | ---- | ----------------------------------- | -------------- |
| GET     | `/metrics` | Non          | -            | -    | Liste des métriques Prometheus JSON | 500            |

## Détails par endpoint
### GET `/metrics`
* **Description** :
  Expose les métriques collectées au format JSON, compatibles avec Prometheus, incluant notamment l'histogramme des durées de requêtes HTTP.
* **Auth requise** : Non
* **Headers spécifiques** :
  * `Accept: application/json`
* **Query Params** : Aucun
* **Body** : Aucun
* **Réponse 200** :
```json
{
  "status": 200,
  "data": [
    {
      "name": "http_request_duration_ms",
      "help": "Durée des requêtes HTTP en ms",
      "type": "histogram",
      "values": [...],
      "labels": {
        "method": "GET",
        "route": "/metrics",
        "status_code": "200"
      }
    },
    ...
  ]
}
```
* **Codes d'erreur** :
  * 500 - Erreur interne lors de la récupération des métriques

## Notes & références
* **Liens internes** :
  * [specification.md](./specification.md)
  * [data-model.md](./data-model.md)