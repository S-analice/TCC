export const HomeModel = {
  // Busca dados de clima usando a API
  buscarClima: async (lat, lon) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${import.meta.env.VITE_API_KEY}`
      );
      if (!response.ok) throw new Error("Erro ao buscar clima");
      const dados = await response.json();
      return {
        temperatura: Math.round(dados.main.temp),
        descricao: dados.weather[0].description,
      };
    } catch (error) {
      console.error("Falha na API de Clima:", error);
      throw error;
    }
  },

  obterSaudacaoCompleta: (funcionario) => {
    const hoje = new Date();
    const dataFormatada = hoje.toLocaleDateString("pt-BR");
    const turno = funcionario?.turno || "... - ...";
    const [inicio, fim] = turno.split(" - ");
    
    return {
      nome: funcionario?.nome || "Funcionário",
      data: dataFormatada,
      inicio,
      fim
    };
  }
};