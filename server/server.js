// Principais Importações
import express from 'express'; // Framework para criar servidor web
import cors from "cors"; // Permite chamadas de outros domínicos
import { PrismaClient } from '@prisma/client'; // Cliente Prisma para acessar o banco de dados
import 'dotenv/config'; // Carrega variavés de ambiente

// Iniciaplização da API
const app = express(); // Cria uma instância do servidor Express
const prisma = new PrismaClient(); // Cria uma instância do Prisma
const PORT = process.env.PORT || 3000; // Define a porta do servidor(onde a api está localizada)

app.use(cors()); // habilita o CORS
app.use(express.json()); // Habilta receber dados em JSON

// Quando o servidor estiver rodando, imprime uma mensagem no console
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));

// Rotas

// Rota inicial para teste
app.get('/', (req, res) => res.json({ message: 'API funcionando com MongoDB e Prisma!' }));


// CRUD 

// CREATE : adiciona um novo filme
app.post('/filmes', async (req, res) => {
  try {
    // recebe os dados do corpo de requisição
    const { titulo, status, resenha, nota, icone } = req.body;

    // cria o registro no banco usando o prisma
    const novoFilme = await prisma.filme.create({
      data: { titulo, status, resenha, nota, icone },
    });

    // retorna o filme criado 
    res.status(201).json(novoFilme);
    console.log("Filme criado:", novoFilme);

  } catch (error) {

    // Log detalhado no servidor para depuração
    console.error("Erro ao criar filme:", error);

    // Retorna mensagem amigável ao usuário
    res.status(500).json({ message: 'Ocorreu um erro ao criar o filme. Tente novamente.' });
  }

});

// READ : Lista todos os filmes
app.get('/filmes', async (req, res) => {

  try {
    // Busca todos os filmes no banco usando Prisma
    const filmes = await prisma.filme.findMany();

    // Retorna os filmes encontrados
    res.status(200).json(filmes);
  } catch (error) {
    // Log detalhado no servidor para depuração
    console.error("Erro ao buscar filmes:", error);

    // Retorna mensagem amigável ao usuário
    res.status(500).json({ message: 'Ocorreu um erro ao buscar os filmes. Tente novamente.' });
  }

});

// UPDATE : Atualiza um filme existente
app.put('/filmes/:id', async (req, res) => {
 // Pega o ID do filme pelos parâmetros da rota
  const { id } = req.params;
  // Recebe os dados enviados pelo frontend no corpo da requisição
  const { titulo, status, resenha, nota, icone } = req.body;

  try {
    // Atualiza o filme no banco de dados usando Prisma
    // 'id' é usado como chave de busca e os demais campos são atualizados
    const atualizado = await prisma.filme.update({
      where: { id },
      data: { titulo, status, resenha, nota, icone },
    });

    // Retorna o filme atualizado para o frontend
    res.status(200).json(atualizado);

     // Log no servidor para depuração
    console.log("Filme atualizado:", atualizado);

  } catch (error) {
     // Mostra o erro no console para depuração
    console.error("Erro ao atualizar filme:", error);

    // Retorna uma mensagem amigável ao usuário
    // Se o registro não existir, Prisma lança P2025
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Filme não encontrado.' });
    }

    // Para outros erros inesperados, retorna status 500
    res.status(500).json({ message: 'Ocorreu um erro ao atualizar o filme. Tente novamente.' });
  }
});

// DELETE: Remove um filme existente
app.delete('/filmes/:id', async (req, res) => {
   // Pega o ID do filme pelos parâmetros da rota
  const { id } = req.params;

  try {
     // Remove o filme do banco de dados usando Prisma
    await prisma.filme.delete({ where: { id } });

     // Retorna status 204 (sem conteúdo) indicando sucesso
    res.status(204).json({ message: 'Filme removido com sucesso.' });

    // Log no servidor para depuração
    console.log(`Filme com ID ${id} removido com sucesso.`);

  } catch (error) {

   // Log detalhado no console
    console.error("Erro ao remover filme:", error);

    // Prisma lança P2025 se o registro não existir
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Filme não encontrado.' });
    }

    // Para outros erros inesperados, retorna status 500
    res.status(500).json({ message: 'Ocorreu um erro ao remover o filme. Tente novamente.' });
  }
});

