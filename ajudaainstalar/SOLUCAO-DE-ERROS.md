# Solução de Problemas Frequentes (Troubleshooting)

---

### 1. Erro: "Porta 3001 ou 5173 já está em uso"
- **Sintoma:** Ao rodar `iniciar.bat`, o backend ou frontend falha informando `EADDRINUSE`.
- **Causa:** Uma instância anterior do Node.js continuou em execução em segundo plano.
- **Solução:**
  1. Execute `parar.bat`.
  2. Se persistir, abra o PowerShell e execute:
     ```powershell
     Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess -ErrorAction SilentlyContinue | Stop-Process -Force
     Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess -ErrorAction SilentlyContinue | Stop-Process -Force
     ```

---

### 2. Erro: "Cannot find module 'node:sqlite'"
- **Sintoma:** O backend ou scripts de banco falham com erro de módulo inexistente.
- **Causa:** Sua versão do Node.js é anterior à 22.5.0 / 24.
- **Solução:** Atualize o Node.js para a versão LTS mais recente (Node 24 ou superior) em [nodejs.org](https://nodejs.org).

---

### 3. Erro: "A execução de scripts foi desabilitada neste sistema" (PowerShell)
- **Sintoma:** Erro de `ExecutionPolicy` ao rodar comandos PowerShell.
- **Solução:** Os arquivos `.bat` fornecidos executam via `cmd.exe`. Caso queira usar comandos PowerShell diretamente, configure a política de execução da sua sessão de usuário:
  ```powershell
  Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
  ```

---

### 4. Banco de Dados Corrompido ou Travado
- **Sintoma:** Erro `SQLITE_BUSY` ou `database is locked`.
- **Solução:**
  1. Pare os servidores com `parar.bat`.
  2. Execute `resetar-demo.bat` para recriar a base limpa.
