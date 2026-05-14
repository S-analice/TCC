import { useState, useEffect, useCallback } from "react";
import { HomeModel } from "../models/HomeModel";
import { MovimentacaoModel } from "../models/MovimentacaoModel";
import { MotoristaModel } from "../models/MotoristaModel";

export function useHomeViewModel(funcionario) {
  const [clima, setClima] = useState({ temp: null, desc: "" });
  const [registros] = useState(MovimentacaoModel.registrosIniciais || []);
  const [motoristas] = useState(MotoristaModel.getInitialData() || []);
  const [saudacao, setSaudacao] = useState({});

  const iniciarClima = useCallback(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocalização não suportada pelo navegador.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const dadosClima = await HomeModel.buscarClima(latitude, longitude);
          setClima({
            temp: dadosClima.temperatura,
            desc: dadosClima.descricao
          });
        } catch (error) {
          console.error("Erro ao buscar dados na API de Clima.");
        }
      },
      (error) => {
        console.warn("Usuário negou a localização ou erro de GPS:", error.message);
        setClima({ temp: "--", desc: "Clima indisponível." });
      },
      { timeout: 10000 } // Espera 10 segundos antes de desistir
    );
  }, []);

  useEffect(() => {
    const dadosSaudacao = HomeModel.obterSaudacaoCompleta(funcionario);
    setSaudacao(dadosSaudacao);

    iniciarClima();
  }, [funcionario, iniciarClima]);

const registrosHoje = MovimentacaoModel.filtrarMovimentacoesHoje(registros);
const entradasHoje = registrosHoje.filter(r => r.tipo === "Entrada").length;
const saidasHoje = registrosHoje.filter(r => r.tipo === "Saída").length;
const noPatio = registros.filter(r => r.status === "No Pátio").length;
const totalMovimentacao = entradasHoje + saidasHoje;

const getStatusMovimentacao = () => {
  if (totalMovimentacao <= 5) return { texto: "baixa", classe: "home-mov-baixa" };
  if (totalMovimentacao <= 15) return { texto: "média", classe: "home-mov-media" };
  return { texto: "alta", classe: "home-mov-alta" };
};

const ultimasMovimentacoes = [...registros]
  .sort((a, b) => new Date(b.dataSaida || b.dataEntrada) - new Date(a.dataSaida || a.dataEntrada))
  .slice(0, 5);

return {
  saudacao,
  clima,
  indicadores: {
    entradasHoje,
    saidasHoje,
    noPatio,
    totalMotoristas: motoristas.length,
    movimentacao: getStatusMovimentacao()
  },
  ultimasMovimentacoes
};
}