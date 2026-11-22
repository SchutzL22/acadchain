# 05 - Estado Atual do Projeto

**Data de Atualização:** 2026-11-22  
**Fase Corrente:** Etapa 3 Concluída com Sucesso — Documentos Acadêmicos Digitais (PDFs), Carteirinha Estudantil Interativa e Verificação Criptográfica de Dupla Prova

---

## 1. O que foi Implementado e Efetivamente Testado

- [x] **Auditoria e Padronização do Hardhat 3 (Etapa 2 Corretiva):**
  - Módulo `blockchain` migrado integralmente para Hardhat 3 oficial (`3.22.0`) com ESM nativo (`"type": "module"`).
  - Plugin `@nomicfoundation/hardhat-toolbox-viem` (`^5.0.7`) com configuração `defineConfig` e conexões `edr-simulated` / `http`.
  - 13 testes automatizados de Smart Contracts executados e aprovados com 100% de sucesso via runner nativo `node:test`.
  - Script de deploy `blockchain/scripts/deploy.ts` calculando em tempo real os hashes determinísticos SHA-256 (RFC 8785) das credenciais de demonstração.
  - Sincronização 100% comprovada por testes entre os dados do SQLite (`ajudaainstalar/02-dados-exemplo.sql`) e as provas armazenadas no contrato.
- [x] **Smart Contract v2.0 com Dupla Prova On-Chain:**
  - `AcademicCredentialRegistry.sol` evoluído para armazenar `canonicalHash` (dados estruturados) e `fileHash` (bytes do arquivo PDF).
  - Novos métodos auditáveis: `issueCredentialWithFile` e `verifyCredentialFull`.
  - Eventos de emissão com arquivo: `CredentialIssuedWithFile`.
- [x] **Geração de Documentos Digitais (PDFs) com PDFKit e QRCode:**
  - Serviço `PdfService` (`backend/src/services/pdf.service.ts`):
    - Geração de Diploma e Certificado em A4 Paisagem com identidade visual AcadChain (molduras `#0f2942` e `#10b981`), QR Code de auditoria, assinaturas e aviso de isenção científico.
    - Geração de Carteirinha de Identificação Estudantil Digital no padrão ID-1 com avatar discente, dados acadêmicos, matrícula, validade e QR Code.
    - Resolução da dependência circular de hash: o QR Code aponta para a URL pública de verificação com UUID; o hash do PDF é computado após a renderização final dos bytes.
- [x] **Rotas e Controladores de Documentos e Verificação:**
  - `GET /api/documentos/:id/pdf`: Streaming ou download seguro do arquivo PDF com cabeçalho `X-AcadChain-SHA256`.
  - `GET /api/documentos/:id/carteirinha`: Retorno de metadados enriquecidos para o componente interativo, incluindo QR Code em base64 e status blockchain.
  - `POST /api/documentos/verificar-pdf`: Upload multipart/form-data via Multer (memória, até 10MB), validação de magic bytes (`%PDF-`), cálculo do SHA-256 e validação em Smart Contract (`verifyCredentialFull`).
  - `GET /api/documentos/:id/adulterar-demonstracao`: Endpoint de laboratório científico que gera versão corrompida (inversão de 1 byte no corpo) para testes práticos de rejeição.
- [x] **Interface Frontend React Expandida:**
  - Nova página **"Documentos & Carteirinhas"** (`/documentos`): Galeria com filtros, busca, download de PDFs oficiais, visualização de carteirinhas e teste de adulteração.
  - Nova página **"Verificador de PDFs"** (`/verificar-pdf`): Drag-and-drop de arquivos PDF, diagnóstico visual de integridade (Autêntico / Adulterado / Revogado) e detalhamento da dupla camada on-chain.
  - Componente **"Carteirinha Digital Interativa"** (`CarteirinhaDigital.tsx`): Exibição visual da frente do cartão com badge de validade e QR Code, e verso com provas criptográficas on-chain e hash SHA-256.
  - Expansão do **Laboratório Blockchain** (`/laboratorio`): Adição do **Cenário F ("Ataque de 1 Byte no PDF")** com download comparativo de arquivo original vs adulterado e mini-verificador em tempo real.
- [x] **Scripts Windows 11 Aprimorados:**
  - `iniciar.bat`: Verificação rígida de resposta do nó Hardhat, deploy do contrato e healthcheck da API antes de anunciar sucesso.
  - `parar.bat`: Encerramento seletivo por inspeção de linha de comando (`Win32_Process`); preserva portas ocupadas por outros softwares do usuário.
  - `.gitignore`: Proteção do diretório `dados/documentos/*.pdf` contra versionamento acidental.
- [x] **Bateria de Testes Automatizados:**
  - `blockchain/test/AcademicCredentialRegistry.test.ts`: 13 testes de contrato inteligente aprovados.
  - `backend/tests/api.test.ts`: 7 testes de endpoints HTTP e documentos aprovados.
  - `backend/tests/hash-correspondence.test.ts`: Teste de paridade determinística aprovado.
  - `backend/tests/pdf-verification.test.ts`: 3 testes de geração de PDF, validação de magic bytes e efeito avalanche aprovados.
  - `backend/tests/canonicalize.test.ts`: 3 testes de canonicalização determinística (RFC 8785) aprovados.

---

## 2. Próximos Passos (Etapa 4 do Roadmap)
- [ ] Módulo comparativo de métricas de desempenho (latência e throughput) entre SQLite e Blockchain.
- [ ] Exportação de relatórios científicos de auditoria criptográfica.
- [ ] Simulação de múltiplos nós validadores do consórcio em portas distintas.
