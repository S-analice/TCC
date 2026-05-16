import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/db.js';    

import authRoutes from './routes/authRoutes.js';
import localidadeRoutes from './routes/localidadeRoutes.js';
                                            
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/localidades', localidadeRoutes);

// Rota básica de teste
app.get('/', (req, res) => {
    res.json({ message: "API GEPARK Rodando!" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});