# 📦 INSTALLATION
Ce guide décrit toutes les étapes nécessaires pour installer, configurer et lancer ce projet en local.

## 🧰 Prérequis
Assurez-vous d'avoir les éléments suivants installés :
- **Git** `>=2.30`
- **Node.js** `>=18.0.0`
- **pnpm** `>=8.x` (ou `npm` / `yarn`, mais pnpm est conseillé)
- **Accès SSH** au repo GitHub :  
  `git@github.com:Horus-Turboss-Finance/main-api.git`

## 🚀 Étapes d'installation
### 1. Cloner le dépôt
```bash
git clone git@github.com:Horus-Turboss-Finance/main-api.git
cd main-api/
````

### 2. Installer les dépendances
```bash
pnpm install
```

> [!TIP]
> Utilisez `pnpm` pour des performances accrues et une gestion propre du cache.

## 🧪 Lancer l'environnement de développement
```bash
pnpm dev
```

Cela démarre l'api.

## 🧯 Dépannage
* Si un module semble manquant : `pnpm install`
* Si le build échoue : supprimer `node_modules/` + `.pnpm-store` et relancer l'installation
* Vérifiez les permissions SSH si le clone Git échoue

--- 

<div align="center">Une fois l'installation terminée, vous pouvez commencer à développer, corriger des bugs ou proposer des améliorations via pull request.</div>