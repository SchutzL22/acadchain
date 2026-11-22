import { Router } from 'express';
import multer from 'multer';
import { DocumentosController } from '../controllers/documentos.controller.js';

const router = Router();

// Configura upload com multer na memória (limite de 10 MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: (_req, file, cb) => {
    // Permite application/pdf ou arquivos com extensão .pdf
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos PDF são permitidos para verificação'));
    }
  },
});

// Rotas de documentos
router.get('/:id/pdf', DocumentosController.obterPdf);
router.get('/:id/carteirinha', DocumentosController.obterDadosCarteirinha);
router.post('/verificar-pdf', upload.single('arquivo'), DocumentosController.verificarPdf);
router.get('/:id/adulterar-demonstracao', DocumentosController.gerarPdfAdulteradoParaTeste);

export default router;
