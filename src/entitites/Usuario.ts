// Imports

import bcrypt from "bcrypt";

// Entidade Usuário

export class Usuario {

// Atributos

    private _id: string;
    private _nome!: string;
    private _email!: string;
    private _senhaHash!: string;

// Constructor

    constructor(id: string, nome: string, email: string, senhaHash: string) {
        this._id = id;
        this.nome = nome;
        this.email = email;
        this.senhaHash = senhaHash;
    }

// Getters e Setters VALIDADOS, junto de um método VALIDAR

    public get id(): string {
        return this._id;
    }

    public get nome(): string {
        return this._nome;
    }

    public set nome(valor: string) {
        if (!valor || valor.trim().length < 3) {
            throw new Error("Nome Inválido")
        }
        this._nome = valor.trim();
    }

    public get email(): string {
        return this._email;
    }

    public set email(valor: string) {
        if (!valor || !valor.includes("@") || valor.trim().length < 5 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim())) {
            throw new Error("E-mail Inválido")
        }
        this._email = valor.trim().toLowerCase();
    }

    public get senhaHash(): string {
        return this._senhaHash;
    }

    public set senhaHash(valor: string) {
        if(!valor || valor.trim().length === 0) {
            throw new Error("Hash da senha indisponível")
        }
        this._senhaHash = valor;
    }

    public async validarSenha(senhaDigitada: string): Promise<boolean> {
        return await bcrypt.compare(senhaDigitada, this._senhaHash);
    }

    public toJSON() {
        return {
            id: this._id,
            nome: this._nome,
            email: this._email,
        };
    }

    public validar(): boolean {
        if (!this._nome || this._nome.trim().length < 3)
        return false;
        if (!this._email || !this._email.includes("@") || this._email.trim().length < 5) 
        return false;
        if (!this._senhaHash)
        return false;
        
        return true;
    }

    public static fromJSON(dados: any): Usuario {
        if(!dados.id || !dados.email || !dados.senhaHash || !dados.nome) {
            throw new Error("Campos Indisponíveis")
        }
    
        return new Usuario (
            dados.id,
            dados.nome,
            dados.email,
            dados.senhaHash,
        );
    }

    public static async criar (id: string, nome: string, email: string, senhaPlana: string): Promise<Usuario> {
        
        if(!senhaPlana) {
            throw new Error("Senha inválida.")
        }

        const SALT_ROUNDS = 10;
        const senhaHash = await bcrypt.hash(senhaPlana, SALT_ROUNDS);
        return new Usuario (
            id,
            nome, 
            email, 
            senhaHash,
        );
    }
}