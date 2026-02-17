import React, { useState } from "react";
import "../styles/Barra.css";

export default function Barra( {usuario, paginaAtual, irParaPagina, mostrarInfoUsuario, voltarParaLogin, children} ) {

    const [mostrarMenuUsuario, setMostrarMenuUsuario] = useState(false);

    const aoMostrarInfo = () => {
        mostrarInfoUsuario();
        setMostrarMenuUsuario(false);
    }

    return (
        <div className="barra-container">

            <div className="barra-superior">

                <div className="usuario-retangulo">
                    <button onClick={() => setMostrarMenuUsuario(!mostrarMenuUsuario)} className="usuario-botao">
                        <div className="usuario-icon-fundo">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 10C12.2091 10 14 8.20914 14 6C14 3.79086 12.2091 2 10 2C7.79086 2 6 3.79086 6 6C6 8.20914 7.79086 10 10 10Z" fill="#7C7C7C"/>
                                <path d="M10 12C5.58172 12 2 13.7909 2 16V18H18V16C18 13.7909 14.4183 12 10 12Z" fill="#7C7C7C"/>
                            </svg> 
                        </div>
                        <span>{usuario?.nome}</span>
                    </button>

                    {mostrarMenuUsuario && (
                        <div className="menu-usuario">
                            <button onClick={aoMostrarInfo}>Infos</button>
                            <button onClick={voltarParaLogin}>Sair</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="barra-navegacao">
                <div className="logo-retangulo">
                    <img src="/logo.jpeg" alt="Logo FBP" className="logo-img" />    
                    <span>FBP</span>
                </div>

                <nav className="menu-navegacao">
                    <button className={paginaAtual === "home" ? "ativo" : ""} onClick={() => irParaPagina("home")}>Home</button>

                    <button className={paginaAtual === "funcionario" ? "ativo" : ""} onClick={() => irParaPagina("funcionario")}>Funcionário</button>

                    <button className={paginaAtual === "motorista" ? "ativo" : ""} onClick={() => irParaPagina("motorista")}>Motorista</button>
             
                    <button className={paginaAtual === "patio" ? "ativo" : ""} onClick={() => irParaPagina("patio")}>Pátio</button>

                    <button className={paginaAtual === "relatorio" ? "ativo" : ""} onClick={() => irParaPagina("relatorio")}>Relatório</button>
                </nav>
            </div>

            <div className="conteudo">
                {children}
            </div>
        </div>
    );
}