import "../styles/componentes/DeleteModal.css";
import { formatarCPF, formatarPlaca } from "../utils/formatadores";

export default function DeleteMotoristaModal({ motorista, fechar, confirmar }) {
  return (
    <div className="dm-fundo" onClick={fechar}>
      <div className="dm-card" onClick={(e) => e.stopPropagation()}>
        <h2>Confirmar Remoção</h2>
        <p>Deseja realmente marcar este motorista como inativo?</p>
        <div className="dm-caixinha">
          <p>
            CPF: <strong>{formatarCPF(motorista?.cpf)}</strong>]
          </p>
          <p>
            Placa: <strong>{formatarPlaca(motorista?.placa)}</strong>
          </p>
        </div>
        <div className="dm-acoes">
          <button onClick={fechar} className="dm-cancelar">
            Cancelar
          </button>
          <button onClick={confirmar} className="dm-confirmar">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
