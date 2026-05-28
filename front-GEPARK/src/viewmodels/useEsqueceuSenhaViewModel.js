import { useState } from "react";
import { FuncionarioModel } from "../models/FuncionarioModel";
import { MENSAGENS } from "../utils/mensagens";

export function useEsqueceuSenhaViewModel(voltarParaLogin) {
    const [email, setEmail] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState({ mostrar: false, tipo: "sucesso", texto: "" });

    const fecharMensagem = () => {
        setMensagem({ ...mensagem, mostrar: false });
        if (mensagem.tipo === "sucesso") {
            voltarParaLogin();
        }
    };

    const enviarSolicitacao = async (e) => {
        e.preventDefault();
        setCarregando(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const existe = FuncionarioModel.buscarPorEmail(email);

            if (!existe) throw new Error(MENSAGENS.ERRO.EMAIL_INVALIDO);

            setMensagem({ mostrar: true, tipo: "sucesso", texto: MENSAGENS.SUCESSO.EMAIL_ENVIADO });
            setEmail("");
        } catch {
            setMensagem({ mostrar: true, tipo: "erro", texto: MENSAGENS.ERRO.GERAL });
        } finally {
            setCarregando(false);
        }
    };

    return { email, setEmail, carregando, setCarregando, mensagem, fecharMensagem, enviarSolicitacao };
}
