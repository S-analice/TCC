import express from 'express';
import { login, logout } from '../controllers/AuthController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', verificarToken, logout);

export default router;