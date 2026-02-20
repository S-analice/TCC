import "../styles/EsqueceuSenha.css";
import { useState } from "react";
import Carregando from "../components/Carregando";
import Mensagem from "../components/Mensagem";

export default function EsqueceuSenha({ voltarParaLogin }) {

    const [carregando, setCarregando] = useState(false);
    const [mostrarMensagem, setMostrarMensagem] = useState(false);

    const [email, setEmail] = useState("");

    const enviarFormulario = (e) => {
        e.preventDefault(); // página não recarrega

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
        <div className="es-container">

            {carregando && <Carregando />}
            {mostrarMensagem && (
                <Mensagem 
                    mensagem="Email de recuperação enviado com sucesso!"
                    fechar={fecharMensagem}
                />
            )}

            <div className="es-card">
                <div className="logo-retangulo">

                    <img src="/logo.jpeg" alt="Logo FBP" className="es-img" />    
                    <h1 className="es-titulo">FBP</h1>
                </div>


                <h2 className="es-subtitulo"> Esqueceu a senha?</h2>
                
                
                <form onSubmit={enviarFormulario} className="es-form">

                    <div className="es-form-container">
                        <label htmlFor="email" className="es-label">Email</label>
                        <input type="email" id="email" className="es-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>


                    <div className="es-form-acoes">
                    <button type="button" className="es-cancelar" onClick={voltarParaLogin}>Voltar</button>
                    
                    <button type="submit" className="es-enviar">Enviar</button>
                    </div>
                </form>
            </div>
        </div>
    );
} 