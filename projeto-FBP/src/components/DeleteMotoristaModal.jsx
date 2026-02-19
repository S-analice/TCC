import "../styles/DeleteMotoristaModal.css";

export default function DeleteMotoristaModal({ motorista, fechar, confirmar }) {

    return (
        <div className="dmm-fundo" onClick={fechar}>
            <div className="dmm-card" onClick={(e) => e.stopPropagation()}>

                <h2>Confirmar Remoção</h2>

                <p>Deseja realmente remover este motorista?</p>

                <div className="dmm-caixinha">
                    <p>CPF:</p> 
                    <strong>{motorista?.cpf}</strong>
                </div>

                <div className="dmm-caixinha">
                    <p>Placa:</p> 
                    <strong>{motorista?.placa}</strong>
                </div>

                <div className="dmm-form-acoes">
                    <button onClick={fechar} className="botao1">Cancelar</button>
                    <button onClick={confirmar} className="botao2">Confirmar</button>
                </div>

            </div>
        </div>
    );
}
