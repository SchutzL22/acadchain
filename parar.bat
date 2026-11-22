@echo off
setlocal
title AcadChain - Encerrar Servicos

echo =======================================================
echo   AcadChain: Encerrando Servicos Locais do Projeto
echo =======================================================
echo.

echo Localizando especificamente processos pertencentes ao AcadChain...

powershell -NoProfile -Command ^
  "$ports = @(8545, 3001, 5173); $stopped = 0;" ^
  "foreach ($p in $ports) {" ^
  "  $conns = Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue;" ^
  "  if ($conns) {" ^
  "    foreach ($c in $conns) {" ^
  "      $proc = Get-CimInstance Win32_Process -Filter ('ProcessId = ' + $c.OwningProcess) -ErrorAction SilentlyContinue;" ^
  "      if ($proc) {" ^
  "        $cmd = if ($proc.CommandLine) { $proc.CommandLine } else { '' };" ^
  "        $isAcadChain = ($cmd -like '*acadchain*' -or $cmd -like '*hardhat*' -or $cmd -like '*tsx*' -or $cmd -like '*vite*' -or $proc.Name -eq 'node.exe');" ^
  "        if ($isAcadChain) {" ^
  "          try {" ^
  "            Stop-Process -Id $c.OwningProcess -Force -ErrorAction Stop;" ^
  "            Write-Host ('[OK] Processo AcadChain encerrado na porta ' + $p + ' (PID ' + $c.OwningProcess + ' - ' + $proc.Name + ')');" ^
  "            $stopped++;" ^
  "          } catch {" ^
  "            Write-Host ('[AVISO] Falha ao encerrar PID ' + $c.OwningProcess);" ^
  "          }" ^
  "        } else {" ^
  "          Write-Host ('[PRESERVADO] Porta ' + $p + ' em uso por processo nao pertencente ao AcadChain (PID ' + $c.OwningProcess + ' - ' + $proc.Name + '). Nao finalizado.');" ^
  "        }" ^
  "      }" ^
  "    }" ^
  "  } else {" ^
  "    Write-Host ('[INFO] Nenhum servico escutando na porta ' + $p);" ^
  "  }" ^
  "};" ^
  "$acadWindows = Get-Process | Where-Object { $_.MainWindowTitle -like 'AcadChain*' };" ^
  "if ($acadWindows) { foreach ($w in $acadWindows) { try { Stop-Process -Id $w.Id -Force -ErrorAction SilentlyContinue } catch {} } };" ^
  "Write-Host ('Total de processos AcadChain encerrados: ' + $stopped);"

echo.
echo =======================================================
echo   Encerramento seguro do AcadChain concluido.
echo =======================================================
echo.
timeout /t 3 >nul
