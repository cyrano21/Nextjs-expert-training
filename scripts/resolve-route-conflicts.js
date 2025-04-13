const fs = require("fs");
const path = require("path");

// Chemins identifiés comme problématiques
const routesToFix = [
  {
    path: "G:\\nextjs-expert-academy\\src\\app\\student\\courses\\[slug]",
    oldParam: "slug",
    newParam: "moduleId",
  },
];

function renameDirectory(oldPath, newPath) {
  try {
    console.log(`Renaming ${oldPath} to ${newPath}`);
    fs.renameSync(oldPath, newPath);
    return true;
  } catch (error) {
    console.error(`Error renaming directory: ${error.message}`);
    return false;
  }
}

function updateFileContents(filePath, oldParam, newParam) {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`File does not exist: ${filePath}`);
      return false;
    }

    const content = fs.readFileSync(filePath, "utf-8");
    const updatedContent = content.replace(
      new RegExp(`params\\.${oldParam}`, "g"),
      `params.${newParam}`
    );

    fs.writeFileSync(filePath, updatedContent);
    console.log(`Updated references in ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error updating file ${filePath}: ${error.message}`);
    return false;
  }
}

function processRouteConflicts() {
  routesToFix.forEach((route) => {
    const dirPath = route.path;
    const newDirPath = dirPath.replace(
      `[${route.oldParam}]`,
      `[${route.newParam}]`
    );

    if (renameDirectory(dirPath, newDirPath)) {
      // Chercher les fichiers .ts et .tsx dans le dossier et ses sous-dossiers
      const pageFiles = findPageFiles(newDirPath);
      pageFiles.forEach((file) => {
        updateFileContents(file, route.oldParam, route.newParam);
      });
    }
  });
}

function findPageFiles(dirPath) {
  const result = [];
  if (!fs.existsSync(dirPath)) return result;

  function scanDir(dir) {
    const entries = fs.readdirSync(dir);
    entries.forEach((entry) => {
      const fullPath = path.join(dir, entry);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.endsWith(".tsx") || entry.endsWith(".ts")) {
        result.push(fullPath);
      }
    });
  }

  scanDir(dirPath);
  return result;
}

// Exécuter le script
console.log("Starting to resolve route conflicts...");
processRouteConflicts();
console.log("Done resolving route conflicts.");
