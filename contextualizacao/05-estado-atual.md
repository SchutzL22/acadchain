# 05 - Estado Atual do Projeto

**Data de Atualização:** 2026-11-22  
**Fase Corrente:** Etapa 2 Concluída com Sucesso — Blockchain Hardhat Local e Smart Contracts Integrados

---

## 1. O que foi Implementado e Efetivamente Testado

- [x] **Diagnóstico e Correção da Etapa 1:**
  - Instalação completa das dependências em `node_modules` com npm workspaces.
  - Compilação sem erros do TypeScript no backend (`tsc`) e frontend (`vite build`).
  - Todos os testes da API REST original aprovados.
- [x] **Smart Contracts e Ambiente Blockchain (Hardhat):**
  - Contrato `AcademicCredentialRegistry.sol` desenvolvido e compilado em Solidity 0.8.24.
  - 12 testes automatizados do Smart Contract executados e aprovados com 100% de sucesso no Hardhat.
  - Script de deploy `blockchain/scripts/deploy.ts` implantando o contrato, autorizando UFS, ITB e PUI e emitindo 4 credenciais de demonstração on-chain.
  - Geração automática do manifesto com ABI e endereços em `dados/contract-manifest.json`.
- [x] **Integração com SQLite:**
  - Migrações automáticas não destrutivas em `backend/src/db/migrate.ts`.
  - Tabela `transacoes_blockchain` e campos de sincronização on-chain (`tx_hash_blockchain`, `bloco_blockchain`, `status_sincronizacao`).
- [x] **Backend Express e Viem:**
  - `BlockchainService` conectando ao JSON-RPC local (`http://127.0.0.1:8545`).
  - Serialização canônica determinística (`canonicalizeAcademicData`).
  - Rotas ativas e testadas: `/api/blockchain/status`, `/api/blockchain/contrato`, `/api/blockchain/transacoes`, `/api/credenciais`, `/api/credenciais/emitir`, `/api/credenciais/:id/verificar`, `/api/credenciais/:id/revogar`.
  - 13 testes automatizados no backend aprovados.
- [x] **Interface React Expandida:**
  - Novo **Laboratório Blockchain** com os 5 cenários didáticos (Emissão, Verificação, Adulteração, Revogação, Ataque Hacker).
  - Novo **Explorador AcadChain** com visualização em tempo real de blocos, transações, dados do contrato e didática acadêmica.
  - Barra de navegação e página inicial atualizadas.
- [x] **Scripts Operacionais Windows 11:**
  - `instalar.bat`, `iniciar.bat`, `parar.bat` e `resetar-demo.bat` atualizados e funcionais.

---

## 2. Próximos Passos (Etapa 3 do Roadmap)
- [ ] Geração e leitura de QR Codes para verificação pública instantânea.
- [ ] Integração com emissão de documentos PDF e assinatura visual de diplomas.
- [ ] Módulo comparativo de latência e consumo de gas entre SQLite e Blockchain.
