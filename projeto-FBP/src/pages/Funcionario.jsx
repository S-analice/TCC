import "../styles/Funcionario.css";
import { useState } from "react";

import Carregando from "../components/Carregando";
import Mensagem from "../components/Mensagem";

import FuncionarioModal from "../components/FuncionarioModal";
import DeleteFuncionarioModal from "../components/DeleteFuncionarioModal";
import FotoModal from "../components/FotoModal";

export default function Funcionario() {

    const [funcionarios, setFuncionarios] = useState([]);

    const [carregando, setCarregando] = useState(false);
    const [mostrarMensagem, setMostrarMensagem] = useState(false);
    const [textoMensagem, setTextoMensagem] = useState("");

    const [mostrarModal, setMostrarModal] = useState(false);
    const [modoModal, setModoModal] = useState("adicionar");
    const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);

    const [mostrarDelete, setMostrarDelete] = useState(false);
    
    const [mostrarFoto, setMostrarFoto] = useState(false);

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

                setFuncionarios([...funcionarios, novo]);
                setTextoMensagem("Funcionário cadastrado com sucesso!");
            } 
            
            else {
                setFuncionarios(
                    funcionarios.map(f =>
                        f.id === funcionarioSelecionado.id
                            ? { ...f, ...dados }
                            : f
                    )
                );
                setTextoMensagem("Funcionário atualizado com sucesso!");
            }

            setCarregando(false);
            setMostrarMensagem(true);
        }, 2000);
    };

    const confirmarDelete = () => {
        setMostrarDelete(false);
        setCarregando(true);

        setTimeout(() => {
            setFuncionarios(
                funcionarios.filter(f => f.id !== funcionarioSelecionado.id)
            );

            setCarregando(false);
            setTextoMensagem("Funcionário removido com sucesso!");
            setMostrarMensagem(true);
        }, 2000);
    };

    return (
        <div className="funcionario-container">

            {carregando && <Carregando />}

            {mostrarMensagem && (
                <Mensagem
                    mensagem={textoMensagem}
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

            <div className="funcionario-topo">
                <h2>Lista de Funcionários</h2>
                <button onClick={abrirAdicionar}>+ Adicionar</button>
            </div>

            <div className="funcionario-linha"></div>

            <table className="funcionario-tabela">
                <thead>
                    <tr>
                        <th>Foto</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Senha</th>
                        <th>Telefone</th>
                        <th>Turno</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {funcionarios.map((f) => (
                        <tr key={f.id}>
                            <td>
                                <div className="funcionario-foto" onClick={() => abrirFoto(f)}>
                                    {f.foto ? (
                                        <img src={f.foto} alt="Foto Funcionário" />
                                    )
                                    : 
                                    (<div className="funcionario-icone">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 10C12.2091 10 14 8.20914 14 6C14 3.79086 12.2091 2 10 2C7.79086 2 6 3.79086 6 6C6 8.20914 7.79086 10 10 10Z" fill="#7C7C7C"/>
                                            <path d="M10 12C5.58172 12 2 13.7909 2 16V18H18V16C18 13.7909 14.4183 12 10 12Z" fill="#7C7C7C"/>
                                        </svg> 
                                    </div>)}
                                </div>
                            </td>
                            <td>{f.nome}</td>
                            <td>{f.email}</td>
                            <td>{"*".repeat(f.senha.length)}</td>
                            <td>{f.telefone}</td>
                            <td>{f.turno}</td>
                            <td >
                                <button className="funcionario-atualizar" onClick={() => abrirEditar(f)}>Atualizar</button>
                                <button className="funcionario-remover" onClick={() => abrirDelete(f)}>Remover</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}