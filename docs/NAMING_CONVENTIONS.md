# 📘 Convention de nommage
Ce document définit les conventions de nommage à respecter dans le **backend de l'API Cash Sights**, afin d’assurer une **cohérence globale**, une **lisibilité optimale** et une **maintenabilité à long terme**.

## 📁 Noms de fichiers & dossiers
| Type                      | Convention             | Exemple                       |
| ------------------------- | ---------------------- | ----------------------------- |
| Fichier de service métier | `kebab-case`           | `transaction.service.ts`      |
| Fichier de contrôleur     | `kebab-case`           | `user.controller.ts`          |
| Fichier de middleware     | `kebab-case`           | `auth.middleware.ts`          |
| Fichier utilitaire        | `kebab-case`           | `format-date.ts`              |
| Fichier de route          | `kebab-case`           | `user.router.ts`              |
| Dossier fonctionnel       | `kebab-case`           | `services/`, `controllers/`   |
| Fichier de configuration  | `kebab-case`           | `env-loader.ts`               |
| Fichier de test           | Suffixe `.test.ts`     | `transaction.service.test.ts` |
| Type ou Interface TS      | `PascalCase`           | `User`, `TransactionPayload`  |
| Constante globale         | `SCREAMING_SNAKE_CASE` | `JWT_SECRET`, `API_BASE_URL`  |

## 🧠 Services métier
* Nom : `xxx.service.ts`
* Dossier : `src/services/`
* Fonctions : `verbeNomMétier()`

```ts
// ✅ src/services/transaction.service.ts
export async function getAllTransactions(userId: string): Promise<Transaction[]> { ... }
```

## 🧩 Contrôleurs
* Nom : `xxx.controller.ts`
* Dossier : `src/controllers/`
* Fonction : `handleAction()` ou `controllerName()`

```ts
// ✅ src/controllers/user.controller.ts
export async function updateUser(req: Request, res: Response) { ... }
```

## 📡 Routes Express
* Nom : `xxx.router.ts`
* Dossier : `src/routers/`
* Préfixer avec la ressource : `user.router.ts`, `transaction.router.ts`

```ts
// ✅ src/routers/user.router.ts
router.get('/@me', authMiddleware, getUser);
```

## 🔐 Middlewares
* Nom : `xxx.middleware.ts`
* Dossier : `src/middlewares/`
* Exemple : `auth.middleware.ts`, `validate-body.middleware.ts`

## 📚 Types & Interfaces
* Nom en **PascalCase**
* Préfixe `I` uniquement si **ambiguïté**
* Dossier : `src/types/`

```ts
// ✅ src/types/user.ts
export interface User {
  id: string;
  email: string;
}
```

## 🔢 Constantes & Config
* Constantes : `SCREAMING_SNAKE_CASE`
* Fichiers : suffixés par `-config.ts` ou `-loader.ts`

```ts
// ✅ src/config/env-loader.ts
export const JWT_SECRET = process.env.JWT_SECRET!;
```

## 🧰 Utils & Helpers
* Fichiers en `kebab-case`
* 1 fichier = 1 responsabilité claire
* Pas de fichier `utils.ts` fourre-tout

```ts
// ✅ src/utils/format-date.ts
export function formatDate(date: Date): string { ... }
```

## 🧪 Tests
* Suffixe `.test.ts` obligatoire
* Miroir du fichier testé
* Dossier : `__tests__/` ou `inline` (si projet petit)

```ts
// ✅ src/services/user.service.test.ts
describe('getUserById', () => { ... });
```

## 🌐 Variables d’environnement
* Convention : `SCREAMING_SNAKE_CASE`
* Chargées via fichier `.env`
* Typées dans un fichier `env.ts` ou `env-loader.ts`

```ts
export const ENV = {
  NODE_ENV: process.env.NODE_ENV!,
  DB_HOST: process.env.DB_HOST!,
};
```

## ⚠️ À éviter
| Mauvaise pratique              | Exemple                | Correction recommandée       |
| ------------------------------ | ---------------------- | ---------------------------- |
| Abréviation floue              | `usr`, `tmp`, `cfg`    | `user`, `temp`, `config`     |
| Fichiers fourre-tout           | `utils.ts`, `index.ts` | Fichier spécifique par usage |
| Nom ambigu                     | `data.ts`, `info.ts`   | `user-info.ts`, `metrics.ts` |
| Noms sans verbe pour fonctions | `user()`, `token()`    | `getUser()`, `verifyToken()` |

## 📌 Bonnes pratiques générales
✅ Toujours nommer une fonction :
**verbe + nom explicite** (`getUserById`, `createTransaction`)
✅ Utiliser des noms cohérents pour les entités :
`transaction`, `account`, `category`, etc.
✅ Favoriser les **imports explicites** plutôt que les `index.ts` génériques.
✅ Préférer les noms de variables compréhensibles, même longs, plutôt que `res`, `val`, `tmp` à usage étendu.
✅ Garder le même nom logique d’une entité dans tous les fichiers :
`user.service.ts`, `user.controller.ts`, `user.router.ts`, etc.

> 🧠 Ce fichier est **vivant** : les conventions peuvent évoluer avec le projet.
> Toute suggestion est la bienvenue via *issue* ou *pull request*.