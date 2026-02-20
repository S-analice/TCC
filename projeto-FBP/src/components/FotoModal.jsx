import "../styles/FotoModal.css";

export default function FotoModal({ funcionario, fechar }) {

    return (
        <div className="foto-fundo" onClick={fechar}>
            <div className="foto-card" onClick={(e) => e.stopPropagation()}>

                <h2>Foto de {funcionario.nome}</h2>

                <div className="foto-container">
                    {funcionario.foto ? (
                        <img src={funcionario.foto} alt="Foto Funcionário" />
                    ) 
                    : 
                    (<div className="foto-icone">
                        <svg width="100" height="100" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 10C12.2091 10 14 8.20914 14 6C14 3.79086 12.2091 2 10 2C7.79086 2 6 3.79086 6 6C6 8.20914 7.79086 10 10 10Z" fill="#7C7C7C"/>
                        <path d="M10 12C5.58172 12 2 13.7909 2 16V18H18V16C18 13.7909 14.4183 12 10 12Z" fill="#7C7C7C"/>
                        </svg> 
                    </div>)}
                </div>

                <button onClick={fechar} className="foto-botao-fechar">
                    Fechar
                </button>

            </div>
        </div>
    );
}