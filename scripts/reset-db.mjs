import { unlinkSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');
const dbPath = resolve(rootDir, 'dados', 'acadchain.sqlite');

console.log('[AcadChain DB] Resetando banco de dados de demonstração...');

if (existsSync(dbPath)) {
  try {
    unlinkSync(dbPath);
    console.log('[AcadChain DB] Arquivo acadchain.sqlite anterior removido.');
  } catch (err) {
    console.error('[AcadChain DB] Não foi possível remover o arquivo (pode estar em uso):', err.message);
    process.exit(1);
  }
}

const initResult = spawnSync(process.execPath, [resolve(__dirname, 'init-db.mjs')], { stdio: 'inherit' });
if (initResult.status !== 0) {
  process.exit(initResult.status || 1);
}

const seedResult = spawnSync(process.execPath, [resolve(__dirname, 'seed-db.mjs')], { stdio: 'inherit' });
if (seedResult.status !== 0) {
  process.exit(seedResult.status || 1);
}

console.log('[AcadChain DB] Reset completo com sucesso.');
