import jwt from 'jsonwebtoken';
import { buscarPorEmail } from '../models/FuncionarioModel.js';
import { compararSenha } from '../utils/passwordHash.js';

export const login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const funcionario = await buscarPorEmail(email);

        if (!funcionario) {
            return res.status(401).json({ message: "E-mail ou senha inválidos." });
        }

        const senhaValida = await compararSenha(senha, funcionario.senha);

        if (!senhaValida) {
            return res.status(401).json({ message: "E-mail ou senha inválidos." });
        }
        const token = jwt.sign(
            { id: funcionario.id, cargo: funcionario.cargo },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        delete funcionario.senha;

        res.json({ funcionario, token });
    } catch (error) {
        res.status(500).json({ message: "Erro no servidor." });
    }
};