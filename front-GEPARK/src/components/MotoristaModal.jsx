import "../styles/MotoristaModal.css";
import { useState, useEffect } from "react";
import { formatarCPF, formatarPlaca, formatarTelefone } from "../utils/formatadores";

export default function MotoristaModal({ modo, motorista, fechar, salvar, empresas, convenios }) {
  const [formData, setFormData] = useState({
    cpf: motorista?.cpf || "",
    placa: motorista?.placa || "",
    telefone: motorista?.telefone || "",
    empresa_id: motorista?.empresa_id || "",
    empresa_nome: motorista?.empresa_nome || "",
    convenio_id: motorista?.convenio_id || "",
    status: motorista?.status || "Ativo",
    autonomo: motorista ? !motorista.empresa_id : true
  });

  const [erro, setErro] = useState("");
  const [sugestoes, setSugestoes] = useState([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);

  const handleChange = (field, value) => {
    setErro("");
    let newValue = value;

    if (field === "placa") {
      newValue = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    } else if (field === "cpf" || field === "telefone") {
      newValue = value.replace(/\D/g, "");
    }

    setFormData((prev) => ({ ...prev, [field]: newValue }));
  };

  const handleEmpresaBusca = (e) => {
    const busca = e.target.value;
    setFormData({ ...formData, empresa_nome: busca, empresa_id: "" });

    if (busca.length > 1) {
      const filtradas = empresas.filter(emp => 
        emp.nome.toLowerCase().includes(busca.toLowerCase())
      );
      setSugestoes(filtradas);
      setMostrarSugestoes(true);
    } else {
      setMostrarSugestoes(false);
    }
  };

  const selecionarEmpresa = (emp) => {
    setFormData({ ...formData, empresa_nome: emp.nome, empresa_id: emp.id });
    setMostrarSugestoes(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (formData.cpf.length !== 11) throw new Error("CPF deve conter 11 dígitos.");
      if (formData.placa.length !== 7) throw new Error("Placa deve conter 7 caracteres.");
      if (formData.telefone.length !== 11) throw new Error("Telefone inválido.");
      if (!formData.autonomo && !formData.empresa_id) throw new Error("Selecione uma empresa válida.");
      if (!formData.convenio_id) throw new Error("Selecione um convênio.");

      salvar(formData);
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <div className="mm-fundo" onClick={fechar}>
      <div className="mm-card" onClick={(e) => e.stopPropagation()}>
        <h2>{modo === "adicionar" ? "Adicionar Motorista" : "Editar Motorista"}</h2>
        <div className="mm-linha"></div>

        <form onSubmit={handleSubmit} className="mm-form">
          <div className="mm-lado-a-lado">
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
            <label className="mm-label">O motorista é autônomo?</label>
            <select 
              className="mm-input"
              value={formData.autonomo}
              onChange={(e) => setFormData({...formData, autonomo: e.target.value === "true", empresa_id: "", empresa_nome: ""})}
            >
              <option value="true">Sim, autônomo</option>
              <option value="false">Não, vinculado à empresa</option>
            </select>
          </div>

          {!formData.autonomo && (
            <div className="mm-form-container" style={{ position: 'relative' }}>
              <label className="mm-label">Empresa</label>
              <input
                className="mm-input"
                placeholder="Digite o nome da empresa..."
                value={formData.empresa_nome}
                onChange={handleEmpresaBusca}
                autoComplete="off"
                required
              />
              {mostrarSugestoes && sugestoes.length > 0 && (
                <ul className="autocomplete-lista">
                  {sugestoes.map(emp => (
                    <li key={emp.id} onClick={() => selecionarEmpresa(emp)}>{emp.nome}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="mm-form-container">
            <label className="mm-label">Convênio</label>
            <select
              className="mm-input"
              value={formData.convenio_id}
              onChange={(e) => setFormData({ ...formData, convenio_id: e.target.value })}
              required
            >
              <option value="">Selecione um convênio</option>
              {convenios.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>

          {erro && <p className="erro-texto">{erro}</p>}

          <div className="mm-form-acoes">
            <button type="button" onClick={fechar} className="mm-cancelar">Cancelar</button>
            <button type="submit" className="mm-salvar">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}