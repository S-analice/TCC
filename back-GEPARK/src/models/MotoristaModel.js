import db from '../config/db.js';
import { limparParaNumeros, limparPlaca, formatarCNPJ } from '../utils/formatador.js';


const calcularDataVencimento = () => {
  const data = new Date();
  data.setDate(data.getDate() + 90);
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  const horas = String(data.getHours()).padStart(2, '0');
  const minutos = String(data.getMinutes()).padStart(2, '0');
  const segundos = String(data.getSeconds()).padStart(2, '0');
  return `${ano}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
};

export const buscarTodos = async (status = null) => {
  try {
    let query = `
      SELECT 
        m.id, m.cpf, m.placa, m.telefone, m.status,
        m.empresa_id, m.convenio_id, m.data_vencimento_convenio,
        e.nome as empresa_nome, e.cnpj as empresa_cnpj,
        c.nome as convenio_nome, c.valor_hora as convenio_valor_hora, 
        c.valor_diaria as convenio_valor_diaria,
        cd.nome as cidade_nome, est.sigla as estado_sigla
      FROM motorista m
      LEFT JOIN empresa e ON m.empresa_id = e.id
      LEFT JOIN convenio c ON m.convenio_id = c.id
      LEFT JOIN cidade cd ON e.cidade_id = cd.id
      LEFT JOIN estado est ON cd.estado_id = est.id
      WHERE m.deleted_at IS NULL
    `;
    const params = [];
    
    if (status && status !== 'todos') {
      query += ' AND m.status = ?';
      params.push(status === 'ativos' ? 'Ativo' : 'Inativo');
    }
    
    query += ' ORDER BY m.id';
    
    const [rows] = await db.query(query, params);
    
    return rows.map(row => ({
      ...row,
      empresa_formatada: row.empresa_nome ? 
        `${row.empresa_nome} - ${row.cidade_nome}/${row.estado_sigla} (CNPJ: ${formatarCNPJ(row.empresa_cnpj)})` : 
        'Autônomo'
    }));
  } catch (error) {
    throw error;
  }
};

export const buscarPorId = async (id) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        m.id, m.cpf, m.placa, m.telefone, m.status,
        m.empresa_id, m.convenio_id, m.data_vencimento_convenio,
        e.nome as empresa_nome, e.cnpj as empresa_cnpj,
        c.nome as convenio_nome, c.valor_hora, c.valor_diaria,
        cd.nome as cidade_nome, est.sigla as estado_sigla
      FROM motorista m
      LEFT JOIN empresa e ON m.empresa_id = e.id
      LEFT JOIN convenio c ON m.convenio_id = c.id
      LEFT JOIN cidade cd ON e.cidade_id = cd.id
      LEFT JOIN estado est ON cd.estado_id = est.id
      WHERE m.id = ? AND m.deleted_at IS NULL
    `, [id]);
    
    if (rows[0]) {
      rows[0].empresa_formatada = rows[0].empresa_nome ? 
        `${rows[0].empresa_nome} - ${rows[0].cidade_nome}/${rows[0].estado_sigla} (CNPJ: ${formatarCNPJ(rows[0].empresa_cnpj)})` : 
        'Autônomo';
    }
    
    return rows[0];
  } catch (error) {
    throw error;
  }
};

export const buscarPorCpf = async (cpf) => {
  try {
    const cpfLimpo = limparParaNumeros(cpf);
    const [rows] = await db.query(`
      SELECT m.*, e.nome as empresa_nome, c.nome as convenio_nome
      FROM motorista m
      LEFT JOIN empresa e ON m.empresa_id = e.id
      LEFT JOIN convenio c ON m.convenio_id = c.id
      WHERE m.cpf = ? AND m.deleted_at IS NULL
    `, [cpfLimpo]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

export const buscarPorPlaca = async (placa) => {
  try {
    const placaLimpa = limparPlaca(placa);
    const [rows] = await db.query(`
      SELECT m.*, e.nome as empresa_nome, c.nome as convenio_nome
      FROM motorista m
      LEFT JOIN empresa e ON m.empresa_id = e.id
      LEFT JOIN convenio c ON m.convenio_id = c.id
      WHERE m.placa = ? AND m.deleted_at IS NULL
    `, [placaLimpa]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

export const criar = async (dados) => {
  try {
    const { cpf, placa, telefone, empresa_id, convenio_id, data_vencimento_convenio } = dados;
    
    const cpfLimpo = limparParaNumeros(cpf);
    const placaLimpa = limparPlaca(placa);
    const telefoneLimpo = limparParaNumeros(telefone);
    
    const [result] = await db.query(`
      INSERT INTO motorista (cpf, placa, telefone, empresa_id, convenio_id, status, data_vencimento_convenio)
      VALUES (?, ?, ?, ?, ?, 'Ativo', ?)
    `, [cpfLimpo, placaLimpa, telefoneLimpo, empresa_id || null, convenio_id || null, data_vencimento_convenio || null]);
    
    return { id: result.insertId, ...dados, status: 'Ativo' };
  } catch (error) {
    throw error;
  }
};

export const atualizar = async (id, dados) => {
  try {
    const { cpf, placa, telefone, empresa_id, convenio_id, status, data_vencimento_convenio } = dados;
    
    const updates = [];
    const params = [];
    
    if (cpf !== undefined) {
      updates.push('cpf = ?');
      params.push(limparParaNumeros(cpf));
    }
    if (placa !== undefined) {
      updates.push('placa = ?');
      params.push(limparPlaca(placa));
    }
    if (telefone !== undefined) {
      updates.push('telefone = ?');
      params.push(limparParaNumeros(telefone));
    }
    if (empresa_id !== undefined) {
      updates.push('empresa_id = ?');
      params.push(empresa_id || null);
    }
    if (convenio_id !== undefined) {
      updates.push('convenio_id = ?');
      params.push(convenio_id || null);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }
    if (data_vencimento_convenio !== undefined) {
      updates.push('data_vencimento_convenio = ?');
      params.push(data_vencimento_convenio || null);
    }
    
    if (updates.length === 0) return false;
    
    params.push(id);
    const [result] = await db.query(`
      UPDATE motorista SET ${updates.join(', ')} WHERE id = ?
    `, params);
    
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

export const inativar = async (id) => {
  try {
    const [result] = await db.query(`
      UPDATE motorista 
      SET status = 'Inativo', deleted_at = NOW() 
      WHERE id = ?
    `, [id]);
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

export const buscarComFiltros = async ({ pesquisa = '', status = 'todos', page = 1, limit = 100 }) => {
  try {
    const offset = (page - 1) * limit;
    let query = `
      SELECT 
        m.id, m.cpf, m.placa, m.telefone, m.status,
        m.empresa_id, m.convenio_id, m.data_vencimento_convenio,
        e.nome as empresa_nome, e.cnpj as empresa_cnpj,
        c.nome as convenio_nome,
        cd.nome as cidade_nome, est.sigla as estado_sigla
      FROM motorista m
      LEFT JOIN empresa e ON m.empresa_id = e.id
      LEFT JOIN convenio c ON m.convenio_id = c.id
      LEFT JOIN cidade cd ON e.cidade_id = cd.id
      LEFT JOIN estado est ON cd.estado_id = est.id
      WHERE m.deleted_at IS NULL
    `;
    const params = [];
    
    if (pesquisa) {
      query += ' AND (m.cpf LIKE ? OR m.placa LIKE ?)';
      params.push(`%${pesquisa}%`, `%${pesquisa}%`);
    }
    
    if (status && status !== 'todos') {
      query += ' AND m.status = ?';
      params.push(status === 'ativos' ? 'Ativo' : 'Inativo');
    }
    
    const countQuery = query.replace(
      /SELECT[\s\S]*?FROM/,
      'SELECT COUNT(*) as total FROM'
    );
    const [countResult] = await db.query(countQuery, params);
    const total = countResult[0].total;
    
    query += ' ORDER BY m.id LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const [rows] = await db.query(query, params);
    
    const dadosFormatados = rows.map(row => ({
      ...row,
      empresa_formatada: row.empresa_nome ? 
        `${row.empresa_nome} - ${row.cidade_nome}/${row.estado_sigla} (CNPJ: ${formatarCNPJ(row.empresa_cnpj)})` : 
        'Autônomo'
    }));
    
    return {
      dados: dadosFormatados,
      total,
      pagina: page,
      totalPaginas: Math.ceil(total / limit)
    };
  } catch (error) {
    throw error;
  }
};

export const buscarConvenios = async () => {
  try {
    const [rows] = await db.query('SELECT id, nome, valor_hora, valor_diaria FROM convenio ORDER BY id');
    return rows;
  } catch (error) {
    throw error;
  }
};

export const bloquear = async (id, dataFimBloqueio) => {
  try {
    const [result] = await db.query(`
      UPDATE motorista 
      SET status = 'Bloqueado', data_fim_bloqueio = ?, updated_at = NOW()
      WHERE id = ? AND deleted_at IS NULL
    `, [dataFimBloqueio, id]);
    
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

export const atualizarBloqueiosExpirados = async () => {
  try {
    const [result] = await db.query(`
      UPDATE motorista 
      SET status = 'Ativo', data_fim_bloqueio = NULL, updated_at = NOW()
      WHERE status = 'Bloqueado' 
        AND data_fim_bloqueio IS NOT NULL 
        AND data_fim_bloqueio <= NOW()
        AND deleted_at IS NULL
    `);
    
    return result.affectedRows;
  } catch (error) {
    throw error;
  }
};

export const buscarBloqueados = async () => {
  try {
    const [rows] = await db.query(`
      SELECT 
        m.id, m.cpf, m.placa, m.telefone, m.status, m.data_fim_bloqueio,
        e.nome as empresa_nome,
        c.nome as convenio_nome
      FROM motorista m
      LEFT JOIN empresa e ON m.empresa_id = e.id
      LEFT JOIN convenio c ON m.convenio_id = c.id
      WHERE m.status = 'Bloqueado' AND m.deleted_at IS NULL
      ORDER BY m.data_fim_bloqueio ASC
    `);
    
    return rows;
  } catch (error) {
    throw error;
  }
};
