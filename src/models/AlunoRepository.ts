import fs from "fs";
import path from "path";
import { Aluno } from "../entities/Aluno";

export class AlunoRepository {

    // Caminho absoluto do arquivo JSON onde os dados dos alunos ficam salvos
    private caminho = path.resolve("dados", "alunos.json");

    constructor() {

        // Pega só a pasta do caminho (sem o nome do arquivo), ex.: "dados"
        const pasta = path.dirname(this.caminho);

        // Garante que a pasta exista antes de tentar salvar qualquer arquivo nela
        if (!fs.existsSync(pasta)) {
            fs.mkdirSync(pasta, { recursive: true });
        }

        // Garante que o arquivo alunos.json exista, começando vazio ([])
        if (!fs.existsSync(this.caminho)) {
            fs.writeFileSync(this.caminho, "[]");
        }

    }

    // Lê o arquivo do disco e converte cada item do JSON em uma instância real de Aluno
    private lerArquivo(): Aluno[] {

        const dados = fs.readFileSync(this.caminho, "utf-8");

        return JSON.parse(dados).map((aluno: any) =>
            Aluno.fromJSON(aluno)
        );

    }

    // Recebe a lista de Alunos, transforma cada um em objeto simples (JSON) e regrava o arquivo inteiro
    private salvarArquivo(alunos: Aluno[]): void {

        fs.writeFileSync(
            this.caminho,
            JSON.stringify(
                alunos.map(aluno => aluno.toJSON()),
                null,
                2 // indenta com 2 espaços para o arquivo ficar legível
            )
        );

    }

    // Retorna todos os alunos salvos no arquivo
    listar(): Aluno[] {
        return this.lerArquivo();
    }

    // Procura um aluno pelo id; retorna undefined se nenhum aluno tiver esse id
    buscarPorId(id: string): Aluno | undefined {

        return this.lerArquivo().find(
            aluno => aluno.id === id
        );

    }

    // Adiciona um aluno novo à lista existente e persiste a alteração no arquivo
    criar(aluno: Aluno): void {

        const alunos = this.lerArquivo();

        alunos.push(aluno);

        this.salvarArquivo(alunos);

    }

    // Atualiza campos de um aluno já existente, identificado pelo id
    // "dados" é parcial: só é necessário passar os campos que devem mudar
    atualizar(id: string, dados: Partial<Aluno>): boolean {

        const alunos = this.lerArquivo();

        // Localiza a posição do aluno dentro do array
        const indice = alunos.findIndex(
            aluno => aluno.id === id
        );

        // Nenhum aluno com esse id foi encontrado
        if (indice === -1) {
            return false;
        }

        const aluno = alunos[indice];

        // Checagem extra exigida pelo TypeScript: garante que a posição realmente existe no array
        if (!aluno) {
            return false;
        }

        // Só sobrescreve o campo se ele foi realmente enviado em "dados"
        if (dados.nome !== undefined) {
            aluno.nome = dados.nome;
        }

        if (dados.matricula !== undefined) {
            aluno.matricula = dados.matricula;
        }

        this.salvarArquivo(alunos);

        return true;

    }

    // Remove um aluno da lista, identificado pelo id
    remover(id: string): boolean {

        const alunos = this.lerArquivo();

        const indice = alunos.findIndex(
            aluno => aluno.id === id
        );

        // Nenhum aluno com esse id foi encontrado
        if (indice === -1) {
            return false;
        }

        // Remove 1 elemento a partir da posição encontrada
        alunos.splice(indice, 1);

        this.salvarArquivo(alunos);

        return true;

    }

    // Filtra alunos cujo nome contenha o texto buscado (ignora maiúsculas/minúsculas)
    buscarPorNome(nome: string): Aluno[] {

        return this.lerArquivo().filter(
            aluno =>
                aluno.nome
                    .toLowerCase()
                    .includes(nome.toLowerCase())
        );

    }

}