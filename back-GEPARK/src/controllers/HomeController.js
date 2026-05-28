import { obterDadosHome, obterIndicadores, obterUltimasMovimentacoes, obterSaudacaoCompleta } from '../services/HomeService.js';

export const getHomeData = async (req, res) => {
  try {
    const funcionarioId = req.usuarioId;
    
    const dadosHome = await obterDadosHome(funcionarioId);
    
    res.json(dadosHome);
  } catch (error) {
    console.error('Erro ao buscar dados da home:', error);
    res.status(500).json({ 
      message: 'Erro ao carregar dados da home',
      error: error.message 
    });
  }
};

export const getIndicadores = async (req, res) => {
  try {
    const indicadores = await obterIndicadores();
    res.json(indicadores);
  } catch (error) {
    console.error('Erro ao buscar indicadores:', error);
    res.status(500).json({ 
      message: 'Erro ao buscar indicadores',
      error: error.message 
    });
  }
};

export const getUltimasMovimentacoes = async (req, res) => {
  try {
    const { limite = 10 } = req.query;
    const movimentacoes = await obterUltimasMovimentacoes(parseInt(limite));
    res.json(movimentacoes);
  } catch (error) {
    console.error('Erro ao buscar últimas movimentações:', error);
    res.status(500).json({ 
      message: 'Erro ao buscar últimas movimentações',
      error: error.message 
    });
  }
};

export const getSaudacao = async (req, res) => {
  try {
    const funcionarioId = req.usuarioId;
    const saudacao = await obterSaudacaoCompleta(funcionarioId);
    res.json(saudacao);
  } catch (error) {
    console.error('Erro ao buscar saudação:', error);
    res.status(500).json({ 
      message: 'Erro ao buscar saudação',
      error: error.message 
    });
  }
};