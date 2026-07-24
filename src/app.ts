import express, { Request, Response } from 'express';
import * as path from 'path';

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req: Request, res: Response) => {
  res.render('pagina-inicial', {
    titulo: 'Biblioteca Escolar',
    mensagem: 'Sistema rodando com sucesso!',
    itens: ['Livro 1', 'Livro 2', 'Livro 3']
  });
});

export default app;