import "../styles/Auth.css";
import { Lock } from "lucide-react";
import Carregando from "../components/Carregando";
import Mensagem from "../components/Mensagem";
import { useRedefinirSenhaViewModel } from "../viewmodels/useRedefinirSenhaViewModel";

export default function RedefinirSenha(irParaLogin) {
    // Instanciando o ViewModel
    const vm = useRedefinirSenhaViewModel(irParaLogin);

    return (
        <div className="a-container">
            {vm.carregando && <Carregando />}

            {vm.mensagem.mostrar && (
                <Mensagem
                    mensagem={vm.mensagem.texto}
                    tipo={vm.mensagem.tipo}
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

                <h2 className="a-subtitulo">Redefinir Senha</h2>

                <form onSubmit={vm.redefinir} className="a-form">
                    <div className="a-form-container">
                        <label className="a-label">Nova Senha</label>
                        <div className="a-input-icon">
                            <Lock size={18} />
                            <input
                                className="a-input"
                                type="password"
                                value={vm.senha}
                                onChange={(e) => vm.setSenha(e.target.value)}
                                placeholder="Digite a nova senha"
                                required
                            />
                        </div>
                    </div>

                    <div className="a-form-container">
                        <label className="a-label">Confirmar Senha</label>
                        <div className="a-input-icon">
                            <Lock size={18} />
                            <input
                                className="a-input"
                                type="password"
                                value={vm.confirmarSenha}
                                onChange={(e) => vm.setConfirmarSenha(e.target.value)}
                                placeholder="Confirme a senha"
                                required
                            />
                        </div>
                    </div>

                    {vm.erroValidacao && <p className="erro-texto">{vm.erroValidacao}</p>}

                    <div className="a-acoes">
                        <button type="submit" className="a-botao">
                            Redefinir
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
