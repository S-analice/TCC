import { useState } from "react";
import { MotoristaModel } from "../models/MotoristaModel";

export function useMotoristaViewModel() {
  const [motoristas, setMotoristas] = useState(MotoristaModel.getInitialData());
  const [pesquisa, setPesquisa] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [carregando, setCarregando] = useState(false);

  const [mensagem, setMensagem] = useState({
    mostrar: false,
    texto: "",
    tipo: "sucesso",
  });

  const [modal, setModal] = useState({ tipo: null, aberto: false, dado: null });

  const fecharMensagem = () => setMensagem({ ...mensagem, mostrar: false });
  const abrirModal = (tipo, dado = null) =>
    setModal({ tipo, aberto: true, dado });
  const fecharModal = () => setModal({ tipo: null, aberto: false, dado: null });

  const motoristasFiltrados = motoristas.filter((m) => {
    const matchesBusca =
      m.cpf.includes(pesquisa) ||
      m.placa.toUpperCase().includes(pesquisa.toUpperCase());

    if (filtroStatus === "Ativo") return matchesBusca && m.status === "Ativo";
    if (filtroStatus === "Inativo")
      return matchesBusca && m.status === "Inativo";
    return matchesBusca;
  });

  const salvarMotorista = async (dados) => {
    const motoristaSelecionado = modal.dado;
    fecharModal();
    setCarregando(true);

    try {
      await new Promise((r) => setTimeout(r, 1000));

      if (!motoristaSelecionado) {
        const cpfExiste = motoristas.some((m) => m.cpf === dados.cpf);
        if (cpfExiste) throw new Error("Este CPF já está cadastrado.");

        setMotoristas((prev) => [
          ...prev,
          { id: Date.now(), ...dados, status: "Ativo" },
        ]);
        setMensagem({
          mostrar: true,
          texto: "Cadastrado com sucesso!",
          tipo: "sucesso",
        });
      } else {
        const cpfDuplicado = motoristas.some(
          (m) => m.cpf === dados.cpf && m.id !== motoristaSelecionado.id,
        );
        if (cpfDuplicado)
          throw new Error(
            "O novo CPF informado já pertence a outro motorista.",
          );

        setMotoristas((prev) =>
          prev.map((m) =>
            m.id === motoristaSelecionado.id ? { ...m, ...dados } : m,
          ),
        );
        setMensagem({
          mostrar: true,
          texto: "Dados atualizados!",
          tipo: "sucesso",
        });
      }
    } catch (err) {
      setMensagem({
        mostrar: true,
        texto: err.message || "Erro ao salvar.",
        tipo: "erro",
      });
    } finally {
      setCarregando(false);
    }
  };

  const inativarMotorista = async () => {
    const id = modal.dado?.id;
    fecharModal();
    setCarregando(true);

    try {
      await new Promise((r) => setTimeout(r, 800));
      setMotoristas((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: "Inativo" } : m)),
      );
      setMensagem({
        mostrar: true,
        texto: "Motorista inativado!",
        tipo: "sucesso",
      });
    } catch {
      setMensagem({ mostrar: true, texto: "Erro ao inativar.", tipo: "erro" });
    } finally {
      setCarregando(false);
    }
  };

  return {
    motoristasFiltrados,
    pesquisa,
    setPesquisa,
    filtroStatus,
    setFiltroStatus,
    carregando,
    mensagem,
    fecharMensagem,
    modal,
    abrirModal,
    fecharModal,
    salvarMotorista,
    inativarMotorista,
    motoristas,
  };
}
