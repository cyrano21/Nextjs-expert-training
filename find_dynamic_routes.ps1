# Script pour trouver les routes dynamiques
$rootPath = "g:\nextjs-expert-academy\src\app"

Get-ChildItem -Path $rootPath -Recurse -Directory | 
Where-Object { $_.Name -match '^\[.*\]$' } | 
ForEach-Object {
    Write-Host $_.FullName
}
