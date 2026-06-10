import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './src/config/db.js';    
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './src/routes/authRoutes.js';
import localidadeRoutes from './src/routes/localidadeRoutes.js';
import funcionarioRoutes from './src/routes/funcionarioRoutes.js';
import empresaRoutes from './src/routes/empresaRoutes.js';
import motoristaRoutes from './src/routes/motoristaRoutes.js';
import movimentacaoRoutes from './src/routes/movimentacaoRoutes.js';
import relatorioRoutes from './src/routes/relatorioRoutes.js'; 
import homeRoutes from './src/routes/homeRoutes.js';
import uploadRoutes from './src/routes/uploadRoutes.js';
import checklistRoutes from './src/routes/checklistRoutes.js';
import recuperacaoRoutes from './src/routes/recuperacaoRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Aumenta limite para fotos em base64

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/auth', authRoutes);
app.use('/localidades', localidadeRoutes);

app.use('/funcionarios', funcionarioRoutes);
app.use('/empresas', empresaRoutes);
app.use('/motoristas', motoristaRoutes);
app.use('/movimentacoes', movimentacaoRoutes);
app.use('/relatorios', relatorioRoutes);
app.use('/home', homeRoutes);
app.use('/uploads', uploadRoutes);
app.use('/checklist', checklistRoutes);
app.use('/recuperacao', recuperacaoRoutes);

// Rota básica de teste
app.get('/', (req, res) => {
    res.json({ message: "API GEPARK Rodando!" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});