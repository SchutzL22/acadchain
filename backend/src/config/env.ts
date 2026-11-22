import dotenv from 'dotenv';
import path from 'node:path';

// Determina a raiz do projeto de forma robusta
const isInsideBackend = process.cwd().replace(/\\/g, '/').endsWith('/backend');
const projectRoot = isInsideBackend ? path.resolve(process.cwd(), '..') : process.cwd();

dotenv.config({ path: path.resolve(projectRoot, '.env') });
dotenv.config(); // fallback local

export const env = {
  PORT: Number(process.env.PORT) || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  DATABASE_PATH: process.env.DATABASE_PATH || path.resolve(projectRoot, 'dados', 'acadchain.sqlite'),
};
