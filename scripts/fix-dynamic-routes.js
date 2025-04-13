import fs from 'fs';
import path from 'path';

console.log("=== Correction automatique des erreurs de params dans les routes dynamiques ===\n");
  "=== Correction automatique des erreurs de params dans les routes dynamiques ===\n"
const projectRoot = path.resolve(__dirname, '..');
const appDirectory = path.join(projectRoot, 'src', 'app');
const projectRoot = path.resolve(__dirname, "..");
function findDynamicRouteFiles(directory) { "src", "app");
  const dynamicRouteFiles = [];
  nction findDynamicRouteFiles(directory) {
  function scanDirectory(dir) {
    const items = fs.readdirSync(dir);
    nction scanDirectory(dir) {
    for (const item of items) {c(dir);
      const fullPath = path.join(dir, item);
      const stats = fs.statSync(fullPath);
      const fullPath = path.join(dir, item);
      if (stats.isDirectory()) {fullPath);
        if (item.startsWith('[') && item.endsWith(']')) {
          // C'est un dossier de route dynamique
          const pageFiles = ['page.tsx', 'page.jsx', 'page.js'].map(file => path.join(fullPath, file));
          const existingPageFile = pageFiles.find(file => fs.existsSync(file));
          const pageFiles = ["page.tsx", "page.jsx", "page.js"].map((file) =>
          if (existingPageFile) {ile)
            dynamicRouteFiles.push(existingPageFile);
          }onst existingPageFile = pageFiles.find((file) =>
        }   fs.existsSync(file)
        // Continuer à scanner récursivement
        scanDirectory(fullPath);
      }   if (existingPageFile) {
    }       dynamicRouteFiles.push(existingPageFile);
  }       }
        }
  scanDirectory(directory);ner récursivement
  return dynamicRouteFiles;ath);
}     }
    }
function fixParamsUsageInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;s;
    
    // Correction 1: Remplacer la déstructuration simple par des awaits individuels
    const directParamsUsageRegex = /const\s*{([^}]+)}\s*=\s*params;/g;
    if (directParamsUsageRegex.test(content)) {
      console.log(`- Correction de la déstructuration dans ${path.relative(projectRoot, filePath)}`);
      t modified = false;
      content = content.replace(
        directParamsUsageRegex,la déstructuration simple par des awaits individuels
        (match, paramsList) => { = /const\s*{([^}]+)}\s*=\s*params;/g;
          const params = paramsList.split(',').map(p => p.trim());
          const awaitedParams = params.map(p => {
            return `const ${p} = await params.${p};`;th.relative(
          }).join('\n  ');
          filePath
          modified = true;
          return `// Accéder aux paramètres avec await\n  ${awaitedParams}`;
        }
      );ntent = content.replace(directParamsUsageRegex, (match, paramsList) => {
    }   const params = paramsList.split(",").map((p) => p.trim());
        const awaitedParams = params
    // Correction 2: Remplacer les accès directs dans les appels de fonction
    const functionCallRegex = /(await\s+\w+\([^)]*?)params\.(\w+)([^)]*\))/g;
    content = content.replace(functionCallRegex, (match, before, paramName, after) => {
      modified = true;);
      return `${before}await params.${paramName}${after}`;
    }); modified = true;
        return `// Accéder aux paramètres avec await\n  ${awaitedParams}`;
    // Correction 3: Remplacer les accès directs dans les assignations de variables
    const assignmentRegex = /=\s*params\.(\w+)\s*;/g;
    content = content.replace(assignmentRegex, (match, paramName) => {
      modified = true;emplacer les accès directs dans les appels de fonction
      return `= await params.${paramName};`;([^)]*?)params\.(\w+)([^)]*\))/g;
    });tent = content.replace(
      functionCallRegex,
    // Correction 4: Remplacer les accès dans les strings de template
    const templateRegex = /\${params\.(\w+)}/g;
    content = content.replace(templateRegex, (match, paramName) => {
      modified = true;
      return `\${await params.${paramName}}`;
    });
    // Correction 3: Remplacer les accès directs dans les assignations de variables
    // Écrire le fichier modifié*params\.(\w+)\s*;/g;
    if (modified) {nt.replace(assignmentRegex, (match, paramName) => {
      fs.writeFileSync(filePath, content);
      console.log(`  ✅ Fichier corrigé: ${path.relative(projectRoot, filePath)}`);
      return true;
    } else {
      console.log(`  ℹ️ Aucune correction nécessaire dans: ${path.relative(projectRoot, filePath)}`);
    }onst templateRegex = /\${params\.(\w+)}/g;
    content = content.replace(templateRegex, (match, paramName) => {
    return modified;e;
  } catch (error) {ait params.${paramName}}`;
    console.error(`  ❌ Erreur lors de la modification du fichier ${filePath}:`, error);
    return false;
  } // Écrire le fichier modifié
}   if (modified) {
      fs.writeFileSync(filePath, content);
// Correction spécifique pour le fichier indiqué dans l'erreur
const specificFilePath = path.join(h.relative(projectRoot, filePath)}`
  projectRoot, 
  'src', urn true;
  'app',se {
  'student',e.log(
  'learn', ℹ️ Aucune correction nécessaire dans: ${path.relative(
  'modules',ojectRoot,
  '[moduleId]',ath
  '[lessonId]',
  'page.tsx'
);  }

if (fs.existsSync(specificFilePath)) {
  console.log("Correction du fichier spécifique mentionné dans l'erreur...");
  if (fixParamsUsageInFile(specificFilePath)) {
    console.log("✅ Fichier spécifique corrigé avec succès!");th}:`,
  }   error
} else {
  console.log("⚠️ Le fichier spécifique n'existe pas ou n'a pas été trouvé.");
} }
}
// Rechercher et corriger tous les fichiers de routes dynamiques
console.log("\nRecherche et correction d'autres fichiers de routes dynamiques...");
const dynamicRouteFiles = findDynamicRouteFiles(appDirectory);
console.log(`Trouvé ${dynamicRouteFiles.length} fichiers de routes dynamiques.`);
  "src",
let fixedFiles = 0;
for (const file of dynamicRouteFiles) {
  if (file !== specificFilePath && fixParamsUsageInFile(file)) {
    fixedFiles++;
  }[moduleId]",
} "[lessonId]",
  "page.tsx"
console.log(`\n${fixedFiles + (fs.existsSync(specificFilePath) ? 1 : 0)} fichiers ont été corrigés pour l'utilisation correcte de params.`);
console.log("\nRedémarrez votre serveur Next.js pour appliquer les corrections.");
if (fs.existsSync(specificFilePath)) {
  console.log("Correction du fichier spécifique mentionné dans l'erreur...");
  if (fixParamsUsageInFile(specificFilePath)) {
    console.log("✅ Fichier spécifique corrigé avec succès!");
  }
} else {
  console.log("⚠️ Le fichier spécifique n'existe pas ou n'a pas été trouvé.");
}

// Rechercher et corriger tous les fichiers de routes dynamiques
console.log(
  "\nRecherche et correction d'autres fichiers de routes dynamiques..."
);
const dynamicRouteFiles = findDynamicRouteFiles(appDirectory);
console.log(
  `Trouvé ${dynamicRouteFiles.length} fichiers de routes dynamiques.`
);

let fixedFiles = 0;
for (const file of dynamicRouteFiles) {
  if (file !== specificFilePath && fixParamsUsageInFile(file)) {
    fixedFiles++;
  }
}

console.log(
  `\n${
    fixedFiles + (fs.existsSync(specificFilePath) ? 1 : 0)
  } fichiers ont été corrigés pour l'utilisation correcte de params.`
);
console.log(
  "\nRedémarrez votre serveur Next.js pour appliquer les corrections."
);
