# Pre-Push Verification Script
# Run this before pushing to GitHub to ensure no sensitive data is committed

Write-Host "`n🔍 SolKernal - Pre-Push Verification Script`n" -ForegroundColor Cyan

$errors = 0

# Check 1: Verify git is initialized
Write-Host "✓ Checking git initialization..." -ForegroundColor Yellow
if (Test-Path .git) {
    Write-Host "  ✅ Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "  ❌ Git not initialized. Run: git init" -ForegroundColor Red
    $errors++
}

# Check 2: Verify .gitignore exists
Write-Host "`n✓ Checking .gitignore..." -ForegroundColor Yellow
if (Test-Path .gitignore) {
    Write-Host "  ✅ .gitignore exists" -ForegroundColor Green
} else {
    Write-Host "  ❌ .gitignore missing!" -ForegroundColor Red
    $errors++
}

# Check 3: Verify LICENSE exists
Write-Host "`n✓ Checking LICENSE..." -ForegroundColor Yellow
if (Test-Path LICENSE) {
    Write-Host "  ✅ LICENSE exists" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  LICENSE missing" -ForegroundColor Yellow
}

# Check 4: Verify CONTRIBUTING.md exists
Write-Host "`n✓ Checking CONTRIBUTING.md..." -ForegroundColor Yellow
if (Test-Path CONTRIBUTING.md) {
    Write-Host "  ✅ CONTRIBUTING.md exists" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  CONTRIBUTING.md missing" -ForegroundColor Yellow
}

# Check 5: Verify sensitive files are ignored
Write-Host "`n✓ Checking if sensitive files are properly ignored..." -ForegroundColor Yellow

$sensitiveFiles = @(
    "web\.env",
    "web\.env.local", 
    "web\.env.production",
    "web\dev.db",
    "web\.next",
    "web\node_modules"
)

foreach ($file in $sensitiveFiles) {
    $ignored = git check-ignore $file 2>$null
    if ($ignored) {
        Write-Host "  ✅ $file is ignored" -ForegroundColor Green
    } else {
        if (Test-Path $file) {
            Write-Host "  ❌ $file EXISTS but NOT IGNORED!" -ForegroundColor Red
            $errors++
        }
    }
}

# Check 6: Verify no .env files will be committed
Write-Host "`n✓ Checking for .env files in git index..." -ForegroundColor Yellow
$envInGit = git ls-files | Select-String "\.env[^.]" 
if ($envInGit) {
    Write-Host "  ❌ Found .env files in git:" -ForegroundColor Red
    $envInGit | ForEach-Object { Write-Host "    - $_" -ForegroundColor Red }
    $errors++
} else {
    Write-Host "  ✅ No .env files in git index" -ForegroundColor Green
}

# Check 7: Verify no .db files will be committed  
Write-Host "`n✓ Checking for database files in git index..." -ForegroundColor Yellow
$dbInGit = git ls-files | Select-String "\.db$|\.sqlite"
if ($dbInGit) {
    Write-Host "  ❌ Found database files in git:" -ForegroundColor Red
    $dbInGit | ForEach-Object { Write-Host "    - $_" -ForegroundColor Red }
    $errors++
} else {
    Write-Host "  ✅ No database files in git index" -ForegroundColor Green
}

# Check 8: Verify .env.example exists
Write-Host "`n✓ Checking for .env.example..." -ForegroundColor Yellow
if (Test-Path "web\.env.example") {
    Write-Host "  ✅ .env.example exists" -ForegroundColor Green
    
    # Check if it has real secrets
    $envExample = Get-Content "web\.env.example" -Raw
    if ($envExample -match "sk-[a-zA-Z0-9]{20}|cf_[a-zA-Z0-9]+") {
        Write-Host "  ⚠️  .env.example might contain real API keys!" -ForegroundColor Red
        $errors++
    }
} else {
    Write-Host "  ⚠️  .env.example missing" -ForegroundColor Yellow
}

# Check 9: Verify package.json has repository info
Write-Host "`n✓ Checking package.json..." -ForegroundColor Yellow
if (Test-Path "web\package.json") {
    $pkg = Get-Content "web\package.json" -Raw | ConvertFrom-Json
    if ($pkg.repository) {
        Write-Host "  ✅ Repository info present" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  No repository info in package.json" -ForegroundColor Yellow
    }
}

# Final Summary
Write-Host "`n" + ("="*60) -ForegroundColor Cyan
if ($errors -eq 0) {
    Write-Host "✅ ALL CHECKS PASSED! Safe to push to GitHub." -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Cyan
    Write-Host "  1. git add ." -ForegroundColor White
    Write-Host "  2. git commit -m 'Initial commit: SolKernal v1.0'" -ForegroundColor White
    Write-Host "  3. git remote add origin https://github.com/SolKernalXYZ/web.git" -ForegroundColor White
    Write-Host "  4. git push -u origin main" -ForegroundColor White
} else {
    Write-Host "❌ FOUND $errors ERROR(S)! DO NOT PUSH YET." -ForegroundColor Red
    Write-Host "   Fix the errors above before pushing." -ForegroundColor Red
}
Write-Host ("="*60) -ForegroundColor Cyan
Write-Host ""
