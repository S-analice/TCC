import "../styles/FuncionarioModal.css";
import { useState } from "react";

export default function FuncionarioModal({ modo, funcionario, fechar, salvar }) {

    const [nome, setNome] = useState(funcionario?.nome || "");
    const [email, setEmail] = useState(funcionario?.email || "");
    const [senha, setSenha] = useState(funcionario?.senha || "");
    const [telefone, setTelefone] = useState(funcionario?.telefone || "");
    const [turno, setTurno] = useState(funcionario?.turno || "");

    const [erro, setErro] = useState("");

    const validar = () => {
        
        if (senha.length !== 6)
            return "Senha deve ter 6 números!";

        if (telefone.length !== 9)
            return "Telefone deve ter 9 números!";

        return "";
    };

    const enviarFormulario = (e) => {
        e.preventDefault();

        setErro("");

        const erroValidacao = validar();

        if (erroValidacao) {
            setErro(erroValidacao);
            return;
        }

        salvar({ nome, email, senha, telefone, turno });
    };

    return (
        <div className="fm-fundo" onClick={fechar}>
            <div className="fm-card" onClick={(e) => e.stopPropagation()}>

                <h2>
                    {modo === "adicionar" ? "Adicionar Funcionário" : "Editar Funcionário"}
                </h2>

                <form onSubmit={enviarFormulario} className="fm-form">

                    <div className="fm-form-container">
                        <label className="fm-label">Nome</label>
                        <input type="text" className="fm-input"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                        />
                    </div>

                    <div className="fm-form-container">
                        <label className="fm-label">Email</label>
                        <input type="email" className="fm-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="fm-form-container">
                        <label className="fm-label">Senha</label>
                        <input type="password" className="fm-input"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                        />
                    </div>

                    <div className="fm-form-container">
                        <label className="fm-label">Telefone</label>
                        <input type="text" className="fm-input"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                            required
                        />
                    </div>

                    <div className="fm-form-container">
                        <label className="fm-label">Turno</label>
                        <select
                            className="fm-input"
                            value={turno}
                            onChange={(e) => setTurno(e.target.value)}
                            required
                        >
                            <option value="">Selecione</option>
                            <option value="18:00 - 06:00">Noite</option>
                            <option value="06:00 - 18:00">Dia</option>
                            <option value="08:00 - 17:00">Líder</option>
                        </select>
                    </div>

                    {erro && <p className="erro-texto">{erro}</p>}

                    <div className="fm-form-acoes">
                        <button type="button" onClick={fechar} className="fm-cancelar">Cancelar</button>
                        <button type="submit" className="fm-salvar">Salvar</button>
                    </div>

                </form>
            </div>
        </div>
    );
}