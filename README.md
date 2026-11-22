# AcadChain

> **Blockchain para Certificação Acadêmica Nacional:** Rede Descentralizada para Autenticação de Diplomas e Carteirinha Estudantil Digital.

O **AcadChain** é um projeto e protótipo acadêmico e científico que investiga a aplicação de tecnologias de registro distribuído (blockchain Ethereum via Hardhat local, contratos inteligentes Solidity e hashing criptográfico SHA-256) na garantia de autenticidade, integridade e rastreabilidade de documentos educacionais no Brasil.

---

## 📌 Status Atual: Etapa 2 Concluída

- [x] **Monorepo com npm workspaces:** Módulos integrados `backend`, `client` e `blockchain`.
- [x] **Smart Contracts Solidity (Hardhat):**
  - Contrato `AcademicCredentialRegistry.sol` em Solidity 0.8.24.
  - Registro e governança de instituições autorizadas (`authorizeIssuer`, `deauthorizeIssuer`).
  - Emissão com transações reais e bloqueio de identificadores duplicados (`issueCredential`).
  - Validação matemática de integridade (`verifyCredential`).
  - Revogação auditável restrita ao emissor original (`revokeCredential`).
  - 12 testes automatizados no Hardhat aprovados com 100% de sucesso.
- [x] **Backend Express com Viem e SQLite:**
  - `BlockchainService` integrado ao nó local (`http://127.0.0.1:8545`).
  - Canonicalização determinística de dados acadêmicos baseada na RFC 8785.
  - Banco de dados local SQLite via módulo nativo `node:sqlite`.
  - 13 testes automatizados no backend aprovados.
- [x] **Frontend React + Vite + Tailwind:**
  - **Laboratório Blockchain:** Interface com 5 cenários práticos (Emissão, Verificação, Adulteração controlada com efeito avalanche, Revogação on-chain e Bloqueio de invasores).
  - **Explorador AcadChain:** Visualização em tempo real de blocos minerados, transações, contratos e didática conceitual.
  - Painéis de Instituições e Estudantes com dados reais.
- [x] **Scripts de Automação para Windows 11:**
  - `instalar.bat`: Configuração e compilação completa do ambiente.
  - `iniciar.bat`: Subida coordenada do nó Hardhat, deploy automático, backend e frontend.
  - `parar.bat`: Encerramento seguro focado estritamente nas portas do projeto (8545, 3001, 5173).
  - `resetar-demo.bat`: Restauração dos dados demonstrativos com confirmação do usuário.
- [x] **Documentação e Protocolo Científico:**
  - `documentacao/experimento-cientifico.md`: Metodologia, hipóteses, procedimentos e métricas de gas/tempo.
  - Sistema de contextualização para agentes de IA em `contextualizacao/` e diretrizes em `AGENTS.md`.

---

## 🏛️ Aviso Acadêmico e Ético

> [!WARNING]
> O AcadChain é um **protótipo estritamente acadêmico e científico**.
> Ele **NÃO** possui credenciamento oficial, não substitui as normas de diplomas digitais do Ministério da Educação (MEC) nem a infraestrutura de chaves públicas brasileira (ICP-Brasil). Todos os dados cadastrados são estritamente fictícios para fins de teste e demonstração controlada.

---

## 🚀 Como Executar no Windows 11

### Pré-requisitos
- **Windows 11** de 64 bits.
- **Node.js 24+ LTS** (testado com Node v26).
- **Git** instalado.

### 1. Instalação
Abra o prompt de comando (CMD) ou PowerShell na raiz da pasta e execute:
```cmd
instalar.bat
```

### 2. Inicialização
Para iniciar o nó Ethereum Hardhat, realizar o deploy dos contratos e subir o backend e frontend:
```cmd
iniciar.bat
```
Após a inicialização, acesse no seu navegador:
- **Interface Geral:** [http://localhost:5173](http://localhost:5173)
- **Documentos & Carteirinhas:** [http://localhost:5173/documentos](http://localhost:5173/documentos)
- **Verificador de PDFs Criptográfico:** [http://localhost:5173/verificar-pdf](http://localhost:5173/verificar-pdf)
- **Laboratório Blockchain (6 Cenários Didáticos):** [http://localhost:5173/laboratorio](http://localhost:5173/laboratorio)
- **Explorador de Blocos:** [http://localhost:5173/explorador](http://localhost:5173/explorador)
- **Backend API REST:** [http://localhost:3001/api/health](http://localhost:3001/api/health)
- **Nó Ethereum Local:** [http://127.0.0.1:8545](http://127.0.0.1:8545)

### 3. Encerramento Seguro
Para parar todos os servidores do projeto sem fechar outros processos do seu computador:
```cmd
parar.bat
```

### 4. Restauração de Demonstração
Para recriar a base SQLite e restabelecer os dados originais:
```cmd
resetar-demo.bat
```

---

## 🧪 Roteiro de Demonstração para Avaliadores (Banca/Professor)

1. Execute `iniciar.bat` e abra [http://localhost:5173/laboratorio](http://localhost:5173/laboratorio).
2. **Cenário A (Emissão Real):** Selecione a *Universidade Federal do Saber (UFS)* e emita uma credencial para um formando. Observe a geração do PDF, o hash do arquivo físico e o registro duplo on-chain.
3. **Cenário B (Verificação On-Chain):** Consulte o documento emitido. O Smart Contract confirmará matematicamente a autenticidade dos dados normalizados (RFC 8785).
4. **Cenário C (Adulteração de Metadados):** Modifique o curso de "Sistemas de Informação" para "Medicina". Observe a detecção imediata de fraude pelo recálculo do SHA-256 (efeito avalanche).
5. **Cenário D (Revogação Formal):** Revogue uma credencial formalmente e comprove que o contrato altera o status para `REVOKED` preservando data, bloco e motivo.
6. **Cenário E (Ataque Não Autorizado):** Tente emitir um certificado utilizando a Conta Invasora (#9). Demonstre que a regra Solidity `onlyAuthorizedIssuer` reverte a transação e protege o consórcio.
7. **Cenário F (Ataque Binário de 1 Byte em PDF):** Acesse a nova aba de teste em [http://localhost:5173/laboratorio](http://localhost:5173/laboratorio) ou a página [http://localhost:5173/documentos](http://localhost:5173/documentos), baixe o PDF original e o PDF adulterado em 1 byte. Arraste ambos para [http://localhost:5173/verificar-pdf](http://localhost:5173/verificar-pdf) e comprove que a blockchain rejeita a integridade física do documento alterado.
8. **Carteirinha Digital Interativa:** Acesse [http://localhost:5173/documentos](http://localhost:5173/documentos) e visualize a carteirinha discente em padrão ID-1 com QR Code funcional e verso técnico criptográfico.
9. Acesse [http://localhost:5173/explorador](http://localhost:5173/explorador) para visualizar o histórico de blocos e transações gerados durante a demonstração.
