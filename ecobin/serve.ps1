# EcoBin Local Development Server (Zero-Dependency PowerShell HTTP Server)
param (
    [int]$Port = 5000
)

$rootDir = $PSScriptRoot
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "   EcoBin 3D Smart Waste Platform - Development Server   " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "Serving static files from: $rootDir" -ForegroundColor Yellow
Write-Host "Local URL: http://localhost:$Port" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server.`n" -ForegroundColor Gray

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Prefixes.Add("http://127.0.0.1:$Port/")

try {
    $listener.Start()
} catch {
    Write-Host "Error starting HTTP listener on port $Port. Trying port $($Port + 1)..." -ForegroundColor Red
    $Port = $Port + 1
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$Port/")
    $listener.Start()
    Write-Host "Started on http://localhost:$Port" -ForegroundColor Cyan
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8";
    ".css"  = "text/css; charset=utf-8";
    ".js"   = "application/javascript; charset=utf-8";
    ".json" = "application/json; charset=utf-8";
    ".svg"  = "image/svg+xml";
    ".png"  = "image/png";
    ".jpg"  = "image/jpeg";
    ".jpeg" = "image/jpeg";
    ".webp" = "image/webp";
    ".ico"  = "image/x-icon";
    ".woff2"= "font/woff2";
    ".woff" = "font/woff";
    ".ttf"  = "font/ttf"
}

# Auto launch default browser
try {
    Start-Process "http://localhost:$Port"
} catch {
    # Non-blocking if running in headless or restricted session
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($urlPath) -or $urlPath -eq "") {
            $urlPath = "index.html"
        }

        $filePath = Join-Path $rootDir $urlPath
        # Fallback to index.html for SPA client-side routes if file does not exist and doesn't have an extension
        if (-not (Test-Path $filePath) -and -not [System.IO.Path]::HasExtension($urlPath)) {
            $filePath = Join-Path $rootDir "index.html"
        }

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            $response.ContentType = $mime
            $response.ContentLength64 = $bytes.Length
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate")
            $response.StatusCode = 200
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $urlPath")
            $response.ContentType = "text/plain"
            $response.ContentLength64 = $msg.Length
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
        $response.Close()
    } catch {
        # Handle client disconnect or abort
    }
}
