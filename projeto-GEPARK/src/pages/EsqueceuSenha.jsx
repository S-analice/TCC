import "../styles/EsqueceuSenha.css";
import { Mail, ArrowLeft } from "lucide-react";

import { useState } from "react";

import Carregando from "../components/Carregando";
import Mensagem from "../components/Mensagem";

export default function EsqueceuSenha({ voltarParaLogin }) {

    const [funcionarios, setFuncionarios] = useState([
        {
            id: 1,
            nome: "João Silva",
            email: "joao.silva@email.com",
            senha: "123456",
            telefone: "41999991111",
            turno: "06:00 - 18:00",
            foto: "",
            cargo: "Equipe",
            status: "Ativo"
        },
        {
            id: 2,
            nome: "Maria Santos",
            email: "maria.santos@email.com",
            senha: "123456",
            telefone: "41988882222",
            turno: "18:00 - 06:00",
            foto: "",
            cargo: "Equipe",
            status: "Ativo"
        },
        {
            id: 3,
            nome: "Carlos Oliveira",
            email: "carlos.oliveira@email.com",
            senha: "123456",
            telefone: "41977773333",
            turno: "18:00 - 06:00",
            foto: "",
            cargo: "Equipe",
            status: "Ativo"
        }
    ]);

    const [carregando, setCarregando] = useState(false);

    const [mostrarMensagem, setMostrarMensagem] = useState(false);
    const [tipoMensagem, setTipoMensagem] = useState("sucesso");
    const [textoMensagem, setTextoMensagem] = useState("");

    const [email, setEmail] = useState("");

    const enviarFormulario = (e) => {
        e.preventDefault();

        setCarregando(true);

        setTimeout(() => {

            const funcionarioExiste = funcionarios.find(
                (f) => f.email.toLowerCase() === email.toLowerCase()
            );

            setCarregando(false);

            if (funcionarioExiste) {

                setTipoMensagem("sucesso");
                setTextoMensagem("Email de recuperação enviado com sucesso!");

            } else {

                setTipoMensagem("erro");
                setTextoMensagem("Email não encontrado no sistema!");

            }

            setMostrarMensagem(true);

        }, 2000);
    };

    return (
        <div className="es-container">

            {carregando && <Carregando />}

            {mostrarMensagem && (
                <Mensagem
                    mensagem={textoMensagem}
                    tipo={tipoMensagem}
                    fechar={setMostrarMensagem(false)}
                />
            )}

            <div className="es-card">

                <div className="es-logo">
                    <img src="/logo.png" alt="Logo GEPARK" className="es-img" />

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
                        <label className="es-label">
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