# 05 - Estado Atual do Projeto

**Data de Atualização:** 2026-11-22  
**Fase Corrente:** Etapa 1 — Fundação Arquitetural, Banco Relacional e Interface Inicial

---

## 1. O que foi Implementado e Verificado
- [x] **Estrutura de Repositório Monorepo:** Configuração de workspaces (`backend`, `client`), scripts unificados e governança `AGENTS.md`.
- [x] **Banco de Dados SQLite (`node:sqlite`):**
  - Esquema com 6 tabelas (`instituicoes`, `estudantes`, `usuarios`, `matriculas`, `documentos`, `auditoria`).
  - Chaves primárias, estrangeiras com `ON DELETE` e restrições `CHECK` implementadas.
  - Índices para busca otimizada (`idx_estudantes_cpf`, `idx_documentos_hash`, etc.).
  - Scripts SQL versionados em `ajudaainstalar/` e rotina idempotente em `scripts/`.
  - Dados de teste com 3 instituições universitárias fictícias e 5 estudantes com matrículas e documentos.
- [x] **Backend Express com TypeScript:**
  - Configuração rigorosa de TypeScript e middleware centralizado de erros.
  - Rotas ativas: `GET /api/health`, `GET /api/instituicoes`, `GET /api/estudantes`.
  - Consultas com parâmetros vinculados (prepared statements) sem ORM intermediário.
- [x] **Frontend React + Vite + Tailwind CSS:**
  - Interface moderna com paleta acadêmica (azul marinho, cinzas e detalhes verdes).
  - Páginas ativas: Início, Visão Geral, Instituições (consumindo API real), Estudantes (consumindo API real), Como Funciona e Verificação Pública (com sinalizadores claros de protótipo).
- [x] **Scripts de Automação para Windows 11:**
  - `instalar.bat`: Verificação e setup de ambiente.
  - `iniciar.bat`: Subida dos servidores nas portas 3001 e 5173.
  - `parar.bat`: Encerramento seguro focado nos processos do projeto.
  - `resetar-demo.bat`: Limpeza e reinserção dos dados de exemplo com confirmação.
- [x] **Documentação Acadêmica e de Contextualização:** 10 arquivos de contextualização para agentes e 6 artigos aprofundados em `documentacao/`.

---

## 2. O que está Pendente para as Próximas Etapas
- [ ] Implementação de contratos inteligentes Solidity no Hardhat (Etapa 2).
- [ ] Geração de hashes SHA-256 e gravação na rede Ethereum local (Etapa 2).
- [ ] Mecanismo interativo de verificação com QR Code e leitor de PDF (Etapa 3).
- [ ] Simulação de tentativas de adulteração para comparação científica (Etapa 3).
