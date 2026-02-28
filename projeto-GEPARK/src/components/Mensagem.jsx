import "../styles/Mensagem.css";
import { Check, X } from "lucide-react";

export default function Mensagem({ mensagem, fechar, tipo = "sucesso" }) {

    const icone = tipo === "sucesso" ? <Check size={32}/> : <X size={32}/>;

    return (
        <div className="msg-container" onClick={fechar}>
            <div className="msg-card" onClick={(e) => e.stopPropagation()}>

                <div className={`msg-retangulo ${tipo}`}>

                    <div className="msg-icon">
                        {icone}
                    </div>

                    <p className="msg-texto">{mensagem}</p>

                    <button className="msg-botao" onClick={fechar}>
                        Ok
                    </button>

                </div>

            </div>
        </div>
    );
}