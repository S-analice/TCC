import { useEffect, useState } from "react";
import "../styles/Home.css";

export default function Home({ usuario }) {

  const hoje = new Date();
  const dataHoje = hoje.toLocaleDateString("pt-BR"); // mostra na saudação
  const hojeISO = new Date().toISOString().split("T")[0]; // formato dd-mm-aaaa para filtro


  const nomeUsuario = usuario?.nome || "Usuário";
  const turno = usuario?.turno || "... - ...";
  const [inicioTurno, fimTurno] = turno.split(" - ");


  const patio = [
    { id: 1, placa: "ABC1234", data: hojeISO, removido: false },
    { id: 2, placa: "DEF5678", data: hojeISO, removido: false },
    { id: 3, placa: "GHI9012", data: hojeISO, removido: false },

    { id: 4, placa: "JKL3456", data: hojeISO, removido: true },
    { id: 5, placa: "MNO7890", data: hojeISO, removido: true },
    { id: 6, placa: "PQR2345", data: hojeISO, removido: true }
  ];

  const caminhoesHoje = patio.filter(c => c.data === hojeISO);
  const caminhoesEntraram = caminhoesHoje.filter(c => !c.removido).length;
  const caminhoesSairam = caminhoesHoje.filter(c => c.removido).length;

  const totalMovimentacao = caminhoesEntraram + caminhoesSairam;
  let textoMovimentacao = "";
  let classeMovimentacao = "";

  if (totalMovimentacao <= 20) {
    textoMovimentacao = "baixa";
    classeMovimentacao = "home-mov-baixa";
  } 

  else if (totalMovimentacao <= 50) {
    textoMovimentacao = "média";
    classeMovimentacao = "home-mov-media";
  } 

  else {
    textoMovimentacao = "alta";
    classeMovimentacao = "home-mov-alta";
  }


  const [temperatura, setTemperatura] = useState(null);
  const [clima, setClima] = useState("");
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);


  useEffect(() => {

    navigator.geolocation.getCurrentPosition((posicao) => {
      setLat(posicao.coords.latitude);
      setLon(posicao.coords.longitude);
    });
  }, []);


  useEffect(() => {

    if (lat && lon) {

        fetch(`${import.meta.env.VITE_API_URL}/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${import.meta.env.VITE_API_KEY}`)
        .then(res => res.json())
        .then(dados => {

          setTemperatura(Math.round(dados.main.temp));
          setClima(dados.weather[0].description);
        });
    }
  }, [lat, lon]);


  return (
    <div className="home-container">

      <div className="home-saudacao-box">
        <p>
          Olá <strong>{nomeUsuario}</strong>, seu turno começa hoje
          <strong> {dataHoje}</strong> às
          <strong> {inicioTurno}</strong> e termina às
          <strong> {fimTurno}</strong>, bom trabalho!
        </p>
      </div>


      <div className="home-info-dia">

        <h3>Informações do Dia</h3>

        <div className="home-info-grid">

          <div className="home-info-card">
            <div className="home-info-label">Temperatura</div>
            <div className="home-info-value">
              {temperatura !== null ? `${temperatura}°C` : "..."}
            </div>
          </div>

          <div className="home-info-card">
            <div className="home-info-label">Clima</div>
            <div className="home-info-value">
              {clima || "..."}
            </div>
          </div>

          <div className="home-info-card">
            <div className="home-info-label">Movimentação</div>
            <div className={`home-info-value ${classeMovimentacao}`}>
              {textoMovimentacao}
            </div>
          </div>

        </div>

      </div>


      <div className="home-estatistica-grid">

        <div className="home-estatistica-card entrada">
          <h3>Caminhões que Entraram</h3>
          <div className="home-numero">{caminhoesEntraram}</div>
        </div>

        <div className="home-estatistica-card saida">
          <h3>Caminhões que Saíram</h3>
          <div className="home-numero">{caminhoesSairam}</div>
        </div>

      </div>

    </div>
  );
}