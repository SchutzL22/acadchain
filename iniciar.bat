@echo off
setlocal enabledelayedexpansion
title AcadChain - Inicializador Geral

cd /d "%~dp0"

echo =======================================================
echo   AcadChain: Inicializacao Integrada dos Servicos
echo   (Nó Ethereum 8545, Backend API 3001, Frontend 5173)
echo =======================================================
echo.

if not exist "%~dp0node_modules" (
    echo [ERRO] Dependencias nao encontradas! Execute instalar.bat primeiro.
    pause
    exit /b 1
)

if not exist "%~dp0dados\acadchain.sqlite" (
    echo [AVISO] Banco SQLite nao encontrado. Inicializando banco...
    node scripts/init-db.mjs
    node scripts/seed-db.mjs
)

echo [1/3] Iniciando No Ethereum Local Hardhat (Porta 8545)...
start "AcadChain No Ethereum Local (Porta 8545)" cmd /k "cd /d "%~dp0" && npm run dev:blockchain"

echo Aguardando no Ethereum responder em http://127.0.0.1:8545...
powershell -NoProfile -Command "$tentativas = 0; while ($tentativas -lt 20) { try { $res = Invoke-RestMethod -Uri 'http://127.0.0.1:8545' -Method Post -Body '{\"jsonrpc\":\"2.0\",\"method\":\"eth_blockNumber\",\"params\":[],\"id\":1}' -ContentType 'application/json' -TimeoutSec 2 -ErrorAction Stop; if ($res.result) { Write-Host 'No Ethereum online!'; exit 0 } } catch {}; Start-Sleep -Milliseconds 1000; $tentativas++ }; Write-Host 'Aviso: No demorou a responder, prosseguindo...'"

echo Realizando Deploy do Smart Contract na rede local...
call npm run deploy:local
if %errorlevel% neq 0 (
    echo [AVISO] Ocorreu uma falha durante o deploy do contrato.
)

echo.
echo [2/3] Iniciando Servidor Backend API (Porta 3001)...
start "AcadChain Backend API (Porta 3001)" cmd /k "cd /d "%~dp0" && npm run dev:backend"

echo.
echo [3/3] Iniciando Interface Frontend React (Porta 5173)...
start "AcadChain Frontend (Porta 5173)" cmd /k "cd /d "%~dp0" && npm run dev:client"

echo.
echo =======================================================
echo   Todos os servicos do AcadChain foram iniciados!
echo.
echo   * Frontend:       http://localhost:5173
echo   * Laboratório:    http://localhost:5173/laboratorio
echo   * Explorador:     http://localhost:5173/explorador
echo   * Backend Health: http://localhost:3001/api/health
echo   * No Ethereum:    http://127.0.0.1:8545
echo.
echo   Para encerrar todos os servicos com seguranca: parar.bat
echo =======================================================
echo.
timeout /t 3 >nul
