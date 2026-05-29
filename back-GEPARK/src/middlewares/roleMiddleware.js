import { verificarPermissao as verificarPermissaoModel } from '../models/PermissaoModel.js';

export const verificarPermissao = (recursoNome) => {
  return async (req, res, next) => {
    try {
      const cargoId = req.usuarioCargo;
      
      if (!cargoId) {
        return res.status(403).json({ 
          message: 'Acesso negado. Cargo não identificado.' 
        });
      }
      
      const temPermissao = await verificarPermissaoModel(cargoId, recursoNome);
      
      if (!temPermissao) {
        return res.status(403).json({ 
          message: `Acesso negado. Você não tem permissão para ${recursoNome}.` 
        });
      }
      
      next();
    } catch (error) {
      console.error('Erro no middleware de permissão:', error);
      res.status(500).json({ message: 'Erro ao verificar permissão' });
    }
  };
};

export const verificarAdmin = async (req, res, next) => {
  try {
    const cargoId = req.usuarioCargo;
    
    if (cargoId !== 1) {
      return res.status(403).json({ 
        message: 'Acesso negado. Apenas administradores podem acessar.' 
      });
    }
    
    next();
  } catch (error) {
    console.error('Erro ao verificar admin:', error);
    res.status(500).json({ message: 'Erro ao verificar permissão' });
  }
};