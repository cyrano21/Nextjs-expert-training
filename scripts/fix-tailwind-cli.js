const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("=== Installation de Tailwind CLI ===");

try {
  console.log("Installation de tailwindcss CLI...");
  execSync("npm install tailwindcss --save-dev", { stdio: "inherit" });

  console.log("\nVérification de l'installation...");
  try {
    execSync("npx tailwindcss --help", { stdio: "pipe" });
    console.log("✅ Tailwind CLI installé avec succès");
  } catch (e) {
    console.error("❌ Impossible d'installer Tailwind CLI");
  }

  console.log("\nAjout de scripts utiles à package.json...");

  // Lire package.json
  const packageJsonPath = path.join(__dirname, "..", "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  // Ajouter des scripts pour Tailwind
  packageJson.scripts = {
    ...packageJson.scripts,
    "build:css":
      "npx tailwindcss -i ./src/app/globals.css -o ./public/tailwind.css",
    "watch:css":
      "npx tailwindcss -i ./src/app/globals.css -o ./public/tailwind.css --watch",
  };

  // Écrire le fichier package.json mis à jour
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  console.log("✅ Scripts ajoutés à package.json");

  console.log(
    "\nVérification de l'importation de globals.css dans layout.tsx..."
  );
  const layoutPath = path.join(__dirname, "..", "src", "app", "layout.tsx");
  if (fs.existsSync(layoutPath)) {
    const layoutContent = fs.readFileSync(layoutPath, "utf8");

    if (!layoutContent.includes("import './globals.css'")) {
      console.log("Ajout de l'importation de globals.css dans layout.tsx...");
      const updatedLayout = `import './globals.css';\n${layoutContent}`;
      fs.writeFileSync(layoutPath, updatedLayout);
      console.log("✅ globals.css importé dans layout.tsx");
    } else {
      console.log("✅ globals.css est déjà importé dans layout.tsx");
    }
  }

  console.log("\nGénération du CSS Tailwind...");
  try {
    execSync("npm run build:css", { stdio: "inherit" });
    console.log("✅ CSS Tailwind généré avec succès");
  } catch (e) {
    console.error("❌ Erreur lors de la génération du CSS:", e.message);
  }

  console.log("\nRedémarrez votre serveur de développement avec:");
  console.log("npm run dev");
} catch (error) {
  console.error("\n❌ Erreur:", error.message);
}
