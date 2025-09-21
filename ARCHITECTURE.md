# 🧱 Architecture - API Backend - Cash Sights
Ce document présente l'architecture logicielle du **backend de l’API Cash Sights**, ainsi que les choix techniques fondamentaux.
L’objectif est de fournir une base de code **maintenable**, **modulaire** et **scalable**, adaptée à un environnement Node.js orienté services REST.

## 🧭 Vue d’ensemble
L’architecture suit une approche **modulaire** et **couche par couche**, inspirée de bonnes pratiques de structuration d’API (type MVC étendu). Elle permet une séparation nette entre :
* Les **routes** (définition des endpoints)
* Les **contrôleurs** (traitement des requêtes)
* Les **services** (logique métier)
* Les **middlewares** (authentification, validation, logs)
* Les **models** (requêtes SQL type-safe via ORM)
* Les **utils** et constantes (aides diverses)
* La **configuration** (env, DB, constantes)

```bash
src/
├── config/         # DB, .env, constantes globales
├── controllers/    # Traitement des requêtes entrantes
├── services/       # Logique métier
├── models/         # ORM ts-sql-query / schémas DB
├── routers/        # Définition des routes REST
├── middlewares/    # Auth, validation, logs
├── utils/          # Fonctions utilitaires partagées
├── types/          # Types globaux et partagés
├── app.ts          # Initialisation Express
└── index.ts        # Point d’entrée principal
```

## ⚙️ Principes de base
### 📦 TypeScript First
Le projet est intégralement développé en **TypeScript**, avec pour objectifs :
* Sécurité à la compilation
* Documentation implicite
* Autocomplétion IDE
* Réduction des bugs à l'exécution

### 🔐 Sécurité & Authentification
L'authentification repose sur des **JWT custom signés** et des **middlewares** de contrôle des permissions (par rôle). Le middleware `auth.ts` protège les routes sensibles.

### 🧬 ORM Type-Safe
L’ORM utilisé est **[ts-sql-query](https://github.com/ferdikoomen/ts-sql-query)**, garantissant une génération **type-safe** des requêtes SQL, sans mapper inutilement les modèles.

## 🌐 API REST - Routage & Structure
### 📁 Routage Express
Les routes sont définies dans `src/routers/`, et associées à leurs contrôleurs respectifs. Exemple :
```ts
// /routers/transaction.router.ts
router.get('/', authMiddleware, getTransactions);
router.post('/', authMiddleware, createTransaction);
```

### 🧠 Contrôleurs
Les contrôleurs orchestrent l’exécution :
* Vérifient les inputs
* Appellent les services métier
* Gèrent les erreurs

Exemple :
```ts
export const getTransactions = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const transactions = await transactionService.getAll(userId);
  res.json(transactions);
};
```

## 🧠 Services Métiers
Toute la **logique métier** est isolée dans le dossier `services/`. Cela inclut :
* Vérifications spécifiques
* Calculs de montants, agrégats
* Appels DB via modèles ORM
* Construction de réponses formatées

Cela permet une **testabilité** et une **réutilisabilité** optimale.

## 🧱 Models & ORM
Les modèles dans `models/` contiennent les requêtes SQL, formulées via `ts-sql-query`, pour interagir avec la base MySQL.

Les entités ne sont **pas instanciées** comme dans un ORM traditionnel, mais plutôt manipulées de façon déclarative et typée.

## 🧰 Middlewares
Les middlewares jouent un rôle central pour :
* Authentification (`auth.ts`)
* Validation de schéma
* Logging
* Gestion d’erreurs globales

Ils sont injectés dans les routes concernées, assurant une **séparation des responsabilités**.

## 🔧 Configuration & Environnement
La configuration du projet repose sur les fichiers `production.env` ou `developement.env`. Ces fichiers ne sont **jamais commités**.

Variables attendues :
```env
NODE_ENV=development
EXPRESS_PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=app_db
SIGNEDTOKENSECRET=your-secret
VALIDTIMETOKEN=12345
```

## 🧰 Utils & Helpers
Les fonctions réutilisables (ex : format de dates, vérification d’email, génération de token) sont centralisées dans `utils/`.

## 🧪 Tests *(en cours de structuration)*
* Framework : **Jest**
* Portée :
  * Services métier
  * Contrôleurs via mocks
  * (plus tard) tests d’intégration API via Supertest
* Structure prévue :

```bash
src/
└── __tests__/
    └── services/
        └── transaction.service.test.ts
```

## 📊 Monitoring & Logs
* Healthcheck : `/ping`
* Export Prometheus : `/metrics`
* Logs HTTP via middleware de logging
* Logs d’erreurs centralisés dans `logs/` (prévu : transport vers Sentry ou webhook Discord)

## 🔁 Jobs planifiés *(à venir)*
Des jobs planifiés (ex : nettoyage, synchronisation bancaire, agrégation de stats) seront ajoutés dans un dossier `jobs/` avec un moteur de tâche type **node-cron**.

## 🚦 Lint & Qualité de code
* **ESLint** (TypeScript strict)
* **Prettier**
* Règles de qualité :
  * Pas de `console.log` en prod
  * Typage explicite obligatoire
  * Aucun code métier en dur dans les routes
  * Fichiers organisés par responsabilité

Commandes :
```bash
npm run lint
npm run format
```

## 🧬 Déploiement & Exécution
### Local
```bash
npm run dev
```

### Production
```bash
npm run build
node dist/index.js
```

> Build transpile en JavaScript dans `dist/`.

## 🤝 Contribution
Voir [`CONTRIBUTING.md`](./CONTRIBUTING.md) pour :
* Règles de Git (`feat`, `fix`, `chore`, etc.)
* Convention **Gitmoji**
* Style de PR / Review
* Lint & test requis avant merge

--- 

> 🧠 Le mot d’ordre : **cohérence, maintenabilité, sécurité.**
> Un bon backend est prévisible, bien découpé, et bien monitoré.