import "../styles/Motorista.css";
import { useState } from "react";

import Carregando from "../components/Carregando";
import Mensagem from "../components/Mensagem";

import MotoristaModal from "../components/MotoristaModal";
import DeleteMotoristaModal from "../components/DeleteMotoristaModal";

export default function Motorista() {

    const [motoristas, setMotoristas] = useState([]);
    const [pesquisa, setPesquisa] = useState("");

    const [carregando, setCarregando] = useState(false);
    const [mostrarMensagem, setMostrarMensagem] = useState(false);
    const [textoMensagem, setTextoMensagem] = useState("");

    const [mostrarModal, setMostrarModal] = useState(false);
    const [modoModal, setModoModal] = useState("adicionar");
    const [motoristaSelecionado, setMotoristaSelecionado] = useState(null);

    const [mostrarDelete, setMostrarDelete] = useState(false);

    const motoristasFiltrados = motoristas.filter((m) =>
        m.cpf.includes(pesquisa) || m.placa.includes(pesquisa)
    );

    const abrirAdicionar = () => {
        setModoModal("adicionar");
        setMotoristaSelecionado(null);
        setMostrarModal(true);
    };

    const abrirEditar = (motorista) => {
        setModoModal("editar");
        setMotoristaSelecionado(motorista);
        setMostrarModal(true);
    };

    const abrirDelete = (motorista) => {
        setMotoristaSelecionado(motorista);
        setMostrarDelete(true);
    };

    const salvarMotorista = (dados) => {
        setMostrarModal(false);
        setCarregando(true);

        setTimeout(() => {
            if (modoModal === "adicionar") {

                const novo = {
                    id: Date.now(),
                    ...dados
                };

                setMotoristas([...motoristas, novo]);
                setTextoMensagem("Motorista cadastrado com sucesso!");
            } 
            
            else {
                setMotoristas(
                    motoristas.map(m =>
                        m.id === motoristaSelecionado.id
                            ? { ...m, ...dados }
                            : m
                    )
                );
                setTextoMensagem("Motorista atualizado com sucesso!");
            }

            setCarregando(false);
            setMostrarMensagem(true);
        }, 2000);
    };

    const confirmarDelete = () => {
        setMostrarDelete(false);
        setCarregando(true);

        setTimeout(() => {
            setMotoristas(
                motoristas.filter(m => m.id !== motoristaSelecionado.id)
            );

            setCarregando(false);
            setTextoMensagem("Motorista removido com sucesso!");
            setMostrarMensagem(true);
        }, 2000);
    };

    return (
        <div className="motorista-container">

            {carregando && <Carregando />}

            {mostrarMensagem && (
                <Mensagem
                    mensagem={textoMensagem}
                    fechar={() => setMostrarMensagem(false)}
                />
            )}

            {mostrarModal && (
                <MotoristaModal
                    modo={modoModal}
                    motorista={motoristaSelecionado}
                    fechar={() => setMostrarModal(false)}
                    salvar={salvarMotorista}
                />
            )}

            {mostrarDelete && (
                <DeleteMotoristaModal
                    motorista={motoristaSelecionado}
                    fechar={() => setMostrarDelete(false)}
                    confirmar={confirmarDelete}
                />
            )}

            <div className="motorista-topo">
                <h2>Lista de Motoristas</h2>
                <button onClick={abrirAdicionar}>+ Adicionar</button>
            </div>

            <input
                type="text"
                placeholder="Pesquisar por CPF ou Placa"
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                className="motorista-pesquisa"
            />

            <div className="motorista-linha"></div>

            <table className="motorista-tabela">
                <thead>
                    <tr>
                        <th>CPF</th>
                        <th>Placa</th>
                        <th>Telefone</th>
                        <th>CNPJ</th>
                        <th>Convênio</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {motoristasFiltrados.map((m) => (
                        <tr key={m.id}>
                            <td>{m.cpf}</td>
                            <td>{m.placa}</td>
                            <td>{m.telefone}</td>
                            <td>{m.cnpj}</td>
                            <td>{m.convenio}</td>
                            <td >
                                <button className="motorista-atualizar" onClick={() => abrirEditar(m)}>Atualizar</button>
                                <button className="motorista-remover" onClick={() => abrirDelete(m)}>Remover</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}