import { DatabaseSync } from 'node:sqlite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');
const dbPath = resolve(rootDir, 'dados', 'acadchain.sqlite');
const sqlPath = resolve(rootDir, 'ajudaainstalar', '02-dados-exemplo.sql');

if (!existsSync(dbPath)) {
  console.log('[AcadChain DB] Banco não encontrado. Criando esquema primeiro...');
  import('./init-db.mjs');
}

console.log('[AcadChain DB] Inserindo dados demonstrativos...');

try {
  const db = new DatabaseSync(dbPath);
  db.exec('PRAGMA foreign_keys = ON;');
  const sql = readFileSync(sqlPath, 'utf8');
  db.exec(sql);
  
  const totalInst = db.prepare('SELECT COUNT(*) as count FROM instituicoes').get().count;
  const totalEst = db.prepare('SELECT COUNT(*) as count FROM estudantes').get().count;
  const totalDoc = db.prepare('SELECT COUNT(*) as count FROM documentos').get().count;
  
  db.close();
  console.log(`[AcadChain DB] Concluído: ${totalInst} instituições, ${totalEst} estudantes e ${totalDoc} documentos cadastrados.`);
} catch (error) {
  console.error('[AcadChain DB] Erro fatal ao popular dados:', error);
  process.exit(1);
}
