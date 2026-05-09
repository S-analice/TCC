import "../styles/RedefinirSenha.css";
import { Lock } from "lucide-react";
import Carregando from "../components/Carregando";
import Mensagem from "../components/Mensagem";
import { useRedefinirSenhaViewModel } from "../viewmodels/useRedefinirSenhaViewModel";

export default function RedefinirSenha(irParaLogin) {
    // Instanciando o ViewModel
    const vm = useRedefinirSenhaViewModel(irParaLogin);

    return (
        <div className="rs-container">
            {vm.carregando && <Carregando />}

            {vm.mensagem.mostrar && (
                <Mensagem
                    mensagem={vm.mensagem.texto}
                    modo={vm.mensagem.tipo}
                    fechar={vm.fecharMensagem}
                />
            )}

            <div className="rs-card">
                <div className="rs-logo">
                    <img src="/logo.png" alt="Logo GEPARK" className="rs-img" />
                    <p className="rs-descricao">
                        Sistema de Gestão de Estacionamento
                    </p>
                </div>

                <h2 className="rs-subtitulo">Redefinir Senha</h2>

                <form onSubmit={vm.redefinir} className="rs-form">
                    <div className="rs-form-container">
                        <label className="rs-label">Nova Senha</label>
                        <div className="rs-input-icon">
                            <Lock size={18} />
                            <input
                                className="rs-input"
                                type="password"
                                value={vm.senha}
                                onChange={(e) => vm.setSenha(e.target.value)}
                                placeholder="Digite a nova senha"
                                required
                            />
                        </div>
                    </div>

                    <div className="rs-form-container">
                        <label className="rs-label">Confirmar Senha</label>
                        <div className="rs-input-icon">
                            <Lock size={18} />
                            <input
                                className="rs-input"
                                type="password"
                                value={vm.confirmarSenha}
                                onChange={(e) => vm.setConfirmarSenha(e.target.value)}
                                placeholder="Confirme a senha"
                                required
                            />
                        </div>
                    </div>

                    {vm.erroValidacao && <p className="erro-texto">{vm.erroValidacao}</p>}

                    <div className="rs-form-acoes">
                        <button type="submit" className="rs-botao">
                            Redefinir
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}