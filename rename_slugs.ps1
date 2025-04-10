# Script pour renommer les dossiers [slug] en [moduleId]
Get-ChildItem -Path "g:\nextjs-expert-academy\src" -Recurse -Directory | 
Where-Object { $_.Name -eq "[slug]" } | 
ForEach-Object {
    $currentPath = $_.FullName
    $parentPath = Split-Path -Path $currentPath -Parent
    $newPath = Join-Path -Path $parentPath -ChildPath "[moduleId]"
    
    # Vérifier si [moduleId] existe déjà
    if (-not (Test-Path -Path $newPath)) {
        Rename-Item -Path $currentPath -NewName "[moduleId]"
        Write-Host "Renamed $currentPath to $newPath"
    }
    else {
        Write-Host "Skipping $currentPath as [moduleId] already exists"
    }
}
