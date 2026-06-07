import * as MotoristaModel from '../models/MotoristaModel.js';
import { limparParaNumeros, limparPlaca } from '../utils/formatador.js';

const calcularVencimentoConvenio = () => {
  const data = new Date();
  data.setDate(data.getDate() + 90);
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  const horas = String(data.getHours()).padStart(2, '0');
  const minutos = String(data.getMinutes()).padStart(2, '0');
  const segundos = String(data.getSeconds()).padStart(2, '0');
  return `${ano}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
};

export const listar = async (req, res) => {
  try {
    const { status = 'todos', busca = '', page = 1, limit = 100 } = req.query;
    
    await MotoristaModel.atualizarBloqueiosExpirados();
    
    const resultado = await MotoristaModel.buscarComFiltros({
      pesquisa: busca,
      status,
      page: parseInt(page),
      limit: parseInt(limit)
    });
    
    res.json(resultado);
  } catch (error) {
    console.error('Erro ao listar motoristas:', error);
    res.status(500).json({ message: 'Erro ao buscar motoristas' });
  }
};

export const buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const motorista = await MotoristaModel.buscarPorId(id);
    
    if (!motorista) {
      return res.status(404).json({ message: 'Motorista não encontrado' });
    }
    
    res.json(motorista);
  } catch (error) {
    console.error('Erro ao buscar motorista:', error);
    res.status(500).json({ message: 'Erro ao buscar motorista' });
  }
};

export const buscarPorCpf = async (req, res) => {
  try {
    const { cpf } = req.params;
    const cpfLimpo = limparParaNumeros(cpf);
    const motorista = await MotoristaModel.buscarPorCpf(cpfLimpo);
    
    if (!motorista) {
      return res.status(404).json({ message: 'Motorista não encontrado' });
    }
    
    res.json(motorista);
  } catch (error) {
    console.error('Erro ao buscar motorista por CPF:', error);
    res.status(500).json({ message: 'Erro ao buscar motorista' });
  }
};

export const criar = async (req, res) => {
  try {
    const { cpf, placa, telefone, empresa_id, convenio_id } = req.body;
    
    if (!cpf || !placa || !telefone) {
      return res.status(400).json({ message: 'CPF, placa e telefone são obrigatórios' });
    }
    
    const cpfNumeros = limparParaNumeros(cpf);
    if (cpfNumeros.length !== 11) {
      return res.status(400).json({ message: 'CPF deve conter 11 dígitos' });
    }
    
    const placaLimpa = limparPlaca(placa);
    if (placaLimpa.length !== 7) {
      return res.status(400).json({ message: 'Placa deve conter 7 caracteres' });
    }
    
    const telefoneNumeros = limparParaNumeros(telefone);
    if (telefoneNumeros.length !== 11 && telefoneNumeros.length !== 10) {
      return res.status(400).json({ message: 'Telefone deve conter 10 ou 11 dígitos' });
    }
    
    const cpfExistente = await MotoristaModel.buscarPorCpf(cpf);
    if (cpfExistente) {
      return res.status(409).json({ message: 'Este CPF já está cadastrado' });
    }
    
    const placaExistente = await MotoristaModel.buscarPorPlaca(placa);
    if (placaExistente) {
      return res.status(409).json({ message: 'Esta placa já está cadastrada' });
    }
    
    const dataVencimentoConvenio = convenio_id ? calcularVencimentoConvenio() : null;
    
    const novoMotorista = await MotoristaModel.criar({
      cpf,
      placa,
      telefone,
      empresa_id: empresa_id || null,
      convenio_id: convenio_id || null,
      data_vencimento_convenio: dataVencimentoConvenio
    });
    
    const motoristaCriado = await MotoristaModel.buscarPorId(novoMotorista.id);
    
    res.status(201).json(motoristaCriado);
  } catch (error) {
    console.error('Erro ao criar motorista:', error);
    res.status(500).json({ message: 'Erro ao criar motorista' });
  }
};

export const atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { cpf, placa, telefone, empresa_id, convenio_id, status } = req.body;
    
    const motoristaExistente = await MotoristaModel.buscarPorId(id);
    if (!motoristaExistente) {
      return res.status(404).json({ message: 'Motorista não encontrado' });
    }
    
    if (cpf && cpf !== motoristaExistente.cpf) {
      const cpfExistente = await MotoristaModel.buscarPorCpf(cpf);
      if (cpfExistente) {
        return res.status(409).json({ message: 'Este CPF já está cadastrado' });
      }
    }
    
    if (placa && placa !== motoristaExistente.placa) {
      const placaExistente = await MotoristaModel.buscarPorPlaca(placa);
      if (placaExistente) {
        return res.status(409).json({ message: 'Esta placa já está cadastrada' });
      }
    }
    
    if (telefone) {
      const telefoneNumeros = limparParaNumeros(telefone);
      if (telefoneNumeros.length !== 11 && telefoneNumeros.length !== 10) {
        return res.status(400).json({ message: 'Telefone deve conter 10 ou 11 dígitos' });
      }
    }
    
    let dataVencimentoConvenio = motoristaExistente.data_vencimento_convenio;
    if (convenio_id !== undefined && convenio_id !== motoristaExistente.convenio_id) {
      if (convenio_id) {
        dataVencimentoConvenio = calcularVencimentoConvenio();
      } else {
        dataVencimentoConvenio = null;
      }
    }
    
    const atualizado = await MotoristaModel.atualizar(id, {
      cpf: cpf || motoristaExistente.cpf,
      placa: placa || motoristaExistente.placa,
      telefone: telefone || motoristaExistente.telefone,
      empresa_id: empresa_id !== undefined ? empresa_id : motoristaExistente.empresa_id,
      convenio_id: convenio_id !== undefined ? convenio_id : motoristaExistente.convenio_id,
      status: status || motoristaExistente.status,
      data_vencimento_convenio: dataVencimentoConvenio
    });
    
    if (!atualizado) {
      return res.status(400).json({ message: 'Erro ao atualizar motorista' });
    }
    
    const motoristaAtualizado = await MotoristaModel.buscarPorId(id);
    res.json(motoristaAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar motorista:', error);
    res.status(500).json({ message: 'Erro ao atualizar motorista' });
  }
};

export const inativar = async (req, res) => {
  try {
    const { id } = req.params;
    
    const motoristaExistente = await MotoristaModel.buscarPorId(id);
    if (!motoristaExistente) {
      return res.status(404).json({ message: 'Motorista não encontrado' });
    }
    
    if (motoristaExistente.status === 'Inativo') {
      return res.status(400).json({ message: 'Motorista já está inativo' });
    }
    
    const inativado = await MotoristaModel.inativar(id);
    
    if (!inativado) {
      return res.status(400).json({ message: 'Erro ao inativar motorista' });
    }
    
    res.json({ message: 'Motorista inativado com sucesso' });
  } catch (error) {
    console.error('Erro ao inativar motorista:', error);
    res.status(500).json({ message: 'Erro ao inativar motorista' });
  }
};

export const listarConvenios = async (req, res) => {
  try {
    const convenios = await MotoristaModel.buscarConvenios();
    res.json(convenios);
  } catch (error) {
    console.error('Erro ao buscar convênios:', error);
    res.status(500).json({ message: 'Erro ao buscar convênios' });
  }
};

export const bloquear = async (req, res) => {
  try {
    const { id } = req.params;
    const { data_fim_bloqueio } = req.body;
    
    const motoristaExistente = await MotoristaModel.buscarPorId(id);
    if (!motoristaExistente) {
      return res.status(404).json({ message: 'Motorista não encontrado' });
    }
    
    if (motoristaExistente.status === 'Bloqueado') {
      return res.status(400).json({ message: 'Motorista já está bloqueado' });
    }
    
    const atualizado = await MotoristaModel.bloquear(id, data_fim_bloqueio);
    
    if (!atualizado) {
      return res.status(400).json({ message: 'Erro ao bloquear motorista' });
    }
    
    const motoristaAtualizado = await MotoristaModel.buscarPorId(id);
    res.json({
      message: 'Motorista bloqueado com sucesso',
      motorista: motoristaAtualizado
    });
  } catch (error) {
    console.error('Erro ao bloquear motorista:', error);
    res.status(500).json({ message: 'Erro ao bloquear motorista' });
  }
};