import React from "react";
import "../styles/paginas/Home.css";
import { Truck, TrendingUp, TrendingDown, Users } from "lucide-react";
import { useHomeViewModel } from "../viewmodels/useHomeViewModel";
import { formatarCPF, formatarPlaca } from "../utils/formatadores"; 

export default function Home({ funcionario }) {
  const { saudacao, clima, indicadores, ultimasMovimentacoes } = useHomeViewModel(funcionario);

  return (
    <div className="home-container">
      <div className="home-saudacao-box">
        <p>
          Olá <strong>{saudacao.nome}</strong>, seu turno começa hoje
          <strong> {saudacao.data}</strong> às
          <strong> {saudacao.inicio}</strong> e termina às
          <strong> {saudacao.fim}</strong>, bom trabalho!
        </p>
      </div>

      <div className="home-info-dia">
        <h3>Informações do Dia</h3>
        <div className="home-info-grid">
          <div className="home-info-dia-card">
            <div className="home-info-dia-label">Temperatura</div>
            <div className="home-info-dia-valor">{clima.temp !== null ? `${clima.temp}°C` : "..."}</div>
          </div>
          <div className="home-info-dia-card">
            <div className="home-info-dia-label">Clima</div>
            <div className="home-info-dia-valor">{clima.desc || "..."}</div>
          </div>
          <div className="home-info-dia-card">
            <div className="home-info-dia-label">Movimentação</div>
            <div className={`home-info-dia-valor ${indicadores.movimentacao.classe}`}>
              {indicadores.movimentacao.texto}
            </div>
          </div>
        </div>
      </div>

      <div className="home-cards-grid">
        <div className="home-card">
          <div className="home-card-info">
            <h4>Veículos no Pátio</h4>
            <span className="home-card-numero">{indicadores.noPatio}</span>
          </div>
          <div className="home-card-icon green"><Truck size={26} /></div>
        </div>

        <div className="home-card">
          <div className="home-card-info">
            <h4>Entradas Hoje</h4>
            <span className="home-card-numero">{indicadores.entradasHoje}</span>
          </div>
          <div className="home-card-icon yellow"><TrendingUp size={26} /></div>
        </div>

        <div className="home-card">
          <div className="home-card-info">
            <h4>Saídas Hoje</h4>
            <span className="home-card-numero">{indicadores.saidasHoje}</span>
          </div>
          <div className="home-card-icon brown"><TrendingDown size={26} /></div>
        </div>

        <div className="home-card">
          <div className="home-card-info">
            <h4>Motoristas</h4>
            <span className="home-card-numero">{indicadores.totalMotoristas}</span>
          </div>
          <div className="home-card-icon blue"><Users size={26} /></div>
        </div>
      </div>


      <div className="home-tabela-container">
        <h3>Últimas Movimentações</h3>
        <table className="home-tabela">
          <thead>
            <tr>
              <th>CPF</th>
              <th>Placa</th>
              <th>Data/Hora</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Funcionário</th>
            </tr>
          </thead>
          <tbody>
            {ultimasMovimentacoes.map((r) => (
              <tr key={r.id}>
                <td>{formatarCPF(r.cpf)}</td>
                <td>{formatarPlaca(r.placa)}</td>
                <td>{new Date(r.tipo === "Entrada" ? r.dataEntrada : r.dataSaida).toLocaleString("pt-BR")}</td>
                <td>
                  <span className={r.tipo === "Entrada" ? "home-tipo-entrada" : "home-tipo-saida"}>{r.tipo}</span>
                </td>
                <td>
                  <span className={r.status === "No Pátio" ? "home-status-patio" : "home-status-finalizado"}>{r.status}</span>
                </td>
                <td>{r.tipo === "Entrada" ? r.funcionarioEntrada : r.funcionarioSaida}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}