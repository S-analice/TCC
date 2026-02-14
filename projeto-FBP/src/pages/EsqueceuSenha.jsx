import "../styles/EsqueceuSenha.css";
import { useState } from "react";
import Carregando from "../components/Carregando";
import Mensagem from "../components/Mensagem";

export default function EsqueceuSenha({ voltarParaLogin }) {

    const [carregando, setCarregando] = useState(false);
    const [mostrarMensagem, setMostrarMensagem] = useState(false);

    const enviarFormulario = (e) => {
        e.preventDefault();

        setCarregando(true);

        // simular carregamento
        setTimeout(() => {
            setCarregando(false);
            setMostrarMensagem(true);
        }, 2000);
    };
    
    const fecharMensagem = () => {
        setMostrarMensagem(false);

        if (voltarParaLogin) {
          voltarParaLogin();
        }
      };


    return (
        <div className="card-container">

            {carregando && <Carregando />}
            {mostrarMensagem && (
                <Mensagem 
                    mensagem="Email de recuperação enviado com sucesso!"
                    fechar={fecharMensagem}
                />
            )}

            <div className="card-fundo">
                <div className="logo-retangulo">
                    <div className="logo">
                        <svg
                            width="32"
                            height="32"
                            viewBox="0 0 32 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            >
                            <path d="M8 8H16V16H8V8Z" fill="#F4E87C" />
                            <path d="M16 16H24V24H16V16Z" fill="#F4E87C" />
                            <circle cx="20" cy="12" r="4" fill="#7C7C7C" />
                            </svg>
                    </div>
                    <h1 className="logo-titulo">FBP</h1>
                </div>


                <h2 className="logo-subtitulo"> Esqueceu a senha?</h2>
                
                
                <form onSubmit={enviarFormulario} className="form">

                    <div className="form-container">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" id="email" className="form-input" required />
                    </div>

                    <div className="form-acoes">
                    <button type="button" className="botao1" onClick={voltarParaLogin}>Voltar</button>
                    
                    <button type="submit" className="botao2">Enviar</button>
                    </div>
                </form>
            </div>
        </div>
    );
} 