import { buscarPorEmail } from '../models/FuncionarioModel.js';
import { criarTokenRecuperacao, buscarPorToken, marcarTokenComoUsado, limparTokensExpirados } from '../models/RecuperacaoModel.js';
import { enviarEmailRecuperacao } from '../services/EmailService.js';
import { gerarHash } from '../utils/passwordHash.js';
import db from '../config/db.js';

export const solicitarRecuperacao = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: 'E-mail é obrigatório' });
        }

        const funcionario = await buscarPorEmail(email);
        
        if (!funcionario) {
            return res.status(200).json({ 
                message: 'Se o e-mail estiver cadastrado, você receberá as instruções.' 
            });
        }

        await limparTokensExpirados();
        
        const token = await criarTokenRecuperacao(funcionario.id);
        
        await enviarEmailRecuperacao(email, funcionario.nome, token);
        
        res.status(200).json({ 
            message: 'Se o e-mail estiver cadastrado, você receberá as instruções.' 
        });
        
    } catch (error) {
        console.error('Erro na solicitação de recuperação:', error);
        res.status(500).json({ message: 'Erro ao processar solicitação' });
    }
};

export const validarToken = async (req, res) => {
    try {
        const { token } = req.params;
        
        const recuperacao = await buscarPorToken(token);
        
        if (!recuperacao) {
            return res.status(400).json({ 
                valid: false, 
                message: 'Link inválido ou expirado' 
            });
        }
        
        res.json({ valid: true });
        
    } catch (error) {
        console.error('Erro ao validar token:', error);
        res.status(500).json({ message: 'Erro ao validar token' });
    }
};

export const redefinirSenha = async (req, res) => {
    try {
        const { token, novaSenha } = req.body;
        
        if (!token || !novaSenha) {
            return res.status(400).json({ message: 'Token e nova senha são obrigatórios' });
        }
        
        if (novaSenha.length < 6) {
            return res.status(400).json({ message: 'A senha deve ter no mínimo 6 caracteres' });
        }
        
        const recuperacao = await buscarPorToken(token);
        
        if (!recuperacao) {
            return res.status(400).json({ message: 'Link inválido ou expirado' });
        }
        
        const senhaHash = await gerarHash(novaSenha);
    
        await db.query(
            `UPDATE funcionario SET senha = ? WHERE id = ?`,
            [senhaHash, recuperacao.funcionario_id]
        );
        
        await marcarTokenComoUsado(token);
        
        res.json({ message: 'Senha redefinida com sucesso!' });
        
    } catch (error) {
        console.error('Erro ao redefinir senha:', error);
        res.status(500).json({ message: 'Erro ao redefinir senha' });
    }
};