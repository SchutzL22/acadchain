# 07 - Glossário de Termos

Este glossário esclarece conceitos fundamentais de criptografia e sistemas distribuídos utilizados no AcadChain, com linguagem acessível a acadêmicos e desenvolvedores.

---

### 1. Hash Criptográfico (SHA-256)
Uma função matemática unidirecional que converte qualquer volume de dados (um texto, um PDF ou um registro de banco) em uma cadeia alfanumérica de tamanho fixo (256 bits, ou 64 caracteres hexadecimais).  
*Propriedade-chave:* O menor caractere alterado no documento original altera completamente o hash resultante (efeito avalanche), tornando impossível adulterar um certificado sem que o hash seja diferente.

### 2. UUID (Universally Unique Identifier)
Um identificador único universal de 128 bits (ex: `c8d1e2f3-a4b5-4c6d-8e9f-0a1b2c3d4e5f`).  
*Diferença para o Hash:* O UUID é um rótulo arbitrário para encontrar um registro; ele **não** possui relação matemática com o conteúdo do documento. O hash, por sua vez, é derivado diretamente do conteúdo.

### 3. Assinatura Digital
Mecanismo que utiliza um par de chaves assimétricas (chave privada para assinar e chave pública para validar). Garante autenticidade (quem assinou) e não repúdio (o emissor não pode negar a autoria).

### 4. Blockchain e Ledgers Distribuídos
Uma cadeia de blocos de dados sequenciais e imutáveis mantida por múltiplos computadores (nós) interconectados em rede peer-to-peer. Cada bloco contém o hash do bloco anterior, impedindo que registros históricos sejam reescritos retroativamente.

### 5. Smart Contract (Contrato Inteligente)
Programa de computador determinístico executado diretamente dentro da Máquina Virtual Ethereum (EVM). Uma vez publicado na blockchain, seu código é imutável e suas regras são aplicadas rigorosamente sem intervenção humana.

### 6. Nó (Node)
Um computador participante da rede blockchain que armazena uma cópia do livro-razão (ledger) e valida transações de acordo com o protocolo de consenso.

### 7. Revogação de Certificado
Ato de invalidar um documento previamente emitido (por exemplo, por cancelamento de matrícula ou anulação judicial de diploma). Na blockchain, a revogação não apaga o registro passado, mas registra uma nova transação imutável alterando o estado da credencial para `REVOGADO`.
