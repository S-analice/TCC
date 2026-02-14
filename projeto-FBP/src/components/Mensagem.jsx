import "../styles/Mensagem.css";

export default function Mensagem ({ mensagem, fechar }) {

    return (
        <div className="container" onClick={fechar}>
            <div className="card" onClick={(e) => e.stopPropagation()}>
                <div className="card-retangulo">
                    <div className="card-icon">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <path
                                d="M26 8L12 22L6 16"
                                stroke="#7C7C7C"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>

                    <p className="texto">{mensagem}</p>

                    <button className="botao" onClick={fechar}>Ok</button>
                </div>
            </div>
        </div>
    );
}