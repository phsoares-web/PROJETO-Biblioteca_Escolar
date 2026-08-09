import fs from "fs";
import path from "path";
import { Aluno } from "../entities/Aluno";

type AlunoAtualizavel = Partial<Pick<Aluno, "nome" | "matricula">>;

export class AlunoRepository {

    private caminho = path.resolve("dados", "alunos.json");

    constructor() {
        const pasta = path.dirname(this.caminho);
        if (!fs.existsSync(pasta)) {
            fs.mkdirSync(pasta, { recursive: true });
        }
        if (!fs.existsSync(this.caminho)) {
            fs.writeFileSync(this.caminho, "[]");
        }
    }

    private lerArquivo(): Aluno[] {
        const dados = fs.readFileSync(this.caminho, "utf-8");
        return JSON.parse(dados).map((aluno: any) => Aluno.fromJSON(aluno));
    }

    private salvarArquivo(alunos: Aluno[]): void {
        fs.writeFileSync(
            this.caminho,
            JSON.stringify(alunos.map(aluno => aluno.toJSON()), null, 2)
        );
    }

    listar(): Aluno[] {
        return this.lerArquivo();
    }

    buscarPorId(id: string): Aluno | undefined {
        return this.lerArquivo().find(aluno => aluno.id === id);
    }

    buscarPorMatricula(matricula: string): Aluno | undefined {
        return this.lerArquivo().find(aluno => aluno.matricula === matricula);
    }

    criar(aluno: Aluno): void {
        if (!aluno.validar()) {
            throw new Error("Aluno inválido!");
        }

        const alunos = this.lerArquivo();

        if (alunos.some(a => a.id === aluno.id)) {
            throw new Error("Já existe um aluno com este ID.");
        }
        if (alunos.some(a => a.matricula === aluno.matricula)) {
            throw new Error("Já existe um aluno com esta matrícula.");
        }

        alunos.push(aluno);
        this.salvarArquivo(alunos);
    }

    atualizar(id: string, dados: AlunoAtualizavel): boolean {
        const alunos = this.lerArquivo();
        const aluno = alunos.find(a => a.id === id);

        if (!aluno) {
            return false;
        }

        if (dados.matricula !== undefined) {
            const matriculaEmUso = alunos.some(a => a.id !== id && a.matricula === dados.matricula);
            if (matriculaEmUso) {
                throw new Error("Matrícula já pertence a outro aluno.");
            }
        }

        if (dados.nome !== undefined) aluno.nome = dados.nome;
        if (dados.matricula !== undefined) aluno.matricula = dados.matricula;

        this.salvarArquivo(alunos);
        return true;
    }

    remover(id: string): boolean {
        const alunos = this.lerArquivo();
        const indice = alunos.findIndex(aluno => aluno.id === id);

        if (indice === -1) return false;

        alunos.splice(indice, 1);
        this.salvarArquivo(alunos);
        return true;
    }

    buscarPorNome(nome: string): Aluno[] {
        return this.lerArquivo().filter(aluno =>
            aluno.nome.toLowerCase().includes(nome.toLowerCase())
        );
    }
}