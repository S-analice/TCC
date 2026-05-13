import "../styles/DeleteEmpresaModal.css";

export default function DeleteEmpresaModal({ empresa, fechar, confirmar }) {
    return (
        <div className="dem-fundo" onClick={fechar}>
            <div className="dem-card" onClick={(e) => e.stopPropagation()}>
                <h2>Confirmar Inativação</h2>
                <p>Deseja realmente inativar esta empresa?</p>
                <div className="dem-linha"></div>
                <div className="dem-caixinha">
                    <p>Empresa:</p> 
                    <strong>{empresa?.nome}</strong>
                </div>
                <div className="dfm-form-acoes">
                    <button onClick={fechar} className="dem-cancelar">Cancelar</button>
                    <button onClick={confirmar} className="dem-salvar">Confirmar</button>
                </div>
            </div>
        </div>
    );
}