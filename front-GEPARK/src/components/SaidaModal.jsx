import "../styles/SaidaModal.css";
import React, { useState, useEffect } from "react";
import { MovimentacaoModel } from "../models/MovimentacaoModel";

export default function SaidaModal({ registro, funcionario, fechar, confirmar, listaPagamentos }) {
  const [dataSaida, setDataSaida] = useState(new Date().toISOString().slice(0, 16));
  const [tipoPagamento, setTipoPagamento] = useState("");
 const [valores, setValores] = useState({ valor: 0, erro: null, convenioAplicado: "" });

  useEffect(() => {
    const calc = MovimentacaoModel.calcularValor(registro.dataEntrada, dataSaida, registro.cpf);
    setValores(calc);
  }, [dataSaida, registro]);

  const handleConfirmar = () => {
    confirmar(registro.id, { 
      dataSaida, 
      tipoPagamento, 
      valorFinal: valores.valor,
      funcionarioSaida: funcionario.nome 
    });
    fechar();
  };

  return (
    <div className="sm-fundo" onClick={fechar}>
      <div className="sm-card" onClick={e => e.stopPropagation()}>
        <h2>Finalizar Saída</h2>
        
        <div className="sm-caixinha-linha">
          <p>Placa: <strong>{registro.placa}</strong></p>
          <p>Convênio: <strong>{valores.convenioAplicado || "Buscando..."}</strong></p>
          <p>Valor: <strong style={{color: 'green'}}>R$ {(valores?.valor || 0).toFixed(2)}</strong></p>
        </div>

        <div className="sm-form">
          <div className="sm-form-container">
            <label className="sm-label">Horário de Saída</label>
            <input 
              type="datetime-local" 
              className="sm-input"
              value={dataSaida} 
              onChange={e => setDataSaida(e.target.value)} 
            />
          </div>

          <div className="sm-form-container">
            <label className="sm-label">Forma de Pagamento</label>
            <select className="sm-input" value={tipoPagamento} onChange={e => setTipoPagamento(e.target.value)}>
              <option value="">Selecione</option>
              {listaPagamentos.map(pag => (
                <option key={pag.id} value={pag.nome}>{pag.nome}</option>
              ))}
            </select>
          </div>

          {valores.erro && <p className="erro-texto">{valores.erro}</p>}

          <div className="sm-form-acoes">
            <button className="sm-cancelar" onClick={fechar}>Cancelar</button>
            <button 
              onClick={handleConfirmar} 
              className="sm-salvar" 
              disabled={!!valores.erro || !tipoPagamento}
            >
              Confirmar 
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}