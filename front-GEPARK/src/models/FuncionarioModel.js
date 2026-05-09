export const funcionariosMock = [
    {
        id: 1,
        nome: "Lilo",
        email: "lilo@gmail.com",
        senha: "123456",
        telefone: "41991234567",
        turno: "06:00 - 18:00",
        cargo: "Líder",
        status: "Ativo",
        foto: "/lilo.jpg"
    },
    {
        id: 2,
        nome: "Analice Santos",
        email: "analice.santos@gmail.com",
        senha: "123456",
        telefone: "41992587344",
        turno: "08:00 - 18:00",
        cargo: "Equipe",
        status: "Ativo",
        foto: ""
    },
    {
        id: 3,
        nome: "João Silva",
        email: "joao.silva@gmail.com",
        senha: "123456",
        telefone: "41999991111",
        turno: "06:00 - 18:00",
        cargo: "Equipe",
        status: "Ativo",
        foto: "/joao.jpg"
    },
    {
        id: 4,
        nome: "Maria Santos",
        email: "maria.santos@gmail.com",
        senha: "123456",
        telefone: "41988882222",
        turno: "18:00 - 06:00",
        cargo: "Equipe",
        status: "Ativo",
        foto: "/maria.jpg"
    }
];

export const FuncionarioModel = {
    buscarTodos: () => funcionariosMock,
    validarLogin: (email, senha) => {
        return funcionariosMock.find(f => f.email === email && f.senha === senha);
    },
    buscarPorEmail: (email) => {
        return funcionariosMock.find(f => f.email.toLowerCase() === email.toLowerCase());
    }
};