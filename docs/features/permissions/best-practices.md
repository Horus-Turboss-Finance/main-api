# Bonnes pratiques - Gestion des permissions et authentification
## Objectif
> Garantir un contrôle d'accès fiable, sécurisé et maintenable en centralisant la gestion des rôles et permissions, et en appliquant des règles strictes de validation des tokens.

## Règles de code spécifiques
| Contrainte                                      | Application concrète                                                                                                                                                         |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Centraliser l'authentification**              | Utiliser systématiquement le middleware `isAuth` pour extraire et valider le token.                                                                                          |
| **Éviter les contrôles manuels de permissions** | Utiliser `checkPermission()` pour vérifier l'accès à une ressource.                                                                                                          |
| **Séparer les responsabilités**                 | Le rôle de chaque module est bien défini :<br>- `PermissionsManager` → droits par rôle<br>- `checkPermission` → middleware<br>- `User.decodeToken()` → validation des tokens |
| **Respecter la configuration centralisée**      | Charger `SIGNEDTOKENSECRET` et `VALIDTIMETOKEN` depuis `process.env`, comme dans `User.decodeToken()`.                                                                       |
| **Utiliser des constantes**                     | Tous les rôles et permissions sont issus des types `RoleType` et `PermissionType` via `@types.roles`. Aucune chaîne en dur.                                                  |

## Points de vigilance
| Risque                               | Explication                                  | Solution                                                            |
| ------------------------------------ | -------------------------------------------- | ------------------------------------------------------------------- |
| **Token falsifié**                              | Jeton modifié par un attaquant → la signature HMAC ne correspond plus | Vérification HMAC SHA-256 dans `User.decodeToken()`                                             |
| **Mauvaise configuration des rôles**     | Accès non prévu ou perte d'accès             | Centraliser dans `PermissionsManager` et valider avant mise en prod |
| **Jeton expiré**                                | Le timestamp dans le token est trop ancien                            | Comparaison avec `VALIDTIMETOKEN` dans `decodeToken`                                            |
| **Rôle inexistant ou mal typé**                 | Vérification des droits impossible ou incorrecte                      | `checkPermission()` utilise `getUserRoleOrThrow()` qui lève une exception si le rôle est absent |
| **Variable d'environnement manquante**          | Jeton invalide par défaut (aucune signature possible)                 | Vérification de `SIGNEDTOKENSECRET` au moment de la génération/décodage                         |
| **Permissions trop larges** (confusion own/any) | Risque de fuite de données ou de modification involontaire            | Mapping strict dans `PermissionsManager` selon les rôles                                        |

## Sécurité
* 🔐 **Signature de tous les tokens** via HMAC SHA-256.
* 🧪 **Validation de structure et d'intégrité** dans `User.decodeToken`.
* ⏱️ **Durée de validité configurable** via `process.env.VALIDTIMETOKEN`.
* 📡 **HTTPS requis** en production (cf. `res.clearCookie(... secure: true)` dans `signout`).
* 🧩 **Permissions uniquement via constantes typées** → impossible de créer une permission non prévue.

## Optimisation & performance
* ⚡ **Accès aux permissions en O(1)** grâce à `Set<PermissionType>`.
* 🚫 **Aucune duplication de règles d'accès** dans les contrôleurs → tout passe par les middlewares.
* 🎯 **Sélection minimale des champs nécessaires en DB** pendant le login (`User.login()`).
* 📦 **Token généré une seule fois et renvoyé** dès l'inscription (`User.insert()` → `generateToken()`).
* 🧠 **Pas de recalcul des droits à chaque appel** → `PermissionsManager` encapsule le mapping.

## Raccourcis & helpers utiles
* `isAuth` → vérifie et décode le token, peuple `req.user`.
* `checkPermission(permission)` → valide l'accès à une ressource spécifique.
* `PermissionsManager.hasPermission(role, permission)` → vérification directe des droits.
* `PermissionsManager.getPermissions(role)` → liste complète des permissions d'un rôle.
* `User.decodeToken(token)` → vérification signature + expiration.

## Références
* [specification.md](./specification.md)
* [endpoints.md](./endpoints.md)
* [data-model.md](./data-model.md)
* OWASP Cheat Sheet Series :
  * [Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
  * [Access Control](https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html)

## Notes de mise en œuvre

* Les rôles supportés sont : `ADMIN`, `STAFF_MODERATOR`, `USER`.
* Les permissions sont **strictement typées** (`PermissionType`) et organisées par scope : `Own` / `Any`.
* `PermissionsManager` peut être étendu sans refactor : ajoutez le rôle ou la permission, et mettez à jour le mapping.