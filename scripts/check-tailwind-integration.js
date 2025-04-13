const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("=== Vérification de l'intégration de Tailwind ===");

// 1. Vérifier que globals.css contient les directives Tailwind
try {
  const globalsCssPath = path.join(
    __dirname,
    "..",
    "src",
    "app",
    "globals.css"
  );
  if (fs.existsSync(globalsCssPath)) {
    const cssContent = fs.readFileSync(globalsCssPath, "utf8");

    if (
      !cssContent.includes("@tailwind base") ||
      !cssContent.includes("@tailwind components") ||
      !cssContent.includes("@tailwind utilities")
    ) {
      console.log(
        "⚠️ globals.css ne contient pas toutes les directives Tailwind nécessaires"
      );
      console.log("Ajout des directives manquantes...");

      // Ajouter les directives au début du fichier
      const updatedCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

${cssContent.replace(/@tailwind (base|components|utilities);/g, "")}`;

      fs.writeFileSync(globalsCssPath, updatedCss);
      console.log("✅ globals.css mis à jour avec les directives Tailwind");
    } else {
      console.log("✅ globals.css contient déjà les directives Tailwind");
    }
  } else {
    console.log("❌ globals.css introuvable!");
  }

  // 2. Régénérer le fichier CSS Tailwind directement
  console.log("\nGénération du CSS Tailwind en mode JIT...");

  // Créer un script de construction Tailwind temporaire
  const buildTailwindScript = `const path = require('path');
const fs = require('fs');
const execSync = require('child_process').execSync;

// Créer un dossier temporaire pour les fichiers générés
const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// Générer le CSS avec postcss-cli
execSync('npx tailwindcss -i ./src/app/globals.css -o ./temp/tailwind.css', { stdio: 'inherit' });

console.log('CSS Tailwind généré avec succès');`;

  const buildScriptPath = path.join(__dirname, "build-tailwind-temp.js");
  fs.writeFileSync(buildScriptPath, buildTailwindScript);

  // Exécuter le script de construction
  try {
    execSync(`node ${buildScriptPath}`, { stdio: "inherit" });
    console.log("✅ CSS Tailwind généré avec succès");
  } catch (e) {
    console.error("❌ Erreur lors de la génération du CSS:", e.message);
  }

  // Nettoyer le script temporaire
  if (fs.existsSync(buildScriptPath)) {
    fs.unlinkSync(buildScriptPath);
  }

  // 3. Vérifier l'importation de globals.css dans layout.tsx
  const layoutPath = path.join(__dirname, "..", "src", "app", "layout.tsx");
  if (fs.existsSync(layoutPath)) {
    const layoutContent = fs.readFileSync(layoutPath, "utf8");

    if (!layoutContent.includes("import './globals.css'")) {
      console.log("\n⚠️ layout.tsx n'importe pas globals.css");
      console.log(
        "Vérifiez que vous avez bien importé le fichier CSS dans src/app/layout.tsx"
      );
    } else {
      console.log("\n✅ layout.tsx importe correctement globals.css");
    }
  }

  console.log(
    "\nVérifiez que vous utilisez bien des classes Tailwind dans vos composants."
  );
  console.log('Exemple: className="text-blue-500 font-bold"');
  console.log("\nRedémarrez votre serveur de développement avec:");
  console.log("npm run dev");
} catch (error) {
  console.error("\n❌ Erreur lors de la vérification:", error.message);
}
