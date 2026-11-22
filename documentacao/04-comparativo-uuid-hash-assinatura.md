# Documentação Científica 04: Comparativo Técnico — UUID vs. Hash SHA-256 vs. Assinatura Digital

Um equívoco comum em discussões leigas sobre segurança digital é confundir identificadores, hashes criptográficos e assinaturas digitais. A tabela abaixo sintetiza a função precisa de cada um no AcadChain:

| Critério | UUID (Universally Unique Identifier) | Hash SHA-256 | Assinatura Digital Assimétrica |
| :--- | :--- | :--- | :--- |
| **Função Primária** | Localização e identificação unívoca de um registro | Garantia estrita de **integridade** do conteúdo | Garantia de **autenticidade** e **não repúdio** de autoria |
| **Como é gerado?** | Gerador pseudoaleatório de números de 128 bits | Algoritmo determinístico sobre os bytes do documento | Criptografia assimétrica (cifra do hash com chave privada) |
| **Depende do conteúdo?** | **NÃO.** Dois diplomas com conteúdos idênticos terão UUIDs diferentes. | **SIM.** Qualquer alteração no texto modifica o hash inteiramente. | **SIM.** A assinatura é calculada sobre o hash do conteúdo. |
| **Detecta adulteração?** | **NÃO.** Um invasor pode alterar o nome no diploma sem mudar o UUID. | **SIM.** Se o diploma for alterado, o novo hash não baterá com o registrado. | **SIM.** A chave pública rejeitará a assinatura caso o documento mude. |
| **Prova quem emitiu?** | **NÃO.** | **NÃO.** (Apenas diz que o conteúdo existe, não quem o criou). | **SIM.** Apenas o detentor da chave privada correspondente poderia assiná-lo. |
| **Uso no AcadChain** | Rótulo público para URL de consulta (`/verificar?id=...`) | Prova de integridade guardada no banco e na blockchain | Autenticação das transações das IES enviadas à blockchain |

---

## Síntese de Interação
No fluxo do AcadChain:
1. O diploma recebe um **UUID** para indexação e rotulagem humana/URL.
2. Os dados acadêmicos do formando são convertidos em um **Hash SHA-256** para provar que nenhum dado foi alterado.
3. A instituição assina digitalmente a transação na **Blockchain** usando sua chave de emissor credenciado.
