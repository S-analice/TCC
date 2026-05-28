import * as FuncionarioModel from '../models/FuncionarioModel.js';
import { salvarFoto, excluirFoto } from '../utils/fileHelper.js';

export const uploadFotoFuncionario = async (req, res) => {
  try {
    const { id } = req.params;
    const { foto } = req.body;
    
    if (!foto) {
      return res.status(400).json({ message: 'Nenhuma foto enviada' });
    }
    
    const funcionario = await FuncionarioModel.buscarPorId(id);
    if (!funcionario) {
      return res.status(404).json({ message: 'Funcionário não encontrado' });
    }
    
    if (funcionario.foto) {
      excluirFoto(funcionario.foto);
    }
    
    const caminhoFoto = await salvarFoto(foto, id);
    
    if (!caminhoFoto) {
      return res.status(500).json({ message: 'Erro ao salvar foto' });
    }
    
    await FuncionarioModel.atualizar(id, { foto: caminhoFoto });
    
    res.json({
      message: 'Foto atualizada com sucesso',
      caminho: caminhoFoto,
      url: `http://localhost:3001${caminhoFoto}`
    });
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    res.status(500).json({ message: 'Erro ao fazer upload da foto' });
  }
};

export const getFotoFuncionario = async (req, res) => {
  try {
    const { id } = req.params;
    const funcionario = await FuncionarioModel.buscarPorId(id);
    
    if (!funcionario || !funcionario.foto) {
      return res.status(404).json({ message: 'Foto não encontrada' });
    }
    
    res.json({
      foto: funcionario.foto,
      url: `http://localhost:3001${funcionario.foto}`
    });
  } catch (error) {
    console.error('Erro ao buscar foto:', error);
    res.status(500).json({ message: 'Erro ao buscar foto' });
  }
};