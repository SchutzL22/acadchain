import { Request, Response, NextFunction } from 'express';
import { InstituicoesService } from '../services/instituicoes.service.js';

export class InstituicoesController {
  public static listar(req: Request, res: Response, next: NextFunction): void {
    try {
      const instituicoes = InstituicoesService.listarTodas();
      res.status(200).json({
        sucesso: true,
        mensagem: 'Instituições listadas com sucesso',
        total: instituicoes.length,
        dados: instituicoes,
      });
    } catch (error) {
      next(error);
    }
  }

  public static buscarPorId(req: Request, res: Response, next: NextFunction): void {
    try {
      const id = parseInt(String(req.params.id), 10);
      if (isNaN(id)) {
        res.status(400).json({
          sucesso: false,
          erro: 'O parâmetro id deve ser um número inteiro válido',
        });
        return;
      }

      const instituicao = InstituicoesService.buscarPorId(id);
      if (!instituicao) {
        res.status(404).json({
          sucesso: false,
          erro: `Instituição com ID ${id} não foi encontrada`,
        });
        return;
      }

      res.status(200).json({
        sucesso: true,
        dados: instituicao,
      });
    } catch (error) {
      next(error);
    }
  }
}
