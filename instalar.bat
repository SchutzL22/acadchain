@echo off
setlocal enabledelayedexpansion
title AcadChain - Instalador Completo (Windows 11)

echo =======================================================
echo   AcadChain: Instalacao e Preparacao do Ambiente
echo   (Frontend, Backend Express, SQLite e Blockchain Hardhat)
echo =======================================================
echo.

cd /d "%~dp0"

echo [1/5] Verificando ambiente e ferramentas necessarias...

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao foi encontrado no PATH.
    echo Instale o Node.js 24 LTS ou superior: https://nodejs.org/
    pause
    exit /b 1
)

where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] npm nao foi encontrado no PATH.
    pause
    exit /b 1
)

where git >nul 2>&1
if %errorlevel% neq 0 (
    echo [AVISO] Git nao foi encontrado no PATH. Recomendamos instalar o Git for Windows.
)

node scripts/check-env.mjs
if %errorlevel% neq 0 (
    echo [ERRO] O ambiente nao atende aos requisitos minimos de compatibilidade.
    pause
    exit /b 1
)

echo.
echo [2/5] Verificando arquivo de configuracao (.env)...
if not exist "%~dp0.env" (
    copy "%~dp0.env.example" "%~dp0.env" >nul
    echo Arquivo .env criado a partir de .env.example.
) else (
    echo Arquivo .env ja existente. Mantendo configuracao atual.
)

echo.
echo [3/5] Instalando dependencias com npm workspaces (backend, client, blockchain)...
call npm install
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao instalar dependencias com o npm.
    pause
    exit /b 1
)

echo.
echo [4/5] Compilando contratos inteligentes Solidity (Hardhat)...
call npm run compile:contracts
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao compilar contratos inteligentes Solidity.
    pause
    exit /b 1
)

echo.
echo [5/5] Inicializando banco de dados local SQLite e dados ficticios...
node scripts/init-db.mjs
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao criar tabelas no banco SQLite.
    pause
    exit /b 1
)

node scripts/seed-db.mjs
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao popular dados ficticios de exemplo.
    pause
    exit /b 1
)

echo.
echo =======================================================
echo   Instalacao e compilacao concluidas com sucesso!
echo   Para iniciar a aplicacao completa: iniciar.bat
echo =======================================================
echo.
pause
