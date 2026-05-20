import React, { useState } from "react";
import { User, House, Users, Briefcase, Truck, FileText, Mail, Phone, Clock, LogOut } from "lucide-react";
import "../styles/componentes/Barra.css";
import { formatarTelefone } from "../utils/formatadores"; 
import { turnosMock } from "../models/FuncionarioModel";

export default function Barra({ funcionario, paginaAtual, irParaPagina, voltarParaLogin, children }) {
    const [mostrarMenuFuncionario, setMostrarMenuFuncionario] = useState(false);
    const dadosTurno = turnosMock.find(t => t.id === funcionario?.turnoId);

    return (
        <div className="barra-container">
            <div className="barra-superior">
                <button onClick={() => setMostrarMenuFuncionario(!mostrarMenuFuncionario)} className="barra-botao">
                    <div className="barra-icon">
                        <User size={20}/>
                    </div>
                    <span>{funcionario?.nome}</span>
                </button>

                {mostrarMenuFuncionario && (
                    <div className="menu-funcionario">
                        <div className="menu-funcionario-topo">
                            <div className="avatar-funcionario">
                                {funcionario?.foto ? 
                                    <img src={funcionario.foto} alt="Foto Funcionário" className="avatar-img"/> : 
                                    <div className="avatar-icone"><User size={28}/></div>
                                }
                            </div>
                            <div className="funcionario-info">
                                <strong>{funcionario?.nome}</strong>
                                <span>{funcionario?.cargo}</span>
                            </div>
                        </div>

                        <div className="menu-funcionario-detalhes">
                            <div className="detalhe">
                                <Mail size={20} />
                                <span>{funcionario?.email}</span>
                            </div>
                            
                            <div className="detalhe">
                                <Phone size={20} />
                                <span>{formatarTelefone(funcionario?.telefone)}</span>
                            </div>
                            <div className="detalhe">
                                <Clock size={20} />
                                <span>
                                    {dadosTurno ? 
                                        `${dadosTurno.inicio} às ${dadosTurno.fim}` : 
                                        "Não definido"}
                                </span>
                            </div>
                        </div>

                        <div className="menu-funcionario-acoes">
                            <button className="botao-sair" onClick={voltarParaLogin}>
                                <LogOut size={20} />Sair do sistema
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="barra-navegacao">
                <div className="logo-container">
                    <img src="/logo.png" alt="Logo GEPARK" className="logo-img" />    
                </div>

                <nav className="menu-navegacao">
                    <button className={paginaAtual === "home" ? "ativo" : ""} onClick={() => irParaPagina("home")}><House size={20}/>Home</button>
                    <button className={paginaAtual === "funcionario" ? "ativo" : ""} onClick={() => irParaPagina("funcionario")}><Users size={20}/>Funcionário</button>
                    <button className={paginaAtual === "empresa" ? "ativo" : ""} onClick={() => irParaPagina("empresa")}><Briefcase size={20}/>Empresa</button>
                    <button className={paginaAtual === "motorista" ? "ativo" : ""} onClick={() => irParaPagina("motorista")}><User size={20}/>Motorista</button>
                    <button className={paginaAtual === "patio" ? "ativo" : ""} onClick={() => irParaPagina("patio")}><Truck size={20}/>Pátio</button>
                    <button className={paginaAtual === "relatorio" ? "ativo" : ""} onClick={() => irParaPagina("relatorio")}><FileText size={20}/>Relatório</button>
                </nav>
            </div>

            <div className="conteudo">
                {children}
            </div>
        </div> 
    );
}