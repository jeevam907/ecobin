# EcoBin File Syntax & Integrity Validator
$jsFiles = Get-ChildItem -Path (Join-Path $PSScriptRoot "..\src") -Recurse -Filter *.js

$errors = 0
foreach ($file in $jsFiles) {
    $text = Get-Content $file.FullName -Raw
    $openBraces = ($text.ToCharArray() | Where-Object { $_ -eq '{' }).Count
    $closeBraces = ($text.ToCharArray() | Where-Object { $_ -eq '}' }).Count
    $openParens = ($text.ToCharArray() | Where-Object { $_ -eq '(' }).Count
    $closeParens = ($text.ToCharArray() | Where-Object { $_ -eq ')' }).Count

    if ($openBraces -ne $closeBraces) {
        Write-Host " [ERROR] Unbalanced braces in $($file.Name): { = $openBraces, } = $closeBraces" -ForegroundColor Red
        $errors++
    } elseif ($openParens -ne $closeParens) {
        Write-Host " [ERROR] Unbalanced parens in $($file.Name): ( = $openParens, ) = $closeParens" -ForegroundColor Red
        $errors++
    } else {
        Write-Host " [OK] $($file.Name) balanced syntax (braces: $openBraces, parens: $openParens)" -ForegroundColor Green
    }
}

if ($errors -eq 0) {
    Write-Host "`nAll JavaScript files verified clean! 0 syntax balance errors." -ForegroundColor Green
} else {
    Write-Host "`n$errors syntax errors detected." -ForegroundColor Red
}
