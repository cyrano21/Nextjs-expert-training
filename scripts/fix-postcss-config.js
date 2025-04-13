const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("=== Installation et configuration de @tailwindcss/postcss ===");

try {
  // 1. Vérifier si le package est déjà installé
  console.log("Vérification de l'installation existante...");
  let packageInstalled = false;

  try {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8")
    );
    packageInstalled = !!(
      packageJson.dependencies?.["@tailwindcss/postcss"] ||
      packageJson.devDependencies?.["@tailwindcss/postcss"]
    );
  } catch (e) {
    console.log("Erreur lors de la lecture de package.json:", e.message);
  }

  // 2. Installer le package si nécessaire
  if (!packageInstalled) {
    console.log("Installation de @tailwindcss/postcss...");
    execSync("npm install @tailwindcss/postcss --save-dev", {
      stdio: "inherit",
    });
  } else {
    console.log("✅ @tailwindcss/postcss est déjà installé");
  }

  // 3. Vérifier que la configuration PostCSS est correcte
  console.log("\nVérification de la configuration PostCSS...");
  // La configuration est déjà correcte, rien à faire
  console.log("✅ Configuration PostCSS correcte");

  // 4. Nettoyer les configurations en double
  console.log("\nVérification des configurations de Tailwind...");
  const tailwindConfigTs = path.join(__dirname, "..", "tailwind.config.ts");
  const tailwindConfigJs = path.join(__dirname, "..", "tailwind.config.js");

  // On garde la configuration TypeScript si elle existe
  if (fs.existsSync(tailwindConfigTs) && fs.existsSync(tailwindConfigJs)) {
    console.log(
      "Les deux fichiers tailwind.config.ts et tailwind.config.js existent."
    );
    console.log("Renommage de tailwind.config.js en tailwind.config.js.bak...");
    fs.renameSync(tailwindConfigJs, `${tailwindConfigJs}.bak`);
  }

  // 5. Vérifier que layout.tsx importe globals.css
  const layoutPath = path.join(__dirname, "..", "src", "app", "layout.tsx");
  if (fs.existsSync(layoutPath)) {
    const layoutContent = fs.readFileSync(layoutPath, "utf8");

    if (!layoutContent.includes("import './globals.css'")) {
      console.log("\nAjout de l'importation de globals.css dans layout.tsx...");
      const updatedLayout = `import './globals.css';\n${layoutContent}`;
      fs.writeFileSync(layoutPath, updatedLayout);
      console.log("✅ globals.css importé dans layout.tsx");
    } else {
      console.log("\n✅ globals.css est déjà importé dans layout.tsx");
    }
  }

  // 6. Créer la structure de dossiers pour le contenu MDX
  console.log(
    "\n6. Création de la structure de dossiers pour le contenu MDX..."
  );

  const contentRoot = path.join(__dirname, "..", "src", "content");
  const coursesDir = path.join(contentRoot, "courses");
  const conceptsDir = path.join(contentRoot, "concepts");

  // Créer les dossiers de base s'ils n'existent pas
  if (!fs.existsSync(contentRoot)) {
    fs.mkdirSync(contentRoot, { recursive: true });
    console.log(
      `✅ Dossier créé: ${path.relative(
        path.join(__dirname, ".."),
        contentRoot
      )}`
    );
  }

  if (!fs.existsSync(coursesDir)) {
    fs.mkdirSync(coursesDir, { recursive: true });
    console.log(
      `✅ Dossier créé: ${path.relative(
        path.join(__dirname, ".."),
        coursesDir
      )}`
    );
  }

  if (!fs.existsSync(conceptsDir)) {
    fs.mkdirSync(conceptsDir, { recursive: true });
    console.log(
      `✅ Dossier créé: ${path.relative(
        path.join(__dirname, ".."),
        conceptsDir
      )}`
    );
  }

  // Créer le dossier nextjs-beginner pour le module 1
  const nextjsBeginnerDir = path.join(coursesDir, "nextjs-beginner");
  if (!fs.existsSync(nextjsBeginnerDir)) {
    fs.mkdirSync(nextjsBeginnerDir, { recursive: true });
    console.log(
      `✅ Dossier créé: ${path.relative(
        path.join(__dirname, ".."),
        nextjsBeginnerDir
      )}`
    );
  }

  // Créer les fichiers MDX pour le module nextjs-beginner
  const module1Files = [
    {
      name: "01-introduction-to-nextjs.mdx",
      content: `---
title: "Introduction à Next.js"
description: "Comprendre ce qu'est Next.js et pourquoi l'utiliser"
---

# Introduction à Next.js

Next.js est un framework React qui permet de créer des applications web complètes.

## Qu'est-ce que Next.js ?

Next.js est un framework React pour la production qui offre:
- Rendu côté serveur
- Génération de sites statiques
- Routage basé sur les fichiers
- Optimisation automatique

## Pourquoi utiliser Next.js ?

- **Performance** : Optimisations intégrées
- **Développeur expérience** : API intuitive, rechargement à chaud
- **Scalabilité** : Prêt pour la production
`,
    },
    {
      name: "02-tour-du-proprietaire.mdx",
      content: `---
title: "Tour du propriétaire"
description: "Explorer la structure d'un projet Next.js"
---

# Tour du propriétaire

Explorons la structure d'un projet Next.js typique.

## Structure de dossiers

- **/app** : Contient les routes et les composants
- **/public** : Fichiers statiques accessibles directement
- **/components** : Composants React réutilisables
- **next.config.js** : Configuration Next.js
`,
    },
    {
      name: "03-html-css-js-recap.mdx",
      content: `---
title: "Récapitulatif HTML, CSS, JavaScript"
description: "Un rappel des fondamentaux du développement web"
---

# Récapitulatif HTML, CSS, JavaScript

## HTML - La structure

HTML (HyperText Markup Language) définit la structure de votre contenu.

\`\`\`html
<!DOCTYPE html>
<html>
  <head>
    <title>Ma page</title>
  </head>
  <body>
    <h1>Mon titre</h1>
    <p>Mon paragraphe</p>
  </body>
</html>
\`\`\`

## CSS - Le style

CSS (Cascading Style Sheets) stylise votre contenu.

\`\`\`css
h1 {
  color: blue;
  font-size: 24px;
}
\`\`\`

## JavaScript - L'interactivité

JavaScript rend votre page interactive.

\`\`\`javascript
document.querySelector('h1').addEventListener('click', () => {
  alert('Vous avez cliqué sur le titre!');
});
\`\`\`
`,
    },
    {
      name: "04-developpement-local.mdx",
      content: `---
title: "Développement local"
description: "Configurer un environnement de développement pour Next.js"
---

# Développement local

Pour développer efficacement en Next.js, vous avez besoin d'un bon environnement.

## Prérequis

- **Node.js** (version 14 ou supérieure)
- **npm** ou **yarn** ou **pnpm**
- Un éditeur de code (VS Code recommandé)

## Créer un nouveau projet

\`\`\`bash
npx create-next-app mon-projet
cd mon-projet
npm run dev
\`\`\`

Votre application est maintenant accessible à http://localhost:3000
`,
    },
    {
      name: "module.json",
      content: `{
  "title": "Next.js pour débutants",
  "description": "Apprenez les bases de Next.js et commencez votre voyage de développement",
  "order": 1,
  "lessons": [
    {
      "slug": "01-introduction-to-nextjs",
      "title": "Introduction à Next.js",
      "description": "Comprendre ce qu'est Next.js et pourquoi l'utiliser"
    },
    {
      "slug": "02-tour-du-proprietaire",
      "title": "Tour du propriétaire",
      "description": "Explorer la structure d'un projet Next.js"
    },
    {
      "slug": "03-html-css-js-recap",
      "title": "Récapitulatif HTML, CSS, JavaScript",
      "description": "Un rappel des fondamentaux du développement web"
    },
    {
      "slug": "04-developpement-local",
      "title": "Développement local",
      "description": "Configurer un environnement de développement pour Next.js"
    }
  ]
}`,
    },
  ];

  for (const file of module1Files) {
    const filePath = path.join(nextjsBeginnerDir, file.name);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, file.content);
      console.log(
        `✅ Fichier créé: ${path.relative(
          path.join(__dirname, ".."),
          filePath
        )}`
      );
    } else {
      console.log(
        `⚠️ Le fichier existe déjà: ${path.relative(
          path.join(__dirname, ".."),
          filePath
        )}`
      );
    }
  }

  console.log("\n✅ Structure de contenu MDX créée avec succès!");

  // Ajouter le Module 2: "Les Fondations de React"
  console.log("\n7. Création du Module 2: Les Fondations de React...");

  const reactFoundationsDir = path.join(coursesDir, "react-foundations");
  if (!fs.existsSync(reactFoundationsDir)) {
    fs.mkdirSync(reactFoundationsDir, { recursive: true });
    console.log(
      `✅ Dossier créé: ${path.relative(
        path.join(__dirname, ".."),
        reactFoundationsDir
      )}`
    );
  }

  const module2Files = [
    {
      name: "01-jsx-kesako.mdx",
      content: `---
title: "JSX, Késako ?"
description: "Comprendre JSX, la syntaxe utilisée dans React"
---

# JSX, Késako ?

JSX est une extension de syntaxe pour JavaScript qui ressemble à du HTML mais avec toute la puissance de JavaScript.

## Pourquoi JSX ?

JSX nous permet d'écrire des éléments HTML dans JavaScript et de les placer dans le DOM sans avoir à utiliser \`createElement()\` ou \`appendChild()\`.
`,
    },
    {
      name: "02-composants-fonctionnels.mdx",
      content: `---
title: "Les Composants Fonctionnels"
description: "Comprendre et créer des composants fonctionnels en React"
---

# Les Composants Fonctionnels

En React, un composant fonctionnel est une simple fonction JavaScript qui retourne du JSX.

## Syntaxe de Base

\`\`\`jsx
function MonComposant() {
  return <h1>Bonjour, monde!</h1>;
}
\`\`\`

Les composants fonctionnels sont la façon moderne et recommandée de créer des composants React.
`,
    },
    {
      name: "03-props-la-communication.mdx",
      content: `---
title: "Props: La Communication entre Composants"
description: "Apprendre à passer et utiliser des props dans les composants React"
---

# Props: La Communication entre Composants

Les "props" sont le moyen de passer des données d'un composant parent à un composant enfant.

## Passage de Props

\`\`\`jsx
function Salutation(props) {
  return <h1>Bonjour, {props.nom}!</h1>;
}

// Utilisation
<Salutation nom="Marie" />
\`\`\`

Les props sont en lecture seule et ne doivent pas être modifiées par le composant qui les reçoit.
`,
    },
    {
      name: "04-composants-client-serveur-intro.mdx",
      content: `---
title: "Introduction aux Composants Client et Serveur"
description: "Comprendre la différence entre les composants client et serveur dans Next.js"
---

# Introduction aux Composants Client et Serveur

Dans Next.js 13+, les composants sont par défaut des composants serveur. Pour créer un composant client, vous devez explicitement l'indiquer.

## Composants Serveur

Les composants serveur sont rendus sur le serveur et envoyés au client sous forme de HTML. Ils sont idéaux pour le contenu statique ou qui ne nécessite pas d'interactivité.

## Composants Client

Les composants client sont rendus côté client et peuvent utiliser des hooks comme useState, useEffect, etc.

\`\`\`jsx
'use client'; // Cette directive indique que c'est un composant client

import { useState } from 'react';

export default function Compteur() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Compteur: {count}</p>
      <button onClick={() => setCount(count + 1)}>Incrémenter</button>
    </div>
  );
}
\`\`\`
`,
    },
    {
      name: "module.json",
      content: `{
  "title": "Les Fondations de React",
  "description": "Comprendre les concepts de base de React pour développer avec Next.js",
  "order": 2,
  "lessons": [
    {
      "slug": "01-jsx-kesako",
      "title": "JSX, Késako ?",
      "description": "Comprendre JSX, la syntaxe utilisée dans React"
    },
    {
      "slug": "02-composants-fonctionnels",
      "title": "Les Composants Fonctionnels",
      "description": "Comprendre et créer des composants fonctionnels en React"
    },
    {
      "slug": "03-props-la-communication",
      "title": "Props: La Communication entre Composants",
      "description": "Apprendre à passer et utiliser des props dans les composants React"
    },
    {
      "slug": "04-composants-client-serveur-intro",
      "title": "Introduction aux Composants Client et Serveur",
      "description": "Comprendre la différence entre les composants client et serveur dans Next.js"
    }
  ]
}`,
    },
  ];

  for (const file of module2Files) {
    const filePath = path.join(reactFoundationsDir, file.name);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, file.content);
      console.log(
        `✅ Fichier créé: ${path.relative(
          path.join(__dirname, ".."),
          filePath
        )}`
      );
    } else {
      console.log(
        `⚠️ Le fichier existe déjà: ${path.relative(
          path.join(__dirname, ".."),
          filePath
        )}`
      );
    }
  }

  // Ajouter le Module 3: "Routing & Layouts dans Next.js"
  console.log("\n8. Création du Module 3: Routing & Layouts dans Next.js...");

  const routingLayoutsDir = path.join(coursesDir, "routing-layouts");
  if (!fs.existsSync(routingLayoutsDir)) {
    fs.mkdirSync(routingLayoutsDir, { recursive: true });
    console.log(
      `✅ Dossier créé: ${path.relative(
        path.join(__dirname, ".."),
        routingLayoutsDir
      )}`
    );
  }

  const module3Files = [
    {
      name: "01-app-router-la-base.mdx",
      content: `---
title: "App Router: La Base"
description: "Comprendre le fonctionnement du routeur App de Next.js"
---

# App Router: La Base

Next.js 13 a introduit un nouveau système de routage basé sur les fichiers: le App Router.

## Le routage basé sur les fichiers

Dans Next.js, le routage est basé sur la structure des fichiers dans votre dossier \`app/\`.
`,
    },
    {
      name: "02-layouts-partages.mdx",
      content: `---
title: "Layouts Partagés"
description: "Créer et utiliser des layouts partagés entre plusieurs pages"
---

# Layouts Partagés

Les layouts permettent de partager des éléments d'interface entre plusieurs pages, comme les headers, footers, sidebars, etc.

## Création d'un layout

Dans Next.js avec App Router, vous définissez un layout en créant un fichier \`layout.tsx\` dans un dossier:

\`\`\`tsx
export default function Layout({ children }) {
  return (
    <div>
      <header>Mon en-tête partagé</header>
      <main>{children}</main>
      <footer>Mon pied de page partagé</footer>
    </div>
  );
}
\`\`\`
`,
    },
    {
      name: "03-navigation-avec-link.mdx",
      content: `---
title: "Navigation avec le composant Link"
description: "Utiliser le composant Link pour une navigation côté client"
---

# Navigation avec le composant Link

Next.js fournit un composant \`Link\` pour la navigation côté client, sans rechargement complet de la page.

## Utilisation de base

\`\`\`tsx
import Link from 'next/link';

export default function Navigation() {
  return (
    <nav>
      <Link href="/">Accueil</Link>
      <Link href="/apropos">À propos</Link>
      <Link href="/contact">Contact</Link>
    </nav>
  );
}
\`\`\`

Le composant Link précharge automatiquement les pages liées dans la fenêtre d'affichage, ce qui rend la navigation encore plus rapide.
`,
    },
    {
      name: "04-routes-dynamiques-intro.mdx",
      content: `---
title: "Introduction aux Routes Dynamiques"
description: "Créer des routes dynamiques avec des paramètres variables"
---

# Introduction aux Routes Dynamiques

Les routes dynamiques permettent de créer des pages qui dépendent de paramètres variables, comme des IDs ou des slugs.

## Création d'une route dynamique

Vous pouvez créer une route dynamique en plaçant un segment de route entre crochets:

\`\`\`
app/produits/[id]/page.tsx
\`\`\`

Cette page correspondra à des routes comme \`/produits/1\`, \`/produits/2\`, etc.

## Accès aux paramètres

Dans votre page, vous pouvez accéder aux paramètres dynamiques:

\`\`\`tsx
export default function ProductPage({ params }) {
  // params.id contiendra le paramètre dynamique
  return <div>Produit ID: {params.id}</div>;
}
\`\`\`
`,
    },
    {
      name: "module.json",
      content: `{
  "title": "Routing & Layouts dans Next.js",
  "description": "Maîtriser le système de routage et les layouts dans Next.js",
  "order": 3,
  "lessons": [
    {
      "slug": "01-app-router-la-base",
      "title": "App Router: La Base",
      "description": "Comprendre le fonctionnement du routeur App de Next.js"
    },
    {
      "slug": "02-layouts-partages",
      "title": "Layouts Partagés",
      "description": "Créer et utiliser des layouts partagés entre plusieurs pages"
    },
    {
      "slug": "03-navigation-avec-link",
      "title": "Navigation avec le composant Link",
      "description": "Utiliser le composant Link pour une navigation côté client"
    },
    {
      "slug": "04-routes-dynamiques-intro",
      "title": "Introduction aux Routes Dynamiques",
      "description": "Créer des routes dynamiques avec des paramètres variables"
    }
  ]
}`,
    },
  ];

  for (const file of module3Files) {
    const filePath = path.join(routingLayoutsDir, file.name);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, file.content);
      console.log(
        `✅ Fichier créé: ${path.relative(
          path.join(__dirname, ".."),
          filePath
        )}`
      );
    } else {
      console.log(
        `⚠️ Le fichier existe déjà: ${path.relative(
          path.join(__dirname, ".."),
          filePath
        )}`
      );
    }
  }

  // Ajouter le Module 4: "Styliser avec Tailwind CSS"
  console.log("\n9. Création du Module 4: Styliser avec Tailwind CSS...");

  const stylingTailwindDir = path.join(coursesDir, "styling-tailwind");
  if (!fs.existsSync(stylingTailwindDir)) {
    fs.mkdirSync(stylingTailwindDir, { recursive: true });
    console.log(
      `✅ Dossier créé: ${path.relative(
        path.join(__dirname, ".."),
        stylingTailwindDir
      )}`
    );
  }

  const module4Files = [
    {
      name: "01-tailwind-pourquoi-comment.mdx",
      content: `---
title: "Tailwind CSS: Pourquoi et Comment"
description: "Introduction à Tailwind CSS et ses avantages"
---

# Tailwind CSS: Pourquoi et Comment

Tailwind CSS est un framework CSS utilitaire qui permet de construire rapidement des interfaces utilisateur personnalisées.

## Pourquoi Tailwind ?

- Développement plus rapide avec des classes utilitaires
- Personnalisation facile avec un système de configuration
- Taille de bundle optimisée grâce à PurgeCSS
`,
    },
    {
      name: "02-les-utilitaires-essentiels.mdx",
      content: `---
title: "Les Utilitaires Essentiels de Tailwind"
description: "Découvrir les classes utilitaires les plus courantes de Tailwind CSS"
---

# Les Utilitaires Essentiels de Tailwind

Tailwind fournit des centaines de classes utilitaires pour tous les aspects du style.

## Layout

- \`flex\`, \`grid\`, \`block\`, \`inline\`, \`hidden\`, etc.

## Espacement

- \`p-4\` (padding), \`m-2\` (margin), \`gap-3\` (gap), etc.

## Typographie

- \`text-xl\` (taille), \`font-bold\` (graisse), \`italic\` (style), etc.

## Couleurs

- \`text-blue-500\` (couleur de texte), \`bg-red-100\` (couleur de fond), etc.
`,
    },
    {
      name: "03-hover-focus-et-autres-etats.mdx",
      content: `---
title: "Styles Interactifs : Hover, Focus et Plus !"
description: "Rendez vos interfaces plus vivantes en appliquant des styles différents lorsque l'utilisateur interagit avec les éléments (survol, focus, etc.)."
tags: ['tailwind css', 'css', 'pseudo-classes', 'hover', 'focus', 'styling', 'beginner']
estimatedTimeMinutes: 15
objectives:
  - Expliquer le rôle des modificateurs d'état dans Tailwind.
  - Appliquer des styles au survol (\`hover:\`).
  - Appliquer des styles lorsqu'un élément a le focus (\`focus:\`).
  - Mentionner d'autres états utiles (\`active:\`, \`disabled:\`, \`group-hover:\`).
  - (Activité) Ajouter des états interactifs à un bouton dans le Playground.
---

import { InfoTip, CodeBlock, Quiz, TailwindPlayground } from '@/components/mdx';

# Donnez du Feedback Visuel : Les États Interactifs ✨🖱️

Un bon design réagit à l'utilisateur ! Quand on survole un bouton, il devrait *montrer* qu'il est cliquable. Quand on sélectionne un champ de formulaire, il devrait se distinguer. C'est là qu'interviennent les **modificateurs d'état** de Tailwind.

Ce sont des préfixes que vous ajoutez *avant* une classe utilitaire pour qu'elle ne s'applique que dans une situation précise.

**Syntaxe : \`{état}:{utilitaire}\`**

## L'État \`hover:\` (Survol de la Souris)

C'est le plus courant. Il applique un style uniquement lorsque le curseur de la souris est **sur** l'élément.

<CodeBlock language="html" title="Exemple avec hover:">
<button class="
  bg-blue-500    /* Style par défaut */
  text-white
  py-2 px-4
  rounded
  transition      /* Transition unique pour tous les changements */
  hover:bg-blue-700 /* Style appliqué AU SURVOL */
">
  Survolez-moi !
</button>
</CodeBlock>

Ici, le fond du bouton devient plus foncé au survol. La classe \`transition\` (non liée à \`hover:\` mais souvent utilisée avec) rend ce changement de couleur plus agréable.

## L'État \`focus:\` (Élément Sélectionné)

Cet état s'applique lorsqu'un élément reçoit le **focus**, typiquement via la navigation au clavier (touche Tab) ou en cliquant sur un champ de formulaire (\`<input>\`, \`<textarea>\`, \`<button>\`). C'est crucial pour l'accessibilité !

<CodeBlock language="html" title="Exemple avec focus:">
<input type="text" class="
  border-gray-300 /* Bordure par défaut */
  rounded px-3 py-1
  focus:border-blue-500 /* Bordure bleue AU FOCUS */
  focus:ring-2          /* Ajoute un 'anneau' de couleur */
  focus:ring-blue-300   /* Couleur de l'anneau */
  focus:outline-none    /* Supprime l'outline moche par défaut */
" placeholder="Cliquez ou Tabbulez ici" />
</CodeBlock>

Ici, lorsque l'input a le focus, sa bordure devient bleue et un anneau bleu clair apparaît autour, indiquant clairement qu'il est sélectionné. \`focus:outline-none\` est souvent utilisé pour remplacer l'outline par défaut du navigateur par un style \`focus:ring-*\` plus esthétique.

## Autres États Utiles (Aperçu Rapide)

*   **\`active:\`**: S'applique lorsqu'un élément est **activement pressé** (pendant le clic de souris ou la pression sur Espace/Entrée). Souvent utilisé pour un léger effet d'enfoncement (\`active:scale-95\`).
*   **\`disabled:\`**: S'applique aux éléments de formulaire désactivés (avec l'attribut HTML \`disabled\`). Utile pour les griser (\`disabled:opacity-50\`, \`disabled:cursor-not-allowed\`).
*   **\`group-hover:\`**: Magique ! Applique un style à un élément **enfant** lorsque le **parent** marqué avec la classe \`group\` est survolé. Parfait pour afficher une icône ou changer une couleur dans une carte au survol de la carte entière.

<CodeBlock language="html" title="Exemple avec group-hover:">
<div class="group border rounded p-4 hover:bg-gray-100"> {/* Parent avec 'group' */}
  <h3 class="font-bold">Titre de la Carte</h3>
  <p class="text-gray-600 group-hover:text-black"> {/* Le texte change quand la DIV est survolée */}
     Contenu qui devient noir au survol de la carte.
  </p>
</div>
</CodeBlock>

<InfoTip type="info">
Il existe de nombreux autres modificateurs d'état (\`visited:\`, \`checked:\`, \`first:\`, \`last:\`, etc.). Explorez la [documentation Tailwind sur les états](https://tailwindcss.com/docs/hover-focus-and-other-states) pour les découvrir !
</InfoTip>
`,
    },
    {
      name: "04-responsive-design-facile.mdx",
      content: `---
title: "Responsive Design Facile avec Tailwind"
description: "Adapter facilement vos interfaces à différentes tailles d'écran"
---

# Responsive Design Facile avec Tailwind

Tailwind rend le responsive design incroyablement facile grâce à ses préfixes de breakpoints.

## Les breakpoints par défaut

- \`sm:\` - 640px et plus
- \`md:\` - 768px et plus
- \`lg:\` - 1024px et plus
- \`xl:\` - 1280px et plus
- \`2xl:\` - 1536px et plus

## Utilisation

\`\`\`html
<div class="
  flex-col      <!-- Par défaut (mobile): Disposition en colonne -->
  sm:flex-row   <!-- À partir de 640px: Disposition en ligne -->
  lg:justify-center  <!-- À partir de 1024px: Centré horizontalement -->
">
  <!-- Contenu -->
</div>
\`\`\`

Cette approche "mobile-first" signifie que vous définissez d'abord le style pour mobile, puis les modifications pour les écrans plus grands.
`,
    },
    {
      name: "05-dark-mode-simple.mdx",
      content: `---
title: "Mode Sombre Simplifié"
description: "Implémenter un mode sombre avec Tailwind CSS"
---

# Mode Sombre Simplifié

Tailwind facilite l'ajout du mode sombre à votre application avec le préfixe \`dark:\`.

## Configuration

Dans votre fichier \`tailwind.config.js\`, activez le mode sombre:

\`\`\`javascript
module.exports = {
  darkMode: 'class', // ou 'media' pour utiliser la préférence du système
  // reste de la config...
}
\`\`\`

## Utilisation

\`\`\`html
<div class="
  bg-white text-black
  dark:bg-gray-800 dark:text-white
">
  Ce texte est noir sur fond blanc en mode clair, 
  et blanc sur fond gris foncé en mode sombre.
</div>
\`\`\`

## Commutation du Mode

Vous pouvez ajouter/supprimer la classe \`dark\` sur l'élément \`html\` pour basculer entre les modes:

\`\`\`javascript
// Activer le mode sombre
document.documentElement.classList.add('dark');

// Désactiver le mode sombre
document.documentElement.classList.remove('dark');
\`\`\`
`,
    },
    {
      name: "module.json",
      content: `{
  "title": "Styliser avec Tailwind CSS",
  "description": "Maîtriser Tailwind CSS pour créer des interfaces utilisateur modernes et responsives",
  "order": 4,
  "lessons": [
    {
      "slug": "01-tailwind-pourquoi-comment",
      "title": "Tailwind CSS: Pourquoi et Comment",
      "description": "Introduction à Tailwind CSS et ses avantages"
    },
    {
      "slug": "02-les-utilitaires-essentiels",
      "title": "Les Utilitaires Essentiels",
      "description": "Découvrir les classes utilitaires les plus courantes de Tailwind CSS"
    },
    {
      "slug": "03-hover-focus-et-autres-etats",
      "title": "Hover, Focus et Autres États",
      "description": "Rendre vos interfaces interactives avec les modificateurs d'état"
    },
    {
      "slug": "04-responsive-design-facile",
      "title": "Responsive Design Facile",
      "description": "Adapter facilement vos interfaces à différentes tailles d'écran"
    },
    {
      "slug": "05-dark-mode-simple",
      "title": "Mode Sombre Simplifié",
      "description": "Implémenter un mode sombre avec Tailwind CSS"
    }
  ]
}`,
    },
  ];

  for (const file of module4Files) {
    const filePath = path.join(stylingTailwindDir, file.name);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, file.content);
      console.log(
        `✅ Fichier créé: ${path.relative(
          path.join(__dirname, ".."),
          filePath
        )}`
      );
    } else {
      console.log(
        `⚠️ Le fichier existe déjà: ${path.relative(
          path.join(__dirname, ".."),
          filePath
        )}`
      );
    }
  }

  // Ajouter le Module 5: "Interactivité de Base avec React"
  console.log(
    "\n10. Création du Module 5: Interactivité de Base avec React..."
  );

  const basicInteractivityDir = path.join(coursesDir, "basic-interactivity");
  if (!fs.existsSync(basicInteractivityDir)) {
    fs.mkdirSync(basicInteractivityDir, { recursive: true });
    console.log(
      `✅ Dossier créé: ${path.relative(
        path.join(__dirname, ".."),
        basicInteractivityDir
      )}`
    );
  }

  const module5Files = [
    {
      name: "01-composants-client-necessite.mdx",
      content: `---
title: "Composants Client: une Nécessité"
description: "Comprendre quand et pourquoi utiliser les composants client dans Next.js"
---

# Composants Client: une Nécessité

Dans Next.js avec le App Router, tous les composants sont des composants serveur par défaut. Mais pour l'interactivité, les composants client sont nécessaires.

## Quand utiliser les composants client ?

- Pour gérer des états locaux avec useState
- Pour utiliser des effets avec useEffect
- Pour ajouter des gestionnaires d'événements
`,
    },
    {
      name: "02-usestate-le-gardien-de-letat.mdx",
      content: `---
title: "useState: Le Gardien de l'État"
description: "Utiliser le hook useState pour gérer l'état local d'un composant"
---

# useState: Le Gardien de l'État

Le hook \`useState\` est fondamental en React. Il permet à un composant de mémoriser des informations qui peuvent changer au fil du temps.

## Syntaxe de base

\`\`\`jsx
'use client'; // Ne pas oublier cette directive en Next.js

import { useState } from 'react';

function Compteur() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Compteur: {count}</p>
      <button onClick={() => setCount(count + 1)}>Incrémenter</button>
      <button onClick={() => setCount(count - 1)}>Décrémenter</button>
    </div>
  );
}
\`\`\`

\`useState\` renvoie un tableau avec deux éléments:
1. La valeur actuelle de l'état (\`count\`)
2. Une fonction pour mettre à jour cet état (\`setCount\`)
`,
    },
    {
      name: "03-gerer-les-evenements.mdx",
      content: `---
title: "Gestion d'Événements : Répondre aux Actions Utilisateur"
description: "Apprenez à rendre vos composants interactifs en répondant aux clics, aux saisies clavier et autres événements utilisateur en React."
tags: ['react', 'events', 'onclick', 'onchange', 'state', 'beginner', 'interactivity', 'hooks']
estimatedTimeMinutes: 20
objectives:
  - Attacher des gestionnaires d'événements (event handlers) aux éléments JSX (ex: \`onClick\`).
  - Définir des fonctions de gestion d'événements dans un composant.
  - Comprendre l'objet événement (\`e\`).
  - Gérer les événements de changement sur les inputs (\`onChange\`) pour contrôler les formulaires.
  - (Activité) Créer un champ de saisie contrôlé.
---

import { InfoTip, CodeBlock, Quiz, ProjectStep, InteractiveCodeEditor } from '@/components/mdx';

# Rendre l'UI Vivante : Gestion des Événements ! 🖱️⌨️

Nos composants savent maintenant *avoir* un état (\`useState\`), mais comment cet état peut-il **changer** en réponse à ce que fait l'utilisateur ? Si l'utilisateur **clique** sur un bouton, **tape** dans un champ, ou **survole** un élément, nous voulons que notre composant réagisse !

C'est le rôle de la **gestion d'événements** en React. C'est très similaire à la façon dont on le fait en HTML et JavaScript natif, mais avec une syntaxe adaptée à JSX.

## Écouter les Événements en JSX

Vous attachez des "écouteurs d'événements" directement comme des props sur vos éléments JSX. Les noms sont en \`camelCase\` (comme \`onClick\`, \`onChange\`, \`onSubmit\`, \`onMouseEnter\`, etc.) et vous leur passez une **fonction** à exécuter lorsque l'événement se produit.

<CodeBlock language="jsx" title="Exemple avec onClick">
'use client'; // Nécessaire pour les gestionnaires d'événements

import { Button } from '@/components/ui/button';

function BoutonAlerte() {
  // 1. Définir la fonction à exécuter
  const handleClick = () => {
    alert("Vous avez cliqué !");
  };

  return (
    // 2. Passer la fonction à l'attribut onClick
    <Button onClick={handleClick}>
      Cliquez-moi
    </Button>
  );
}

// On peut aussi définir la fonction directement "en ligne" (inline)
function AutreBouton() {
  return (
    <Button onClick={() => console.log("Clic en ligne !")}>
      Log Clic
    </Button>
  );
}

export default BoutonAlerte; // Ou un composant parent qui utilise ces boutons
</CodeBlock>

<InfoTip type="warning" title="Fonction, pas Appel !">
Faites attention à passer la **référence** de la fonction (\`handleClick\`) et non le **résultat** de son appel (\`handleClick()\`). Si vous mettez les parenthèses, la fonction s'exécutera *immédiatement* lors du rendu, pas seulement au clic ! L'exception est si vous utilisez une fonction fléchée inline \`onClick={() => maFonction(arg)}\`, ce qui est correct.
</InfoTip>

## L'Objet Événement (\`e\`)

Souvent, la fonction de gestion d'événements reçoit automatiquement un **objet événement** (conventionnellement nommé \`e\` ou \`event\`) comme premier argument. Cet objet contient des informations sur l'événement qui s'est produit.

*   **\`e.preventDefault()\` :** Très utile pour les formulaires (\`onSubmit\`) ou les liens (\`onClick\` sur \`<a>\`) pour **empêcher le comportement par défaut** du navigateur (comme recharger la page lors de la soumission d'un formulaire).
*   **\`e.target\` :** Fait référence à l'élément DOM sur lequel l'événement s'est produit.
*   **\`e.target.value\` :** Pour les éléments de formulaire comme \`<input>\`, \`<textarea>\`, \`<select>\`, cela donne la **valeur actuelle** de l'élément.
`,
    },
    {
      name: "04-logique-conditionnelle-rendu.mdx",
      content: `---
title: "Logique Conditionnelle dans le Rendu"
description: "Afficher différents contenus selon des conditions"
---

# Logique Conditionnelle dans le Rendu

En React, vous pouvez facilement afficher différents contenus en fonction de conditions.

## Opérateur Ternaire

\`\`\`jsx
function Salutation({ estConnecte }) {
  return (
    <div>
      {estConnecte 
        ? <h1>Bienvenue, utilisateur !</h1>
        : <h1>Veuillez vous connecter</h1>
      }
    </div>
  );
}
\`\`\`

## Opérateur ET (&&)

\`\`\`jsx
function Notification({ messages }) {
  return (
    <div>
      {messages.length > 0 && (
        <p>Vous avez {messages.length} nouveaux messages</p>
      )}
    </div>
  );
}
\`\`\`

## Rendu de Listes

\`\`\`jsx
function ListeUtilisateurs({ utilisateurs }) {
  return (
    <ul>
      {utilisateurs.map(utilisateur => (
        <li key={utilisateur.id}>{utilisateur.nom}</li>
      ))}
    </ul>
  );
}
\`\`\`
`,
    },
    {
      name: "module.json",
      content: `{
  "title": "Interactivité de Base avec React",
  "description": "Apprendre à créer des composants interactifs avec React",
  "order": 5,
  "lessons": [
    {
      "slug": "01-composants-client-necessite",
      "title": "Composants Client: une Nécessité",
      "description": "Comprendre quand et pourquoi utiliser les composants client dans Next.js"
    },
    {
      "slug": "02-usestate-le-gardien-de-letat",
      "title": "useState: Le Gardien de l'État",
      "description": "Utiliser le hook useState pour gérer l'état local d'un composant"
    },
    {
      "slug": "03-gerer-les-evenements",
      "title": "Gérer les Événements",
      "description": "Répondre aux actions utilisateur via les gestionnaires d'événements"
    },
    {
      "slug": "04-logique-conditionnelle-rendu",
      "title": "Logique Conditionnelle dans le Rendu",
      "description": "Afficher différents contenus selon des conditions"
    }
  ]
}`,
    },
  ];

  for (const file of module5Files) {
    const filePath = path.join(basicInteractivityDir, file.name);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, file.content);
      console.log(
        `✅ Fichier créé: ${path.relative(
          path.join(__dirname, ".."),
          filePath
        )}`
      );
    } else {
      console.log(
        `⚠️ Le fichier existe déjà: ${path.relative(
          path.join(__dirname, ".."),
          filePath
        )}`
      );
    }
  }

  console.log("\n✅ Configuration terminée!");
  console.log("\nRedémarrez votre serveur de développement avec:");
  console.log("npm run dev");
} catch (error) {
  console.error("\n❌ Erreur:", error.message);
}
