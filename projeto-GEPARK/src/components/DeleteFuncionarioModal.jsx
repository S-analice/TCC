import "../styles/DeleteFuncionarioModal.css";

export default function DeleteFuncionarioModal({ funcionario, fechar, confirmar }) {

    return (
        <div className="dfm-fundo" onClick={fechar}>
            <div className="dfm-card" onClick={(e) => e.stopPropagation()}>

                <h2>Confirmar Remoção</h2>

                <p>Deseja realmente remover este funcionário?</p>

                <div className="dfm-linha"></div>

                <div className="dfm-caixinha">
                    <p>Nome:</p> 
                    <strong>{funcionario?.nome}</strong>
                </div>

                <div className="dfm-linha"></div>

                <div className="dfm-form-acoes">
                    <button onClick={fechar} className="dfm-cancelar">Cancelar</button>
                    <button onClick={confirmar} className="dfm-salvar">Confirmar</button>
                </div>

            </div>
        </div>
    );
}
