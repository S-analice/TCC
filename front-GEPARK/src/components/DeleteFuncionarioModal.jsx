import "../styles/componentes/DeleteModal.css";

export default function DeleteFuncionarioModal({
  funcionario,
  fechar,
  confirmar,
}) {
  return (
    <div className="dm-fundo" onClick={fechar}>
      <div className="dm-card" onClick={(e) => e.stopPropagation()}>
        <h2>Confirmar Remoção</h2>
        <p>Deseja realmente remover este funcionário?</p>
        <div className="dm-caixinha">
          <p>Nome:</p>
          <strong>{funcionario?.nome}</strong>
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
