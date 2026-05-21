import "../styles/TelaModal.css";
import { useState} from "react";
import { formatarCPF, formatarPlaca, formatarTelefone } from "../utils/formatadores";
import { MENSAGENS } from "../utils/mensagens";

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
        emp.nome.toLowerCase().includes(busca.toLowerCase()) && emp.status === "Ativo"
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      if (formData.cpf.length !== 11) throw new Error(MENSAGENS.VALIDACAO.CPF_DIGITOS);
      if (formData.placa.length !== 7) throw new Error(MENSAGENS.VALIDACAO.PLACA_DIGITOS);
      if (formData.telefone.length !== 11) throw new Error(MENSAGENS.VALIDACAO.TELEFONE_DIGITOS);
      if (!formData.autonomo && !formData.empresa_id) throw new Error(MENSAGENS.VALIDACAO.EMPRESA_SELECIONE);
      if (!formData.convenio_id) throw new Error(MENSAGENS.VALIDACAO.SELECIONE);

      await salvar(formData);
    } catch {
      setErro(MENSAGENS.ERRO.SALVAR);
    }
  };

  return (
    <div className="tm-fundo" onClick={fechar}>
      <div className="tm-card" onClick={(e) => e.stopPropagation()}>
        <h2>{modo === "adicionar" ? "Adicionar Motorista" : "Editar Motorista"}</h2>

        <form onSubmit={handleSubmit} className="tm">
          
          <div className="tm-container">
              <label className="tm-label">CPF</label>
              <input
                className="tm-input"
                value={formatarCPF(formData.cpf)}
                onChange={(e) => handleChange("cpf", e.target.value)}
                maxLength={14}
                required
              />
          </div>

            <div className="tm-container">
              <label className="tm-label">Placa</label>
              <input
                className="tm-input"
                value={formatarPlaca(formData.placa)}
                onChange={(e) => handleChange("placa", e.target.value)}
                maxLength={8}
                required
              />
            </div>

          <div className="tm-container">
            <label className="tm-label">Telefone</label>
            <input
              className="tm-input"
              value={formatarTelefone(formData.telefone)}
              onChange={(e) => handleChange("telefone", e.target.value)}
              maxLength={15}
              required
            />
          </div>

          <div className="tm-container">
            <label className="tm">O motorista é autônomo?</label>
            <select 
              className="tm-input"
              value={formData.autonomo}
              onChange={(e) => setFormData({...formData, autonomo: e.target.value === "true", empresa_id: "", empresa_nome: ""})}
            >
              <option value="true">Sim</option>
              <option value="false">Não</option>
            </select>
          </div>

          {!formData.autonomo && (
            <div className="tm-container" style={{ position: 'relative' }}>
              <label className="tm-label">Empresa</label>
              <input
                className="tm-input"
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

          <div className="tm-container">
            <label className="tm-label">Convênio</label>
            <select
              className="tm-input"
              value={formData.convenio_id}
              onChange={(e) => setFormData({ ...formData, convenio_id: e.target.value })}
              required
            >
              <option value="">Selecione</option>
              {convenios.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>

          {erro && <p className="erro-texto">{erro}</p>}

          <div className="tm-acoes">
            <button type="button" onClick={fechar} className="tm-cancelar">Cancelar</button>
            <button type="submit" className="tm-salvar">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}