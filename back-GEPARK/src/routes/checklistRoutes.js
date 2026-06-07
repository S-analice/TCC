import express from 'express';
import * as ChecklistController from '../controllers/ChecklistController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { verificarPermissao } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(verificarToken);

router.post('/', verificarPermissao('cancelar_movimentacao_checklist'), ChecklistController.criar);

router.get('/movimentacao/:movimentacaoId', verificarPermissao('visualizar_movimentacao'), ChecklistController.buscarPorMovimentacao);
router.get('/motorista/:motoristaId', verificarPermissao('visualizar_motorista'), ChecklistController.buscarBloqueioPorMotorista);

export default router;