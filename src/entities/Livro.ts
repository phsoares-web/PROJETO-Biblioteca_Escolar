// Imports

import bcrypt from "bcrypt";

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
        this._titulo = titulo;
        this._autor = autor;
        this._disponivel = disponivel;

    }

// Getters e Setters VALIDADOS + método VALIDAR

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

//

}