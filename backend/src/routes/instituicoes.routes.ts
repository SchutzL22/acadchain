import { Router } from 'express';
import { InstituicoesController } from '../controllers/instituicoes.controller.js';

const router = Router();

router.get('/', InstituicoesController.listar);
router.get('/:id', InstituicoesController.buscarPorId);

export default router;
