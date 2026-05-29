import express from 'express';
import * as EmpresaController from '../controllers/EmpresaController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { verificarPermissao } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(verificarToken);

router.get('/', verificarPermissao('visualizar_empresa'), EmpresaController.listar);
router.get('/:id', verificarPermissao('visualizar_empresa'), EmpresaController.buscarPorId);

router.post('/', verificarPermissao('criar_empresa'), EmpresaController.criar);
router.put('/:id', verificarPermissao('editar_empresa'), EmpresaController.atualizar);
router.delete('/:id', verificarPermissao('inativar_empresa'), EmpresaController.inativar);

export default router;