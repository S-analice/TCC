import db from '../config/db.js';
import { getDataHojeMySQL, formatarDataBR } from '../utils/dateHelper.js';

export const obterSaudacaoCompleta = async (funcionarioId) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        f.id, f.nome, f.email, f.foto, f.turno_id,
        t.nome as turno_nome,
        t.hora_inicio, t.hora_fim
      FROM funcionario f
      LEFT JOIN turno t ON f.turno_id = t.id
      WHERE f.id = ?
    `, [funcionarioId]);
    
    if (rows.length === 0) {
      return {
        nome: 'Usuário',
        data: formatarDataBR(new Date(), false),
        inicio: '--:--',
        fim: '--:--'
      };
    }
    
    const funcionario = rows[0];
    const dataAtual = formatarDataBR(new Date(), false);
    
    const inicio = funcionario.hora_inicio || '--:--';
    const fim = funcionario.hora_fim || '--:--';
    
    return {
      nome: funcionario.nome,
      data: dataAtual,
      inicio,
      fim
    };
  } catch (error) {
    console.error('Erro ao obter saudação:', error);
    return {
      nome: 'Usuário',
      data: formatarDataBR(new Date(), false),
      inicio: '--:--',
      fim: '--:--'
    };
  }
};

export const obterIndicadores = async () => {
  try {
    const hoje = getDataHojeMySQL();
    
    console.log('Buscando indicadores para a data:', hoje);
    
    const [totalMotoristas] = await db.query(`
      SELECT COUNT(*) as total FROM motorista 
      WHERE status = 'Ativo' AND deleted_at IS NULL
    `);
    
    const [veiculosNoPatio] = await db.query(`
      SELECT COUNT(*) as total FROM movimentacao 
      WHERE data_saida IS NULL
    `);
    
    const [entradasHoje] = await db.query(`
      SELECT COUNT(*) as total FROM movimentacao 
      WHERE DATE(data_entrada) = ?
    `, [hoje]);
    
    const [saidasHoje] = await db.query(`
      SELECT COUNT(*) as total FROM movimentacao 
      WHERE DATE(data_saida) = ?
    `, [hoje]);
    
    const entradas = entradasHoje[0]?.total || 0;
    const saidas = saidasHoje[0]?.total || 0;
    const totalMovimentacao = entradas + saidas;
    
    console.log('Resultados:', { entradas, saidas, hoje });
    
    let movimentacaoStatus = { texto: 'baixa', classe: 'home-mov-baixa' };
    if (totalMovimentacao > 15) {
      movimentacaoStatus = { texto: 'alta', classe: 'home-mov-alta' };
    } else if (totalMovimentacao > 5) {
      movimentacaoStatus = { texto: 'média', classe: 'home-mov-media' };
    }
    
    return {
      entradasHoje: entradas,
      saidasHoje: saidas,
      noPatio: veiculosNoPatio[0]?.total || 0,
      totalMotoristas: totalMotoristas[0]?.total || 0,
      movimentacao: movimentacaoStatus
    };
  } catch (error) {
    console.error('Erro ao obter indicadores:', error);
    return {
      entradasHoje: 0,
      saidasHoje: 0,
      noPatio: 0,
      totalMotoristas: 0,
      movimentacao: { texto: 'baixa', classe: 'home-mov-baixa' }
    };
  }
};

export const obterUltimasMovimentacoes = async (limite = 5) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        mov.id,
        m.cpf,
        m.placa,
        mov.data_entrada,
        mov.data_saida,
        fe.nome as funcionarioEntrada,
        fs.nome as funcionarioSaida,
        CASE 
          WHEN mov.data_saida IS NULL THEN 'No Pátio'
          ELSE 'Finalizado'
        END as status,
        CASE 
          WHEN mov.data_saida IS NULL THEN 'Entrada'
          ELSE 'Saída'
        END as tipo
      FROM movimentacao mov
      LEFT JOIN motorista m ON mov.motorista_id = m.id
      LEFT JOIN funcionario fe ON mov.funcionario_entrada_id = fe.id
      LEFT JOIN funcionario fs ON mov.funcionario_saida_id = fs.id
      WHERE m.deleted_at IS NULL
      ORDER BY mov.data_entrada DESC
      LIMIT ?
    `, [limite]);
    
    return rows.map(row => ({
      id: row.id,
      cpf: row.cpf,
      placa: row.placa,
      dataEntrada: row.data_entrada,
      dataSaida: row.data_saida,
      dataEntradaFormatada: formatarDataBR(row.data_entrada, true),
      dataSaidaFormatada: row.data_saida ? formatarDataBR(row.data_saida, true) : null,
      funcionarioEntrada: row.funcionarioEntrada,
      funcionarioSaida: row.funcionarioSaida,
      status: row.status,
      tipo: row.tipo
    }));
  } catch (error) {
    console.error('Erro ao obter últimas movimentações:', error);
    return [];
  }
};

export const obterDadosHome = async (funcionarioId) => {
  try {
    const [saudacao, indicadores, ultimasMovimentacoes] = await Promise.all([
      obterSaudacaoCompleta(funcionarioId),
      obterIndicadores(),
      obterUltimasMovimentacoes(5)
    ]);
    
    return {
      saudacao,
      indicadores,
      ultimasMovimentacoes
    };
  } catch (error) {
    console.error('Erro ao obter dados da home:', error);
    throw error;
  }
};