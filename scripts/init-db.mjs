import { DatabaseSync } from 'node:sqlite';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');
const dadosDir = resolve(rootDir, 'dados');
const dbPath = resolve(dadosDir, 'acadchain.sqlite');
const sqlPath = resolve(rootDir, 'ajudaainstalar', '01-criar-tabelas.sql');

console.log('[AcadChain DB] Inicializando banco de dados SQLite...');

if (!existsSync(dadosDir)) {
  mkdirSync(dadosDir, { recursive: true });
}

try {
  const db = new DatabaseSync(dbPath);
  db.exec('PRAGMA foreign_keys = ON;');
  const sql = readFileSync(sqlPath, 'utf8');
  db.exec(sql);
  db.close();
  console.log(`[AcadChain DB] Sucesso: Tabelas criadas/verificadas em ${dbPath}`);
} catch (error) {
  console.error('[AcadChain DB] Erro fatal ao criar tabelas:', error);
  process.exit(1);
}
