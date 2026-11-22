import { Request, Response, NextFunction } from 'express';
import { BlockchainService } from '../services/blockchain.service.js';

export class BlockchainController {
  public static async getStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const status = await BlockchainService.getNetworkStatus();
      res.status(200).json({
        sucesso: true,
        dados: status,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getContrato(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const manifest = BlockchainService.getContractManifest();
      if (!manifest) {
        res.status(404).json({
          sucesso: false,
          erro: 'Manifesto do contrato inteligente não encontrado. Execute o deploy local.',
        });
        return;
      }

      res.status(200).json({
        sucesso: true,
        dados: manifest,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getTransacoes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = parseInt(String(req.query.limit || 20), 10);
      const transacoes = BlockchainService.getRecentTransactions(limit);

      res.status(200).json({
        sucesso: true,
        total: transacoes.length,
        dados: transacoes,
      });
    } catch (error) {
      next(error);
    }
  }
}
