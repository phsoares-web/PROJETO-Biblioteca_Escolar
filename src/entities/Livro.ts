// Entidade Livro

export class Livro {

// Atributos

    private _id: string;
    private _titulo!: string;
    private _autor!: string;
    private _disponivel!: boolean;
    
// Constructor

    constructor(id: string, titulo: string, autor: string, disponivel: boolean) {
        
        this._id = id;
        this.titulo = titulo;
        this.autor = autor;
        this._disponivel = disponivel;

    }

// Getters e Setters VALIDADOS

    public get id(): string {
        return this._id;
    }

    public get titulo(): string {
        return this._titulo;
    }

    public set titulo(valor: string) {
        if (!valor || valor.trim().length === 0) {
            throw new Error("Título inválido!")
        }
        this._titulo = valor.trim()
    }

    public get autor(): string {
        return this._autor;
    }

    public set autor(valor: string) {
        if (!valor || valor.trim().length === 0) {
            throw new Error("Autor inválido!")
        }
        this._autor = valor.trim()
    }

    public get disponivel(): boolean {
        return this._disponivel;
    }

    public set disponivel(valor: boolean) {
        this._disponivel = valor;
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
    
        return true;
    }

    public toJSON() {
        return {
            id: this._id,
            titulo: this._titulo,
            autor: this._autor,
            disponivel: this._disponivel
        };
    }

    public static fromJSON(dados: any): Livro {
        if (!dados || !dados.id || !dados.titulo || !dados.autor) {
            throw new Error("Dados inválidos para criar um livro");
        }

        const statusDisponivel = dados.disponivel !== undefined ? Boolean(dados.disponivel) : true;


        return new Livro(
            dados.id,
            dados.titulo,
            dados.autor,
            statusDisponivel
        );
    }
}