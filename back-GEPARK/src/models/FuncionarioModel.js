import db from '../config/db.js';

export const buscarPorEmail = async (email) => {
    try {
        const [rows] = await db.query('SELECT * FROM funcionario WHERE email = ?', [email]);
        return rows[0];
    } catch (error) {
        throw error;
    }
};