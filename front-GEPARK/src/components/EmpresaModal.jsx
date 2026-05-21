import "../styles/TelaModal.css";
import { useState } from "react";
import { formatarCNPJ, formatarTelefone } from "../utils/formatadores";
import { MENSAGENS } from "../utils/mensagens";
import Mensagem from "./Mensagem";

export default function EmpresaModal({
  modo,
  empresa,
  empresas,
  fechar,
  salvar,
}) {
  const [form, setForm] = useState({
    nome: empresa?.nome || "",
    cnpj: empresa?.cnpj || "",
    telefone: empresa?.telefone || "",
    estado_id: empresa?.estado_id || "",
    cidade_nome: empresa?.cidade_nome || "",
    status: empresa?.status || "Ativo",
  });

  const [modalErro, setModalErro] = useState({ mostrar: false, texto: "" });
  const [erroTamanho, setErroTamanho] = useState("");
  const [sugestoes, setSugestoes] = useState([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);

  const estadosMock = [
    { id: "1", sigla: "PR" },
    { id: "2", sigla: "SP" },
    { id: "3", sigla: "SC" },
  ];

  const cidadesMock = [
    { nome: "Curitiba", estado_id: "1" },
    { nome: "Cascavel", estado_id: "1" },
    { nome: "São Paulo", estado_id: "2" },
    { nome: "Santos", estado_id: "2" },
    { nome: "Joinville", estado_id: "3" },
    { nome: "Florianópolis", estado_id: "3" },
  ];

  const handleCNPJChange = (e) => {
    const valorLimpo = e.target.value.replace(/\D/g, "");
    if (valorLimpo.length <= 14) {
      setForm({ ...form, cnpj: valorLimpo });
    }
  };

  const handleTelefoneChange = (e) => {
    const valorLimpo = e.target.value.replace(/\D/g, "");
    if (valorLimpo.length <= 11) {
      setForm({ ...form, telefone: valorLimpo });
    }
  };

  const handleCidadeChange = (e) => {
    const busca = e.target.value;
    setForm({ ...form, cidade_nome: busca });

    if (busca.length > 1) {
      const filtradas = cidadesMock.filter((c) => {
        const matchNome = c.nome.toLowerCase().includes(busca.toLowerCase());
        const matchEstado = form.estado_id
          ? c.estado_id === form.estado_id
          : true;
        return matchNome && matchEstado;
      });
      setSugestoes(filtradas);
      setMostrarSugestoes(true);
    } else {
      setMostrarSugestoes(false);
    }
  };

  const selecionarCidade = (cidadeObj) => {
    setForm({
      ...form,
      cidade_nome: cidadeObj.nome,
      estado_id: String(cidadeObj.estado_id),
    });
    setMostrarSugestoes(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErroTamanho("");

    if (!form.nome || !form.cnpj || !form.telefone || !form.cidade_nome) {
      setErroTamanho(MENSAGENS.ERRO.CAMPOS_OBRIGATORIOS);
      return;
    }

    if (!form.estado_id) {
      setErroTamanho(MENSAGENS.VALIDACAO.SELECIONE);
      return;
    }

    if (form.cnpj.length !== 14) {
      setErroTamanho(MENSAGENS.VALIDACAO.CNPJ_DIGITOS);
      return;
    }

    if (form.telefone.length !== 11) {
      setErroTamanho(MENSAGENS.VALIDACAO.TELEFONE_DIGITOS);
      return;
    }

    if (modo === "adicionar") {
      if (empresas && empresas.some((emp) => emp.cnpj === form.cnpj)) {
        setModalErro({ mostrar: true, texto: MENSAGENS.ERRO.CNPJ_DUPLICADO });
        return;
      }
    } else if (modo === "editar") {
      const cnpjDuplicado =
        empresas &&
        empresas.some((emp) => emp.cnpj === form.cnpj && emp.id !== empresa.id);
      if (cnpjDuplicado) {
        setModalErro({ mostrar: true, texto: MENSAGENS.ERRO.CNPJ_DUPLICADO });
        return;
      }
    }

    salvar(form);
  };

  return (
    <div className="tm-fundo" onClick={fechar}>
      {modalErro.mostrar && (
        <Mensagem
          mensagem={modalErro.texto}
          modo="erro"
          fechar={() => setModalErro({ mostrar: false, texto: "" })}
        />
      )}

      <div className="tm-card" onClick={(e) => e.stopPropagation()}>
        <h2>{modo === "adicionar" ? "Nova Empresa" : "Editar Empresa"}</h2>

        <form onSubmit={handleSubmit} className="tm">
          <div className="tm-container">
            <label className="tm-label">Nome</label>
            <input
              className="tm-input"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
            />
          </div>

          <div className="tm-lado-a-lado">
            <div className="tm-container">
              <label className="tm-label">CNPJ</label>
              <input
                className="tm-input"
                value={formatarCNPJ(form.cnpj)}
                maxLength={18}
                onChange={handleCNPJChange}
                required
              />
            </div>
            <div className="tm-container">
              <label className="tm-label">Telefone</label>
              <input
                className="tm-input"
                value={formatarTelefone(form.telefone)}
                maxLength={15}
                onChange={handleTelefoneChange}
                required
              />
            </div>
          </div>

          <div className="tm-lado-a-lado">
            <div className="tm-container">
              <label className="tm-label">Estado</label>
              <select
                className="tm-input"
                value={form.estado_id}
                onChange={(e) =>
                  setForm({
                    ...form,
                    estado_id: e.target.value,
                    cidade_nome: "",
                  })
                }
                required
              >
                <option value="">Selecione</option>
                {estadosMock.map((est) => (
                  <option key={est.id} value={est.id}>
                    {est.sigla}
                  </option>
                ))}
              </select>
            </div>

            <div
              className="tm-container"
              style={{ position: "relative" }}
            >
              <label className="tm-label">Cidade</label>
              <input
                className="tm-input"
                value={form.cidade_nome}
                onChange={handleCidadeChange}
                autoComplete="off"
                required
              />
              {mostrarSugestoes && sugestoes.length > 0 && (
                <ul className="autocomplete-lista">
                  {sugestoes.map((cidade, i) => (
                    <li key={i} onClick={() => selecionarCidade(cidade)}>
                      {cidade.nome}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {modo === "editar" && (
              <div className="tm-container">
                <label className="tm-label">Status</label>
                <select
                  className="tm-input"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>
            )}
          </div>

          {erroTamanho && <p className="erro-texto">{erroTamanho}</p>}

          <div className="tm-acoes">
            <button className="tm-cancelar" type="button" onClick={fechar}>
              Cancelar
            </button>
            <button className="tm-salvar" type="submit">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
