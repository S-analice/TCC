import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import handlebars from 'handlebars';
import htmlPdf from 'html-pdf-node';
import { 
  formatarCPF, 
  formatarPlaca, 
  formatarDataBR, 
  formatarTempoPermanencia 
} from '../utils/formatador.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATES_DIR = path.join(__dirname, '../templates');
const RELATORIOS_DIR = path.join(__dirname, '../../uploads/relatorios');
const LOGO_PATH = path.join(__dirname, '../../uploads/logo.png');

if (!fs.existsSync(RELATORIOS_DIR)) {
  fs.mkdirSync(RELATORIOS_DIR, { recursive: true });
}

handlebars.registerHelper('add', function(index, value) {
  return index + value;
});

handlebars.registerHelper('formatarDinheiro', function(valor) {
  return `R$ ${(parseFloat(valor) || 0).toFixed(2).replace('.', ',')}`;
});

handlebars.registerHelper('formatarPlaca', function(placa) {
  return formatarPlaca(placa);
});

handlebars.registerHelper('formatarCPF', function(cpf) {
  return formatarCPF(cpf);
});

const getLogoBase64 = () => {
  try {
    if (fs.existsSync(LOGO_PATH)) {
      const logoBuffer = fs.readFileSync(LOGO_PATH);
      const base64 = logoBuffer.toString('base64');
      return `data:image/png;base64,${base64}`;
    }
  } catch (error) {
    console.error('Erro ao carregar logo:', error);
  }
  return null;
};

const compilarTemplate = async (templateName, dados) => {
  const templatePath = path.join(TEMPLATES_DIR, templateName);
  let htmlContent = fs.readFileSync(templatePath, 'utf-8');
  
  const logoBase64 = getLogoBase64();
  if (logoBase64) {
    dados.logoBase64 = logoBase64;
  }
  
  const template = handlebars.compile(htmlContent);
  return template(dados);
};

const gerarPDF = async (html, nomeArquivo) => {
  const pdfPath = path.join(RELATORIOS_DIR, nomeArquivo);
  
  const options = {
    format: 'A4',
    printBackground: true,
    margin: {
      top: '0cm',
      bottom: '0cm',
      left: '0cm',
      right: '0cm'
    }
  };
  
  const file = { content: html };
  
  return new Promise((resolve, reject) => {
    htmlPdf.generatePdf(file, options, (err, buffer) => {
      if (err) {
        console.error('Erro ao gerar PDF:', err);
        reject(err);
      } else {
        fs.writeFileSync(pdfPath, buffer);
        resolve(pdfPath);
      }
    });
  });
};

const calcularTempoPermanencia = (entrada, saida) => {
  if (!entrada) return '---';
  
  const entradaDate = new Date(entrada);
  const saidaDate = saida ? new Date(saida) : new Date();
  
  if (isNaN(entradaDate.getTime()) || isNaN(saidaDate.getTime())) {
    return '---';
  }
  
  let diffMs = saidaDate - entradaDate;
  
  if (diffMs < 0) return '---';
  
  const horas = Math.floor(diffMs / (1000 * 60 * 60));
  const minutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (horas > 0 && minutos > 0) {
    return `${horas}h ${minutos}m`;
  } else if (horas > 0) {
    return `${horas}h`;
  } else if (minutos > 0) {
    return `${minutos}m`;
  }
  return '< 1m';
};

const formatarTempoMinutos = (minutos) => {
  if (!minutos && minutos !== 0) return '0h';
  
  const horas = Math.floor(minutos / 60);
  const minutosRestantes = Math.round(minutos % 60);
  
  if (horas > 0 && minutosRestantes > 0) {
    return `${horas}h ${minutosRestantes}m`;
  } else if (horas > 0) {
    return `${horas}h`;
  } else if (minutosRestantes > 0) {
    return `${minutosRestantes}m`;
  }
  return '< 1m';
};

const getClasseConvenio = (nome) => {
  if (!nome) return 'badge-sem';
  const lowerNome = nome.toLowerCase();
  if (lowerNome === 'premium') return 'badge-premium';
  if (lowerNome === 'novo cliente') return 'badge-novo';
  return 'badge-sem';
};

const contarPaginas = (movimentacoes) => {
  const linhasPorPagina = 15;
  const totalLinhas = movimentacoes.length;
  return Math.ceil(totalLinhas / linhasPorPagina) + 1;
};

// ============================================
// RELATÓRIO DE MOVIMENTAÇÕES FINALIZADAS
// ============================================
export const gerarRelatorioMovimentacoesPDF = async (dados) => {
  const { movimentacoes, estatisticas, dataInicio, dataFim, usuarioNome } = dados;
  
  const movimentacoesFormatadas = (movimentacoes || []).map(mov => ({
    dataEntradaFormatada: formatarDataBR(mov.data_entrada, true),
    dataSaidaFormatada: mov.data_saida ? formatarDataBR(mov.data_saida, true) : '---',
    tempoPermanencia: calcularTempoPermanencia(mov.data_entrada, mov.data_saida),
    cpf: mov.motorista_cpf || mov.cpf ? formatarCPF(mov.motorista_cpf || mov.cpf) : '---',
    placa: mov.motorista_placa || mov.placa || '---',
    convenioNome: mov.convenio_nome || 'Sem Convênio',
    classeConvenio: getClasseConvenio(mov.convenio_nome),
    valorFormatado: (parseFloat(mov.valor) || 0).toFixed(2).replace('.', ',')
  }));
  
  const topMotoristasFormatados = (estatisticas.topMotoristas || []).map(m => ({
    cpf: m.cpf ? formatarCPF(m.cpf) : '---',
    placa: m.placa || '---',
    frequencia: m.frequencia
  }));
  
  const estatisticasFormatadas = {
    total: estatisticas.total || 0,
    tempoMedio: estatisticas.tempoMedio || '0h 0m',
    convenioMaisUsado: estatisticas.convenioMaisUsado || '--',
    faturamentoTotal: (parseFloat(estatisticas.faturamentoTotal) || 0).toFixed(2).replace('.', ','),
    topMotoristas: topMotoristasFormatados
  };
  
  const dataGeracao = formatarDataBR(new Date(), true);
  const dataInicioFormatada = formatarDataBR(dataInicio, false);
  const dataFimFormatada = formatarDataBR(dataFim, false);
  
  const itemsPorPagina = 15;
  const paginasDetalhamento = [];
  
  for (let i = 0; i < movimentacoesFormatadas.length; i += itemsPorPagina) {
    paginasDetalhamento.push({
      movimentacoes: movimentacoesFormatadas.slice(i, i + itemsPorPagina),
      pagina: Math.floor(i / itemsPorPagina) + 2, // +2 porque página 1 é ranking
      totalPaginas: Math.ceil(movimentacoesFormatadas.length / itemsPorPagina) + 1
    });
  }
  
  const totalPaginas = Math.ceil(movimentacoesFormatadas.length / itemsPorPagina) + 1;
  
  const html = await compilarTemplate('relatorioTemplate.html', {
    dataGeracao,
    usuarioNome: usuarioNome || 'Sistema',
    dataInicio: dataInicioFormatada,
    dataFim: dataFimFormatada,
    estatisticas: estatisticasFormatadas,
    topMotoristas: topMotoristasFormatados,
    paginasDetalhamento,
    totalPaginas,
    hasMovimentacoes: movimentacoesFormatadas.length > 0
  });
  
  const nomeArquivo = `relatorio_movimentacoes_${dataInicio}_a_${dataFim}_${Date.now()}.pdf`;
  const caminhoPDF = await gerarPDF(html, nomeArquivo);
  
  return {
    nome: nomeArquivo,
    caminho: caminhoPDF,
    url: `/uploads/relatorios/${nomeArquivo}`
  };
};

// ============================================
// RELATÓRIO DE MOVIMENTAÇÕES ATIVAS (PÁTIO)
// ============================================
export const gerarRelatorioMovimentacoesAtivasPDF = async (dados) => {
  const { movimentacoes, usuarioNome } = dados;
  
  const movimentacoesFormatadas = (movimentacoes || []).map(mov => ({
    dataEntradaFormatada: formatarDataBR(mov.data_entrada, true),
    tempoEstacionado: calcularTempoPermanencia(mov.data_entrada, null),
    cpf: mov.cpf ? formatarCPF(mov.cpf) : '---',
    placa: mov.placa || '---',
    convenioNome: mov.convenio_nome || 'Sem Convênio'
  }));
  
  const dataGeracao = formatarDataBR(new Date(), true);

  const itemsPorPagina = 20;
  const totalPaginas = Math.max(1, Math.ceil(movimentacoesFormatadas.length / itemsPorPagina));
  
  const paginas = [];
  for (let i = 0; i < movimentacoesFormatadas.length; i += itemsPorPagina) {
    paginas.push({
      movimentacoes: movimentacoesFormatadas.slice(i, i + itemsPorPagina),
      pagina: Math.floor(i / itemsPorPagina) + 1,
      totalPaginas: totalPaginas
    });
  }
  
  if (paginas.length === 0) {
    paginas.push({
      movimentacoes: [],
      pagina: 1,
      totalPaginas: 1
    });
  }
  
  const html = await compilarTemplate('movimentacoesAtivasTemplate.html', {
    dataGeracao,
    usuarioNome: usuarioNome || 'Sistema',
    totalVeiculos: movimentacoesFormatadas.length,
    paginas: paginas,
    hasMovimentacoes: movimentacoesFormatadas.length > 0,
    totalPaginas: totalPaginas
  });
  
  const nomeArquivo = `relatorio_veiculos_patio_${Date.now()}.pdf`;
  const caminhoPDF = await gerarPDF(html, nomeArquivo);
  
  return {
    nome: nomeArquivo,
    caminho: caminhoPDF,
    url: `/uploads/relatorios/${nomeArquivo}`
  };
};