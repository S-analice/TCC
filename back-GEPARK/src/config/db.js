import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306, 
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Teste de conexão imediato
db.getConnection()
    .then(conn => {
        console.log("✅ Conectado ao banco de dados MySQL (XAMPP)!");
        conn.release();
    })
    .catch(err => {
        console.error("❌ Erro ao conectar ao banco:", err.message);
    });

export default db;