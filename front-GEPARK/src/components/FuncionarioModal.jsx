import "../styles/FuncionarioModal.css";
import { useState } from "react";
import { Upload, Trash2, User } from "lucide-react";
import { converterParaBase64, formatarTelefone } from "../utils/formatadores";
import Mensagem from "./Mensagem";
import { MENSAGENS } from "../utils/mensagens";

export default function FuncionarioModal({ modo, funcionario, funcionarios, turnos, cargos, fechar, salvar }) {
    const [form, setForm] = useState({
        nome: funcionario?.nome || "",
        email: funcionario?.email || "",
        senha: funcionario?.senha || "",
        telefone: funcionario?.telefone || "",
        turnoId: funcionario?.turnoId || "",
        cargoId: funcionario?.cargoId || "",
        status: funcionario?.status || "Ativo",
        foto: funcionario?.foto || ""
    });

    const [modalErro, setModalErro] = useState({ mostrar: false, texto: "" });
    const [erroTexto, setErroTexto] = useState("");

    const handleUpload = async (e) => {
        try {
            const file = e.target.files[0];
            if (file) {
                const base64 = await converterParaBase64(file);
                setForm({ ...form, foto: base64 });
            }
        } catch {
            setModalErro({ mostrar: true, texto: MENSAGENS.ERRO.CARREGAR });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErroTexto("");

        if (!form.nome || !form.email || (modo === "adicionar" && !form.senha)) {
            setErroTexto(MENSAGENS.ERRO.CAMPOS_OBRIGATORIOS);
            return;
        }

        if (!form.cargoId || !form.turnoId) {
            setErroTexto(MENSAGENS.VALIDACAO.SELECIONE);
            return;
        }

        const telefoneNumeros = form.telefone.replace(/\D/g, "");
        if (telefoneNumeros.length > 0 && telefoneNumeros.length !== 11) {
            setErroTexto(MENSAGENS.VALIDACAO.TELEFONE_DIGITOS);
            return;
        }

        if (modo === "adicionar" && form.senha.length < 6) {
            setErroTexto(MENSAGENS.VALIDACAO.SENHA_CURTA);
            return;
        }

        if (modo === "adicionar") {
            if (funcionarios.some(f => f.email === form.email)) {
                setModalErro({ mostrar: true, texto: MENSAGENS.ERRO.EMAIL_DUPLICADO });
                return;
            }
        } else if (modo === "editar") {
            const emailDuplicado = funcionarios.some(f => f.email === form.email && f.id !== funcionario.id);
            if (emailDuplicado) {
                setModalErro({ mostrar: true, texto: MENSAGENS.ERRO.EMAIL_DUPLICADO });
                return;
            }
        }

        salvar(form);
    };

    return (
        <div className="fm-fundo" onClick={fechar}>
            {modalErro.mostrar && (
                <Mensagem 
                    mensagem={modalErro.texto} 
                    modo="erro" 
                    fechar={() => setModalErro({ mostrar: false, texto: "" })} 
                />
            )}

            <div className="fm-card" onClick={e => e.stopPropagation()}>
                <h2>{modo === "adicionar" ? "Novo Funcionário" : "Editar Dados"}</h2>
                <form onSubmit={handleSubmit} className="fm-form">
                    
                    <label className="fm-label">Foto</label>
                    <div className="fm-upload-container">
                        <div className="fm-upload-preview">
                            {form.foto ? <img src={form.foto} alt="Preview" /> : <User size={40}/>}
                        </div>

                        <div className="fm-upload-botao-acoes">
                            <div>
                                <input type="file" id="up" hidden onChange={handleUpload} />
                                <label htmlFor="up" className={`fm-upload-label ${form.foto ? "alterar" : "carregar"}`}>
                                    <Upload size={14}/>
                                    {form.foto ? " Alterar" : " Carregar"}
                                </label>
                                <p className="fm-upload-texto">JPG ou PNG</p>
                            </div>

                            {form.foto && (
                                <button type="button" className="fm-upload-remover" onClick={() => setForm({...form, foto: ""})}>
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="fm-lado-a-lado">
                        <div className="fm-form-container">
                            <label className="fm-label">Nome</label>
                            <input className="fm-input" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} required />
                        </div>

                        <div className="fm-form-container">
                            <label className="fm-label">Telefone</label>
                            <input className="fm-input" value={formatarTelefone(form.telefone)} maxLength={15} onChange={e => setForm({...form, telefone: e.target.value})} required />
                        </div>
                    </div>

                    <div className="fm-form-container">
                        <label className="fm-label">Email</label>
                        <input className="fm-input" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                    </div>

                    {modo === "adicionar" && (
                        <div className="fm-form-container">
                            <label className="fm-label">Senha</label>
                            <input 
                                className="fm-input" 
                                type="password" 
                                value={form.senha} 
                                onChange={e => setForm({...form, senha: e.target.value})} 
                                required 
                            />
                        </div>
                    )}

                    <div className="fm-lado-a-lado">
                        <div className="fm-form-container">
                            <label className="fm-label">Cargo</label>
                            <select className="fm-input" value={form.cargoId} onChange={e => setForm({...form, cargoId: e.target.value})} required>
                                <option value="">Selecione</option>
                                {cargos.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.nome} 
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="fm-form-container">
                            <label className="fm-label">Turno</label>
                            <select className="fm-input" value={form.turnoId} onChange={e => setForm({...form, turnoId: e.target.value})} required>
                                <option value="">Selecione</option>
                                {turnos.map(t => (
                                    <option key={t.id} value={t.id}>
                                        {t.nome} 
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    {modo === "editar" && (
                        <div className="fm-form-container">
                            <label className="fm-label">Status</label>
                            <select 
                                className="fm-input" 
                                value={form.status} 
                                onChange={e => setForm({...form, status: e.target.value})} 
                            >
                                <option value="Ativo">Ativo</option>
                                <option value="Inativo">Inativo</option>
                            </select>
                        </div>
                    )}

                    {erroTexto && <p className="erro-texto">{erroTexto}</p>}

                    <div className="fm-form-acoes">
                        <button className="fm-cancelar" type="button" onClick={fechar}>Cancelar</button>
                        <button className="fm-salvar btn-salvar" type="submit">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}