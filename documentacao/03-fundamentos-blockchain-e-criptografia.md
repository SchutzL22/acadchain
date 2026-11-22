# Documentação Científica 03: Fundamentos de Blockchain e Criptografia

## 1. Do Artigo de Satoshi Nakamoto (2008) à Máquina de Estados de Vitalik Buterin (2014)

### O Ledger Imutável de Nakamoto (2008)
Em seu seminal artigo *Bitcoin: A Peer-to-Peer Electronic Cash System*, Satoshi Nakamoto articulou três pilares teóricos:
1. **Encadeamento Criptográfico:** Cada bloco contém o hash do cabeçalho do bloco imediatamente anterior. Qualquer tentativa de alterar um registro passado exigiria recalcular o hash de todos os blocos subsequentes.
2. **Timestamping Distribuído:** Prova de que os dados existiam em determinado instante no tempo.
3. **Consenso Distribuído:** Superação do clássico problema dos generais bizantinos em ambiente aberto.

### Os Contratos Inteligentes de Vitalik Buterin (2014)
Enquanto o Bitcoin foi concebido com uma linguagem de script propositalmente restrita para transferências financeiras, Vitalik Buterin propôs a generalização da blockchain por meio da **Ethereum Virtual Machine (EVM)**.  
Na EVM, o ledger armazena não apenas saldos, mas programas de computador autônomos (Smart Contracts). Para o AcadChain, isso permite:
- Programar regras imutáveis que autorizam exclusivamente instituições credenciadas a registrar a conclusão de cursos.
- Criar funções de revogação auditáveis caso uma emissão seja invalidada legalmente.

---

## 2. A Função de Hash SHA-256 no AcadChain

O SHA-256 (Secure Hash Algorithm 256-bit) possui três propriedades cruciais para a segurança de diplomas:
- **Determinismo:** Uma mesma entrada de dados sempre gera exatamente o mesmo hash de 64 caracteres hexadecimais.
- **Resistência à Pré-imagem (Unidirecionalidade):** É matematicamente inviável reconstruir os dados do estudante a partir apenas do hash.
- **Efeito Avalanche:** A menor mudança conceitual (por exemplo, trocar uma letra maiúscula por minúscula no nome do formando) altera mais de 50% dos bits do hash final.
