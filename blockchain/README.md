# Módulo Blockchain - AcadChain

## Status Atual: Planejado para Etapa 2

Este diretório conterá o ambiente de Smart Contracts e integração com a rede Ethereum local, estruturado em torno do framework **Hardhat 3**.

### Escopo Previsto para Etapas Futuras:
1. **Contratos Inteligentes (Solidity):**
   - `AcadChainRegistry.sol`: Registro e gerenciamento de instituições credenciadas no consórcio universitário.
   - `AcademicCredential.sol`: Emissão, revogação e verificação do hash SHA-256 de diplomas e certificados acadêmicos.
   - `StudentIdentity.sol`: Registro de vínculo e validade de carteirinhas estudantis.
2. **Ambiente de Testes e Scripts de Deploy:**
   - Deploy automatizado em nó Ethereum local (Hardhat Network).
   - Testes unitários com assertions de eventos e controle de acesso baseado em roles (OpenZeppelin AccessControl).
3. **Comunicação com o Backend:**
   - Provider JSON-RPC conectando o serviço de backend à rede local.
   - Emissão de transações assinadas para gravação das provas de integridade.

> [!NOTE]
> Na Etapa 1, nenhuma dependência de smart contract está ativa para manter a aplicação desacoplada e independente enquanto o núcleo de dados, backend e interface são estabelecidos.
