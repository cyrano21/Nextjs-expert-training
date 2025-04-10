# Script pour remplacer 'slug' par 'moduleId'
$rootPath = "g:\nextjs-expert-academy\src"

Get-ChildItem -Path $rootPath -Recurse -Include *.ts,*.tsx | ForEach-Object {
    $file = $_.FullName
    $content = Get-Content $file -Raw
    $newContent = $content -replace '\bslug\b', 'moduleId'
    
    if ($content -ne $newContent) {
        Set-Content -Path $file -Value $newContent
        Write-Host "Updated $file"
    }
}

# Renommer les dossiers dynamiques
Get-ChildItem -Path $rootPath -Recurse -Directory | 
Where-Object { $_.Name -eq "[slug]" } | 
ForEach-Object {
    $currentPath = $_.FullName
    $parentDir = Split-Path -Path $currentPath -Parent
    $newPath = Join-Path -Path $parentDir -ChildPath "[moduleId]"
    
    if (-not (Test-Path -Path $newPath)) {
        Move-Item -Path $currentPath -Destination $newPath
        Write-Host "Renamed $currentPath to $newPath"
    }
    else {
        Write-Host "Skipping $currentPath as [moduleId] already exists"
    }
}
