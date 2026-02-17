import Login from "./pages/Login"
import EsqueceuSenha from "./pages/EsqueceuSenha";
import Barra from "./components/Barra";
import InfoUsuarioModal from "./components/InfoUsuarioModal";

import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

function App() {
  const [usuario, setUsuario] = useState(null);
  const [paginaInterna, setPaginaInterna] = useState("home");
  const [mostrarModalUsuario, setMostrarModalUsuario] = useState(false);

  // caminho de uma página a outra
  const navigate = useNavigate();

  const definirUsuario = (usuarioCompleto) => {
    setUsuario(usuarioCompleto);
  };

  const irParaEsqueceuSenha = () => {
    navigate("/esqueceu-senha");
  };

  const irParaHome = () => {
    navigate("/home");
  };

  const voltarParaLogin = () => {
    setUsuario(null);
    navigate("/");
  }

  return (
    <>
      {/*mapa*/} 
      <Routes>
        <Route path="/" element={<Login definirUsuario={definirUsuario} irParaEsqueceuSenha={irParaEsqueceuSenha} irParaHome={irParaHome}/>} />
        <Route path="/esqueceu-senha" element={<EsqueceuSenha voltarParaLogin={voltarParaLogin}/>} />
          
        <Route path="/home"
          element={
            <Barra
              usuario={usuario}
              paginaAtual={paginaInterna}
              irParaPagina={setPaginaInterna}
              mostrarInfoUsuario={() => setMostrarModalUsuario(true)}
              voltarParaLogin={voltarParaLogin}
            >
              <div>
                {paginaInterna === "home" && <h2>Página Home</h2>}
                {paginaInterna === "funcionario" && <h2>Página Funcionário</h2>}
                {paginaInterna === "motorista" && <h2>Página Motorista</h2>}
                {paginaInterna === "patio" && <h2>Página Pátio</h2>}
                {paginaInterna === "relatorio" && <h2>Página Relatório</h2>}
              </div>
            </Barra>
          }
        />
      </Routes>

      {mostrarModalUsuario && (
        <InfoUsuarioModal usuario={usuario} fechar={() => setMostrarModalUsuario(false)} />
      )}
    </>
  );
}

export default function AppComRouter() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}