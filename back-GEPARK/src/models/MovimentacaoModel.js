import db from '../config/db.js';
import { calcularValorEstadia, calcularTempoPermanencia } from '../services/CalculoService.js';

export const buscarTodas = async () => {
  try {
    const [rows] = await db.query(`
      SELECT 
        mov.id, mov.data_entrada, mov.data_saida, mov.valor,
        mov.motorista_id, mov.funcionario_entrada_id, mov.funcionario_saida_id,
        mov.tipo_pagamento_id,
        m.cpf as motorista_cpf, m.placa as motorista_placa,
        fe.nome as funcionario_entrada_nome,
        fs.nome as funcionario_saida_nome,
        tp.nome as tipo_pagamento_nome,
        c.nome as convenio_nome
      FROM movimentacao mov
      LEFT JOIN motorista m ON mov.motorista_id = m.id
      LEFT JOIN funcionario fe ON mov.funcionario_entrada_id = fe.id
      LEFT JOIN funcionario fs ON mov.funcionario_saida_id = fs.id
      LEFT JOIN tipo_pagamento tp ON mov.tipo_pagamento_id = tp.id
      LEFT JOIN convenio c ON m.convenio_id = c.id
      WHERE m.deleted_at IS NULL
      ORDER BY mov.data_entrada DESC
    `);
    return rows;
  } catch (error) {
    throw error;
  }
};

export const buscarPorId = async (id) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        mov.*, m.cpf as motorista_cpf, m.placa as motorista_placa,
        fe.nome as funcionario_entrada_nome,
        fs.nome as funcionario_saida_nome,
        tp.nome as tipo_pagamento_nome
      FROM movimentacao mov
      LEFT JOIN motorista m ON mov.motorista_id = m.id
      LEFT JOIN funcionario fe ON mov.funcionario_entrada_id = fe.id
      LEFT JOIN funcionario fs ON mov.funcionario_saida_id = fs.id
      LEFT JOIN tipo_pagamento tp ON mov.tipo_pagamento_id = tp.id
      WHERE mov.id = ?
    `, [id]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

export const verificarVeiculoNoPatio = async (motoristaId) => {
  try {
    const [rows] = await db.query(`
      SELECT id FROM movimentacao 
      WHERE motorista_id = ? AND data_saida IS NULL
    `, [motoristaId]);
    return rows.length > 0;
  } catch (error) {
    throw error;
  }
};

export const registrarEntrada = async (dados) => {
  try {
    const { motorista_id, funcionario_entrada_id, data_entrada } = dados;
    
    const [result] = await db.query(`
      INSERT INTO movimentacao (motorista_id, funcionario_entrada_id, data_entrada, status)
      VALUES (?, ?, ?, 'Ativo')
    `, [motorista_id, funcionario_entrada_id, data_entrada]);
    
    return { id: result.insertId, ...dados };
  } catch (error) {
    throw error;
  }
};

export const registrarSaida = async (id, dados) => {
  try {
    const { data_saida, tipo_pagamento_id, valor, funcionario_saida_id } = dados;
    
    const [result] = await db.query(`
      UPDATE movimentacao 
      SET data_saida = ?, tipo_pagamento_id = ?, valor = ?, funcionario_saida_id = ?
      WHERE id = ?
    `, [data_saida, tipo_pagamento_id, valor, funcionario_saida_id, id]);
    
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

export const buscarMovimentacoesAtivas = async () => {
  try {
    const [rows] = await db.query(`
      SELECT 
        mov.id, mov.data_entrada, mov.status,
        m.id as motorista_id, m.cpf, m.placa,
        c.nome as convenio_nome
      FROM movimentacao mov
      LEFT JOIN motorista m ON mov.motorista_id = m.id
      LEFT JOIN convenio c ON m.convenio_id = c.id
      WHERE mov.data_saida IS NULL 
        AND mov.status != 'Cancelado'
        AND m.status = 'Ativo'
      ORDER BY mov.data_entrada
    `);
    return rows;
  } catch (error) {
    throw error;
  }
};

export const buscarComFiltros = async ({ dataInicio = null, dataFim = null, page = 1, limit = 100 }) => {
  try {
    const offset = (page - 1) * limit;
    let query = `
      SELECT 
        mov.id, mov.data_entrada, mov.data_saida, mov.valor,
        m.cpf as motorista_cpf, m.placa as motorista_placa,
        fe.nome as funcionario_entrada_nome,
        fs.nome as funcionario_saida_nome,
        tp.nome as tipo_pagamento_nome,
        c.nome as convenio_nome
      FROM movimentacao mov
      LEFT JOIN motorista m ON mov.motorista_id = m.id
      LEFT JOIN funcionario fe ON mov.funcionario_entrada_id = fe.id
      LEFT JOIN funcionario fs ON mov.funcionario_saida_id = fs.id
      LEFT JOIN tipo_pagamento tp ON mov.tipo_pagamento_id = tp.id
      LEFT JOIN convenio c ON m.convenio_id = c.id
      WHERE 1=1
    `;
    const params = [];
    
    if (dataInicio) {
      query += ' AND DATE(mov.data_entrada) >= ?';
      params.push(dataInicio);
    }
    
    if (dataFim) {
      query += ' AND DATE(mov.data_entrada) <= ?';
      params.push(dataFim);
    }
    
    const countQuery = query.replace(
      /SELECT[\s\S]*?FROM/,
      'SELECT COUNT(*) as total FROM'
    );
    const [countResult] = await db.query(countQuery, params);
    const total = countResult[0].total;

    query += ' ORDER BY mov.data_entrada DESC LIMIT ? OFFSET ?';
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
 
export const buscarTiposPagamento = async () => {
  try {
    const [rows] = await db.query('SELECT id, nome FROM tipo_pagamento ORDER BY id');
    return rows;
  } catch (error) {
    throw error;
  }
};

export const buscarParaRelatorio = async ({ dataInicio, dataFim, apenasFinalizadas = true }) => {
  try {
    let query = `
      SELECT 
        mov.id, mov.data_entrada, mov.data_saida, mov.valor,
        mov.motorista_id, mov.funcionario_entrada_id, mov.funcionario_saida_id,
        mov.tipo_pagamento_id,
        m.cpf as motorista_cpf, m.placa as motorista_placa, m.convenio_id,
        fe.nome as funcionario_entrada_nome,
        fs.nome as funcionario_saida_nome,
        tp.nome as tipo_pagamento_nome,
        c.nome as convenio_nome
      FROM movimentacao mov
      LEFT JOIN motorista m ON mov.motorista_id = m.id
      LEFT JOIN funcionario fe ON mov.funcionario_entrada_id = fe.id
      LEFT JOIN funcionario fs ON mov.funcionario_saida_id = fs.id
      LEFT JOIN tipo_pagamento tp ON mov.tipo_pagamento_id = tp.id
      LEFT JOIN convenio c ON m.convenio_id = c.id
      WHERE m.deleted_at IS NULL
    `;
    
    const params = [];
    
    if (apenasFinalizadas) {
      query += ' AND mov.data_saida IS NOT NULL';
    }
    
    if (dataInicio) {
      query += ' AND DATE(mov.data_entrada) >= ?';
      params.push(dataInicio);
    }
    
    if (dataFim) {
      query += ' AND DATE(mov.data_entrada) <= ?';
      params.push(dataFim);
    }
    
    query += ' ORDER BY mov.data_entrada DESC';
    
    const [rows] = await db.query(query, params);
    return rows;
  } catch (error) {
    throw error;
  }
};

export const buscarResumoDiario = async (data) => {
  try {
    const dataFiltro = data || new Date().toISOString().split('T')[0];
    
    const [rows] = await db.query(`
      SELECT 
        COUNT(*) as total_movimentacoes,
        SUM(CASE WHEN data_saida IS NULL THEN 1 ELSE 0 END) as veiculos_no_patio,
        SUM(CASE WHEN DATE(data_entrada) = ? THEN 1 ELSE 0 END) as entradas_hoje,
        SUM(CASE WHEN DATE(data_saida) = ? THEN 1 ELSE 0 END) as saidas_hoje,
        COALESCE(SUM(valor), 0) as faturamento_dia
      FROM movimentacao mov
      WHERE DATE(data_entrada) = ? OR DATE(data_saida) = ?
    `, [dataFiltro, dataFiltro, dataFiltro, dataFiltro]);
    
    return rows[0];
  } catch (error) {
    throw error;
  }
};

export const buscarFaturamentoPorPeriodo = async (dataInicio, dataFim) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        DATE(data_saida) as data,
        COUNT(*) as total_saidas,
        COALESCE(SUM(valor), 0) as faturamento
      FROM movimentacao
      WHERE data_saida IS NOT NULL
        AND DATE(data_saida) >= ?
        AND DATE(data_saida) <= ?
      GROUP BY DATE(data_saida)
      ORDER BY data
    `, [dataInicio, dataFim]);
    
    return rows;
  } catch (error) {
    throw error;
  }
};

export const buscarUltimasMovimentacoes = async (limite = 10) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        mov.id, mov.data_entrada, mov.data_saida,
        m.cpf, m.placa,
        fe.nome as funcionario_entrada_nome,
        fs.nome as funcionario_saida_nome,
        c.nome as convenio_nome,
        tp.nome as tipo_pagamento_nome
      FROM movimentacao mov
      LEFT JOIN motorista m ON mov.motorista_id = m.id
      LEFT JOIN funcionario fe ON mov.funcionario_entrada_id = fe.id
      LEFT JOIN funcionario fs ON mov.funcionario_saida_id = fs.id
      LEFT JOIN convenio c ON m.convenio_id = c.id
      LEFT JOIN tipo_pagamento tp ON mov.tipo_pagamento_id = tp.id
      WHERE m.deleted_at IS NULL
      ORDER BY mov.data_entrada DESC
      LIMIT ?
    `, [limite]);
    
    return rows.map(row => ({
      ...row,
      situacao: row.data_saida ? 
        { tipo: 'Saída', status: 'Finalizado' } : 
        { tipo: 'Entrada', status: 'No Pátio' },
      dataExibicao: row.data_saida || row.data_entrada
    }));
  } catch (error) {
    throw error;
  }
};

export const contarVeiculosNoPatio = async () => {
  try {
    const [rows] = await db.query(`
      SELECT COUNT(*) as total
      FROM movimentacao
      WHERE data_saida IS NULL
    `);
    return rows[0].total;
  } catch (error) {
    throw error;
  }
};

export const contarEntradasHoje = async () => {
  try {
    const hoje = new Date().toISOString().split('T')[0];
    const [rows] = await db.query(`
      SELECT COUNT(*) as total
      FROM movimentacao
      WHERE DATE(data_entrada) = ?
    `, [hoje]);
    return rows[0].total;
  } catch (error) {
    throw error;
  }
};

export const contarSaidasHoje = async () => {
  try {
    const hoje = new Date().toISOString().split('T')[0];
    const [rows] = await db.query(`
      SELECT COUNT(*) as total
      FROM movimentacao
      WHERE DATE(data_saida) = ?
    `, [hoje]);
    return rows[0].total;
  } catch (error) {
    throw error;
  }
};

export const buscarIndicadoresHome = async () => {
  try {
    const hoje = new Date().toISOString().split('T')[0];
    
    const [result] = await db.query(`
      SELECT 
        COUNT(CASE WHEN data_saida IS NULL THEN 1 END) as veiculos_no_patio,
        COUNT(CASE WHEN DATE(data_entrada) = ? THEN 1 END) as entradas_hoje,
        COUNT(CASE WHEN DATE(data_saida) = ? THEN 1 END) as saidas_hoje,
        COUNT(DISTINCT motorista_id) as total_motoristas_ativos
      FROM movimentacao mov
      LEFT JOIN motorista m ON mov.motorista_id = m.id
      WHERE m.deleted_at IS NULL
    `, [hoje, hoje]);
    
    const [totalMotoristas] = await db.query(`
      SELECT COUNT(*) as total 
      FROM motorista 
      WHERE status = 'Ativo' AND deleted_at IS NULL
    `);
    
    return {
      veiculos_no_patio: result[0].veiculos_no_patio || 0,
      entradas_hoje: result[0].entradas_hoje || 0,
      saidas_hoje: result[0].saidas_hoje || 0,
      total_motoristas: totalMotoristas[0].total || 0
    };
  } catch (error) {
    throw error;
  }
};

export const cancelarMovimentacao = async (id, funcionarioId) => {
  try {
    const [result] = await db.query(`
      UPDATE movimentacao 
      SET status = 'Cancelado', 
          data_saida = NOW(),
          funcionario_saida_id = ?,
          updated_at = NOW()
      WHERE id = ? AND data_saida IS NULL
    `, [funcionarioId, id]);
    
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};