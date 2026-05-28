import express from 'express';
import db from '../config/db.js';
const router = express.Router();

router.get('/estados', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM estado ORDER BY nome');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar estados" });
    }
});

router.get('/cidades/:estadoId', async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM cidade WHERE estado_id = ? ORDER BY nome', 
            [req.params.estadoId]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar cidades" });
    }
});

export default router;