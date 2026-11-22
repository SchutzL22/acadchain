# 03 - Regras de Desenvolvimento

Para manter o código limpo, seguro e sustentável, todos os desenvolvedores e assistentes de IA devem obedecer às seguintes diretrizes:

## 1. Segurança e Integridade
- **Consultas Parametrizadas:** NUNCA concatene valores em strings SQL (`SELECT * FROM tabela WHERE id = '` + id + `'`). Utilize sempre placeholders (`db.prepare('SELECT * FROM tabela WHERE id = ?').get(id)`).
- **Sem Dados Reais:** Utilize estritamente dados sintéticos gerados para fins de demonstração acadêmica.
- **Tratamento de Erros:** Não silencie exceções sem registrar logs adequados. O backend deve responder com códigos HTTP semânticos (400, 404, 500) e mensagens claras.
- **CORS Configurado:** Garanta que a API só aceite requisições da porta do frontend definida nas variáveis de ambiente.

## 2. Padrões de Código e TypeScript
- Modo estrito (`strict: true`) em todos os `tsconfig.json`.
- Tipagem explícita para requisições, respostas, entidades e serviços.
- Não utilize `any` desnecessariamente; crie interfaces em pastas dedicadas (`types/`).

## 3. Compatibilidade Windows 11
- Todas as operações em lote e caminhos de arquivo devem suportar espaços e barras convencionais (`path.join`, barras normatizadas).
- Scripts `.bat` devem usar `"%~dp0"` para resolver diretórios a partir de sua localização física, prevenindo erros quando invocados de outros diretórios.

## 4. Testes e Validação
- Nenhuma alteração deve ser considerada concluída sem verificação de compilação TypeScript (`npm run build`).
- Scripts de inicialização de banco devem ser idempotentes: rodar duas vezes o script não deve corromper o banco nem duplicar registros descontroladamente.
