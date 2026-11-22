# Instruções para Agentes de IA (AGENTS.md)

Este documento contém diretrizes operacionais obrigatórias para agentes de IA (Antigravity, Codex, Copilot, etc.) atuando no projeto **AcadChain**.

## 1. Princípios Fundamentais

- **Leitura Prévia Obrigatória:** Antes de propor ou realizar alterações de arquitetura ou banco de dados, leia os arquivos na pasta `contextualizacao/`, iniciando por `contextualizacao/00-leia-primeiro.md`.
- **Fidelidade ao Escopo e Arquitetura:** Respeite a divisão modular (`client/`, `backend/`, `blockchain/`, `dados/`, `documentacao/`). Não altere escolhas tecnológicas nem insira bibliotecas ou ORMs pesados sem necessidade comprovada.
- **Transparência e Honestidade Técnica:** Não simule testes nem crie funcionalidades de fachada (mock masquerading as real blockchain). Se uma funcionalidade ainda não foi implementada, marque-a expressamente como pendente ou planejada.
- **Preservação de Dados e Segurança:** Nunca use comandos destrutivos sem verificação. Nunca apague arquivos do usuário arbitrariamente. Não registre credenciais, chaves privadas ou senhas nos arquivos do repositório.
- **Ambiente Local Windows 11:** Todos os comandos, scripts e caminhos devem ser plenamente compatíveis com Windows 11 e PowerShell / CMD. Use caminhos protegidos com aspas e trate espaços nos nomes de diretórios.
- **Idioma:** Toda a documentação técnica, explicações ao usuário e interfaces devem ser mantidas em português brasileiro (pt-BR).

## 2. Mapa de Contextualização

Consulte os seguintes arquivos para entender o estado e as diretrizes do projeto:
- `contextualizacao/00-leia-primeiro.md`: Ponto de partida rápido para novas sessões de IA.
- `contextualizacao/01-objetivos-e-escopo.md`: Propósito científico, limites e entregáveis.
- `contextualizacao/02-arquitetura-e-stack.md`: Diagrama de fluxo e responsabilidades de cada módulo.
- `contextualizacao/03-regras-de-desenvolvimento.md`: Convenções de código TypeScript, SQL e tratamento de erros.
- `contextualizacao/04-decisoes-tecnicas.md`: Histórico e justificativas de decisões tomadas.
- `contextualizacao/05-estado-atual.md`: O que está pronto, testado e o que falta.
- `contextualizacao/06-roadmap.md`: Próximas etapas do projeto.
- `contextualizacao/07-glossario.md`: Definições claras de termos (hash, nó, assinatura, smart contract).
- `contextualizacao/08-limitacoes-e-riscos.md`: O que o protótipo não faz e riscos associados.
- `contextualizacao/09-orientacoes-para-ia.md`: Guia de continuidade para agentes sem duplicação de esforço.

## 3. Checklist Rápido pós-modificação

Após qualquer alteração:
1. Validar tipos TypeScript (`npm run build:backend` e `npm run build:client`).
2. Executar testes automatizados (`npm test`).
3. Atualizar `contextualizacao/05-estado-atual.md` se uma funcionalidade ou etapa avançou.
4. Documentar qualquer nova decisão arquitetural em `contextualizacao/04-decisoes-tecnicas.md`.
