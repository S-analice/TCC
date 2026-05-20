import { useState } from "react";
import { FuncionarioModel } from "../models/FuncionarioModel";
import { MENSAGENS } from "../utils/mensagens";

export function useLoginViewModel(definirFuncionario, irParaHome) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState({ mostrar: false, tipo: "sucesso", texto: "" });

    const fecharMensagem = () => setMensagem({ ...mensagem, mostrar: false });

    const enviarFormulario = async (e) => {
        e.preventDefault();
        setCarregando(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const usuario = FuncionarioModel.validarLogin(email, senha);

            if (!usuario) throw new Error(MENSAGENS.ERRO.EMAIL_SENHA_INVALIDO);

            definirFuncionario(usuario);
            irParaHome();
        } catch {
            setMensagem({ mostrar: true, tipo: "erro", texto: MENSAGENS.ERRO.GERAL });
        } finally {
            setCarregando(false);
        }
    };

    return { email, setEmail, senha, setSenha, carregando, setCarregando, mensagem, fecharMensagem, enviarFormulario };
}