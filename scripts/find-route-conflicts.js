const fs = require("fs");
const path = require("path");

// Obtenir le chemin absolu du répertoire racine du projet
const projectRoot = path.resolve(__dirname, "..");
const rootDir = path.join(projectRoot, "src/app");
const dynamicParams = new Map(); // Pour stocker les paramètres trouvés

function scanDirectory(dirPath) {
  try {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        const isDynamicRoute = file.startsWith("[") && file.endsWith("]");

        if (isDynamicRoute) {
          // Extraire le nom du paramètre
          const paramName = file.slice(1, -1);
          console.log(
            `Found dynamic route: ${filePath} with param: ${paramName}`
          );

          // Stocker le paramètre et son chemin
          if (!dynamicParams.has(paramName)) {
            dynamicParams.set(paramName, []);
          }
          dynamicParams.get(paramName).push(filePath);
        }

        scanDirectory(filePath);
      } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
        // Analyser également le contenu des fichiers pour les références aux paramètres
        const content = fs.readFileSync(filePath, "utf-8");

        // Rechercher les paramètres dynamiques dans le code
        const paramsInCode = content.match(/params\.([\w]+)/g) || [];

        if (paramsInCode.length > 0) {
          const uniqueParams = [
            ...new Set(paramsInCode.map((p) => p.replace("params.", ""))),
          ];
          console.log(
            `File ${filePath} uses params: ${uniqueParams.join(", ")}`
          );
        }
      }
    });
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error);
  }
}

console.log("Scanning for dynamic routes...");
console.log("Project root:", projectRoot);
console.log("App directory:", rootDir);

try {
  scanDirectory(rootDir);

  // Analyser les conflits potentiels
  console.log("\n--- Potential route parameter conflicts ---");

  // Trouver des paramètres similaires qui pourraient être en conflit
  const allParams = Array.from(dynamicParams.keys());
  const similarParams = [];

  for (let i = 0; i < allParams.length; i++) {
    for (let j = i + 1; j < allParams.length; j++) {
      const param1 = allParams[i];
      const param2 = allParams[j];

      // Vérifier si les paramètres sont similaires (ex: moduleId vs module)
      if (
        param1.includes(param2) ||
        param2.includes(param1) ||
        param1.replace(/Id$/, "") === param2.replace(/Id$/, "")
      ) {
        similarParams.push([param1, param2]);
        console.log(`Potential conflict: '${param1}' and '${param2}'`);
        console.log(`  Used in:`);
        console.log(`    - ${param1}: ${dynamicParams.get(param1).join(", ")}`);
        console.log(`    - ${param2}: ${dynamicParams.get(param2).join(", ")}`);
      }
    }
  }

  if (similarParams.length === 0) {
    console.log("No potential conflicts found.");
  }
} catch (error) {
  console.error("Error during scan:", error);
}

console.log("\nDone scanning");
