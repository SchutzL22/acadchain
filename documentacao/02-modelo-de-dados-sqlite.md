# Documentação Científica 02: Modelo de Dados SQLite e Separação de Camadas

## 1. O que Fica no Banco Tradicional vs. O que Fica na Blockchain

Um erro frequente em projetos incipientes de blockchain é tentar armazenar bases relacionais inteiras diretamente na cadeia de blocos. No AcadChain, adotamos a arquitetura canônica de **Storage Off-Chain com Proof On-Chain**:

| Atributo | Banco Relacional Local (SQLite) | Blockchain Distribuída (Ethereum/Hardhat) |
| :--- | :--- | :--- |
| **Tipo de Dados** | Dados cadastrais completos (nome, CPF, notas, histórico, e-mail) | Apenas hashes criptográficos (SHA-256), status e endereços de emissores |
| **Privacidade (LGPD)** | Alta: dados pessoais protegidos em base local da instituição | Máxima: nenhum dado pessoal sensível é exposto na blockchain pública |
| **Custo de Armazenamento** | Quase nulo (disco local) | Otimizado (apenas 32 bytes por hash registrado) |
| **Mutabilidade** | Mutável para atualizações administrativas (ex: correção de endereço) | Estritamente imutável (histórico de auditoria indelével) |
| **Velocidade de Consulta** | Milissegundos para buscas complexas e filtros | Rápida para validação de existência de hash |

---

## 2. Esquema Relacional do SQLite (`node:sqlite`)

O banco local possui 6 tabelas com integridade referencial estrita:

1. **`instituicoes`**: Cadastro institucional das IES fictícias do consórcio (sigla, código fictício, tipo institucional).
2. **`estudantes`**: Cadastro discente fictício (nome completo, CPF fictício, data de nascimento).
3. **`usuarios`**: Contas e papéis de acesso à plataforma (administradores, gestores institucionais e auditores).
4. **`matriculas`**: Vínculo entre estudante e IES (curso, nível acadêmico, ano de ingresso e status da matrícula).
5. **`documentos`**: Registro de diplomas, certificados e carteirinhas. Contém o `uuid_publico`, o `hash_sha256_conteudo` e campos preparados para vinculação on-chain (`tx_hash_blockchain`, `bloco_blockchain`).
6. **`auditoria`**: Log estruturado de eventos administrativos para governança e rastreamento de ações no sistema.

---

## 3. Integridade e Chaves Estrangeiras
A diretiva `PRAGMA foreign_keys = ON;` é ativada em toda conexão do backend, garantindo que não existam registros órfãos ou inconsistências na base de dados.
