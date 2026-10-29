# EcoBin Phase 1 Validation & Integrity Check
param()

$root = $PSScriptRoot | Split-Path -Parent
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "         EcoBin Phase 1 Verification & Test Suite         " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Green

$requiredFiles = @(
    "index.html",
    "package.json",
    "serve.ps1",
    "src\config.js",
    "src\store.js",
    "src\router.js",
    "src\main.js",
    "src\styles\tokens.css",
    "src\styles\main.css",
    "src\styles\components.css",
    "src\components\3d\EcoBin3DCanvas.js",
    "src\components\3d\IsometricCity.js",
    "src\components\ui\Button.js",
    "src\components\ui\Card.js",
    "src\components\ui\Badge.js",
    "src\components\ui\Toast.js",
    "src\components\ui\Skeleton.js",
    "src\components\navigation\Header.js",
    "src\components\navigation\CitizenBottomNav.js",
    "src\components\navigation\Sidebar.js",
    "src\pages\LandingPage.js",
    "src\pages\AuthPage.js",
    "src\pages\CitizenDashboardPage.js",
    "src\pages\CitizenReportPage.js",
    "src\pages\CitizenTrackingPage.js",
    "src\pages\BinMapPage.js",
    "src\pages\OfficerDashboardPage.js",
    "src\pages\AdminDashboardPage.js",
    "src\pages\AnalyticsPage.js",
    "src\pages\ControlPanelPage.js",
    "src\pages\ProfilePage.js"
)

$missing = 0
foreach ($rel in $requiredFiles) {
    $full = Join-Path $root $rel
    if (Test-Path $full) {
        $size = (Get-Item $full).Length
        Write-Host " [PASS] $rel ($size bytes)" -ForegroundColor Green
    } else {
        Write-Host " [FAIL] Missing file: $rel" -ForegroundColor Red
        $missing++
    }
}

# Verify CSS Tokens
Write-Host "`n--- Checking Design Tokens ---" -ForegroundColor Yellow
$tokensContent = Get-Content (Join-Path $root "src\styles\tokens.css") -Raw
$requiredTokens = @(
    "--color-emerald-500",
    "--color-lime-400",
    "--color-sky-500",
    "--color-teal-500",
    "--color-purple-500",
    "--shadow-3d-lg",
    "--shadow-btn-3d",
    "--grad-hero"
)

foreach ($tok in $requiredTokens) {
    if ($tokensContent.Contains($tok)) {
        Write-Host " [PASS] Token defined: $tok" -ForegroundColor Green
    } else {
        Write-Host " [FAIL] Missing token: $tok" -ForegroundColor Red
        $missing++
    }
}

# Verify PRD Routes in Router
Write-Host "`n--- Checking PRD Routes in main.js ---" -ForegroundColor Yellow
$mainContent = Get-Content (Join-Path $root "src\main.js") -Raw
$routesToCheck = @(
    "'/'",
    "'/login'",
    "'/register'",
    "'/forgot-password'",
    "'/citizen/dashboard'",
    "'/citizen/report/new'",
    "'/citizen/complaint/:id'",
    "'/citizen/map'",
    "'/citizen/profile'",
    "'/officer/dashboard'",
    "'/admin/dashboard'",
    "'/admin/analytics'",
    "'/admin/control/users'"
)

foreach ($r in $routesToCheck) {
    if ($mainContent.Contains($r)) {
        Write-Host " [PASS] Route registered: $r" -ForegroundColor Green
    } else {
        Write-Host " [FAIL] Missing route: $r" -ForegroundColor Red
        $missing++
    }
}

Write-Host "`n==========================================================" -ForegroundColor Green
if ($missing -eq 0) {
    Write-Host " ALL PHASE 1 CHECKS PASSED! (0 errors)" -ForegroundColor Green
} else {
    Write-Host " CHECKS FAILED: $missing errors found." -ForegroundColor Red
}
Write-Host "==========================================================" -ForegroundColor Green
