import express from 'express';
import * as FuncionarioController from '../controllers/FuncionarioController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(verificarToken);


router.get('/', FuncionarioController.listar);
router.get('/turnos', FuncionarioController.listarTurnos);
router.get('/cargos', FuncionarioController.listarCargos);


router.get('/:id', FuncionarioController.buscarPorId);
router.post('/', FuncionarioController.criar);
router.put('/:id', FuncionarioController.atualizar);
router.delete('/:id', FuncionarioController.inativar);

export default router;