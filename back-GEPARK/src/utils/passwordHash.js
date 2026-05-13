import bcrypt from 'bcryptjs';

export const gerarHash = async (senha) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(senha, salt);
};


export const compararSenha = async (senhaDigitada, senhaBanco) => {
    return await bcrypt.compare(senhaDigitada, senhaBanco);
};