# 🚀 Cash Sights - API Backend
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://cashsight.fr/)
[![Node.js](https://img.shields.io/badge/Node.js-23.6.0-green?logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-%5E5.8.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-blue?logo=mysql)](https://www.mysql.com/)

## 🧠 À propos
Le **backend de Cash Sights** constitue la brique serveur de l’écosystème. Il est responsable de la gestion des utilisateurs, des transactions, des comptes bancaires, des catégories, des statistiques et des intégrations diverses (newsletter, contact, monitoring).

### 🎯 Objectifs
* Servir d’API sécurisée pour les clients frontend et bots internes
* Structurer la logique métier liée à la gestion financière
* Offrir des endpoints RESTful robustes, testés et monitorés

🔗 Frontend associé : [Voir le dépôt](https://github.com/Horus-Turboss-Finance/web-interface)

## ⚙️ Stack technique
* **Node.js 23.6.0** - Runtime JavaScript côté serveur
* **Express.js** - Framework HTTP minimaliste
* **TypeScript ^5.8.3** - Typage statique et robustesse du code
* **MySQL** - Base de données relationnelle
* **ts-sql-query** - ORM type-safe pour SQL
* **Prometheus** - Monitoring des métriques

## 🚀 Démarrage rapide
### ✅ Prérequis
* [Node.js](https://nodejs.org/) `>=18.x`
* [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
* Une base de données MySQL fonctionnelle

### 📦 Installation
```bash
git clone https://github.com/Horus-Turboss-Finance/main-api.git
cd main-api/
npm install
# ou yarn install
```

### 🔐 Configuration
Créer un fichier `development.env` à la racine du dossier avec les variables suivantes :

```env
# Application
NODE_ENV=development
EXPRESS_PORT=3000
DISCORD_WEBHOOK_URL=url

# Base de données
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=app_db

# Authentification
SIGNEDTOKENSECRET=your-secret
VALIDTIMETOKEN=12345
```

### ▶️ Lancer le projet
**Développement** :
```bash
npm run dev
```

**Production** :

> [!CAUTION]
> Le fichier `development.env` doit être renommé en `production.env` pour que le script fonctionne.

```bash
npm run build
npm run production
```

## 📚 Documentation
Toute la documentation technique est disponible dans le dossier [`./DOCS/`](./DOCS/).

## ✨ Contribution
Les contributions sont **les bienvenues** !
Merci de lire [la charte de contribution](./CONTRIBUTING.md) avant de contribuer

## 🧩 TODO / Roadmap
* [ ] Ajout de tests unitaires (Jest)
* [ ] Swagger ou Redoc pour la documentation d’API
* [ ] Intégration OAuth2 pour les services externes
* [ ] Système de notifications internes (Discord / Email)
* [ ] Mise en place d’un système de rôles avancé

## 🧑‍💻 Équipe & Contact

👨‍💻 Mainteneur : [@docteur-turboss](https://github.com/docteur-turboss)
📫 Contact : via [le site principal](https://cashsight.fr/) ou le canal Discord de l’organisation

> Développé avec ❤️ par l'équipe **Horus Turboss Finance**