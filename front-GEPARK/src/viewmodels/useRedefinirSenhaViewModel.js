import { useState } from "react"

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
        if (senha.length < 6) throw new Error("A senha deve ter no mínimo 6 caracteres!");
        if (senha !== confirmarSenha) throw new Error("As senhas não coincidem!");

        setCarregando(true);

        await new Promise(resolve => setTimeout(resolve, 2000));

        setSenha("");
        setConfirmarSenha("");

        setMensagem({
            mostrar: true,
            tipo: "sucesso",
            texto: "Senha redefinida com sucesso!"
        });

    } catch (error) {
        setErroValidacao(error.message);
    } finally {
        setCarregando(false);
    }
};

    return { senha, setSenha, confirmarSenha, setConfirmarSenha, carregando, setCarregando, erroValidacao, mensagem, fecharMensagem, redefinir };
}