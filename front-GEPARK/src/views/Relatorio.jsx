import React from "react";
import "../styles/Relatorio.css";
import { FileText, Download, Filter } from "lucide-react";
import { useRelatorioViewModel } from "../viewmodels/useRelatorioViewModel";
import { formatarCPF, formatarPlaca } from "../utils/formatadores";
import Carregando from "../components/Carregando";
import Mensagem from "../components/Mensagem";

export default function Relatorio() {
  const vm = useRelatorioViewModel();

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
            <input type="date" className="input" value={vm.dataInicio} onChange={(e) => vm.setDataInicio(e.target.value)} />
          </div>
          <div className="relatorio-input-group">
            <label>Data Fim</label>
            <input type="date" className="input" value={vm.dataFim} onChange={(e) => vm.setDataFim(e.target.value)} />
          </div>
        </div>

        <div className="relatorio-botoes">
          <button className="verde-botao" onClick={vm.gerarRelatorio}>
            <FileText size={18} /> Gerar Relatório
          </button>
          {vm.mostrarResultados && (
            <button className="amarelo-botao" onClick={vm.exportarRelatorio}>
              <Download size={18} /> Exportar CSV
            </button>
          )}
        </div>
      </div>

      {vm.mostrarResultados && (
        <div className="relatorio-resultados">
          <div className="relatorio-header">
            <h3>Resultados do Relatório</h3>
            <p>Estatísticas de frequência</p>
          </div>

          <div className="relatorio-cards">
            <div className="relatorio-card verde">
              <p>Total de Movimentações</p>
              <span>{vm.estatisticas.total}</span>
            </div>
            <div className="relatorio-card amarelo">
              <p>Tempo Médio Permanência</p>
              <span>{vm.estatisticas.tempoMedio}</span>
            </div>
            <div className="relatorio-card marrom">
              <p>Cliente Mais Frequente</p>
              <span>{vm.estatisticas.clienteFrequente}</span>
            </div>
          </div>

          <div className="relatorio-tabela-container">
            <table className="relatorio-tabela">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>CPF</th>
                  <th>Placa</th>
                  <th>Frequência</th>
                </tr>
              </thead>
              <tbody>
                {vm.estatisticas.topMotoristas.map((item, index) => (
                  <tr key={item.cpf}>
                    <td><strong>{index + 1}º</strong></td>
                    <td>{formatarCPF(item.cpf)}</td>
                    <td>{formatarPlaca(item.placa)}</td>
                    <td>{item.frequencia} estadias</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {vm.carregando && <Carregando />}
      {vm.mensagem.mostrar && (
        <Mensagem 
          mensagem={vm.mensagem.texto} 
          tipo={vm.mensagem.tipo} 
          fechar={() => vm.setMensagem({...vm.mensagem, mostrar: false})} 
        />
      )}
    </div>
  );
}