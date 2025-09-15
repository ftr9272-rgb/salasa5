# Deploy frontend helper
# Usage: .\deploy_frontend.ps1
# Steps:
# 1. Build the frontend (pnpm build)
# 2. Back up the current backend index.html if it exists
# 3. Copy the built dist/ into the backend static folder (mirror)
# 4. If the backend index.html was modified by user, restore it

$frontend = Join-Path $PSScriptRoot "..\enhanced-business-platform"
$backendStatic = Join-Path $PSScriptRoot "..\business-platform-api\src\static"
$backendIndex = Join-Path $backendStatic "index.html"
$backupIndex = Join-Path $PSScriptRoot "index.html.backup"

Write-Host "Building frontend..."
Push-Location $frontend
pnpm install
pnpm build
Pop-Location

if (Test-Path $backendIndex) {
    Write-Host "Backing up existing backend index.html to $backupIndex"
    Copy-Item $backendIndex $backupIndex -Force
}

Write-Host "Copying dist/ to backend static folder..."
$dist = Join-Path $frontend "dist"
robocopy $dist $backendStatic /MIR /NFL /NDL /NJH /NJS | Out-Null

# If the user had a custom index.html backup, prefer it
if (Test-Path $backupIndex) {
    Write-Host "Restoring user's index.html (preserving manual edits)"
    Copy-Item $backupIndex $backendIndex -Force
}

Write-Host "Deploy complete. You may need to restart your backend server to pick up new static files."