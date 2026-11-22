import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('[AcadChain API Error]:', err);

  const status = err.status || 500;
  const message = err.message || 'Erro interno no servidor do AcadChain';

  res.status(status).json({
    sucesso: false,
    erro: message,
    detalhes: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}
