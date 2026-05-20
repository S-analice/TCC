import "../styles/componentes/EntradaModal.css";
import "../styles/TelaModal.css";
import React, { useState } from "react";
import { formatarCPF, formatarPlaca } from "../utils/formatadores";
import { MotoristaModel } from "../models/MotoristaModel"; 
import { MENSAGENS } from "../utils/mensagens";

export default function EntradaModal({ modo, registro, fechar, salvar, funcionario }) {
  const [form, setForm] = useState({
    cpf: registro?.cpf || "",
    placa: registro?.placa || "",
    convenio: registro?.convenio || "Sem Convênio",
    dataEntrada: registro?.dataEntrada || new Date().toISOString().slice(0, 16)
  });
  const [erro, setErro] = useState("");

  const handleChangeCPF = (valor) => {
    const apenasNumeros = valor.replace(/\D/g, "");
    setForm(prev => ({ ...prev, cpf: apenasNumeros }));

    if (apenasNumeros.length === 11) {
      const motoristas = MotoristaModel.getInitialData();
      const encontrado = motoristas.find(m => m.cpf === apenasNumeros);
      
      if (encontrado) {
        setForm(prev => ({ 
          ...prev, 
          placa: encontrado.placa, 
          convenio: encontrado.convenio 
        }));
        setErro(""); 
      } else {
        setErro(MENSAGENS.ERRO.CPF_INVALIDO); 
        setForm(prev => ({ ...prev, placa: "" }));
      }
    } else {
      setErro(""); 
    }
  };

  const handleSalvar = (e) => {
    e.preventDefault();
    setErro(""); 

    try {
      if (!form.cpf) {
        setErro(MENSAGENS.ERRO.CAMPOS_OBRIGATORIOS);
        return;
      }

      if (form.cpf.length !== 11) {
        setErro(MENSAGENS.VALIDACAO.CPF_DIGITOS);
        return;
      }

      if (!form.placa) {
        setErro(MENSAGENS.ERRO.CPF_INVALIDO);
        return;
      }

      const dadosCompletos = {
        ...form,
        funcionarioEntrada: funcionario?.nome || "Sistema"
      };

      salvar(dadosCompletos, modo, registro?.id);
      fechar();
    } catch {
      setErro(MENSAGENS.ERRO.SALVAR);
    }
  };

  return (
    <div className="tm-fundo" onClick={fechar}>
      <div className="tm-card" onClick={e => e.stopPropagation()}>
        <h2>{modo === "adicionar" ? "Nova Entrada" : "Editar Entrada"}</h2>

        <form onSubmit={handleSalvar} className="tm">
          <div className="tm-container">
            <label className="em-label">CPF Motorista</label>
            <input 
              className="tm-input"
              value={formatarCPF(form.cpf)} 
              onChange={e => handleChangeCPF(e.target.value)}
              maxLength={14}
            />
          </div>
          
          <div className="tm-container">
            <label className="tm-label">Placa (Automática)</label>
            <input 
              className="tm-input" 
              value={formatarPlaca(form.placa)} 
              readOnly 
            />
          </div>

          <div className="tm-container">
            <label className="tm-label">Data e Hora de Entrada</label>
            <input 
              type="datetime-local"
              className="tm-input"
              value={form.dataEntrada}
              onChange={e => setForm(prev => ({ ...prev, dataEntrada: e.target.value }))}
            />
          </div>

          <div className="em-caixinha-linha">
            <p>Funcionário: <strong>{funcionario?.nome || "Sistema"}</strong></p>
          </div>
          
          {erro && <p className="erro-texto">{erro}</p>}

          <div className="tm-acoes">
            <button type="button" className="tm-cancelar" onClick={fechar}>Cancelar</button>
            <button type="submit" className="tm-salvar" disabled={!form.placa}>Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}