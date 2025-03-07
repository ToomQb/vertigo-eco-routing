# Nom-projet

Nom-projet est une application web permettant de comparer les émissions de CO2 pour différents modes de transport.

## Table des Matières

- [Installation](#installation)
- [Utilisation](#utilisation)
- [Structure du Projet](#structure-du-projet)
- [Technologies Utilisées](#technologies-utilisées)
- [Contribuer](#contribuer)

## Installation

Suivez ces étapes pour installer et exécuter le projet localement.

### Prérequis

- Node.js (version 18 ou supérieure)
- npm (version 9 ou supérieure)

### Étapes d'Installation

1. **Cloner le Dépôt**

   ```bash
   git clone "url"
   cd "Nom-projet"
   ```

2. **Installer les Dépendances**

   ```bash
   npm install
   ```

3. **Démarrer le Serveur de Développement**

   ```bash
   npm run dev
   ```

Accédez à l'application via [http://localhost:3000](http://localhost:3000).

## Utilisation

- **Développement** : Utilisez `npm run dev` pour démarrer le serveur de développement.
- **Production** : Utilisez `npm run build` pour créer une version optimisée, puis `npm run start` pour démarrer le serveur en mode production.

## Structure du Projet

```
/Nom-projet
├── /public
├── /src
│   ├── /app
│   │   ├── /components
│   │   │   ├── MapComponent.js
│   │   │   └── ...
│   │   ├── /styles
│   │   │   ├── globals.css
│   │   │   └── ...
│   │   ├──   page.js
│   │   ├──   layout.js
│   │   ├──   favicon.ico
│   │   └──   ...
|   └── ...
├── jsconfig.json
├── next.config.mjs
├── package.json
└── README.md
```

## Technologies Utilisées

- **Frontend** : Next.js, React, Leaflet.js, Shadcn
- **Backend** : FastAPI, PostgreSQL avec SQLAlchemy, Alembic
- **DevOps** : Docker

## Contribuer

Les contributions sont les bienvenues ! Veuillez ouvrir une issue ou soumettre une pull request.
