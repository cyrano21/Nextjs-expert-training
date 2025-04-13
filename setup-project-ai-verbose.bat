@echo off
echo === CONFIGURATION DE L'ENVIRONNEMENT AI POUR TON PROJET ===
pause

:: 1. Vérifie que VS Code est installé
where code >nul 2>&1
if %errorlevel% neq 0 (
    echo [❌] VS Code n'est pas installé. Installe-le d'abord.
    pause
    exit /b
)

:: 2. Installer l'extension Continue.dev (forcer la réinstallation)
echo [🔧] (Ré)installation de Continue.dev...
code --install-extension Continue.continue --force
if %errorlevel% neq 0 (
    echo [⚠️] Problème lors de l'installation de l'extension Continue.dev.
    pause
    exit /b
)

:: 3. Créer ou mettre à jour le fichier de configuration .continue
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
echo [✅] Fichier de configuration écrit dans %%USERPROFILE%%\.continue\config.json

pause

:: 4. Lancer VS Code avec le dossier courant
echo [🚀] Lancement de VS Code...
code .

echo [✅] Configuration terminée. Tu peux maintenant utiliser l'IA dans VS Code via Continue.
pause
