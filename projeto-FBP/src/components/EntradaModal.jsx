import { useState, useEffect } from "react";
import "../styles/EntradaModal.css";

export default function EntradaModal({ modo, registro, usuario, fechar, salvar }) {

    const motoristasCadastrados = [
        { cpf: "12345678900", placa: "ABC1234", convenio: "Sem Convênio" },
        { cpf: "99999999999", placa: "XYZ9999", convenio: "Convênio A" }
    ];

    const [cpf, setCpf] = useState(registro?.cpf || "");
    const [placa, setPlaca] = useState(registro?.placa || "");
    const [entrada, setEntrada] = useState(registro?.entrada || new Date().toISOString().slice(0,16));

    useEffect(() => {
        if (cpf.length >= 7) {
            const motorista = motoristasCadastrados.find(m => m.cpf === cpf);
            setPlaca(motorista?.placa || "");
        } 
        
        else {
            setPlaca("");
        }
    }, [cpf]);

    const enviarFormulario = (e) => {
        e.preventDefault();

        salvar({ cpf, placa, entrada, funcionario: usuario?.nome });
    };

    return (
        <div className="em-fundo" onClick={fechar}>
            <div className="em-card" onClick={(e) => e.stopPropagation()}>

                <h2>
                    {modo === "adicionar" ? "Adicionar Caminhão" : "Editar Caminhão"}
                </h2>

                <form onSubmit={enviarFormulario} className="em-form">

                    <div className="em-form-container">
                        <label className="em-label">CPF</label>
                        <input
                            className="em-input"
                            type="text"
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                            placeholder="Digite o CPF"
                            required
                        />
                    </div>

                    <div className="em-form-container">
                        <label className="em-label">Placa</label>
                        <input
                            className="em-input"
                            type="text"
                            value={placa}
                            readOnly
                        />
                    </div>

                    <div className="em-form-container">
                        <label className="em-label">Horário Entrada</label>
                        <input
                            className="em-input"
                            type="datetime-local"
                            value={entrada}
                            onChange={(e) => setEntrada(e.target.value)}
                            required
                        />
                    </div>

                    <div className="em-form-container">
                        <label className="em-label">Funcionário</label>
                        <input
                            className="em-input"
                            type="text"
                            value={usuario?.nome}
                            readOnly
                        />
                    </div>

                    <div className="em-form-acoes">
                        <button className="em-cancelar" type="button" onClick={fechar}>
                            Cancelar
                        </button>
                        <button className="em-salvar" type="submit">
                            Salvar
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}