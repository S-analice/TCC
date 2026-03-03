import "../styles/RedefinirSenha.css";
import { Lock } from "lucide-react";

import { useState } from "react";

import Carregando from "../components/Carregando";
import Mensagem from "../components/Mensagem";

export default function RedefinirSenha() {

    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [erro, setErro] = useState("");

    const [carregando, setCarregando] = useState(false);

    const [mostrarMensagem, setMostrarMensagem] = useState(false);
    const [tipoMensagem, setTipoMensagem] = useState("sucesso");
    const [textoMensagem, setTextoMensagem] = useState("");

    const enviarFormulario = (e) => {
        e.preventDefault();

        setErro("");

        if (senha.length < 6) {
            setErro("A senha deve ter no mínimo 6 caracteres!");
            return;
        }

        if (senha !== confirmarSenha) {
            setErro("As senhas não coincidem!");
            return;
        }

        setCarregando(true);

        setTimeout(() => {

            setCarregando(false);

            setTipoMensagem("sucesso");
            setTextoMensagem("Senha redefinida com sucesso!");

            setMostrarMensagem(true);

        }, 2000);
    };

    return (
        <div className="rs-container">

            {carregando && <Carregando />}

            {mostrarMensagem && (
                <Mensagem
                    mensagem={textoMensagem}
                    tipo={tipoMensagem}
                    fechar={() => setMostrarMensagem(false)}
                />
            )}

            <div className="rs-card">

                <div className="rs-logo">
                    <img src="/logo.png" alt="Logo GEPARK" className="rs-img" />

                    <p className="rs-descricao">
                        Sistema de Gestão de Estacionamento BR Park
                    </p>
                </div>

                <h2 className="rs-subtitulo">Redefinir Senha</h2>

                <form onSubmit={enviarFormulario} className="rs-form">

                    <div className="em-form-container">
                        <label className="em-label">Senha</label>

                        <div className="rs-input-icon">
                            <Lock size={18} />
                            <input
                                className="rs-input"
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                placeholder="Digite a senha"
                                required
                            />
                        </div>
                    </div>

                    <div className="em-form-container">
                        <label className="em-label">Confirmar Senha</label>

                        <div className="rs-input-icon">
                        <Lock size={18} />
                            <input
                                className="rs-input"
                                type="password"
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                placeholder="Confirme a senha"
                                required
                            />
                        </div>
                    </div>

                    {erro && <p className="erro-texto">{erro}</p>}

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