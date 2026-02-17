import "../styles/InfoUsuarioModal.css";

export default function UsuarioInfoModal({ usuario, fechar }) {

  return (
    <div className="is-fundo" onClick={fechar}>
      <div className="is-container" onClick={(e) => e.stopPropagation()}>
        <h2>Informações do Funcionário</h2>

        <div className="is-foto">

          {usuario?.foto ? 
          (<img src={usuario.foto} alt="Foto do usuário" className="is-img" />) 
          : 
          (<div className="is-icone">
            <svg width="50" height="50" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 10C12.2091 10 14 8.20914 14 6C14 3.79086 12.2091 2 10 2C7.79086 2 6 3.79086 6 6C6 8.20914 7.79086 10 10 10Z" fill="#7C7C7C"/>
              <path d="M10 12C5.58172 12 2 13.7909 2 16V18H18V16C18 13.7909 14.4183 12 10 12Z" fill="#7C7C7C"/>
            </svg> 
          </div>)}

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