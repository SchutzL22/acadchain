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

## Decisão 006: Migração e Padronização Oficial para o Hardhat 3 (ESM + Viem)
- **Data:** 2026-11-22
- **Contexto:** O `README.md` apresentava Hardhat 3, mas o `blockchain/package.json` declarava `hardhat ^2.22.18`. A evolução do ecossistema Hardhat para a versão 3 exige suporte nativo a ESM (`"type": "module"`), plugin `@nomicfoundation/hardhat-toolbox-viem` (^5.0.7) e executor de testes com `node:test`.
- **Decisão:** Atualizar `blockchain/package.json` para `"hardhat": "^3.22.0"` e `"@nomicfoundation/hardhat-toolbox-viem": "^5.0.7"`, configurar `blockchain/hardhat.config.ts` com `defineConfig` e tipos de rede estritos (`edr-simulated` e `http`), e migrar a suite de testes do contrato para `node:test`.
- **Consequência:** Compatibilidade total e pura com a especificação moderna do Hardhat 3, eliminando conflitos de API legadas ou misturas com Hardhat 2.

## Decisão 007: Modelo Criptográfico de Dupla Camada ("Off-Chain Metadata + On-Chain Proofs + Binary File Integrity")
- **Data:** 2026-11-22
- **Contexto:** Garantir que tanto os dados estruturados de um registro acadêmico quanto o arquivo físico renderizado (PDF) possuam integridade matematicamente verificável contra a blockchain.
- **Decisão:** Desenvolver o contrato inteligente `AcademicCredentialRegistry.sol` (v2.0) com suporte a dois hashes complementares:
  1. `canonicalHash` (bytes32): Hash SHA-256 dos metadados acadêmicos canônicos estruturados (RFC 8785).
  2. `fileHash` (bytes32): Hash SHA-256 dos bytes físicos binários do arquivo PDF gerado.
  Criar os métodos on-chain `issueCredentialWithFile` e `verifyCredentialFull` para atestar a integridade em ambas as camadas.
- **Consequência:** A instituição ou verificador pode validar a credencial tanto consultando os dados estruturados quanto enviando o arquivo PDF para verificação byte-a-byte.

## Decisão 008: Resolução da Dependência Circular de Hash no Arquivo PDF com QR Code
- **Data:** 2026-11-22
- **Contexto:** Um arquivo PDF não pode conter dentro de si o hash dos seus próprios bytes finais, pois qualquer inclusão do hash altera os próprios bytes do documento (dependência circular).
- **Decisão:** 
  1. O QR Code impresso no PDF armazena a URL pública de auditoria (`http://localhost:5173/verificar?id=<UUID>`).
  2. O corpo do PDF armazena o Identificador Unívoco (UUID) do registro.
  3. O arquivo PDF é renderizado completamente pelo `PdfService`, seus bytes finais são gerados e apenas então seu hash SHA-256 é calculado (`fileHash`).
  4. Esse `fileHash` é gravado no banco de dados SQLite e registrado no Smart Contract no momento da emissão.
- **Consequência:** Solução matematicamente consistente e livre de recursão, permitindo que o PDF contenha o QR Code funcional enquanto seu hash permanece perfeitamente auditável na blockchain.

## Decisão 009: Robustez e Não-Destrutividade dos Scripts Operacionais Windows 11
- **Data:** 2026-11-22
- **Contexto:** O script `iniciar.bat` anunciava sucesso mesmo com falhas em serviços, e `parar.bat` encerrava processos indiscriminadamente com base apenas em portas de rede.
- **Decisão:**
  1. `iniciar.bat`: Adição de verificações sequenciais rígidas com timeout. Se o nó Hardhat, o deploy do contrato ou o healthcheck da API falharem, a inicialização é abortada com código de erro, sem exibir mensagem de falso sucesso.
  2. `parar.bat`: Inspeção rigorosa da linha de comando do processo via PowerShell (`Win32_Process`). Apenas processos que contêm `acadchain`, `hardhat`, `tsx`, `vite` ou pertencem ao projeto são encerrados; portas utilizadas por softwares externos do sistema são expressamente preservadas.
- **Consequência:** Maior segurança operacional e respeito ao ambiente local do usuário no Windows 11.
