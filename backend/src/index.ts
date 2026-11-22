import { createApp } from './app.js';
import { env } from './config/env.js';
import { getDatabase } from './config/database.js';

const app = createApp();

// Verifica a integridade do banco antes de escutar requisições
try {
  const db = getDatabase();
  const res = db.prepare('SELECT COUNT(*) as count FROM instituicoes').get() as { count: number };
  console.log(`[AcadChain Backend] Banco SQLite conectado. ${res.count} instituições registradas.`);
} catch (err: any) {
  console.error('[AcadChain Backend] Aviso: Falha ao verificar banco de dados:', err.message);
}

const server = app.listen(env.PORT, () => {
  console.log(`=======================================================`);
  console.log(`  AcadChain Backend API REST rodando na porta ${env.PORT}`);
  console.log(`  Endereço: http://localhost:${env.PORT}`);
  console.log(`  Healthcheck: http://localhost:${env.PORT}/api/health`);
  console.log(`  Instituições: http://localhost:${env.PORT}/api/instituicoes`);
  console.log(`  Estudantes: http://localhost:${env.PORT}/api/estudantes`);
  console.log(`=======================================================`);
});

process.on('SIGINT', () => {
  console.log('\n[AcadChain Backend] Encerrando servidor com segurança...');
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n[AcadChain Backend] Recebido SIGTERM. Encerrando...');
  server.close(() => {
    process.exit(0);
  });
});
