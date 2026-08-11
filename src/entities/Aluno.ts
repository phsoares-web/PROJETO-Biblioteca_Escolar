// Entidade Aluno

export class Aluno {

    private _id: string;
    private _nome!: string;
    private _matricula!: string;

    constructor(
        id: string,
        nome: string,
        matricula: string,
    ) {
        this._id = id;
        this.nome = nome;
        this.matricula = matricula;
    }

// Getters e Setters VALIDADOS

    public get id(): string {
        return this._id;
    }

    public get nome(): string {
        return this._nome;
    }

    public set nome(valor: string) {
        if (!valor || valor.trim().length < 3) {
            throw new Error("Nome inválido!")
        }
        this._nome = valor.trim()
    }

    public get matricula(): string {
        return this._matricula;
    }

    public set matricula(valor: string) {
        if (!valor || !/^\d{4,}$/.test(valor.trim())) {
            throw new Error("Matrícula inválida!")
        }
        this._matricula = valor.trim()
    }

// Métodos

    public validar(): boolean {
        if (!this._nome || this._nome.trim().length < 3) {
            return false;
        }
        if (!this._matricula || !/^\d{4,}$/.test(this._matricula)) {
            return false;
        }
        return true;
    }

    public toJSON() {
        return {
            id: this._id,
            nome: this._nome,
            matricula: this._matricula
        }
    }

    public static fromJSON(dados: any): Aluno {
        if (!dados || !dados.id || !dados.nome || !dados.matricula) {
            throw new Error("Dados inválidos!");
        }

        return new Aluno(
            dados.id,
            dados.nome, 
            dados.matricula
        );
    }

}