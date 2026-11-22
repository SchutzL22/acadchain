# 08 - Limitações do Protótipo e Riscos de Segurança

Para manter a honestidade científica e a clareza metodológica, o AcadChain documenta expressamente seus limites operacionais e riscos de segurança:

---

## 1. Limitações do Protótipo Atual
1. **Ambiente Estritamente Local:** O sistema é concebido para execução em `localhost` no Windows 11. Não foi projetado nesta etapa para ambientes expostos à internet pública.
2. **Ausência de Validação Jurídica Formal:** O sistema não é credenciado junto ao Ministério da Educação (MEC) nem utiliza certificados digitais A1/A3 emitidos sob a hierarquia da ICP-Brasil.
3. **Escopo dos Dados:** Todos os cadastros de instituições, alunos e cursos são artificiais e sintéticos.
4. **Dependência da Integridade de Origem (Problema do "Lixo Entra, Lixo Sai"):** A blockchain garante que o dado registrado não foi modificado após a emissão. Contudo, ela **não tem capacidade de saber se a instituição mentiu** ao cadastrar um diploma falso. Por isso, a governança do consórcio e a creditação das IES são premissas indispensáveis.

---

## 2. Riscos de Segurança e Medidas Mitigadoras
- **SQL Injection:**
  - *Risco:* Injeção de comandos maliciosos em consultas ao banco local.
  - *Mitigação:* Uso obrigatório e estrito de Prepared Statements no módulo `node:sqlite`.
- **CORS e Invasão de Origem:**
  - *Risco:* Acesso não autorizado à API por outras aplicações rodando no navegador.
  - *Mitigação:* Middleware CORS configurado estritamente para a porta autorizada do frontend (`localhost:5173`).
- **Vazamento de Segredos:**
  - *Risco:* Cometer chaves privadas ou senhas para o controle de versão Git.
  - *Mitigação:* `.gitignore` rigoroso protegendo `.env`, banco SQLite e chaves locais.
