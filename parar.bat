@echo off
setlocal
title AcadChain - Parar Servicos

echo =======================================================
echo   AcadChain: Encerrando Servicos Locais
echo =======================================================
echo.

echo Localizando e encerrando processos que utilizam as portas 3001 e 5173...

powershell -NoProfile -Command ^
  "$ports = @(3001, 5173); foreach ($p in $ports) { $conns = Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue; if ($conns) { foreach ($c in $conns) { try { Stop-Process -Id $c.OwningProcess -Force -ErrorAction Stop; Write-Host ('Processo finalizado na porta ' + $p + ' (PID: ' + $c.OwningProcess + ')') } catch { Write-Host ('Nao foi possivel finalizar PID ' + $c.OwningProcess) } } } else { Write-Host ('Nenhum servico escutando na porta ' + $p) } }"

echo.
echo =======================================================
echo   Operacao concluida com sucesso.
echo =======================================================
echo.
timeout /t 2 >nul
