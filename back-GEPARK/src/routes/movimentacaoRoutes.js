import express from 'express';
import * as MovimentacaoController from '../controllers/MovimentacaoController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { verificarPermissao } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(verificarToken);

router.get('/', verificarPermissao('visualizar_movimentacao'), MovimentacaoController.listar);
router.get('/ativas', verificarPermissao('visualizar_movimentacao'), MovimentacaoController.listarAtivas);
router.get('/tipos-pagamento', verificarPermissao('visualizar_movimentacao'), MovimentacaoController.listarTiposPagamento);
router.get('/:id', verificarPermissao('visualizar_movimentacao'), MovimentacaoController.buscarPorId);

router.post('/calcular-valor', verificarPermissao('visualizar_movimentacao'), MovimentacaoController.calcularValor);
router.post('/entrada', verificarPermissao('criar_movimentacao'), MovimentacaoController.registrarEntrada);
router.post('/:id/saida', verificarPermissao('finalizar_saida'), MovimentacaoController.registrarSaida);

export default router;