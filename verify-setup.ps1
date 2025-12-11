# PlateMate Backend Setup Verification Script
# Run this script after installing Java 21 to verify your setup

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PlateMate Backend Setup Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Check Java Installation
Write-Host "1. Checking Java Installation..." -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1 | Select-String "version"
    if ($javaVersion -match "21") {
        Write-Host "   ✓ Java 21 is installed" -ForegroundColor Green
        Write-Host "   Version: $javaVersion" -ForegroundColor Gray
    } elseif ($javaVersion -match "version") {
        Write-Host "   ✗ Java 21 NOT found. Current version:" -ForegroundColor Red
        Write-Host "   $javaVersion" -ForegroundColor Red
        Write-Host "   Please install Java 21 (see SETUP_JAVA21.md)" -ForegroundColor Yellow
        $allGood = $false
    } else {
        Write-Host "   ✗ Java not found in PATH" -ForegroundColor Red
        $allGood = $false
    }
} catch {
    Write-Host "   ✗ Java command not found" -ForegroundColor Red
    $allGood = $false
}
Write-Host ""

# Check JAVA_HOME
Write-Host "2. Checking JAVA_HOME environment variable..." -ForegroundColor Yellow
if ($env:JAVA_HOME) {
    if (Test-Path $env:JAVA_HOME) {
        $javaHomeVersion = Get-Content "$env:JAVA_HOME\release" -ErrorAction SilentlyContinue | Select-String "JAVA_VERSION"
        if ($javaHomeVersion -match "21") {
            Write-Host "   ✓ JAVA_HOME is set to Java 21" -ForegroundColor Green
            Write-Host "   Path: $env:JAVA_HOME" -ForegroundColor Gray
        } else {
            Write-Host "   ⚠ JAVA_HOME is set but not to Java 21" -ForegroundColor Yellow
            Write-Host "   Current: $env:JAVA_HOME" -ForegroundColor Gray
            Write-Host "   $javaHomeVersion" -ForegroundColor Gray
        }
    } else {
        Write-Host "   ✗ JAVA_HOME points to non-existent path" -ForegroundColor Red
        Write-Host "   Path: $env:JAVA_HOME" -ForegroundColor Gray
        $allGood = $false
    }
} else {
    Write-Host "   ⚠ JAVA_HOME is not set" -ForegroundColor Yellow
    Write-Host "   This may cause issues with Maven wrapper" -ForegroundColor Gray
}
Write-Host ""

# Check Project Structure
Write-Host "3. Checking project structure..." -ForegroundColor Yellow
$projectRoot = $PSScriptRoot
$requiredFiles = @(
    "pom.xml",
    "mvnw.cmd",
    "src\main\java\com\platemate\PlateMateApplication.java",
    "src\main\resources\application.properties"
)

$structureGood = $true
foreach ($file in $requiredFiles) {
    $fullPath = Join-Path $projectRoot $file
    if (Test-Path $fullPath) {
        Write-Host "   ✓ Found: $file" -ForegroundColor Green
    } else {
        Write-Host "   ✗ Missing: $file" -ForegroundColor Red
        $structureGood = $false
        $allGood = $false
    }
}
Write-Host ""

# Check if compiled classes exist
Write-Host "4. Checking for compiled classes..." -ForegroundColor Yellow
$classFile = Join-Path $projectRoot "target\classes\com\platemate\PlateMateApplication.class"
if (Test-Path $classFile) {
    Write-Host "   ✓ Project has been compiled" -ForegroundColor Green
    Write-Host "   Found: PlateMateApplication.class" -ForegroundColor Gray
} else {
    Write-Host "   ⚠ Project has not been compiled yet" -ForegroundColor Yellow
    Write-Host "   Run: Maven → Install in STS4" -ForegroundColor Gray
}
Write-Host ""

# Check PostgreSQL (if psql is available)
Write-Host "5. Checking PostgreSQL connection..." -ForegroundColor Yellow
try {
    $pgTest = & psql --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ PostgreSQL client is available" -ForegroundColor Green
        Write-Host "   Note: Ensure PostgreSQL server is running on localhost:5432" -ForegroundColor Gray
    } else {
        Write-Host "   ⚠ PostgreSQL client not found in PATH" -ForegroundColor Yellow
        Write-Host "   (This is okay if you're using pgAdmin or other tools)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ⚠ Cannot verify PostgreSQL client" -ForegroundColor Yellow
    Write-Host "   Ensure PostgreSQL server is running" -ForegroundColor Gray
}
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
if ($allGood) {
    Write-Host "✓ Setup looks good!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Open STS4 and import this project" -ForegroundColor White
    Write-Host "2. Configure Java 21 in STS4 (Window → Preferences → Java → Installed JREs)" -ForegroundColor White
    Write-Host "3. Update Maven project (Right-click → Maven → Update Project)" -ForegroundColor White
    Write-Host "4. Build project (Right-click → Maven → Install)" -ForegroundColor White
    Write-Host "5. Run application (Right-click PlateMateApplication.java → Run As → Spring Boot App)" -ForegroundColor White
} else {
    Write-Host "⚠ Some issues found. Please fix them before proceeding." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Common fixes:" -ForegroundColor Yellow
    Write-Host "- Install Java 21 (see SETUP_JAVA21.md)" -ForegroundColor White
    Write-Host "- Set JAVA_HOME environment variable" -ForegroundColor White
    Write-Host "- Restart terminal/STS4 after installing Java" -ForegroundColor White
}
Write-Host "========================================" -ForegroundColor Cyan

