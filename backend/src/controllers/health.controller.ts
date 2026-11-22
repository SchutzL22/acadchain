import { Request, Response } from 'express';
import { getDatabase } from '../config/database.js';

export class HealthController {
  public static check(req: Request, res: Response): void {
    try {
      const db = getDatabase();
      const result = db.prepare('SELECT 1 AS alive').get() as { alive: number } | undefined;
      
      const dbStatus = result?.alive === 1 ? 'conectado' : 'inconsistente';

      res.status(200).json({
        sucesso: true,
        servico: 'AcadChain API REST',
        versao: '0.1.0',
        banco: {
          tipo: 'SQLite (node:sqlite)',
          status: dbStatus,
        },
        ambiente: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({
        sucesso: false,
        servico: 'AcadChain API REST',
        erro: 'Falha ao conectar com o banco de dados SQLite',
        detalhe: error.message,
      });
    }
  }
}
