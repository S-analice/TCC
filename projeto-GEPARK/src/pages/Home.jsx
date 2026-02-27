import { useEffect, useState } from "react";
import "../styles/Home.css";
import { Truck, TrendingUp, TrendingDown, Users } from "lucide-react";

export default function Home({ usuario }) {

  const hoje = new Date();
  const dataHoje = hoje.toLocaleDateString("pt-BR"); // mostra na saudação
  const hojeISO = new Date().toISOString().split("T")[0]; // formato dd-mm-aaaa para filtro


  const nomeUsuario = usuario?.nome || "Usuário";
  const turno = usuario?.turno || "... - ...";
  const [inicioTurno, fimTurno] = turno.split(" - ");


  const [registros, setRegistros] = useState([
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
  ]);

  const [motoristas, setMotoristas] = useState([
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
  ]);

  const registrosHoje = registros.filter(r => r.entrada.startsWith(hojeISO));

  const entradasHoje = registrosHoje.filter(r => r.tipo === "Entrada").length;

  const saidasHoje = registrosHoje.filter(r => r.tipo === "Saída").length;

  const noPatio = registros.filter(r => r.status === "No Pátio").length;

  const totalMotoristas = motoristas.length;

  const totalMovimentacao = entradasHoje + saidasHoje;
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


      <div className="home-cards-grid">

        <div className="home-card">
          <div className="home-card-info">
            <h4>Veículos no Pátio</h4>
            <span className="home-card-number">{noPatio}</span>
            <p>Atualmente</p>
          </div>

          <div className="home-card-icon green">
            <Truck size={26} />
          </div>
        </div>


        <div className="home-card">
          <div className="home-card-info">
            <h4>Entradas Hoje</h4>
            <span className="home-card-number">{entradasHoje}</span>
          </div>

          <div className="home-card-icon yellow">
            <TrendingUp size={26} />
          </div>
        </div>


        <div className="home-card">
          <div className="home-card-info">
            <h4>Saídas Hoje</h4>
            <span className="home-card-number">{saidasHoje}</span>
          </div>

          <div className="home-card-icon brown">
            <TrendingDown size={26} />
          </div>
        </div>


        <div className="home-card">
          <div className="home-card-info">
            <h4>Motoristas Cadastrados</h4>
            <span className="home-card-number">{totalMotoristas}</span>
            <p>Total</p>
          </div>

          <div className="home-card-icon blue">
            <Users size={26} />
          </div>
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
            </tr>
          </thead>

          <tbody>

            {registros
              .slice()
              .sort((a, b) => new Date(b.entrada) - new Date(a.entrada))
              .slice(0, 5)
              .map((r) => (

                <tr key={r.id}>
                  <td>{formatarCPF(r.cpf)}</td>

                  <td>{formatarPlaca(r.placa)}</td>

                  <td>
                    {new Date(r.entrada).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </td>

                  <td>
                    <span className={r.tipo === "Entrada" ? "tipo-entrada" : "tipo-saida"}>
                      {r.tipo}
                    </span>
                  </td>

                  <td>
                    <span className={r.status === "No Pátio" ? "status-patio" : "status-finalizado"}>
                      {r.status}
                    </span>
                  </td>

                </tr>

              ))}

          </tbody>
        </table>
      </div>

    </div>
  );
}