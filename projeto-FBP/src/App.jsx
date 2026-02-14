import Login from "./pages/Login"
import EsqueceuSenha from "./pages/EsqueceuSenha";

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

  const voltarParaLogin = () => {
    navigate("/");
  }

  return (

    // mapa 
    <Routes>
        <Route path="/" element={<Login nomeUsuario={definirNomeUsuario} irParaEsqueceuSenha={irParaEsqueceuSenha} />} />
        <Route path="/esqueceu-senha" element={<EsqueceuSenha voltarParaLogin={voltarParaLogin}/>} />
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