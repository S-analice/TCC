import jwt from 'jsonwebtoken';
import { buscarPorEmail } from '../models/FuncionarioModel.js';
import { compararSenha } from '../utils/passwordHash.js';
import { salvarToken, removerToken } from '../models/TokenModel.js';
import db from '../config/db.js';

const calcularExpiracaoPorTurno = async (funcionarioId) => {
  try {
    const [rows] = await db.query(`
      SELECT t.hora_inicio, t.hora_fim
      FROM funcionario f
      LEFT JOIN turno t ON f.turno_id = t.id
      WHERE f.id = ?
    `, [funcionarioId]);
    
    if (!rows.length || !rows[0].hora_inicio || !rows[0].hora_fim) {
      const data = new Date();
      data.setHours(data.getHours() + 8);
      return data;
    }
    
    const { hora_inicio, hora_fim } = rows[0];
    const agora = new Date();
    const horaAtual = agora.getHours();
    
    const [inicioHora, inicioMinuto] = hora_inicio.split(':').map(Number);
    const [fimHora, fimMinuto] = hora_fim.split(':').map(Number);
    
    let dataExpiracao = new Date(agora);
    
    if (inicioHora > fimHora || (inicioHora === fimHora && inicioMinuto > fimMinuto)) {
      if (horaAtual >= inicioHora || horaAtual < fimHora) {
        dataExpiracao.setHours(fimHora, fimMinuto, 0, 0);
        if (dataExpiracao <= agora) {
          dataExpiracao.setDate(dataExpiracao.getDate() + 1);
        }
      } else {
        dataExpiracao.setHours(inicioHora, inicioMinuto, 0, 0);
        if (dataExpiracao <= agora) {
          dataExpiracao.setDate(dataExpiracao.getDate() + 1);
        }
      }
    } else {
      if (horaAtual >= inicioHora && horaAtual < fimHora) {
        dataExpiracao.setHours(fimHora, fimMinuto, 0, 0);
      } else {
        dataExpiracao.setHours(inicioHora, inicioMinuto, 0, 0);
        if (dataExpiracao <= agora) {
          dataExpiracao.setDate(dataExpiracao.getDate() + 1);
        }
      }
    }
    
    return dataExpiracao;
  } catch (error) {
    console.error('Erro ao calcular expiração:', error);
    const data = new Date();
    data.setHours(data.getHours() + 8);
    return data;
  }
};

export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    
    const funcionario = await buscarPorEmail(email);
    
    if (!funcionario) {
      return res.status(401).json({ message: "E-mail ou senha inválidos." });
    }
    
    const senhaValida = await compararSenha(senha, funcionario.senha);
    if (!senhaValida) {
      return res.status(401).json({ message: "E-mail ou senha inválidos." });
    }
    
    const dataExpiracao = await calcularExpiracaoPorTurno(funcionario.id);
    const expiracaoSegundos = Math.floor((dataExpiracao.getTime() - Date.now()) / 1000);
    
    const token = jwt.sign(
      { 
        id: funcionario.id, 
        cargo: funcionario.cargo_id,
        nome: funcionario.nome,
        exp: Math.floor(Date.now() / 1000) + expiracaoSegundos
      },
      process.env.JWT_SECRET
    );
   
    await salvarToken(funcionario.id, token, dataExpiracao);
    
    delete funcionario.senha;
    
    res.json({ 
      funcionario, 
      token,
      expiracao: dataExpiracao.toISOString()
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: "Erro no servidor." });
  }
};

export const logout = async (req, res) => {
  try {
    const funcionarioId = req.usuarioId;
    await removerToken(funcionarioId);
    res.json({ message: 'Logout realizado com sucesso' });
  } catch (error) {
    console.error('Erro no logout:', error);
    res.status(500).json({ message: 'Erro ao fazer logout' });
  }
};