import "../styles/Funcionario.css";
import { useState } from "react";

import Carregando from "../components/Carregando";
import Mensagem from "../components/Mensagem";

import FuncionarioModal from "../components/FuncionarioModal";
import DeleteFuncionarioModal from "../components/DeleteFuncionarioModal";

export default function Funcionario() {

    const [funcionarios, setFuncionarios] = useState([]);

    const [carregando, setCarregando] = useState(false);
    const [mostrarMensagem, setMostrarMensagem] = useState(false);
    const [textoMensagem, setTextoMensagem] = useState("");

    const [mostrarModal, setMostrarModal] = useState(false);
    const [modoModal, setModoModal] = useState("adicionar");
    const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);

    const [mostrarDelete, setMostrarDelete] = useState(false);
    

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

    const salvarFuncionario = (dados) => {
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
            setMostrarModal(false);
            setMostrarMensagem(true);
        }, 2000);
    };

    const confirmarDelete = () => {
        setCarregando(true);

        setTimeout(() => {
            setFuncionarios(
                funcionarios.filter(f => f.id !== funcionarioSelecionado.id)
            );

            setCarregando(false);
            setMostrarDelete(false);
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
                            <td></td>
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