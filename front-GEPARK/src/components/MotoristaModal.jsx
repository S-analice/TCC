import "../styles/MotoristaModal.css";
import { useState } from "react";
import {
  formatarCPF,
  formatarPlaca,
  formatarTelefone,
  formatarCNPJ,
} from "../utils/formatadores";

export default function MotoristaModal({ modo, motorista, fechar, salvar }) {
  const [formData, setFormData] = useState({
    cpf: motorista?.cpf || "",
    placa: motorista?.placa || "",
    telefone: motorista?.telefone || "",
    cnpj: motorista?.cnpj || "",
    convenio: motorista?.convenio || "",
    status: motorista?.status || "Ativo",
  });
  const [erro, setErro] = useState("");

  const handleChange = (field, value) => {
    setErro("");
    let newValue = value;

    if (field === "placa") {
      newValue = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    } else {
      newValue = value.replace(/\D/g, "");
    }

    setFormData((prev) => ({ ...prev, [field]: newValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
        setErro("");
        
        const telefoneLimpo = formData.telefone.replace(/\D/g, "");

        if (formData.cpf.length !== 11)
            throw new Error("CPF deve conter 11 dígitos.");
        
        if (formData.placa.length !== 7)
            throw new Error("Placa deve conter 7 caracteres.");

        if (telefoneLimpo.length !== 11) {
            throw new Error("Telefone deve ter 11 dígitos.");
        }

        if (formData.cnpj.length > 0 && formData.cnpj.length !== 14) {
            throw new Error("CNPJ deve conter 14 dígitos.");
        }

        salvar(formData);
    } catch (err) {
        setErro(err.message);
    }
};

  return (
    <div className="mm-fundo" onClick={fechar}>
      <div className="mm-card" onClick={(e) => e.stopPropagation()}>
        <h2>
          {modo === "adicionar" ? "Adicionar Motorista" : "Editar Motorista"}
        </h2>
        <div className="mm-linha"></div>

        <form onSubmit={handleSubmit} className="mm-form">
          <div className="mm-form-container">
            <label className="mm-label">CPF</label>
            <input
              className="mm-input"
              value={formatarCPF(formData.cpf)}
              onChange={(e) => handleChange("cpf", e.target.value)}
              maxLength={14}
              required
            />
          </div>
          <div className="mm-form-container">
            <label className="mm-label">Placa</label>
            <input
              className="mm-input"
              value={formatarPlaca(formData.placa)}
              onChange={(e) => handleChange("placa", e.target.value)}
              maxLength={8}
              required
            />
          </div>

          <div className="mm-form-container">
            <label className="mm-label">Telefone</label>
            <input
              className="mm-input"
              value={formatarTelefone(formData.telefone)}
              onChange={(e) => handleChange("telefone", e.target.value)}
              maxLength={15}
              required
            />
          </div>
          <div className="mm-form-container">
            <label className="mm-label">CNPJ (Opcional)</label>
            <input
              className="mm-input"
              value={formatarCNPJ(formData.cnpj)}
              onChange={(e) => handleChange("cnpj", e.target.value)}
              maxLength={18}
            />
          </div>

          <div className="mm-form-container">
            <label className="mm-label">Convênio</label>
            <select
              className="mm-input"
              value={formData.convenio}
              onChange={(e) =>
                setFormData({ ...formData, convenio: e.target.value })
              }
              required
            >
              <option value="">Selecione</option>
              <option value="Convênio A">Convênio A</option>
              <option value="Convênio B">Convênio B</option>
              <option value="Sem Convênio">Sem Convênio</option>
            </select>
          </div>

          {erro && <p className="erro-texto">{erro}</p>}

          <div className="mm-form-acoes">
            <button type="button" onClick={fechar} className="mm-cancelar">
              Cancelar
            </button>
            <button type="submit" className="mm-salvar">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
