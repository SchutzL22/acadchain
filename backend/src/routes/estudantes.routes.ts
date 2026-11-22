import { Router } from 'express';
import { EstudantesController } from '../controllers/estudantes.controller.js';

const router = Router();

router.get('/', EstudantesController.listar);
router.get('/:id', EstudantesController.buscarPorId);

export default router;
