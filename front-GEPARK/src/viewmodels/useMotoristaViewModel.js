import { useState } from "react";
import { MotoristaModel } from "../models/MotoristaModel";

const empresasMock = [
  { id: 1, nome: "Transportadora IFPR" },
  { id: 2, nome: "Logística TI" }
];

const conveniosMock = [
  { id: "1", nome: "Novo Cliente" },
  { id: "2", nome: "Premium " },
  { id: "3", nome: "Sem Convênio" }
];

export function useMotoristaViewModel() {
  const [motoristas, setMotoristas] = useState(MotoristaModel.getInitialData());
  const [pesquisa, setPesquisa] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState({ mostrar: false, texto: "", tipo: "sucesso" });
  const [modal, setModal] = useState({ tipo: null, aberto: false, dado: null });

  const fecharMensagem = () => setMensagem({ ...mensagem, mostrar: false });
  const abrirModal = (tipo, dado = null) => setModal({ tipo, aberto: true, dado });
  const fecharModal = () => setModal({ tipo: null, aberto: false, dado: null });

  const motoristasFiltrados = motoristas.filter((m) => {
    const matchesBusca = m.cpf.includes(pesquisa) || m.placa.toUpperCase().includes(pesquisa.toUpperCase());
    const matchStatus = filtroStatus === "todos" || m.status === filtroStatus;
    return matchesBusca && matchStatus;
  });

  const salvarMotorista = async (dados) => {
    fecharModal();
    setCarregando(true);

    try {
      await new Promise((r) => setTimeout(r, 800));

      const convNome = conveniosMock.find(c => c.id === dados.convenio_id)?.nome || "N/A";
      
      const payload = {
        ...dados,
        convenio_nome: convNome,
        empresa_nome: dados.autonomo ? "Autônomo" : dados.empresa_nome
      };

      if (!modal.dado) {
        if (motoristas.some(m => m.cpf === dados.cpf)) throw new Error("CPF já cadastrado.");
        setMotoristas(prev => [...prev, { id: Date.now(), ...payload, status: "Ativo" }]);
      } else {
        setMotoristas(prev => prev.map(m => m.id === modal.dado.id ? { ...m, ...payload } : m));
      }

      setMensagem({ mostrar: true, texto: "Operação realizada!", tipo: "sucesso" });
    } catch (err) {
      setMensagem({ mostrar: true, texto: err.message, tipo: "erro" });
    } finally {
      setCarregando(false);
    }
  };

  return {
    motoristasFiltrados, pesquisa, setPesquisa, filtroStatus, setFiltroStatus,
    carregando, mensagem, fecharMensagem, modal, abrirModal, fecharModal,
    salvarMotorista, empresas: empresasMock, convenios: conveniosMock
  };
} 