import express from 'express';
import * as MotoristaController from '../controllers/MotoristaController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(verificarToken);
router.get('/', MotoristaController.listar);

router.get('/convenios', MotoristaController.listarConvenios);

router.get('/cpf/:cpf', MotoristaController.buscarPorCpf);
router.get('/:id', MotoristaController.buscarPorId);

router.post('/', MotoristaController.criar);
router.put('/:id', MotoristaController.atualizar);
router.delete('/:id', MotoristaController.inativar);

export default router;