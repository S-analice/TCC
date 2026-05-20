import "../styles/paginas/Funcionario.css";
import "../styles/Tela.css";
import { User, Pencil, Trash2, Search } from "lucide-react";
import { useFuncionarioViewModel } from "../viewmodels/useFuncionarioViewModel";
import { formatarTelefone } from "../utils/formatadores";
import Carregando from "../components/Carregando";
import Mensagem from "../components/Mensagem";
import FuncionarioModal from "../components/FuncionarioModal";
import DeleteFuncionarioModal from "../components/DeleteFuncionarioModal";
import FotoModal from "../components/FotoModal";

export default function Funcionario() {
  const vm = useFuncionarioViewModel();

  return (
    <div className="t-container">
      {vm.carregando && <Carregando />}
      {vm.mensagem.mostrar && (
        <Mensagem
          mensagem={vm.mensagem.texto}
          tipo={vm.mensagem.tipo}
          fechar={vm.fecharMensagem}
        />
      )}

      {vm.modal.aberto && vm.modal.tipo === "formulario" && (
        <FuncionarioModal
          modo={vm.modal.dado ? "editar" : "adicionar"}
          funcionario={vm.modal.dado}
          funcionarios={vm.funcionarios}
          turnos={vm.turnos}
          cargos={vm.cargos}
          fechar={vm.fecharModal}
          salvar={vm.salvarFuncionario}
        />
      )}

      {vm.modal.aberto && vm.modal.tipo === "delete" && (
        <DeleteFuncionarioModal
          funcionario={vm.modal.dado}
          fechar={vm.fecharModal}
          confirmar={vm.inativarFuncionario}
        />
      )}

      {vm.modal.aberto && vm.modal.tipo === "foto" && (
        <FotoModal funcionario={vm.modal.dado} fechar={vm.fecharModal} />
      )}

      <h2 className="t-subtitulo">Lista de Funcionários</h2>

      <div className="t-topo">
        <div className="t-filtro-container">
          <div className="t-busca">
            <Search size={18} className="t-busca-icone" />
            <input
              placeholder="Pesquisar por nome..."
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
            <option value="ativos">Ativos</option>
            <option value="inativos">Inativos</option>
          </select>
        </div>
        <button onClick={() => vm.abrirModal("formulario")}>
          + Adicionar Funcionário
        </button>
      </div>

      <table className="t-tabela">
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Cargo</th>
            <th>Turno</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {vm.funcionariosFiltrados.map((f) => (
            <tr key={f.id}>
              <td>
                <div
                  className="f-foto"
                  onClick={() => vm.abrirModal("foto", f)}
                >
                  {f.foto ? (
                    <img src={f.foto} alt="Perfil Funcionário" />
                  ) : (
                    <div className="f-icone">
                      <User size={20} />
                    </div>
                  )}
                </div>
              </td>
              <td>{f.nome}</td>
              <td>{f.email}</td>
              <td>
                {vm.cargos?.find((c) => c.id === f.cargoId)?.nome ||
                  "Não definido"}
              </td>
              <td>
                {vm.turnos?.find((t) => t.id === f.turnoId)?.nome ||
                  "Não definido"}
              </td>
              <td>{formatarTelefone(f.telefone)}</td>
              <td>
                <span className={`t-status ${f.status.toLowerCase()}`}>
                  {f.status}
                </span>
              </td>
              <td>
                <div className="t-acoes">
                  <button
                    className="t-atualizar"
                    onClick={() => vm.abrirModal("formulario", f)}
                  >
                    <Pencil size={16} />
                  </button>
                  {f.status === "Ativo" && (
                    <button
                      className="t-remover"
                      onClick={() => vm.abrirModal("delete", f)}
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
