@echo off
echo === CONFIGURATION DE L'ENVIRONNEMENT AI POUR TON PROJET ===

:: 1. Vérifie que VS Code est installé
where code >nul 2>&1
if %errorlevel% neq 0 (
    echo [❌] VS Code n'est pas installé. Installe-le d'abord.
    pause
    exit /b
)

:: 2. Installer l'extension Continue.dev si elle n'est pas déjà là
echo [🔧] Installation de Continue.dev...
code --install-extension Continue.continue

:: 3. Créer un fichier de configuration .continue dans le dossier utilisateur
echo [⚙️] Configuration Continue.dev avec modèle local Ollama...
mkdir "%USERPROFILE%\.continue" >nul 2>&1
echo {
  "llm": {
    "provider": "ollama",
    "model": "deepseek-coder:14b"
  },
  "embeddings": {
    "provider": "local"
  }
} > "%USERPROFILE%\.continue\config.json"

:: 4. Indexation du projet (simulation, en vrai on lancerait un script Node/Python ici)
echo [📦] Indexation du dossier src pour meilleure compréhension contextuelle...
echo (Cette étape est automatique dans Continue.dev, ou à personnaliser avec un script en JS plus tard)

:: 5. Lancer VS Code avec ce dossier
echo [🚀] Lancement de VS Code...
code .

pause
