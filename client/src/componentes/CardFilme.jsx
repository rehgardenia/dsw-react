import "../app.css"; // Importa o CSS do aplicativo

// Componente CardFilme 
export default function CardFilme({ filme, editarFilme, excluirFilme }) {
  return (
    <div className="card-filme">
      {/* Imagem */}
      <div className="icone-container">
        {filme.icone ? (
          // Se houver ícone, mostra a imagem redonda
          <img src={filme.icone} className="icone-redondo" alt="Ícone" />
        ) : (
          // Senão, mostra o placeholder
          <div className="icone-placeholder">Sem imagem</div>
        )}
      </div>
{/* Informações do Filme */}
      <div className="info">
        <h3>{filme.titulo}</h3>
        <p><strong>Nota:</strong> {filme.nota}</p>
        <p className="opiniao">{filme.resenha}</p>

        <div className="botoes-modal">
          <button className="botao salvar" onClick={() => editarFilme(filme)}>
            Editar
          </button>
          <button className="botao cancelar" onClick={() => excluirFilme(filme.id)}>
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
