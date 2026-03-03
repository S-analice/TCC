import { useState, useEffect } from "react";
import "../styles/EntradaModal.css";

export default function EntradaModal({ modo, registro, registros, funcionario, fechar, salvar }) {

    const motoristasCadastrados = [
        {
            id: 1,
            cpf: "12345678900",
            placa: "ABC1234",
            telefone: "41999991111",
            cnpj: "12345678000100",
            convenio: "Convênio A",
            status: "Ativo"

        },
        {
            id: 2,
            cpf: "98765432100",
            placa: "DEF5678",
            telefone: "41988882222",
            cnpj: "98765432000100",
            convenio: "Convênio B",
            status: "Ativo"
        },
        {
            id: 3,
            cpf: "45678912300",
            placa: "GHI9012",
            telefone: "41977773333",
            cnpj: "45678912000100",
            convenio: "Sem Convênio",
            status: "Inativo"
        }
    ];

    const [cpf, setCpf] = useState(registro?.cpf || "");
    const [placa, setPlaca] = useState(registro?.placa || "");
    const [dataEntrada, setDataEntrada] = useState(registro?.dataEntrada || new Date().toISOString().slice(0, 16));

    const [erro, setErro] = useState("");

    const validar = () => {

        const motorista = motoristasCadastrados.find(m => m.cpf === cpf);
    
        if (!motorista)
            return "Motorista não encontrado!";
    
        if (motorista.status === "Inativo")
            return "Este motorista está inativo e não pode entrar no pátio!";
    
        const motoristaNoPatio = registros?.find(
            r => r.cpf === cpf && !r.dataSaida
        );
    
        if (motoristaNoPatio)
            return "Este motorista já possui um caminhão no pátio!";
    
        return "";
    };

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

        setErro("");

        const erroValidacao = validar();

        if (erroValidacao) {
            setErro(erroValidacao);
            return;
        }

        salvar({ cpf, placa, dataEntrada, funcionarioEntrada: funcionario?.nome });
    };

    return (
        <div className="em-fundo" onClick={fechar}>
            <div className="em-card" onClick={(e) => e.stopPropagation()}>

                <h2>
                    {modo === "adicionar" ? "Adicionar Caminhão" : "Editar Caminhão"}
                </h2>

                <div className="em-linha"></div>

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
                            value={dataEntrada}
                            onChange={(e) => setDataEntrada(e.target.value)}
                            required
                        />
                    </div>

                    <div className="em-form-container">
                        <label className="em-label">Funcionário</label>
                        <input
                            className="em-input"
                            type="text"
                            value={funcionario?.nome}
                            readOnly
                        />
                    </div>

                    {erro && <p className="erro-texto">{erro}</p>}

                    <div className="em-linha"></div>

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