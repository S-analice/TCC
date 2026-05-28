import * as MovimentacaoModel from '../models/MovimentacaoModel.js';
import * as MotoristaModel from '../models/MotoristaModel.js';
import * as FuncionarioModel from '../models/FuncionarioModel.js'; 
import { 
  calcularEstatisticasRelatorio, 
  gerarCSVMovimentacoes 
} from '../services/CalculoService.js';
import { gerarRelatorioMovimentacoesPDF, gerarRelatorioMovimentacoesAtivasPDF } from '../services/PdfService.js';

export const gerarRelatorioPDF = async (req, res) => {
  try {
    const { dataInicio, dataFim } = req.query;
    const funcionarioId = req.usuarioId;
    
    const funcionario = await FuncionarioModel.buscarPorId(funcionarioId);
    const usuarioNome = funcionario?.nome || 'Sistema';
    
    if (!dataInicio || !dataFim) {
      return res.status(400).json({ message: 'Datas de início e fim são obrigatórias' });
    }
    
    const movimentacoes = await MovimentacaoModel.buscarParaRelatorio({
      dataInicio,
      dataFim,
      apenasFinalizadas: true
    });
    
    const movimentacoesComValorNumerico = movimentacoes.map(mov => ({
      ...mov,
      valor: parseFloat(mov.valor) || 0
    }));
    
    const convenios = await MotoristaModel.buscarConvenios();
    
    const estatisticas = calcularEstatisticasRelatorio(movimentacoesComValorNumerico, convenios);
    
    const pdf = await gerarRelatorioMovimentacoesPDF({
      movimentacoes: movimentacoesComValorNumerico,  
      estatisticas,
      dataInicio,
      dataFim,
      usuarioNome
    });
    
    res.download(pdf.caminho, pdf.nome);
    
  } catch (error) {
    console.error('Erro ao gerar relatório PDF:', error);
    res.status(500).json({ message: 'Erro ao gerar relatório PDF', error: error.message });
  }
};

export const gerarRelatorioAtivasPDF = async (req, res) => {
  try {
    const usuarioNome = req.usuarioNome || 'Admin Sistema';
    
    const movimentacoes = await MovimentacaoModel.buscarMovimentacoesAtivas();
    
    const movimentacoesCompletas = [];
    for (const mov of movimentacoes) {
      const motorista = await MotoristaModel.buscarPorId(mov.motorista_id);
      movimentacoesCompletas.push({
        ...mov,
        motorista_nome: motorista?.nome || 'Motorista',
        convenio_nome: mov.convenio_nome
      });
    }
    
    const pdf = await gerarRelatorioMovimentacoesAtivasPDF({
      movimentacoes: movimentacoesCompletas,
      usuarioNome
    });
    
    res.download(pdf.caminho, pdf.nome);
    
  } catch (error) {
    console.error('Erro ao gerar relatório de veículos no pátio:', error);
    res.status(500).json({ message: 'Erro ao gerar relatório de veículos no pátio' });
  }
};

export const exportarCSV = async (req, res) => {
  try {
    const { dataInicio, dataFim } = req.query;
    
    if (!dataInicio || !dataFim) {
      return res.status(400).json({ 
        message: 'Datas de início e fim são obrigatórias' 
      });
    }
    
    // Buscar movimentações FINALIZADAS no período
    const movimentacoes = await MovimentacaoModel.buscarParaRelatorio({
      dataInicio,
      dataFim,
      apenasFinalizadas: true  // 🔥 Adicionado filtro
    });
    
    const convenios = await MotoristaModel.buscarConvenios();
    
    const csv = gerarCSVMovimentacoes(movimentacoes, convenios);
    
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=relatorio_movimentacoes_${dataInicio}_a_${dataFim}.csv`);
    
    const BOM = '\uFEFF';
    
    res.send(BOM + csv);
  } catch (error) {
    console.error('Erro ao exportar relatório:', error);
    res.status(500).json({ 
      message: 'Erro ao exportar relatório',
      error: error.message 
    });
  }
};

export const getMovimentacoesAtivas = async (req, res) => {
  try {
    const movimentacoes = await MovimentacaoModel.buscarMovimentacoesAtivas();
    res.json(movimentacoes);
  } catch (error) {
    console.error('Erro ao buscar movimentações ativas:', error);
    res.status(500).json({ 
      message: 'Erro ao buscar movimentações ativas',
      error: error.message 
    });
  }
};

export const getResumoDashboard = async (req, res) => {
  try {
    const { data } = req.query;
    const dataFiltro = data || new Date().toISOString().split('T')[0];
    
    const resumo = await MovimentacaoModel.buscarResumoDiario(dataFiltro);
    
    const ultimasMovimentacoes = await MovimentacaoModel.buscarParaRelatorio({
      dataFim: dataFiltro,
      apenasFinalizadas: true
    });
    
    res.json({
      resumo: {
        ...resumo,
        data: dataFiltro
      },
      ultimasMovimentacoes: ultimasMovimentacoes.slice(0, 10)
    });
  } catch (error) {
    console.error('Erro ao buscar resumo:', error);
    res.status(500).json({ 
      message: 'Erro ao buscar resumo do dashboard',
      error: error.message 
    });
  }
};

export const getFaturamentoPorPeriodo = async (req, res) => {
  try {
    const { dataInicio, dataFim } = req.query;
    
    if (!dataInicio || !dataFim) {
      return res.status(400).json({ 
        message: 'Datas de início e fim são obrigatórias' 
      });
    }
    
    const faturamento = await MovimentacaoModel.buscarFaturamentoPorPeriodo(dataInicio, dataFim);
    
    res.json({
      periodo: {
        dataInicio,
        dataFim
      },
      dados: faturamento,
      totalFaturamento: faturamento.reduce((sum, item) => sum + parseFloat(item.faturamento), 0),
      totalSaidas: faturamento.reduce((sum, item) => sum + item.total_saidas, 0)
    });
  } catch (error) {
    console.error('Erro ao buscar faturamento por período:', error);
    res.status(500).json({ 
      message: 'Erro ao buscar faturamento',
      error: error.message 
    });
  }
};