import "../app.css";
export default function CardFilme({ filme, editarFilme, excluirFilme }) {
  return (
    <div className="card-filme">
      <div className="icone-container">
        {filme.icone ? (
          <img src={filme.icone} className="icone-redondo" alt="Ícone" />
        ) : (
          <div className="icone-placeholder">Sem imagem</div>
        )}
      </div>

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
