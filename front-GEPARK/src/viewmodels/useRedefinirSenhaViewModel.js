import { useState } from "react"
import { MENSAGENS } from "../utils/mensagens";

export function useRedefinirSenhaViewModel(irParaLogin) {
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [erroValidacao, setErroValidacao] = useState("");
    const [mensagem, setMensagem] = useState({ mostrar: false, tipo: "sucesso", texto: "" });

    const fecharMensagem = () => {
        setMensagem({ ...mensagem, mostrar: false });
        if (mensagem.tipo === "sucesso") {
            irParaLogin(); 
        }
    };

    const redefinir = async (e) => {
    e.preventDefault();
    setErroValidacao("");

    try {
        if (senha.length < 6) throw new Error(MENSAGENS.VALIDACAO.SENHA_CURTA);
        if (senha !== confirmarSenha) throw new Error(MENSAGENS.VALIDACAO.SENHA_IGUAIS);

        setCarregando(true);

        await new Promise(resolve => setTimeout(resolve, 2000));

        setSenha("");
        setConfirmarSenha("");

        setMensagem({
            mostrar: true,
            tipo: "sucesso",
            texto: MENSAGENS.SUCESSO.ATUALIZACAO
        });

    } catch (error) {
        setErroValidacao(error.message);
    } finally {
        setCarregando(false);
    }
};

    return { senha, setSenha, confirmarSenha, setConfirmarSenha, carregando, setCarregando, erroValidacao, mensagem, fecharMensagem, redefinir };
}