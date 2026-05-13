import { useState } from "react";
import { MovimentacaoModel } from "../models/MovimentacaoModel";

export function useMovimentacaoViewModel() {
  const [movimentacoes, setMovimentacoes] = useState(MovimentacaoModel.registrosIniciais);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState({ mostrar: false, tipo: "sucesso", texto: "" });

  const tiposPagamento = [
    { id: 1, nome: "Dinheiro" },
    { id: 2, nome: "Pix" },
    { id: 3, nome: "Cartão de Crédito" },
    { id: 4, nome: "Cartão de Débito" }
  ];

  const salvarEntrada = async (dados, modo, idSelecionado, fechar) => {
    if (fechar) fechar();
    setCarregando(true);
    try {
      await new Promise((res) => setTimeout(res, 800));
      if (modo === "adicionar") {
        setMovimentacoes((prev) => [...prev, { ...dados, id: Date.now(), status: "No Pátio" }]);
      } else {
        setMovimentacoes((prev) => prev.map((m) => (m.id === idSelecionado ? { ...m, ...dados } : m)));
      }
      setMensagem({ mostrar: true, texto: "Sucesso!", tipo: "sucesso" });
    } finally { setCarregando(false); }
  };

  const finalizarSaida = async (id, dadosSaida, fechar) => {
    if (fechar) fechar();
    setCarregando(true);
    try {
      await new Promise((res) => setTimeout(res, 800));
      setMovimentacoes((prev) => prev.map((m) => m.id === id ? { ...m, ...dadosSaida, status: "Finalizado" } : m));
      setMensagem({ mostrar: true, texto: "Saída confirmada!", tipo: "sucesso" });
    } finally { setCarregando(false); }
  };

  return {
    movimentacoes, carregando, mensagem, setMensagem,
    salvarEntrada, finalizarSaida, tiposPagamento
  };
}