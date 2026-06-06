import "../styles/componentes/InfoMotoristaModal.css";
import { formatarDataBR } from "../utils/formatadores";

export default function InfoMotoristaModal({ motorista, checklist, fechar }) {
  return (
    <div className="mi-fundo" onClick={fechar}>
      <div className="mi-card" onClick={(e) => e.stopPropagation()}>
        <h2>Informações do Checklist</h2>
        {motorista?.status === "Bloqueado" && checklist && (
          <div className="mi-bloqueio-info">
            <div className="mi-grid">
              <div className="mi-campo">
                <label>Data do Bloqueio</label>
                <p>{formatarDataBR(checklist?.data_bloqueio)}</p>
              </div>
              <div className="mi-campo">
                <label>Previsão de Desbloqueio</label>
                <p>{formatarDataBR(checklist?.data_desbloqueio)}</p>
              </div>
              <div className="mi-campo">
                <label>Registrado por</label>
                <p>{checklist?.funcionario_nome || "Sistema"}</p>
              </div>
              <div className="mi-campo-full">
                <label>Motivo do Bloqueio</label>
                <p className="mi-motivo">
                  <strong>{checklist?.motivo || "Não informado"}</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mi-acoes">
          <button onClick={fechar} className="mi-fechar">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
