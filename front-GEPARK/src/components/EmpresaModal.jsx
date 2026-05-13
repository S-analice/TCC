import "../styles/EmpresaModal.css";
import { useState } from "react";
import { formatarCNPJ, formatarTelefone } from "../utils/formatadores";
import Mensagem from "./Mensagem";

export default function EmpresaModal({ modo, empresa, empresas, fechar, salvar }) {
    const [form, setForm] = useState({
        nome: empresa?.nome || "",
        cnpj: empresa?.cnpj || "",
        telefone: empresa?.telefone || "",
        estado_id: empresa?.estado_id || "",
        cidade_nome: empresa?.cidade_nome || "",
    });

    const [modalErro, setModalErro] = useState({ mostrar: false, texto: "" });
    const [erroTamanho, setErroTamanho] = useState(""); 
    const [sugestoes, setSugestoes] = useState([]);
    const [mostrarSugestoes, setMostrarSugestoes] = useState(false);

    const estadosMock = [
        { id: "1", sigla: "PR" },
        { id: "2", sigla: "SP" },
        { id: "3", sigla: "SC" }
    ];

    const cidadesMock = [
        { nome: "Curitiba", estado_id: "1" },
        { nome: "Cascavel", estado_id: "1" },
        { nome: "São Paulo", estado_id: "2" },
        { nome: "Santos", estado_id: "2" },
        { nome: "Joinville", estado_id: "3" },
        { nome: "Florianópolis", estado_id: "3" }
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
            const filtradas = cidadesMock.filter(c => {
                const matchNome = c.nome.toLowerCase().includes(busca.toLowerCase());
                const matchEstado = form.estado_id ? c.estado_id === form.estado_id : true;
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
            estado_id: String(cidadeObj.estado_id) 
        });
        setMostrarSugestoes(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErroTamanho(""); 

        if (form.cnpj.length !== 14) {
            setErroTamanho("O CNPJ deve conter 14 dígitos.");
            return;
        }

        if (form.telefone.length !== 11) {
            setErroTamanho("O telefone deve ter 11 dígitos.");
            return;
        }

        if (!form.estado_id) {
            setErroTamanho("Por favor, selecione um estado.");
            return;
        }

        if (modo === "adicionar") {
            if (empresas && empresas.some(emp => emp.cnpj === form.cnpj)) {
                setModalErro({ mostrar: true, texto: "Este CNPJ já está cadastrado no sistema." });
                return;
            }
        } else if (modo === "editar") {
            const cnpjDuplicado = empresas && empresas.some(emp => emp.cnpj === form.cnpj && emp.id !== empresa.id);
            if (cnpjDuplicado) {
                setModalErro({ mostrar: true, texto: "Este CNPJ já está sendo usado por outra empresa." });
                return;
            }
        }

        salvar(form);
    };

    return (
        <div className="emm-fundo" onClick={fechar}>
            {modalErro.mostrar && (
                <Mensagem 
                    mensagem={modalErro.texto} 
                    modo="erro" 
                    fechar={() => setModalErro({ mostrar: false, texto: "" })} 
                />
            )}

            <div className="emm-card" onClick={e => e.stopPropagation()}>
                <h2>{modo === "adicionar" ? "Nova Empresa" : "Editar Empresa"}</h2>
                
                <form onSubmit={handleSubmit} className="emm-form">
                    <div className="emm-form-container">
                        <label className="emm-label">Nome</label>
                        <input 
                            className="emm-input" 
                            value={form.nome} 
                            onChange={e => setForm({...form, nome: e.target.value})} 
                            required 
                        />
                    </div>

                    <div className="emm-lado-a-lado">
                        <div className="emm-form-container">
                            <label className="emm-label">CNPJ</label>
                            <input 
                                className="emm-input" 
                                value={formatarCNPJ(form.cnpj)}
                                maxLength={18} 
                                onChange={handleCNPJChange} 
                                required 
                            />
                        </div>
                        <div className="emm-form-container">
                            <label className="emm-label">Telefone</label>
                            <input 
                                className="emm-input" 
                                value={formatarTelefone(form.telefone)} 
                                maxLength={15}
                                onChange={handleTelefoneChange} 
                                required 
                            />
                        </div>
                    </div>

                    <div className="emm-lado-a-lado">
                        <div className="emm-form-container">
                            <label className="emm-label">Estado</label>
                            <select 
                                className="emm-input" 
                                value={form.estado_id} 
                                onChange={e => setForm({...form, estado_id: e.target.value, cidade_nome: ""})} 
                                required
                            >
                                <option value="">Selecione</option>
                                {estadosMock.map(est => (
                                    <option key={est.id} value={est.id}>{est.sigla}</option>
                                ))}
                            </select>
                        </div>

                        <div className="emm-form-container" style={{ position: 'relative' }}>
                            <label className="emm-label">Cidade</label>
                            <input 
                                className="emm-input" 
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
                    </div>

                    {erroTamanho && <p className="erro-texto">{erroTamanho}</p>}

                    <div className="emm-form-acoes">
                        <button className="emm-cancelar" type="button" onClick={fechar}>Cancelar</button>
                        <button className="emm-salvar" type="submit">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}