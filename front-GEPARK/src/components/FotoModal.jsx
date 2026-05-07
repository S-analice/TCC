import "../styles/FotoModal.css";
import { User } from "lucide-react";

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
                        <User size={100}/>
                    </div>)}
                </div>

                <button onClick={fechar} className="foto-botao-fechar">
                    Fechar
                </button>

            </div>
        </div>
    );
}