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

  const [dataSaida, setDataSaida] = useState(obterDataLocal());
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
      setValores((prev) => ({ ...prev, erro: MENSAGENS.VALIDACAO.SELECIONE }));
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
    <div className="tm-fundo" onClick={fechar}>
      <div className="tm-card" onClick={(e) => e.stopPropagation()}>
        <h2>Finalizar Saída</h2>

        <div className="tm-caixinha-linha">
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

        <div className="tm">
          <div className="tm-container">
            <label className="tm-label">Horário de Saída</label>
            <input
              type="datetime-local"
              className="tm-input"
              value={dataSaida}
              onChange={(e) => setDataSaida(e.target.value)}
            />
          </div>

          <div className="tm-container">
            <label className="sm-label">Forma de Pagamento</label>
            <select
              className="tm-input"
              value={tipoPagamento}
              onChange={(e) => {
                setTipoPagamento(e.target.value);
                if (e.target.value)
                  setValores((prev) => ({ ...prev, erro: null }));
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

          <div className="tm-caixinha-linha">
            <p>
              Funcionário: <strong>{funcionario?.nome || "Sistema"}</strong>
            </p>
          </div>
          {valores.erro && <p className="erro-texto">{valores.erro}</p>}

          <div className="tm-acoes">
            <button className="tm-cancelar" onClick={fechar}>
              Cancelar
            </button>
            <button
              onClick={handleConfirmar}
              className="tm-salvar"
              disabled={
                !!valores.erro &&
                valores.erro !== "Selecione uma forma de pagamento."
              }
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
