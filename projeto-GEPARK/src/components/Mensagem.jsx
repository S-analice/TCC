import "../styles/Mensagem.css";
import { Check } from "lucide-react";

export default function Mensagem ({ mensagem, fechar }) {

    return (
        <div className="msg-container" onClick={fechar}>
            <div className="msg-card" onClick={(e) => e.stopPropagation()}>
                <div className="msg-retangulo">
                    <div className="msg-icon">
                        <Check size={32}/>
                    </div>

                    <p className="msg-texto">{mensagem}</p>

                    <button className="msg-botao" onClick={fechar}>Ok</button>
                </div>
            </div>
        </div>
    );
}