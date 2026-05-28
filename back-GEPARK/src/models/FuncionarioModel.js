import db from '../config/db.js';
import { gerarHash } from '../utils/passwordHash.js';
import { limparParaNumeros } from '../utils/formatador.js';

export const buscarTodos = async (status = null) => {
  try {
    let query = `
      SELECT 
        f.id, f.nome, f.email, f.telefone, f.foto, f.status,
        f.turno_id, t.nome as turno_nome, t.inicio as turno_inicio, t.fim as turno_fim,
        f.cargo_id, c.nome as cargo_nome
      FROM funcionario f
      LEFT JOIN turno t ON f.turno_id = t.id
      LEFT JOIN cargo c ON f.cargo_id = c.id
    `;
    const params = [];
    
    if (status && status !== 'todos') {
      query += ' WHERE f.status = ?';
      params.push(status === 'ativos' ? 'Ativo' : 'Inativo');
    }
    
    query += ' ORDER BY f.nome';
    
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
        f.id, f.nome, f.email, f.telefone, f.foto, f.status,
        f.turno_id, t.nome as turno_nome,
        f.cargo_id, c.nome as cargo_nome
      FROM funcionario f
      LEFT JOIN turno t ON f.turno_id = t.id
      LEFT JOIN cargo c ON f.cargo_id = c.id
      WHERE f.id = ?
    `, [id]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

export const buscarPorEmail = async (email) => {
  try {
    const [rows] = await db.query('SELECT * FROM funcionario WHERE email = ?', [email]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

export const buscarTurnos = async () => {
  try {
    const [rows] = await db.query('SELECT id, nome, hora_inicio, hora_fim FROM turno ORDER BY id');
    return rows;
  } catch (error) {
    throw error;
  }
};

export const buscarCargos = async () => {
  try {
    const [rows] = await db.query('SELECT id, nome FROM cargo ORDER BY id');
    return rows;
  } catch (error) {
    throw error;
  }
};

export const criar = async (dados) => {
  try {
    const { nome, email, senha, telefone, turno_id, cargo_id, foto = null } = dados;
    
    const telefoneLimpo = limparParaNumeros(telefone);
    
    const senhaHash = await gerarHash(senha);
    
    const [result] = await db.query(`
      INSERT INTO funcionario 
      (nome, email, senha, telefone, turno_id, cargo_id, foto, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Ativo')
    `, [nome, email, senhaHash, telefoneLimpo, turno_id, cargo_id, foto]);
    
    return { id: result.insertId, ...dados, senha: undefined, status: 'Ativo' };
  } catch (error) {
    throw error;
  }
};

export const atualizar = async (id, dados) => {
  try {
    const { nome, email, telefone, turno_id, cargo_id, status, foto = null } = dados;
    
    const telefoneLimpo = telefone ? limparParaNumeros(telefone) : null;
    
    // Construir query dinâmica para evitar undefined
    const updates = [];
    const params = [];
    
    if (nome !== undefined && nome !== null) {
      updates.push('nome = ?');
      params.push(nome);
    }
    if (email !== undefined && email !== null) {
      updates.push('email = ?');
      params.push(email);
    }
    if (telefone !== undefined) {
      updates.push('telefone = ?');
      params.push(telefoneLimpo);
    }
    if (turno_id !== undefined && turno_id !== null) {
      updates.push('turno_id = ?');
      params.push(turno_id);
    }
    if (cargo_id !== undefined && cargo_id !== null) {
      updates.push('cargo_id = ?');
      params.push(cargo_id);
    }
    if (status !== undefined && status !== null) {
      updates.push('status = ?');
      params.push(status);
    }
    if (foto !== undefined) {
      updates.push('foto = ?');
      params.push(foto);
    }
    
    if (updates.length === 0) return false;
    
    params.push(id);
    const [result] = await db.query(`
      UPDATE funcionario 
      SET ${updates.join(', ')} 
      WHERE id = ?
    `, params);
    
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

export const inativar = async (id) => {
  try {
    const [result] = await db.query(`
      UPDATE funcionario SET status = 'Inativo' WHERE id = ?
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
        f.id, f.nome, f.email, f.telefone, f.foto, f.status,
        f.turno_id, t.nome as turno_nome,
        f.cargo_id, c.nome as cargo_nome
      FROM funcionario f
      LEFT JOIN turno t ON f.turno_id = t.id
      LEFT JOIN cargo c ON f.cargo_id = c.id
      WHERE 1=1
    `;
    const params = [];
    
    if (pesquisa) {
      query += ' AND (f.nome LIKE ? OR f.email LIKE ?)';
      params.push(`%${pesquisa}%`, `%${pesquisa}%`);
    }
    
    if (status && status !== 'todos') {
      query += ' AND f.status = ?';
      params.push(status === 'ativos' ? 'Ativo' : 'Inativo');
    }
    
    const countQuery = query.replace(
      /SELECT[\s\S]*?FROM/,
      'SELECT COUNT(*) as total FROM'
    );
    const [countResult] = await db.query(countQuery, params);
    const total = countResult[0].total;
    
    query += ' ORDER BY f.nome LIMIT ? OFFSET ?';
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

export const buscarComTurno = async (id) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        f.id, f.nome, f.email, f.foto,
        f.turno_id, t.nome as turno_nome,
        t.hora_inicio, t.hora_fim
      FROM funcionario f
      LEFT JOIN turno t ON f.turno_id = t.id
      WHERE f.id = ? AND f.status = 'Ativo'
    `, [id]);
    
    if (rows[0]) {
      const dataAtual = new Date().toLocaleDateString('pt-BR');
      return {
        ...rows[0],
        saudacao: {
          nome: rows[0].nome,
          data: dataAtual,
          inicio: rows[0].hora_inicio || '--:--',
          fim: rows[0].hora_fim || '--:--'
        }
      };
    }
    
    return rows[0];
  } catch (error) {
    throw error;
  }
};