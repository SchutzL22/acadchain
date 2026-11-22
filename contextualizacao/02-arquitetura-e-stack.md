# 02 - Arquitetura e Stack Tecnológica

## 1. Visão Geral da Arquitetura

O sistema é dividido em quatro camadas bem delimitadas:

```
[ Frontend: React + Vite + TS ]
              │  (HTTP / REST JSON)
              ▼
[ Backend: Express + TypeScript ]
        │                   │
        │ (node:sqlite)     │ (JSON-RPC na Etapa 2)
        ▼                   ▼
[ SQLite Local ]    [ Blockchain Local (Hardhat) ]
  acadchain.sqlite     (Smart Contracts em Solidity)
```

## 2. Tecnologias Adotadas e Motivações

### Frontend (`/client`)
- **React 18/19 com Vite:** Compilação ultra-rápida, Hot Module Replacement e ecossistema moderno.
- **TypeScript:** Segurança de tipos compartilhada conceitualmente com a API.
- **Tailwind CSS:** Produtividade estilística, visual sóbrio acadêmico e excelente responsividade.
- **React Router:** Roteamento declarativo do lado do cliente.
- **Lucide React:** Iconografia semântica, leve e consistente.

### Backend (`/backend`)
- **Node.js (v24+ / v26 LTS):** Runtime moderno com suporte a módulos nativos e alta performance assíncrona.
- **Express com TypeScript:** Servidor de API REST claro, modular, com middlewares centralizados.
- **CORS:** Restrito à origem autorizada do frontend (`http://localhost:5173`).
- **Dotenv:** Configuração orientada a ambientes via variáveis isoladas.

### Banco de Dados (`node:sqlite`)
- Módulo nativo padrão do Node.js, dispensando compilações em C/C++ (`node-gyp`), dependências de drivers externos ou instalação de servidores de banco de dados pesados.
- Consultas SQL cruas, parametrizadas para imunidade a SQL Injection.
- Ativação obrigatória de `PRAGMA foreign_keys = ON;`.

### Blockchain (`/blockchain` - Planejado para Etapa 2)
- Framework **Hardhat 3** rodando rede Ethereum local na porta 8545.
- Linguagem **Solidity** para os contratos de registro e atestação.
