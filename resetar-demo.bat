@echo off
setlocal
title AcadChain - Resetar Dados Demonstrativos

echo =======================================================
echo   AcadChain: Restauracao de Dados de Demonstracao
echo =======================================================
echo.
echo ATENCAO: Esta acao ira recriar o banco de dados SQLite local
echo (dados/acadchain.sqlite) e reinserir os dados ficticios de fabrica.
echo.

set /p CONFIRMA="Deseja realmente continuar? (S/N): "
if /i not "%CONFIRMA%"=="S" (
    echo.
    echo Operacao cancelada pelo usuario.
    echo.
    pause
    exit /b 0
)

echo.
echo Encerrando processos eventuais nas portas da aplicacao...
call "%~dp0parar.bat"

echo.
echo Recriando banco de dados com dados de teste...
cd /d "%~dp0"
node scripts/reset-db.mjs

if %errorlevel% equ 0 (
    echo.
    echo =======================================================
    echo   Banco de dados demonstrativo restaurado com sucesso!
    echo =======================================================
) else (
    echo.
    echo [ERRO] Ocorreu uma falha ao restaurar o banco de dados.
)

echo.
pause
