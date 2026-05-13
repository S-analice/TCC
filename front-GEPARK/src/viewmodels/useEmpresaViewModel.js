import { useState } from "react";
import { EmpresaModel } from "../models/EmpresaModel";

export function useEmpresaViewModel() {
    const [empresas, setEmpresas] = useState(EmpresaModel.buscarTodas());
    const [pesquisa, setPesquisa] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("todos");
    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState({ mostrar: false, texto: "", tipo: "sucesso" });
    const [modal, setModal] = useState({ tipo: null, aberto: false, dado: null });

    const fecharMensagem = () => setMensagem({ ...mensagem, mostrar: false });
    const abrirModal = (tipo, dado = null) => setModal({ tipo, aberto: true, dado });
    const fecharModal = () => setModal({ tipo: null, aberto: false, dado: null });

    const empresasFiltradas = empresas.filter((e) => {
        const termo = pesquisa.toLowerCase();
        const matchNome = e.nome.toLowerCase().includes(termo);
        const matchCnpj = e.cnpj.includes(termo);
        const matchStatus = filtroStatus === "todos" || e.status === (filtroStatus === "ativos" ? "Ativo" : "Inativo");
        return (matchNome || matchCnpj) && matchStatus;
    });

   const salvarEmpresa = async (dados) => {
    fecharModal();
    setCarregando(true);
    try {
        await new Promise(res => setTimeout(res, 800));

        const siglas = { "1": "PR", "2": "SP", "3": "SC" };
        const estado_sigla = siglas[dados.estado_id] || "";

        if (!modal.dado) { 
            const novo = { 
                id: Date.now(), 
                ...dados, 
                estado_sigla, 
                status: "Ativo" 
            };
            setEmpresas(prev => [...prev, novo]);
        } else { 
            setEmpresas(prev => prev.map(e => 
                e.id === modal.dado.id ? { ...e, ...dados, estado_sigla } : e
            ));
        }
        setMensagem({ mostrar: true, texto: "Operação realizada!", tipo: "sucesso" });
    } catch {
        setMensagem({ mostrar: true, texto: "Erro ao salvar.", tipo: "erro" });
    } finally {
        setCarregando(false);
    }
};
    const inativarEmpresa = async () => {
        setCarregando(true);
        try {
            await new Promise(res => setTimeout(res, 500));
            setEmpresas(prev => prev.map(e => e.id === modal.dado.id ? { ...e, status: "Inativo" } : e));
            fecharModal();
        } finally { setCarregando(false); }
    };

    return {
        empresasFiltradas, pesquisa, setPesquisa, filtroStatus, setFiltroStatus,
        carregando, mensagem, fecharMensagem, modal, abrirModal, fecharModal,
        salvarEmpresa, inativarEmpresa
    };
}