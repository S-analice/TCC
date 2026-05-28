import express from 'express';
import * as HomeController from '../controllers/HomeController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(verificarToken);
router.get('/', HomeController.getHomeData);

router.get('/indicadores', HomeController.getIndicadores);
router.get('/ultimas-movimentacoes', HomeController.getUltimasMovimentacoes);

router.get('/saudacao', HomeController.getSaudacao);

export default router;