@echo off
setlocal
title AcadChain - Restaurar Dados Demonstrativos

echo =======================================================
echo   AcadChain: Restauracao de Dados e Rede de Demonstacao
echo =======================================================
echo.
echo ATENCAO: Esta acao ira:
echo  1. Encerrar processos ativos nas portas 8545, 3001 e 5173.
echo  2. Recriar o banco de dados SQLite local (dados/acadchain.sqlite).
echo  3. Reinserir as 3 instituicoes e estudantes de fabrica.
echo  4. Limpar transacoes antigas.
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
echo Encerrando processos do AcadChain...
call "%~dp0parar.bat"

echo.
echo Recriando banco de dados SQLite demonstrativo...
cd /d "%~dp0"
node scripts/reset-db.mjs

if %errorlevel% equ 0 (
    echo.
    echo =======================================================
    echo   Dados demonstrativos restaurados com sucesso!
    echo   Para iniciar novamente: iniciar.bat
    echo =======================================================
) else (
    echo.
    echo [ERRO] Ocorreu uma falha ao restaurar os dados demonstrativos.
)

echo.
pause
