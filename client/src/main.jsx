import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Login from "./login.jsx";
import "./app.css";

function Main() {
  const [logado, setLogado] = useState(false);

  return logado ? <App /> : <Login onLogin={() => setLogado(true)} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
