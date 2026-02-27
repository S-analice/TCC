import "../styles/Patio.css";
import { useState } from "react";
import { LogIn, LogOut, Search, Pencil } from "lucide-react"

import Carregando from "../components/Carregando";
import Mensagem from "../components/Mensagem";

import EntradaModal from "../components/EntradaModal";
import SaidaModal from "../components/SaidaModal";

export default function Patio({ usuario }) {

    const [registros, setRegistros] = useState([
        {
            id: 1,
            cpf: "12345678900",
            placa: "ABC1234",
            entrada: "2026-02-23T08:30:00",
            saida: null,
            funcionario: "João Silva",
            tipo: "Entrada",
            status: "No Pátio"
        },
        {
            id: 2,
            cpf: "98765432100",
            placa: "DEF5678",
            entrada: "2026-02-23T09:15:00",
            saida: null,
            funcionario: "Maria Santos",
            tipo: "Entrada",
            status: "No Pátio"
        },
        {
            id: 3,
            cpf: "45678912300",
            placa: "GHI9012",
            entrada: "2026-02-23T07:40:00",
            saida: "2026-02-23T11:10:00",
            funcionario: "Carlos Oliveira",
            tipo: "Saída",
            status: "Finalizado"

        }
    ]);
    const [pesquisa, setPesquisa] = useState("");

    const [carregando, setCarregando] = useState(false);
    const [mostrarMensagem, setMostrarMensagem] = useState(false);
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
                    ...dados,
                    tipo: "Entrada",
                    status: "No Pátio",
                    saida: null
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
                <button onClick={abrirAdicionar}><LogIn size={18}/> Registrar Entrada</button>
            </div>

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
                            <td>{formatarCPF(r.cpf)}</td>
                            <td>{formatarPlaca(r.placa)}</td>
                            <td>{formatarData(r.entrada)}</td>
                            <td>{r.funcionario}</td>
                            <td>
                            <div className="patio-acoes">
                                    <button className="patio-atualizar" onClick={() => abrirEditar(r)}>
                                        <Pencil size={16}/>
                                    </button>

                                    <button className="patio-remover" onClick={() => abrirSaida(r)}>
                                        <LogOut size={16}/>
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