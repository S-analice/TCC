import db from '../config/db.js';

/**
 * Criar um novo registro de checklist (bloqueio)
 * @param {Object} dados - { movimentacao_id, funcionario_id, motivo, data_desbloqueio }
 */

export const criar = async (dados) => {
  try {
    const { movimentacao_id, funcionario_id, motivo, data_desbloqueio } = dados;
    
    const [result] = await db.query(`
      INSERT INTO checklist (movimentacao_id, funcionario_id, motivo, created_at)
      VALUES (?, ?, ?, NOW())
    `, [movimentacao_id, funcionario_id, motivo]);
    
    return { id: result.insertId, ...dados };
  } catch (error) {
    throw error;
  }
};

export const buscarPorMotoristaId = async (motoristaId) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        c.id, c.movimentacao_id, c.funcionario_id, c.motivo, c.created_at,
        f.nome as funcionario_nome,
        m.id as motorista_id, m.cpf as motorista_cpf, m.placa as motorista_placa,
        m.status as motorista_status, m.data_fim_bloqueio
      FROM checklist c
      JOIN movimentacao mov ON c.movimentacao_id = mov.id
      JOIN motorista m ON mov.motorista_id = m.id
      JOIN funcionario f ON c.funcionario_id = f.id
      WHERE m.id = ? AND m.status = 'Bloqueado' AND m.deleted_at IS NULL
      ORDER BY c.created_at DESC
      LIMIT 1
    `, [motoristaId]);
    
    return rows[0];
  } catch (error) {
    throw error;
  }
};

export const buscarPorMovimentacaoId = async (movimentacaoId) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        c.id, c.movimentacao_id, c.funcionario_id, c.motivo, c.created_at,
        f.nome as funcionario_nome
      FROM checklist c
      JOIN funcionario f ON c.funcionario_id = f.id
      WHERE c.movimentacao_id = ?
    `, [movimentacaoId]);
    
    return rows[0];
  } catch (error) {
    throw error;
  }
};

export const motoristaEstaBloqueado = async (motoristaId) => {
  try {
    const [rows] = await db.query(`
      SELECT id, data_fim_bloqueio 
      FROM motorista 
      WHERE id = ? AND status = 'Bloqueado' AND deleted_at IS NULL
    `, [motoristaId]);
    
    if (!rows[0]) return false;

    const dataFimBloqueio = new Date(rows[0].data_fim_bloqueio);
    const agora = new Date();
    
    if (dataFimBloqueio <= agora) {
      await db.query(`
        UPDATE motorista 
        SET status = 'Ativo', data_fim_bloqueio = NULL 
        WHERE id = ?
      `, [motoristaId]);
      return false;
    }
    
    return true;
  } catch (error) {
    throw error;
  }
};

export default {
  criar,
  buscarPorMotoristaId,
  buscarPorMovimentacaoId,
  motoristaEstaBloqueado
};