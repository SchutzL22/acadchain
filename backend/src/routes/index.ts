import { Router } from 'express';
import healthRoutes from './health.routes.js';
import instituicoesRoutes from './instituicoes.routes.js';
import estudantesRoutes from './estudantes.routes.js';
import blockchainRoutes from './blockchain.routes.js';
import credenciaisRoutes from './credenciais.routes.js';

const apiRouter = Router();

apiRouter.use('/health', healthRoutes);
apiRouter.use('/instituicoes', instituicoesRoutes);
apiRouter.use('/estudantes', estudantesRoutes);
apiRouter.use('/blockchain', blockchainRoutes);
apiRouter.use('/credenciais', credenciaisRoutes);

export default apiRouter;
