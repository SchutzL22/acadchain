# Documentação Científica 05: Arquitetura de Segurança, Limites e "Problema da Origem"

## 1. O Problema da Origem ("Garbage In, Garbage Out")
Uma constatação científica fundamental que todo trabalho sobre blockchain acadêmica deve explicitar:  
**A blockchain garante imutabilidade e integridade, mas NÃO atesta a veracidade fática original dos dados.**

Se um funcionário desonesto ou uma instituição clandestina tiver a chave privada de emissão e registrar um diploma para alguém que jamais cursou as disciplinas, a blockchain registrará esse fato com perfeição imutável.  
Portanto, a segurança do AcadChain apoia-se em duas camadas:
1. **Governança do Consórcio:** Apenas instituições legalmente credenciadas recebem endereços com permissão de emissão (`ROLE_EMISSOR`).
2. **Auditabilidade de Chave:** Toda emissão fica vinculada publicamente ao endereço criptográfico da IES. Se for constatada fraude na origem, a IES emissora é responsabilizada e o registro pode ser marcado como revogado por decisão do comitê.

---

## 2. Ameaças Prevenidas pelo AcadChain

- **Adulteração de Notas ou Nomes em PDF:** Se um aluno alterar seu nome ou curso em um arquivo local, o hash recalculado não coincidirá com o registro na rede.
- **Emissão Falsa por Terceiros sem Credencial:** Apenas chaves autorizadas no smart contract de governança conseguem emitir registros válidos.
- **Fraude em Carteirinhas Estudantis:** Entidades de eventos podem checar a validade e a matrícula ativa instantaneamente, impedindo falsificações gráficas de carteirinhas de papel ou plástico.
- **Extinção da Instituição:** Se uma faculdade fechar suas portas, os registros passados de seus ex-alunos continuam disponíveis e verificáveis para sempre na rede distribuída.
