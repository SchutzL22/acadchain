import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('=== Verificação de Ambiente AcadChain ===');
console.log(`Node.js: ${process.version}`);
console.log(`Plataforma: ${process.platform} (${process.arch})`);

const [major, minor] = process.version.slice(1).split('.').map(Number);
if (major < 22 || (major === 22 && minor < 5)) {
  console.error('[ERRO] É necessário Node.js 22.5.0 ou superior (Recomendado: Node 24+ LTS) para o suporte a node:sqlite.');
  process.exit(1);
}

try {
  const { DatabaseSync } = await import('node:sqlite');
  if (typeof DatabaseSync !== 'function') {
    throw new Error('DatabaseSync não é uma função.');
  }
  console.log('[OK] Módulo nativo node:sqlite disponível e funcional.');
} catch (err) {
  console.error('[ERRO] Falha ao carregar node:sqlite:', err.message);
  process.exit(1);
}

console.log('=== Ambiente Validado com Sucesso ===');
