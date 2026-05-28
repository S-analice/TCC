// ============================================
// FUNÇÕES DE LIMPEZA
// ============================================

export const limparParaNumeros = (valor) => {
  if (!valor) return "";
  return valor.toString().replace(/\D/g, "");
};

export const limparPlaca = (placa) => {
  if (!placa) return "";
  return placa.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
};

// ============================================
// FUNÇÕES DE FORMATAÇÃO PARA EXIBIÇÃO
// ============================================

export const formatarCPF = (cpf) => {
  if (!cpf) return "";
  const numeros = cpf.replace(/\D/g, "");
  if (numeros.length !== 11) return cpf;
  return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

export const formatarCNPJ = (cnpj) => {
  if (!cnpj) return "";
  const numeros = cnpj.replace(/\D/g, "");
  if (numeros.length !== 14) return cnpj;
  return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
};

export const formatarTelefone = (telefone) => {
  if (!telefone) return "";
  const numeros = telefone.replace(/\D/g, "");
  if (numeros.length === 11) {
    return numeros.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
  if (numeros.length === 10) {
    return numeros.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  return telefone;
};

export const formatarPlaca = (placa) => {
  if (!placa) return "";
  const valor = placa.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  if (valor.length === 7) {
    return valor.replace(/([A-Z]{3})(\d[A-Z0-9]\d{2})/, "$1-$2");
  }
  return placa;
};

// ============================================
// FUNÇÕES DE FORMATAÇÃO DE DATA/HORA
// ============================================

export const formatarDataSQL = (data) => {
  if (!data) return null;
  return new Date(data).toISOString().slice(0, 19).replace('T', ' ');
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

export const formatarParaDatetimeLocal = (data) => {
  if (!data) return '';
  
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  if (isNaN(dataObj.getTime())) return '';
  
  const ano = dataObj.getFullYear();
  const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
  const dia = String(dataObj.getDate()).padStart(2, '0');
  const horas = String(dataObj.getHours()).padStart(2, '0');
  const minutos = String(dataObj.getMinutes()).padStart(2, '0');
  
  return `${ano}-${mes}-${dia}T${horas}:${minutos}`;
};

export const formatarHora = (data) => {
  if (!data) return '';
  
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  if (isNaN(dataObj.getTime())) return '';
  
  const horas = String(dataObj.getHours()).padStart(2, '0');
  const minutos = String(dataObj.getMinutes()).padStart(2, '0');
  
  return `${horas}:${minutos}`;
};

// ============================================
// FUNÇÕES DE FORMATAÇÃO DE TEMPO
// ============================================

export const formatarTempoPermanencia = (minutos) => {
  if (!minutos && minutos !== 0) return '0h';
  
  const horas = Math.floor(minutos / 60);
  const minutosRestantes = Math.round(minutos % 60);
  
  if (horas > 0 && minutosRestantes > 0) {
    return `${horas}h ${minutosRestantes}m`;
  } else if (horas > 0) {
    return `${horas}h`;
  } else if (minutosRestantes > 0) {
    return `${minutosRestantes}m`;
  }
  return '< 1m';
};

// ============================================
// FUNÇÃO PARA CONVERTER ARQUIVO PARA BASE64
// ============================================

export const converterParaBase64 = (arquivo) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(arquivo);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};