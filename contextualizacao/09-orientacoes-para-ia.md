# 09 - Orientações para Agentes de IA em Novas Sessões

Se você é um agente de IA (Antigravity, Codex ou outro assistente) assumindo o AcadChain, leia com atenção:

---

## 1. Como Descobrir Rapidamente o Estado Atual
1. **Leia `contextualizacao/05-estado-atual.md`:** A **Etapa 2** está 100% concluída e testada.
2. **Veja o roadmap em `contextualizacao/06-roadmap.md`:** A próxima fase a ser abordada é a **Etapa 3** (Geração de PDFs, QR Codes e Leitor de Documentos).
3. **Valide a integridade do código existente:**
   - Execute no terminal: `npm run build` (deve compilar os 3 workspaces sem erro).
   - Execute: `npm run test:blockchain` (12 testes do contrato devem passar).
   - Execute: `npm run test:backend` (13 testes do backend devem passar).

---

## 2. Regras Rígidas de Desenvolvimento
- **NÃO crie simulações falsas de blockchain:** O projeto utiliza o nó Ethereum local do Hardhat rodando transações reais via JSON-RPC.
- **NÃO apague o banco `dados/acadchain.sqlite`** arbitrariamente.
- **NÃO adicione ORMs pesados** (Prisma, TypeORM, Sequelize). O projeto utiliza o módulo nativo `node:sqlite` para garantir estabilidade e zero dependência de compiladores C++ no Windows.
- **Mantenha os comandos compatíveis com Windows 11.**

---

## 3. Estrutura dos Módulos
- `/blockchain`: Smart Contract `AcademicCredentialRegistry.sol`, testes Hardhat e script de deploy.
- `/backend`: API Express com Viem, `BlockchainService`, prepared statements SQLite e rotas REST.
- `/client`: Frontend React + Vite + Tailwind com Laboratório Blockchain (5 cenários) e Explorador de Blocos.
