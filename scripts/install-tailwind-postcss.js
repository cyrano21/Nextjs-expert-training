const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Vérifier si @tailwindcss/postcss est déjà installé
const packageJsonPath = path.join(__dirname, "..", "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

if (
  !packageJson.dependencies["@tailwindcss/postcss"] &&
  !packageJson.devDependencies["@tailwindcss/postcss"]
) {
  console.log("Installation de @tailwindcss/postcss...");
  try {
    execSync("npm install @tailwindcss/postcss --save-dev", {
      stdio: "inherit",
    });
    console.log("Installation réussie!");
  } catch (error) {
    console.error("Erreur lors de l'installation:", error);
    process.exit(1);
  }
} else {
  console.log("@tailwindcss/postcss est déjà installé.");
}

// Mettre à jour le fichier postcss.config.js
const postcssConfigPath = path.join(__dirname, "..", "postcss.config.js");
const postcssConfig = `module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
`;

fs.writeFileSync(postcssConfigPath, postcssConfig);
console.log("Le fichier postcss.config.js a été mis à jour.");
