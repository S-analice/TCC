import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = path.join(__dirname, '../../uploads');
const FOTOS_DIR = path.join(UPLOADS_DIR, 'fotos');

const criarPastas = () => {
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  if (!fs.existsSync(FOTOS_DIR)) fs.mkdirSync(FOTOS_DIR, { recursive: true });
};
criarPastas();

export const gerarNomeUnico = (id, extensao) => {
  const data = new Date();
  const timestamp = `${data.getFullYear()}${String(data.getMonth() + 1).padStart(2, '0')}${String(data.getDate()).padStart(2, '0')}_${String(data.getHours()).padStart(2, '0')}${String(data.getMinutes()).padStart(2, '0')}${String(data.getSeconds()).padStart(2, '0')}`;
  return `${id}_${timestamp}.${extensao}`;
};

export const salvarFoto = async (arquivoBase64, idFuncionario) => {
  try {
    let base64String = arquivoBase64;
    let extensao = 'jpg';
    
    if (arquivoBase64.includes('data:image')) {
      const matches = arquivoBase64.match(/^data:image\/(\w+);base64,/);
      if (matches) {
        extensao = matches[1] === 'jpeg' ? 'jpg' : matches[1];
        base64String = arquivoBase64.replace(/^data:image\/\w+;base64,/, '');
      }
    }
    
    const buffer = Buffer.from(base64String, 'base64');
    
    const nomeArquivo = gerarNomeUnico(idFuncionario, extensao);
    const caminhoCompleto = path.join(FOTOS_DIR, nomeArquivo);
    
    fs.writeFileSync(caminhoCompleto, buffer);
    
    return `/uploads/fotos/${nomeArquivo}`;
  } catch (error) {
    console.error('Erro ao salvar foto:', error);
    return null;
  }
};

export const excluirFoto = (caminhoFoto) => {
  if (!caminhoFoto) return;
  
  try {
    const caminhoCompleto = path.join(__dirname, '../../', caminhoFoto);
    if (fs.existsSync(caminhoCompleto)) {
      fs.unlinkSync(caminhoCompleto);
    }
  } catch (error) {
    console.error('Erro ao excluir foto:', error);
  }
};

export const getCaminhoFoto = (caminhoRelativo) => {
  if (!caminhoRelativo) return null;
  return path.join(__dirname, '../../', caminhoRelativo);
};

export const fotoExiste = (caminhoRelativo) => {
  if (!caminhoRelativo) return false;
  try {
    return fs.existsSync(path.join(__dirname, '../../', caminhoRelativo));
  } catch {
    return false;
  }
};

export const FOTOS_DIR_PATH = FOTOS_DIR;