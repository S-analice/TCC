import "../styles/Empresa.css";
import { Pencil, Trash2, Search } from "lucide-react";
import { useEmpresaViewModel } from "../viewmodels/useEmpresaViewModel";
import { EmpresaModel } from "../models/EmpresaModel";
import EmpresaModal from "../components/EmpresaModal";
import DeleteEmpresaModal from "../components/DeleteEmpresaModal";
import Carregando from "../components/Carregando";
import Mensagem from "../components/Mensagem";

export default function Empresa() {
    const vm = useEmpresaViewModel();

    return (
        <div className="e-container">
            {vm.carregando && <Carregando />}
            {vm.mensagem.mostrar && <Mensagem mensagem={vm.mensagem.texto} tipo={vm.mensagem.tipo} fechar={vm.fecharMensagem} />}

            <h2 className="e-subtitulo">Lista de Empresas</h2>

            <div className="e-topo">
                <div className="e-filtro-container">
                    <div className="e-busca">
                        <Search size={18} className="e-busca-icone" />
                        <input placeholder="Buscar por Nome ou CNPJ..." value={vm.pesquisa} onChange={(e) => vm.setPesquisa(e.target.value)} />
                    </div>
                    <select className="e-filtro" value={vm.filtroStatus} onChange={(e) => vm.setFiltroStatus(e.target.value)}>
                        <option value="todos">Todos</option>
                        <option value="ativos">Ativos</option>
                        <option value="inativos">Inativos</option>
                    </select>
                </div>
                <button onClick={() => vm.abrirModal("formulario")}>+ Adicionar Empresa</button>
            </div>

            <table className="e-tabela">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {vm.empresasFiltradas.map((e) => (
                        <tr key={e.id}>
                            <td>{EmpresaModel.getNomeCompleto(e)}</td>
                            <td><span className={`status ${e.status.toLowerCase()}`}>{e.status}</span></td>
                            <td>
                                <div className="funcionario-acoes">
                                    <button onClick={() => vm.abrirModal("formulario", e)} className="funcionario-atualizar"><Pencil size={16}/></button>
                                    <button onClick={() => vm.abrirModal("delete", e)} className="funcionario-remover"><Trash2 size={16}/></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {vm.modal.aberto && vm.modal.tipo === "formulario" && (
                <EmpresaModal 
                    modo={vm.modal.dado ? "editar" : "adicionar"} 
                    empresa={vm.modal.dado} 
                    fechar={vm.fecharModal} 
                    salvar={vm.salvarEmpresa} 
                />
            )}

            {vm.modal.aberto && vm.modal.tipo === "delete" && (
                <DeleteEmpresaModal empresa={vm.modal.dado} fechar={vm.fecharModal} confirmar={vm.inativarEmpresa} />
            )}
        </div>
    );
}