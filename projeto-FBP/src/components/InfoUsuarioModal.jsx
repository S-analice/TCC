import "../styles/InfoUsuarioModal.css";

export default function UsuarioInfoModal({ usuario, fechar }) {

  return (
    <div className="is-fundo" onClick={fechar}>
      <div className="is-container" onClick={(e) => e.stopPropagation()}>
        <h2>Informações do Funcionário</h2>

        <div className="is-foto">
        
        </div>

        <div className="is-caixinha">
          <span>Nome</span>
          <strong>{usuario.nome}</strong>
        </div>

        <div className="is-caixinha">
          <span>Email</span>
          <strong>{usuario.email}</strong>
        </div>

        <div className="is-caixinha">
            <span>Telefone</span>
          <strong>{usuario.telefone}</strong>
        </div>

        <div className="is-caixinha">
          <span>Turno</span>
          <strong>{usuario.turno}</strong>
        </div>

        <button className="is-botao-fechar" onClick={fechar}>
          Fechar
        </button>
      </div>
    </div>
  );
}