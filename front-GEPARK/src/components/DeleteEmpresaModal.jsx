import "../styles/componentes/DeleteModal.css";

export default function DeleteEmpresaModal({ empresa, fechar, confirmar }) {
  return (
    <div className="dm-fundo" onClick={fechar}>
      <div className="dm-card" onClick={(e) => e.stopPropagation()}>
        <h2>Confirmar Inativação</h2>
        <p>Deseja realmente inativar esta empresa?</p>
        <div className="dm-caixinha">
          <p>Empresa:</p>
          <strong>{empresa?.nome}</strong>
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
