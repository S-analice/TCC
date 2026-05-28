import express from 'express';
import * as UploadController from '../controllers/UploadController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(verificarToken);


router.post('/funcionarios/:id/foto', UploadController.uploadFotoFuncionario);
router.get('/funcionarios/:id/foto', UploadController.getFotoFuncionario);

export default router;