const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("=== Diagnostic et correction de Tailwind CSS ===");

// 1. Installer les packages nécessaires
console.log("\n1. Vérification des dépendances...");
try {
  console.log("Installation des packages Tailwind essentiels...");
  execSync("npm install tailwindcss postcss autoprefixer --save-dev", {
    stdio: "inherit",
  });
  console.log("✅ Packages installés avec succès");
} catch (error) {
  console.error(
    "❌ Erreur lors de l'installation des packages:",
    error.message
  );
}

// 2. Créer/mettre à jour le fichier de configuration Tailwind
console.log("\n2. Mise à jour du fichier de configuration Tailwind...");
const tailwindConfigPath = path.join(__dirname, "..", "tailwind.config.js");
const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Vos extensions personnalisées ici
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
`;

try {
  fs.writeFileSync(tailwindConfigPath, tailwindConfig);
  console.log("✅ tailwind.config.js mis à jour");
} catch (error) {
  console.error(
    "❌ Erreur lors de la mise à jour de tailwind.config.js:",
    error.message
  );
}

// 3. Créer/mettre à jour le fichier de configuration PostCSS standard
console.log("\n3. Mise à jour du fichier de configuration PostCSS...");
const postcssConfigPath = path.join(__dirname, "..", "postcss.config.js");
const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;

try {
  fs.writeFileSync(postcssConfigPath, postcssConfig);
  console.log("✅ postcss.config.js mis à jour");
} catch (error) {
  console.error(
    "❌ Erreur lors de la mise à jour de postcss.config.js:",
    error.message
  );
}

// 4. Vérifier/mettre à jour globals.css
console.log("\n4. Vérification du fichier globals.css...");
const globalCssPath = path.join(__dirname, "..", "src", "app", "globals.css");

if (fs.existsSync(globalCssPath)) {
  try {
    let cssContent = fs.readFileSync(globalCssPath, "utf8");

    // Vérifier si les directives Tailwind sont présentes au début du fichier
    if (!cssContent.match(/^\s*@tailwind\s+base;/m)) {
      console.log("Ajout des directives Tailwind manquantes...");
      cssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;

${cssContent}`;
      fs.writeFileSync(globalCssPath, cssContent);
      console.log("✅ Directives Tailwind ajoutées à globals.css");
    } else {
      console.log(
        "✅ Les directives Tailwind sont déjà présentes dans globals.css"
      );
    }
  } catch (error) {
    console.error(
      "❌ Erreur lors de la mise à jour de globals.css:",
      error.message
    );
  }
} else {
  console.error(
    "❌ Le fichier globals.css est introuvable à l'emplacement prévu"
  );
}

// 5. Nettoyer le cache
console.log("\n5. Nettoyage du cache Next.js...");
const nextCacheDir = path.join(__dirname, "..", ".next");

if (fs.existsSync(nextCacheDir)) {
  try {
    console.log("Suppression du dossier .next...");

    function deleteFolderRecursive(directoryPath) {
      if (fs.existsSync(directoryPath)) {
        fs.readdirSync(directoryPath).forEach((file) => {
          const curPath = path.join(directoryPath, file);
          if (fs.lstatSync(curPath).isDirectory()) {
            // Récursion pour les sous-dossiers
            deleteFolderRecursive(curPath);
          } else {
            // Suppression des fichiers
            fs.unlinkSync(curPath);
          }
        });
        fs.rmdirSync(directoryPath);
      }
    }

    deleteFolderRecursive(nextCacheDir);
    console.log("✅ Cache nettoyé avec succès");
  } catch (error) {
    console.error("❌ Erreur lors du nettoyage du cache:", error.message);
  }
}

// 6. Vérifier que le fichier postcss.config.cjs n'interfère pas
const postcssConfigCjsPath = path.join(__dirname, "..", "postcss.config.cjs");
if (fs.existsSync(postcssConfigCjsPath)) {
  console.log(
    "\n6. Le fichier postcss.config.cjs existe également, il pourrait causer des conflits."
  );
  console.log("   Renommage du fichier...");
  try {
    fs.renameSync(postcssConfigCjsPath, `${postcssConfigCjsPath}.backup`);
    console.log("✅ postcss.config.cjs renommé en postcss.config.cjs.backup");
  } catch (error) {
    console.error(
      "❌ Erreur lors du renommage de postcss.config.cjs:",
      error.message
    );
  }
}

console.log("\n=== Diagnostic terminé ===");
console.log("Redémarrez votre serveur de développement avec:");
console.log("  npm run dev");
