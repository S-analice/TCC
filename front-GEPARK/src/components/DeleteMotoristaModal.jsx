import "../styles/DeleteMotoristaModal.css";
import { formatarCPF, formatarPlaca } from "../utils/formatadores";

export default function DeleteMotoristaModal({ motorista, fechar, confirmar }) {
    return (
        <div className="dmm-fundo" onClick={fechar}>
            <div className="dmm-card" onClick={(e) => e.stopPropagation()}>
                <h2>Confirmar Remoção</h2>
                <p>Deseja realmente marcar este motorista como inativo?</p>
                <div className="dmm-caixinha">
                    <p>CPF: <strong>{formatarCPF(motorista?.cpf)}</strong></p>
                    <p>Placa: <strong>{formatarPlaca(motorista?.placa)}</strong></p>
                </div>
                <div className="dmm-form-acoes">
                    <button onClick={fechar} className="dmm-cancelar">Cancelar</button>
                    <button onClick={confirmar} className="dmm-salvar">Confirmar</button>
                </div>
            </div>
        </div>
    );
}