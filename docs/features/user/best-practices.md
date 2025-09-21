# Bonnes pratiques - Gestion du profil utilisateur
## Objectif
Garantir une **sécurité maximale**, une **expérience cohérente** et une **intégrité des données** lors des opérations utilisateur (`GET`, `PUT`, `DELETE`) sur leur propre profil (`/user/@me`).

> Toutes les actions doivent être limitées à l'utilisateur authentifié, validées côté serveur, et sécurisées contre les manipulations externes.

## Architecture & Design
* Respect strict du **pattern `controller → service → model`**
  * Le controller gère les routes, le service encapsule la logique métier, le modèle interagit avec la base de données.
* Middlewares obligatoires :
  * `isAuth` → vérifie l'authentification via token.
  * `checkPermission(Permissions.UserXXXOwn)` → autorisation par rôle/action.

## Validation & Sécurité des données
### Données manipulables par l'utilisateur :
| Champ      | Validation                | Remarques                                          |
| ---------- | ------------------------- | -------------------------------------------------- |
| `name`     | `string` ≤ 15             | Nettoyage + limite de longueur                     |
| `pseudo`   | `string` ≤ 15             | Unicité possible à vérifier en BDD                 |
| `email`    | format email valide       | Utilisation de `email-validator` + unicité BDD     |
| `password` | min sécurité (via bcrypt) | Mot de passe actuel requis pour toute modification |

### Règles fondamentales :
* ⚠️ **Ne jamais accepter un `id` client** pour `/user/@me` → toujours utiliser `req.user.id`.
* Validation stricte côté serveur via les services.
* Refus immédiat si :
  * L'email est déjà utilisé.
  * Le mot de passe est invalide.
  * Le compte est supprimé (soft delete).
* Utilisation de `compare` et `hashSync` pour les mots de passe (`bcryptjs`).
* Aucun champ sensible (`password`, `authKey`, etc.) n'est jamais retourné.

## Sécurité
* Le token JWT-like généré par `User.generateToken` :
  * Chiffré avec `HMAC` + `SIGNEDTOKENSECRET` (env).
  * Format : `[payload].[timestamp].[signature]`.
  * Décodé avec `User.decodeToken`.
  * Validité contrôlée via `process.env.VALIDTIMETOKEN`.
* Refus des accès si :
  * Le token est expiré ou falsifié.
  * Le compte est marqué comme supprimé (`deletedAt` non nul).
* 📦 Centralisation des erreurs via `ResponseException` → évite la fuite d'infos sensibles (`handleDBError`, `handleOnlyDataCore`).



## Points de vigilance
| Risque                                  | Problème                      | Solution appliquée                                            |
| --------------------------------------- | ----------------------------- | ------------------------------------------------------------- |
| ⚠️ Accès à un autre compte              | Envoi d'un ID arbitraire      | `req.user.id` toujours utilisé                                |
| ⚠️ Injections ou XSS                    | `name`, `pseudo` non nettoyés | Nettoyage, validation longueur, unicité pseudo                |
| ⚠️ Email invalide / doublon             | Erreurs envoi + collision     | `email-validator` + vérification en BDD                       |
| ⚠️ Modification email sans mot de passe | Risque usurpation             | Vérification de `password` en clair côté service              |
| ⚠️ Mot de passe trop faible             | Failles de sécurité           | Hash en `bcrypt` + changement via ancien mot de passe         |
| ⚠️ Suppression accidentelle             | Action irréversible           | Double confirmation côté front + `isAuth` + `checkPermission` |
| ⚠️ Token invalide                       | Mauvais format / signature    | Rejet systématique via `decodeToken`                          |

## Optimisation & performance
* ✅ Requête unique DB pour `read` / `update`.
* ✅ Sélection uniquement des champs nécessaires :
  ```ts
  id, name, pseudo, email, role, avatar
  ```
* ✅ Utilisation de `softDelete` pour la suppression (`deletedAt`).
* ✅ Restauration possible via `RecoveryById`.

## Helpers et raccourcis utilisés
| Fonction / Helper                         | Description                                    |
| ----------------------------------------- | ---------------------------------------------- |
| `checkPermission(Permissions.UserXXXOwn)` | Contrôle fin des autorisations par action      |
| `User.findById`, `User.updateById`        | Accès typé et sécurisé aux données utilisateur |
| `User.loginById`                          | Récupération sécurisée du mot de passe hashé   |
| `User.softDeleteById` / `RecoveryById`    | Suppression/restauration logique               |
| `handleOnlyDataCore`, `handleDBError`     | Centralisation des erreurs dans les services   |

## 📁 Références
* [📄 specification.md](./specification.md)
* [📄 endpoints.md](./endpoints.md)
* [📄 data-model.md](./data-model.md)
* [🔐 OWASP Cheat Sheet](https://cheatsheetseries.owasp.org)