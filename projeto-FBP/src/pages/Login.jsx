import "../styles/Login.css";
import { useState } from "react";
import Carregando from "../components/Carregando";

export default function Login( {nomeUsuario, irParaEsqueceuSenha, irParaHome } ) {

    const [carregando, setCarregando] = useState(false);

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");

    const enviarFormulario = (e) => {
        e.preventDefault(); // página não recarrega

        setCarregando(true);
        setErro(""); // apaga erro anterior

        // simular carregamento
        setTimeout(() => {

            const funcionario = {
                nome:"João Silva",
                email:"joao@gmail.com",
                senha:"123456"
            }

           if(email === funcionario.email && senha === funcionario.senha) {
            nomeUsuario(funcionario.nome);
            setCarregando(false); 
            irParaHome();
           }

           else{
            setCarregando(false);
            setErro("Email ou senha inválidos!");
           }
        }, 2000);
    }


    return (
        <div className="card-container">

            {carregando &&<Carregando />}

            <div className="card-fundo">
                <div className="logo-retangulo">
                    
                    <img src="/logo.jpeg" alt="Logo FBP" className="logo-img" />    
                    <h1 className="logo-titulo">FBP</h1>
                </div>


                <form onSubmit={enviarFormulario} className="form">
                    <div className="form-container">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" id="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    <div className="form-container">
                        <label htmlFor="password" className="form-label">Senha</label>
                        <input type="password" id="password" className="form-input" value={senha} onChange={(e) => setSenha(e.target.value)} required />
                    </div>

                    {erro && <p className="erro-texto">{erro}</p>}

                    <div className="form-acoes">
                    <button type="button" className="esqueceu-senha" onClick={irParaEsqueceuSenha}>Esqueceu a senha?</button>
                    
                    <button type="submit" className="botao">Logar</button>
                    </div>
                </form>
            </div>
        </div>
    );
} 