export const turnosMock = [
    { id: 1, nome: "Diurno", inicio: "06:00", fim: "18:00" },
    { id: 2, nome: "Noturno", inicio: "18:00", fim: "06:00" },
    { id: 3, nome: "Administrativo", inicio: "08:00", fim: "17:00" }
];

export const cargosMock = [
    { id: 1, nome: "Líder"},
    { id: 2, nome: "Equipe"}
];

export const funcionariosMock = [
    {
        id: 1,
        nome: "Lilo",
        email: "lilo@gmail.com",
        senha: "123456",
        telefone: "41991234567",
        turnoId: 3,
        cargoId: 1,
        status: "Ativo",
        foto: "/lilo.jpg"
    },
    {
        id: 2,
        nome: "Analice Santos",
        email: "analice.santos@gmail.com",
        senha: "123456",
        telefone: "41992587344",
        turnoId: 1,
        cargoId: 2,
        status: "Ativo",
        foto: ""
    },
    {
        id: 3,
        nome: "João Silva",
        email: "joao.silva@gmail.com",
        senha: "123456",
        telefone: "41999991111",
        turnoId: 1,
        cargoId: 2,
        status: "Ativo",
        foto: "/joao.jpg"
    },
    {
        id: 4,
        nome: "Maria Santos",
        email: "maria.santos@gmail.com",
        senha: "123456",
        telefone: "41988882222",
        turnoId: 1,
        cargoId: 2,
        status: "Ativo",
        foto: "/maria.jpg"
    }
];

export const FuncionarioModel = {
    buscarTodos: () => funcionariosMock,
    buscarTurnos: () => turnosMock,
    buscarCargos: () => cargosMock,
    validarLogin: (email, senha) => {
        return funcionariosMock.find(f => f.email === email && f.senha === senha);
    },
    buscarPorEmail: (email) => {
        return funcionariosMock.find(f => f.email.toLowerCase() === email.toLowerCase());
    }
};