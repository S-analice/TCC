import "../styles/Login.css";
import { useState } from "react";
import Carregando from "../components/Carregando";

export default function Login( {definirUsuario, irParaEsqueceuSenha, irParaHome } ) {

    const [carregando, setCarregando] = useState(false);

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [senha, setSenha] = useState("");
    const [turno, setTurno] = useState("");
    const [erro, setErro] = useState("");

    const enviarFormulario = (e) => {
        e.preventDefault(); // página não recarrega

        setCarregando(true);
        setErro(""); // apaga erro anterior

        // simular carregamento
        setTimeout(() => {

            const usuario = {
                nome:"Senhor Cabeça de Batata",
                email:"srbatata@gmail.com",
                telefone: "(41) 99123-4567",
                senha:"123456Sr",
                turno:"6:00 - 18:00",
                foto:"/usuario.jpg"
            };

           if(email === usuario.email && senha === usuario.senha) {
            setCarregando(false); 
            definirUsuario(usuario)
            irParaHome();
           }

           else{
            setCarregando(false);
            setErro("Email ou senha inválidos!");
           }
        }, 2000);
    }


    return (
        <div className="login-container">

            {carregando &&<Carregando />}

            <div className="login-card">
                <div className="login-retangulo">
                    
                    <img src="/logo.jpeg" alt="Logo FBP" className="login-img" />    
                    <h1 className="login-titulo">FBP</h1>
                </div>


                <form onSubmit={enviarFormulario} className="login-form">
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
                    
                    <button type="submit" className="login-botao">Logar</button>
                    </div>
                </form>
            </div>
        </div>
    );
} 