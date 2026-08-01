import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import path from 'path';
import livrosRoutes from './routes/livros';

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração de Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Arquivos estáticos
app.use(express.static(path.join(process.cwd(), 'public')));

// Configuração do Express Session (Mantém logado por 30 dias)
app.use(session({
  secret: 'biblioteca-aluisio-azevedo-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30
  }
}));

// Configura o EJS
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'src', 'views'));

// Middleware Global
app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.usuario = (req.session as any).usuario || null;
  next();
});

// Middleware de Proteção de Rota
export function exigirAutenticacao(req: Request, res: Response, next: NextFunction) {
  if ((req.session as any).usuario) {
    return next();
  }
  res.redirect('/login');
}

// Tipagens
export interface Usuario {
  nome: string;
  email: string;
  senha?: string;
}

export interface Livro {
  id: number;
  titulo: string;
  autor?: string;
  categoria?: string;
  capa?: string;
  status: 'disponivel' | 'emprestado';
}

export const usuarios: Usuario[] = [];

// Lista global de livros em memória vinculados com os arquivos reais da pasta uploads
export let livros: Livro[] = [
  { id: 1, titulo: 'Dom Casmurro', autor: 'Machado de Assis', categoria: 'Literatura Brasileira', capa: '/uploads/dom-casmurro.jpg', status: 'disponivel' },
  { id: 2, titulo: 'O Cortiço', autor: 'Aluísio Azevedo', categoria: 'Literatura Brasileira', capa: '/uploads/o-cortiço.jpg', status: 'emprestado' },
  { id: 3, titulo: 'Memórias Póstumas de Brás Cubas', autor: 'Machado de Assis', categoria: 'Literatura Brasileira', capa: '/uploads/memorias-postumas.jpg', status: 'disponivel' },
  { id: 4, titulo: 'Vidas Secas', autor: 'Graciliano Ramos', categoria: 'Literatura Brasileira', capa: '/uploads/vidas-secas.jpg', status: 'disponivel' },
  { id: 5, titulo: '1984', autor: 'George Orwell', categoria: 'Ficção Científica', capa: '/uploads/1984.jpg', status: 'disponivel' },
  { id: 6, titulo: 'O Hobbit', autor: 'J.R.R. Tolkien', categoria: 'Fantasia', capa: '/uploads/o-hobbit.jpg', status: 'emprestado' },
  { id: 7, titulo: 'Harry Potter', autor: 'J.K. Rowling', categoria: 'Fantasia', capa: '/uploads/harry-potter-jpg.webp', status: 'disponivel' },
  { id: 8, titulo: 'A Culpa é das Estrelas', autor: 'John Green', categoria: 'Romance', capa: '/uploads/culpa-e-das-estrelas.jpg', status: 'disponivel' },
  { id: 9, titulo: 'É Assim Que Acaba', autor: 'Colleen Hoover', categoria: 'Romance', capa: '/uploads/e-assim-que-acaba,jpg.webp', status: 'emprestado' },
  { id: 10, titulo: 'Orgulho e Preconceito', autor: 'Jane Austen', categoria: 'Romance', capa: '/uploads/orgulho-e-preconceito.jpg', status: 'disponivel' }
];

// --- ROTAS DO MÓDULO DE LIVROS ---
app.use('/livros', exigirAutenticacao, livrosRoutes);

// --- ROTAS DAS PÁGINAS ---
app.get('/', exigirAutenticacao, (req: Request, res: Response) => {
  res.render('pagina-inicial', {
    titulo: 'Biblioteca Aluísio Azevedo',
    itens: livros
  });
});

app.get('/login', (req: Request, res: Response) => {
  if ((req.session as any).usuario) {
    return res.redirect('/');
  }
  res.render('login', { titulo: 'Biblioteca Aluísio Azevedo', erro: null });
});

app.get('/logout', (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// --- ROTAS DE AUTENTICAÇÃO ---
app.post('/login', (req: Request, res: Response) => {
  const { email, senha } = req.body;
  const usuarioEncontrado = usuarios.find(u => u.email === email && u.senha === senha);

  if (!usuarioEncontrado) {
    return res.render('login', { 
      titulo: 'Biblioteca Aluísio Azevedo', 
      erro: 'Conta não encontrada ou dados incorretos.' 
    });
  }

  (req.session as any).usuario = usuarioEncontrado;
  res.redirect('/');
});

app.post('/register', (req: Request, res: Response) => {
  const { nome, email, senha } = req.body;

  if (!email || !senha) {
    return res.render('login', { 
      titulo: 'Biblioteca Aluísio Azevedo', 
      erro: 'Preencha todos os campos obrigatórios.' 
    });
  }

  const usuarioExistente = usuarios.find(u => u.email === email);
  if (usuarioExistente) {
    return res.render('login', { 
      titulo: 'Biblioteca Aluísio Azevedo', 
      erro: 'Este e-mail já está cadastrado.' 
    });
  }

  const novoUsuario: Usuario = { 
    nome: nome || email.split('@')[0], 
    email, 
    senha 
  };
  usuarios.push(novoUsuario);

  (req.session as any).usuario = novoUsuario;
  res.redirect('/');
});

// --- ROTAS DA API ---
app.get('/api/livros', exigirAutenticacao, (req: Request, res: Response) => {
  const busca = (req.query.busca as string || '').toLowerCase();
  const resultado = livros.filter(l => 
    l.titulo.toLowerCase().includes(busca) || 
    (l.autor && l.autor.toLowerCase().includes(busca)) ||
    (l.categoria && l.categoria.toLowerCase().includes(busca))
  );
  res.json(resultado);
});

app.patch('/api/livros/:id/toggle-status', exigirAutenticacao, (req: Request, res: Response) => {
  const paramId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(paramId, 10);
  const livro = livros.find(l => l.id === id);

  if (!livro) {
    res.status(404).json({ mensagem: 'Livro não encontrado' });
    return;
  }

  livro.status = livro.status === 'disponivel' ? 'emprestado' : 'disponivel';
  res.json({ mensagem: 'Status alterado com sucesso', novoStatus: livro.status });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

export default app;