import express from 'express';
import * as RelatorioController from '../controllers/RelatorioController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(verificarToken);
router.get('/movimentacoes', RelatorioController.gerarRelatorioPDF);

router.get('/movimentacoes/exportar', RelatorioController.exportarCSV);

router.get('/veiculos-patio', RelatorioController.gerarRelatorioAtivasPDF);

router.get('/ativas', RelatorioController.getMovimentacoesAtivas);

export default router;