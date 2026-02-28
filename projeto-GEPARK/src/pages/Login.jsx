import "../styles/Login.css";
import { Mail, Lock } from "lucide-react";

import { useState } from "react";

import Carregando from "../components/Carregando";
import Mensagem from "../components/Mensagem";

export default function Login({ definirFuncionario, irParaEsqueceuSenha, irParaHome }) {

    const [carregando, setCarregando] = useState(false);
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");

    const [mostrarMensagem, setMostrarMensagem] = useState(false);
    const [tipoMensagem, setTipoMensagem] = useState("sucesso");
    const [textoMensagem, setTextoMensagem] = useState("");

    const enviarFormulario = (e) => {
        e.preventDefault();

        setCarregando(true);
        setErro("");

        setTimeout(() => {

            const funcionario = {
                foto: "/usuario.jpg",
                nome: "Senhor Cabeça de Batata",
                email: "srbatata@gmail.com",
                telefone: "41991234567",
                senha: "123456Sr",
                turno: "6:00 - 18:00",
                cargo: "Líder",
                status: "Ativo"
            };

            if (email === funcionario.email && senha === funcionario.senha) {
                setCarregando(false);
                definirFuncionario(funcionario);
                irParaHome();
            } else {
                setCarregando(false);
                setMostrarMensagem(true);
                setTipoMensagem("erro");
                setTextoMensagem("Email ou senha inválidos!");

            }

        }, 2000);
    };

    return (
        <div className="login-container">

            {carregando && <Carregando />}

            {mostrarMensagem && (
                <Mensagem
                    mensagem={textoMensagem}
                    tipo={tipoMensagem}
                    fechar={setMostrarMensagem(false)}
                />
            )}

            <div className="login-card">

                <div className="login-logo">
                    <img src="/logo.png" alt="Logo GEPARK" className="login-img" />

                    <p className="login-descricao">
                        Sistema de Gestão de Estacionamento BR Park
                    </p>
                </div>

                <h2 className="login-subtitulo">Entrar no Sistema</h2>

                <form onSubmit={enviarFormulario} className="login-form">

                    <div className="login-form-container">
                        <label className="login-label">Email</label>

                        <div className="logo-input-icon">
                            <Mail size={18} />
                            <input
                                type="email"
                                id="email"
                                className="login-input"
                                placeholder="Digite seu e-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                id="password"
                                className="login-input"
                                placeholder="Digite sua senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {erro && <p className="erro-texto">{erro}</p>}

                    <div className="login-form-acoes">

                        <button type="button" className="esqueceu-senha" onClick={irParaEsqueceuSenha}>Esqueceu a senha?</button>

                        <button type="submit" className="login-botao">Entrar</button>

                    </div>
                </form>
            </div>
        </div>
    );
}