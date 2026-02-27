import Login from "./pages/Login"
import EsqueceuSenha from "./pages/EsqueceuSenha";

import Barra from "./components/Barra";
import Home from "./pages/Home";
import Funcionario from "./pages/Funcionario";
import Motorista from "./pages/Motorista";
import Patio from "./pages/Patio";
import Relatorio from "./pages/Relatorio";

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

  const renderizarPaginaInterna = () => {
    switch (paginaInterna) {
      case "home":
        return <Home usuario={usuario} />;
      case "funcionario":
        return <Funcionario usuario={usuario}/>;
      case "motorista":
        return <Motorista usuario={usuario} />;
      case "patio":
        return <Patio usuario={usuario} />;
      case "relatorio":
        return <Relatorio usuario={usuario} />;
      default:
        return <Home usuario={usuario} />;
    }
  };


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
              {renderizarPaginaInterna()}
            </Barra>
          }
        />
      </Routes> n  
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