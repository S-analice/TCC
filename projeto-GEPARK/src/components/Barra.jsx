import React, { useState } from "react";
import { User, House, Users, Truck, FileText, Mail, Phone, Clock, LogOut } from "lucide-react";
import "../styles/Barra.css";

export default function Barra( {usuario, paginaAtual, irParaPagina, mostrarInfoUsuario, voltarParaLogin, children} ) {

    const [mostrarMenuUsuario, setMostrarMenuUsuario] = useState(false);

    const aoMostrarInfo = () => {
        mostrarInfoUsuario();
        setMostrarMenuUsuario(false);
    }

    const formatarTelefone = (telefone) => {
        if (!telefone) return "";
    
        const numeros = telefone.replace(/\D/g, "");
    
        if (numeros.length === 11) {
        return numeros.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
        }
    
        return telefone;
    };

    return (
        <div className="barra-container">

            <div className="barra-superior">

            <button onClick={() => setMostrarMenuUsuario(!mostrarMenuUsuario)} className="usuario-botao">
                <div className="usuario-icon-fundo">
                    <User size={20}/>
                </div>
                <span>{usuario?.nome}</span>
            </button>

            {mostrarMenuUsuario && (
                <div className="menu-usuario">

                    <div className="menu-usuario-topo">
                        <div className="avatar-usuario">
                            {usuario?.foto ? 
                            (<img src={usuario.foto} alt="Foto do usuário" className="avatar-usuario-img"/>) 
                            : 
                            (<div className="avatar-icone">
                                <User size={28}/>
                            </div>)}
                        </div>

                        <div className="usuario-info">
                            <strong>{usuario?.nome}</strong>
                            <span>{usuario?.cargo}</span>
                        </div>
                    </div>

                    <div className="menu-usuario-detalhes">
                        <div className="detalhe">
                            <Mail size={20} />
                            <span>{usuario?.email}</span>
                        </div>

                        <div className="detalhe">
                            <Phone size={20} />
                            <span>{formatarTelefone(usuario?.telefone)}</span>
                        </div>

                        <div className="detalhe">
                            <Clock size={20} />
                            <span>{usuario?.turno}</span>
                        </div>
                    </div>

                    <div className="menu-usuario-acoes">
                        <button className="botao-sair" onClick={voltarParaLogin}>
                            <LogOut size={20} />Sair do sistema
                        </button>
                    </div>

                </div>
            )}
            </div>

            <div className="barra-navegacao">
                <div className="logo-retangulo">
                    <img src="/logo.png" alt="Logo GEPARK" className="logo-img" />    
                </div>

                <nav className="menu-navegacao">
                    <button className={paginaAtual === "home" ? "ativo" : ""} onClick={() => irParaPagina("home")}><House size={20}/>Home</button>

                    <button className={paginaAtual === "funcionario" ? "ativo" : ""} onClick={() => irParaPagina("funcionario")}><Users size={20}/>Funcionário</button>

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