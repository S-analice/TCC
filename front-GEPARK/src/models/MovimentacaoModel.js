export const MovimentacaoModel = {
  registrosIniciais: [
    {
      id: 1,
      cpf: "12345678900",
      placa: "ABC1234",
      dataEntrada: "2026-02-23T08:30:00",
      dataSaida: null,
      funcionarioEntrada: "João Silva",
      funcionarioSaida: null,
      tipo: "Entrada",
      status: "No Pátio"
    },
    {
      id: 2,
      cpf: "98765432100",
      placa: "DEF5678",
      dataEntrada: "2026-02-23T09:15:00",
      dataSaida: null,
      funcionarioEntrada: "Maria Santos",
      funcionarioSaida: null,
      tipo: "Entrada",
      status: "No Pátio"
    },
    {
      id: 3,
      cpf: "45678912300",
      placa: "GHI9012",
      dataEntrada: "2026-02-23T07:40:00",
      dataSaida: "2026-02-23T11:10:00",
      funcionarioEntrada: "Lilo",
      funcionarioSaida: "Analice Santos",
      tipo: "Saída",
      status: "Finalizado"
    }
  ],

  calcularValor: (dataEntrada, dataSaida, convenio) => {
    try {
      if (!dataEntrada || !dataSaida) return { valor: 0, erro: "Datas incompletas" };

      const entrada = new Date(dataEntrada);
      const saida = new Date(dataSaida);

      if (saida <= entrada) {
        return { valor: 0, erro: "Horário de saída deve ser após a entrada!" };
      }

      const diferencaHoras = Math.ceil((saida - entrada) / (1000 * 60 * 60));

      const temConvenio = convenio && convenio !== "Sem Convênio";
      const valorHora = temConvenio ? 6 : 10;
      const valorDiaria = temConvenio ? 60 : 100;

      // Se passar de 24h, cobra diária, senão cobra por hora
      const valorFinal = diferencaHoras >= 24 ? valorDiaria : diferencaHoras * valorHora;

      return { valor: valorFinal, erro: null };
    } catch (error) {
      console.error("Erro ao calcular valor:", error);
      return { valor: 0, erro: "Erro interno no cálculo." };
    }
  },

  filtrarMovimentacoesHoje: (registros) => {
    const hojeISO = new Date().toISOString().split("T")[0];
    return registros.filter(r => 
      (r.dataEntrada && r.dataEntrada.startsWith(hojeISO)) || 
      (r.dataSaida && r.dataSaida.startsWith(hojeISO))
    );
  },

  filtrarPorPeriodo: (registros, dataInicio, dataFim) => {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    fim.setHours(23, 59, 59); // Garante que pegue o dia inteiro do fim

    return registros.filter((item) => {
      const dataEntrada = new Date(item.dataEntrada);
      return dataEntrada >= inicio && dataEntrada <= fim;
    });
  },

  calcularTempoPermanencia: (entrada, saida) => {
    if (!saida) return 0;
    return (new Date(saida) - new Date(entrada)) / 60000; // Retorna em minutos
  }
};