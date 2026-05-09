export const formatarCPF = (cpf) => {
    if (!cpf) return "";
    const numeros = cpf.replace(/\D/g, "");
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

export const formatarCNPJ = (cnpj) => {
    if (!cnpj) return "";
    const numeros = cnpj.replace(/\D/g, "");
    return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
};

export const formatarTelefone = (telefone) => {
    if (!telefone) return "";
    const numeros = telefone.replace(/\D/g, "");
    if (numeros.length === 11) {
        return numeros.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return telefone;
};

export const formatarPlaca = (placa) => {
    if (!placa) return "";
    const valor = placa.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    if (valor.length === 7) {
        return valor.replace(/([A-Z]{3})(\d[A-Z]\d{2}|\d{4})/, "$1-$2");
    }
    return placa;
};

export const converterParaBase64 = (arquivo) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(arquivo);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

export const formatarDataBR = (dataString, incluirHorario = true) => {
    if (!dataString) return "";
    const data = new Date(dataString);
    const opcoes = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        ...(incluirHorario && { hour: "2-digit", minute: "2-digit" })
    };
    return data.toLocaleString("pt-BR", opcoes);
};