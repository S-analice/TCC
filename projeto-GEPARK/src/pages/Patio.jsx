import "../styles/Patio.css";
import { LogIn, LogOut, Search, Pencil, Download } from "lucide-react"

import { useState } from "react";

import Carregando from "../components/Carregando";
import Mensagem from "../components/Mensagem";

import EntradaModal from "../components/EntradaModal";
import SaidaModal from "../components/SaidaModal";

export default function Patio({ funcionario }) {

    const [registros, setRegistros] = useState([
        {
            id: 1,
            cpf: "12345678900",
            placa: "ABC1234",
            dataEntrada: "2026-02-23T08:30:00",
            dataSaida: null,
            funcionarioEntrada: "João Silva",
            funcionarioSaida: null,
            tipo: "Entrada",
            status: "No Pátio"
        },
        {
            id: 2,
            cpf: "98765432100",
            placa: "DEF5678",
            dataEntrada: "2026-02-23T09:15:00",
            dataSaida: null,
            funcionarioEntrada: "Maria Santos",
            funcionarioSaida: null,
            tipo: "Entrada",
            status: "No Pátio"
        },
        {
            id: 3,
            cpf: "45678912300",
            placa: "GHI9012",
            dataEntrada: "2026-02-23T07:40:00",
            dataSaida: "2026-02-23T11:10:00",
            funcionarioEntrada: "Carlos Oliveira",
            funcionarioSaida: "Sr Cabeça de Batata",
            tipo: "Saída",
            status: "Finalizado"

        }
    ]);
    const [pesquisa, setPesquisa] = useState("");

    const [carregando, setCarregando] = useState(false);

    const [mostrarMensagem, setMostrarMensagem] = useState(false);
    const [tipoMensagem, setTipoMensagem] = useState("sucesso");
    const [textoMensagem, setTextoMensagem] = useState("");

    const [mostrarModal, setMostrarModal] = useState(false);
    const [modoModal, setModoModal] = useState("adicionar");
    const [registroSelecionado, setRegistroSelecionado] = useState(null);

    const [mostrarSaida, setMostrarSaida] = useState(false);

    const registrosFiltrados = registros.filter((r) =>
        r.status === "No Pátio" &&
        (r.cpf.includes(pesquisa) || r.placa.includes(pesquisa))
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

    const abrirSaida = (registro) => {
        setRegistroSelecionado(registro);
        setMostrarSaida(true);
    };

    const salvarRegistro = (dados) => {
        setMostrarModal(false);
        setCarregando(true);

        setTimeout(() => {

            if (modoModal === "adicionar") {
                const novo = {
                    id: Date.now(),
                    ...dados,
                    saida: null,
                    tipo: "Entrada",
                    status: "No Pátio",
                };

                setRegistros([...registros, novo]);

                setTipoMensagem("sucesso");
                setTextoMensagem("Entrada registrada com sucesso!");
            } else if (modoModal === "editar") {
                setRegistros(
                    registros.map(r =>
                        r.id === registroSelecionado.id
                            ? { ...r, ...dados }
                            : r
                    )
                );

                setTipoMensagem("sucesso");
                setTextoMensagem("Entrada atualizado com sucesso!");

            } else {
    
                setTipoMensagem("erro");
                setTextoMensagem("Não foi possível salvar esse registro!");
    
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
                registros.map(r =>
                    r.id === registroSelecionado.id
                        ? {
                            ...r,
                            tipo: "Saída",
                            status: "Finalizado"
                        }
                        : r
                )
            );

            setCarregando(false);
            setTextoMensagem("Saída confirmada com sucesso!");
            setMostrarMensagem(true);
        }, 2000);
    };

    function exportarCSV() {
        setCarregando(true);

        setTimeout(() => {

            setCarregando(false);

            setTipoMensagem("sucesso")
            setTextoMensagem("Registros exportado com sucesso!");
            setMostrarMensagem(true);

        }, 2000);

    }

    const formatarCPF = (cpf) => {
        if (!cpf) return "";
        const numeros = cpf.replace(/\D/g, "");
        return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    };

    const formatarPlaca = (placa) => {
        if (!placa) return "";
        const valor = placa.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

        if (valor.length === 7) {
            return valor.replace(/([A-Z]{3})(\d[A-Z]\d{2}|\d{4})/, "$1-$2");
        }

        return placa;
    };

    function formatarData(data) {
        return new Date(data).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    return (
        <div className="patio-container">

            {carregando && <Carregando />}

            {mostrarMensagem && (
                <Mensagem
                    mensagem={textoMensagem}
                    tipo={tipoMensagem}
                    fechar={() => setMostrarMensagem(false)}
                />
            )}

            {mostrarModal && (
                <EntradaModal
                    modo={modoModal}
                    registro={registroSelecionado}
                    funcionario={funcionario}
                    fechar={() => setMostrarModal(false)}
                    salvar={salvarRegistro}
                />
            )}

            {mostrarSaida && (
                <SaidaModal
                    registro={registroSelecionado}
                    funcionario={funcionario}
                    fechar={() => setMostrarSaida(false)}
                    confirmar={confirmarSaida}
                />
            )}

            <h2 className="patio-subtitulo">Controle de Pátio</h2>

            <div className="patio-topo">

                <div className="patio-busca">
                    <Search size={18} className="patio-busca-icone" />
                    <input
                        type="text"
                        placeholder="Pesquisar por cpf ou placa"
                        value={pesquisa}
                        onChange={(e) => setPesquisa(e.target.value)}
                    />
                </div>

                <div className="patio-botoes">
                    <button className="patio-topo-button-verde" onClick={abrirAdicionar}>
                        <LogIn size={18} />Registrar Entrada
                    </button>

                    <button className="patio-topo-button-amarelo" onClick={exportarCSV}>
                        <Download size={18} />Exportar CSV
                    </button>
                </div>

            </div>

            <table className="patio-tabela">
                <thead>
                    <tr>
                        <th>CPF</th>
                        <th>Placa</th>
                        <th>Entrada</th>
                        <th>Funcionário Entrada</th>
                        <th>Ações</th>
                    </tr>
                </thead>

                <tbody>
                    {registrosFiltrados.map((r) => (
                        <tr key={r.id}>
                            <td>{formatarCPF(r.cpf)}</td>
                            <td>{formatarPlaca(r.placa)}</td>
                            <td>{formatarData(r.dataEntrada)}</td>
                            <td>{r.funcionarioEntrada}</td>
                            <td>
                                <div className="patio-acoes">
                                    <button className="patio-atualizar" onClick={() => abrirEditar(r)}>
                                        <Pencil size={16} />
                                    </button>

                                    <button className="patio-remover" onClick={() => abrirSaida(r)}>
                                        <LogOut size={16} />
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