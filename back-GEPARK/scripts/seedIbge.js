// scripts/seedIbge.js
import axios from 'axios';
import db from '../src/config/db.js';

async function seed() {
    try {
        console.log("⏳ Buscando estados...");
        const { data: estados } = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados');

        for (const estado of estados) {
            const [result] = await db.execute(
                'INSERT INTO estado (id, nome, sigla) VALUES (?, ?, ?)',
                [estado.id, estado.nome, estado.sigla]
            );

            console.log(`✅ Estado ${estado.sigla} inserido. Buscando cidades...`);

            const { data: cidades } = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado.id}/municipios`);

            const values = cidades.map(c => [c.nome, estado.id]);
            await db.query('INSERT INTO cidade (nome, estado_id) VALUES ?', [values]);
        }

        console.log("🚀 Banco de dados de localidades populado com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao popular banco:", error);
    }
}

seed();