import "../styles/componentes/SaidaModal.css";
import React, { useState, useEffect } from "react";
import { MovimentacaoModel } from "../models/MovimentacaoModel";
import { MENSAGENS } from "../utils/mensagens"; 

export default function SaidaModal({
  registro,
  funcionario,
  fechar,
  confirmar,
  listaPagamentos,
}) {
  const obterDataLocal = () => {
    const agora = new Date();
    const offset = agora.getTimezoneOffset() * 60000; 
    const localISOTime = new Date(agora - offset).toISOString().slice(0, 16);
    return localISOTime;
  };

  const [dataSaida, setDataSaida] = useState(
    obterDataLocal(),
  );
  const [tipoPagamento, setTipoPagamento] = useState("");
  const [valores, setValores] = useState({
    valor: 0,
    erro: null,
    convenioAplicado: "",
  });

  useEffect(() => {
    const calc = MovimentacaoModel.calcularValor(
      registro.dataEntrada,
      dataSaida,
      registro.cpf,
    );
    setValores(calc);
  }, [dataSaida, registro]);

  const handleConfirmar = () => {
    if (!tipoPagamento) {
      setValores(prev => ({ ...prev, erro: MENSAGENS.VALIDACAO.SELECIONE }));
      return;
    }

    if (valores.erro) return;

    confirmar(registro.id, {
      dataSaida,
      tipoPagamento,
      valorFinal: valores.valor,
      funcionarioSaida: funcionario.nome,
    });
    fechar();
  };

  return (
    <div className="sm-fundo" onClick={fechar}>
      <div className="sm-card" onClick={(e) => e.stopPropagation()}>
        <h2>Finalizar Saída</h2>

        <div className="sm-caixinha-linha">
          <p>
            Placa: <strong>{registro.placa}</strong>
          </p>
          <p>
            Convênio:{" "}
            <strong>{valores.convenioAplicado || "Buscando..."}</strong>
          </p>
          <p>
            Valor:{" "}
            <strong className="sm-valor">
              R$ {(valores?.valor || 0).toFixed(2)}
            </strong>
          </p>
        </div>

        <div className="sm">
          <div className="sm-container">
            <label className="sm-label">Horário de Saída</label>
            <input
              type="datetime-local"
              className="sm-input"
              value={dataSaida}
              onChange={(e) => setDataSaida(e.target.value)}
            />
          </div>

          <div className="sm-container">
            <label className="sm-label">Forma de Pagamento</label>
            <select
              className="sm-input"
              value={tipoPagamento}
              onChange={(e) => {
                setTipoPagamento(e.target.value);
                // Limpa o erro se o usuário selecionar algo
                if(e.target.value) setValores(prev => ({...prev, erro: null}));
              }}
            >
              <option value="">Selecione</option>
              {listaPagamentos.map((pag) => (
                <option key={pag.id} value={pag.nome}>
                  {pag.nome}
                </option>
              ))}
            </select>
          </div>
          {valores.erro && <p className="erro-texto">{valores.erro}</p>}

          <div className="sm-acoes">
            <button className="sm-cancelar" onClick={fechar}>
              Cancelar
            </button>
            <button
              onClick={handleConfirmar}
              className="sm-confirmar"
              // Removi o disabled do pagamento para o usuário clicar e ver o erro
              disabled={!!valores.erro && valores.erro !== "Selecione uma forma de pagamento."}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}