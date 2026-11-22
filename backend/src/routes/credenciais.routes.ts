import { Router } from 'express';
import { CredenciaisController } from '../controllers/credenciais.controller.js';

const router = Router();

router.get('/', CredenciaisController.listar);
router.get('/:id', CredenciaisController.buscarPorId);
router.get('/:id/verificar', CredenciaisController.verificar);
router.post('/emitir', CredenciaisController.emitir);
router.post('/:id/revogar', CredenciaisController.revogar);

export default router;
