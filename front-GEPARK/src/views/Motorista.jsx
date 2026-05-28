import "../styles/paginas/Motorista.css";
import "../styles/Tela.css";
import { Pencil, Trash2, Search } from "lucide-react";
import { useMotoristaViewModel } from "../viewmodels/useMotoristaViewModel";
import {
  formatarCPF,
  formatarPlaca,
  formatarTelefone,
} from "../utils/formatadores";
import Carregando from "../components/Carregando";
import Mensagem from "../components/Mensagem";
import MotoristaModal from "../components/MotoristaModal";
import DeleteMotoristaModal from "../components/DeleteMotoristaModal";

export default function Motorista() {
  const vm = useMotoristaViewModel();

  return (
    <div className="t-container">
      {vm.carregando && <Carregando />}

      {vm.mensagem.mostrar && (
        <Mensagem
          mensagem={vm.mensagem.texto}
          modo={vm.mensagem.tipo}
          fechar={vm.fecharMensagem}
        />
      )}

      {vm.modal.aberto && vm.modal.tipo === "formulario" && (
        <MotoristaModal
          modo={vm.modal.dado ? "editar" : "adicionar"}
          motorista={vm.modal.dado}
          fechar={vm.fecharModal}
          salvar={vm.salvarMotorista}
          empresas={vm.empresas}
          convenios={vm.convenios}
        />
      )}

      {vm.modal.aberto && vm.modal.tipo === "delete" && (
        <DeleteMotoristaModal
          motorista={vm.modal.dado}
          fechar={vm.fecharModal}
          confirmar={vm.inativarMotorista}
        />
      )}

      <h2 className="t-subtitulo">Lista de Motoristas</h2>

      <div className="t-topo">
        <div className="t-filtro-container">
          <div className="t-busca">
            <Search size={18} className="t-busca-icone" />
            <input
              type="text"
              placeholder="Pesquisar por CPF ou Placa"
              value={vm.pesquisa}
              onChange={(e) => vm.setPesquisa(e.target.value)}
            />
          </div>
          <select
            className="t-filtro"
            value={vm.filtroStatus}
            onChange={(e) => vm.setFiltroStatus(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="Ativo">Ativos</option>
            <option value="Inativo">Inativos</option>
          </select>
        </div>
        <button onClick={() => vm.abrirModal("formulario")}>
          + Adicionar Motorista
        </button>
      </div>

      <table className="t-tabela">
        <thead>
          <tr>
            <th>CPF</th>
            <th>Placa</th>
            <th>Telefone</th>
            <th>Empresa</th>
            <th>Convênio</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {vm.motoristasFiltrados.map((m) => (
            <tr key={m.id}>
              <td>{formatarCPF(m.cpf)}</td>
              <td>{formatarPlaca(m.placa)}</td>
              <td>{formatarTelefone(m.telefone)}</td>
              <td>{m.empresa_nome || "Autônomo"}</td>
              <td>
                {(() => {
                  let classeConvenio = "";
                  const conv = m.convenio.toLowerCase();

                  if (conv === "premium") {
                    classeConvenio = "premium";
                  } else if (conv === "novo cliente") {
                    classeConvenio = "novo-cliente";
                  } else {
                    classeConvenio = "sem-convenio";
                  }

                  return (
                    <span className={`m-convenio ${classeConvenio}`}>
                      {m.convenio}
                    </span>
                  );
                })()}
              </td>
              <td>
                <span className={`t-status ${m.status.toLowerCase()}`}>
                  {m.status}
                </span>
              </td>
              <td>
                <div className="t-acoes">
                  <button
                    className="t-atualizar"
                    onClick={() => vm.abrirModal("formulario", m)}
                  >
                    <Pencil size={16} />
                  </button>

                  {m.status === "Ativo" && (
                    <button
                      className="t-remover"
                      onClick={() => vm.abrirModal("delete", m)}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
