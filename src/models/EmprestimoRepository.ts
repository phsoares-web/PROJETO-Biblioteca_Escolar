import fs from "fs";
import path from "path";
import { Emprestimo } from "../entities/Emprestimo";
import { LivroRepository } from "./LivroRepository";
import { AlunoRepository } from "./AlunoRepository";

export class EmprestimoRepository {

    private caminho = path.resolve("dados", "emprestimos.json");
    private livroRepository = new LivroRepository();
    private alunoRepository = new AlunoRepository();

    constructor() {
        const pasta = path.dirname(this.caminho);

        if (!fs.existsSync(pasta)) {
            fs.mkdirSync(pasta, { recursive: true });
        }

        if (!fs.existsSync(this.caminho)) {
            fs.writeFileSync(this.caminho, "[]");
        }
    }

    private lerArquivo(): Emprestimo[] {
        const dados = fs.readFileSync(this.caminho, "utf-8");
        return JSON.parse(dados).map((emprestimo: any) => Emprestimo.fromJSON(emprestimo));
    }

    private salvarArquivo(emprestimos: Emprestimo[]): void {
        fs.writeFileSync(
            this.caminho,
            JSON.stringify(
                emprestimos.map(emprestimo => emprestimo.toJSON()),
                null,
                2
            )
        );
    }

    listar(): Emprestimo[] {
        return this.lerArquivo();
    }

    buscarPorId(id: string): Emprestimo | undefined {
        return this.lerArquivo().find(
            emprestimo => emprestimo.id === id
        );
    }

    listarPorAluno(alunoId: string): Emprestimo[] {
        return this.lerArquivo().filter(
            emprestimo => emprestimo.alunoId === alunoId
        );
    }

    listarAtrasados(): Emprestimo[] {
        return this.lerArquivo().filter(
            emprestimo => emprestimo.estaAtrasado()
        );
    }

    registrarEmprestimo(emprestimo: Emprestimo): void {
        if (!emprestimo.validar()) {
            throw new Error("Empréstimo inválido!");
        }

        const aluno = this.alunoRepository.buscarPorId(emprestimo.alunoId);
        if (!aluno) {
            throw new Error("Aluno não encontrado.");
        }

        const livro = this.livroRepository.buscarPorId(emprestimo.livroId);
        if (!livro) {
            throw new Error("Livro não encontrado.");
        }

        if (!livro.disponivel) {
            throw new Error("Livro indisponível para empréstimo.");
        }

        const emprestimos = this.lerArquivo();

        if (emprestimos.some(e => e.id === emprestimo.id)) {
            throw new Error("Já existe um empréstimo com este ID.");
        }

        emprestimos.push(emprestimo);
        this.salvarArquivo(emprestimos);

        this.livroRepository.atualizar(livro.id, { disponivel: false });
    }

    registrarDevolucao(id: string): boolean {
        const emprestimos = this.lerArquivo();
        const emprestimo = emprestimos.find(e => e.id === id);

        if (!emprestimo) {
            return false;
        }

        emprestimo.finalizarDevolucao();
        this.salvarArquivo(emprestimos);

        this.livroRepository.atualizar(emprestimo.livroId, { disponivel: true });
        return true;
    }

    remover(id: string): boolean {
        const emprestimos = this.lerArquivo();
        const indice = emprestimos.findIndex(emprestimo => emprestimo.id === id);

        if (indice === -1) {
            return false;
        }

        emprestimos.splice(indice, 1);
        this.salvarArquivo(emprestimos);
        return true;
    }
}