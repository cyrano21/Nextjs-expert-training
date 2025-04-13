const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("=== Installation de postcss-nested ===");

try {
  // Installer postcss-nested
  console.log("Installation de postcss-nested...");
  execSync("npm install postcss-nested --save-dev", { stdio: "inherit" });

  // Mettre à jour la configuration PostCSS
  const postcssConfigPath = path.join(__dirname, "..", "postcss.config.js");
  const postcssConfig = `// postcss.config.js
module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-nested': {},
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;

  fs.writeFileSync(postcssConfigPath, postcssConfig);
  console.log("✅ Configuration PostCSS mise à jour avec postcss-nested");

  console.log("\nRedémarrez votre serveur de développement avec:");
  console.log("npm run dev");
} catch (error) {
  console.error("\n❌ Erreur:", error.message);
}
