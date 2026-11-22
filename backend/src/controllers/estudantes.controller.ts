import { Request, Response, NextFunction } from 'express';
import { EstudantesService } from '../services/estudantes.service.js';

export class EstudantesController {
  public static listar(req: Request, res: Response, next: NextFunction): void {
    try {
      const estudantes = EstudantesService.listarTodos();
      res.status(200).json({
        sucesso: true,
        mensagem: 'Estudantes listados com sucesso',
        total: estudantes.length,
        dados: estudantes,
      });
    } catch (error) {
      next(error);
    }
  }

  public static buscarPorId(req: Request, res: Response, next: NextFunction): void {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({
          sucesso: false,
          erro: 'O parâmetro id deve ser um número inteiro válido',
        });
        return;
      }

      const estudante = EstudantesService.buscarPorId(id);
      if (!estudante) {
        res.status(404).json({
          sucesso: false,
          erro: `Estudante com ID ${id} não foi encontrado`,
        });
        return;
      }

      res.status(200).json({
        sucesso: true,
        dados: estudante,
      });
    } catch (error) {
      next(error);
    }
  }
}
