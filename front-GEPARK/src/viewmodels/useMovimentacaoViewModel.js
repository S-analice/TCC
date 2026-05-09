import { useState } from "react";
import { MovimentacaoModel } from "../models/MovimentacaoModel";

export function useMovimentacaoViewModel() {
  const [movimentacoes, setMovimentacoes] = useState(
    MovimentacaoModel.registrosIniciais,
  );
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState({
    mostrar: false,
    tipo: "sucesso",
    texto: "",
  });

  const exportarDados = async () => {
    try {
      setCarregando(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMensagem({
        mostrar: true,
        texto: "Relatório CSV exportado com sucesso!",
        tipo: "sucesso",
      });
    } catch (error) {
      console.error("Erro no exportar:", error);
      setMensagem({
        mostrar: true,
        texto: "Erro ao exportar arquivo",
        tipo: "erro",
      });
    } finally {
      setCarregando(false);
    }
  };

  const carregarDados = async () => {
    try {
      setCarregando(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Erro no fetch de movimentações:", error);
      setMensagem({
        mostrar: true,
        texto: "Erro ao carregar movimentações",
        tipo: "erro",
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
        const nova = { ...dados, id: Date.now(), status: "No Pátio" };
        setMovimentacoes((prev) => [...prev, nova]);
        setMensagem({
          mostrar: true,
          texto: "Entrada registrada!",
          tipo: "sucesso",
        });
      } else {
        setMovimentacoes((prev) =>
          prev.map((m) => (m.id === idSelecionado ? { ...m, ...dados } : m)),
        );
        setMensagem({
          mostrar: true,
          texto: "Registro atualizado!",
          tipo: "sucesso",
        });
      }
    } catch (error) {
      console.error("Erro no registro de entrada:", error);
      setMensagem({ mostrar: true, texto: "Erro ao salvar", tipo: "erro" });
    } finally {
      setCarregando(false);
    }
  };

  const finalizarSaida = async (id, dadosSaida, fechar) => {
    if (fechar) fechar();

    setCarregando(true);

    try {
      await new Promise((res) => setTimeout(res, 800));

      setMovimentacoes((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, ...dadosSaida, status: "Finalizado" } : m,
        ),
      );
      setMensagem({
        mostrar: true,
        texto: "Saída confirmada!",
        tipo: "sucesso",
      });
    } catch (error) {
      console.error("Erro no fechamento de saída:", error);
      setMensagem({
        mostrar: true,
        texto: "Erro ao processar saída",
        tipo: "erro",
      });
    } finally {
      setCarregando(false);
    }
  };

  return {
    movimentacoes,
    carregando,
    setCarregando,
    mensagem,
    setMensagem,
    salvarEntrada,
    finalizarSaida,
    carregarDados,
    exportarDados,
  };
}
