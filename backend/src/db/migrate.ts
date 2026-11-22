import { getDatabase } from '../config/database.js';

export function runMigrations(): void {
  const db = getDatabase();

  // 1. Cria tabela transacoes_blockchain se não existir
  db.exec(`
    CREATE TABLE IF NOT EXISTS transacoes_blockchain (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      documento_id INTEGER REFERENCES documentos(id) ON DELETE CASCADE,
      tipo_operacao TEXT NOT NULL CHECK(tipo_operacao IN ('DEPLOY', 'AUTORIZAR_EMISSOR', 'EMISSAO', 'REVOGACAO')),
      tx_hash TEXT NOT NULL UNIQUE,
      bloco INTEGER,
      de_endereco TEXT NOT NULL,
      para_endereco TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('PENDENTE', 'CONFIRMADA', 'FALHA')),
      detalhes TEXT,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Adiciona colunas complementares à tabela documentos de forma segura
  const colunas = [
    { nome: 'status_sincronizacao', def: "TEXT NOT NULL DEFAULT 'NAO_SINCRONIZADO'" },
    { nome: 'endereco_emissor_blockchain', def: 'TEXT' },
    { nome: 'dados_canonicos_json', def: 'TEXT' },
    { nome: 'revogado_em', def: 'DATETIME' },
    { nome: 'motivo_revogacao', def: 'TEXT' },
    { nome: 'hash_sha256_pdf', def: 'TEXT' },
    { nome: 'caminho_arquivo_pdf', def: 'TEXT' },
  ];

  const colunasExistentes = (db.prepare("PRAGMA table_info(documentos)").all() as any[]).map(
    (col) => col.name
  );

  for (const col of colunas) {
    if (!colunasExistentes.includes(col.nome)) {
      try {
        db.exec(`ALTER TABLE documentos ADD COLUMN ${col.nome} ${col.def};`);
        console.log(`[Migração] Coluna '${col.nome}' adicionada à tabela documentos.`);
      } catch (err: any) {
        console.warn(`[Migração] Aviso ao adicionar '${col.nome}':`, err.message);
      }
    }
  }
}
