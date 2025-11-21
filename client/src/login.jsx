import { useState } from "react";
import "./login.css";

export default function Login({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(""); 
  function handleLogin(e) {
    e.preventDefault(); 
    if (usuario === "admin" && senha === "123") {
      onLogin(); // login correto
    } else {
      setErro("Usuário ou senha incorretos. Tente novamente!"); 
    }
  }

  return (
    <div className="login-tela">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>

        {/* Mensagem de erro */}
        {erro && <p className="erro">{erro}</p>}

        <label>Usuário:</label>
        <input
          type="text"
          className="campo"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />

        <label>Senha:</label>
        <input
          type="password"
          className="campo"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <button type="submit" className="botao-login">
          Entrar
        </button>
      </form>
    </div>
  );
}
