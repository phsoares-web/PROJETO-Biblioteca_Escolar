import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import path from 'path';
import livrosRoutes from './routes/livros';

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração de Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Arquivos estáticos (Usando process.cwd() para encontrar a pasta 'public' na raiz independente de compilação)
app.use(express.static(path.join(process.cwd(), 'public')));

// Configuração do Express Session (Com cookie de longa duração para não deslogar ao fechar o site)
app.use(session({
  secret: 'biblioteca-aluisio-azevedo-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30 // Mantém a sessão salva por 30 dias no navegador
  }
}));

// Configura o EJS (Buscando a pasta views a partir da raiz do projeto)
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'src', 'views'));

// Middleware Global: Injeta o usuário logado em TODAS as telas (views)
app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.usuario = (req.session as any).usuario || null;
  next();
});

// Middleware de Proteção de Rota (Exige que o usuário esteja logado)
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
  capa?: string;
  status: 'disponivel' | 'emprestado';
}

// Lista global de usuários em memória
export const usuarios: Usuario[] = [];

// Lista global de livros em memória
export let livros: Livro[] = [
  { id: 1, titulo: 'Dom Casmurro', autor: 'Machado de Assis', status: 'disponivel' },
  { id: 2, titulo: 'O Cortiço', autor: 'Aluísio Azevedo', status: 'emprestado' },
  { id: 3, titulo: 'Memórias Póstumas de Brás Cubas', autor: 'Machado de Assis', status: 'disponivel' },
  { id: 4, titulo: 'Grande Sertão: Veredas', autor: 'Guimarães Rosa', status: 'disponivel' }
];

// --- ROTAS DO MÓDULO DE LIVROS (Protegido por Autenticação) ---
app.use('/livros', exigirAutenticacao, livrosRoutes);

// --- ROTAS DAS PÁGINAS (GET) ---

// Página Principal (Protegida: Redireciona para /login se não estiver autenticado)
app.get('/', exigirAutenticacao, (req: Request, res: Response) => {
  res.render('pagina-inicial', {
    titulo: 'Biblioteca Aluísio Azevedo',
    itens: livros
  });
});

// Tela de Login / Cadastro
app.get('/login', (req: Request, res: Response) => {
  // Se já estiver logado, redireciona direto para a página inicial
  if ((req.session as any).usuario) {
    return res.redirect('/');
  }
  res.render('login', { titulo: 'Biblioteca Aluísio Azevedo', erro: null });
});

// Rota de Logout
app.get('/logout', (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// --- ROTAS DE AUTENTICAÇÃO (POST) ---

// 1. Rota de Login (Valida se o usuário já existe)
app.post('/login', (req: Request, res: Response) => {
  const { email, senha } = req.body;

  const usuarioEncontrado = usuarios.find(u => u.email === email && u.senha === senha);

  if (!usuarioEncontrado) {
    return res.render('login', { 
      titulo: 'Biblioteca Aluísio Azevedo', 
      erro: 'Conta não encontrada ou dados incorretos. Cadastre-se antes de entrar!' 
    });
  }

  (req.session as any).usuario = usuarioEncontrado;
  console.log('Login efetuado:', { email: usuarioEncontrado.email });

  res.redirect('/');
});

// 2. Rota de Cadastro
app.post('/register', (req: Request, res: Response) => {
  const { nome, email, senha } = req.body;

  if (!email || !senha) {
    return res.render('login', { 
      titulo: 'Biblioteca Aluísio Azevedo', 
      erro: 'Preencha todos os campos obrigatórios para se cadastrar.' 
    });
  }

  const usuarioExistente = usuarios.find(u => u.email === email);
  if (usuarioExistente) {
    return res.render('login', { 
      titulo: 'Biblioteca Aluísio Azevedo', 
      erro: 'Este e-mail já está cadastrado. Faça login para acessar.' 
    });
  }

  const novoUsuario: Usuario = { 
    nome: nome || email.split('@')[0], 
    email, 
    senha 
  };
  usuarios.push(novoUsuario);

  (req.session as any).usuario = novoUsuario;
  console.log('Novo usuário cadastrado:', { nome: novoUsuario.nome, email: novoUsuario.email });

  res.redirect('/');
});

// --- ROTAS DA API (Protegidas) ---
app.get('/api/livros', exigirAutenticacao, (req: Request, res: Response) => {
  const busca = (req.query.busca as string || '').toLowerCase();
  const resultado = livros.filter(l => l.titulo.toLowerCase().includes(busca));
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

  res.json({
    mensagem: 'Status alterado com sucesso',
    novoStatus: livro.status
  });
});

// --- INICIALIZAÇÃO DO SERVIDOR ---
app.listen(PORT, () => {
  console.log(`\n=================================`);
  console.log(`🚀 Servidor rodando com sucesso!`);
  console.log(`👉 Acesse em: http://localhost:${PORT}`);
  console.log(`=================================\n`);
});

export default app;