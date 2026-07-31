import express, { Request, Response } from 'express';
import path from 'path';
import livrosRoutes from './routes/livros';

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração de Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Arquivos estáticos (CSS, JS, Imagens da pasta public)
app.use(express.static(path.resolve(__dirname, '..', 'public')));

// Configura o EJS
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));

// Estrutura do Livro atualizada com capa
export interface Livro {
  id: number;
  titulo: string;
  autor?: string;
  capa?: string; // Guarda o caminho da imagem enviada
  status: 'disponivel' | 'emprestado';
}

// Lista global de livros na memória
export let livros: Livro[] = [
  { id: 1, titulo: 'Dom Casmurro', autor: 'Machado de Assis', status: 'disponivel' },
  { id: 2, titulo: 'O Cortiço', autor: 'Aluísio Azevedo', status: 'emprestado' },
  { id: 3, titulo: 'Memórias Póstumas de Brás Cubas', autor: 'Machado de Assis', status: 'disponivel' },
  { id: 4, titulo: 'Grande Sertão: Veredas', autor: 'Guimarães Rosa', status: 'disponivel' }
];

// --- ROTAS DO MÓDULO DE LIVROS ---
app.use('/livros', livrosRoutes);

// --- ROTAS DAS PÁGINAS (GET) ---
app.get('/', (req: Request, res: Response) => {
  res.render('pagina-inicial', {
    titulo: 'Biblioteca Aluísio Azevedo',
    itens: livros
  });
});

app.get('/login', (req: Request, res: Response) => {
  res.render('login', { titulo: 'Biblioteca Aluísio Azevedo' });
});

// --- ROTAS DE AUTENTICAÇÃO (POST) ---
app.post('/login', (req: Request, res: Response) => {
  const { email, senha } = req.body;
  console.log('Login efetuado:', { email });
  res.redirect('/');
});

app.post('/register', (req: Request, res: Response) => {
  const { nome, email, senha } = req.body;
  console.log('Novo usuário cadastrado:', { nome, email });
  res.redirect('/');
});

// --- ROTAS DA API ---
app.get('/api/livros', (req: Request, res: Response) => {
  const busca = (req.query.busca as string || '').toLowerCase();
  const resultado = livros.filter(l => l.titulo.toLowerCase().includes(busca));
  res.json(resultado);
});

app.patch('/api/livros/:id/toggle-status', (req: Request, res: Response) => {
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