import db from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

export const criarTokenRecuperacao = async (funcionarioId) => {
    const token = uuidv4();
    const expiracao = new Date();
    expiracao.setHours(expiracao.getHours() + 1); // Token válido por 1 hora

    await db.query(
        `INSERT INTO recuperar_senha (funcionario_id, token, expiracao) VALUES (?, ?, ?)`,
        [funcionarioId, token, expiracao]
    );

    return token;
};

export const buscarPorToken = async (token) => {
    const [rows] = await db.query(
        `SELECT * FROM recuperar_senha 
         WHERE token = ? AND expiracao > NOW() AND usado = FALSE`,
        [token]
    );
    return rows[0];
};

export const marcarTokenComoUsado = async (token) => {
    await db.query(
        `UPDATE recuperar_senha SET usado = TRUE WHERE token = ?`,
        [token]
    );
};

export const limparTokensExpirados = async () => {
    await db.query(`DELETE FROM recuperar_senha WHERE expiracao < NOW()`);
};