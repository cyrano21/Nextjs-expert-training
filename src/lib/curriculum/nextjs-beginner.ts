import { Module } from '@/types/curriculum';

export const nextjsBeginnerModule: Module = {
  id: 'nextjs-beginner',
  title: 'Next.js pour Débutants',
  description: 'Apprenez les bases de Next.js et commencez à construire des applications web modernes',
  duration: '2 semaines',
  level: 'Débutant',
  prerequisites: [],
  outcomes: [
    'Comprendre les concepts fondamentaux de Next.js',
    'Créer et configurer un projet Next.js',
    'Maîtriser le système de routage de Next.js',
    'Comprendre le rendu côté serveur et côté client',
    'Implémenter des fonctionnalités de base dans une application Next.js'
  ],
  lessons: [
    {
      id: 'introduction',
      title: 'Introduction à Next.js',
      description: 'Découvrez ce qu\'est Next.js et pourquoi il est devenu si populaire',
      duration: '30 minutes',
      content: {
        theory: `
# Introduction à Next.js

Next.js est un framework React qui permet de créer des applications web complètes. Il a été développé par Vercel (anciennement ZEIT) et est devenu l'un des frameworks les plus populaires pour construire des applications web modernes.

## Pourquoi Next.js?

- **Rendu hybride** : Next.js permet de choisir entre le rendu côté serveur (SSR), le rendu statique (SSG), et le rendu côté client.
- **Routage intégré** : Système de routage basé sur le système de fichiers.
- **Optimisation automatique** : Optimisation des images, des polices et du code.
- **Développement rapide** : Hot reloading, support TypeScript, et plus encore.
- **Déploiement simplifié** : Déploiement facile sur Vercel ou d'autres plateformes.

## Historique et évolution

Next.js a été créé en 2016 et a connu une croissance rapide. Avec l'introduction de l'App Router dans Next.js 13, le framework a fait un bond en avant en termes de fonctionnalités et de performance.

## Comparaison avec d'autres frameworks

| Framework | Rendu côté serveur | Routage | Optimisation | Écosystème |
|-----------|-------------------|---------|--------------|------------|
| Next.js   | ✅                | Basé sur les fichiers | Automatique | React |
| Gatsby    | ❌ (SSG uniquement) | Plugin | Plugins | React |
| Nuxt.js   | ✅                | Basé sur les fichiers | Automatique | Vue |
| Remix     | ✅                | Basé sur les fichiers | Manuel | React |

## Cas d'utilisation

Next.js est idéal pour:
- Sites e-commerce
- Applications SaaS
- Blogs et sites de contenu
- Applications web complexes
- Dashboards et interfaces administratives
        `,
        practice: `
# Exercice pratique

## Objectif
Familiarisez-vous avec l'écosystème Next.js en explorant la documentation officielle et en analysant des exemples de projets.

## Tâches
1. Visitez la [documentation officielle de Next.js](https://nextjs.org/docs)
2. Explorez les exemples de projets dans la section "Examples"
3. Identifiez 3 fonctionnalités de Next.js qui vous semblent les plus utiles
4. Réfléchissez à un projet personnel que vous pourriez développer avec Next.js

## Questions de réflexion
- Quelles sont les principales différences entre Next.js et une application React standard?
- Dans quels cas préféreriez-vous utiliser Next.js plutôt qu'un autre framework?
- Comment Next.js peut-il améliorer les performances de votre application web?
        `,
        quiz: [
          {
            question: 'Quel est l\'avantage principal du rendu côté serveur (SSR) dans Next.js?',
            options: [
              'Il réduit la taille du bundle JavaScript',
              'Il améliore le référencement (SEO) et les performances initiales',
              'Il simplifie le déploiement sur Vercel',
              'Il permet d\'utiliser plus de composants React'
            ],
            correctOption: 1
          },
          {
            question: 'Comment fonctionne le système de routage dans Next.js?',
            options: [
              'Via un fichier de configuration routes.js',
              'En utilisant React Router comme dépendance',
              'Par un système basé sur la structure des fichiers et dossiers',
              'En définissant manuellement chaque route dans le composant App'
            ],
            correctOption: 2
          },
          {
            question: 'Quelle entreprise maintient Next.js?',
            options: [
              'Facebook',
              'Google',
              'Microsoft',
              'Vercel'
            ],
            correctOption: 3
          }
        ]
      }
    },
    {
      id: 'setup',
      title: 'Configuration d\'un projet Next.js',
      description: 'Apprenez à créer et configurer un nouveau projet Next.js',
      duration: '45 minutes',
      content: {
        theory: `
# Configuration d'un projet Next.js

Dans cette leçon, nous allons apprendre à configurer un nouveau projet Next.js à partir de zéro.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé:
- Node.js (version 14.6.0 ou supérieure)
- npm, yarn ou pnpm

## Création d'un nouveau projet

La façon la plus simple de créer un projet Next.js est d'utiliser la commande \`create-next-app\`:

\`\`\`bash
npx create-next-app@latest mon-projet-nextjs
# ou
yarn create next-app mon-projet-nextjs
# ou
pnpm create next-app mon-projet-nextjs
\`\`\`

Lors de la création, vous serez guidé par quelques questions:
- Voulez-vous utiliser TypeScript?
- Voulez-vous utiliser ESLint?
- Voulez-vous utiliser Tailwind CSS?
- Voulez-vous utiliser le répertoire 'src/'?
- Voulez-vous utiliser App Router?
- Voulez-vous personnaliser l'alias d'importation par défaut (@/*)?

## Structure du projet

Une fois créé, votre projet aura une structure similaire à celle-ci:

\`\`\`
mon-projet-nextjs/
├── app/                 # Dossier principal pour App Router
│   ├── favicon.ico      # Favicon du site
│   ├── globals.css      # Styles globaux
│   ├── layout.tsx       # Layout principal
│   └── page.tsx         # Page d'accueil
├── public/              # Fichiers statiques
├── .eslintrc.json       # Configuration ESLint
├── next.config.mjs      # Configuration Next.js
├── package.json         # Dépendances et scripts
├── postcss.config.js    # Configuration PostCSS (si Tailwind)
├── tailwind.config.ts   # Configuration Tailwind (si Tailwind)
└── tsconfig.json        # Configuration TypeScript (si TypeScript)
\`\`\`

## Fichiers importants

### next.config.mjs

Ce fichier permet de configurer diverses options de Next.js:

\`\`\`javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Options de configuration
  reactStrictMode: true,
  images: {
    domains: ['example.com'],
  },
};

export default nextConfig;
\`\`\`

### package.json

Contient les dépendances et les scripts:

\`\`\`json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
\`\`\`

## Scripts disponibles

- \`npm run dev\`: Lance le serveur de développement
- \`npm run build\`: Compile l'application pour la production
- \`npm run start\`: Lance l'application en mode production
- \`npm run lint\`: Exécute ESLint pour vérifier le code

## Personnalisation avancée

Vous pouvez personnaliser davantage votre projet en ajoutant:
- Des variables d'environnement (.env.local)
- Des configurations pour les tests (Jest, Testing Library)
- Des outils d'analyse (Sentry, Google Analytics)
- Des middlewares pour l'authentification ou d'autres fonctionnalités
        `,
        practice: `
# Exercice pratique: Création d'un projet Next.js

## Objectif
Créer et configurer un nouveau projet Next.js avec TypeScript et Tailwind CSS.

## Tâches
1. Ouvrez un terminal et créez un nouveau projet Next.js:
   \`\`\`bash
   npx create-next-app@latest mon-premier-nextjs --typescript --tailwind --eslint --app
   \`\`\`

2. Naviguez dans le dossier du projet:
   \`\`\`bash
   cd mon-premier-nextjs
   \`\`\`

3. Lancez le serveur de développement:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Ouvrez votre navigateur à l'adresse http://localhost:3000

5. Explorez la structure du projet et familiarisez-vous avec les fichiers générés

6. Modifiez le fichier \`app/page.tsx\` pour personnaliser la page d'accueil

7. Ajoutez une nouvelle page en créant un fichier \`app/about/page.tsx\`

## Vérification
- Le serveur de développement fonctionne-t-il correctement?
- Pouvez-vous accéder à la page d'accueil modifiée?
- Pouvez-vous accéder à la nouvelle page "about"?
- Les styles Tailwind fonctionnent-ils correctement?
        `,
        quiz: [
          {
            question: 'Quelle commande permet de créer un nouveau projet Next.js?',
            options: [
              'npm init next-app',
              'npx create-next-app',
              'npm install next',
              'yarn add next react react-dom'
            ],
            correctOption: 1
          },
          {
            question: 'Quel dossier contient les fichiers statiques dans un projet Next.js?',
            options: [
              'static/',
              'assets/',
              'public/',
              'resources/'
            ],
            correctOption: 2
          },
          {
            question: 'Quelle commande lance le serveur de développement Next.js?',
            options: [
              'npm start',
              'npm run dev',
              'npm run serve',
              'npm run development'
            ],
            correctOption: 1
          }
        ]
      }
    }
  ]
};
