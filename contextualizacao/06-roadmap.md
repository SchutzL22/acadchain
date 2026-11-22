# 06 - Roadmap do AcadChain

O desenvolvimento do AcadChain está estruturado em 4 etapas sequenciais:

---

## Etapa 1: Fundação Arquitetural, Banco e Interface Inicial (STATUS: CONCLUÍDA)
- Estrutura de Monorepo com npm workspaces.
- Banco SQLite local via `node:sqlite` nativo com integridade referencial.
- Dados de teste fictícios para 3 instituições e múltiplos estudantes.
- Backend Express com rotas de consulta (`/api/health`, `/api/instituicoes`, `/api/estudantes`).
- Frontend moderno em React + Vite + Tailwind com dados reais.
- Scripts para Windows 11 (`instalar.bat`, `iniciar.bat`, `parar.bat`, `resetar-demo.bat`).
- Contextualização para agentes de IA e documentação científica.

---

## Etapa 2: Camada de Blockchain e Smart Contracts
- Configuração do Hardhat 3 em `blockchain/`.
- Desenvolvimento dos contratos em Solidity:
  - `AcadChainRegistry.sol`: Registro de IES autorizadas pelo consórcio.
  - `AcademicCredential.sol`: Gravação de hashes SHA-256 e estado (emitido, revogado).
- Deploy e testes automatizados em nó local Hardhat Network.
- Integração da API Express com o nó local via provider JSON-RPC.

---

## Etapa 3: Emissão Criptográfica, QR Code e Verificação Pública
- Cálculo determinístico de hash SHA-256 de dados do diploma/carteirinha.
- Emissão de documento com carimbo criptográfico e gravação da transação na blockchain.
- Geração de QR Code legível contendo URL de conferência pública.
- Painel de Verificação Pública completo: busca por hash ou leitura de arquivo, demonstrando em tempo real se o documento é autêntico, adulterado ou revogado.

---

## Etapa 4: Auditoria, Comparativo Científico e Demonstração Interativa
- Módulo de comparação: "Banco Tradicional vs. Blockchain" (demonstrando o risco de adulteração direta em banco SQL sem histórico criptográfico).
- Simulação de revogação de diploma e desativação de carteirinha.
- Preparação de relatório acadêmico de resultados e benchmarks de latência/custo de transação simulado.
