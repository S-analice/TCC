import React, { useState, useEffect } from "react";
import Barra from "./components/Barra"; 
import Home from "./views/Home";
import Login from "./views/Login";
import EsqueceuSenha from "./views/EsqueceuSenha"; 
import RedefinirSenha from "./views/RedefinirSenha"; 
import Funcionario from "./views/Funcionario";
import Empresa from "./views/Empresa"
import Motorista from "./views/Motorista";
import Movimentacao from "./views/Movimentacao";
import Relatorio from "./views/Relatorio";

export default function App() {
  const [telaAtual, setTelaAtual] = useState("home");
  const [estaLogado, setEstaLogado] = useState(false);
  const [funcionarioLogado, setFuncionarioLogado] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paginaSolicitada = params.get("p");

    if (paginaSolicitada === "redefinir") {
      setTelaAtual("redefinir-senha");
      
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  const logout = () => {
    setEstaLogado(false);
    setFuncionarioLogado(null);
    setTelaAtual("home");
  };

  const renderizarPaginaLogada = () => {
    switch (telaAtual) {
      case "home": return <Home funcionario={funcionarioLogado} />;
      case "relatorio": return <Relatorio funcionario={funcionarioLogado}/>;
      case "funcionario": return <Funcionario funcionario={funcionarioLogado}/>; 
      case "empresa": return <Empresa funcionario={funcionarioLogado}/>; 
      case "motorista": return <Motorista funcionario={funcionarioLogado}/>;   
      case "patio": return <Movimentacao funcionario={funcionarioLogado}/>;
      default: return <Home funcionario={funcionarioLogado} />;
    }
  };

  if (!estaLogado) {
    if (telaAtual === "esqueceu-senha") {
      return <EsqueceuSenha voltarParaLogin={() => setTelaAtual("home")} />;
    }
    
    if (telaAtual === "redefinir-senha") {
      return <RedefinirSenha irParaLogin={() => setTelaAtual("home")} />;
    }

    return (
      <Login 
        definirFuncionario={setFuncionarioLogado} 
        irParaHome={() => setEstaLogado(true)}
        irParaEsqueceuSenha={() => setTelaAtual("esqueceu-senha")} 
      />
    );
  }

  return (
    <Barra
      funcionario={funcionarioLogado}
      paginaAtual={telaAtual}
      irParaPagina={setTelaAtual}
      voltarParaLogin={logout}
    >
      {renderizarPaginaLogada()}
    </Barra>
  );
}