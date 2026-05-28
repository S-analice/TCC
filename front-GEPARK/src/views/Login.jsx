import "../styles/Auth.css";
import { Mail, Lock } from "lucide-react";
import Carregando from "../components/Carregando";
import Mensagem from "../components/Mensagem";
import { useLoginViewModel } from "../viewmodels/useLoginViewModel";

export default function Login({ definirFuncionario, irParaEsqueceuSenha, irParaHome }) {
    const vm = useLoginViewModel(definirFuncionario, irParaHome);

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
                    <p className="a-descricao">Sistema para Gerenciamento de Estacionamento de Veículos Pesados</p>
                </div>

                <h2 className="a-subtitulo">Entrar no Sistema</h2>

                <form onSubmit={vm.enviarFormulario} className="a-form">
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

                    <div className="a-form-container">
                        <label className="a-label">Senha</label>
                        <div className="a-input-icon">
                            <Lock size={18} />
                            <input
                                type="password"
                                className="a-input"
                                placeholder="Digite sua senha"
                                value={vm.senha}
                                onChange={(e) => vm.setSenha(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="a-acoes">
                        <button type="button" className="a-ir-para" onClick={irParaEsqueceuSenha}>
                            Esqueceu a senha?
                        </button>
                        <button type="submit" className="a-botao">Entrar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
