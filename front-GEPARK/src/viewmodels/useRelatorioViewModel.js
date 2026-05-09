import { useState } from "react";
import { MovimentacaoModel } from "../models/MovimentacaoModel";
import { MotoristaModel } from "../models/MotoristaModel";

export function useRelatorioViewModel() {
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [registrosFiltrados, setRegistrosFiltrados] = useState([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState({ mostrar: false, texto: "", tipo: "" });

  const gerarRelatorio = async () => {
    if (!dataInicio || !dataFim) {
      setMensagem({ mostrar: true, texto: "Selecione as datas!", tipo: "erro" });
      return;
    }

    setCarregando(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const filtrados = MovimentacaoModel.filtrarPorPeriodo(
        MovimentacaoModel.registrosIniciais, 
        dataInicio, 
        dataFim
      );

      setRegistrosFiltrados(filtrados);
      setMostrarResultados(true);
    } catch {
      setMensagem({ mostrar: true, texto: "Erro ao gerar relatório", tipo: "erro" });
    } finally {
      setCarregando(false);
    }
  };

  const exportarRelatorio = async () => {
    setCarregando(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setMensagem({ 
        mostrar: true, 
        texto: "Relatório CSV exportado com sucesso!", 
        tipo: "sucesso" 
      });
    } catch {
      setMensagem({ 
        mostrar: true, 
        texto: "Erro ao exportar arquivo", 
        tipo: "erro" 
      });
    } finally {
      setCarregando(false);
    }
  };

  const estatisticas = {
    total: registrosFiltrados.length,
    
    tempoMedio: (() => {
      const concluidos = registrosFiltrados.filter(r => r.dataSaida);
      if (concluidos.length === 0) return "-";
      const totalMinutos = concluidos.reduce((acc, curr) => 
        acc + MovimentacaoModel.calcularTempoPermanencia(curr.dataEntrada, curr.dataSaida), 0);
      const media = totalMinutos / concluidos.length;
      return `${Math.floor(media / 60)}h ${Math.floor(media % 60)}min`;
    })(),

    clienteFrequente: (() => {
      if (registrosFiltrados.length === 0) return "-";
      const contagem = {};
      registrosFiltrados.forEach(reg => {
        const mot = MotoristaModel.buscarPorCPF(MotoristaModel.getInitialData(), reg.cpf);
        const nome = mot?.convenio || "Desconhecido";
        contagem[nome] = (contagem[nome] || 0) + 1;
      });
      return Object.keys(contagem).reduce((a, b) => contagem[a] > contagem[b] ? a : b);
    })(),

    topMotoristas: (() => {
      const contagem = {};
      registrosFiltrados.forEach(reg => {
        contagem[reg.cpf] = (contagem[reg.cpf] || 0) + 1;
      });
      return Object.entries(contagem)
        .map(([cpf, freq]) => ({
          cpf,
          frequencia: freq,
          placa: registrosFiltrados.findLast(r => r.cpf === cpf)?.placa
        }))
        .sort((a, b) => b.frequencia - a.frequencia)
        .slice(0, 5);
    })()
  };

  return {
    dataInicio, setDataInicio,
    dataFim, setDataFim,
    mostrarResultados,
    registrosFiltrados,
    carregando,
    mensagem,
    setMensagem,
    gerarRelatorio,
    exportarRelatorio, 
    estatisticas
  };
}