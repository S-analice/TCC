import express from 'express';
import { 
    solicitarRecuperacao, 
    validarToken, 
    redefinirSenha 
} from '../controllers/RecuperacaoController.js';

const router = express.Router();

router.post('/solicitar', solicitarRecuperacao);
router.get('/validar/:token', validarToken);
router.post('/redefinir', redefinirSenha);

export default router;