// src/entities/Usuario.ts
import bcrypt from "bcrypt";

export type PapelUsuario = "bibliotecario" | "aluno";

export class Usuario {
    private _id: string;
    private _nome!: string;
    private _email!: string;
    private _senhaHash!: string;
    private _matricula: string | null;

    constructor(id: string, nome: string, email: string, senhaHash: string, matricula: string | null = null) {
        this._id = id;
        this.nome = nome;
        this.email = email;
        this.senhaHash = senhaHash;
        this._matricula = matricula;
    }

    public get id(): string { return this._id; }

    public get nome(): string { return this._nome; }
    public set nome(valor: string) {
        if (!valor || valor.trim().length < 3) throw new Error("Nome Inválido");
        this._nome = valor.trim();
    }

    public get email(): string { return this._email; }
    public set email(valor: string) {
        if (!valor || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim())) throw new Error("E-mail Inválido");
        this._email = valor.trim().toLowerCase();
    }

    public get senhaHash(): string { return this._senhaHash; }
    public set senhaHash(valor: string) {
        if (!valor || valor.trim().length === 0) throw new Error("Hash da senha indisponível");
        this._senhaHash = valor;
    }

    public get matricula(): string | null { return this._matricula; }

    // Papel NÃO é armazenado diretamente — é calculado a partir da matrícula.
    // Se a conta está vinculada a uma matrícula (de um Aluno já cadastrado),
    // é uma conta de aluno (só visualiza). Sem matrícula, é bibliotecário.
    public get papel(): PapelUsuario {
        return this._matricula ? "aluno" : "bibliotecario";
    }

    public async validarSenha(senhaDigitada: string): Promise<boolean> {
        return await bcrypt.compare(senhaDigitada, this._senhaHash);
    }

    public toJSON() {
        return {
            id: this._id,
            nome: this._nome,
            email: this._email,
            papel: this.papel,
            matricula: this._matricula,
        };
    }

    public paraArmazenamento() {
        return {
            id: this._id,
            nome: this._nome,
            email: this._email,
            senhaHash: this._senhaHash,
            matricula: this._matricula,
        };
    }

    public validar(): boolean {
        if (!this._nome || this._nome.trim().length < 3) return false;
        if (!this._email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this._email)) return false;
        if (!this._senhaHash) return false;
        return true;
    }

    public static fromJSON(dados: any): Usuario {
        if (!dados.id || !dados.email || !dados.senhaHash || !dados.nome) {
            throw new Error("Campos Indisponíveis");
        }

        const matricula = typeof dados.matricula === "string" ? dados.matricula : null;
        return new Usuario(dados.id, dados.nome, dados.email, dados.senhaHash, matricula);
    }

    public static async criar(
        id: string,
        nome: string,
        email: string,
        senhaPlana: string,
        matricula: string | null = null
    ): Promise<Usuario> {
        if (!senhaPlana) throw new Error("Senha inválida.");
        const senhaHash = await bcrypt.hash(senhaPlana, 10);
        return new Usuario(id, nome, email, senhaHash, matricula);
    }
}