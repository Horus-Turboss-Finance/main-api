# Endpoints - Kiff Score de l'utilisateur
## Vue d'ensemble
> Cet endpoint permet à un utilisateur authentifié de consulter son **Kiff Score**, un indicateur synthétique de bien-être financier calculé à partir de ses comptes bancaires et transactions.
* **Base URL** : `/user`
* **Auth requise** : Oui (token JWT signé)
* **Permissions requises** : `Permissions.UserViewOwn`
* **Format des réponses** : JSON

## Tableau des endpoints
| Méthode | URL               | Auth | Body | Réponse 200                     | Codes d'erreur |
| ------- | ----------------- | ---- | ---- | ------------------------------- | -------------- |
| GET     | `/@me/kiff-score` | Oui  | -    | `{"data": { ...kiffScore... }}` | 401, 404       |

## Détails par endpoint
### GET `/user/@me/kiff-score`
* **Description** : Calcule et retourne le **Kiff Score** de l'utilisateur connecté. Le Kiff Score est un indicateur entre `0` (situation critique) et `1` (confort financier optimal), basé sur une analyse mensuelle et annuelle de ses revenus, dépenses, épargne et habitudes de consommation.

* **Auth requise** : Oui
* **Headers spécifiques** :
  * `Authorization: Bearer <token>`

* **Réponse 200** :
```json
{
  "data": {
    "mode": "normal",
    "nb_personne_foyer": 2,
    "BVM": 600,
    "budget_mensuel_restant": 415.87,
    "kiff_brut_mensuel": 0.72,
    "budget_annuel": 19800,
    "kiff_brut_annuel": 0.85,
    "kiff_brut": 0.72,
    "reserve_liquide": 1200,
    "coussin": 0.45,
    "kiff_ajuste": 0.9,
    "mois_survie": 2.1,
    "score_stabilite": 0.87,
    "mood": "stable",
    "details": {
      "charge_annuelle": 7000,
      "projet_pondere": 1200,
      "revenu_annuel": 28000,
      "moyenne_depenses_journalier": 42.3
    }
  }
}
```

* **Codes d'erreur** :
  * 401 - Utilisateur non authentifié
  * 404 - Données de l’utilisateur non disponibles (aucun compte ou transaction)

## Notes techniques
* **BVM (Budget de Vie Minimum)** : base de dépenses minimales recommandées pour un adulte (par défaut 300€/mois/personne), ajustée selon le foyer.
* **Réserve liquide** : somme des soldes des comptes bancaires courants (hors placements).
* **Coussin** : indicateur de sécurité financière, calculé sur la base des réserves vs dépenses annuelles.
* **Kiff Score brut** :
  * `mensuel` : basé sur le mois en cours (revenus, dépenses, reste à vivre)
  * `annuel` : basé sur l’année glissante
  * **Le score final brut est le minimum des deux**, pour refléter la prudence.
* **Ajustement du Kiff Score** : un coussin de sécurité augmente légèrement le score (max +0.5 en mode données faibles, +1 en mode normal).
* **Modes de calcul** :
  * `normal` : suffisamment de données (≥10 transactions récentes sur ≥2 mois)
  * `low-data` : ajustements prudents appliqués si peu de données ou cas aberrant détecté
* **Stabilité & humeur** :
  * L’algorithme évalue la régularité des dépenses pour détecter la **stabilité financière**
  * Retourne une **mood** (`"stable"`, `"fragile"`, `"précaire"`) en fonction des mois de survie simulés

## Exemple d'utilisation
**Requête** :
```http
GET /user/@me/kiff-score?nb_personne_foyer=2 HTTP/1.1
Authorization: Bearer eyJhbGciOi...
```

**Réponse** :
```json
{
  "data": {
    "mode": "normal",
    "kiff_ajuste": 0.91,
    "mood": "stable",
//    ...
    "details": {
      "revenu_annuel": 32000,
      "charge_annuelle": 8000,
      "moyenne_depenses_journalier": 35.2
    }
  }
}
```

## Sécurité & performances
* **Middleware requis** :
  * `isAuth`
  * `checkPermission(Permissions.UserViewOwn)`
* **Sources de données** :
  * `BankAccount.findAllByUserId()`
  * `Transaction.findAllByUserId()`
* **Fallbacks sécurisés** :
  * En cas de faible volume de données ou de dépenses aberrantes, l’algorithme adopte une stratégie **ultra-conservatrice** pour éviter de surévaluer la santé financière.
* **Évolutivité** :
  * Un **mode pré-calculé** est envisagé pour les utilisateurs actifs (cf. TODO dans le service)
  * L’agrégation pourrait être déplacée vers une **vue matérialisée SQL** pour améliorer les performances