import fs from "fs";
import path from "path";
import { Livro } from "../entities/Livro";

export class LivroRepository {

    private caminho = path.resolve("dados", "livros.json");

    constructor() {

        const pasta = path.dirname(this.caminho);

        if (!fs.existsSync(pasta)) {
            fs.mkdirSync(pasta, { recursive: true });
        }

        if (!fs.existsSync(this.caminho)) {
            fs.writeFileSync(this.caminho, "[]");
        }

    }

    private lerArquivo(): Livro[] {

        const dados = fs.readFileSync(this.caminho, "utf-8");

        return JSON.parse(dados).map((livro: any) => Livro.fromJSON(livro));

    }

    private salvarArquivo(livros: Livro[]): void {

        fs.writeFileSync(
            this.caminho,
            JSON.stringify(
                livros.map(livro => livro.toJSON()),
                null,
                2
            )
        );

    }

    listar(): Livro[] {
        return this.lerArquivo();
    }

    buscarPorId(id: string): Livro | undefined {

        return this.lerArquivo().find(
            livro => livro.id === id
        );

    }

    criar(livro: Livro): void {

        const livros = this.lerArquivo();

        livros.push(livro);

        this.salvarArquivo(livros);

    }

    atualizar(id: string, dados: Partial<Livro>): boolean {

        const livros = this.lerArquivo();

        const indice = livros.findIndex(
            livro => livro.id === id
        );

        if (indice === -1) {
            return false;
        }

        const livro = livros[indice];

        if (dados.titulo !== undefined) {
            livro.titulo = dados.titulo;
        }

        if (dados.autor !== undefined) {
            livro.autor = dados.autor;
        }

        if (dados.disponivel !== undefined) {
            livro.disponivel = dados.disponivel;
        }

        if (dados.capaUrl !== undefined) {
            livro.capaUrl = dados.capaUrl;
        }

        this.salvarArquivo(livros);

        return true;
    }

    remover(id: string): boolean {

        const livros = this.lerArquivo();

        const indice = livros.findIndex(
            livro => livro.id === id
        );

        if (indice === -1) {
            return false;
        }

        livros.splice(indice, 1);

        this.salvarArquivo(livros);

        return true;
    }

    buscarPorTitulo(titulo: string): Livro[] {

        return this.lerArquivo().filter(
            livro =>
                livro.titulo
                    .toLowerCase()
                    .includes(titulo.toLowerCase())
        );

    }

}