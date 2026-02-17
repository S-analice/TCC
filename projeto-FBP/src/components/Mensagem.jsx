import "../styles/Mensagem.css";

export default function Mensagem ({ mensagem, fechar }) {

    return (
        <div className="msg-container" onClick={fechar}>
            <div className="msg-card" onClick={(e) => e.stopPropagation()}>
                <div className="msg-retangulo">
                    <div className="msg-icon">
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

                    <p className="msg-texto">{mensagem}</p>

                    <button className="msg-botao" onClick={fechar}>Ok</button>
                </div>
            </div>
        </div>
    );
}