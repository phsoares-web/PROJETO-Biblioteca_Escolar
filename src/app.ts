import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import path from 'path';
import livrosRoutes from './routes/livros';

const app = express();

// Configuração de Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Arquivos estáticos
app.use(express.static(path.join(process.cwd(), 'public')));

// Configuração do Express Session
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

export interface Emprestimo {
  id: number;
  livroId: number;
  livroTitulo: string;
  nomeAluno: string;
  dataEmprestimo: string;
  dataDevolucaoPrevista: string;
  status: 'ativo' | 'devolvido';
}

export const usuarios: Usuario[] = [];

// Lista global de livros
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

// Lista global de empréstimos
export let emprestimos: Emprestimo[] = [
  {
    id: 1,
    livroId: 2,
    livroTitulo: 'O Cortiço',
    nomeAluno: 'Bernardo Bueno',
    dataEmprestimo: '2026-07-20',
    dataDevolucaoPrevista: '2026-08-03',
    status: 'ativo'
  }
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

// GET: Página de Listagem + Formulário de Empréstimos
app.get('/emprestimos', exigirAutenticacao, (req: Request, res: Response) => {
  const livrosDisponiveis = livros.filter(l => l.status === 'disponivel');
  res.render('emprestimos', {
    titulo: 'Gestão de Empréstimos',
    emprestimos,
    livrosDisponiveis
  });
});

// POST: Registrar Empréstimo
app.post('/emprestimos', exigirAutenticacao, (req: Request, res: Response) => {
  const { livroId, nomeAluno, dataDevolucaoPrevista } = req.body;
  const idLivroNum = parseInt(livroId, 10);

  const livro = livros.find(l => l.id === idLivroNum);

  if (livro && livro.status === 'disponivel') {
    // Muda o status do livro para emprestado
    livro.status = 'emprestado';

    const novoEmprestimo: Emprestimo = {
      id: emprestimos.length + 1,
      livroId: livro.id,
      livroTitulo: livro.titulo,
      nomeAluno,
      dataEmprestimo: new Date().toISOString().split('T')[0],
      dataDevolucaoPrevista,
      status: 'ativo'
    };

    emprestimos.unshift(novoEmprestimo);
  }

  res.redirect('/emprestimos');
});

// PATCH (API Fetch): Registrar Devolução Dinâmica
app.patch('/api/emprestimos/:id/devolver', exigirAutenticacao, (req: Request, res: Response) => {
  const idEmprestimo = parseInt(req.params.id, 10);
  const emp = emprestimos.find(e => e.id === idEmprestimo);

  if (!emp) {
    return res.status(404).json({ mensagem: 'Empréstimo não encontrado' });
  }

  emp.status = 'devolvido';

  // Torna o livro disponível novamente
  const livro = livros.find(l => l.id === emp.livroId);
  if (livro) {
    livro.status = 'disponivel';
  }

  return res.json({ mensagem: 'Devolução registrada com sucesso!' });
});

// --- ROTAS DE AUTENTICAÇÃO ---
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

export default app;