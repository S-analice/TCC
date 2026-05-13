import "../styles/Motorista.css";
import { Pencil, Trash2, Search } from "lucide-react";
import { useMotoristaViewModel } from "../viewmodels/useMotoristaViewModel";
import { formatarCPF, formatarPlaca, formatarTelefone, formatarCNPJ } from "../utils/formatadores";
import Carregando from "../components/Carregando";
import Mensagem from "../components/Mensagem";
import MotoristaModal from "../components/MotoristaModal";
import DeleteMotoristaModal from "../components/DeleteMotoristaModal";

export default function Motorista() {
    const vm = useMotoristaViewModel();

    return (
        <div className="motorista-container">
            {vm.carregando && <Carregando />}

            {vm.mensagem.mostrar && (
                <Mensagem
                    mensagem={vm.mensagem.texto}
                    modo={vm.mensagem.tipo}
                    fechar={vm.fecharMensagem}
                />
            )}

            {vm.modal.aberto && vm.modal.tipo === "formulario" && (
                <MotoristaModal
                    modo={vm.modal.dado ? "editar" : "adicionar"}
                    motorista={vm.modal.dado}
                    fechar={vm.fecharModal}
                    salvar={vm.salvarMotorista}
                    empresas={vm.empresas}
                    convenios={vm.convenios}
                />
            )}

            {vm.modal.aberto && vm.modal.tipo === "delete" && (
                <DeleteMotoristaModal
                    motorista={vm.modal.dado}
                    fechar={vm.fecharModal}
                    confirmar={vm.inativarMotorista}
                />
            )}

            <h2 className="motorista-subtitulo">Lista de Motoristas</h2>

            <div className="motorista-topo">
                <div className="motorista-filtro-container">
                    <div className="motorista-busca">
                        <Search size={18} className="motorista-busca-icone" />
                        <input
                            type="text"
                            placeholder="Pesquisar por CPF ou Placa"
                            value={vm.pesquisa}
                            onChange={(e) => vm.setPesquisa(e.target.value)}
                        />
                    </div>
                    <select className="motorista-filtro" value={vm.filtroStatus} onChange={(e) => vm.setFiltroStatus(e.target.value)}>
                        <option value="todos">Todos</option>
                        <option value="Ativo">Ativos</option>
                        <option value="Inativo">Inativos</option>
                    </select>
                </div>
                <button className="verde-botao" onClick={() => vm.abrirModal("formulario")}>
                    + Adicionar Motorista
                </button>
            </div>

            <table className="motorista-tabela">
                <thead>
                    <tr>
                        <th>CPF</th>
                        <th>Placa</th>
                        <th>Telefone</th>
                        <th>Empresa</th>
                        <th>Convênio</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {vm.motoristasFiltrados.map((m) => (
                        <tr key={m.id}>
                            <td>{formatarCPF(m.cpf)}</td>
                            <td>{formatarPlaca(m.placa)}</td>
                            <td>{formatarTelefone(m.telefone)}</td>
                            <td>{m.empresa_nome || "Autônomo"}</td>
                            <td>
                                <span className={`convenio ${m.convenio.toLowerCase().replace(/\s+/g, "-")}`}>
                                    {m.convenio}
                                </span>
                            </td>
                            <td>
                                <span className={`status ${m.status.toLowerCase()}`}>
                                    {m.status}
                                </span>
                            </td>
                            <td>
                                <div className="motorista-acoes">

                                    <button
                                        className="motorista-atualizar"
                                        onClick={() => vm.abrirModal("formulario", m)}
                                    >
                                        <Pencil size={16} />
                                    </button>


                                    {m.status === "Ativo" && (
                                        <button
                                            className="motorista-remover"
                                            onClick={() => vm.abrirModal("delete", m)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}