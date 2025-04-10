import fs from "fs";
import path from "path";
import { createCanvas } from "canvas";
import { fileURLToPath } from "url";

// Obtenir le répertoire actuel en contexte ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "..", "public");

// Assurez-vous que le répertoire public existe
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Fonction pour créer une icône temporaire
function createIcon(size, filename) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // Fond
  ctx.fillStyle = "#3b82f6"; // Bleu clair
  ctx.fillRect(0, 0, size, size);

  // Texte "EA" pour Expert Academy
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${size * 0.5}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("EA", size / 2, size / 2);

  // Enregistrer l'image
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(path.join(publicDir, filename), buffer);
  console.log(`Created ${filename}`);
}

// Création des différentes tailles d'icônes
createIcon(16, "favicon-16x16.png");
createIcon(32, "favicon-32x32.png");
createIcon(180, "apple-touch-icon.png");
createIcon(192, "android-chrome-192x192.png");
createIcon(512, "android-chrome-512x512.png");

console.log("All favicons generated successfully");
