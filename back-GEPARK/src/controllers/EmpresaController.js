import * as EmpresaModel from '../models/EmpresaModel.js';
import { limparParaNumeros } from '../utils/formatador.js';
import db from '../config/db.js';

export const listar = async (req, res) => {
  try {
    const { status = 'todos', busca = '', page = 1, limit = 100 } = req.query;
    
    const resultado = await EmpresaModel.buscarComFiltros({
      pesquisa: busca,
      status,
      page: parseInt(page),
      limit: parseInt(limit)
    });
    
    res.json(resultado);
  } catch (error) {
    console.error('Erro ao listar empresas:', error);
    res.status(500).json({ message: 'Erro ao buscar empresas' });
  }
};

export const buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const empresa = await EmpresaModel.buscarPorId(id);
    
    if (!empresa) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }
    
    res.json(empresa);
  } catch (error) {
    console.error('Erro ao buscar empresa:', error);
    res.status(500).json({ message: 'Erro ao buscar empresa' });
  }
};

export const criar = async (req, res) => {
  try {
    const { nome, cnpj, telefone, cidade_id } = req.body;
    
    console.log('Dados recebidos para criar empresa:', req.body);
    
    if (!nome || !cnpj || !telefone || !cidade_id) {
      return res.status(400).json({ 
        message: 'Todos os campos são obrigatórios: nome, cnpj, telefone, cidade_id' 
      });
    }
    
    const cnpjNumeros = limparParaNumeros(cnpj);
    if (cnpjNumeros.length !== 14) {
      return res.status(400).json({ message: 'CNPJ deve conter 14 dígitos' });
    }
    
    const telefoneNumeros = limparParaNumeros(telefone);
    if (telefoneNumeros.length !== 11 && telefoneNumeros.length !== 10) {
      return res.status(400).json({ message: 'Telefone deve conter 10 ou 11 dígitos' });
    }
    
    const [cidade] = await db.query('SELECT id, estado_id FROM cidade WHERE id = ?', [cidade_id]);
    if (cidade.length === 0) {
      return res.status(400).json({ 
        message: `Cidade com ID ${cidade_id} não encontrada. Verifique se a cidade existe.` 
      });
    }
    
    const cnpjExistente = await EmpresaModel.buscarPorCnpj(cnpj);
    if (cnpjExistente) {
      return res.status(409).json({ message: 'Este CNPJ já está cadastrado' });
    }
    
    const novaEmpresa = await EmpresaModel.criar({
      nome,
      cnpj,
      telefone,
      cidade_id
    });
    
    const empresaCriada = await EmpresaModel.buscarPorId(novaEmpresa.id);
    
    res.status(201).json(empresaCriada);
  } catch (error) {
    console.error('Erro detalhado ao criar empresa:', error);
    res.status(500).json({ 
      message: 'Erro ao criar empresa', 
      error: error.message,
      detalhe: error.sqlMessage 
    });
  }
};

export const atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, cnpj, telefone, cidade_id, status } = req.body;
    
    const empresaExistente = await EmpresaModel.buscarPorId(id);
    if (!empresaExistente) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }
    
    if (cnpj && cnpj !== empresaExistente.cnpj) {
      const cnpjExistente = await EmpresaModel.buscarPorCnpj(cnpj);
      if (cnpjExistente) {
        return res.status(409).json({ message: 'Este CNPJ já está cadastrado' });
      }
    }
    
    if (telefone) {
      const telefoneNumeros = limparParaNumeros(telefone);
      if (telefoneNumeros.length !== 11) {
        return res.status(400).json({ message: 'Telefone deve conter 11 dígitos' });
      }
    }
    
    const atualizado = await EmpresaModel.atualizar(id, {
      nome: nome || empresaExistente.nome,
      cnpj: cnpj || empresaExistente.cnpj,
      telefone: telefone || empresaExistente.telefone,
      cidade_id: cidade_id || empresaExistente.cidade_id,
      status: status || empresaExistente.status
    });
    
    if (!atualizado) {
      return res.status(400).json({ message: 'Erro ao atualizar empresa' });
    }
    
    const empresaAtualizada = await EmpresaModel.buscarPorId(id);
    
    res.json(empresaAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar empresa:', error);
    res.status(500).json({ message: 'Erro ao atualizar empresa' });
  }
};

export const inativar = async (req, res) => {
  try {
    const { id } = req.params;
    
    const empresaExistente = await EmpresaModel.buscarPorId(id);
    if (!empresaExistente) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }
    
    if (empresaExistente.status === 'Inativo') {
      return res.status(400).json({ message: 'Empresa já está inativa' });
    }
    
    const inativado = await EmpresaModel.inativar(id);
    
    if (!inativado) {
      return res.status(400).json({ message: 'Erro ao inativar empresa' });
    }
    
    res.json({ message: 'Empresa inativada com sucesso' });
  } catch (error) {
    console.error('Erro ao inativar empresa:', error);
    res.status(500).json({ message: 'Erro ao inativar empresa' });
  }
};