import { MotoristaModel } from "./MotoristaModel";

export const MovimentacaoModel = {
  registrosIniciais: [
    {
      id: 1,
      cpf: "12345678900",
      placa: "ABC1234",
      dataEntrada: "2026-05-20T08:30:00",
      dataSaida: null,
      funcionarioEntrada: "João Silva",
      funcionarioSaida: null,
    },
    {
      id: 2,
      cpf: "98765432100",
      placa: "DEF5678",
      dataEntrada: "2026-05-20T09:15:00",
      dataSaida: null,
      funcionarioEntrada: "Maria Santos",
      funcionarioSaida: null,
    },
    {
      id: 3,
      cpf: "45678912300",
      placa: "GHI9012",
      dataEntrada: "2026-05-18T07:40:00",
      dataSaida: "2026-05-20T07:40:00",
      funcionarioEntrada: "Lilo",
      funcionarioSaida: "Analice Santos",
    },
  ],

  getSituacao: (registro) => {
    if (registro.dataEntrada && !registro.dataSaida) {
      return { tipo: "Entrada", status: "No Pátio" };
    }
    if (registro.dataEntrada && registro.dataSaida) {
      return { tipo: "Saída", status: "Finalizado" };
    }
    return { tipo: "Desconhecido", status: "Indefinido" };
  },

  filtrarMovimentacoesHoje: (registros) => {
    const agora = new Date();
    const hojeISO =
      agora.getFullYear() +
      "-" +
      String(agora.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(agora.getDate()).padStart(2, "0");

    return registros.filter(
      (r) =>
        (r.dataEntrada && r.dataEntrada.includes(hojeISO)) ||
        (r.dataSaida && r.dataSaida.includes(hojeISO)),
    );
  },

  calcularValor: (dataEntrada, dataSaida, cpfMotorista) => {
    try {
      if (!dataEntrada || !dataSaida || !cpfMotorista) {
        return { valor: 0, erro: "Dados insuficientes para cálculo" };
      }

      const listaMotoristas = MotoristaModel.getInitialData();
      const motorista = listaMotoristas.find((m) => m.cpf === cpfMotorista);

      const convenioNome = motorista
        ? motorista.convenio || motorista.convenio_nome
        : "Sem Convênio";

      const entrada = new Date(dataEntrada);
      const saida = new Date(dataSaida);

      if (saida <= entrada) {
        return { valor: 0, erro: "Horário de saída deve ser após a entrada." };
      }

      const diferencaMs = saida - entrada;
      const totalHoras = Math.ceil(diferencaMs / (1000 * 60 * 60));

      const tabelasPreco = {
        "Novo Cliente": { valor_hora: 10, valor_diaria: 100 },
        Premium: { valor_hora: 6, valor_diaria: 60 },
        "Sem Convênio": { valor_hora: 48, valor_diaria: null },
      };

      const chave =
        Object.keys(tabelasPreco).find(
          (k) => k.toLowerCase() === convenioNome.toLowerCase(),
        ) || "Sem Convênio";

      const regra = tabelasPreco[chave];
      let valorFinal = 0;

      if (chave === "Sem Convênio" || !regra.valor_diaria) {
        valorFinal = totalHoras * regra.valor_hora;
      } else {
        const diasCompletos = Math.floor(totalHoras / 24);
        const horasExcedentes = totalHoras % 24;

        const valorDiarias = diasCompletos * regra.valor_diaria;

        const valorHorasExtras = Math.min(
          horasExcedentes * regra.valor_hora,
          regra.valor_diaria,
        );

        valorFinal = valorDiarias + valorHorasExtras;
      }

      return {
        valor: valorFinal,
        erro: null,
        convenioAplicado: chave,
        tempoTotalHoras: totalHoras,
      };
    } catch {
      return { valor: 0, erro: "Erro no processamento do cálculo." };
    }
  },

  filtrarPorPeriodo: (registros, dataInicio, dataFim) => {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    fim.setHours(23, 59, 59);

    return registros.filter((item) => {
      const dataEntrada = new Date(item.dataEntrada);
      return dataEntrada >= inicio && dataEntrada <= fim;
    });
  },

  calcularTempoPermanencia: (entrada, saida) => {
    if (!saida) return 0;
    return (new Date(saida) - new Date(entrada)) / 60000; // Retorna em minutos
  },
};
