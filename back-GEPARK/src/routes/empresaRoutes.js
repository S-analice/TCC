import express from 'express';
import * as EmpresaController from '../controllers/EmpresaController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(verificarToken);
router.get('/', EmpresaController.listar);
router.get('/:id', EmpresaController.buscarPorId);

router.post('/', EmpresaController.criar);
router.put('/:id', EmpresaController.atualizar);
router.delete('/:id', EmpresaController.inativar);

export default router;