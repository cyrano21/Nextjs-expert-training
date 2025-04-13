const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("=== Réparation du cache Next.js ===");

const projectRoot = path.resolve(__dirname, "..");
const nextDir = path.join(projectRoot, ".next");

try {
  // 1. Arrêter les processus en cours qui pourraient bloquer les fichiers
  console.log("\n1. Vérification des processus Node.js en cours...");

  // Sous Windows, nous cherchons les processus node qui pourraient bloquer les fichiers
  if (process.platform === "win32") {
    try {
      console.log("Tentative de détection des processus node.exe...");
      execSync("tasklist | findstr node.exe", { stdio: "inherit" });

      // Demander confirmation avant de terminer les processus
      console.log(
        "\n⚠️  Attention: Nous allons arrêter tous les processus Node.js en cours."
      );
      console.log(
        "    Cela pourrait interrompre d'autres applications Node.js."
      );
      console.log(
        "    Fermez d'abord toutes les fenêtres de terminal et VSCode."
      );
      console.log(
        "\nAppuyez sur Ctrl+C pour annuler ou attendez 5 secondes pour continuer..."
      );

      // Attendre 5 secondes
      execSync("timeout /t 5", { stdio: "inherit" });

      // Arrêter tous les processus node.exe
      console.log("Arrêt des processus node.exe...");
      try {
        execSync("taskkill /F /IM node.exe", { stdio: "pipe" });
      } catch (e) {
        // Ignore les erreurs si aucun processus n'a été trouvé
      }
    } catch (e) {
      console.log("Aucun processus node.exe détecté.");
    }
  }

  // 2. Nettoyer le dossier .next de façon sécurisée
  console.log("\n2. Suppression du cache Next.js...");

  if (fs.existsSync(nextDir)) {
    // D'abord vérifier si on peut supprimer des sous-dossiers spécifiques
    const dirsToClean = [
      path.join(nextDir, "cache"),
      path.join(nextDir, "server"),
      path.join(nextDir, "static"),
    ];

    dirsToClean.forEach((dir) => {
      if (fs.existsSync(dir)) {
        try {
          console.log(`Nettoyage de ${path.relative(projectRoot, dir)}...`);
          if (process.platform === "win32") {
            execSync(`rmdir /s /q "${dir}"`, { stdio: "pipe" });
          } else {
            execSync(`rm -rf "${dir}"`, { stdio: "pipe" });
          }
        } catch (e) {
          console.log(
            `Impossible de supprimer ${path.relative(projectRoot, dir)}: ${
              e.message
            }`
          );
        }
      }
    });

    // Essayer de supprimer complètement le dossier .next
    try {
      console.log("\nSuppression complète du dossier .next...");
      if (process.platform === "win32") {
        execSync(`rmdir /s /q "${nextDir}"`, { stdio: "pipe" });
      } else {
        execSync(`rm -rf "${nextDir}"`, { stdio: "pipe" });
      }
      console.log("✅ Dossier .next supprimé avec succès");
    } catch (e) {
      console.log(`❌ Impossible de supprimer le dossier .next: ${e.message}`);
      console.log(
        "   Il peut être nécessaire de redémarrer votre ordinateur pour libérer les fichiers verrouillés."
      );
    }
  } else {
    console.log("Le dossier .next n'existe pas, aucun nettoyage nécessaire.");
  }

  // 3. Créer un fichier temporaire simple pour tester tailwind
  console.log("\n3. Création d'un fichier de test pour Tailwind CSS...");

  const testComponentPath = path.join(
    projectRoot,
    "src",
    "components",
    "TailwindTestSimple.tsx"
  );
  const testComponent = `import React from 'react';

export default function TailwindTestSimple() {
  return (
    <div className="bg-blue-500 text-white p-4 m-2 rounded-lg">
      <h2 className="text-xl font-bold">Test Tailwind</h2>
      <p className="mt-2">Ce composant utilise des classes Tailwind simples.</p>
    </div>
  );
}`;

  fs.writeFileSync(testComponentPath, testComponent);
  console.log(
    `✅ Composant de test créé: ${path.relative(
      projectRoot,
      testComponentPath
    )}`
  );

  // 4. Vérifier que le fichier postcss.config.js est correct
  console.log("\n4. Vérification de la configuration PostCSS...");

  const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;

  const postcssPath = path.join(projectRoot, "postcss.config.js");
  fs.writeFileSync(postcssPath, postcssConfig);
  console.log("✅ Configuration PostCSS mise à jour");

  // 5. Modifier les options npm pour éviter les erreurs de cache
  console.log("\n5. Préparation pour redémarrer le serveur Next.js...");

  const packageJsonPath = path.join(projectRoot, "package.json");
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageData = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

      // Modifier le script dev pour utiliser --no-cache
      if (packageData.scripts && packageData.scripts.dev) {
        const devScript = packageData.scripts.dev;
        if (!devScript.includes("--no-cache")) {
          packageData.scripts.dev = devScript.replace(
            "next dev",
            "next dev --no-cache"
          );
          fs.writeFileSync(
            packageJsonPath,
            JSON.stringify(packageData, null, 2)
          );
          console.log("✅ Script dev mis à jour pour utiliser --no-cache");
        }
      }
    } catch (e) {
      console.log(
        `Erreur lors de la mise à jour de package.json: ${e.message}`
      );
    }
  }

  console.log("\n✅ Nettoyage terminé!");
  console.log("\nPour tester le composant, ajoutez ceci à une page:");
  console.log(
    "import TailwindTestSimple from '@/components/TailwindTestSimple';"
  );
  console.log("<TailwindTestSimple />");
  console.log("\nRedémarrez votre serveur Next.js avec:");
  console.log("npm run dev");
} catch (error) {
  console.error("\n❌ Erreur lors de la réparation:", error.message);
  console.log("\nVeuillez essayer les étapes suivantes manuellement:");
  console.log("1. Fermez VSCode et tous les terminaux");
  console.log("2. Redémarrez votre ordinateur");
  console.log("3. Supprimez le dossier .next manuellement");
  console.log("4. Démarrez votre application avec: npm run dev");
}
