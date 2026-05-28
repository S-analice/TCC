import db from '../config/db.js';
import { limparParaNumeros } from '../utils/formatador.js';

export const buscarTodas = async (status = null) => {
  try {
    let query = `
      SELECT 
        e.id, e.nome, e.cnpj, e.telefone, e.status,
        e.cidade_id, c.nome as cidade_nome, c.estado_id,
        est.nome as estado_nome, est.sigla as estado_sigla
      FROM empresa e
      LEFT JOIN cidade c ON e.cidade_id = c.id
      LEFT JOIN estado est ON c.estado_id = est.id
    `;
    const params = [];
    
    if (status && status !== 'todos') {
      query += ' WHERE e.status = ?';
      params.push(status === 'ativos' ? 'Ativo' : 'Inativo');
    }
    
    query += ' ORDER BY e.nome';
    
    const [rows] = await db.query(query, params);
    return rows;
  } catch (error) {
    throw error;
  }
};

export const buscarPorId = async (id) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        e.id, e.nome, e.cnpj, e.telefone, e.status,
        e.cidade_id, c.nome as cidade_nome, c.estado_id,
        est.nome as estado_nome, est.sigla as estado_sigla
      FROM empresa e
      LEFT JOIN cidade c ON e.cidade_id = c.id
      LEFT JOIN estado est ON c.estado_id = est.id
      WHERE e.id = ?
    `, [id]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

export const buscarPorCnpj = async (cnpj) => {
  try {
    const cnpjLimpo = limparParaNumeros(cnpj);
    const [rows] = await db.query('SELECT * FROM empresa WHERE cnpj = ?', [cnpjLimpo]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

export const criar = async (dados) => {
  try {
    const { nome, cnpj, telefone, cidade_id } = dados;
    
    const cnpjLimpo = limparParaNumeros(cnpj);
    const telefoneLimpo = limparParaNumeros(telefone);
    
    const [cidadeInfo] = await db.query('SELECT estado_id FROM cidade WHERE id = ?', [cidade_id]);
    
    if (cidadeInfo.length === 0) {
      throw new Error('Cidade não encontrada');
    }
    
    const estado_id = cidadeInfo[0].estado_id;
    
    const [result] = await db.query(`
      INSERT INTO empresa (nome, cnpj, telefone, cidade_id, estado_id, status)
      VALUES (?, ?, ?, ?, ?, 'Ativo')
    `, [nome, cnpjLimpo, telefoneLimpo, cidade_id, estado_id]);
    
    return { id: result.insertId, ...dados, status: 'Ativo' };
  } catch (error) {
    console.error('Erro ao criar empresa:', error);
    throw error;
  }
};

export const atualizar = async (id, dados) => {
  try {
    const { nome, cnpj, telefone, cidade_id, status } = dados;
    
    const cnpjLimpo = limparParaNumeros(cnpj);
    const telefoneLimpo = limparParaNumeros(telefone);
    
    const [result] = await db.query(`
      UPDATE empresa 
      SET nome = ?, cnpj = ?, telefone = ?, cidade_id = ?, status = ?
      WHERE id = ?
    `, [nome, cnpjLimpo, telefoneLimpo, cidade_id, status, id]);
    
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

export const inativar = async (id) => {
  try {
    const [result] = await db.query(`
      UPDATE empresa SET status = 'Inativo' WHERE id = ?
    `, [id]);
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

export const buscarComFiltros = async ({ pesquisa = '', status = 'todos', page = 1, limit = 10 }) => {
  try {
    const offset = (page - 1) * limit;
    let query = `
      SELECT 
        e.id, e.nome, e.cnpj, e.telefone, e.status,
        e.cidade_id, c.nome as cidade_nome, c.estado_id,
        est.nome as estado_nome, est.sigla as estado_sigla
      FROM empresa e
      LEFT JOIN cidade c ON e.cidade_id = c.id
      LEFT JOIN estado est ON c.estado_id = est.id
      WHERE 1=1
    `;
    const params = [];
    
    if (pesquisa) {
      query += ' AND (e.nome LIKE ? OR e.cnpj LIKE ?)';
      params.push(`%${pesquisa}%`, `%${pesquisa}%`);
    }
    
    if (status && status !== 'todos') {
      query += ' AND e.status = ?';
      params.push(status === 'ativos' ? 'Ativo' : 'Inativo');
    }

    const countQuery = query.replace(
      /SELECT[\s\S]*?FROM/,
      'SELECT COUNT(*) as total FROM'
    );
    const [countResult] = await db.query(countQuery, params);
    const total = countResult[0].total;
    
    query += ' ORDER BY e.nome LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const [rows] = await db.query(query, params);
    
    return {
      dados: rows,
      total,
      pagina: page,
      totalPaginas: Math.ceil(total / limit)
    };
  } catch (error) {
    throw error;
  }
};