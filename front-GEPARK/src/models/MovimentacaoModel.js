import { MotoristaModel } from "./MotoristaModel";

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

  calcularValor: (dataEntrada, dataSaida, cpfMotorista) => {
    try {
      if (!dataEntrada || !dataSaida || !cpfMotorista) {
        return { valor: 0, erro: "Dados insuficientes para cálculo" };
      }
      
      const listaMotoristas = MotoristaModel.getInitialData();
      const motorista = listaMotoristas.find(m => m.cpf === cpfMotorista);
      const convenioNome = motorista ? motorista.convenio : "Sem Convênio";

      const entrada = new Date(dataEntrada);
      const saida = new Date(dataSaida);

      if (saida <= entrada) {
        return { valor: 0, erro: "Horário de saída deve ser após a entrada!" };
      }

      const diferencaMs = saida - entrada;
      const totalHoras = Math.ceil(diferencaMs / (1000 * 60 * 60));

      const tabelasPreco = {
        "Novo Cliente": { hora: 10, diaria: 100 },
        "Premium": { hora: 6, diaria: 60 },
        "Sem Convênio": { hora: 48, diaria: null } 
      };

      const chave = Object.keys(tabelasPreco).find(
        k => k.toLowerCase() === convenioNome.toLowerCase()
      ) || "Sem Convênio";

      const regra = tabelasPreco[chave];
      let valorFinal = 0;

      if (chave === "Sem Convênio" || !regra.diaria) {
        valorFinal = totalHoras * regra.hora;
      } else {
        const diasCompletos = Math.floor(totalHoras / 24);
        const horasExcedentes = totalHoras % 24;

        const valorDiarias = diasCompletos * regra.diaria;

        const valorHorasExtras = Math.min(horasExcedentes * regra.hora, regra.diaria);

        valorFinal = valorDiarias + valorHorasExtras;
      }

      return { 
        valor: valorFinal, 
        erro: null, 
        convenioAplicado: chave,
        tempoTotalHoras: totalHoras 
      };
    } catch {
      return { valor: 0, erro: "Erro no processamento do cálculo." };
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