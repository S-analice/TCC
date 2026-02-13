import Login from "./pages/Login"
import { useState } from "react";

function App() {
  const [usuario, setUsuario] = useState(null);

  const definirNomeUsuario = (nome) => {
    setUsuario(nome);
  }

  return <Login nomeUsuario={definirNomeUsuario} />;
}

export default App;