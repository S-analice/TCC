import "../styles/FuncionarioModal.css";
import { useState } from "react";
import { Upload, Trash2, User } from "lucide-react";

export default function FuncionarioModal({ modo, funcionario, fechar, salvar }) {

    const [foto, setFoto] = useState(funcionario?.foto || "");
    const [nome, setNome] = useState(funcionario?.nome || "");
    const [email, setEmail] = useState(funcionario?.email || "");
    const [senha, setSenha] = useState(funcionario?.senha || "");
    const [telefone, setTelefone] = useState(funcionario?.telefone || "");
    const [turno, setTurno] = useState(funcionario?.turno || "");
    const [cargo, setCargo] = useState(funcionario?.cargo || "");
    const [status, setStatus] = useState(funcionario?.status || "Ativo");

    const [erro, setErro] = useState("");

    const validar = () => {

        if (senha.length !== 6)
            return "Senha deve ter 6 números!";

        if (telefone.length !== 11)
            return "Telefone deve ter 11 números!";

        return "";
    };

    const converterParaBase64 = (arquivo) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            setFoto(reader.result);
        };

        reader.readAsDataURL(arquivo);
    };

    const enviarFormulario = (e) => {
        e.preventDefault();

        setErro("");

        const erroValidacao = validar();

        if (erroValidacao) {
            setErro(erroValidacao);
            return;
        }

        salvar({ foto, nome, email, senha, telefone, turno, cargo, status });
    };

    return (
        <div className="fm-fundo" onClick={fechar}>
            <div className="fm-card" onClick={(e) => e.stopPropagation()}>

                <h2>
                    {modo === "adicionar" ? "Adicionar Funcionário" : "Editar Funcionário"}
                </h2>

                <div className="fm-linha"></div>

                <form onSubmit={enviarFormulario} className="fm-form">

                    <div className="fm-form-container">
                        <label className="fm-label">Foto</label>

                        <div className="fm-upload-container">

                            <div className="fm-upload-preview">
                                {foto ? (
                                    <img src={foto} alt="Foto funcionário" />
                                ) : (
                                    <User size={40} />
                                )}
                            </div>

                            <div className="fm-upload-botao">

                                <input
                                    type="file"
                                    id="foto-upload"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files[0]) {
                                            converterParaBase64(e.target.files[0]);
                                        }
                                    }}
                                    hidden
                                />

                                <div className="fm-upload-botao-acoes">
                                    <label
                                        htmlFor="foto-upload"
                                        className={`fm-upload-label ${foto ? "alterar" : "carregar"}`}
                                    >
                                        <Upload size={16} />
                                        {foto ? "Alterar" : "Carregar"}
                                    </label>

                                    {foto && (
                                        <button
                                            type="button"
                                            className="fm-upload-remover"
                                            onClick={() => setFoto("")}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>

                                <p className="fm-upload-texto">
                                    JPG, PNG ou GIF
                                </p>

                            </div>

                        </div>
                    </div>

                    <div className="fm-form-container">
                        <label className="fm-label">Nome Completo</label>
                        <input
                            type="text"
                            className="fm-input"
                            placeholder="Digite o nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                        />
                    </div>

                    <div className="fm-form-linha">

                        <div className="fm-form-container">
                            <label className="fm-label">Email</label>
                            <input
                                type="email"
                                className="fm-input"
                                placeholder="Digite o e-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="fm-form-container">
                            <label className="fm-label">Senha</label>
                            <input
                                type="password"
                                className="fm-input"
                                placeholder="Digite uma senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />
                        </div>

                    </div>

                    <div className="fm-form-container">
                        <label className="fm-label">Telefone</label>
                        <input
                            type="text"
                            className="fm-input"
                            placeholder="Digite o telefone"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                            required
                        />
                    </div>

                    <div className="fm-form-linha">

                        <div className="fm-form-container">
                            <label className="fm-label">Cargo</label>
                            <select
                                className="fm-input"
                                value={cargo}
                                onChange={(e) => setCargo(e.target.value)}
                                required
                            >
                                <option value="">Selecione</option>
                                <option value="Líder">Líder</option>
                                <option value="Equipe">Equipe</option>
                            </select>
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

                    </div>

                    {modo === "editar" && (
                        <div className="fm-form-container">
                            <label className="fm-label">Status</label>
                            <select
                                className="fm-input"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="Ativo">Ativo</option>
                                <option value="Inativo">Inativo</option>
                            </select>
                        </div>
                    )}

                    {erro && <p className="erro-texto">{erro}</p>}

                    <div className="fm-linha"></div>

                    <div className="fm-form-acoes">
                        <button type="button" onClick={fechar} className="fm-cancelar">Cancelar</button>
                        <button type="submit" className="fm-salvar">Salvar</button>
                    </div>

                </form>

            </div>
        </div>
    );
}