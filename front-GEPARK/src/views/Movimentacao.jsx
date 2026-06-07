import "../styles/paginas/Movimentacao.css";
import "../styles/Tela.css";
import React, { useState } from "react";
import {
  LogIn,
  LogOut,
  Search,
  Pencil,
  Download,
  CircleCheck,
} from "lucide-react";
import { useMovimentacaoViewModel } from "../viewmodels/useMovimentacaoViewModel";
import {
  formatarCPF,
  formatarPlaca,
  formatarDataBR,
} from "../utils/formatadores";

import Carregando from "../components/Carregando";
import Mensagem from "../components/Mensagem";
import EntradaModal from "../components/EntradaModal";
import SaidaModal from "../components/SaidaModal";
import ChecklistModal from "../components/ChecklistModal";

export default function Movimentacao({ funcionario, motoristas = [], checklistsFromParent }) {
  const vm = useMovimentacaoViewModel(checklistsFromParent);
  const [pesquisa, setPesquisa] = useState("");
  const [modalEntrada, setModalEntrada] = useState({
    aberta: false,
    modo: "adicionar",
    registro: null,
  });
  const [modalSaida, setModalSaida] = useState({
    aberta: false,
    registro: null,
  });
  const [modalChecklist, setModalChecklist] = useState({
    aberta: false,
    movimentacaoId: null,
    motorista: null,
  });

  const encontrarMotoristaPorCPF = (cpf) => {
    if (!motoristas || !cpf) return null;
    return motoristas.find(m => m.cpf === cpf);
  };

  const abrirModalBloqueio = (movimentacao) => {
    const motorista = encontrarMotoristaPorCPF(movimentacao.cpf);
    
    if (motorista) {
      setModalChecklist({
        aberta: true,
        movimentacaoId: movimentacao.id,
        motorista: motorista,
      });
    } else {
      console.warn("Motorista não encontrado para CPF:", movimentacao.cpf);
      alert(`Motorista com CPF ${formatarCPF(movimentacao.cpf)} não encontrado!`);
    }
  };

  const filtrados = vm.movimentacoes.filter(
    (r) =>
      !r.dataSaida && r.status !== "Cancelado" &&
      (r.cpf?.includes(pesquisa) || r.placa?.toUpperCase().includes(pesquisa.toUpperCase())),
  );

  return (
    <div className="t-container">
      {vm.carregando && <Carregando />}

      {vm.mensagem?.mostrar && (
        <Mensagem
          mensagem={vm.mensagem.texto}
          tipo={vm.mensagem.tipo}
          fechar={vm.fecharMensagem}
        />
      )}

      {modalChecklist.aberta && (
        <ChecklistModal
          movimentacaoId={modalChecklist.movimentacaoId}
          motorista={modalChecklist.motorista}
          funcionario={funcionario}
          fechar={() => setModalChecklist({ aberta: false, movimentacaoId: null, motorista: null })}
          salvar={async (dados) => {
            await vm.salvarChecklist(dados);
            setModalChecklist({ aberta: false, movimentacaoId: null, motorista: null });
          }}
          checklistExistente={vm.checklists?.find(
            (c) =>
              c.motorista_id === modalChecklist.motorista?.id &&
              c.status === "Bloqueado",
          )}
        />
      )}

      <h2 className="t-subtitulo">Gestão de Movimentação</h2>
      <div className="t-topo">
        <div className="t-busca">
          <Search size={18} className="t-busca-icone" />
          <input
            placeholder="Buscar CPF ou Placa..."
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
          />
        </div>
        <div className="m-botoes">
          <button
            className="m-topo-button-verde"
            onClick={() =>
              setModalEntrada({
                aberta: true,
                modo: "adicionar",
                registro: null,
              })
            }
          >
            <LogIn size={18} /> Registrar Entrada
          </button>
          <button className="amarelo" onClick={vm.exportarDados}>
            <Download size={18} />
            Exportar PDF
          </button>
        </div>
      </div>

      <table className="t-tabela">
        <thead>
          <tr>
            <th>CPF</th>
            <th>Placa</th>
            <th>Entrada</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map((r) => {
            return (
              <tr key={r.id}>
                <td>{formatarCPF(r.cpf)}</td>
                <td>{formatarPlaca(r.placa)}</td>
                <td>{formatarDataBR(r.dataEntrada)}</td>
                <td>
                  <div className="t-acoes">
                    <button
                      className="t-atualizar"
                      onClick={() =>
                        setModalEntrada({
                          aberta: true,
                          modo: "editar",
                          registro: r,
                        })
                      }
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="t-remover"
                      onClick={() => setModalSaida({ aberta: true, registro: r })}
                    >
                      <LogOut size={16} />
                    </button>
                    
          
                    <button
                      className="t-info-check"
                      onClick={() => abrirModalBloqueio(r)}
                    >
                      <CircleCheck size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {modalEntrada.aberta && (
        <EntradaModal
          modo={modalEntrada.modo}
          registro={modalEntrada.registro}
          funcionario={funcionario}
          fechar={() => setModalEntrada({ ...modalEntrada, aberta: false })}
          salvar={(dados, modo, id) =>
            vm.salvarEntrada(dados, modo, id, () =>
              setModalEntrada({ ...modalEntrada, aberta: false }),
            )
          }
        />
      )}

      {modalSaida.aberta && (
        <SaidaModal
          registro={modalSaida.registro}
          funcionario={funcionario}
          listaPagamentos={vm.tiposPagamento}
          fechar={() => setModalSaida({ aberta: false })}
          confirmar={(id, dados) =>
            vm.finalizarSaida(id, dados, () => setModalSaida({ aberta: false }))
          }
        />
      )}
    </div>
  );
}