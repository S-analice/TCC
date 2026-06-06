export const ChecklistModel = {
  registrosIniciais: [
    {
      id: 1,
      motorista_id: 1,
      motorista_cpf: "12345678900",
      motorista_placa: "ABC1234",
      data_bloqueio: "2026-06-01T08:00:00",
      data_desbloqueio: "2026-06-08T08:00:00",
      motivo: "Checklist - Documentação irregular",
      funcionario_id: 1,
      funcionario_nome: "João Silva",
      status: "Bloqueado",  
      created_at: "2026-06-01T08:00:00",
      updated_at: "2026-06-01T08:00:00"
    },
    {
      id: 2,
      motorista_id: 2,
      motorista_cpf: "98765432100",
      motorista_placa: "DEF5678",
      data_bloqueio: "2026-06-02T10:30:00",
      data_desbloqueio: "2026-06-05T10:30:00",
      motivo: "Checklist - Veículo com irregularidades",
      funcionario_id: 2,
      funcionario_nome: "Maria Santos",
      status: "Bloqueado", 
      created_at: "2026-06-02T10:30:00",
      updated_at: "2026-06-02T10:30:00"
    }
  ],

  getInitialData: function() {
    return this.registrosIniciais;
  },

  getByMotoristaId: (checklists, motoristaId) => {
    if (!checklists || !motoristaId) return null;
    return checklists.find(c => c.motorista_id === motoristaId && c.status === "Bloqueado");  // ALTERADO
  },

  salvarChecklist: (checklists, novoChecklist) => {
    const existente = checklists.find(c => c.motorista_id === novoChecklist.motorista_id && c.status === "Bloqueado");  // ALTERADO
    
    if (existente) {
      return checklists.map(c => 
        c.id === existente.id 
          ? { ...c, ...novoChecklist, updated_at: new Date().toISOString() }
          : c
      );
    }
    
    return [...checklists, { ...novoChecklist, id: Date.now(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() }];
  }
};