# 04 - Registro de Decisões Técnicas (ADR)

## Decisão 001: Adoção do Módulo Nativo `node:sqlite`
- **Data:** 2026-11-22
- **Contexto:** Necessidade de um banco de dados relacional leve, local, sem dependência de instalação de servidores externos (PostgreSQL/MySQL) e livre de problemas de compilação de binários nativos no Windows (`better-sqlite3` ou `sqlite3` via `node-gyp`).
- **Decisão:** Utilizar o módulo nativo `node:sqlite` (`DatabaseSync`), disponível e estável no Node.js v26.
- **Consequência:** Dependências externas do projeto reduzidas a zero para a camada de banco de dados; performance nativa em C e portabilidade imediata no Windows 11.

## Decisão 002: Organização em Monorepo com npm workspaces
- **Data:** 2026-11-22
- **Contexto:** Frontend e Backend possuem dependências TypeScript distintas, mas compartilham tipos conceituais e necessitam de inicialização orquestrada.
- **Decisão:** Usar workspaces nativos do npm (`workspaces: ["backend", "client"]`) gerenciados pelo `package.json` raiz.
- **Consequência:** Instalação unificada com `npm install` na raiz e facilidade de scripts no `package.json`.

## Decisão 003: Postergação de Smart Contracts para a Etapa 2
- **Data:** 2026-11-22
- **Contexto:** A Etapa 1 precisa validar a fundação de dados relacionais e interface antes de introduzir a camada de consenso e EVM.
- **Decisão:** Deixar o diretório `blockchain/` documentado e estruturado, com campos opcionais no banco (`tx_hash_blockchain`, `bloco_blockchain`), sem subir nó Ethereum ou compilar Solidity nesta fase inicial.
- **Consequência:** Evita acoplamento prematuro e permite validar a integridade conceitual do modelo antes da descentralização.
