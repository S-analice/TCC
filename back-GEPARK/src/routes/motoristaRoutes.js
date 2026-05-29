import express from 'express';
import * as MotoristaController from '../controllers/MotoristaController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { verificarPermissao } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(verificarToken);

router.get('/', verificarPermissao('visualizar_motorista'), MotoristaController.listar);
router.get('/convenios', verificarPermissao('visualizar_motorista'), MotoristaController.listarConvenios);
router.get('/cpf/:cpf', verificarPermissao('visualizar_motorista'), MotoristaController.buscarPorCpf);
router.get('/:id', verificarPermissao('visualizar_motorista'), MotoristaController.buscarPorId);

router.post('/', verificarPermissao('criar_motorista'), MotoristaController.criar);
router.put('/:id', verificarPermissao('editar_motorista'), MotoristaController.atualizar);
router.delete('/:id', verificarPermissao('inativar_motorista'), MotoristaController.inativar);

export default router;