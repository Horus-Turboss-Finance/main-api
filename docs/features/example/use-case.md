# Use Cases - [Nom de la fonctionnalité]
## Vue d'ensemble
> Brève description de ce que couvrent ces scénarios.
- **Exemple** : Ces cas d'usage décrivent comment un utilisateur interagit avec la fonctionnalité d'authentification, les conditions de succès, les erreurs attendues et les mesures de sécurité.
## Cas nominaux (Success path)
### Cas n°1 - [Titre]
- **Acteurs** : [Utilisateur, Système, API externe, etc.]
- **Préconditions** :
  - Ce qui doit être vrai avant le début du scénario
- **Déroulement** :
  1. Étape 1
  2. Étape 2
  3. …
- **Résultat attendu** :
  - Ce que le système renvoie ou fait
- **Notes** :
  - Points particuliers ou optimisations
## Cas limites / Erreurs métier
### Cas limite n°1 - [Titre]
- **Acteurs** : [ex. Utilisateur]
- **Préconditions** :
  - Contexte ou état particulier
- **Déroulement** :
  1. …
- **Résultat attendu** :
  - Code d'erreur / message / action corrective
- **Notes** :
  - Éléments à surveiller (ex. gestion de latence, cohérence des données)
## Cas de sécurité
### Cas sécurité n°1 - [Titre]
- **Vulnérabilité visée** :
  - Injection SQL, brute force, vol de session, etc.
- **Scénario d'attaque** :
  1. …
- **Mécanisme de défense** :
  - Vérification captchas, throttling, chiffrement, etc.
- **Résultat attendu** :
  - Rejet de la requête, log de l'incident, etc.
## Références
- [specification.md](./specification.md)
- [endpoints.md](./endpoints.md)
- [data-model.md](./data-model.md)
- Documentation externe si applicable