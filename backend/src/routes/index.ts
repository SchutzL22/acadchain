import { Router } from 'express';
import healthRoutes from './health.routes.js';
import instituicoesRoutes from './instituicoes.routes.js';
import estudantesRoutes from './estudantes.routes.js';

const apiRouter = Router();

apiRouter.use('/health', healthRoutes);
apiRouter.use('/instituicoes', instituicoesRoutes);
apiRouter.use('/estudantes', estudantesRoutes);

export default apiRouter;
