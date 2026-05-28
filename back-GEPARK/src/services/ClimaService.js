import axios from "axios";

// Buscar clima por coordenadas geográficas
export const buscarClimaPorCoordenadas = async (latitude, longitude) => {
  try {
    // Usando API OpenWeatherMap (gratuita)
    // Você precisa se cadastrar em https://openweathermap.org/api para obter uma API key
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      console.warn("OPENWEATHER_API_KEY não configurada. Usando dados mock.");
      return getMockClima();
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=pt_br`,
    );

    return {
      temperatura: Math.round(response.data.main.temp),
      descricao: response.data.weather[0].description,
      cidade: response.data.name,
      icone: response.data.weather[0].icon,
      umidade: response.data.main.humidity,
      vento: response.data.wind.speed,
    };
  } catch (error) {
    console.error("Erro ao buscar clima na API:", error.message);
    return getMockClima();
  }
};

// Buscar clima por nome da cidade
export const buscarClimaPorCidade = async (cidade) => {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      console.warn("OPENWEATHER_API_KEY não configurada. Usando dados mock.");
      return getMockClima();
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&units=metric&lang=pt_br`,
    );

    return {
      temperatura: Math.round(response.data.main.temp),
      descricao: response.data.weather[0].description,
      icone: response.data.weather[0].icon,
    };
  } catch (error) {
    console.error("Erro ao buscar clima por cidade:", error.message);
    return getMockClima();
  }
};

const getMockClima = () => {
  return {
    temperatura: "Não disponível",
    descricao: "Não disponível",
    icone: "02d",
  };
};

export const buscarClimaPorIP = async () => {
  try {
    const ipResponse = await axios.get("https://ipapi.co/json/");
    const { city, latitude, longitude } = ipResponse.data;

    if (latitude && longitude) {
      return await buscarClimaPorCoordenadas(latitude, longitude);
    } else if (city) {
      return await buscarClimaPorCidade(city);
    }

    return getMockClima();
  } catch (error) {
    console.error("Erro ao buscar clima por IP:", error.message);
    return getMockClima();
  }
};
