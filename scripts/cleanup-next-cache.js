const fs = require("fs");
const path = require("path");
const { exec, execSync } = require("child_process");

console.log("=== Nettoyage du cache Next.js ===");

const nextCacheDir = path.join(__dirname, "..", ".next");

if (fs.existsSync(nextCacheDir)) {
  console.log(`Le dossier .next existe à: ${nextCacheDir}`);
  console.log("Tentative de suppression du dossier .next...");

  try {
    // Arrêtons d'abord tout serveur Next.js qui pourrait être en cours d'exécution
    console.log(
      "Tentative d'arrêt des processus Node.js sur le port 3000 ou 4000..."
    );

    if (process.platform === "win32") {
      try {
        // Trouver et tuer les processus qui occupent les ports communs utilisés par Next.js
        execSync(
          "netstat -ano | findstr :3000 || netstat -ano | findstr :4000",
          { stdio: "pipe" }
        );
        console.log("Fermeture des processus...");
        execSync("taskkill /f /im node.exe", { stdio: "pipe" });
      } catch (err) {
        console.log(
          "Aucun processus Node.js n'a été trouvé sur les ports 3000/4000."
        );
      }
    }

    console.log("Suppression forcée du dossier .next...");

    // Utiliser execSync pour une exécution synchrone et afficher immédiatement les résultats
    if (process.platform === "win32") {
      execSync(`rmdir /s /q "${nextCacheDir}"`, { stdio: "pipe" });
    } else {
      execSync(`rm -rf "${nextCacheDir}"`, { stdio: "pipe" });
    }

    console.log("✅ Cache nettoyé avec succès!");
  } catch (error) {
    console.error("❌ Erreur lors du nettoyage:", error.message);
    console.log(
      "\nTentative de suppression des sous-dossiers individuellement..."
    );

    try {
      // Liste des sous-dossiers critiques à supprimer
      const subfolders = ["build", "cache", "server", "static"];

      for (const subfolder of subfolders) {
        const folderPath = path.join(nextCacheDir, subfolder);
        if (fs.existsSync(folderPath)) {
          console.log(`Suppression de ${subfolder}...`);
          try {
            if (process.platform === "win32") {
              execSync(`rmdir /s /q "${folderPath}"`, { stdio: "pipe" });
            } else {
              execSync(`rm -rf "${folderPath}"`, { stdio: "pipe" });
            }
          } catch (e) {
            console.error(`Impossible de supprimer ${subfolder}: ${e.message}`);
          }
        }
      }

      console.log("Suppression partielle terminée.");
    } catch (subError) {
      console.error("Échec de la suppression partielle:", subError.message);
    }

    console.log("\n⚠️ Veuillez suivre ces étapes manuelles :");
    console.log("1. Fermez complètement VS Code et tous les terminaux");
    console.log("2. Supprimez manuellement le dossier .next");
    console.log("3. Redémarrez votre environnement et exécutez 'npm run dev'");
  }
} else {
  console.log("✅ Le dossier .next n'existe pas, aucun nettoyage nécessaire.");
}

console.log("\n=== Vérification des permissions du dossier src/app ===");
try {
  const appDir = path.join(__dirname, "..", "src", "app");
  fs.accessSync(appDir, fs.constants.R_OK | fs.constants.W_OK);
  console.log("✅ Les permissions du dossier src/app sont correctes");
} catch (error) {
  console.error(
    "❌ Problème de permissions sur le dossier src/app:",
    error.message
  );
}

console.log("\n=== Redémarrez votre serveur de développement avec ===");
console.log("npm run dev");
