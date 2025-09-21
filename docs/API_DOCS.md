
## 🌐 Endpoints REST
> Tous les endpoints protégés nécessitent un **JWT valide** (`Authorization: Bearer <token>`) et une vérification de rôle.

Pour plus d'information aller voir [ici](./features/)

### 🔐 Authentification
* `POST /auth/signup` — Création de compte
* `POST /auth/signin` — Connexion & génération du JWT

### 👤 Utilisateur *(auth requis)*
* `GET /user/@me` — Récupérer son profil
* `PUT /user/@me` — Modifier son profil
* `DELETE /user/@me` — Supprimer son compte

### 💸 Transactions *(auth requis)*
* `GET /transaction` — Lister les transactions
* `GET /transaction/:id` — Détail d'une transaction
* `POST /transaction` — Créer une transaction
* `PUT /transaction/:id` — Modifier une transaction
* `DELETE /transaction/:id` — Supprimer une transaction

### 🏦 Comptes bancaires *(auth requis)*
* `GET /settings/accounts` — Lister les comptes
* `POST /settings/accounts` — Ajouter un compte
* `PUT /settings/accounts/:id` — Modifier un compte
* `DELETE /settings/accounts/:id` — Supprimer un compte

### 🗂️ Catégories *(auth requis)*
* `GET /settings/categories` — Lister les catégories
* `POST /settings/categories` — Ajouter une catégorie
* `PUT /settings/categories/:id` — Modifier une catégorie
* `DELETE /settings/categories/:id` — Supprimer une catégorie

### 📩 Newsletter
* `POST /newsletter/email` — S’inscrire à la newsletter
* `POST /newsletter/size` — Nombre total d’inscrits

### 📬 Contact
* `POST /contact/form` — Envoyer un message de contact

### 📊 Monitoring
* `GET /metrics` — Export Prometheus
* `GET /ping` — Healthcheck du service