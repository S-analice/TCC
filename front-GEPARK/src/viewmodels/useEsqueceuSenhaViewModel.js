import { useState } from "react";
import { FuncionarioModel } from "../models/FuncionarioModel";

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

            if (!existe) throw new Error("E-mail não cadastrado.");

            setMensagem({ mostrar: true, tipo: "sucesso", texto: "Instruções enviadas para seu e-mail!" });
            setEmail("");
        } catch (error) {
            setMensagem({ mostrar: true, tipo: "erro", texto: error.message });
        } finally {
            setCarregando(false);
        }
    };

    return { email, setEmail, carregando, setCarregando, mensagem, fecharMensagem, enviarSolicitacao };
}
