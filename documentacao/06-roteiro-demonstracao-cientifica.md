# Documentação Científica 06: Roteiro de Demonstração Científica e Avaliação

Este roteiro foi elaborado para permitir que pesquisadores, professores e avaliadores de bancas examinem o protótipo do AcadChain de forma estruturada.

---

## Passo 1: Inicialização do Ambiente
1. Clone ou abra a pasta do repositório no Windows 11.
2. Execute `instalar.bat` para certificar-se de que os requisitos (Node.js 24+, Git) estão presentes e o banco SQLite foi inicializado com os dados sintéticos.
3. Execute `iniciar.bat` para iniciar o backend e o frontend simultaneamente.

---

## Passo 2: Navegação e Inspeção Institucional
1. Acesse `http://localhost:5173/` no navegador.
2. Navegue até a seção **"Instituições"**:
   - Observe as 3 universidades fictícias cadastradas: *Universidade Federal do Saber (UFS)*, *Instituto Tecnológico do Brasil (ITB)* e *Pontifícia Universidade Integrada (PUI)*.
   - Observe os dados de credenciamento fictício, tipo de instituição e status.
3. Navegue até a seção **"Estudantes"**:
   - Observe a listagem de alunos fictícios e os respectivos cursos cadastrados via API REST.

---

## Passo 3: Inspeção Teórica e Científica
1. Clique em **"Como Funciona"**:
   - Examine a explicação didática sobre funções de dispersão (SHA-256), efeito avalanche e a separação entre dados relacionais e provas na blockchain.
2. Clique em **"Verificação Pública"**:
   - Verifique como o sistema apresenta a interface de validação e a mensagem transparente quanto ao status de protótipo acadêmico (Etapa 1).

---

## Passo 4: Verificação da Integridade da API REST
1. Abra um terminal ou navegador em `http://localhost:3001/api/health`.
2. Observe o retorno em formato JSON com o status do banco SQLite:
   ```json
   {
     "status": "online",
     "banco": "conectado",
     "timestamp": "..."
   }
   ```
3. Acesse `http://localhost:3001/api/instituicoes` e verifique a listagem de IES retornadas do banco SQLite nativo.
