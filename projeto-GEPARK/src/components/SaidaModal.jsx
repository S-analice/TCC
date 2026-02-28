import { useState, useEffect } from "react";
import "../styles/SaidaModal.css";

export default function SaidaModal({ usuario, registro, fechar, confirmar }) {

    const [saida, setSaida] = useState(new Date().toISOString().slice(0,16));
    const [tipoPagamento, setTipoPagamento] = useState("");
    const [valor, setValor] = useState(0);

    const [erro, setErro] = useState("");

    useEffect(() => {
        calcularValor();
        setErro("")
    }, [saida]); // calcula quando muda o horario saida  

    const calcularValor = () => {

        if (!registro?.entrada) return;

        const entradaData = new Date(registro.entrada);
        const saidaData = new Date(saida);

        if (saidaData <= entradaData) {
            setErro("O horário de saída deve ser maior que o horário de entrada!");
            setValor(0);
            return;
        }

        const diferencaMs = saidaData - entradaData;
        const diferencaHoras = Math.ceil(diferencaMs / (1000 * 60 * 60));

        let valorHora = 10;
        let valorDiaria = 100;

        if (registro?.convenio === "Convênio A" || registro?.convenio === "Convênio B") {
            valorHora = 6;
            valorDiaria = 60;
        }

        let valorCalculado = 0;

        if (diferencaHoras >= 24) {
            valorCalculado = valorDiaria;
        } 
        
        else {
            valorCalculado = diferencaHoras * valorHora;
        }


        setValor(valorCalculado);
    };

    return (
        <div className="sm-fundo" onClick={fechar}>
            <div className="sm-card" onClick={(e) => e.stopPropagation()}>

                <h2>Saída do Caminhão</h2>

                <div className="sm-linha"></div>

                <div className="sm-caixinha-linha">
                    <div>
                        <p>CPF:</p>
                        <strong>{registro?.cpf}</strong>
                    </div>

                    <div>
                        <p>Placa:</p>
                        <strong>{registro?.placa}</strong>
                    </div>
                </div>

                <div className="sm-form">
                    <div className="sm-form-container">
                        <label className="sm-label">Horário Saída</label>
                        <input
                            className="sm-input"
                            type="datetime-local"
                            value={saida}
                            onChange={(e) => setSaida(e.target.value)}
                        />
                    </div>

                    <div className="sm-form-container">
                        <label className="sm-label">Tipo de Pagamento</label>
                        <select
                            className="sm-input"
                            value={tipoPagamento}
                            onChange={(e) => setTipoPagamento(e.target.value)}
                        >
                            <option value="">Selecione</option>
                            <option value="Dinheiro">Dinheiro</option>
                            <option value="Pix">Pix</option>
                            <option value="Cartão Débito">Cartão Débito</option>
                            <option value="Cartão Crédito">Cartão Crédito</option>
                            <option value="Convênio">Convênio</option>
                        </select>
                    </div>

                    <div className="sm-form-container">
                        <label className="sm-label">Valor (R$)</label>
                        <input
                            className="sm-input"
                            type="text"
                            value={`R$ ${valor}`}
                            readOnly
                        />
                    </div>

                    <div className="sm-form-container">
                        <label className="sm-label">Funcionário</label>
                        <input
                            className="sm-input"
                            type="text"
                            value={usuario?.nome}
                            readOnly
                        />
                    </div>

                    {erro && <p className="erro-texto">{erro}</p>}

                    <div className="sm-linha"></div>
                    
                    <div className="sm-form-acoes">
                        <button onClick={fechar} className="sm-cancelar">Cancelar</button>
                        <button onClick={confirmar} className="sm-salvar" disabled={!!erro}>Confirmar</button>
                    </div>
                </div>

            </div>
        </div>
    );
}