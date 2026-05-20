import { useState } from "react";
import { MovimentacaoModel } from "../models/MovimentacaoModel";
import { MENSAGENS } from "../utils/mensagens";

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
      setMensagem({ mostrar: true, texto: MENSAGENS.SUCESSO.ENTRADA, tipo: "sucesso" });
    } catch {
      setMensagem({ mostrar: true, texto: MENSAGENS.ERRO.SALVAR, tipo: "erro" });
    } finally { setCarregando(false); }
  };

  const finalizarSaida = async (id, dadosSaida, fechar) => {
    if (fechar) fechar();
    setCarregando(true);
    try {
      await new Promise((res) => setTimeout(res, 800));
      setMovimentacoes((prev) => prev.map((m) => m.id === id ? { ...m, ...dadosSaida, status: "Finalizado" } : m));
      setMensagem({ mostrar: true, texto: MENSAGENS.SUCESSO.SAIDA, tipo: "sucesso" });
    } catch {
      setMensagem({ mostrar: true, texto: MENSAGENS.ERRO.SALVAR, tipo: "erro" });
    } finally { setCarregando(false); }
  };

  const exportarDados = async () => {
    setCarregando(true);
    try {
      await new Promise((res) => setTimeout(res, 1500));
      
      setMensagem({ 
        mostrar: true, 
        texto: MENSAGENS.SUCESSO.BAIXAR, 
        tipo: "sucesso" 
      });
    } catch {
      setMensagem({ 
        mostrar: true, 
        texto: MENSAGENS.ERRO.CARREGAR, 
        tipo: "erro" 
      });
    } finally {
      setCarregando(false);
    }
  };

  const fecharMensagem = () => setMensagem({ ...mensagem, mostrar: false });

  return {
    movimentacoes, 
    carregando, 
    mensagem, 
    setMensagem,
    fecharMensagem,
    salvarEntrada, 
    finalizarSaida, 
    exportarDados, 
    tiposPagamento
  };
}