# Bonnes pratiques - log
## Objectif
> Assurer la **traçabilité**, la **détection des comportements anormaux** et le **diagnostic des erreurs** sans compromettre la sécurité ni la performance de l'application.

## Règles de code spécifiques
* Ne jamais logger d'informations sensibles (mot de passe, token, email).
* Logger tous les accès HTTP via un middleware centralisé (`requestLogger`).
* Séparer les logs techniques (HTTP, erreurs serveur) des logs de sécurité (`securityLogger`).
* Utiliser `winston` comme logger central avec des fichiers journaliers tournants (`DailyRotateFile`).
* Regrouper les logs par niveau (`info`, `warn`, `error`) et par contexte (requêtes, sécurité, exceptions).

**Exemples de bonnes pratiques :**
* `requestLogger` → logue méthode, URL, statut, IP et durée.
* `securityLogger` → logue uniquement les accès non autorisés (401/403).
* En cas d'erreur 500, loguer le stack trace côté serveur (`ResponseProtocole`).

## Points de vigilance
| Risque                        | Explication                      | Solution                                                                  |
| ----------------------------- | -------------------------------- | ------------------------------------------------------------------------- |
| Logs de données sensibles     | Risque de fuite de sécurité      | Ne jamais inclure les credentials dans les logs                           |
| Volume de logs excessif       | Ralentissement, surcharge disque | Utiliser `winston-daily-rotate-file`, limiter les niveaux de logs en prod |
| Multiplicité de points de log | Logs incohérents ou manquants    | Centraliser avec les middlewares `requestLogger` et `securityLogger`      |

## Sécurité
* Ne pas logguer d'informations utilisateur identifiables sans nécessité explicite.
* Protéger les fichiers de logs sur le serveur (droits d'accès, chiffrement si nécessaire).
* Ne logger que les éléments nécessaires à la détection des anomalies.
* Supprimer automatiquement les anciens fichiers de logs (`maxFiles` configuré à 14 jours).

## Optimisation & performance
* Logger uniquement les niveaux pertinents (`info`, `warn`, `error`) selon l'environnement (`NODE_ENV`).
* Ne pas faire de traitement bloquant dans les middlewares de log.
* Ne pas logger les requêtes statiques ou de monitoring (ex: `/metrics`, `/ping`) si cela n'est pas utile.

## Raccourcis & helpers utiles
* `requestLogger` → Middleware pour loguer toutes les requêtes HTTP entrantes.
* `securityLogger` → Middleware dédié à la détection d'événements de sécurité.
* `ResponseProtocole` → Middleware d'unification des erreurs + log des erreurs critiques.
* `logger` → Wrapper central `winston`, réutilisable dans tous les services ou middleware.

```ts
import { logger } from "../services/logger";

logger.info("Opération réussie", { userId, action });
logger.error("Erreur critique", { stack, message });
```

## Références
* [specification.md](./specification.md)
* [endpoints.md](./endpoints.md)
* [data-model.md](./data-model.md)
* OWASP Logging Cheat Sheet : [https://cheatsheetseries.owasp.org/cheatsheets/Logging\_Cheat\_Sheet.html](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)