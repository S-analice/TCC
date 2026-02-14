import Login from "./pages/Login"
import EsqueceuSenha from "./pages/EsqueceuSenha";
import Home from "./pages/Home";

import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

function App() {
  const [usuario, setUsuario] = useState(null);

  // caminho de uma página a outra
  const navigate = useNavigate();

  const definirNomeUsuario = (nome) => {
    setUsuario(nome);
  };

  const irParaEsqueceuSenha = () => {
    navigate("/esqueceu-senha");
  };

  const irParaHome = () => {
    navigate("/home");
  };

  const voltarParaLogin = () => {
    navigate("/");
  }

  return (

    // mapa 
    <Routes>
        <Route path="/" element={<Login nomeUsuario={definirNomeUsuario} irParaEsqueceuSenha={irParaEsqueceuSenha} irParaHome={irParaHome}/>} />
        <Route path="/esqueceu-senha" element={<EsqueceuSenha voltarParaLogin={voltarParaLogin}/>} />
        <Route path="/home" element={<Home/>} />
    </Routes>
  );
}

export default function AppComRouter() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}