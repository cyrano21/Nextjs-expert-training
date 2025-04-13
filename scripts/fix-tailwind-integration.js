const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log(
  "=== Diagnostic complet et correction de l'intégration Tailwind ==="
);
process.stdout.write("Début du script de réparation Tailwind...\n");

try {
  // 1. Désinstaller et réinstaller complètement les packages liés à Tailwind
  console.log("\n1. Réinitialisation des packages Tailwind...");
  console.log("→ Désinstallation des packages existants...");
  execSync(
    "npm uninstall tailwindcss @tailwindcss/postcss autoprefixer postcss-import",
    {
      stdio: "inherit",
    }
  );

  console.log("\n→ Installation des packages avec des versions compatibles...");
  execSync(
    "npm install tailwindcss@3.3.0 postcss@8.4.31 autoprefixer@10.4.14 --save-dev",
    {
      stdio: "inherit",
    }
  );

  // 2. Utiliser une approche standard sans @tailwindcss/postcss
  console.log("\n2. Mise à jour de la configuration PostCSS standard...");
  const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;
  fs.writeFileSync(
    path.join(__dirname, "..", "postcss.config.js"),
    postcssConfig
  );

  // Vérifier aussi les .storybook/postcss.config.js qui pourrait interférer
  const storybookPostcssPath = path.join(
    __dirname,
    "..",
    ".storybook",
    "postcss.config.js"
  );
  if (fs.existsSync(storybookPostcssPath)) {
    console.log("→ Renommage du fichier .storybook/postcss.config.js en .bak");
    fs.renameSync(storybookPostcssPath, `${storybookPostcssPath}.bak`);
  }

  // 3. Supprimer le fichier postcss.config.cjs s'il existe
  const postcssConfigCjsPath = path.join(__dirname, "..", "postcss.config.cjs");
  if (fs.existsSync(postcssConfigCjsPath)) {
    console.log("\n3. Suppression du fichier postcss.config.cjs...");
    fs.unlinkSync(postcssConfigCjsPath);
  }

  // 4. Nettoyer et simplifier la configuration Tailwind
  console.log("\n4. Mise à jour de la configuration Tailwind...");
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

  // Conserver uniquement tailwind.config.js
  fs.writeFileSync(
    path.join(__dirname, "..", "tailwind.config.js"),
    tailwindConfig
  );

  const tailwindConfigTsPath = path.join(__dirname, "..", "tailwind.config.ts");
  if (fs.existsSync(tailwindConfigTsPath)) {
    console.log("Renommage de tailwind.config.ts en tailwind.config.ts.bak...");
    fs.renameSync(tailwindConfigTsPath, `${tailwindConfigTsPath}.bak`);
  }

  // 5. Installer @tailwindcss/typography
  console.log("\n5. Installation de @tailwindcss/typography...");
  execSync("npm install @tailwindcss/typography --save-dev", {
    stdio: "inherit",
  });

  // 6. S'assurer que globals.css est importé dans layout.tsx
  console.log("\n6. Vérification de layout.tsx...");
  const layoutPath = path.join(__dirname, "..", "src", "app", "layout.tsx");
  if (fs.existsSync(layoutPath)) {
    const layoutContent = fs.readFileSync(layoutPath, "utf8");

    if (!layoutContent.includes("import './globals.css'")) {
      console.log("Ajout de l'importation de globals.css...");
      const updatedLayout = `import './globals.css';\n${layoutContent}`;
      fs.writeFileSync(layoutPath, updatedLayout);
    } else {
      console.log("globals.css est déjà importé dans layout.tsx");
    }
  }

  // 7. Nettoyer le cache Next.js
  console.log("\n7. Nettoyage du cache Next.js...");
  const nextCacheDir = path.join(__dirname, "..", ".next");
  if (fs.existsSync(nextCacheDir)) {
    try {
      if (process.platform === "win32") {
        execSync(`rmdir /s /q "${nextCacheDir}"`, { stdio: "pipe" });
      } else {
        execSync(`rm -rf "${nextCacheDir}"`, { stdio: "pipe" });
      }
      console.log("Cache nettoyé avec succès");
    } catch (e) {
      console.log(
        "Il peut être nécessaire de fermer tous les processus Node.js avant de supprimer le cache"
      );
    }
  }

  // 8. Vérifier s'il y a plusieurs fichiers de style globals.css
  console.log("\n8. Vérification des multiples fichiers de style...");
  const stylesGlobalsCssPath = path.join(
    __dirname,
    "..",
    "src",
    "styles",
    "globals.css"
  );
  const appGlobalsCssPath = path.join(
    __dirname,
    "..",
    "src",
    "app",
    "globals.css"
  );

  if (fs.existsSync(stylesGlobalsCssPath) && fs.existsSync(appGlobalsCssPath)) {
    console.log("→ Deux fichiers globals.css détectés!");
    console.log("→ Renommage de src/styles/globals.css en globals.css.bak");
    fs.renameSync(stylesGlobalsCssPath, `${stylesGlobalsCssPath}.bak`);
  }

  // 9. Vérifier le package.json pour tailwind-merge qui peut être nécessaire
  console.log("\n9. Vérification des dépendances additionnelles...");
  const packageJsonPath = path.join(__dirname, "..", "package.json");
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    if (
      !packageJson.dependencies?.["tailwind-merge"] &&
      !packageJson.devDependencies?.["tailwind-merge"]
    ) {
      console.log("→ Installation de tailwind-merge pour la fonction cn()...");
      execSync("npm install tailwind-merge --save", { stdio: "inherit" });
    }
  } catch (e) {
    console.log("Erreur lors de la lecture de package.json");
  }

  // 10. Créer un fichier de test pour vérifier Tailwind
  console.log("\n10. Création d'un fichier de test Tailwind...");
  const testPath = path.join(
    __dirname,
    "..",
    "src",
    "components",
    "TailwindTest.tsx"
  );
  const testComponent = `import React from 'react';

export default function TailwindTest() {
  return (
    <div className="m-4 p-6 max-w-sm mx-auto bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>
      <h2 className="mt-2 text-center text-2xl font-bold text-gray-800">Tailwind fonctionne!</h2>
      <p className="mt-2 text-center text-gray-600">Si ce composant est stylisé correctement, Tailwind CSS est bien configuré.</p>
    </div>
  );
}`;

  fs.writeFileSync(testPath, testComponent);
  console.log("✅ Composant de test Tailwind créé");

  console.log("\n✅ Configuration terminée!");
  console.log("\n→ Instructions:");
  console.log("1. Redémarrez complètement votre éditeur et votre terminal");
  console.log("2. Supprimez le dossier .next s'il existe encore");
  console.log("3. Exécutez: npm run dev");
  console.log("\n→ Pour tester, ajoutez à une page:");
  console.log("import TailwindTest from '@/components/TailwindTest';");
  console.log("<TailwindTest />");
} catch (error) {
  console.error("\n❌ Erreur:", error.message);
  console.log(
    "\nEssayez de fermer complètement votre éditeur et tous les processus Node.js"
  );
  console.log("puis réexécutez ce script.");
}
