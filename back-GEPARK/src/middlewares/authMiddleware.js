import jwt from 'jsonwebtoken';
import { verificarTokenValido } from '../models/TokenModel.js';

export const verificarToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = decoded.id;
    req.usuarioCargo = decoded.cargo;
    req.usuarioNome = decoded.nome;
 
    const tokenValido = await verificarTokenValido(token, decoded.id);
    if (!tokenValido) {
      return res.status(401).json({ message: 'Token inválido ou expirado. Faça login novamente.' });
    }
    
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido ou expirado.' });
  }
};