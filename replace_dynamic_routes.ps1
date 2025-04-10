# Script pour uniformiser les routes dynamiques

$rootPath = "G:\nextjs-expert-academy\src"

# Étape 1 : Lister tous les dossiers dynamiques
Write-Host "Dossiers dynamiques actuels :"
Get-ChildItem -Path $rootPath -Directory -Recurse | 
    Where-Object { $_.Name -match "^\[.*\]$" } | 
    Select-Object FullName, Name

# Étape 2 : Renommer les dossiers [slug] en [moduleId]
Get-ChildItem -Path $rootPath -Directory -Recurse |
    Where-Object { $_.Name -eq "[slug]" } |
    ForEach-Object {
        $file = $_.FullName
        $parentPath = $_.Parent.FullName
        $newName = "[moduleId]"
        $newFullPath = Join-Path $parentPath $newName

        if (-Not (Test-Path $newFullPath)) {
            Move-Item -Path $file -Destination $newFullPath
            Write-Host "Renommé $file en $newFullPath"
        }
        else {
            Write-Host "Le dossier $newFullPath existe déjà. Ignoré pour $file."
        }
    }

# Étape 3 : Remplacer 'slug' par 'moduleId' dans tous les fichiers
Get-ChildItem -Path $rootPath -Recurse -Include *.ts,*.tsx,*.js,*.jsx | 
    ForEach-Object {
        $file = $_.FullName
        $content = Get-Content $file
        $newContent = $content -replace '\bslug\b', 'moduleId'
        
        if (($content | Out-String) -ne ($newContent | Out-String)) {
            $newContent | Set-Content -Path $file
            Write-Host "Mis à jour : $file"
        }
    }

Write-Host "Processus terminé."
