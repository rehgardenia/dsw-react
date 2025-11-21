import { useState, useEffect } from "react";
import CardFilme from "./componentes/CardFilme";
import ModalFilme from "./componentes/ModalFIlme";

import "./app.css";

export default function App() {
  const [modalAberto, setModalAberto] = useState(false);
  const [filmes, setFilmes] = useState([]);
  const [filmeEditando, setFilmeEditando] = useState(null);

  // Carregar os Filmes
  useEffect(() => {
  async function carregarFilmes() {
    try {
      const resposta = await fetch("http://localhost:3000/filmes");
      const dados = await resposta.json();
      console.log(dados);
      setFilmes(dados);  // ← coloca os filmes no seu state
    } catch (erro) {
      console.error("Erro ao buscar filmes:", erro);
    }
  }

  carregarFilmes();
}, []);

  // Adiciona novo filme
 async function adicionarFilme(novoFilme) {
    try {
      const resposta = await fetch("http://localhost:3000/filmes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoFilme),
      });

      const filmeCriado = await resposta.json();

      setFilmes((atual) => [...atual, filmeCriado]);
      setModalAberto(false);
      console.log(filmeCriado);

    } catch (erro) {
      console.error("Erro ao adicionar filme:", erro);
    }
  }


  // Prepara o filme para edição
  function editarFilme(filme) {
    setFilmeEditando(filme);
    setModalAberto(true);
  }

  // Salva edição do filme
 async function salvarEdicao(filmeAtualizado) {
    try {
      const resposta = await fetch(`http://localhost:3000/filmes/${filmeAtualizado.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filmeAtualizado),
      });

      const filmeSalvo = await resposta.json();
      console.log(filmeSalvo);
      setFilmes((atual) =>
        atual.map((f) => (f.id === filmeSalvo.id ? filmeSalvo : f))
      );

      setFilmeEditando(null);
      setModalAberto(false);

    } catch (erro) {
      console.error("Erro ao salvar edição:", erro);
    }
  }

  // Exclui filme
    async function excluirFilme(id) {
    if (!window.confirm("Tem certeza que quer excluir este filme?")) return;

    try {
      await fetch(`http://localhost:3000/filmes/${id}`, {
        method: "DELETE",
      });

      setFilmes((atual) => atual.filter((f) => f.id !== id));

    } catch (erro) {
      console.error("Erro ao excluir filme:", erro);
    }
  }
  return (
    <div className="tela">
      <h1 className="titulo">Studio Ghibli Check</h1>

      <button className="botao-principal" onClick={() => setModalAberto(true)}>
        Adicionar Filme
      </button>

      <div className="colunas">
        {/* Coluna Pendentes */}
        <div className="coluna">
          <h2>Pendentes</h2>

          {filmes.filter(f => f.status === "pendente").length === 0 && (
            <p className="nenhum">Nenhum filme adicionado ainda...</p>
          )}

          {filmes
            .filter((f) => f.status === "pendente")
            .map((f) => (
              <CardFilme
                key={f.id}
                filme={f}
                editarFilme={editarFilme}
                excluirFilme={excluirFilme}
              />
            ))}
        </div>

        {/* Coluna Em andamento */}
        <div className="coluna">
          <h2>Em Andamento</h2>
          {filmes.filter(f => f.status === "andamento").length === 0 && (
            <p className="nenhum">Nenhum filme adicionado ainda...</p>
          )}

          {filmes
            .filter((f) => f.status === "andamento")
            .map((f) => (
              <CardFilme key={f.id}
                filme={f}
                editarFilme={editarFilme}
                excluirFilme={excluirFilme}
              />
            ))}
        </div>

        {/* Coluna Concluídos */}
        <div className="coluna">
          <h2>Concluídos</h2>
          {filmes.filter(f => f.status === "concluído").length === 0 && (
            <p className="nenhum">Nenhum filme adicionado ainda...</p>
          )}

          {filmes
            .filter((f) => f.status === "concluído")
            .map((f) => (
              <CardFilme key={f.id}
                filme={f}
                editarFilme={editarFilme}
                excluirFilme={excluirFilme}
              />
            ))}
        </div>
      </div>

      {/* Modal */}
      {modalAberto && (
        <ModalFilme
          fechar={() => {
            setModalAberto(false);
            setFilmeEditando(null);
          }}
          salvar={filmeEditando ? salvarEdicao : adicionarFilme}
          filmeEditando={filmeEditando}
        />
      )}

      {/* Footer */}
      <footer className="footer">
        <p>Desenvolvido por Théo da Costa e Renata Gardênia da Silva Camargo</p>
      </footer>
    </div>
  );
}

