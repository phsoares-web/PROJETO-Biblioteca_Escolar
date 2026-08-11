// Entidade Livro

export class Livro {

// Atributos

    private _id: string;    // declaração das variaveis 
    private _titulo!: string;
    private _autor!: string;
    private _disponivel!: boolean;
    private _capaUrl: string | null;

// Constructor

    constructor(id: string, titulo: string, autor: string, disponivel: boolean, capaUrl: string | null) {
        
        this._id = id;         // Dar nomes as variavies 
        this.titulo = titulo;
        this.autor = autor;
        this._disponivel = disponivel;
        this._capaUrl = capaUrl;

    }

// Getters e Setters VALIDADOS

    public get id(): string {
        return this._id;             // Retorna valores perdidos 
    }

    public get titulo(): string {
        return this._titulo;
    }

    public set titulo(valor: string) {               // Serve para dizer se o titulo e inválido ou não 
        if (!valor || valor.trim().length === 0) {
            throw new Error("Título inválido!")
        }
        this._titulo = valor.trim()
    }

    public get autor(): string {
        return this._autor;         // Retorne um valor 
    }

    public set autor(valor: string) {
        if (!valor || valor.trim().length === 0) {
            throw new Error("Autor inválido!")    // Serve para dizer ser o autor e válido ou inválido 
        }
        this._autor = valor.trim()
    }

    public get disponivel(): boolean {  // Retorna o valor que o código perde 
        return this._disponivel;
    }

    public set disponivel(valor: boolean) {
        this._disponivel = valor;  // Declara uma variavel 
    } 

    public get capaUrl(): string | null {
        return this._capaUrl; // Retorna esse valor em especifico 
    }

    public set capaUrl(valor: string | null) {
        if (valor !== null && valor.trim().length === 0) {
            throw new Error("URL da capa inválida!")  // Serve para dizer que a url da capa e valido ou invalida 
        }
        this._capaUrl = valor ? valor.trim() : null;
    }

// Métodos

    public validar(): boolean {
        if (!this._id) {
            return false;                   
        }
        if (!this.titulo) {
            return false;
        }
        if (!this._autor) {
            return false;
        }
        if (this._disponivel === undefined || this._disponivel === null) {
            return false;
        }
        if (this._capaUrl !== null && this._capaUrl.trim().length === 0) {
            return false;
        }
        return true;        // Retorna todos esses valores caso a condição seja cumprida e retorna como falso 
    }

    public toJSON() {
        return {
            id: this._id,
            titulo: this._titulo,    // Retorna valores perdidos 
            autor: this._autor,
            disponivel: this._disponivel,
            capaUrl: this._capaUrl,
        };
    }

    public static fromJSON(dados: any): Livro {
        if (!dados || !dados.id || !dados.titulo || !dados.autor) {
            throw new Error("Dados inválidos para criar um livro");     // Diz que os dados para cria um livro são inválidos caso a logica for feita 
        }

        const statusDisponivel = dados.disponivel !== undefined ? Boolean(dados.disponivel) : true; // valor de segunrança para uma variavel 

        return new Livro(
            dados.id,
            dados.titulo,
            dados.autor,
            statusDisponivel !== undefined ? statusDisponivel : true,
            dados.capaUrl,
        );   // Retorna novos objetos e variavies 
    } 
}      