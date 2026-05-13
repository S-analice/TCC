export const empresasMock = [
    {
        id: 1,
        nome: "Transportadora IFPR",
        cnpj: "12345678000199",
        telefone: "41999998888",
        cidade_id: 10,
        cidade_nome: "Curitiba",
        estado_id: 1,
        estado_sigla: "PR",
        status: "Ativo",
    }
];

export const EmpresaModel = {
    buscarTodas: () => empresasMock,
    
    getNomeCompleto: (empresa) => {
        return `${empresa.nome} - ${empresa.cidade_nome}/${empresa.estado_sigla} (CNPJ: ${empresa.cnpj})`;
    }
};