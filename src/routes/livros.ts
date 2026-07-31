import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { livros, Livro } from '../app';

const router = Router();

// Configuração do Multer para armazenamento dos uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, '..', '..', 'public', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

// Rota de renderização do formulário de criação
router.get('/novo', (req: Request, res: Response) => {
  res.render('formulario', { livro: null });
});

// Rota de criação do livro
router.post('/novo', upload.single('capa'), (req: Request, res: Response) => {
  const { titulo, autor, status } = req.body || {};

  const capaPath = req.file ? `/uploads/${req.file.filename}` : undefined;

  const novoLivro: Livro = {
    id: livros.length > 0 ? livros[livros.length - 1].id + 1 : 1,
    titulo: titulo || 'Sem título',
    autor: autor || '',
    capa: capaPath,
    status: status || 'disponivel'
  };

  livros.push(novoLivro);
  res.redirect('/');
});

// Rota de renderização do formulário de edição
router.get('/editar/:id', (req: Request, res: Response) => {
  const paramId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(paramId, 10);
  const livroEncontrado = livros.find(l => l.id === id);

  if (!livroEncontrado) return res.redirect('/');

  res.render('formulario', { livro: livroEncontrado });
});

// Rota de atualização do livro
router.post('/editar/:id', upload.single('capa'), (req: Request, res: Response) => {
  const paramId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(paramId, 10);
  
  const { titulo, autor, status } = req.body || {};
  const livroIndex = livros.findIndex(l => l.id === id);

  if (livroIndex !== -1) {
    if (titulo) livros[livroIndex].titulo = titulo;
    if (autor !== undefined) livros[livroIndex].autor = autor;
    if (status) livros[livroIndex].status = status;
    
    if (req.file) {
      livros[livroIndex].capa = `/uploads/${req.file.filename}`;
    }
  }

  res.redirect('/');
});

// --- ROTA DE EXCLUSÃO DO LIVRO ---
router.post('/deletar/:id', (req: Request, res: Response) => {
  const paramId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(paramId, 10);

  const livroIndex = livros.findIndex(l => l.id === id);

  if (livroIndex !== -1) {
    livros.splice(livroIndex, 1);
    return res.status(200).json({ mensagem: 'Livro excluído com sucesso' });
  }

  return res.status(404).json({ mensagem: 'Livro não encontrado' });
});

export default router;