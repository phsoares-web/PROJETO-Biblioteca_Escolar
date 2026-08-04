// Entidade Empréstimo

export class Emprestimo {
    private _id: string;  // Declaração das varaveis 
    private _alunoId: string;
    private _livroId: string;
    private _dataEmprestimo: Date;
    private _dataDevolucaoPrevista: Date;
    private _dataDevolucaoReal: Date | null;

// Constructor

  constructor(
    id: string,   // retorna ou declara variaveis 
    alunoId: string,
    livroId: string,
    dataEmprestimo: Date,
    dataDevolucaoPrevista: Date,
    dataDevolucaoReal: Date | null
  ) {
    this._id = id;
    this._alunoId = alunoId;
    this._livroId = livroId;
    this._dataEmprestimo = dataEmprestimo;
    this._dataDevolucaoPrevista = dataDevolucaoPrevista;
    this._dataDevolucaoReal = dataDevolucaoReal;
  }

// Getters e Setters VALIDADOS

    public get id(): string {
        return this._id;      // Função com o objetivo de retorna os valores anteriores 
    }
    
    public get alunoId(): string {
        return this._alunoId;
    }
    
    public set alunoId(valor: string) {
        if (!valor || valor.trim().length === 0) { // Serve para indicar que o id do aluno e inválido caso cumpra os requisitos impostos pela lógica 
        throw new Error("ID do aluno inválido");
        }
        this._alunoId = valor.trim(); // Exibir uma mensagem 
    }
    
    public get livroId(): string {
        return this._livroId;
    }
    
    public set livroId(valor: string) {
        if (!valor || valor.trim().length === 0) {
        throw new Error("ID do livro inválido"); // Dizer que o id do livro e inválido quando atendido os requisitos do código 
        }
        this._livroId = valor.trim();
    }
    
    public get dataEmprestimo(): Date {
        return this._dataEmprestimo;
    }
    
    public set dataEmprestimo(valor: Date) {
        if (!(valor instanceof Date)) {
        throw new Error("Data de empréstimo inválida"); // Confere se o empréstimo e valido ou não 
        }
        this._dataEmprestimo = valor;
    }
    
    public get dataDevolucaoPrevista(): Date {
        return this._dataDevolucaoPrevista; // pega a variavel de volta 
    }
    
    public set dataDevolucaoPrevista(valor: Date) {
        if (!(valor instanceof Date)) {
        throw new Error("Data de devolução prevista inválida"); // Condição de lógica que verifica se a devolução vai ser inválida caso tal requisito seja cumprido 
        }
        this._dataDevolucaoPrevista = valor; // retorna um valor 
    }
    
    public get dataDevolucaoReal(): Date | null {
        return this._dataDevolucaoReal;
    }
    
    public set dataDevolucaoReal(valor: Date | null) {
        if (valor !== null && !(valor instanceof Date)) {  // diz que a data de devolução real vai está invalida caso a logica do programa seja cumprida 
        throw new Error("Data de devolução real inválida");
        }
        this._dataDevolucaoReal = valor; // retorna esse valor em especifico 
    }

// Métodos

    public validar(): boolean {
        if (!this._alunoId || this._alunoId.trim().length === 0) {   // Função que retorna falso caso a condição imposta por ela foi cumrpida 
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
        if (this._dataDevolucaoPrevista <= this._dataEmprestimo) {
            return false;
        }
        return true;
    }

    public finalizarDevolucao(): void {
        if (this._dataDevolucaoReal !== null) {
            throw new Error("Este empréstimo já foi finalizado"); // Dado logico que diz que o emprestimo foi feito atedendo tal requisito do código 
        }
        this._dataDevolucaoReal = new Date();
    }

    public estaAtrasado(): boolean {
        if (this._dataDevolucaoReal) {
            return this._dataDevolucaoReal > this._dataDevolucaoPrevista; // Retorna um valor se a logica imposta pelo programa foi cumprida 
        }
        return new Date() > this.dataDevolucaoPrevista;
    }

    public toJSON() {
        return {
            id: this._id,   // Retorna todos os valores anteriores 
            alunoId: this._alunoId,
            livroId: this._livroId,
            dataEmprestimo: this._dataEmprestimo.toISOString(),
            dataDevolucaoPrevista: this._dataDevolucaoPrevista.toISOString(),
            dataDevolucaoReal: this._dataDevolucaoReal ? this._dataDevolucaoReal.toISOString() : null,
            atrasado: this.estaAtrasado(),
        }
    }

    public static fromJSON(dados: any): Emprestimo {
        if (!dados || !dados.id || !dados.alunoId || !dados.livroId) {
            throw new Error("Dados inválidos!"); // Logica que diz quando os dados forem inválidos 
        }

        return new Emprestimo(
            dados.id,
            dados.alunoId,   // retorna valores 
            dados.livroId,
            new Date(dados.dataEmprestimo),
            new Date(dados.dataDevolucaoPrevista),
            dados.dataDevolucaoReal ? new Date(dados.dataDevolucaoReal) : null
        );
    }
}
