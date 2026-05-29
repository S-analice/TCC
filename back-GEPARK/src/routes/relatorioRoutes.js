import express from 'express';
import * as RelatorioController from '../controllers/RelatorioController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { verificarPermissao } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(verificarToken);

router.get('/movimentacoes', verificarPermissao('gerar_relatorio_movimentacoes'), RelatorioController.gerarRelatorioPDF);
router.get('/movimentacoes/exportar', verificarPermissao('gerar_relatorio_movimentacoes'), RelatorioController.exportarCSV);
router.get('/veiculos-patio', verificarPermissao('gerar_relatorio_veiculos_patio'), RelatorioController.gerarRelatorioAtivasPDF);
router.get('/ativas', verificarPermissao('visualizar_movimentacao'), RelatorioController.getMovimentacoesAtivas);

export default router;