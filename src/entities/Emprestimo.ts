// Imports

import bcrypt from "bcrypt";

// Entidade Empréstimo

export class Emprestimo {
    private _id: string;
    private _alunoId: string;
    private _livroId: string;
    private _dataEmprestimo: Date;
    private _dataDevolucaoPrevista: Date;
    private _dataDevolucaoReal: Date | null;

// Constructor

  constructor(
    id: string,
    alundoId: string,
    livroId: string,
    dataEmprestimo: Date,
    dataDevolucaoPrevista: Date,
    dataDevolucaoReal: Date | null
  ) {
    this._id = id;
    this._alunoId = alundoId;
    this._dataEmprestimo = dataEmprestimo;
    this._dataEmprestimo = dataEmprestimo;
    this._dataDevolucaoPrevista = dataDevolucaoPrevista;
    this._dataDevolucaoReal = dataDevolucaoReal;
  }

// Getters e Setters VALIDADOS

    public get id(): string {
        return this._id;
    }
    
    public get alunoId(): string {
        return this._alunoId;
    }
    
    public set alunoId(valor: string) {
        if (!valor || valor.trim().length === 0) {
        throw new Error("ID do aluno inválido");
        }
        this._alunoId = valor.trim();
    }
    
    public get livroId(): string {
        return this._livroId;
    }
    
    public set livroId(valor: string) {
        if (!valor || valor.trim().length === 0) {
        throw new Error("ID do livro inválido");
        }
        this._livroId = valor.trim();
    }
    
    public get dataEmprestimo(): Date {
        return this._dataEmprestimo;
    }
    
    public set dataEmprestimo(valor: Date) {
        if (!(valor instanceof Date)) {
        throw new Error("Data de empréstimo inválida");
        }
        this._dataEmprestimo = valor;
    }
    
    public get dataDevolucaoPrevista(): Date {
        return this._dataDevolucaoPrevista;
    }
    
    public set dataDevolucaoPrevista(valor: Date) {
        if (!(valor instanceof Date)) {
        throw new Error("Data de devolução prevista inválida");
        }
        this._dataDevolucaoPrevista = valor;
    }
    
    public get dataDevolucaoReal(): Date | null {
        return this._dataDevolucaoReal;
    }
    
    public set dataDevolucaoReal(valor: Date | null) {
        if (valor !== null && !(valor instanceof Date)) {
        throw new Error("Data de devolução real inválida");
        }
        this._dataDevolucaoReal = valor;
    }

// Métodos

    public validar(): boolean {
        if (!this._alunoId || this._alunoId.trim().length === 0) {
            return false;
        }
        if (!this._livroId || this._livroId.trim().length === 0) {
            return false;
        }
        if (!(this._dataEmprestimo instanceof Date)) {
            return false;
        }
        if (!(this._dataDevolucaoPrevista instanceof Date)) {
            return false;
        }
        
        return true;
    }

    public finalizarDevolucao(dataDevolucaoReal: Date): void {
        if (this._dataDevolucaoReal !== null) {
            throw new Error("Este empréstimo já foi finalizado");
        }
        this._dataDevolucaoReal = new Date();
    }

    public estaAtrasado(): boolean {
        if (this._dataDevolucaoReal) {
            return this._dataDevolucaoReal > this._dataDevolucaoPrevista;
        }
        return new Date > this.dataDevolucaoPrevista;
    }

    public toJSON() {
        id: this._id,
        alunoId: this._alunoId,
        livroId: this._livroId,
        dataEmprestimo: this._dataEmprestimo.toISOString(),
        dataDevolucaoPrevista: this._dataDevolucaoPrevista.toISOString(),
        dataDevolucaoReal: this._dataDevolucaoReal ? this._dataDevolucaoReal.toISOString() : null,
        atrasado: this.estaAtrasado(),

    }

}

