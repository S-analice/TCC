import { formatarDataBR, formatarTempoPermanencia } from "../utils/formatador.js";

export const calcularValorEstadia = (dataEntrada, dataSaida, convenio) => {
  try {
    if (!dataEntrada || !dataSaida) {
      return { valor: 0, erro: "Datas insuficientes para cálculo" };
    }

    const entrada = new Date(dataEntrada);
    const saida = new Date(dataSaida);

    if (saida <= entrada) {
      return { valor: 0, erro: "Horário de saída deve ser após a entrada" };
    }

    const diferencaMs = saida - entrada;

    const totalHoras = Math.ceil(diferencaMs / (1000 * 60 * 60));

    if (!convenio) {
      const valorHora = 48;
      return {
        valor: totalHoras * valorHora,
        erro: null,
        convenioAplicado: "Sem Convênio",
        tempoTotalHoras: totalHoras,
        tempoTotalMinutos: Math.ceil(diferencaMs / (1000 * 60)),
        dataEntradaFormatada: formatarDataBR(dataEntrada),
        dataSaidaFormatada: formatarDataBR(dataSaida),
      };
    }

    const { valor_hora, valor_diaria } = convenio;

    let valorFinal = 0;

    if (!valor_diaria || valor_diaria === 0) {
      valorFinal = totalHoras * valor_hora;
    } else {
      const diasCompletos = Math.floor(totalHoras / 24);
      const horasExcedentes = totalHoras % 24;

      const valorDiarias = diasCompletos * valor_diaria;
      const valorHorasExtras = Math.min(
        horasExcedentes * valor_hora,
        valor_diaria,
      );

      valorFinal = valorDiarias + valorHorasExtras;
    }

    return {
      valor: valorFinal,
      erro: null,
      convenioAplicado: convenio.nome,
      tempoTotalHoras: totalHoras,
      tempoTotalMinutos: Math.ceil(diferencaMs / (1000 * 60)),
      dataEntradaFormatada: formatarDataBR(dataEntrada),
      dataSaidaFormatada: formatarDataBR(dataSaida),
    };
  } catch (error) {
    return {
      valor: 0,
      erro: "Erro no processamento do cálculo",
    };
  }
};

export const calcularTempoPermanencia = (dataEntrada, dataSaida) => {
  if (!dataEntrada || !dataSaida) return 0;
  const entrada = new Date(dataEntrada);
  const saida = new Date(dataSaida);
  const diffMs = saida - entrada;
  return Math.floor(diffMs / 60000); // Retorna em minutos
};

export const calcularEstatisticasRelatorio = (movimentacoes, conveniosList) => {
  if (!movimentacoes || movimentacoes.length === 0) {
    return {
      total: 0,
      faturamentoTotal: 0,
      tempoMedio: "-",
      tempoMedioRaw: 0,
      convenioMaisUsado: "--",
      topMotoristas: [],
    };
  }

  const conveniosMap = new Map();
  conveniosList.forEach((c) => {
    conveniosMap.set(c.id, c);
  });

  let faturamentoTotal = 0;
  const convenioCount = {};
  const motoristaCount = {};

  for (const mov of movimentacoes) {
    if (mov.valor) {
      faturamentoTotal += parseFloat(mov.valor);
    } else if (mov.data_entrada && mov.data_saida && mov.convenio_id) {
      const convenio = conveniosMap.get(mov.convenio_id);
      const calculo = calcularValorEstadia(
        mov.data_entrada,
        mov.data_saida,
        convenio,
      );
      faturamentoTotal += calculo.valor;
    }

    const convenioNome =
      mov.convenio_nome ||
      (mov.convenio_id
        ? conveniosMap.get(mov.convenio_id)?.nome
        : "Sem Convênio") ||
      "Sem Convênio";
    convenioCount[convenioNome] = (convenioCount[convenioNome] || 0) + 1;

    const motoristaKey = mov.motorista_cpf || mov.cpf;
    if (motoristaKey) {
      if (!motoristaCount[motoristaKey]) {
        motoristaCount[motoristaKey] = {
          cpf: motoristaKey,
          placa: mov.motorista_placa || mov.placa,
          frequencia: 0,
        };
      }
      motoristaCount[motoristaKey].frequencia++;
    }
  }

  let convenioMaisUsado = "--";
  let maxCount = 0;
  for (const [nome, count] of Object.entries(convenioCount)) {
    if (count > maxCount) {
      maxCount = count;
      convenioMaisUsado = nome;
    }
  }

  let tempoMedio = '-';
  let tempoMedioRaw = 0;
  const movimentacoesComTempo = movimentacoes.filter(
    (m) => m.data_entrada && m.data_saida,
  );
  
  if (movimentacoesComTempo.length > 0) {
    let totalMinutos = 0;
    for (const mov of movimentacoesComTempo) {
      const minutos = calcularTempoPermanencia(
        mov.data_entrada,
        mov.data_saida,
      );
      totalMinutos += minutos;
    }
    tempoMedioRaw = totalMinutos / movimentacoesComTempo.length;
    const mediaArredondada = Math.round(tempoMedioRaw);
    tempoMedio = formatarTempoPermanencia(mediaArredondada);
  }

  const topMotoristas = Object.values(motoristaCount)
    .sort((a, b) => b.frequencia - a.frequencia)
    .slice(0, 5);

  return {
    total: movimentacoes.length,
    faturamentoTotal: parseFloat(faturamentoTotal.toFixed(2)),
    tempoMedio: tempoMedio,
    tempoMedioRaw: tempoMedioRaw,
    convenioMaisUsado,
    topMotoristas,
  };
};

export const gerarCSVMovimentacoes = (movimentacoes, conveniosList) => {
  if (!movimentacoes || movimentacoes.length === 0) {
    return "";
  }

  const conveniosMap = new Map();
  conveniosList.forEach((c) => {
    conveniosMap.set(c.id, c);
  });

  const headers = [
    "ID",
    "CPF Motorista",
    "Placa",
    "Convênio",
    "Data Entrada",
    "Data Saída",
    "Tempo Permanência",
    "Valor (R$)",
    "Funcionário Entrada",
    "Funcionário Saída",
    "Forma Pagamento",
  ];

  const rows = [headers];

  for (const mov of movimentacoes) {
    let tempoPermanencia = "-";
    let valor = 0;

    if (mov.valor) {
      valor = parseFloat(mov.valor);
    }

    if (mov.data_entrada && mov.data_saida) {
      const minutos = calcularTempoPermanencia(
        mov.data_entrada,
        mov.data_saida,
      );
      tempoPermanencia = formatarTempoPermanencia(minutos);

      if (!valor && mov.convenio_id) {
        const convenio = conveniosMap.get(mov.convenio_id);
        const calculo = calcularValorEstadia(
          mov.data_entrada,
          mov.data_saida,
          convenio,
        );
        valor = calculo.valor;
      }
    }

    const row = [
      mov.id || '',
      mov.motorista_cpf || mov.cpf || '',
      mov.motorista_placa || mov.placa || '',
      mov.convenio_nome || (mov.convenio_id ? conveniosMap.get(mov.convenio_id)?.nome : 'Sem Convênio') || 'Sem Convênio',
      mov.data_entrada ? new Date(mov.data_entrada).toLocaleString('pt-BR') : '',
      mov.data_saida ? new Date(mov.data_saida).toLocaleString('pt-BR') : '',
      tempoPermanencia,
      (parseFloat(valor) || 0).toFixed(2).replace('.', ','),
      mov.funcionario_entrada_nome || '',
      mov.funcionario_saida_nome || '',
      mov.tipo_pagamento_nome || ''
    ];
    
    rows.push(row);
  }

  return rows
    .map((row) =>
      row
        .map((cell) => {
          if (
            typeof cell === "string" &&
            (cell.includes(",") || cell.includes('"'))
          ) {
            return `"${cell.replace(/"/g, '""')}"`;
          }
          return cell;
        })
        .join(","),
    )
    .join("\n");
};