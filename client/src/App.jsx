// Importa hooks do React
import { useState, useEffect } from "react";

// Importa componentes da aplicação
import CardFilme from "./componentes/CardFilme";
import ModalFilme from "./componentes/ModalFIlme";

import "./app.css";

export default function App() {
  // Controle de exibição do modal
  const [modalAberto, setModalAberto] = useState(false);

  // Lista de filmes carregados da API
  const [filmes, setFilmes] = useState([]);

  // Armazena o filme que está sendo editado (ou null se criando)
  const [filmeEditando, setFilmeEditando] = useState(null);

  // Carrega os filmes ao abrir a página
  useEffect(() => {
    async function carregarFilmes() {
      try {
        // Busca os filmes do backend
        const resposta = await fetch("http://localhost:3000/filmes");
        const dados = await resposta.json();
        console.log(dados);

        // Atualiza o estado dos filmes
        setFilmes(dados);
      } catch (erro) {
        console.error("Erro ao buscar filmes:", erro);
      }
    }

    carregarFilmes();
  }, []); // [] garante que rode apenas ao carregar a página

 
  // Adicionar novo filme
  async function adicionarFilme(novoFilme) {
    try {
      // adiciona o filme no backend
      const resposta = await fetch("http://localhost:3000/filmes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoFilme),
      });

      // Recebe o filme criado pelo backend
      const filmeCriado = await resposta.json();

      // Atualiza a lista adicionando o novo filme
      setFilmes((atual) => [...atual, filmeCriado]);

      // Fecha o modal
      setModalAberto(false);

      console.log(filmeCriado);
    } catch (erro) {
      console.error("Erro ao adicionar filme:", erro);
    }
  }

  // Preparar edição de um filme
  function editarFilme(filme) {
    setFilmeEditando(filme); // Define qual será editado
    setModalAberto(true);    // Abre o modal com os dados preenchidos
  }


  // Salvar edição do filme
  async function salvarEdicao(filmeAtualizado) {
    try {
      // editar o filme no backend
      const resposta = await fetch(
        `http://localhost:3000/filmes/${filmeAtualizado.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(filmeAtualizado),
        }
      );
      // recebe a resposta do filme editado
      const filmeSalvo = await resposta.json();
      console.log(filmeSalvo);

      // Substitui no array o filme atualizado
      setFilmes((atual) =>
        atual.map((f) => (f.id === filmeSalvo.id ? filmeSalvo : f))
      );

      // Limpa estado de edição e fecha modal
      setFilmeEditando(null);
      setModalAberto(false);
    } catch (erro) {
      console.error("Erro ao salvar edição:", erro);
    }
  }


  // Excluir filme
  async function excluirFilme(id) {
    if (!window.confirm("Tem certeza que quer excluir este filme?")) return;

    try {
      // Chama o backend para excluir
      await fetch(`http://localhost:3000/filmes/${id}`, {
        method: "DELETE",
      });

      // Remove do estado local
      setFilmes((atual) => atual.filter((f) => f.id !== id));
    } catch (erro) {
      console.error("Erro ao excluir filme:", erro);
    }
  }

  return (
    <div className="tela">
      <h1 className="titulo">Studio Ghibli Check</h1>

      {/* Botão para abrir modal */}
      <button className="botao-principal" onClick={() => setModalAberto(true)}>
        Adicionar Filme
      </button>

      {/* Colunas de Status */}
      <div className="colunas">

        {/* Coluna: Pendentes */}
        <div className="coluna">
          <h2>Pendentes</h2>

          {/* Caso não haja filmes pendentes */}
          {filmes.filter(f => f.status === "pendente").length === 0 && (
            <p className="nenhum">Nenhum filme adicionado ainda...</p>
          )}

          {/* Lista os filmes pendentes */}
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

        {/* Coluna: Em andamento */}
        <div className="coluna">
          <h2>Em Andamento</h2>

          {filmes.filter(f => f.status === "andamento").length === 0 && (
            <p className="nenhum">Nenhum filme adicionado ainda...</p>
          )}

          {filmes
            .filter((f) => f.status === "andamento")
            .map((f) => (
              <CardFilme
                key={f.id}
                filme={f}
                editarFilme={editarFilme}
                excluirFilme={excluirFilme}
              />
            ))}
        </div>

        {/* Coluna: Concluídos */}
        <div className="coluna">
          <h2>Concluídos</h2>

          {filmes.filter(f => f.status === "concluído").length === 0 && (
            <p className="nenhum">Nenhum filme adicionado ainda...</p>
          )}

          {filmes
            .filter((f) => f.status === "concluído")
            .map((f) => (
              <CardFilme
                key={f.id}
                filme={f}
                editarFilme={editarFilme}
                excluirFilme={excluirFilme}
              />
            ))}
        </div>
      </div>

    
      {/* Modal de Cadastro/Edição */}
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

      {/* Rodapé */}
      <footer className="footer">
        <p>
          Desenvolvido por Théo da Costa e Renata Gardênia da Silva Camargo
        </p>
      </footer>
    </div>
  );
}
