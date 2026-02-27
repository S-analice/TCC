import { useState } from "react";
import "../styles/Relatorio.css";
import Carregando from "../components/Carregando";
import Mensagem from "../components/Mensagem";
import { FileText, Download, Filter } from "lucide-react";

export default function Relatorio() {

  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [mostrarResultados, setMostrarResultados] = useState(false);

  const [dadosFiltrados, setDadosFiltrados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const dados = [
    {
      id: 1,
      cpf: "12345678900",
      placa: "ABC1234",
      entrada: "2026-02-23T08:30:00",
      saida: null,
      funcionario: "João Silva",
      tipo: "Entrada",
      status: "No Pátio"
    },
    {
      id: 2,
      cpf: "98765432100",
      placa: "DEF5678",
      entrada: "2026-02-23T09:15:00",
      saida: null,
      funcionario: "Maria Santos",
      tipo: "Entrada",
      status: "No Pátio"
    },
    {
      id: 3,
      cpf: "45678912300",
      placa: "GHI9012",
      entrada: "2026-02-23T07:40:00",
      saida: "2026-02-23T11:10:00",
      funcionario: "Carlos Oliveira",
      tipo: "Saída",
      status: "Finalizado"
    }
  ];

  const motoristas = [
    {
      id: 1,
      cpf: "12345678900",
      placa: "ABC1234",
      telefone: "41999991111",
      cnpj: "12345678000100",
      convenio: "Convênio A"
    },
    {
      id: 2,
      cpf: "98765432100",
      placa: "DEF5678",
      telefone: "41988882222",
      cnpj: "98765432000100",
      convenio: "Convênio B"
    },
    {
      id: 3,
      cpf: "45678912300",
      placa: "GHI9012",
      telefone: "41977773333",
      cnpj: "45678912000100",
      convenio: "Sem Convênio"
    }
  ];

  function gerarRelatorio() {

    if (!dataInicio || !dataFim) {
      return;
    }

    setCarregando(true);

    setTimeout(() => {

      const inicio = new Date(dataInicio);
      const fim = new Date(dataFim);

      const filtrados = dados.filter((item) => {

        const dataEntrada = new Date(item.entrada);

        return dataEntrada >= inicio && dataEntrada <= fim;

      });

      setDadosFiltrados(filtrados);
      setMostrarResultados(true);
      setCarregando(false);

    }, 2000);

  }

  function exportarCSV() {

    setCarregando(true);

    setTimeout(() => {

      setCarregando(false);
      setMensagem("Relatório exportado com sucesso!");

    }, 2000);

  }

  function buscarMotorista(cpf) {
    return motoristas.find(m => m.cpf === cpf);
  }

  function formatarDataHora(data) {
    if (!data) return "-";

    return new Date(data).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function calcularDuracao(entrada, saida) {

    if (!saida) return "-";

    const inicio = new Date(entrada);
    const fim = new Date(saida);

    const diff = (fim - inicio) / 60000;

    const horas = Math.floor(diff / 60);
    const minutos = Math.floor(diff % 60);

    return `${horas}h ${minutos}min`;
  }

  function calcularTotalMovimentacoes() {
    return dadosFiltrados.length;
  }

  function calcularTempoMedio() {

    let totalMinutos = 0;
    let contador = 0;

    dadosFiltrados.forEach((item) => {

      if (item.saida) {

        const inicio = new Date(item.entrada);
        const fim = new Date(item.saida);

        const diff = (fim - inicio) / 60000;

        totalMinutos += diff;
        contador++;
      }
    });

    if (contador === 0) return "-";

    const media = totalMinutos / contador;

    const horas = Math.floor(media / 60);
    const minutos = Math.floor(media % 60);

    return `${horas}h ${minutos}min`;
  }

  function clienteMaisFrequente() {

    const contagem = {};

    dados.forEach((item) => {

      const motorista = buscarMotorista(item.cpf);

      if (motorista) {
        const tipo = motorista.convenio;

        contagem[tipo] = (contagem[tipo] || 0) + 1;
      }
    });

    let maior = 0;
    let cliente = "-";

    for (let tipo in contagem) {

      if (contagem[tipo] > maior) {
        maior = contagem[tipo];
        cliente = tipo;
      }
    }

    return cliente;
  }

  const formatarCPF = (cpf) => {
    const numeros = cpf.replace(/\D/g, "");
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatarPlaca = (placa) => {
    const valor = placa.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    return valor.replace(/([A-Z]{3})(\d{4})/, "$1-$2");
  };

  return (
    <div className="relatorio-container">

      <div className="relatorio-filtros">

        <div className="relatorio-titulo">
          <Filter size={20} />
          <h3>Filtros do Relatório</h3>
        </div>

        <div className="relatorio-grid">

          <div className="relatorio-input-group">
            <label>Data Início</label>
            <input
              type="date"
              className="input"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
          </div>

          <div className="relatorio-input-group">
            <label>Data Fim</label>
            <input
              type="date"
              className="input"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
            />
          </div>

        </div>

        <div className="relatorio-botoes">

          <button className="verde-botao" onClick={gerarRelatorio}>
            <FileText size={18} />
            Gerar Relatório
          </button>

          {mostrarResultados && (
            <button className="amarelo-botao" onClick={exportarCSV}>
              <Download size={18} />
              Exportar CSV
            </button>
          )}

        </div>

      </div>

      {mostrarResultados && (

        <div className="relatorio-resultados">

          <div className="relatorio-header">
            <h3>Resultados do Relatório</h3>
          </div>

          <div className="relatorio-cards">

            <div className="relatorio-card verde">
              <p>Total de Movimentações</p>
              <span>{calcularTotalMovimentacoes()}</span>
            </div>

            <div className="relatorio-card amarelo">
              <p>Tempo Médio de Permanência</p>
              <span>{calcularTempoMedio()}</span>
            </div>

            <div className="relatorio-card marrom">
              <p>Cliente Mais Frequente</p>
              <span>{clienteMaisFrequente()}</span>
            </div>

          </div>

          <div className="relatorio-tabela-container">

            <table className="relatorio-tabela">

              <thead>
                <tr>
                  <th>CPF</th>
                  <th>Placa</th>
                  <th>Entrada</th>
                  <th>Saída</th>
                  <th>Duração</th>
                  <th>Tipo Cliente</th>
                </tr>
              </thead>

              <tbody>

                {dadosFiltrados.map((item) => {

                  const motorista = buscarMotorista(item.cpf);

                  return (

                    <tr key={item.id}>

                      <td>{formatarCPF(item.cpf)}</td>

                      <td>{formatarPlaca(item.placa)}</td>

                      <td>{formatarDataHora(item.entrada)}</td>

                      <td>{formatarDataHora(item.saida)}</td>

                      <td>{calcularDuracao(item.entrada, item.saida)}</td>

                      <td>
                        <span className={`convenio ${motorista?.convenio === "Convênio A"
                          ? "a"
                          : motorista.convenio === "Convênio B"
                            ? "b"
                            : "sem"
                          }`}>
                          {motorista.convenio}
                        </span>
                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </table>

          </div>

        </div>

      )}

      {carregando && <Carregando />}

      {mensagem && (
        <Mensagem
          mensagem={mensagem}
          fechar={() => setMensagem("")}
        />
      )}
    </div>
  );
}