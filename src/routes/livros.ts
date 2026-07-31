import { Router, Request, Response } from 'express';
import { livros, Livro } from '../app';

const router = Router();

// Rota para abrir o formulário de NOVO livro
router.get('/novo', (req: Request, res: Response) => {
  res.render('formulario', { livro: null });
});

// Processa o cadastro de NOVO livro
router.post('/novo', (req: Request, res: Response) => {
  const { titulo, autor, status } = req.body;

  const novoLivro: Livro = {
    id: livros.length > 0 ? livros[livros.length - 1].id + 1 : 1,
    titulo: titulo || 'Sem título',
    autor: autor || 'Desconhecido',
    status: status || 'disponivel'
  };

  livros.push(novoLivro);
  res.redirect('/');
});

// Renderiza a página para EDITAR livro
router.get('/editar/:id', (req: Request, res: Response) => {
  const paramId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(paramId, 10);
  const livroEncontrado = livros.find(l => l.id === id);

  if (!livroEncontrado) {
    return res.redirect('/');
  }

  res.render('formulario', { livro: livroEncontrado });
});

// Processa a EDIÇÃO do livro
router.post('/editar/:id', (req: Request, res: Response) => {
  const paramId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(paramId, 10);
  const { titulo, autor, status } = req.body;
  
  // Usando l em vez do número 1
  const livroIndex = livros.findIndex(l => l.id === id);

  if (livroIndex !== -1) {
    livros[livroIndex].titulo = titulo;
    livros[livroIndex].autor = autor;
    livros[livroIndex].status = status;
  }

  res.redirect('/');
});

export default router;