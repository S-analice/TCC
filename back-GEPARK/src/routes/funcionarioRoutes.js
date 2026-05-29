import express from 'express';
import * as FuncionarioController from '../controllers/FuncionarioController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { verificarPermissao } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(verificarToken);

router.get('/', verificarPermissao('visualizar_funcionario'), FuncionarioController.listar);
router.get('/turnos', verificarPermissao('visualizar_funcionario'), FuncionarioController.listarTurnos);
router.get('/cargos', verificarPermissao('visualizar_funcionario'), FuncionarioController.listarCargos);
router.get('/:id', verificarPermissao('visualizar_funcionario'), FuncionarioController.buscarPorId);

router.post('/', verificarPermissao('criar_funcionario'), FuncionarioController.criar);
router.put('/:id', verificarPermissao('editar_funcionario'), FuncionarioController.atualizar);
router.delete('/:id', verificarPermissao('inativar_funcionario'), FuncionarioController.inativar);

export default router;