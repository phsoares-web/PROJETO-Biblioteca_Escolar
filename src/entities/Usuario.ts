// Imports

import bcrypt from "bcrypt";  // Importa o comando de mesmo nome 

export type PapelUsuario = "bibliotecario" | "aluno";

export class Usuario { // Serve para exporta o usuario
  
// Atributos
  
    private _id: string; // Declaração das variaveis 
    private _nome!: string;
    private _email!: string;
    private _senhaHash!: string;
    private _matricula: string | null;
    private _papel: PapelUsuario; 

// Constructor
      
    constructor(
        id: string, 
        nome: string, 
        email: string, 
        senhaHash: string, 
        matricula: string | null = null,
        papel: PapelUsuario = "aluno" // Por padrão é sempre "aluno"
    ) {
        this._id = id;
        this.nome = nome;
        this.email = email;
        this.senhaHash = senhaHash;
        this._matricula = matricula;
        this._papel = papel;
    }

// Getters e Setters VALIDADOS + método VALIDAR

    public get id(): string {
        return this._id;
    }

    public get nome(): string {
        return this._nome;
    }

    public set nome(valor: string) {
        if (!valor || valor.trim().length < 3) {       // Nome inválido caso o requisito de lógica for cumprida 
            throw new Error("Nome Inválido");
        }
        this._nome = valor.trim();
    }

    public get email(): string {
        return this._email;   // Retorna um valor 
    }

    public set email(valor: string) {
        if (!valor || !valor.includes("@") || valor.trim().length < 5 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim())) {
            throw new Error("E-mail Inválido");
        }                                         // Email inválido caso a lógica for feita e cumprida 
        this._email = valor.trim().toLowerCase();
    }

    public get senhaHash(): string {
        return this._senhaHash;        // Retorna esse resultado 
    }

    public set senhaHash(valor: string) {
        if (!valor || valor.trim().length === 0) {
            throw new Error("Hash da senha indisponível");    // O harsh da senha estará indisponível caso a logica estive certa 
        }
        this._senhaHash = valor;
    }

    public get matricula(): string | null { return this._matricula; }

    // Retorna o papel real armazenado
    public get papel(): PapelUsuario {
        return this._papel;
    }

    public async validarSenha(senhaDigitada: string): Promise<boolean> {
        return await bcrypt.compare(senhaDigitada, this._senhaHash);       // Validar e  compara a senhar 
    }

    public toJSON() {
        return {
            id: this._id,
            nome: this._nome, 
            email: this._email,
            papel: this._papel,
            matricula: this._matricula,
        };     // Retorna os valores 
    }

    public paraArmazenamento() {
        return {
            id: this._id,
            nome: this._nome,
            email: this._email,
            senhaHash: this._senhaHash,
            matricula: this._matricula,
            papel: this._papel, // Salva o papel no JSON
        };
    }

    public validar(): boolean {
        if (!this._nome || this._nome.trim().length < 3) return false;
        if (!this._email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this._email)) return false;
        if (!this._senhaHash) return false;        // Retorna falso se a logica for cumprida mas retorna verdadeiro caso ela estive errada 
        return true;
    }

    public static fromJSON(dados: any): Usuario {
        if (!dados.id || !dados.email || !dados.senhaHash || !dados.nome) {
            throw new Error("Campos Indisponíveis");
        }      //Os campos estarao indsponíveis caso a logica seja cumprida
        const matricula = typeof dados.matricula === "string" ? dados.matricula : null;
        // Se o JSON tiver 'bibliotecario', define como bibliotecario. Senão, assume 'aluno'.
        const papel: PapelUsuario = dados.papel === "bibliotecario" ? "bibliotecario" : "aluno";
    
        return new Usuario(
            dados.id,
            dados.nome,       
            dados.email,
            dados.senhaHash,
            matricula,
            papel
        );    // Retorna novos valores 
    }

    public static async criar(
        id: string,
        nome: string,
        email: string,
        senhaPlana: string,
        matricula: string | null = null,
        papel: PapelUsuario = "aluno"
    ): Promise<Usuario> {
        if (!senhaPlana) throw new Error("Senha inválida."); // Se a senhar for plana ela será inválida
        const SALT_ROUNDS = 10;
        const senhaHash = await bcrypt.hash(senhaPlana, SALT_ROUNDS); // Colocar variaveis como não mutáveis 
        return new Usuario(id, nome, email, senhaHash, matricula, papel); // Cria novas variaveis 
    }
}