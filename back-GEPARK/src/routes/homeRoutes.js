import express from 'express';
import * as HomeController from '../controllers/HomeController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { verificarPermissao } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(verificarToken);

router.get('/', verificarPermissao('visualizar_home'), HomeController.getHomeData);
router.get('/indicadores', verificarPermissao('visualizar_home'), HomeController.getIndicadores);
router.get('/ultimas-movimentacoes', verificarPermissao('visualizar_home'), HomeController.getUltimasMovimentacoes);
router.get('/saudacao', verificarPermissao('visualizar_home'), HomeController.getSaudacao);

export default router;