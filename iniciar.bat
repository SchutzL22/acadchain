@echo off
setlocal
title AcadChain - Inicializador

cd /d "%~dp0"

echo =======================================================
echo   AcadChain: Inicializacao dos Servidores Locais
echo =======================================================
echo.

if not exist "%~dp0dados\acadchain.sqlite" (
    echo [AVISO] Banco de dados nao encontrado!
    echo Executando inicializacao do banco...
    node scripts/init-db.mjs
    node scripts/seed-db.mjs
)

echo [1/2] Iniciando Servidor Backend (Porta 3001)...
start "AcadChain Backend API (Porta 3001)" cmd /k "cd /d "%~dp0" && npm run dev:backend"

echo [2/2] Iniciando Interface Frontend (Porta 5173)...
start "AcadChain Frontend (Porta 5173)" cmd /k "cd /d "%~dp0" && npm run dev:client"

echo.
echo =======================================================
echo   Servidores iniciados em janelas dedicadas!
echo.
echo   Frontend:  http://localhost:5173
echo   API REST:  http://localhost:3001/api/health
echo.
echo   Para encerrar a aplicacao com seguranca: parar.bat
echo =======================================================
echo.
timeout /t 3 >nul
