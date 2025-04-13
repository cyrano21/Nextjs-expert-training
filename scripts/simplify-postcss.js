const fs = require("fs");
const path = require("path");

console.log("=== Simplification de la configuration PostCSS ===");

try {
  const postcssConfigPath = path.join(__dirname, "..", "postcss.config.js");
  const simpleConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;

  fs.writeFileSync(postcssConfigPath, simpleConfig);
  console.log("✅ Configuration PostCSS simplifiée");

  console.log("\nRedémarrez votre serveur de développement avec:");
  console.log("npm run dev");
} catch (error) {
  console.error("\n❌ Erreur:", error.message);
}
