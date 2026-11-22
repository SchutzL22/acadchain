import express, { Application } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

export function createApp(): Application {
  const app = express();

  // CORS configurado para aceitar frontend autorizado
  app.use(
    cors({
      origin: [env.FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );

  app.use(express.json());

  // Rota raiz informativa
  app.get('/', (req, res) => {
    res.json({
      projeto: 'AcadChain',
      tema: 'Blockchain para Certificação Acadêmica Nacional',
      status: 'API operacional',
      endpoints: [
        '/api/health',
        '/api/instituicoes',
        '/api/instituicoes/:id',
        '/api/estudantes',
        '/api/estudantes/:id',
      ],
      documentacao: 'Consulte /documentacao na raiz do projeto',
    });
  });

  // Rotas da API REST
  app.use('/api', apiRouter);

  // Rota 404 para rotas não mapeadas
  app.use((req, res) => {
    res.status(404).json({
      sucesso: false,
      erro: `Rota ${req.method} ${req.originalUrl} não encontrada na API do AcadChain`,
    });
  });

  // Tratador de erros global
  app.use(errorHandler);

  return app;
}
