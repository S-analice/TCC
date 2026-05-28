import db from '../config/db.js';

export const salvarToken = async (funcionarioId, token, expiracao) => {
  try {
    await db.query('DELETE FROM token WHERE funcionario_id = ?', [funcionarioId]);
    
    const [result] = await db.query(`
      INSERT INTO token (funcionario_id, token, expiracao)
      VALUES (?, ?, ?)
    `, [funcionarioId, token, expiracao]);
    
    return result.insertId;
  } catch (error) {
    console.error('Erro ao salvar token:', error);
    throw error;
  }
};

export const verificarTokenValido = async (token, funcionarioId) => {
  try {
    const [rows] = await db.query(`
      SELECT * FROM token 
      WHERE token = ? AND funcionario_id = ? AND expiracao > NOW()
    `, [token, funcionarioId]);
    
    return rows.length > 0;
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    throw error;
  }
};

export const removerToken = async (funcionarioId) => {
  try {
    await db.query('DELETE FROM token WHERE funcionario_id = ?', [funcionarioId]);
  } catch (error) {
    console.error('Erro ao remover token:', error);
    throw error;
  }
};

export const limparTokensExpirados = async () => {
  try {
    const [result] = await db.query('DELETE FROM token WHERE expiracao < NOW()');
    return result.affectedRows;
  } catch (error) {
    console.error('Erro ao limpar tokens expirados:', error);
    throw error;
  }
};