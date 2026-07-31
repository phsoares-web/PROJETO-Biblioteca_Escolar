import express, { Request, Response } from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração de Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servidor de arquivos estáticos (CSS, imagens, JS da pasta public)
app.use(express.static(path.resolve(__dirname, '..', 'public')));

// Configura o EJS como view engine
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));

// Modelo de Dados para Teste
interface Livro {
  id: number;
  titulo: string;
  status: 'disponivel' | 'emprestado';
}

let livros: Livro[] = [
  { id: 1, titulo: 'Dom Casmurro', status: 'disponivel' },
  { id: 2, titulo: 'O Cortiço', status: 'emprestado' },
  { id: 3, titulo: 'Memórias Póstumas de Brás Cubas', status: 'disponivel' },
  { id: 4, titulo: 'Grande Sertão: Veredas', status: 'disponivel' }
];

// --- ROTAS DE PÁGINAS ---

// Rota Principal (Página Inicial / Catálogo)
app.get('/', (req: Request, res: Response) => {
  res.render('pagina-inicial', {
    titulo: 'Biblioteca Aluísio Azevedo',
    itens: livros
  });
});

app.get('/login', (req: Request, res: Response) => {
  res.render('login', { titulo: 'Biblioteca Aluísio Azevedo' });
});

// --- ROTAS DA API ---

// Busca de livros via query string
app.get('/api/livros', (req: Request, res: Response) => {
  const busca = (req.query.busca as string || '').toLowerCase();
  const resultado = livros.filter(l => l.titulo.toLowerCase().includes(busca));
  res.json(resultado);
});

// Alternar status (Empréstimo / Devolução)
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

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});