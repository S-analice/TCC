import "../styles/EsqueceuSenha.css";
import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import Carregando from "../components/Carregando";
import Mensagem from "../components/Mensagem";

export default function EsqueceuSenha({ voltarParaLogin }) {

    const [carregando, setCarregando] = useState(false);
    const [mostrarMensagem, setMostrarMensagem] = useState(false);
    const [email, setEmail] = useState("");

    const enviarFormulario = (e) => {
        e.preventDefault();

        setCarregando(true);

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

                <div className="es-logo">
                    <img src="/logo.png" alt="Logo FBP" className="es-img" />

                    <p className="es-descricao">
                        Sistema de Gestão de Estacionamento BR Park
                    </p>
                </div>

                <h2 className="es-subtitulo">Esqueceu a senha?</h2>

                <p className="es-p">
                    Digite seu e-mail para receber as instruções de recuperação
                </p>

                <form onSubmit={enviarFormulario} className="es-form">

                    <div className="es-form-container">

                        <label htmlFor="email" className="es-label">
                            Email
                        </label>

                        <div className="es-input-icon">
                            <Mail size={18} />

                            <input
                                type="email"
                                id="email"
                                className="es-input"
                                placeholder="Digite seu e-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                    </div>

                    <div className="es-form-acoes">

                        <button type="button" className="es-voltar" onClick={voltarParaLogin}>
                            <ArrowLeft size={16} />
                            Voltar para o login
                        </button>

                        <button type="submit" className="es-enviar">Enviar</button>

                    </div>

                </form>

            </div>
        </div>
    );
}