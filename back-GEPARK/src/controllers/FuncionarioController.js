import * as FuncionarioModel from '../models/FuncionarioModel.js';
import { gerarHash } from '../utils/passwordHash.js';
import { limparParaNumeros } from '../utils/formatador.js';

export const listar = async (req, res) => {
  try {
    const { status = 'todos', busca = '', page = 1, limit = 100 } = req.query;
    
    const resultado = await FuncionarioModel.buscarComFiltros({
      pesquisa: busca,
      status,
      page: parseInt(page),
      limit: parseInt(limit)
    });
    
    res.json(resultado);
  } catch (error) {
    console.error('Erro ao listar funcionários:', error);
    res.status(500).json({ message: 'Erro ao buscar funcionários' });
  }
};

export const buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const funcionario = await FuncionarioModel.buscarPorId(id);
    
    if (!funcionario) {
      return res.status(404).json({ message: 'Funcionário não encontrado' });
    }
    
    delete funcionario.senha;
    
    res.json(funcionario);
  } catch (error) {
    console.error('Erro ao buscar funcionário:', error);
    res.status(500).json({ message: 'Erro ao buscar funcionário' });
  }
};

export const criar = async (req, res) => {
  try {
    const { nome, email, senha, telefone, turno_id, cargo_id, foto } = req.body;
    
    if (!nome || !email || !senha || !telefone || !turno_id || !cargo_id) {
      return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos' });
    }
    
    if (senha.length < 6) {
      return res.status(400).json({ message: 'A senha deve ter no mínimo 6 caracteres' });
    }
    
    const telefoneNumeros = limparParaNumeros(telefone);
    if (telefoneNumeros.length !== 11) {
      return res.status(400).json({ message: 'Telefone deve conter 11 dígitos' });
    }
    
    const emailExistente = await FuncionarioModel.buscarPorEmail(email);
    if (emailExistente) {
      return res.status(409).json({ message: 'Este e-mail já está cadastrado' });
    }
    
    const novoFuncionario = await FuncionarioModel.criar({
      nome,
      email,
      senha,
      telefone,
      turno_id,
      cargo_id,
      foto
    });
    
    const funcionarioCriado = await FuncionarioModel.buscarPorId(novoFuncionario.id);
    delete funcionarioCriado.senha;
    
    res.status(201).json(funcionarioCriado);
  } catch (error) {
    console.error('Erro ao criar funcionário:', error);
    res.status(500).json({ message: 'Erro ao criar funcionário' });
  }
};

export const atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, telefone, turno_id, cargo_id, status, foto } = req.body;
    
    // Verificar se funcionário existe
    const funcionarioExistente = await FuncionarioModel.buscarPorId(id);
    if (!funcionarioExistente) {
      return res.status(404).json({ message: 'Funcionário não encontrado' });
    }
    
    if (email && email !== funcionarioExistente.email) {
      const emailExistente = await FuncionarioModel.buscarPorEmail(email);
      if (emailExistente) {
        return res.status(409).json({ message: 'Este e-mail já está cadastrado' });
      }
    }
    
    if (telefone) {
      const telefoneNumeros = limparParaNumeros(telefone);
      if (telefoneNumeros.length !== 11) {
        return res.status(400).json({ message: 'Telefone deve conter 11 dígitos' });
      }
    }
    
    const atualizado = await FuncionarioModel.atualizar(id, {
      nome: nome || funcionarioExistente.nome,
      email: email || funcionarioExistente.email,
      telefone: telefone || funcionarioExistente.telefone,
      turno_id: turno_id || funcionarioExistente.turno_id,
      cargo_id: cargo_id || funcionarioExistente.cargo_id,
      status: status || funcionarioExistente.status,
      foto: foto !== undefined ? foto : funcionarioExistente.foto
    });
    
    if (!atualizado) {
      return res.status(400).json({ message: 'Erro ao atualizar funcionário' });
    }
    
    const funcionarioAtualizado = await FuncionarioModel.buscarPorId(id);
    delete funcionarioAtualizado.senha;
    
    res.json(funcionarioAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar funcionário:', error);
    res.status(500).json({ message: 'Erro ao atualizar funcionário' });
  }
};

export const inativar = async (req, res) => {
  try {
    const { id } = req.params;
    
    const funcionarioExistente = await FuncionarioModel.buscarPorId(id);
    if (!funcionarioExistente) {
      return res.status(404).json({ message: 'Funcionário não encontrado' });
    }
    
    if (funcionarioExistente.status === 'Inativo') {
      return res.status(400).json({ message: 'Funcionário já está inativo' });
    }
    
    const inativado = await FuncionarioModel.inativar(id);
    
    if (!inativado) {
      return res.status(400).json({ message: 'Erro ao inativar funcionário' });
    }
    
    res.json({ message: 'Funcionário inativado com sucesso' });
  } catch (error) {
    console.error('Erro ao inativar funcionário:', error);
    res.status(500).json({ message: 'Erro ao inativar funcionário' });
  }
};

export const listarTurnos = async (req, res) => {
  try {
    console.log('Buscando turnos...');
    const turnos = await FuncionarioModel.buscarTurnos();
    console.log('Turnos encontrados:', turnos);
    res.json(turnos);
  } catch (error) {
    console.error('Erro ao buscar turnos:', error);
    res.status(500).json({ message: 'Erro ao buscar turnos' });
  }
};

export const listarCargos = async (req, res) => {
  try {
    const cargos = await FuncionarioModel.buscarCargos();
    res.json(cargos);
  } catch (error) {
    console.error('Erro ao buscar cargos:', error);
    res.status(500).json({ message: 'Erro ao buscar cargos' });
  }
};