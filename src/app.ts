import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configura o EJS e a pasta de views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares para ler dados de requisições
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, '../public')));

// Rota principal
app.get('/', (req: Request, res: Response): void => {
    res.render('pagina-inicial', {
        titulo: 'Biblioteca Escolar',
        mensagem: 'Sistema rodando com sucesso!',
        itens: ['Livro 1', 'Livro 2', 'Livro 3']
    });
});

export default app;