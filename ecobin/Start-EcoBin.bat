@echo off
title EcoBin 3D Smart Waste Platform
echo ========================================================
echo   Starting EcoBin 3D Smart Waste Management Platform...
echo ========================================================
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process 'http://localhost:5000'; & '%~dp0serve.ps1'"
pause
