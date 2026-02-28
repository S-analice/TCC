import "../styles/Funcionario.css";
import { useState } from "react";
import { User, Pencil, Trash2, Search } from "lucide-react"

import Carregando from "../components/Carregando";
import Mensagem from "../components/Mensagem";

import FuncionarioModal from "../components/FuncionarioModal";
import DeleteFuncionarioModal from "../components/DeleteFuncionarioModal";
import FotoModal from "../components/FotoModal";

export default function Funcionario() {

    const [funcionarios, setFuncionarios] = useState([
        {
            id: 1,
            nome: "João Silva",
            email: "joao.silva@email.com",
            senha: "123456",
            telefone: "41999991111",
            turno: "06:00 - 18:00",
            foto: "",
            cargo: "Equipe",
            status: "Ativo"
        },
        {
            id: 2,
            nome: "Maria Santos",
            email: "maria.santos@email.com",
            senha: "123456",
            telefone: "41988882222",
            turno: "18:00 - 06:00",
            foto: "",
            cargo: "Equipe",
            status: "Ativo"
        },
        {
            id: 3,
            nome: "Carlos Oliveira",
            email: "carlos.oliveira@email.com",
            senha: "123456",
            telefone: "41977773333",
            turno: "18:00 - 06:00",
            foto: "",
            cargo: "Equipe",
            status: "Ativo"
        }
    ]);
    const [pesquisa, setPesquisa] = useState("");

    const [carregando, setCarregando] = useState(false);

    const [mostrarMensagem, setMostrarMensagem] = useState(false);
    const [tipoMensagem, setTipoMensagem] = useState("sucesso");
    const [textoMensagem, setTextoMensagem] = useState("");

    const [mostrarModal, setMostrarModal] = useState(false);
    const [modoModal, setModoModal] = useState("adicionar");
    const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);

    const [mostrarDelete, setMostrarDelete] = useState(false);

    const [mostrarFoto, setMostrarFoto] = useState(false);

    const funcionariosFiltrados = funcionarios.filter((f) =>
        f.nome.toLowerCase().includes(pesquisa.toLowerCase())
    );

    const abrirAdicionar = () => {
        setModoModal("adicionar");
        setFuncionarioSelecionado(null);
        setMostrarModal(true);
    };

    const abrirEditar = (funcionario) => {
        setModoModal("editar");
        setFuncionarioSelecionado(funcionario);
        setMostrarModal(true);
    };

    const abrirDelete = (funcionario) => {
        setFuncionarioSelecionado(funcionario);
        setMostrarDelete(true);
    };

    const abrirFoto = (funcionario) => {
        setFuncionarioSelecionado(funcionario);
        setMostrarFoto(true);
    };

    const salvarFuncionario = (dados) => {

        setMostrarModal(false);
        setCarregando(true);
    
        setTimeout(() => {
    
            if (modoModal === "adicionar") {
                const novo = {
                    id: Date.now(),
                    ...dados
                };
    
                setFuncionarios([...f, novo]);
    
                setTipoMensagem("sucesso");
                setTextoMensagem("Funcionário cadastrado com sucesso!");
    
            } else if (modoModal === "editar") {
    
                setFuncionarios(
                    funcionarios.map(f =>
                        f.id === funcionarioSelecionado.id
                            ? { ...f, ...dados }
                            : f
                    )
                );
    
                setTipoMensagem("sucesso");
                setTextoMensagem("Funcionário atualizado com sucesso!");
    
            } else {
    
                setTipoMensagem("erro");
                setTextoMensagem("Não foi possível salvar funcionário!");
    
            }
    
            setCarregando(false);
            setMostrarMensagem(true);
    
        }, 2000);
    };

    const confirmarDelete = () => {

        setMostrarDelete(false);
        setCarregando(true);
    
        setTimeout(() => {
    
            if (funcionarioSelecionado.status === "Inativo") {
    
                setCarregando(false);
                setTipoMensagem("erro");
                setTextoMensagem("Este funcionário já está inativo.");
                setMostrarMensagem(true);
                return;
            }
    
            setFuncionarios(
                funcionarios.map(f =>
                    f.id === funcionarioSelecionado.id
                        ? { ...f, status: "Inativo" }
                        : f
                )
            );
    
            setCarregando(false);
            setTipoMensagem("sucesso");
            setTextoMensagem("Funcionário marcado como inativo!");
            setMostrarMensagem(true);
    
        }, 2000);
    };

    const formatarTelefone = (telefone) => {
        if (!telefone) return "";

        const numeros = telefone.replace(/\D/g, "");

        if (numeros.length === 11) {
            return numeros.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
        }

        return telefone;
    };


    return (
        <div className="funcionario-container">

            {carregando && <Carregando />}

            {mostrarMensagem && (
                <Mensagem
                    mensagem={textoMensagem}
                    tipo={tipoMensagem}
                    fechar={() => setMostrarMensagem(false)}
                />
            )}

            {mostrarModal && (
                <FuncionarioModal
                    modo={modoModal}
                    funcionario={funcionarioSelecionado}
                    fechar={() => setMostrarModal(false)}
                    salvar={salvarFuncionario}
                />
            )}

            {mostrarDelete && (
                <DeleteFuncionarioModal
                    funcionario={funcionarioSelecionado}
                    fechar={() => setMostrarDelete(false)}
                    confirmar={confirmarDelete}
                />
            )}

            {mostrarFoto && (
                <FotoModal
                    funcionario={funcionarioSelecionado}
                    fechar={() => setMostrarFoto(false)}
                />
            )}

            <h2 className="funcionario-subtitulo">Lista de Funcionários</h2>

            <div className="funcionario-topo">
                <div className="funcionario-busca">
                    <Search size={18} className="funcionario-busca-icone" />
                    <input
                        type="text"
                        placeholder="Pesquisar por nome"
                        value={pesquisa}
                        onChange={(e) => setPesquisa(e.target.value)}
                    />
                </div>
                <button onClick={abrirAdicionar}>+ Adicionar Funcionário</button>
            </div>

            <table className="funcionario-tabela">
                <thead>
                    <tr>
                        <th>Foto</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Senha</th>
                        <th>Telefone</th>
                        <th>Turno</th>
                        <th>Cargo</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {funcionariosFiltrados.map((f) => (
                        <tr key={f.id}>
                            <td>
                                <div className="funcionario-foto" onClick={() => abrirFoto(f)}>
                                    {f.foto ? (
                                        <img src={f.foto} alt="Foto Funcionário" />
                                    )
                                        :
                                        (<div className="funcionario-icone">
                                            <User size={20} />
                                        </div>)}
                                </div>
                            </td>
                            <td>{f.nome}</td>
                            <td>{f.email}</td>
                            <td>{"*".repeat(f.senha.length)}</td>
                            <td>{formatarTelefone(f.telefone)}</td>
                            <td>{f.turno}</td>
                            <td>{f.cargo}</td>
                            <td>
                                <span className={`status ${f.status.toLowerCase()}`}>
                                    {f.status}
                                </span>
                            </td>
                            <td>
                                <div className="funcionario-acoes">
                                    <button className="funcionario-atualizar" onClick={() => abrirEditar(f)}>
                                        <Pencil size={16} />
                                    </button>

                                    <button className="funcionario-remover" onClick={() => abrirDelete(f)}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}