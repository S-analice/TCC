import "../styles/Auth.css";
import { Mail, ArrowLeft } from "lucide-react";
import Carregando from "../components/Carregando";
import Mensagem from "../components/Mensagem";
import { useEsqueceuSenhaViewModel } from "../viewmodels/useEsqueceuSenhaViewModel";

export default function EsqueceuSenha({ voltarParaLogin }) {
    const vm = useEsqueceuSenhaViewModel(voltarParaLogin);

    return (
        <div className="a-container">
            {vm.carregando && <Carregando />}

            {vm.mensagem.mostrar && (
                <Mensagem
                    mensagem={vm.mensagem.texto}
                    modo={vm.mensagem.tipo}
                    fechar={vm.fecharMensagem}
                />
            )}

            <div className="a-card">
                <div className="a-logo">
                    <img src="/logo.png" alt="Logo GEPARK" className="a-img" />
                    <p className="a-descricao">
                        Sistema para Gerenciamento de Estacionamento de Veículos Pesados
                    </p>
                </div>

                <h2 className="a-subtitulo">Esqueceu a senha?</h2>

                <p className="a-p">
                    Digite seu e-mail para receber as instruções de recuperação
                </p>

                <form onSubmit={vm.enviarSolicitacao} className="a-form">
                    <div className="a-form-container">
                        <label className="a-label">Email</label>
                        <div className="a-input-icon">
                            <Mail size={18} />
                            <input
                                type="email"
                                className="a-input"
                                placeholder="Digite seu e-mail"
                                value={vm.email}
                                onChange={(e) => vm.setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="a-acoes">
                        <button type="button" className="a-ir-para" onClick={voltarParaLogin}>
                            <ArrowLeft size={16} />
                            Voltar para o login
                        </button>

                        <button type="submit" className="a-botao">Enviar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
