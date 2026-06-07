import * as MovimentacaoModel from '../models/MovimentacaoModel.js';
import * as MotoristaModel from '../models/MotoristaModel.js';
import { calcularValorEstadia } from '../services/CalculoService.js';
import { converterFrontendDate, formatarParaMySQL, getDataHoraBrasil } from '../utils/dateHelper.js';

export const listar = async (req, res) => {
  try {
    const { dataInicio, dataFim, page = 1, limit = 100 } = req.query;
    
    const resultado = await MovimentacaoModel.buscarComFiltros({
      dataInicio,
      dataFim,
      page: parseInt(page),
      limit: parseInt(limit)
    });
    
    res.json(resultado);
  } catch (error) {
    console.error('Erro ao listar movimentações:', error);
    res.status(500).json({ message: 'Erro ao buscar movimentações' });
  }
};

export const buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const movimentacao = await MovimentacaoModel.buscarPorId(id);
    
    if (!movimentacao) {
      return res.status(404).json({ message: 'Movimentação não encontrada' });
    }
    
    res.json(movimentacao);
  } catch (error) {
    console.error('Erro ao buscar movimentação:', error);
    res.status(500).json({ message: 'Erro ao buscar movimentação' });
  }
};

export const listarAtivas = async (req, res) => {
  try {
    const movimentacoes = await MovimentacaoModel.buscarMovimentacoesAtivas();
    const ativas = movimentacoes.filter(m => m.status !== 'Cancelado');
    res.json(ativas);
  } catch (error) {
    console.error('Erro ao buscar movimentações ativas:', error);
    res.status(500).json({ message: 'Erro ao buscar veículos no pátio' });
  }
};

export const registrarEntrada = async (req, res) => {
  try {
    const { cpf, placa, dataEntrada } = req.body;
    const funcionarioId = req.usuarioId;
    
    if (!cpf && !placa) {
      return res.status(400).json({ message: 'CPF ou placa do motorista é obrigatório' });
    }
    
    let motorista = null;
    if (cpf) {
      motorista = await MotoristaModel.buscarPorCpf(cpf);
    } else if (placa) {
      motorista = await MotoristaModel.buscarPorPlaca(placa);
    }
    
    if (!motorista) {
      return res.status(404).json({ message: 'Motorista não encontrado' });
    }
    
    // VERIFICAR SE MOTORISTA ESTÁ BLOQUEADO
    if (motorista.status === 'Bloqueado') {
      // Verificar se o bloqueio já expirou
      if (motorista.data_fim_bloqueio && new Date(motorista.data_fim_bloqueio) <= new Date()) {
        // Bloqueio expirado - atualizar automaticamente
        await MotoristaModel.atualizarBloqueiosExpirados();
        motorista.status = 'Ativo';
      } else {
        const diasRestantes = Math.ceil((new Date(motorista.data_fim_bloqueio) - new Date()) / (1000 * 60 * 60 * 24));
        return res.status(403).json({ 
          message: `Motorista bloqueado por checklist. Desbloqueio em ${diasRestantes} dias.` 
        });
      }
    }
    
    if (motorista.status !== 'Ativo') {
      return res.status(403).json({ message: 'Motorista inativo. Não é possível registrar entrada.' });
    }
    
    const noPatio = await MovimentacaoModel.verificarVeiculoNoPatio(motorista.id);
    if (noPatio) {
      return res.status(409).json({ message: 'Motorista já possui um veículo no pátio' });
    }
    
    let dataEntradaFormatada;
    if (dataEntrada) {
      const dataConvertida = converterFrontendDate(dataEntrada);
      dataEntradaFormatada = formatarParaMySQL(dataConvertida);
    } else {
      dataEntradaFormatada = formatarParaMySQL(getDataHoraBrasil());
    }
    
    const novaMovimentacao = await MovimentacaoModel.registrarEntrada({
      motorista_id: motorista.id,
      funcionario_entrada_id: funcionarioId,
      data_entrada: dataEntradaFormatada
    });
    
    const movimentacaoCriada = await MovimentacaoModel.buscarPorId(novaMovimentacao.id);
    
    res.status(201).json({
      message: 'Entrada registrada com sucesso',
      movimentacao: movimentacaoCriada
    });
  } catch (error) {
    console.error('Erro ao registrar entrada:', error);
    res.status(500).json({ message: 'Erro ao registrar entrada' });
  }
};

export const registrarSaida = async (req, res) => {
  try {
    const { id } = req.params;
    const { dataSaida, tipo_pagamento_id } = req.body;
    const funcionarioId = req.usuarioId;
    
    if (!tipo_pagamento_id) {
      return res.status(400).json({ message: 'Forma de pagamento é obrigatória' });
    }
    
    const movimentacao = await MovimentacaoModel.buscarPorId(id);
    if (!movimentacao) {
      return res.status(404).json({ message: 'Movimentação não encontrada' });
    }
    
    if (movimentacao.data_saida) {
      return res.status(400).json({ message: 'Esta movimentação já foi finalizada' });
    }
    
    const motorista = await MotoristaModel.buscarPorId(movimentacao.motorista_id);
    
    let convenio = null;
    if (motorista.convenio_id) {
      const convenios = await MotoristaModel.buscarConvenios();
      convenio = convenios.find(c => c.id === motorista.convenio_id);
    }
    
    let dataSaidaFormatada;
    if (dataSaida) {
      const dataConvertida = converterFrontendDate(dataSaida);
      dataSaidaFormatada = formatarParaMySQL(dataConvertida);
    } else {
      dataSaidaFormatada = formatarParaMySQL(getDataHoraBrasil());
    }
    
    const calculo = calcularValorEstadia(movimentacao.data_entrada, dataSaidaFormatada, convenio);
    
    if (calculo.erro) {
      return res.status(400).json({ message: calculo.erro });
    }
    
    const atualizado = await MovimentacaoModel.registrarSaida(id, {
      data_saida: dataSaidaFormatada,
      tipo_pagamento_id,
      valor: calculo.valor,
      funcionario_saida_id: funcionarioId
    });
    
    if (!atualizado) {
      return res.status(400).json({ message: 'Erro ao registrar saída' });
    }
    
    const movimentacaoAtualizada = await MovimentacaoModel.buscarPorId(id);
    
    res.json({
      message: 'Saída registrada com sucesso',
      movimentacao: movimentacaoAtualizada,
      valorPago: calculo.valor,
      convenioAplicado: calculo.convenioAplicado,
      tempoTotalHoras: calculo.tempoTotalHoras
    });
  } catch (error) {
    console.error('Erro ao registrar saída:', error);
    res.status(500).json({ message: 'Erro ao registrar saída' });
  }
};

export const calcularValor = async (req, res) => {
  try {
    const { id, dataSaida } = req.body;
    
    if (!id || !dataSaida) {
      return res.status(400).json({ message: 'ID da movimentação e data de saída são obrigatórios' });
    }
    
    const movimentacao = await MovimentacaoModel.buscarPorId(id);
    if (!movimentacao) {
      return res.status(404).json({ message: 'Movimentação não encontrada' });
    }
    
    const motorista = await MotoristaModel.buscarPorId(movimentacao.motorista_id);
    
    let convenio = null;
    if (motorista.convenio_id) {
      const convenios = await MotoristaModel.buscarConvenios();
      convenio = convenios.find(c => c.id === motorista.convenio_id);
    }
    
    const dataConvertida = converterFrontendDate(dataSaida);
    const dataSaidaFormatada = formatarParaMySQL(dataConvertida);
    
    const calculo = calcularValorEstadia(movimentacao.data_entrada, dataSaidaFormatada, convenio);
    
    res.json(calculo);
  } catch (error) {
    console.error('Erro ao calcular valor:', error);
    res.status(500).json({ message: 'Erro ao calcular valor' });
  }
};


export const listarTiposPagamento = async (req, res) => {
  try {
    const tipos = await MovimentacaoModel.buscarTiposPagamento();
    res.json(tipos);
  } catch (error) {
    console.error('Erro ao buscar tipos de pagamento:', error);
    res.status(500).json({ message: 'Erro ao buscar tipos de pagamento' });
  }
};

export const cancelarMovimentacao = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;
    const funcionarioId = req.usuarioId;
    
    const movimentacao = await MovimentacaoModel.buscarPorId(id);
    if (!movimentacao) {
      return res.status(404).json({ message: 'Movimentação não encontrada' });
    }
    
    if (movimentacao.data_saida) {
      return res.status(400).json({ message: 'Movimentação já finalizada' });
    }
    
    if (movimentacao.status === 'Cancelado') {
      return res.status(400).json({ message: 'Movimentação já cancelada' });
    }
    
    const cancelado = await MovimentacaoModel.cancelarMovimentacao(id, funcionarioId);
    
    if (!cancelado) {
      return res.status(400).json({ message: 'Erro ao cancelar movimentação' });
    }
    
    res.json({ message: 'Movimentação cancelada com sucesso' });
  } catch (error) {
    console.error('Erro ao cancelar movimentação:', error);
    res.status(500).json({ message: 'Erro ao cancelar movimentação' });
  }
};