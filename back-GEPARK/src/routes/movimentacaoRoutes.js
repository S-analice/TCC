import express from 'express';
import * as MovimentacaoController from '../controllers/MovimentacaoController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(verificarToken);

router.get('/', MovimentacaoController.listar);
router.get('/ativas', MovimentacaoController.listarAtivas);
router.get('/tipos-pagamento', MovimentacaoController.listarTiposPagamento);

router.post('/calcular-valor', MovimentacaoController.calcularValor);

router.post('/entrada', MovimentacaoController.registrarEntrada);
router.post('/:id/saida', MovimentacaoController.registrarSaida);
router.get('/:id', MovimentacaoController.buscarPorId);

export default router;