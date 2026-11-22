import dotenv from 'dotenv';
import path from 'node:path';

// Carrega .env da raiz do projeto ou do diretório atual
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config(); // fallback local

export const env = {
  PORT: Number(process.env.PORT) || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  DATABASE_PATH: process.env.DATABASE_PATH || path.resolve(process.cwd(), '../dados/acadchain.sqlite'),
};
