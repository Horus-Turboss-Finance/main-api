# Bonnes pratiques - Authentification
## Objectif
> Garantir la sécurité, la maintenabilité et la cohérence des opérations de connexion, inscription et déconnexion des utilisateurs.
* **Exemples** :
  * Prévenir le vol de token, injection de données ou collisions.
  * Conserver un code clair, modulaire, centralisé, testé.

## Règles de code spécifiques
* **Mot de passe** :
  * Ne jamais stocker de mot de passe en clair.
  * Utiliser `bcrypt.hashSync(password, 10)` pour le hash.
  * Comparaison via `bcrypt.compare`.
* **Validation des entrées** :
  * Toujours valider `email`, `password`, `name` avant traitement.
  * Utiliser `validateStringField` et `validateAndNormalizeEmail`.
* **Centralisation logique** :
  * `signupCore` et `signinCore` gèrent la logique principale.
  * Le modèle `User` gère les interactions avec la DB (insertion, login, token).
* **Middleware** :
  * `isAuth` protège les routes sécurisées.
  * `catchSync` encapsule tous les contrôleurs pour une gestion d'erreurs uniforme.
* **Token** :
  * Signé via `HMAC SHA-256` avec une clé en variable d'environnement (`SIGNEDTOKENSECRET`).
  * Stocké dans un cookie HTTP-only.
  * Dévalidation possible via `res.clearCookie("token")`.
* **Exemples précis** :
  ```ts
  // Hash lors du signup
  const hash = bcrypt.hashSync(password, 10);

  // Comparaison lors du signin
  const isValid = await bcrypt.compare(password, storedUser?.password ?? "");

  // Clear cookie lors du signout
  res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "strict", path: "/" });
  ```

## Points de vigilance
| Risque                  | Explication                                 | Solution                                             |
| ----------------------- | ------------------------------------------- | ---------------------------------------------------- |
| Jeton mal signé                     | Un token forgé pourrait donner accès à un compte | Utiliser `HMAC SHA-256` avec clé secrète en variable d'environnement       |
| Jeton sans expiration               | Risque d'utilisation indéfinie                   | Inclure une date de validité dans le token et la vérifier à chaque requête |
| Entrées non filtrées                | Risque d'injection ou crash serveur              | Valider et normaliser `email`, `name` et `password`                        |
| Collision d'utilisateur | Email déjà utilisé                          | Gérer erreur `ER_DUP_ENTRY` → HTTP 400 clair         |
| Fichier trop lourd      | Attaque par déni de service                 | Limiter à 50 Mo (`fileUpload`) avec `abortOnLimit`   |

## Sécurité
* Respect strict des recommandations de l'[**OWASP Authentication Cheat Sheet**](https://cheatsheetseries.owasp.org).
* Jamais exposer `password` ni même le `hash` dans les réponses.
* Chiffrer les communications avec **HTTPS** uniquement.
* Stocker les secrets (`SIGNEDTOKENSECRET`, `VALIDTIMETOKEN`) dans des variables d'environnement.
* Cookies `token` en `httpOnly`, `secure`, `sameSite: strict`.
* Durée courte pour les tokens, renouvellement sécurisé (non implémenté ici mais prévu).
* Ne pas logger d'informations sensibles (`email`, `password`, `token`).

## Optimisation & performance
* Routes légères : éviter requêtes ou jointures inutiles.
* API REST orientée microservices (`/auth`, `/user`, etc.).
* Éviter les requêtes multiples inutiles en regroupant les lectures/écritures DB.
* Utiliser des index sur les colonnes `email` et `id` pour accélérer la recherche.
* Charger uniquement les champs nécessaires (`select` ciblé dans `User.login`).
* Pas d'avatars encodés en base64 : utiliser des URLs (par défaut : `https://cashsight.fr/logo.png`).

## Helpers et outils standards
| Outil / Fonction                  | Rôle                                           |
| --------------------------------- | ---------------------------------------------- |
| `User.generateToken()`            | Génère un token signé pour un utilisateur      |
| `User.decodeToken()`              | Valide le token, extrait l'ID utilisateur      |
| `catchSync(fn)`                   | Wrapper async → capture propre des erreurs     |
| `ResponseException(msg)`          | Génération d'erreurs HTTP structurées          |
| `isAuth`                          | Middleware → protège les routes privées        |
| `handleCoreAuthResponse(cb, res)` | Gère la réponse HTTP du core (succès ou échec) |
| `validateStringField(...)`        | Valide un champ string (taille, présence)      |
| `validateAndNormalizeEmail(...)`  | Valide et nettoie l'email utilisateur          |

## Références
* [specification.md](./specification.md)
* [endpoints.md](./endpoints.md)
* [OWASP Auth Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

## Code structure (Résumé)
```ts
// Routes
POST /auth/signup  → signupController → signupCore → User.insert
POST /auth/signin  → signinController → signinCore → User.login + bcrypt
POST /auth/signout → signoutController → res.clearCookie

// Middlewares
- catchSync       → handler try/catch standardisé
- isAuth          → sécurité des routes protégées
- rateLimiter     → protège l'API (100 req/5min)

// Sécurité
- Helmet
- HTTPS uniquement
- CORS whitelist dynamique
- fileUpload sécurisé (limite 50Mo)
```

## À venir / à prévoir
* Gestion du **renouvellement de token** (refresh token).
* Système de **double validation (email/2FA)**.
* Historique des connexions (IP, agent, timestamp).
* Compte temporairement bloqué après plusieurs échecs de connexion.
* Stockage des logs sensibles dans un SIEM externe sécurisé.