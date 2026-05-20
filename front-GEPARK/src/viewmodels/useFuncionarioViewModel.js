import { useState } from "react";
import { FuncionarioModel } from "../models/FuncionarioModel";
import { MENSAGENS } from "../utils/mensagens";

export function useFuncionarioViewModel() {
    const [funcionarios, setFuncionarios] = useState(FuncionarioModel.buscarTodos());
    const [turnos] = useState(FuncionarioModel.buscarTurnos());
    const [cargos] = useState(FuncionarioModel.buscarCargos());
    const [pesquisa, setPesquisa] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("todos");
    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState({ mostrar: false, texto: "", tipo: "sucesso" });
    const [modal, setModal] = useState({ tipo: null, aberto: false, dado: null });

    const fecharMensagem = () => setMensagem({ ...mensagem, mostrar: false });
    const abrirModal = (tipo, dado = null) => setModal({ tipo, aberto: true, dado });
    const fecharModal = () => setModal({ tipo: null, aberto: false, dado: null });

    const funcionariosFiltrados = funcionarios.filter((f) => {
        const nomeMatch = f.nome.toLowerCase().includes(pesquisa.toLowerCase());
        if (filtroStatus === "ativos") return nomeMatch && f.status === "Ativo";
        if (filtroStatus === "inativos") return nomeMatch && f.status === "Inativo";
        return nomeMatch;
    });

    const salvarFuncionario = async (dados) => {
        fecharModal();
        setCarregando(true);
        try {
            await new Promise(res => setTimeout(res, 1000)); 
            
            if (modal.tipo === "formulario" && !modal.dado) { 
                const novo = { id: Date.now(), ...dados, status: "Ativo" };
                setFuncionarios(prev => [...prev, novo]);
                setMensagem({ mostrar: true, texto: MENSAGENS.SUCESSO.CADASTRO, tipo: "sucesso" });
            } else { 
                setFuncionarios(prev => prev.map(f => f.id === modal.dado.id ? { ...f, ...dados } : f));
                setMensagem({ mostrar: true, texto: MENSAGENS.SUCESSO.ATUALIZACAO, tipo: "sucesso" });
            }
            fecharModal();
        } catch  {
            setMensagem({ mostrar: true, texto: MENSAGENS.ERRO.SALVAR, tipo: "erro" });
        } finally {
            setCarregando(false);
        }
    };

    const inativarFuncionario = async () => {
        const id = modal.dado.id;

        fecharModal();
        setCarregando(true);
        
        try {
            await new Promise(res => setTimeout(res, 800));
            setFuncionarios(prev => prev.map(f => f.id === id ? { ...f, status: "Inativo" } : f));
            setMensagem({ mostrar: true, texto: MENSAGENS.SUCESSO.INATIVACAO, tipo: "sucesso" });
            fecharModal();
        } catch (e) {
            console.error("Erro ao inativar funcionário:", e);
            setMensagem({ mostrar: true, texto: MENSAGENS.ERRO.SALVAR, tipo: "erro" });
        } finally {
            setCarregando(false);
        }
    };

    return {
        funcionariosFiltrados, pesquisa, setPesquisa, filtroStatus, setFiltroStatus,
        carregando, setCarregando, mensagem, fecharMensagem, modal, abrirModal, fecharModal,
        salvarFuncionario, inativarFuncionario, funcionarios, turnos, cargos
    };
}