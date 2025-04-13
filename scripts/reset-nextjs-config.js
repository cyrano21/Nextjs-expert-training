const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("=== Réinitialisation des configurations Next.js et Tailwind ===");
process.stdout.write("Début de la réinitialisation...\n");

const projectRoot = path.resolve(__dirname, "..");

try {
  // 1. Mettre à jour le fichier postcss.config.js
  console.log("\n1. Mise à jour de la configuration PostCSS...");
  const postcssConfig = `// Simple configuration PostCSS pour Next.js et Tailwind CSS
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;
  // Écrire le fichier et afficher un message de confirmation
  fs.writeFileSync(path.join(projectRoot, "postcss.config.js"), postcssConfig);
  console.log("✅ Configuration PostCSS mise à jour avec succès");

  // 2. S'assurer que le fichier tailwind.config.js est correct
  console.log("\n2. Mise à jour de la configuration Tailwind...");
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
`;
  fs.writeFileSync(
    path.join(projectRoot, "tailwind.config.js"),
    tailwindConfig
  );
  console.log("✅ Configuration Tailwind mise à jour");

  // 3. Vérifier que layout.tsx importe correctement globals.css
  console.log("\n3. Vérification de layout.tsx...");
  const layoutPath = path.join(projectRoot, "src", "app", "layout.tsx");
  if (fs.existsSync(layoutPath)) {
    let layoutContent = fs.readFileSync(layoutPath, "utf8");

    // Vérifier si globals.css est importé correctement
    if (!layoutContent.includes("import './globals.css'")) {
      // Si pas d'import, l'ajouter au début du fichier
      layoutContent = `import './globals.css';\n${layoutContent}`;
      fs.writeFileSync(layoutPath, layoutContent);
      console.log("✅ Import de globals.css ajouté à layout.tsx");
    } else {
      console.log("✅ layout.tsx importe déjà globals.css");
    }
  } else {
    console.log("⚠️ layout.tsx introuvable");
  }

  // 4. Créer un composant de test pour Tailwind
  console.log("\n4. Création d'un composant de test Tailwind...");
  const testComponent = `import React from 'react';

export default function TailwindReset() {
  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4">
      <div className="shrink-0">
        <div className="h-12 w-12 bg-blue-500 text-white flex items-center justify-center rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      <div>
        <div className="text-xl font-medium text-black">Configuration réinitialisée!</div>
        <p className="text-slate-500">Tailwind CSS fonctionne correctement.</p>
      </div>
    </div>
  );
}`;

  fs.writeFileSync(
    path.join(projectRoot, "src", "components", "TailwindReset.tsx"),
    testComponent
  );
  console.log("✅ Composant de test créé: src/components/TailwindReset.tsx");

  // 5. Créer un script pour démarrer Next.js sans cache
  console.log("\n5. Création d'un script pour démarrer Next.js sans cache...");
  const startScript = `const { execSync } = require('child_process');
console.log('Démarrage de Next.js sans cache...');
try {
  // Essayer de supprimer .next/cache s'il existe
  const fs = require('fs');
  const path = require('path');
  const cacheDir = path.join(__dirname, '..', '.next', 'cache');
  if (fs.existsSync(cacheDir)) {
    console.log('Suppression du cache Next.js...');
    if (process.platform === 'win32') {
      execSync('rmdir /s /q "' + cacheDir + '"', { stdio: 'inherit' });
    } else {
      execSync('rm -rf "' + cacheDir + '"', { stdio: 'inherit' });
    }
  }
  // Démarrer Next.js avec l'option --no-cache
  console.log('Démarrage du serveur Next.js...');
  execSync('next dev --no-cache', { stdio: 'inherit' });
} catch (error) {
  console.error('Erreur:', error.message);
}`;

  fs.writeFileSync(
    path.join(projectRoot, "scripts", "start-clean.js"),
    startScript
  );
  console.log("✅ Script start-clean.js créé");

  // 6. Modifier package.json pour ajouter un script dev:clean
  console.log("\n6. Mise à jour de package.json...");
  const packageJsonPath = path.join(projectRoot, "package.json");
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

    // Ajouter le script dev:clean
    packageJson.scripts = {
      ...packageJson.scripts,
      "dev:clean": "node scripts/start-clean.js",
    };

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log("✅ Script 'dev:clean' ajouté à package.json");
  }

  console.log("\n✅ Réinitialisation terminée!");
  console.log("\nPour tester l'application:");
  console.log("1. Arrêtez tous les processus Node.js en cours");
  console.log("2. Exécutez: npm run dev:clean");
  console.log("\nPour utiliser le composant de test, ajoutez:");
  console.log("import TailwindReset from '@/components/TailwindReset';");
  console.log("<TailwindReset />");
} catch (error) {
  console.error("\n❌ Erreur:", error.message);
}
