import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Pega o token após "Bearer"

    if (!token) return res.status(401).json({ message: "Acesso negado. Token não fornecido." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuarioId = decoded.id;
        req.usuarioCargo = decoded.cargo;
        next();
    } catch (err) {
        res.status(403).json({ message: "Token inválido ou expirado." });
    }
};