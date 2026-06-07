export const getDataHoraBrasil = () => {
  const agora = new Date();
  const offsetBrasil = -3 * 60; 
  const brasilTime = new Date(agora.getTime() + (offsetBrasil - agora.getTimezoneOffset()) * 60000);
  return brasilTime;
};

export const formatarParaMySQL = (data) => {
  if (!data) return null;
  
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  if (isNaN(dataObj.getTime())) return null;
  
  const ano = dataObj.getFullYear();
  const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
  const dia = String(dataObj.getDate()).padStart(2, '0');
  const horas = String(dataObj.getHours()).padStart(2, '0');
  const minutos = String(dataObj.getMinutes()).padStart(2, '0');
  const segundos = String(dataObj.getSeconds()).padStart(2, '0');
  
  return `${ano}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
};

// Obter data atual no formato YYYY-MM-DD (para comparação no banco)
export const getDataHojeMySQL = () => {
  const data = getDataHoraBrasil();
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
};

export const converterFrontendDate = (dataFrontend) => {
  if (!dataFrontend) return getDataHoraBrasil();
  
  const [data, hora] = dataFrontend.split('T');
  const [ano, mes, dia] = data.split('-');
  const [horas, minutos] = hora.split(':');
  
  return new Date(ano, parseInt(mes) - 1, dia, horas, minutos, 0);
};

export const formatarDataBR = (data, incluirHorario = true) => {
  if (!data) return '';
  
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  if (isNaN(dataObj.getTime())) return '';
  
  const dia = String(dataObj.getDate()).padStart(2, '0');
  const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
  const ano = dataObj.getFullYear();
  
  if (!incluirHorario) {
    return `${dia}/${mes}/${ano}`;
  }
  
  const horas = String(dataObj.getHours()).padStart(2, '0');
  const minutos = String(dataObj.getMinutes()).padStart(2, '0');
  
  return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
};

export const formatarHora = (data) => {
  if (!data) return '';
  
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  if (isNaN(dataObj.getTime())) return '';
  
  const horas = String(dataObj.getHours()).padStart(2, '0');
  const minutos = String(dataObj.getMinutes()).padStart(2, '0');
  
  return `${horas}:${minutos}`;
};

export const calcularDataBloqueio = (dias = 15) => {
  const data = new Date();
  data.setDate(data.getDate() + dias);
  
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  const horas = String(data.getHours()).padStart(2, '0');
  const minutos = String(data.getMinutes()).padStart(2, '0');
  const segundos = String(data.getSeconds()).padStart(2, '0');
  
  return `${ano}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
};