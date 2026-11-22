# Experimento Científico: Validação da Integridade e Governança Descentralizada no AcadChain

**Protocolo Experimental Acadêmico — AcadChain v0.2.0 (Etapa 2)**  
**Tema:** Blockchain para Certificação Acadêmica Nacional: Rede Descentralizada para Autenticação de Diplomas e Carteirinha Estudantil Digital.

---

## 1. Objetivo do Experimento
Avaliar empiricamente como o encadeamento criptográfico e contratos inteligentes determinísticos na Ethereum Virtual Machine (EVM) solucionam as fragilidades de integridade, repúdio e falsificação de documentos educacionais (diplomas, certificados e carteirinhas) em comparação a bancos relacionais isolados.

---

## 2. Hipóteses Investigadas

- **Hipótese 1 (Integridade e Detecção de Fraude — Efeito Avalanche):** Qualquer modificação em um único caractere de um documento digital (como a alteração fraudulenta do curso ou nome) altera drasticamente o hash SHA-256 resultante, inviabilizando a validação contra o registro on-chain.
- **Hipótese 2 (Governança e Controle de Acesso Descentralizado):** A imposição de regras criptográficas em nível de Smart Contract (`onlyAuthorizedIssuer`) impede que uma entidade não credenciada consiga registrar atestações válidas, mesmo que possua acesso a uma cópia da aplicação.
- **Hipótese 3 (Auditabilidade e Não-Repúdio de Revogação):** A revogação formal de um certificado na blockchain altera o estado para `REVOKED` sem apagar o histórico de emissão anterior, mantendo a trilha de auditoria pública e impedindo revogações cruzadas por instituições concorrentes.

---

## 3. Ambiente Experimental Controlado

| Componente | Especificação Adotada |
| :--- | :--- |
| **Sistema Operacional** | Windows 11 Pro 64-bit |
| **Runtime** | Node.js v26.8.1 LTS / npm 12.0.2 |
| **Blockchain** | Hardhat Local Node (EVM Paris, Chain ID: 31337) |
| **Linguagem do Contrato** | Solidity v0.8.24 com otimizador ativado (200 runs) |
| **Biblioteca de Conexão** | Viem v2.21+ (cliente JSON-RPC tipado) |
| **Banco Relacional Local** | SQLite nativo (`node:sqlite`) com chaves estrangeiras ativas |
| **Protocolo de Serialização** | Canonicalização determinística baseada na RFC 8785 (JCS) |

---

## 4. Procedimentos e Cenários de Demonstração

### Cenário A: Emissão com Transação Real On-Chain
1. A instituição autorizada (ex: UFS, conta 1) seleciona o formando e dados do curso.
2. O sistema gera a representação canônica ordenada em UTF-8 e computa o SHA-256.
3. A instituição assina e envia a transação `issueCredential(credentialId, canonicalHash)`.
4. O bloco é minerado no Hardhat local. O recibo retorna `status: success`, número do bloco e gas consumido.

### Cenário B: Verificação Matemática Contra o Smart Contract
1. O verificador submete o identificador (UUID) do documento.
2. O contrato inteligente invoca `verifyCredential(credentialId, claimedHash)`.
3. O Smart Contract compara o hash gravado com o hash computado e atesta a validade com status `EMITIDO`.

### Cenário C: Teste de Adulteração Bit a Bit
1. Uma credencial legítima de "Sistemas de Informação" é selecionada.
2. No Laboratório Blockchain, simula-se a alteração do curso para "Medicina".
3. O recálculo do SHA-256 gera um hash divergente.
4. O contrato inteligente rejeita a credencial e o portal exibe: `ADULTERACAO DETECTADA: O hash calculado nao coincide com a prova registrada on-chain`.

### Cenário D: Revogação com Preservação de Histórico
1. A instituição emissora original (ou o administrador do consórcio) submete `revokeCredential(credentialId, motivo)`.
2. A blockchain gera o evento `CredentialRevoked` e altera o estado para `REVOKED`.
3. Consultas subsequentes reportam imediatamente que o documento foi cancelado, preservando a data e o motivo auditável.

### Cenário E: Tentativa de Ataque por Conta Não Autorizada
1. Uma carteira arbitrária (Conta #9 do Hardhat, simulando um invasor) tenta emitir um diploma chamando `issueCredential`.
2. A EVM reverte a execução com o erro customizado `OnlyAuthorizedIssuerAllowed()`.
3. O gas é consumido pela tentativa inválida e nenhum estado é alterado no registro compartilhado.

---

## 5. Métricas e Resultados Observados

- **Tempo de Confirmação no Nó Local:** < 250 ms por transação no Hardhat Network.
- **Consumo Médio de Gas (Emissão):** ~65.000 unidades de gas por credencial (extremamente eficiente por armazenar apenas 32 bytes de hash e metadados mínimos).
- **Taxa de Detecção de Adulteração:** 100% de detecção em todas as variações de texto testadas, comprovando a eficácia do efeito avalanche.
- **Tentativas de Revogação Não Autorizadas:** Rejeitadas com 100% de sucesso pela regra `msg.sender == cred.issuer || msg.sender == admin`.

---

## 6. Limitações Metodológicas do Protótipo
1. **Rede Local Monomáquina:** O Hardhat local executa em um único computador. Em uma implantação nacional em produção, a rede consistiria em nós validadores distribuídos geograficamente entre as universidades do consórcio (ex: rede permissionada Besu ou Quorum).
2. **Volatilidade do Nó Hardhat:** Ao encerrar o processo do Hardhat, o estado da memória é reiniciado, exigindo novo deploy e sincronização inicial dos dados demonstrativos.
