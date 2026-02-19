import "../styles/MotoristaModal.css";
import { useState } from "react";

export default function MotoristaModal({ modo, motorista, fechar, salvar }) {

    const [cpf, setCpf] = useState(motorista?.cpf || "");
    const [placa, setPlaca] = useState(motorista?.placa || "");
    const [telefone, setTelefone] = useState(motorista?.telefone || "");
    const [cnpj, setCnpj] = useState(motorista?.cnpj || "");
    const [convenio, setConvenio] = useState(motorista?.convenio || "");
    
    const [erro, setErro] = useState("");

    const validar = () => {
        if (cpf.length < 7 || cpf.length > 11)
            return "CPF deve ter entre 7 e 11 números!";

        if (cnpj.length !== 14)
            return "CNPJ deve ter 14 números!";

        if (telefone.length !== 9)
            return "Telefone deve ter 9 números!";

        if (placa.length !== 7)
            return "Placa deve ter 7 caracteres!";

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

        salvar({ cpf, placa, telefone, cnpj, convenio });
    };

    return (
        <div className="mm-fundo" onClick={fechar}>
            <div className="mm-card" onClick={(e) => e.stopPropagation()}>

                <h2>
                    {modo === "adicionar" ? "Adicionar Motorista" : "Editar Motorista"}
                </h2>

                <form onSubmit={enviarFormulario} className="mm-form">

                    <div className="mm-form-container">
                        <label className="mm-label">CPF</label>
                        <input type="text" className="mm-input"
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mm-form-container">
                        <label className="mm-label">Placa</label>
                        <input type="text" className="mm-input"
                            value={placa}
                            onChange={(e) => setPlaca(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mm-form-container">
                        <label className="mm-label">Telefone</label>
                        <input type="text" className="mm-input"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mm-form-container">
                        <label className="mm-label">CNPJ</label>
                        <input type="text" className="mm-input"
                            value={cnpj}
                            onChange={(e) => setCnpj(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mm-form-container">
                        <label className="mm-label">Convênio</label>
                        <select
                            className="mm-input"
                            value={convenio}
                            onChange={(e) => setConvenio(e.target.value)}
                            required
                        >
                            <option value="">Selecione</option>
                            <option value="Convênio A">Convênio A</option>
                            <option value="Convênio B">Convênio B</option>
                            <option value="Sem Convênio">Sem Convênio</option>
                        </select>
                    </div>

                    {erro && <p className="erro-texto">{erro}</p>}

                    <div className="mm-form-acoes">
                        <button type="button" onClick={fechar} className="mm-cancelar">Cancelar</button>
                        <button type="submit" className="mm-salvar">Salvar</button>
                    </div>

                </form>
            </div>
        </div>
    );
}