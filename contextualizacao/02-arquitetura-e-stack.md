# 02 - Arquitetura e Stack Tecnológica (Atualizado Etapa 2)

## 1. Visão Geral da Arquitetura Integrada

O sistema é dividido em quatro camadas operacionais reais:

```
[ Frontend: React 18 + Vite + TS + Tailwind ]
              │  (HTTP / REST JSON)
              ▼
[ Backend: Express + TypeScript + Viem ]
        │                   │
        │ (node:sqlite)     │ (JSON-RPC http://127.0.0.1:8545)
        ▼                   ▼
[ SQLite Local ]    [ Nó Ethereum Local (Hardhat 3) ]
  acadchain.sqlite     AcademicCredentialRegistry.sol
```

## 2. Tecnologias Adotadas

### Frontend (`/client`)
- **React com Vite e TypeScript:** Roteamento com React Router, ícones Lucide React e Tailwind CSS.
- Módulos interativos: Painel de Instituições, Painel Discente, Laboratório Blockchain (5 cenários) e Explorador de Blocos.

### Backend (`/backend`)
- **Express com TypeScript e Viem:**
  - `BlockchainService`: gerencia conexão com nó local, assinaturas com chaves de desenvolvimento e chamadas tipadas ao contrato.
  - Endpoints REST para consulta de status, contrato, transações, emissão e revogação on-chain.

### Banco de Dados (`node:sqlite`)
- Módulo nativo padrão do Node.js, com prepared statements e migrações não destrutivas em `backend/src/db/migrate.ts`.
- Tabela `documentos` enriquecida com `tx_hash_blockchain`, `bloco_blockchain`, `status_sincronizacao`, e tabela `transacoes_blockchain`.

### Blockchain (`/blockchain`)
- Framework **Hardhat 3** com Solidity **0.8.24**.
- Contrato inteligente `AcademicCredentialRegistry.sol`:
  - Controle de instituições autorizadas (`authorizeIssuer`, `deauthorizeIssuer`).
  - Emissão imutável de provas (`issueCredential`).
  - Verificação matemática (`verifyCredential`).
  - Revogação auditável restrita ao emissor original (`revokeCredential`).
  - Eventos: `CredentialIssued`, `CredentialRevoked`, `IssuerAuthorized`.
