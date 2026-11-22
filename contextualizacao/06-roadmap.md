# 06 - Roadmap do AcadChain

---

## Etapa 1: Fundação Arquitetural, Banco e Interface Inicial (STATUS: CONCLUÍDA)
- Monorepo com npm workspaces (`backend`, `client`, `blockchain`).
- Banco SQLite local com `node:sqlite` nativo.
- Backend Express TypeScript e rotas básicas.
- Frontend React + Vite + Tailwind.

---

## Etapa 2: Blockchain Hardhat Local e Smart Contracts (STATUS: CONCLUÍDA)
- Configuração do Hardhat 3 com Solidity 0.8.24 e Viem.
- Contrato `AcademicCredentialRegistry.sol` com governança de IES autorizadas, emissão, consulta e revogação.
- 12 testes automatizados em Solidity aprovados.
- Deploy automatizado e manifesto compartilhado.
- Canonicalização determinística (RFC 8785) e cálculo do hash SHA-256.
- Endpoints REST para status da rede, emissão, verificação e revogação.
- Laboratório Blockchain com 5 cenários práticos (A, B, C, D, E).
- Explorador AcadChain com blocos e transações reais.
- Scripts Windows atualizados (`instalar.bat`, `iniciar.bat`, `parar.bat`, `resetar-demo.bat`).

---

## Etapa 3: Emissão de PDFs, Assinatura e QR Code (PREVISTA)
- Geração de diploma em PDF canônico com metadados estruturados.
- Geração de QR Code contendo a URL de validação pública com o hash do documento.
- Leitor de PDF na interface para conferência direta de arquivos locais.

---

## Etapa 4: Auditoria Avançada e Consolidação Científica (PREVISTA)
- Artigo científico final com métricas empíricas de gas, tempo de confirmação e benchmarks.
- Demonstração comparativa "Banco Centralizado vs. Ledger Distribuído".
