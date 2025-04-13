const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

try {
  // Forcer l'affichage du début d'exécution
  console.log("=== Réparation de la configuration PostCSS pour Tailwind ===");
  process.stdout.write("Démarrage de la réparation...\n");

  // Vérifier si le dossier node_modules existe
  if (!fs.existsSync(path.join(__dirname, "..", "node_modules"))) {
    console.log(
      "⚠️ Le dossier node_modules n'existe pas. Exécutez d'abord npm install."
    );
    process.exit(1);
  }

  // 1. Vérifier la version de Tailwind
  console.log("1. Vérification de la version de Tailwind...");
  const packageJsonPath = path.join(__dirname, "..", "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    console.log("❌ package.json introuvable!");
    process.exit(1);
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  const tailwindVersion =
    packageJson.dependencies?.tailwindcss ||
    packageJson.devDependencies?.tailwindcss ||
    "non installé";

  console.log(`Version actuelle de Tailwind: ${tailwindVersion}`);

  // 2. Réinstaller Tailwind avec la dernière version stable
  console.log("\n2. Réinstallation de Tailwind et ses dépendances...");
  execSync("npm uninstall tailwindcss postcss autoprefixer", {
    stdio: "inherit",
  });
  execSync(
    "npm install tailwindcss@latest postcss@latest autoprefixer@latest --save-dev",
    { stdio: "inherit" }
  );

  // 3. Configuration de la version standard de PostCSS pour Tailwind
  console.log("\n3. Mise à jour de la configuration PostCSS...");
  const postcssConfig = `module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;

  fs.writeFileSync(
    path.join(__dirname, "..", "postcss.config.js"),
    postcssConfig
  );

  // 4. Mise à jour du fichier de configuration Tailwind
  console.log("\n4. Mise à jour de la configuration Tailwind...");
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Vos extensions de thème ici
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
`;

  fs.writeFileSync(
    path.join(__dirname, "..", "tailwind.config.js"),
    tailwindConfig
  );

  // 5. Installer postcss-import si nécessaire
  console.log("\n5. Installation de postcss-import...");
  execSync("npm install postcss-import --save-dev", { stdio: "inherit" });

  // 6. Mise à jour du package.json pour Next.js
  console.log("\n6. Mise à jour des scripts dans package.json...");
  packageJson.scripts = {
    ...packageJson.scripts,
    dev: "next dev",
    build: "next build",
    start: "next start",
    lint: "next lint",
    clean: "rimraf .next",
  };

  if (!packageJson.devDependencies.rimraf) {
    console.log("Installation de rimraf pour le nettoyage...");
    execSync("npm install rimraf --save-dev", { stdio: "inherit" });
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  // 7. Tester explicitement l'installation
  console.log("\n7. Validation de l'installation...");
  try {
    execSync("npx tailwindcss --help", { stdio: "pipe" });
    console.log("✅ Tailwind CLI fonctionne correctement");
  } catch (e) {
    console.log("⚠️ Problème avec l'installation de Tailwind CLI");
  }

  console.log("\n✅ Configuration terminée avec succès!");
  console.log("\nExécution du nettoyage du cache Next.js...");

  // Nettoyer le cache
  try {
    const nextCacheDir = path.join(__dirname, "..", ".next");
    if (fs.existsSync(nextCacheDir)) {
      if (process.platform === "win32") {
        execSync(`rmdir /s /q "${nextCacheDir}"`, { stdio: "pipe" });
      } else {
        execSync(`rm -rf "${nextCacheDir}"`, { stdio: "pipe" });
      }
    }
  } catch (error) {
    console.log(
      "⚠️ Nettoyage du cache impossible automatiquement, continuez manuellement"
    );
  }

  console.log("\nRedémarrez votre serveur de développement avec:");
  console.log("npm run dev");
} catch (error) {
  console.error("\n❌ Erreur lors de la réparation:", error.message);
  console.log("\nEssayez ces étapes manuelles:");
  console.log("1. npm uninstall tailwindcss postcss autoprefixer");
  console.log(
    "2. npm install tailwindcss@latest postcss@latest autoprefixer@latest --save-dev"
  );
  console.log("3. npm install postcss-import --save-dev");
  console.log(
    "4. Vérifiez le contenu des fichiers postcss.config.js et tailwind.config.js"
  );
}
