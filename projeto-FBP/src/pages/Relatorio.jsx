import { useState } from "react";
import Carregando from "../components/Carregando";
import "../styles/Relatorio.css";

export default function Relatorio() {

  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [filtrado, setFiltrado] = useState(false);

  const patio = [
    {
      id: 1,
      cpf: "12345678900",
      placa: "ABC1234",
      entrada: "2026-02-23T08:30:00",
      saida: null,
      funcionario: "João Silva",
      removido: false
    },
    {
      id: 2,
      cpf: "98765432100",
      placa: "DEF5678",
      entrada: "2026-02-23T09:15:00",
      saida: null,
      funcionario: "Maria Santos",
      removido: false
    },
    {
      id: 3,
      cpf: "45678912300",
      placa: "GHI9012",
      entrada: "2026-02-23T07:40:00",
      saida: "2026-02-23T11:10:00",
      funcionario: "Carlos Oliveira",
      removido: true
    }
  ];

  const dadosFiltrados = patio.filter(c => {
    if (!dataInicio || !dataFim) return false;
  
    const entradaData = c.entrada.split("T")[0];
    const saidaData = c.saida ? c.saida.split("T")[0] : null;
  
    const entrouNoPeriodo =
      entradaData >= dataInicio && entradaData <= dataFim;
  
    const saiuNoPeriodo =
      saidaData && saidaData >= dataInicio && saidaData <= dataFim;
  
    return entrouNoPeriodo || saiuNoPeriodo;
  });

  const caminhoesEntrada = dadosFiltrados.filter(c => !c.removido);
  const caminhoesSaida = dadosFiltrados.filter(c => c.removido);

  function filtrarRelatorio() {
    setCarregando(true);

    setTimeout(() => {
      setFiltrado(true);
      setCarregando(false);
    }, 2000);
  }

  function gerarPDF(tipo) {
    setCarregando(true);

    setTimeout(() => {
      alert(`PDF de ${tipo} gerado com sucesso!`);
      setCarregando(false);
    }, 2000);
  }

  const formatarCPF = (cpf) => {
    if (!cpf) return "";
    const numeros = cpf.replace(/\D/g, "");
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatarPlaca = (placa) => {
    if (!placa) return "";
    const valor = placa.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

    if (valor.length === 7) {
      return valor.replace(/([A-Z]{3})(\d[A-Z]\d{2}|\d{4})/, "$1-$2");
    }

    return placa;
  };

  function formatarData(data) {
    if (!data) return "";
    return new Date(data).toLocaleDateString("pt-BR");
  }

  function formatarHora(data) {
    if (!data) return "";
    return new Date(data).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  return (
    <div className="relatorio-container">

      {carregando && <Carregando />}

      <div className="relatorio-filtro">
        <h2>Filtrar por Período</h2>

        <div className="inputsFiltro">

          <div className="campo">
            <label>Data Início</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
          </div>

          <div className="campo">
            <label>Data Fim</label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
            />
          </div>

          <button onClick={filtrarRelatorio}>Filtrar</button>
        </div>
      </div>

      <div className="relatorio-cards">
        <div>

          <div className="card">

            <div className="cardHeader entrada">
              <h3>Caminhões Entrada</h3>
              <div className="relatorio-numero">
                {filtrado ? caminhoesEntrada.length : 0}
              </div>
            </div>

            <div className="relatorio-lista">
              {filtrado ? (
                caminhoesEntrada.map((caminhao) => (

                  <div key={caminhao.id} className="item">

                    <div className="itemTopo">
                      <span className="placa">{formatarPlaca(caminhao.placa)}</span>
                      <span className="data">{formatarData(caminhao.entrada)}</span>
                    </div>

                    <div className="itemInfo">
                      <div>Funcionário: {caminhao.funcionario}</div>
                      <div>CPF: {formatarCPF(caminhao.cpf)}</div>
                      <div>Horário: {formatarHora(caminhao.entrada)}</div>
                    </div>

                  </div>
                ))
              ) : (
                <div className="semDados">
                  Selecione um período para visualizar os dados
                </div>
              )}
            </div>

          </div>

          <button className="relatorio-entrada" onClick={() => gerarPDF("entrada")}>
            Gerar PDF
          </button>

        </div>

        <div>

          <div className="card">

            <div className="cardHeader saida">
              <h3>Caminhões Saída</h3>
              <div className="relatorio-numero">
                {filtrado ? caminhoesSaida.length : 0}
              </div>
            </div>

            <div className="relatorio-lista">
              {filtrado ? (
                caminhoesSaida.map((caminhao) => (

                  <div key={caminhao.id} className="item">

                    <div className="itemTopo">
                      <span className="placa">{formatarPlaca(caminhao.placa)}</span>
                      <span className="data">{formatarData(caminhao.saida)}</span>
                    </div>

                    <div className="itemInfo">
                      <div>Funcionário: {caminhao.funcionario}</div>
                      <div>CPF: {formatarCPF(caminhao.cpf)}</div>
                      <div>Entrada: {formatarHora(caminhao.entrada)}</div>
                      <div>Saída: {formatarHora(caminhao.saida)}</div>
                    </div>

                  </div>
                ))
              ) : (
                <div className="semDados">
                  Selecione um período para visualizar os dados
                </div>
              )}
            </div>

          </div>

          <button className="relatorio-saida" onClick={() => gerarPDF("saida")}>
            Gerar PDF
          </button>

        </div>

      </div>
    </div>
  );
}