# AcadChain

> **Blockchain para Certificação Acadêmica Nacional:** Rede Descentralizada para Autenticação de Diplomas e Carteirinha Estudantil Digital.

O **AcadChain** é um projeto e protótipo científico que investiga a aplicação de tecnologias de registro distribuído (blockchain Ethereum, contratos inteligentes e hashing criptográfico SHA-256) na verificação de autenticidade, integridade e rastreabilidade de documentos educacionais no Brasil.

---

## 📌 Status Atual: Etapa 1 Concluída

- [x] Estrutura Monorepo com npm workspaces (`client`, `backend`, `blockchain`, `dados`).
- [x] Banco de dados local SQLite com suporte nativo (`node:sqlite`), chaves estrangeiras ativas e integridade referencial.
- [x] Backend Express com TypeScript, rotas de consulta (`/api/health`, `/api/instituicoes`, `/api/estudantes`), validação e tratamento centralizado de erros.
- [x] Frontend React + Vite + TypeScript + Tailwind CSS, responsivo, acessível e conectado à API real.
- [x] Scripts operacionais em lote para Windows 11 (`instalar.bat`, `iniciar.bat`, `parar.bat`, `resetar-demo.bat`).
- [x] Sistema de contextualização para agentes de IA em `contextualizacao/` e instruções em `AGENTS.md`.
- [x] Documentação técnica e acadêmica aprofundada em `documentacao/`.
- [ ] Etapa 2 (Prevista): Hardhat 3, Solidity, rede local Ethereum e contratos inteligentes de registro.

---

## 🏛️ Aviso Acadêmico e Ético

> [!WARNING]
> O AcadChain é um **protótipo estritamente acadêmico e científico**.
> Ele **NÃO** possui credenciamento oficial, não substitui as normas de diplomas digitais do Ministério da Educação (MEC) nem a infraestrutura de chaves públicas brasileira (ICP-Brasil). Todos os dados cadastrados são estritamente fictícios para fins de teste e demonstração controlada.

---

## 🚀 Como Executar no Windows 11

### Pré-requisitos
- **Windows 11**
- **Node.js 24+ LTS** (testado com Node v26)
- **Git**

### Instalação Rápida
1. Execute o script de instalação para checar requisitos, instalar dependências e inicializar o banco de dados:
   ```cmd
   instalar.bat
   ```
2. Inicie a aplicação (Backend na porta `3001` e Frontend na porta `5173`):
   ```cmd
   iniciar.bat
   ```
3. Acesse a aplicação no seu navegador:
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - API Backend: [http://localhost:3001/api/health](http://localhost:3001/api/health)

4. Para parar os servidores em execução:
   ```cmd
   parar.bat
   ```

5. Para restaurar o banco de dados e os dados de exemplo a qualquer momento:
   ```cmd
   resetar-demo.bat
   ```

---

## 📂 Estrutura do Repositório

```text
/
├── client/              # Interface do Usuário (React, Vite, TypeScript, Tailwind)
├── backend/             # Servidor de API REST (Node.js, Express, TypeScript, node:sqlite)
├── blockchain/          # Arquitetura Hardhat/Solidity (planejado para Etapa 2)
├── contextualizacao/    # Diretrizes e estado persistente para agentes de IA
├── documentacao/        # Artigos, fundamentos científicos e roteiro de demonstração
├── ajudaainstalar/      # Scripts SQL e manuais de instalação e troubleshooting
├── referencias/         # Bibliografia acadêmica (Nakamoto, Buterin, W3C)
├── dados/               # Diretório do banco de dados local SQLite (ignorado no Git)
├── scripts/             # Scripts Node para inicialização, população e reset
├── AGENTS.md            # Guia de governança para assistentes de programação
├── README.md            # Documento principal
├── .env.example         # Modelo de variáveis de ambiente
├── package.json         # Workspace raiz
├── instalar.bat         # Script de instalação Windows
├── iniciar.bat          # Script de inicialização dos servidores Windows
├── parar.bat            # Script de parada segura dos processos Windows
└── resetar-demo.bat     # Script de restauração de dados demonstrativos
```
