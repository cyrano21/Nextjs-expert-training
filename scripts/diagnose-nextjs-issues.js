import fs from "fs";
import path from "path";
import { execSync } from "child_process";

console.log("=== Diagnostic Approfondi de l'Application Next.js ===");

const projectRoot = path.resolve(__dirname, "..");
const results = {
  configs: [],
  cssFiles: [],
  permissions: [],
  packageInfo: null,
  conflicts: [],
};

// Fonction pour analyser le contenu d'un fichier
function analyzeFile(filePath, patterns) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const matches = {};

    for (const [key, pattern] of Object.entries(patterns)) {
      const regex = new RegExp(pattern, "g");
      matches[key] = (content.match(regex) || []).length;
    }

    return { path: filePath, matches };
  } catch (error) {
    return { path: filePath, error: error.message };
  }
}

// 1. Analyser les fichiers de configuration
console.log("\n1. Analyse des fichiers de configuration...");

const configFiles = [
  "next.config.js",
  "next.config.mjs",
  "postcss.config.js",
  "postcss.config.cjs",
  "tailwind.config.js",
  "tailwind.config.ts",
  ".storybook/postcss.config.js",
];

for (const configFile of configFiles) {
  const configPath = path.join(projectRoot, configFile);
  if (fs.existsSync(configPath)) {
    try {
      const content = fs.readFileSync(configPath, "utf8");
      results.configs.push({
        path: configFile,
        exists: true,
        size: content.length,
        content:
          content.substring(0, 200) + (content.length > 200 ? "..." : ""),
      });
    } catch (error) {
      results.configs.push({
        path: configFile,
        exists: true,
        error: error.message,
      });
    }
  } else {
    results.configs.push({ path: configFile, exists: false });
  }
}

// 2. Vérifier les fichiers CSS
console.log("2. Analyse des fichiers CSS globaux...");

const cssFiles = ["src/app/globals.css", "src/styles/globals.css"];

for (const cssFile of cssFiles) {
  const cssPath = path.join(projectRoot, cssFile);
  if (fs.existsSync(cssPath)) {
    try {
      const content = fs.readFileSync(cssPath, "utf8");
      const patterns = {
        tailwindDirectives: "@tailwind",
        layerDirectives: "@layer",
        cssVariables: "--[a-z-]+:",
        cssImports: "@import",
      };

      const analyzed = analyzeFile(cssPath, patterns);
      results.cssFiles.push({
        path: cssFile,
        exists: true,
        size: content.length,
        analysis: analyzed.matches,
        firstLines: content.split("\n").slice(0, 5).join("\n"),
      });
    } catch (error) {
      results.cssFiles.push({
        path: cssFile,
        exists: true,
        error: error.message,
      });
    }
  } else {
    results.cssFiles.push({ path: cssFile, exists: false });
  }
}

// 3. Vérifier l'importation de CSS dans layout.tsx
console.log("3. Vérification des imports dans layout.tsx...");

const layoutPath = path.join(projectRoot, "src", "app", "layout.tsx");
if (fs.existsSync(layoutPath)) {
  try {
    const content = fs.readFileSync(layoutPath, "utf8");
    const hasGlobalsCssImport = content.includes("import './globals.css'");
    const hasOtherCssImport = content.match(/import ['"](.+)\.css['"]/g);

    results.layout = {
      exists: true,
      importsGlobalsCss: hasGlobalsCssImport,
      otherCssImports: hasOtherCssImport,
    };
  } catch (error) {
    results.layout = { exists: true, error: error.message };
  }
} else {
  results.layout = { exists: false };
}

// 4. Vérifier les permissions sur les dossiers clés
console.log("4. Vérification des permissions sur les dossiers...");

const dirsToCheck = [".next", ".next/cache", "node_modules"];

for (const dir of dirsToCheck) {
  const dirPath = path.join(projectRoot, dir);
  try {
    if (fs.existsSync(dirPath)) {
      // Vérifier les permissions
      try {
        fs.accessSync(dirPath, fs.constants.R_OK | fs.constants.W_OK);
        results.permissions.push({
          path: dir,
          exists: true,
          readable: true,
          writable: true,
        });
      } catch (error) {
        results.permissions.push({
          path: dir,
          exists: true,
          readable: false,
          writable: false,
          error: error.message,
        });
      }
    } else {
      results.permissions.push({ path: dir, exists: false });
    }
  } catch (error) {
    results.permissions.push({
      path: dir,
      error: error.message,
    });
  }
}

// 5. Analyser package.json pour les dépendances
console.log("5. Analyse de package.json...");

const packagePath = path.join(projectRoot, "package.json");
try {
  if (fs.existsSync(packagePath)) {
    const packageContent = fs.readFileSync(packagePath, "utf8");
    const packageJson = JSON.parse(packageContent);

    results.packageInfo = {
      nextVersion:
        packageJson.dependencies?.next ||
        packageJson.devDependencies?.next ||
        "non trouvé",
      tailwindVersion:
        packageJson.dependencies?.tailwindcss ||
        packageJson.devDependencies?.tailwindcss ||
        "non trouvé",
      postcssVersion:
        packageJson.dependencies?.postcss ||
        packageJson.devDependencies?.postcss ||
        "non trouvé",
      hasTypography:
        !!packageJson.dependencies?.["@tailwindcss/typography"] ||
        !!packageJson.devDependencies?.["@tailwindcss/typography"],
      hasTailwindPostcss:
        !!packageJson.dependencies?.["@tailwindcss/postcss"] ||
        !!packageJson.devDependencies?.["@tailwindcss/postcss"],
    };
  } else {
    results.packageInfo = { error: "package.json introuvable" };
  }
} catch (error) {
  results.packageInfo = { error: error.message };
}

// 6. Recherche de conflits potentiels
console.log("6. Recherche de conflits potentiels...");

// Vérifier si plusieurs postcss.config existent
if (
  results.configs.filter((c) => c.exists && c.path.includes("postcss.config"))
    .length > 1
) {
  results.conflicts.push("Plusieurs configurations PostCSS détectées");
}

// Vérifier si plusieurs globals.css existent
if (results.cssFiles.filter((c) => c.exists).length > 1) {
  results.conflicts.push("Plusieurs fichiers globals.css détectés");
}

// Vérifier si tailwind.config.js et tailwind.config.ts existent tous les deux
if (
  results.configs.find((c) => c.exists && c.path === "tailwind.config.js") &&
  results.configs.find((c) => c.exists && c.path === "tailwind.config.ts")
) {
  results.conflicts.push("Deux configurations Tailwind (JS et TS) détectées");
}

// 7. Afficher les résultats de diagnostic
console.log("\n=== Résultats du Diagnostic ===");

console.log("\n📂 Fichiers de Configuration:");
results.configs
  .filter((c) => c.exists)
  .forEach((config) => {
    console.log(
      `- ${config.path}: ${config.error ? "ERREUR: " + config.error : "OK"}`
    );
    if (!config.error && config.content) {
      console.log(`  Début du contenu: ${config.content}`);
    }
  });

console.log("\n📄 Fichiers CSS:");
results.cssFiles
  .filter((c) => c.exists)
  .forEach((css) => {
    console.log(`- ${css.path}: ${css.error ? "ERREUR: " + css.error : "OK"}`);
    if (!css.error) {
      console.log(`  Premières lignes:\n  ${css.firstLines}`);
      if (css.analysis) {
        console.log(
          `  Directives Tailwind: ${css.analysis.tailwindDirectives}`
        );
        console.log(`  Directives @layer: ${css.analysis.layerDirectives}`);
      }
    }
  });

console.log("\n🔍 Layout.tsx:");
if (results.layout.exists) {
  console.log(
    `- Import de globals.css: ${
      results.layout.importsGlobalsCss ? "OUI" : "NON"
    }`
  );
  if (results.layout.otherCssImports) {
    console.log(
      `- Autres imports CSS: ${results.layout.otherCssImports.join(", ")}`
    );
  }
}

console.log("\n📦 Information Package:");
if (results.packageInfo && !results.packageInfo.error) {
  console.log(`- Version Next.js: ${results.packageInfo.nextVersion}`);
  console.log(`- Version Tailwind: ${results.packageInfo.tailwindVersion}`);
  console.log(`- Version PostCSS: ${results.packageInfo.postcssVersion}`);
  console.log(
    `- Plugin Typography: ${results.packageInfo.hasTypography ? "OUI" : "NON"}`
  );
  console.log(
    `- @tailwindcss/postcss: ${
      results.packageInfo.hasTailwindPostcss ? "OUI" : "NON"
    }`
  );
}

console.log("\n⚠️ Conflits Détectés:");
if (results.conflicts.length > 0) {
  results.conflicts.forEach((conflict) => console.log(`- ${conflict}`));
} else {
  console.log("- Aucun conflit détecté");
}

// 8. Recommandations
console.log("\n🔧 Recommandations:");

// Si @tailwindcss/postcss est installé mais que la config utilise tailwindcss, suggérer un changement
if (
  results.packageInfo?.hasTailwindPostcss &&
  results.configs.find(
    (c) =>
      c.exists &&
      c.path === "postcss.config.js" &&
      c.content.includes("tailwindcss:")
  )
) {
  console.log(
    "1. Votre configuration PostCSS utilise 'tailwindcss' alors que vous avez '@tailwindcss/postcss' installé."
  );
  console.log(
    "   Modifiez postcss.config.js pour utiliser '@tailwindcss/postcss' à la place."
  );
}

// Si plusieurs fichiers globals.css existent, suggérer une consolidation
if (results.cssFiles.filter((c) => c.exists).length > 1) {
  console.log(
    "2. Vous avez plusieurs fichiers globals.css. Consolidez-les en un seul fichier dans src/app/globals.css."
  );
}

// Si plusieurs configurations Tailwind existent, suggérer de n'en garder qu'une
if (
  results.configs.find((c) => c.exists && c.path === "tailwind.config.js") &&
  results.configs.find((c) => c.exists && c.path === "tailwind.config.ts")
) {
  console.log(
    "3. Vous avez deux configurations Tailwind (JS et TS). Gardez uniquement tailwind.config.js."
  );
}

// Vérifier si le dossier .next a des problèmes de permission
const nextDirIssue = results.permissions.find(
  (p) => p.path === ".next" && p.exists && (!p.readable || !p.writable)
);
if (nextDirIssue) {
  console.log(
    "4. Le dossier .next a des problèmes de permissions. Supprimez-le et laissez Next.js le recréer."
  );
}

// 9. Solution recommandée
console.log("\n📋 Solution Recommandée:");
console.log(`
1. Arrêtez tous les processus Node.js en cours
2. Supprimez le dossier .next (rm -rf .next)
3. Créez un fichier postcss.config.js simple:

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
};

4. Assurez-vous que globals.css est bien importé dans src/app/layout.tsx
5. Assurez-vous que vous n'avez qu'un seul fichier tailwind.config.js
6. Redémarrez votre application: npm run dev
`);

// 10. Vérification des problèmes avec les paramètres de route dynamique
console.log(
  "\n10. Vérification des problèmes de params dans les routes dynamiques..."
);

function findDynamicRouteFiles(directory) {
  const dynamicRouteFiles = [];

  function scanDirectory(dir) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        if (item.startsWith("[") && item.endsWith("]")) {
          // C'est un dossier de route dynamique
          const pageFiles = ["page.tsx", "page.jsx", "page.js"].map((file) =>
            path.join(fullPath, file)
          );
          const existingPageFile = pageFiles.find((file) =>
            fs.existsSync(file)
          );

          if (existingPageFile) {
            dynamicRouteFiles.push(existingPageFile);
          }
        }
        // Continuer à scanner récursivement
        scanDirectory(fullPath);
      }
    }
  }

  scanDirectory(directory);
  return dynamicRouteFiles;
}

function fixParamsUsageInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    let modified = false;

    // Rechercher l'utilisation directe de params.X sans await
    const directParamsUsageRegex = /const\s*{([^}]+)}\s*=\s*params/g;
    if (directParamsUsageRegex.test(content)) {
      console.log(
        `  - Trouvé utilisation directe de params dans ${path.relative(
          projectRoot,
          filePath
        )}`
      );

      // Remplacer tous les usages directs de params par des versions avec await
      content = content.replace(directParamsUsageRegex, (match, paramsList) => {
        const params = paramsList.split(",").map((p) => p.trim());
        const awaitedParams = params
          .map((p) => {
            return `const ${p} = await params.${p};`;
          })
          .join("\n  ");

        modified = true;
        return `// Déstructuration des paramètres de route avec await\n  ${awaitedParams}`;
      });

      // Remplacer également les utilisations directes dans les fonctions
      const paramsAccessRegex = /params\.([\w]+)/g;
      const foundParams = new Set();
      let execResult;
      while ((execResult = paramsAccessRegex.exec(content)) !== null) {
        foundParams.add(execResult[1]);
      }

      if (foundParams.size > 0) {
        console.log(
          `  - Trouvé ${
            foundParams.size
          } accès directs aux paramètres: ${Array.from(foundParams).join(", ")}`
        );
      }
    }

    // Écrire le fichier modifié
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(
        `  ✅ Fichier modifié: ${path.relative(projectRoot, filePath)}`
      );
      return true;
    }

    return false;
  } catch (error) {
    console.error(
      `  ❌ Erreur lors de la modification du fichier ${filePath}:`,
      error
    );
    return false;
  }
}

const appDirectory = path.join(projectRoot, "src", "app");
if (fs.existsSync(appDirectory)) {
  console.log("Recherche des fichiers de routes dynamiques...");
  const dynamicRouteFiles = findDynamicRouteFiles(appDirectory);
  console.log(
    `Trouvé ${dynamicRouteFiles.length} fichiers de routes dynamiques.`
  );

  let fixedFiles = 0;
  for (const file of dynamicRouteFiles) {
    const relativePath = path.relative(projectRoot, file);
    console.log(`\nAnalyse de ${relativePath}...`);
    if (fixParamsUsageInFile(file)) {
      fixedFiles++;
    }
  }

  console.log(
    `\n${fixedFiles} fichiers ont été corrigés pour l'utilisation correcte de params.`
  );

  // Afficher les instructions pour corriger les erreurs manuellement
  console.log("\n📋 Correction manuelle des problèmes de params:");
  console.log(`
Pour corriger les erreurs de "params should be awaited", modifiez vos fichiers page.tsx comme suit:

// Au lieu de:
const { moduleId, lessonId } = params;

// Utilisez:
const moduleId = await params.moduleId;
const lessonId = await params.lessonId;

// Et modifiez toutes les utilisations de params.X en attente préalable:
const module = await getModule(await params.moduleId);
`);
}

// 11. Vérification des problèmes d'hooks React
console.log("\n11. Vérification des problèmes d'hooks React...");
console.log(`
Les erreurs de hooks peuvent être causées par:
1. Des versions incompatibles de React et React DOM
2. Utilisation de hooks en dehors d'un composant de fonction
3. Multiple copies de React dans le projet

Suggestions:
1. Vérifiez vos versions React: ${
  results.packageInfo?.reactVersion || "Non trouvée"
}
2. Assurez-vous d'utiliser "use client" pour les composants utilisant des hooks
3. N'utilisez pas de hooks dans les fichiers de serveur qui ne sont pas marqués 'use client'
4. Placez les hooks en haut de vos composants, pas dans des conditions
`);

// Sauvegarde des résultats pour référence
fs.writeFileSync(
  path.join(__dirname, "diagnostic-results.json"),
  JSON.stringify(results, null, 2)
);

console.log(
  "\nRésultats détaillés sauvegardés dans scripts/diagnostic-results.json"
);
