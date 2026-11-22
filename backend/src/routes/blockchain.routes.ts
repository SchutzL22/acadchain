import { Router } from 'express';
import { BlockchainController } from '../controllers/blockchain.controller.js';

const router = Router();

router.get('/status', BlockchainController.getStatus);
router.get('/contrato', BlockchainController.getContrato);
router.get('/transacoes', BlockchainController.getTransacoes);

export default router;
