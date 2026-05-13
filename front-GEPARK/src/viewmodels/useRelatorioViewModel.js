import { useState } from "react";
import { MovimentacaoModel } from "../models/MovimentacaoModel";

export function useRelatorioViewModel() {
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [registrosFiltrados, setRegistrosFiltrados] = useState([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState({ mostrar: false, texto: "", tipo: "" });

  const gerarRelatorio = async () => {
    if (!dataInicio || !dataFim) {
      setMensagem({ mostrar: true, texto: "Por favor, selecione o período!", tipo: "erro" });
      return;
    }

    setCarregando(true);
    setMostrarResultados(false); 
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const filtrados = MovimentacaoModel.filtrarPorPeriodo(
        MovimentacaoModel.registrosIniciais, 
        dataInicio, 
        dataFim
      );

      setRegistrosFiltrados(filtrados);
      setMostrarResultados(true);
      setMensagem({ mostrar: true, texto: "Relatório gerado com sucesso!", tipo: "sucesso" });
    } catch (err) {
      setMensagem({ mostrar: true, texto: "Erro ao processar dados.", tipo: "erro" });
    } finally {
      setCarregando(false);
    }
  };

  const exportarCSV = async () => {
    setCarregando(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      setMensagem({ mostrar: true, texto: "Arquivo CSV baixado com sucesso!", tipo: "sucesso" });
    } catch (err) {
      setMensagem({ mostrar: true, texto: "Falha ao exportar arquivo.", tipo: "erro" });
    } finally {
      setCarregando(false);
    }
  };

  const fecharMensagem = () => setMensagem({ ...mensagem, mostrar: false });

  const estatisticas = {
    total: registrosFiltrados.length,
    
    faturamentoTotal: registrosFiltrados.reduce((acc, curr) => acc + (curr.valorFinal || 0), 0),
    

    tempoMedio: (() => {
      const concluidos = registrosFiltrados.filter(r => r.dataSaida);
      if (concluidos.length === 0) return "-";
      
      const totalMinutos = concluidos.reduce((acc, curr) => 
        acc + MovimentacaoModel.calcularTempoPermanencia(curr.dataEntrada, curr.dataSaida), 0);
      
      const media = totalMinutos / concluidos.length;
      const horas = Math.floor(media / 60);
      const minutos = Math.floor(media % 60);
      
      return `${horas}h ${minutos}m`;
    })(),

    convenioMaisUsado: (() => {
      if (registrosFiltrados.length === 0) return "-";
      const contagem = {};
      registrosFiltrados.forEach(reg => {
        const nome = reg.convenio || "Sem Convênio";
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
    fecharMensagem,
    gerarRelatorio,
    exportarCSV,
    estatisticas
  };
}