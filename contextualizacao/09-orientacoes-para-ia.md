# 09 - Orientações para Agentes de IA em Novas Sessões

Se você está iniciando uma nova sessão para continuar o desenvolvimento do AcadChain, siga este checklist para descobrir o próximo passo sem duplicar trabalho:

---

## 1. Passo a Passo de Reconhecimento
1. **Leia o estado atual:** Verifique `contextualizacao/05-estado-atual.md` para ver o que já foi finalizado.
2. **Consulte o roadmap:** Veja em `contextualizacao/06-roadmap.md` qual é a próxima etapa a ser abordada (atualmente, a Etapa 2: Blockchain / Hardhat 3).
3. **Verifique a saúde do código existente:**
   - Execute no terminal: `npm run build:backend` e `npm run build:client`.
   - Se houver falhas de tipagem ou compilação, priorize consertá-las antes de adicionar qualquer arquivo novo.

---

## 2. Regras de Não-Regressão
- **Não apague a pasta `dados/` sem confirmação do usuário.** O banco SQLite contém dados de teste que podem ter sido atualizados durante demonstrações.
- **Não reverta para bibliotecas de banco externas** (como `better-sqlite3`, `sequelize` ou `prisma`). O projeto utiliza o módulo nativo `node:sqlite` para garantir estabilidade e zero dependência de compiladores nativos.
- **Sempre teste no Windows 11:** Os comandos shell executados devem ser compatíveis com PowerShell e CMD no Windows.

---

## 3. Como Finalizar a sua Sessão
Antes de encerrar o turno, certifique-se de:
1. Executar todos os testes e builds.
2. Atualizar `contextualizacao/05-estado-atual.md` refletindo as conquistas do seu turno.
3. Se você tomou uma nova decisão de arquitetura, adicione um registro em `contextualizacao/04-decisoes-tecnicas.md`.
