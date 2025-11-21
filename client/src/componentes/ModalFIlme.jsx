import { useState, useEffect } from "react";
import "../app.css";

export default function ModalFilme({ fechar, salvar, filmeEditando }) {
  const [titulo, setTitulo] = useState("");
  const [nota, setNota] = useState("");
  const [resenha, setResenha] = useState("");
  const [icone, setIcone] = useState(null);
  const [status, setStatus] = useState("pendente");

  // Atualiza os campos quando filmeEditando mudar
  useEffect(() => {
    if (filmeEditando) {
      setTitulo(filmeEditando.titulo || "");
      setNota(filmeEditando.nota || "");
      setResenha(filmeEditando.resenha || "");
      setIcone(filmeEditando.icone || null);
      setStatus(filmeEditando.status?.toLowerCase() ?? "pendente");

    }
  }, [filmeEditando]);

  function handleIcone(e) {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setIcone(url);
  }

  function handleSalvar() {
    if (!titulo.trim()) return alert("Digite o titulo do filme!");

    salvar({
      id: filmeEditando?.id || Date.now(),
      titulo,
      nota,
      resenha,
      icone,
      status
    });
  }

  return (
    <div className="modal-fundo">
      <div className="modal">
        <h2>{filmeEditando ? "Editar Filme" : "Adicionar Filme"}</h2>

        <div className="icone-container">
          {icone ? (
            <img src={icone} className="icone-redondo" alt="Ícone" />
          ) : (
            <div className="icone-placeholder">Sem imagem</div>
          )}
          <input type="file" accept="image/*" onChange={handleIcone} />
        </div>

        <label>Título do Filme:</label>
        <input className="campo" value={titulo} onChange={(e) => setTitulo(e.target.value)} />

        <label>Status:</label>
        <select className="campo-select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pendente">Pendente</option>
          <option value="andamento">Em Andamento</option>
          <option value="concluído">Concluído</option>
        </select>

        <label>Nota (0-10):</label>
        <input
          type="number"
          className="campo"
          min="0"
          max="10"
          value={nota}
          onChange={(e) => setNota(e.target.value)}
        />

        <label>Resenha:</label>
        <textarea
          className="campo textarea"
          value={resenha}
          onChange={(e) => setResenha(e.target.value)}
        />

        <div className="botoes-modal">
          <button className="botao cancelar" onClick={fechar}>
            Cancelar
          </button>
          <button className="botao salvar" onClick={handleSalvar}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
