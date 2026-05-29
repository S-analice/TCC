import db from '../config/db.js';

export const verificarPermissao = async (cargoId, recursoNome) => {
  try {
    const [rows] = await db.query(`
      SELECT p.permitido
      FROM permissao p
      JOIN recurso r ON p.recurso_id = r.id
      WHERE p.cargo_id = ? AND r.nome = ?
    `, [cargoId, recursoNome]);
    
    if (rows.length === 0) {
      return false; 
    }
    
    return rows[0].permitido === 1;
  } catch (error) {
    console.error('Erro ao verificar permissão:', error);
    return false;
  }
};

export const buscarRecursosPorCargo = async (cargoId) => {
  try {
    const [rows] = await db.query(`
      SELECT r.nome
      FROM permissao p
      JOIN recurso r ON p.recurso_id = r.id
      WHERE p.cargo_id = ? AND p.permitido = TRUE
    `, [cargoId]);
    
    return rows.map(row => row.nome);
  } catch (error) {
    console.error('Erro ao buscar recursos do cargo:', error);
    return [];
  }
};