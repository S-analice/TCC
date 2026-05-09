import "../styles/EsqueceuSenha.css";
import { Mail, ArrowLeft } from "lucide-react";
import Carregando from "../components/Carregando";
import Mensagem from "../components/Mensagem";
import { useEsqueceuSenhaViewModel } from "../viewmodels/useEsqueceuSenhaViewModel";

export default function EsqueceuSenha({ voltarParaLogin }) {
    const vm = useEsqueceuSenhaViewModel(voltarParaLogin);

    return (
        <div className="es-container">
            {vm.carregando && <Carregando />}

            {vm.mensagem.mostrar && (
                <Mensagem
                    mensagem={vm.mensagem.texto}
                    modo={vm.mensagem.tipo}
                    fechar={vm.fecharMensagem}
                />
            )}

            <div className="es-card">
                <div className="es-logo">
                    <img src="/logo.png" alt="Logo GEPARK" className="es-img" />
                    <p className="es-descricao">
                        Sistema de Gestão de Estacionamento 
                    </p>
                </div>

                <h2 className="es-subtitulo">Esqueceu a senha?</h2>

                <p className="es-p">
                    Digite seu e-mail para receber as instruções de recuperação
                </p>

                <form onSubmit={vm.enviarSolicitacao} className="es-form">
                    <div className="es-form-container">
                        <label className="es-label">Email</label>
                        <div className="es-input-icon">
                            <Mail size={18} />
                            <input
                                type="email"
                                className="es-input"
                                placeholder="Digite seu e-mail"
                                value={vm.email}
                                onChange={(e) => vm.setEmail(e.target.value)}
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