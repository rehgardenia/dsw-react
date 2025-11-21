import express from 'express';
import cors from "cors";
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';


const app = express();

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rota inicial
app.get('/', (req, res) => res.json({ message: 'API funcionando com MongoDB e Prisma!' }));


// CRUD de filmes

// CREATE
app.post('/filmes', async (req, res) => {
  const { titulo, status, resenha, nota, icone } = req.body;
  const novoFilme = await prisma.filme.create({
    data: { titulo, status, resenha, nota , icone},
  });
  res.status(201).json(novoFilme);
});

// READ - todos
app.get('/filmes', async (req, res) => {
  const filmes = await prisma.filme.findMany();
  res.json(filmes);
});

// READ - por id
app.get('/filmes/:id', async (req, res) => {
  const { id } = req.params;
  const filme = await prisma.filme.findUnique({ where: { id } });
  if (!filme) return res.status(404).json({ message: 'Filme não encontrado.' });
  res.json(filme);
});

// UPDATE
app.put('/filmes/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, status, resenha, nota ,icone } = req.body;
  try {
    const atualizado = await prisma.filme.update({
      where: { id },
      data: { titulo, status, resenha, nota, icone },
    });
    res.json(atualizado);
  } catch (error) {
    res.status(404).json({ message: 'Filme não encontrado.' });
  }
});

// DELETE
app.delete('/filmes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.filme.delete({ where: { id } });
    res.status(204).json({ message: 'Filme removido com sucesso.' });
  } catch (error) {
    res.status(404).json({ message: 'Filme não encontrado.' });
  }
});

app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
