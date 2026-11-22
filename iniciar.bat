@echo off
setlocal enabledelayedexpansion
title AcadChain - Inicializador Integrado

cd /d "%~dp0"

echo =======================================================
echo   AcadChain: Inicializacao Integrada dos Servicos
echo   (No Ethereum 8545, Backend API 3001, Frontend 5173)
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
    if !errorlevel! neq 0 (
        echo [ERRO] Falha ao inicializar o banco de dados SQLite.
        pause
        exit /b 1
    )
)

echo [1/3] Iniciando No Ethereum Local Hardhat (Porta 8545)...
start "AcadChain No Ethereum Local (Porta 8545)" cmd /k "cd /d "%~dp0" && npm run dev:blockchain"

echo Aguardando no Ethereum responder em http://127.0.0.1:8545...
powershell -NoProfile -Command ^
  "$online = $false; for ($i = 0; $i -lt 25; $i++) { try { $res = Invoke-RestMethod -Uri 'http://127.0.0.1:8545' -Method Post -Body '{\"jsonrpc\":\"2.0\",\"method\":\"eth_blockNumber\",\"params\":[],\"id\":1}' -ContentType 'application/json' -TimeoutSec 2 -ErrorAction Stop; if ($res.result) { $online = $true; break } } catch {}; Start-Sleep -Milliseconds 800 }; if (-not $online) { Write-Host '[ERRO] No Ethereum nao respondeu no tempo limite.'; exit 1 } else { Write-Host '[OK] No Ethereum 8545 online e responsivo.' }"

if %errorlevel% neq 0 (
    echo.
    echo [ERRO CRITICO] O no Hardhat nao respondeu na porta 8545.
    echo Nao e possivel prosseguir com a inicializacao.
    pause
    exit /b 1
)

echo.
echo Realizando Deploy do Smart Contract na rede local...
call npm run deploy:local
if %errorlevel% neq 0 (
    echo.
    echo [ERRO CRITICO] Falha durante o deploy do contrato na rede Hardhat local.
    echo Verifique os logs da janela do No Ethereum para mais detalhes.
    pause
    exit /b 1
)

echo [OK] Smart contract implantado e inicializado com sucesso.
echo.

echo [2/3] Iniciando Servidor Backend API (Porta 3001)...
start "AcadChain Backend API (Porta 3001)" cmd /k "cd /d "%~dp0" && npm run dev:backend"

echo Aguardando Backend API responder em http://localhost:3001/api/health...
powershell -NoProfile -Command ^
  "$online = $false; for ($i = 0; $i -lt 25; $i++) { try { $res = Invoke-RestMethod -Uri 'http://localhost:3001/api/health' -TimeoutSec 2 -ErrorAction Stop; if ($res.status -eq 'ok' -or $res.sucesso) { $online = $true; break } } catch {}; Start-Sleep -Milliseconds 800 }; if (-not $online) { Write-Host '[ERRO] Backend API nao respondeu ao healthcheck.'; exit 1 } else { Write-Host '[OK] Backend API 3001 online e responsiva.' }"

if %errorlevel% neq 0 (
    echo.
    echo [ERRO CRITICO] O servidor Backend API nao respondeu em http://localhost:3001/api/health.
    pause
    exit /b 1
)

echo.
echo [3/3] Iniciando Interface Frontend React (Porta 5173)...
start "AcadChain Frontend (Porta 5173)" cmd /k "cd /d "%~dp0" && npm run dev:client"

echo Aguardando Frontend React responder em http://localhost:5173...
powershell -NoProfile -Command ^
  "$online = $false; for ($i = 0; $i -lt 20; $i++) { try { $res = Invoke-WebRequest -Uri 'http://localhost:5173' -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop; if ($res.StatusCode -eq 200) { $online = $true; break } } catch {}; Start-Sleep -Milliseconds 800 }; if (-not $online) { Write-Host '[AVISO] Frontend demorou a responder, mas foi iniciado em janela separada.' } else { Write-Host '[OK] Frontend React 5173 online.' }"

echo.
echo =======================================================
echo   SUCESSO: Todos os servicos do AcadChain estao ativos!
echo.
echo   * Frontend:       http://localhost:5173
echo   * Documentos:     http://localhost:5173/documentos
echo   * Validar PDF:    http://localhost:5173/verificar-pdf
echo   * Laboratorio:    http://localhost:5173/laboratorio
echo   * Explorador:     http://localhost:5173/explorador
echo   * Backend Health: http://localhost:3001/api/health
echo   * No Ethereum:    http://127.0.0.1:8545
echo.
echo   Para encerrar todos os servicos com seguranca: parar.bat
echo =======================================================
echo.
timeout /t 5 >nul
