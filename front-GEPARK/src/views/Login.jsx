import "../styles/Login.css";
import { Mail, Lock } from "lucide-react";
import Carregando from "../components/Carregando";
import Mensagem from "../components/Mensagem";
import { useLoginViewModel } from "../viewmodels/useLoginViewModel";

export default function Login({ definirFuncionario, irParaEsqueceuSenha, irParaHome }) {
    const vm = useLoginViewModel(definirFuncionario, irParaHome);

    return (
        <div className="login-container">
            {vm.carregando && <Carregando />}
            {vm.mensagem.mostrar && (
                <Mensagem 
                    mensagem={vm.mensagem.texto} 
                    modo={vm.mensagem.tipo} 
                    fechar={vm.fecharMensagem} 
                />
            )}

            <div className="login-card">
                <div className="login-logo">
                    <img src="/logo.png" alt="Logo GEPARK" className="login-img" />
                    <p className="login-descricao">Sistema de Gestão de Estacionamento</p>
                </div>

                <h2 className="login-subtitulo">Entrar no Sistema</h2>

                <form onSubmit={vm.enviarFormulario} className="login-form">
                    <div className="login-form-container">
                        <label className="login-label">Email</label>
                        <div className="logo-input-icon">
                            <Mail size={18} />
                            <input
                                type="email"
                                className="login-input"
                                placeholder="Digite seu e-mail"
                                value={vm.email}
                                onChange={(e) => vm.setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="login-form-container">
                        <label className="login-label">Senha</label>
                        <div className="logo-input-icon">
                            <Lock size={18} />
                            <input
                                type="password"
                                className="login-input"
                                placeholder="Digite sua senha"
                                value={vm.senha}
                                onChange={(e) => vm.setSenha(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="login-form-acoes">
                        <button type="button" className="esqueceu-senha" onClick={irParaEsqueceuSenha}>
                            Esqueceu a senha?
                        </button>
                        <button type="submit" className="login-botao">Entrar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}