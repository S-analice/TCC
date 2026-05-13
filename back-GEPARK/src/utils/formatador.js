 export const limparParaNumeros = (valor) => {
    if (!valor) return "";
    return valor.toString().replace(/\D/g, "");
};

export const limparPlaca = (placa) => {
    if (!placa) return "";
    return placa.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
};


export const formatarDataSQL = (data) => {
    if (!data) return null;
    return new Date(data).toISOString().slice(0, 19).replace('T', ' ');
};