# Bonnes pratiques - [Nom de la fonctionnalité]
## Objectif
> Brève description de pourquoi ces bonnes pratiques existent.
- **Exemple** : Garantir la sécurité et la maintenabilité de la fonctionnalité d'authentification.
## Règles de code spécifiques
- Éviter [mauvaise pratique] et privilégier [bonne pratique].
- Respecter [pattern/convention interne].
- **Exemple** :
  - Ne jamais stocker de mot de passe en clair → toujours utiliser un hash avec `bcrypt` (cost = 12).
  - Toujours utiliser des variables d'environnement pour les clés secrètes.
  - Utiliser un middleware d'authentification centralisé au lieu de répéter la logique.
## Points de vigilance
| Risque | Explication | Solution |
|--------|-------------|----------|
| Mauvaise gestion du token JWT | Expiration trop longue → faille sécurité | Expiration max 15 min + refresh token |
| Logs sensibles | Risque fuite d'infos | Ne pas logguer email/mot de passe/token |
| Requêtes multiples simultanées | Conflits en BDD | Utiliser transactions ou locks |
## Sécurité
- Respecter les principes **OWASP** liés à cette fonctionnalité.
- Nettoyer et valider toutes les entrées utilisateurs.
- Appliquer un throttling/rate-limit sur les endpoints sensibles.
- Chiffrer toutes les données sensibles au repos et en transit (HTTPS obligatoire).
## Optimisation & performance
- Réduire le nombre d'appels DB en regroupant les requêtes.
- Mettre en cache [éléments appropriés].
- Préférer les requêtes paginées pour éviter la surcharge mémoire.
## Raccourcis & helpers utiles
- Fonctions ou middlewares existants à réutiliser.
- **Exemple** :
  - `hashPassword(password)` pour encapsuler la logique bcrypt.
  - `verifyToken(token)` pour centraliser la validation JWT.
## Références
- [specification.md](./specification.md)
- [endpoints.md](./endpoints.md)
- [data-model.md](./data-model.md)
- OWASP Cheat Sheet : [https://cheatsheetseries.owasp.org](https://cheatsheetseries.owasp.org)