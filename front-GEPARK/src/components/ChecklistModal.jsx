import "../styles/TelaModal.css";
import { useState } from "react";
import { MENSAGENS } from "../utils/mensagens";
import { formatarPlaca } from "../utils/formatadores";

export default function ChecklistModal({
  movimentacaoId,
  fechar,
  salvar,
  funcionario,
  checklistExistente,
  motorista,
}) {
  const obterDataLocal = () => {
    const agora = new Date();
    const offset = agora.getTimezoneOffset() * 60000;
    return new Date(agora - offset).toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    movimentacao_id: movimentacaoId || "",
    motorista_id: motorista?.id || "",
    motorista_placa: motorista?.placa || "",
    data_bloqueio: checklistExistente?.data_bloqueio || obterDataLocal(),
    data_desbloqueio: checklistExistente?.data_desbloqueio || "",
    motivo: checklistExistente?.motivo || "",
    funcionario_id: funcionario?.id || "",
    funcionario_nome: funcionario?.nome || "Sistema",
    status: "Bloqueado",
  });

  const [erro, setErro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      if (!formData.motivo.trim()) {
        throw new Error(MENSAGENS.VALIDACAO.INFORME);
      }
      if (!formData.data_desbloqueio) {
        throw new Error(MENSAGENS.VALIDACAO.INFORME);
      }

      const dataDesbloqueio = new Date(formData.data_desbloqueio);
      const dataBloqueio = new Date(formData.data_bloqueio);

      if (dataDesbloqueio <= dataBloqueio) {
        throw new Error(
          "A data de desbloqueio deve ser posterior à data de bloqueio.",
        );
      }

      await salvar(formData);
    } catch (error) {
      setErro(error.message);
    }
  };

  return (
    <div className="tm-fundo" onClick={fechar}>
      <div className="tm-card" onClick={(e) => e.stopPropagation()}>
        <h2>Checklist</h2>

        <div className="tm-caixinha-linha">
          <p>
            <strong>Placa:</strong> {formatarPlaca(motorista?.placa) || "---"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="tm">
          <div className="tm-container">
            <label className="tm-label">Data do Bloqueio</label>
            <input
              type="datetime-local"
              className="tm-input"
              value={formData.data_bloqueio}
              onChange={(e) =>
                setFormData({ ...formData, data_bloqueio: e.target.value })
              }
              required
            />
          </div>

          <div className="tm-container">
            <label className="tm-label">Data de Desbloqueio</label>
            <input
              type="datetime-local"
              className="tm-input"
              value={formData.data_desbloqueio}
              onChange={(e) =>
                setFormData({ ...formData, data_desbloqueio: e.target.value })
              }
              required
            />
          </div>

          <div className="tm-container">
            <label className="tm-label">Motivo do Bloqueio</label>
            <textarea
              className="tm-input"
              value={formData.motivo}
              onChange={(e) =>
                setFormData({ ...formData, motivo: e.target.value })
              }
              placeholder="Descreva o motivo do bloqueio..."
              rows={4}
              required
            />
          </div>

          <div className="tm-caixinha-linha">
            <p>
              <strong>Registrado por:</strong> {funcionario?.nome || "Sistema"}
            </p>
          </div>

          {erro && <p className="erro-texto">{erro}</p>}

          <div className="tm-acoes">
            <button type="button" onClick={fechar} className="tm-cancelar">
              Cancelar
            </button>
            <button type="submit" className="tm-salvar">
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}