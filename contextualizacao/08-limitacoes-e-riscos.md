# 08 - Limitações e Riscos do Protótipo (Atualizado Etapa 2)

## 1. Limitações Técnicas Específicas da Etapa 2

1. **Nó Local Hardhat vs. Rede Nacional Real:**  
   O Hardhat Network executado localmente na porta 8545 serve para testar transações reais, compilação EVM e regras determinísticas. Ele **não representa uma rede geograficamente descentralizada** entre data centers de universidades independentes. Em ambiente real de produção, utilizaria-se uma rede permissionada (ex: Hyperledger Besu ou consórcio Ethereum federado) com consenso Proof of Authority (PoA) ou Istanbul BFT.
2. **Volatilidade da Memória do Hardhat:**  
   Ao fechar a janela do nó do Hardhat (`parar.bat`), o estado da blockchain na memória é resetado. Por essa razão, o script `iniciar.bat` foi projetado para reimplantar o contrato e recriar as credenciais de demonstração caso detecte que a rede foi reiniciada.
3. **Ausência de PDFs Físicos:**  
   Nesta etapa, o hash SHA-256 é calculado sobre os dados acadêmicos canônicos estruturados (JSON canônico RFC 8785). A incorporação do arquivo PDF binário ocorrerá na Etapa 3.

## 2. Riscos e Medidas Mitigadoras
- **Privacidade e LGPD:** Nenhum dado pessoal (nome, CPF, notas) é armazenado na blockchain. Apenas o hash SHA-256 de 32 bytes e o endereço Ethereum da instituição são gravados on-chain.
- **Chaves Privadas de Teste:** As chaves privadas presentes no código pertencem estritamente à lista pública de testes do Hardhat. Nunca devem ser utilizadas em redes públicas (Mainnet ou testnets públicas).
