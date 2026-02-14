import "../styles/EsqueceuSenha.css";
import { useState } from "react";
import Carregando from "../components/Carregando";
import Mensagem from "../components/Mensagem";

export default function EsqueceuSenha({ voltarParaLogin }) {

    const [carregando, setCarregando] = useState(false);
    const [mostrarMensagem, setMostrarMensagem] = useState(false);

    const [email, setEmail] = useState("");
    const [erro, setErro] = useState("");

    const enviarFormulario = (e) => {
        e.preventDefault();

        setCarregando(true);
        setErro(""); // apaga erro anterior

        // simular carregamento
        setTimeout(() => {
        
            const funcionario = {
                email:"joao@gmail.com",
            }

           if(email === funcionario.email) {
            setCarregando(false); 
            setMostrarMensagem(true);
           }

           else{
            setCarregando(false);
            setErro("Email inválido!");
           }
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

                    <img src="/logo.jpeg" alt="Logo FBP" className="logo-img" />    
                    <h1 className="logo-titulo">FBP</h1>
                </div>


                <h2 className="logo-subtitulo"> Esqueceu a senha?</h2>
                
                
                <form onSubmit={enviarFormulario} className="form">

                    <div className="form-container">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" id="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    {erro && <p className="erro-texto">{erro}</p>}

                    <div className="form-acoes">
                    <button type="button" className="botao1" onClick={voltarParaLogin}>Voltar</button>
                    
                    <button type="submit" className="botao2">Enviar</button>
                    </div>
                </form>
            </div>
        </div>
    );
} 