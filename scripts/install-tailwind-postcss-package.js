const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("=== Installation du package @tailwindcss/postcss ===");

try {
  console.log("Installation du package @tailwindcss/postcss...");
  execSync("npm install @tailwindcss/postcss --save-dev", { stdio: "inherit" });

  console.log("✅ Package installé avec succès");
  console.log("\nLa configuration PostCSS est déjà mise à jour.");
  console.log("Redémarrez votre serveur de développement avec:");
  console.log("npm run dev");
} catch (error) {
  console.error("\n❌ Erreur:", error.message);
}
