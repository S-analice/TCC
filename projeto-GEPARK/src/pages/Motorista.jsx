import "../styles/Motorista.css";
import { useState } from "react";
import { Pencil, Trash2, Search } from "lucide-react"

import Carregando from "../components/Carregando";
import Mensagem from "../components/Mensagem";

import MotoristaModal from "../components/MotoristaModal";
import DeleteMotoristaModal from "../components/DeleteMotoristaModal";

export default function Motorista() {

    const [motoristas, setMotoristas] = useState([
        {
            id: 1,
            cpf: "12345678900",
            placa: "ABC1234",
            telefone: "41999991111",
            cnpj: "12345678000100",
            convenio: "Convênio A"

        },
        {
            id: 2,
            cpf: "98765432100",
            placa: "DEF5678",
            telefone: "41988882222",
            cnpj: "98765432000100",
            convenio: "Convênio B"
        },
        {
            id: 3,
            cpf: "45678912300",
            placa: "GHI9012",
            telefone: "41977773333",
            cnpj: "45678912000100",
            convenio: "Sem Convênio"
        }
    ]);
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


    const formatarCPF = (cpf) => {
        if (!cpf) return "";
        const numeros = cpf.replace(/\D/g, "");
        return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    };

    const formatarCNPJ = (cnpj) => {
        if (!cnpj) return "";
        const numeros = cnpj.replace(/\D/g, "");
        return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    };

    const formatarTelefone = (telefone) => {
        if (!telefone) return "";
        const numeros = telefone.replace(/\D/g, "");

        if (numeros.length === 11) {
            return numeros.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
        }
        return telefone;
    };

    const formatarPlaca = (placa) => {
        if (!placa) return "";
        const valor = placa.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

        if (valor.length === 7) {
            return valor.replace(/([A-Z]{3})(\d[A-Z]\d{2}|\d{4})/, "$1-$2");
        }

        return placa;
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

            <h2 className="motorista-subtitulo">Lista de Motoristas</h2>

            <div className="motorista-topo">
                <div className="motorista-busca">
                    <Search size={18} className="motorista-busca-icone" />
                    <input
                        type="text"
                        placeholder="Pesquisar por cpf ou placa"
                        value={pesquisa}
                        onChange={(e) => setPesquisa(e.target.value)}
                    />
                </div>
                <button onClick={abrirAdicionar}>+ Adicionar Motorista</button>
            </div>

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
                            <td>{formatarCPF(m.cpf)}</td>
                            <td>{formatarPlaca(m.placa)}</td>
                            <td>{formatarTelefone(m.telefone)}</td>
                            <td>{formatarCNPJ(m.cnpj)}</td>
                            <td>
                                <span className={`convenio ${m.convenio === "Convênio A"
                                        ? "a"
                                        : m.convenio === "Convênio B"
                                            ? "b"
                                            : "sem"
                                    }`}>
                                    {m.convenio}
                                </span>
                            </td>
                            <td >
                                <div className="motorista-acoes">
                                    <button className="motorista-atualizar" onClick={() => abrirEditar(m)}>
                                        <Pencil size={16} />
                                    </button>

                                    <button className="motorista-remover" onClick={() => abrirDelete(m)}>
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