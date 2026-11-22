@echo off
setlocal enabledelayedexpansion
title AcadChain - Instalador (Windows 11)

echo =======================================================
echo   AcadChain: Instalacao e Preparacao do Ambiente
echo =======================================================
echo.

cd /d "%~dp0"

echo [1/4] Verificando ferramentas necessarias...

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao foi encontrado no PATH.
    echo Por favor, instale o Node.js 24 LTS ou superior: https://nodejs.org/
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
    echo [ERRO] O ambiente nao atende aos requisitos minimos.
    pause
    exit /b 1
)

echo.
echo [2/4] Copiando .env.example para .env caso nao exista...
if not exist "%~dp0.env" (
    copy "%~dp0.env.example" "%~dp0.env" >nul
    echo Arquivo .env criado com sucesso.
) else (
    echo Arquivo .env ja existente. Mantendo configuracao atual.
)

echo.
echo [3/4] Instalando dependencias com npm workspaces...
call npm install
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao instalar dependencias com o npm.
    pause
    exit /b 1
)

echo.
echo [4/4] Inicializando banco de dados local SQLite e dados ficticios...
node scripts/init-db.mjs
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao criar tabelas no banco de dados.
    pause
    exit /b 1
)

node scripts/seed-db.mjs
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao inserir dados ficticios de exemplo.
    pause
    exit /b 1
)

echo.
echo =======================================================
echo   Instalacao concluida com sucesso!
echo   Para iniciar a aplicacao, execute: iniciar.bat
echo =======================================================
echo.
pause
