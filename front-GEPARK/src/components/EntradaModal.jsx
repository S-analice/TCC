import "../styles/EntradaModal.css";
import React, { useState } from "react";
import { formatarCPF, formatarPlaca } from "../utils/formatadores";
import { MotoristaModel } from "../models/MotoristaModel"; 

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
        setErro("Motorista não cadastrado.");
        setForm(prev => ({ ...prev, placa: "" }));
      }
    }
  };

  const handleSalvar = (e) => {
    e.preventDefault();
    try {
      if (!form.placa) throw new Error("CPF inválido ou motorista inexistente.");

      const dadosCompletos = {
        ...form,
        funcionarioEntrada: funcionario?.nome || "Desconhecido"
      };

      salvar(dadosCompletos, modo, registro?.id);
      fechar();
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <div className="em-fundo" onClick={fechar}>
      <div className="em-card" onClick={e => e.stopPropagation()}>
        <h2>{modo === "adicionar" ? "Nova Entrada" : "Editar Entrada"}</h2>

        <form onSubmit={handleSalvar} className="em-form">
          <div className="em-form-container">
            <label className="em-label">CPF Motorista</label>
            <input 
              className="em-input"
              value={formatarCPF(form.cpf)} 
              onChange={e => handleChangeCPF(e.target.value)}
              maxLength={14}
            />
          </div>
          
          <div className="em-form-container">
            <label className="em-label">Placa (Automática)</label>
            <input 
              className="em-input" 
              value={formatarPlaca(form.placa)} 
              readOnly 
            />
          </div>

          <div className="em-form-container">
            <label className="em-label">Data e Hora de Entrada</label>
            <input 
              type="datetime-local"
              className="em-input"
              value={form.dataEntrada}
              onChange={e => setForm(prev => ({ ...prev, dataEntrada: e.target.value }))}
            />
          </div>

          <div className="em-caixinha-linha">
            <p>Funcionário: <strong>{funcionario?.nome || "Desconhecido"}</strong></p>
          </div>
          
          {erro && <p className="erro-texto" style={{color: 'red', marginTop: '10px'}}>{erro}</p>}

          <div className="em-form-acoes">
            <button type="button" className="em-cancelar" onClick={fechar}>Cancelar</button>
            <button type="submit" className="em-salvar" disabled={!form.placa}>Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}