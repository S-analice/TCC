import "../styles/componentes/EntradaModal.css";
import "../styles/TelaModal.css";
import React, { useState } from "react";
import { formatarCPF, formatarPlaca } from "../utils/formatadores";
import { MotoristaModel } from "../models/MotoristaModel"; 
import { MovimentacaoModel } from "../models/MovimentacaoModel";
import { MENSAGENS } from "../utils/mensagens";

export default function EntradaModal({ modo, registro, fechar, salvar, funcionario }) {
 const obterDataLocal = () => {
    const agora = new Date();
    const offset = agora.getTimezoneOffset() * 60000; 
    const localISOTime = new Date(agora - offset).toISOString().slice(0, 16);
    return localISOTime;
  };
 
  const [form, setForm] = useState({
    cpf: registro?.cpf || "",
    placa: registro?.placa || "",
    convenio: registro?.convenio || "Sem Convênio",
    dataEntrada: registro?.dataEntrada || obterDataLocal()
  });
  const [erro, setErro] = useState("");

  const handleChangeCPF = (valor) => {
    const apenasNumeros = valor.replace(/\D/g, "");
    setForm(prev => ({ ...prev, cpf: apenasNumeros }));
    
    setErro("");

    if (apenasNumeros.length === 11) {
      const motoristas = MotoristaModel.getInitialData();
      const encontrado = motoristas.find(m => m.cpf === apenasNumeros);
      
      if (encontrado) {
        if(encontrado.status !== "Ativo") {
          setErro(MENSAGENS.ERRO.CPF_INATIVO);
          setForm(prev => ({ ...prev, placa: "" }));
          return;
        }

        const registrosTotais = MovimentacaoModel.registrosIniciais;
        const noPatio = registrosTotais.some(r => r.cpf === encontrado.cpf && !r.dataSaida);
        
        if (noPatio && modo === "adicionar") {
          setErro(MENSAGENS.ERRO.CPF_NOPATIO);
          setForm(prev => ({ ...prev, placa: "" }));
          return;
        }
        
        setForm(prev => ({ 
          ...prev, 
          placa: encontrado.placa, 
          convenio: encontrado.convenio 
        }));
      } else {
        setErro(MENSAGENS.ERRO.CPF_INVALIDO); 
      }
    }
  };

  const handleSalvar = (e) => {
    e.preventDefault();
    if (erro) return; 

    if (!form.cpf || !form.placa) {
      setErro(MENSAGENS.ERRO.CAMPOS_OBRIGATORIOS);
      return;
    }

    const dadosCompletos = {
      ...form,
      funcionarioEntrada: funcionario?.nome || "Sistema"
    };

    salvar(dadosCompletos, modo, registro?.id);
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
              className={`tm-input ${erro ? 'input-erro' : ''}`} 
              value={formatarPlaca(form.placa)} 
              placeholder={erro ? "Bloqueado" : "Aguardando CPF..."}
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
          
          {erro && <p className="erro-texto" style={{color: 'red', fontSize: '12px', margin: '5px 0'}}>{erro}</p>}

          <div className="tm-acoes">
            <button type="button" className="tm-cancelar" onClick={fechar}>Cancelar</button>
            <button type="submit" className="tm-salvar" disabled={!!erro || !form.placa}>Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}