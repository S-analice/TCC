export const MotoristaModel = {
    motoristasIniciais: [
        { id: 1, cpf: "12345678900", placa: "ABC1234", telefone: "41999991111", empresa_nome: "Transportadora A", convenio: "Novo Cliente", status: "Ativo" },
        { id: 2, cpf: "98765432100", placa: "DEF5678", telefone: "41988882222", empresa_nome: "Transportadora B", convenio: "Premium", status: "Ativo" },
        { id: 3, cpf: "45678912300", placa: "GHI9012", telefone: "41977773333", empresa_nome: "Transportadora C", convenio: "Sem Convênio", status: "Ativo" }
    ],

    getInitialData: function() { return this.motoristasIniciais; },

    buscarPorCPF: (motoristas, cpf) => {
        if (!motoristas) return null;
        return motoristas.find(m => m.cpf === cpf);
    }
};