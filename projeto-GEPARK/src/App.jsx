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
  const [funcionario, setFuncionario] = useState(null);
  const [paginaInterna, setPaginaInterna] = useState("home");

  // caminho de uma página a outra
  const navigate = useNavigate();

  const definirFuncionario = (funcionarioCompleto) => {
    setFuncionario(funcionarioCompleto);
  };

  const irParaEsqueceuSenha = () => {
    navigate("/esqueceu-senha");
  };

  const irParaHome = () => {
    navigate("/home");
  };

  const voltarParaLogin = () => {
    setFuncionario(null);
    navigate("/");
  }

  const renderizarPaginaInterna = () => {
    switch (paginaInterna) {
      case "home":
        return <Home funcionario={funcionario} />;
      case "funcionario":
        return <Funcionario funcionario={funcionario} />;
      case "motorista":
        return <Motorista funcionario={funcionario} />;
      case "patio":
        return <Patio funcionario={funcionario} />;
      case "relatorio":
        return <Relatorio funcionario={funcionario} />;
      default:
        return <Home funcionario={funcionario} />;
    }
  };


  return (
    <>
      {/*mapa*/}
      <Routes>
        <Route path="/" element={<Login definirFuncionario={definirFuncionario} irParaEsqueceuSenha={irParaEsqueceuSenha} irParaHome={irParaHome} />} />
        <Route path="/esqueceu-senha" element={<EsqueceuSenha voltarParaLogin={voltarParaLogin} />} />

        <Route path="/home"
          element={
            <Barra
              funcionario={funcionario}
              paginaAtual={paginaInterna}
              irParaPagina={setPaginaInterna}
              voltarParaLogin={voltarParaLogin}
            >
              {renderizarPaginaInterna()}
            </Barra>
          }
        />
      </Routes>
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