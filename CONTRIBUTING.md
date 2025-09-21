# 🛠️ CONTRIBUTING.md  
Merci de vouloir contribuer à **Cash Sights - Bot Discord Utilitaire** !  
Ce document définit les bonnes pratiques de développement pour garantir un code robuste, lisible et maintenable.

## 🔧 Stack et Contexte
- **Environnement** : Node.js + Discord.js
- **Langage** : Javascript
- **Gestion de versions** : Git
- **Convention de commits** : [Gitmoji](https://gitmoji.dev/)
- **Workflow Git** : GitFlow simplifié (cf. ci-dessous)

## 📁 Structure du projet
Le bot suit une structure modulaire claire (commands, events, services, utils). Merci de respecter cette architecture lors de l'ajout ou la modification de code.

## 📦 Installation du projet
Avant de commencer le développement :
```bash
npm install
````

Pense aussi à créer un fichier `production.env` à la racine du projet (voir le README pour le format).

## 🚦 Git Workflow
Nous utilisons un **GitFlow simplifié** adapté aux projets applicatifs :
* `main` → code stable en production
* `develop` → branche de développement active
* `feature/xxx` → ajout de fonctionnalité
* `fix/xxx` → correction de bug
* `hotfix/xxx` → correctif en production

### Exemple de cycle :
```bash
# Créer une branche de feature
git checkout develop
git pull
git checkout -b feature/ajout-commande-kiff

# Travailler sur la feature
git commit -m ":sparkles: Ajout de la commande /kiff"
git push origin feature/ajout-commande-kiff

# Créer une pull request vers develop
```

## ✍️ Règles de commit avec Gitmoji
Nous utilisons **Gitmoji** pour garder un historique de commits expressif et clair.

### 🔑 Principaux gitmojis :
| Emoji | Code          | Description                         |
| ----- | ------------- | ----------------------------------- |
| ✨    | `:sparkles:`  | Nouvelle fonctionnalité             |
| 🐛    | `:bug:`       | Correction de bug                   |
| ♻️    | `:recycle:`   | Refactoring                         |
| 🔥    | `:fire:`      | Suppression de code inutile         |
| 🧪    | `:test_tube:` | Ajout ou modification de tests      |
| 📝    | `:memo:`      | MAJ de documentation                |
| 🔧    | `:wrench:`    | MAJ de configuration / scripts      |
| 🚚    | `:truck:`     | Déplacement ou renommage de fichier |

### Exemple de commit :
```bash
git commit -m ":bug: Correction du crash lors de l'appel API"
```

## ✅ Tests & Vérifications
Avant toute **pull request**, merci de :
1. Lancer les tests (soon) :
   ```bash
   npm run test
   ```

2. Vérifier que le bot fonctionne localement (en mode dev) :
   ```bash
   npm run dev
   ```

## 📥 Création d'une Pull Request
Une PR propre doit :
* Être basée sur `develop` (jamais `main`)
* Avoir un titre explicite et une description claire
* Passer les tests
* Être relue et approuvée par **au moins 1 membre de l'équipe core**
* Inclure des commentaires si une logique complexe est ajoutée

## 💬 Code Review
Lors d'une revue de code, nous portons attention à :
* Lisibilité et clarté du code
* Respect de l'architecture modulaire
* Utilisation cohérente des services, commandes et événements
* Gestion propre des erreurs (try/catch, logs)
* Tests associés si pertinents
* Messages de commit clairs et bien formatés
* Aucune console.log / TODO non justifié

## 🧹 Normes de Code
* Favoriser les fonctions pures et services isolés
* Utiliser `async/await` avec gestion des erreurs propre
* Préférer les noms explicites plutôt que les abréviations
* Ne jamais hardcoder de valeurs sensibles (utiliser `production.env`)
* Ne pas oublier de typer toutes les entrées/sorties de fonction

## 🧪 Ajout de commandes Discord
Les commandes sont déclarées dans `/commands/` sous forme de fichiers Javascript.
Merci de suivre l'exemple de structure fourni pour :
* L'organisation des arguments
* La gestion des erreurs
* L'appel aux services ou APIs
* La réponse à l'utilisateur (`interaction.reply(...)`)

## 🙏 Merci !
Merci de contribuer à rendre **Cash Sights - Bot Discord** plus utile, maintenable et évolutif !
Pour toute question, n'hésitez pas à ouvrir une *issue* ou à contacter un membre de l'équipe core.