import "../styles/Login.css";

export default function Login( {nomeUsuario} ) {

    const enviarFormulario = (e) => {
        e.preventDefault(); //página não recarrega

        nomeUsuario("João Silva");
    }


    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-retangulo">
                    <div className="logo">
                        <svg
                            width="32"
                            height="32"
                            viewBox="0 0 32 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            >
                            <path d="M8 8H16V16H8V8Z" fill="#F4E87C" />
                            <path d="M16 16H24V24H16V16Z" fill="#F4E87C" />
                            <circle cx="20" cy="12" r="4" fill="#7C7C7C" />
                            </svg>
                    </div>
                    <h1 className="login-titulo">FBP</h1>
                </div>


                <form onSubmit={enviarFormulario} className="login-form">
                    <div className="form-container">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" id="email" className="form-input" required />
                    </div>

                    <div className="form-container">
                        <label htmlFor="password" className="form-label">Senha</label>
                        <input type="password" id="password" className="form-input" required />
                    </div>

                    <div className="form-acoes">
                    <a href="#" className="esqueceu-senha">Esqueceu a senha?</a>
                    
                    <button type="submit" className="login-botao">Logar</button>
                    </div>
                </form>
            </div>
        </div>
    );
} 