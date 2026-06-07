import * as ChecklistModel from '../models/ChecklistModel.js';
import * as MovimentacaoModel from '../models/MovimentacaoModel.js';
import * as MotoristaModel from '../models/MotoristaModel.js';
import { calcularDataBloqueio } from '../utils/dateHelper.js';

export const criar = async (req, res) => {
  try {
    const { movimentacao_id, motivo, data_desbloqueio } = req.body;
    const funcionario_id = req.usuarioId; 
    
    if (!movimentacao_id || !motivo) {
      return res.status(400).json({ 
        message: 'Movimentação e motivo são obrigatórios' 
      });
    }
    const movimentacao = await MovimentacaoModel.buscarPorId(movimentacao_id);
    if (!movimentacao) {
      return res.status(404).json({ message: 'Movimentação não encontrada' });
    }
    
    if (movimentacao.data_saida) {
      return res.status(400).json({ 
        message: 'Esta movimentação já foi finalizada, não pode ser cancelada' 
      });
    }

    if (movimentacao.status === 'Cancelado') {
      return res.status(400).json({ 
        message: 'Esta movimentação já está cancelada' 
      });
    }
    
    const motorista_id = movimentacao.motorista_id;

    const estaBloqueado = await ChecklistModel.motoristaEstaBloqueado(motorista_id);
    if (estaBloqueado) {
      return res.status(409).json({ 
        message: 'Motorista já está bloqueado. Aguarde o fim do período de bloqueio.' 
      });
    }
    
    const dataFimBloqueio = data_desbloqueio || calcularDataBloqueio(15);
    
    await MotoristaModel.bloquear(motorista_id, dataFimBloqueio);
    
    await MovimentacaoModel.cancelarMovimentacao(movimentacao_id, funcionario_id);
    
    const novoChecklist = await ChecklistModel.criar({
      movimentacao_id,
      funcionario_id,
      motivo,
      data_desbloqueio: dataFimBloqueio
    });
    
    const checklistCriado = await ChecklistModel.buscarPorMovimentacaoId(movimentacao_id);
    
    res.status(201).json({
      message: 'Checklist registrado com sucesso. Motorista bloqueado por 15 dias e movimentação cancelada.',
      checklist: checklistCriado,
      motorista: {
        id: motorista_id,
        status: 'Bloqueado',
        data_fim_bloqueio: dataFimBloqueio
      },
      movimentacao: {
        id: movimentacao_id,
        status: 'Cancelado'
      }
    });
    
  } catch (error) {
    console.error('Erro ao criar checklist:', error);
    res.status(500).json({ message: 'Erro ao registrar checklist' });
  }
};

export const buscarPorMovimentacao = async (req, res) => {
  try {
    const { movimentacaoId } = req.params;
    const checklist = await ChecklistModel.buscarPorMovimentacaoId(movimentacaoId);
    res.json(checklist || null);
  } catch (error) {
    console.error('Erro ao buscar checklist:', error);
    res.status(500).json({ message: 'Erro ao buscar checklist' });
  }
};

export const buscarBloqueioPorMotorista = async (req, res) => {
  try {
    const { motoristaId } = req.params;
    const bloqueio = await ChecklistModel.buscarPorMotoristaId(motoristaId);
    res.json(bloqueio || null);
  } catch (error) {
    console.error('Erro ao buscar bloqueio:', error);
    res.status(500).json({ message: 'Erro ao buscar bloqueio do motorista' });
  }
};

export default {
  criar,
  buscarPorMovimentacao,
  buscarBloqueioPorMotorista
};