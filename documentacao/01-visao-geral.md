# Documentação Científica 01: Visão Geral do AcadChain

## 1. Introdução e Relevância Acadêmica
O avanço da digitalização no ensino superior trouxe enorme agilidade burocrática, mas também intensificou o risco de fraudes sofisticadas em diplomas de graduação, pós-graduação e identificações estudantis.  
A verificação convencional no Brasil apoia-se em canais centralizados: consultas individuais a websites de secretarias acadêmicas, expedição de ofícios ou validação de assinaturas digitais em PDFs armazenados localmente.

O **AcadChain** investiga um paradigma descentralizado: o consórcio interuniversitário sobre blockchain Ethereum. Em vez de cada universidade manter um ponto único de falha, as instituições compartilham um registro distribuído de atestações criptográficas, no qual qualquer entidade autorizada pode auditar e verificar documentos sem intermediários.

---

## 2. Os Três Papéis Centrais no Ecossistema

```
   ┌──────────────────────────────────────────────┐
   │ 1. Instituições de Ensino Superior (Emissoras)│
   └──────────────────────┬───────────────────────┘
                          │ Emite diploma, calcula SHA-256,
                          │ registra dados no banco local e
                          │ publica prova na Blockchain
                          ▼
   ┌──────────────────────────────────────────────┐
   │ 2. Estudantes e Egressos (Portadores)        │
   └──────────────────────┬───────────────────────┘
                          │ Detêm o documento digital e
                          │ compartilham o código/QR Code
                          ▼
   ┌──────────────────────────────────────────────┐
   │ 3. Verificadores Externos (Empresas/Conselhos)│
   └──────────────────────────────────────────────┘
     Validam a autenticidade diretamente contra o
     registro imutável da rede, sem depender de login
```

### Papel 1: Instituições de Ensino Superior (IES)
- Mantêm seus bancos de dados internos com o histórico escolar, notas e dados cadastrais dos discentes.
- Ao graduar o estudante, calculam o hash criptográfico (SHA-256) dos dados canônicos do diploma.
- Registram a credencial no seu banco local e transmitem a atestação para o contrato inteligente na blockchain.

### Papel 2: Estudantes e Egressos
- Portam seus diplomas ou carteirinhas digitais contendo identificadores únicos e QR Codes.
- Podem apresentar o documento digital em qualquer processo seletivo ou para acesso à meia-entrada cultural.

### Papel 3: Verificadores Externos
- Empregadores, conselhos regionais de classe (ex: CREA, CRM, OAB), órgãos públicos ou promotores de eventos culturais.
- Utilizam o portal público do AcadChain para submeter o hash ou ler o QR Code, obtendo confirmação matemática e imutável de autenticidade em segundos.
