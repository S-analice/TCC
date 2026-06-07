import { useState } from "react";
import { MovimentacaoModel } from "../models/MovimentacaoModel";
import { ChecklistModel } from "../models/ChecklistModel";
import { MENSAGENS } from "../utils/mensagens";

export function useMovimentacaoViewModel(checklistsFromParent) {
  const [movimentacoes, setMovimentacoes] = useState(MovimentacaoModel.registrosIniciais);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState({ mostrar: false, tipo: "sucesso", texto: "" });
  const [checklists, setChecklists] = useState(checklistsFromParent || ChecklistModel.getInitialData());

  const tiposPagamento = [
    { id: 1, nome: "Dinheiro" },
    { id: 2, nome: "Pix" },
    { id: 3, nome: "Cartão de Crédito" },
    { id: 4, nome: "Cartão de Débito" }
  ];

  const salvarChecklist = async (dados) => {
    setCarregando(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      
      const novosChecklists = ChecklistModel.salvarChecklist(checklists, dados);
      setChecklists(novosChecklists);
      setMovimentacoes((prev) =>
        prev.map((m) =>
          m.id === dados.movimentacao_id 
            ? { 
                ...m, 
                status: "Cancelado",
                dataSaida: new Date().toISOString(),
                funcionarioSaida: dados.funcionario_nome || "Sistema - Bloqueio",
                motivoCancelamento: dados.motivo
              } 
            : m
        )
      );

      setMensagem({ 
        mostrar: true, 
        texto: "Motorista bloqueado e movimentação cancelada com sucesso!", 
        tipo: "sucesso" 
      });
    } catch {
      setMensagem({ 
        mostrar: true, 
        texto: MENSAGENS.ERRO.SALVAR, 
        tipo: "erro" 
      });
    } finally {
      setCarregando(false);
    }
  };

  const salvarEntrada = async (dados, modo, idSelecionado, fechar) => {
    if (fechar) fechar();
    setCarregando(true);
    try {
      await new Promise((res) => setTimeout(res, 800));
      if (modo === "adicionar") {
        setMovimentacoes((prev) => [...prev, { ...dados, id: Date.now(), dataSaida: null, status: "Ativa" }]);
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
      setMensagem({ mostrar: true, texto: MENSAGENS.SUCESSO.BAIXAR, tipo: "sucesso" });
    } catch {
      setMensagem({ mostrar: true, texto: MENSAGENS.ERRO.CARREGAR, tipo: "erro" });
    } finally { setCarregando(false); }
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
    tiposPagamento,
    salvarChecklist,
    checklists
  };
}