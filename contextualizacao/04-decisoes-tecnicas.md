# 04 - Registro de Decisões Técnicas (ADR)

## Decisão 001: Adoção do Módulo Nativo `node:sqlite`
- **Data:** 2026-11-22
- **Decisão:** Utilizar `node:sqlite` nativo (`DatabaseSync`), sem ORM e sem compiladores externos no Windows.

## Decisão 002: Monorepo com npm workspaces (`backend`, `client`, `blockchain`)
- **Data:** 2026-11-22
- **Decisão:** Gerenciar os três módulos sob workspaces nativos do npm na raiz do projeto.

## Decisão 003: Integração Real do Hardhat e Viem na Etapa 2
- **Data:** 2026-11-22
- **Contexto:** Necessidade de executar uma blockchain Ethereum real localmente, com transações válidas confirmadas em blocos, sem recorrer a simulações falsas.
- **Decisão:** Adotar Hardhat com `@nomicfoundation/hardhat-toolbox-viem` e Viem v2 no backend.
- **Consequência:** Comunicação tipada, moderna, leve e sem dependência de bibliotecas legadas (como ethers v5).

## Decisão 004: Canonicalização Determinística de Dados Acadêmicos (RFC 8785)
- **Data:** 2026-11-22
- **Contexto:** Garantir que o cálculo do hash SHA-256 seja rigorosamente estável e imune a variações arbitrárias de formatação ou ordenação de chaves em objetos JSON.
- **Decisão:** Implementar `canonicalizeAcademicData` com ordenação alfabética de propriedades, normalização Unicode NFC e remoção de caracteres não-numéricos de identificadores (CPF).
- **Consequência:** Garantia matemática de integridade com detecção estrita de adulteração (efeito avalanche).

## Decisão 005: Diagnóstico e Correção da Resolução de Módulos da Etapa 1
- **Data:** 2026-11-22
- **Contexto:** Erros reportados de `@vitejs/plugin-react` não resolvido e `tsx` não encontrado.
- **Causa Real:** O comando `npm install` anterior havia sido executado sem permissão de acesso à rede, resultando na ausência física de `node_modules`.
- **Correção:** Execução de `npm install` com permissão de rede, adição de `"type": "module"` no `backend/package.json` e correção de tipos no Express 5.
