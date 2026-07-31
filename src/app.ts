import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configura o EJS como view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servidor de arquivos estáticos (CSS, imagens, etc.)
app.use(express.static(path.join(__dirname, '../public')));

// Rota Principal (Página Inicial / Catálogo)
app.get('/', (req, res) => {
  res.render('pagina-inicial', {
    titulo: 'Biblioteca Aluísio Azevedo',
    mensagem: 'Sistema rodando com sucesso!',
    itens: ['Livro 1', 'Livro 2', 'Livro 3']
  });
});

// Rota de Login / Cadastro
app.get('/login', (req, res) => {
  res.render('login', {
    titulo: 'Biblioteca Aluísio Azevedo'
  });
});

export default app;