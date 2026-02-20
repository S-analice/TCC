import "../styles/Patio.css";
import { useState } from "react";

import Carregando from "../components/Carregando";
import Mensagem from "../components/Mensagem";

import EntradaModal from "../components/EntradaModal";
import SaidaModal from "../components/SaidaModal";

export default function Patio({ usuario }) {

    const [registros, setRegistros] = useState([]);
    const [pesquisa, setPesquisa] = useState("");

    const [carregando, setCarregando] = useState(false);
    const [mostrarMensagem, setMostrarMensagem] = useState(false);
    const [textoMensagem, setTextoMensagem] = useState("");

    const [mostrarModal, setMostrarModal] = useState(false);
    const [modoModal, setModoModal] = useState("adicionar");
    const [registroSelecionado, setRegistroSelecionado] = useState(null);

    const [mostrarSaida, setMostrarSaida] = useState(false);

    const registrosFiltrados = registros.filter((r) =>
        r.cpf.includes(pesquisa) || r.placa.includes(pesquisa)
    );

    const abrirAdicionar = () => {
        setModoModal("adicionar");
        setRegistroSelecionado(null);
        setMostrarModal(true);
    };

    const abrirEditar = (registro) => {
        setModoModal("editar");
        setRegistroSelecionado(registro);
        setMostrarModal(true);
    };

    const abrirSaida = (motorista) => {
        setRegistroSelecionado(motorista);
        setMostrarSaida(true);
    };

    const salvarRegistro = (dados) => {
        setMostrarModal(false);
        setCarregando(true);

        setTimeout(() => {

            if (modoModal === "adicionar") {
                const novo = {
                    id: Date.now(),
                    ...dados
                };

                setRegistros([...registros, novo]);
                setTextoMensagem("Entrada registrada com sucesso!");
            } 
            
            else {
                setRegistros(
                    registros.map(r =>
                        r.id === registroSelecionado.id
                            ? { ...r, ...dados }
                            : r
                    )
                );
                setTextoMensagem("Entrada atualizado com sucesso!");
            }

            setCarregando(false);
            setMostrarMensagem(true);

        }, 2000);
    };

    const confirmarSaida = () => {
        setMostrarSaida(false);
        setCarregando(true);

        setTimeout(() => {
            setRegistros(
                registros.filter(r => r.id !== registroSelecionado.id)
            );

            setCarregando(false);
            setTextoMensagem("Saída confirmada com sucesso!");
            setMostrarMensagem(true);
        }, 2000);
    };

    return (
        <div className="patio-container">

            {carregando && <Carregando />}

            {mostrarMensagem && (
                <Mensagem
                    mensagem={textoMensagem}
                    fechar={() => setMostrarMensagem(false)}
                />
            )}

            {mostrarModal && (
                <EntradaModal
                    modo={modoModal}
                    registro={registroSelecionado}
                    usuario={usuario}
                    fechar={() => setMostrarModal(false)}
                    salvar={salvarRegistro}
                />
            )}

            {mostrarSaida && (
                    <SaidaModal
                        registro={registroSelecionado}
                        fechar={() => setMostrarSaida(false)}
                        confirmar={confirmarSaida}
                />
            )}

            <div className="patio-topo">
                <h2>Controle de Pátio</h2>
                <button onClick={abrirAdicionar}>+ Adicionar</button>
            </div>

            <input
                type="text"
                placeholder="Pesquisar por CPF ou Placa"
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                className="patio-pesquisa"
            />

            <div className="patio-linha"></div>

            <table className="patio-tabela">
                <thead>
                    <tr>
                        <th>CPF</th>
                        <th>Placa</th>
                        <th>Entrada</th>
                        <th>Funcionário</th>
                        <th>Ações</th>
                    </tr>
                </thead>

                <tbody>
                    {registrosFiltrados.map((r) => (
                        <tr key={r.id}>
                            <td>{r.cpf}</td>
                            <td>{r.placa}</td>
                            <td>{r.entrada}</td>
                            <td>{r.funcionario}</td>
                            <td>
                                <button className="motorista-atualizar" onClick={() => abrirEditar(r)}>Atualizar</button>
                                <button className="motorista-remover"  onClick={() => abrirSaida(r)}>Saída</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}