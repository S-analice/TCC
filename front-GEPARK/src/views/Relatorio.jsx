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
      {vm.mensagem.mostrar && (
        <Mensagem 
          mensagem={vm.mensagem.texto} 
          tipo={vm.mensagem.tipo} 
          fechar={vm.fecharMensagem} 
        />
      )}

      {vm.carregando && <Carregando />}

      <div className="relatorio-filtros">
        <div className="relatorio-titulo">
          <Filter size={20} />
          <h3>Relatórios de Movimentação</h3>
        </div>

        <div className="relatorio-grid">
          <div className="relatorio-input-group">
            <label>Início</label>
            <input type="date" value={vm.dataInicio} onChange={(e) => vm.setDataInicio(e.target.value)} />
          </div>
          <div className="relatorio-input-group">
            <label>Fim</label>
            <input type="date" value={vm.dataFim} onChange={(e) => vm.setDataFim(e.target.value)} />
          </div>
        </div>

        <div className="relatorio-botoes">
          <button className="verde-botao" onClick={vm.gerarRelatorio}>
            <FileText size={18} /> Gerar Relatório
          </button>

          {vm.mostrarResultados && (
            <button className="amarelo-botao" onClick={vm.exportarCSV}>
              <Download size={18} /> Exportar CSV
            </button>
          )}
        </div>
      </div>

      {vm.mostrarResultados && (
        <div className="relatorio-resultados">
          <div className="relatorio-cards">
            <div className="relatorio-card verde">
              <p>Movimentações</p>
              <span>{vm.estatisticas.total}</span>
            </div>

            <div className="relatorio-card amarelo">
              <p>Tempo Médio</p>
              <span>{vm.estatisticas.tempoMedio}</span>
            </div>

            <div className="relatorio-card marrom">
              <p>Convênio Destaque</p>
              <span>{vm.estatisticas.convenioMaisUsado}</span>
            </div>

            <div className="relatorio-card azul">
              <p>Faturamento</p>
              <span>R$ {vm.estatisticas.faturamentoTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="relatorio-secao-tabela">
             <h3>Top 5 Motoristas (Frequência)</h3>
             <div className="relatorio-tabela-container">
                <table className="relatorio-tabela">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>CPF</th>
                      <th>Placa</th>
                      <th>Estadias</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vm.estatisticas.topMotoristas.map((item, index) => (
                      <tr key={item.cpf}>
                        <td><strong>{index + 1}º</strong></td>
                        <td>{formatarCPF(item.cpf)}</td>
                        <td>{formatarPlaca(item.placa)}</td>
                        <td>{item.frequencia} vezes</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}