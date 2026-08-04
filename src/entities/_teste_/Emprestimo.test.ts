import { Emprestimo } from '../Emprestimo'; // Ajuste o caminho do import se necessário

describe('Entidade Emprestimo', () => {
  // Configuração de dados válidos reutilizáveis nos testes
  const idValido = 'emp-123';
  const alunoIdValido = 'aluno-456';
  const livroIdValido = 'livro-789';

  // Criando datas base para os testes
  const dataAtual = new Date();
  const dataDevolucaoValida = new Date(dataAtual);
  dataDevolucaoValida.setDate(dataAtual.getDate() + 7); // Devolução em 7 dias

  describe('Criação de instância e Getters', () => {
    it('deve criar uma instância de Emprestimo com dados válidos', () => {
      const emprestimo = new Emprestimo(
        idValido,
        alunoIdValido,
        livroIdValido,
        dataAtual,
        dataDevolucaoValida,
        null
      );

      expect(emprestimo.id).toBe(idValido);
      expect(emprestimo.alunoId).toBe(alunoIdValido);
      expect(emprestimo.livroId).toBe(livroIdValido);
      expect(emprestimo.dataEmprestimo).toEqual(dataAtual);
      expect(emprestimo.dataDevolucaoPrevista).toEqual(dataDevolucaoValida);
      expect(emprestimo.dataDevolucaoReal).toBeNull();
    });
  });

  describe('Setters e Validações', () => {
    let emprestimo: Emprestimo;

    beforeEach(() => {
      emprestimo = new Emprestimo(
        idValido,
        alunoIdValido,
        livroIdValido,
        dataAtual,
        dataDevolucaoValida,
        null
      );
    });

    it('deve atualizar alunoId e remover espaços em branco nas extremidades', () => {
      emprestimo.alunoId = '  novo-aluno  ';
      expect(emprestimo.alunoId).toBe('novo-aluno');
    });

    it('deve lançar erro ao atribuir alunoId vazio ou inválido', () => {
      expect(() => {
        emprestimo.alunoId = '   ';
      }).toThrow('ID do aluno inválido');
    });

    it('deve atualizar livroId e remover espaços em branco nas extremidades', () => {
      emprestimo.livroId = '  novo-livro  ';
      expect(emprestimo.livroId).toBe('novo-livro');
    });

    it('deve lançar erro ao atribuir livroId vazio ou inválido', () => {
      expect(() => {
        emprestimo.livroId = '';
      }).toThrow('ID do livro inválido');
    });

    it('deve lançar erro se dataEmprestimo não for uma instância de Date', () => {
      expect(() => {
        emprestimo.dataEmprestimo = '2026-08-01' as any;
      }).toThrow('Data de empréstimo inválida');
    });

    it('deve lançar erro se dataDevolucaoPrevista não for uma instância de Date', () => {
      expect(() => {
        emprestimo.dataDevolucaoPrevista = null as any;
      }).toThrow('Data de devolução prevista inválida');
    });

    it('deve aceitar uma data válida para dataDevolucaoReal', () => {
      const dataDevolucao = new Date();
      expect(() => {
        emprestimo.dataDevolucaoReal = dataDevolucao;
      }).not.toThrow();
      expect(emprestimo.dataDevolucaoReal).toEqual(dataDevolucao);
    });

    it('deve lançar erro se dataDevolucaoReal for inválida (diferente de null e de Date)', () => {
      expect(() => {
        emprestimo.dataDevolucaoReal = 'data-invalida' as any;
      }).toThrow('Data de devolução real inválida');
    });
  });

  describe('Método validar()', () => {
    it('deve retornar true para um empréstimo com dados e datas válidas', () => {
      const emprestimo = new Emprestimo(
        idValido,
        alunoIdValido,
        livroIdValido,
        dataAtual,
        dataDevolucaoValida,
        null
      );
      expect(emprestimo.validar()).toBe(true);
    });

    it('deve retornar false se a dataDevolucaoPrevista for anterior ou igual à dataEmprestimo', () => {
      const dataAnterior = new Date(dataAtual);
      dataAnterior.setDate(dataAtual.getDate() - 1);

      const emprestimo = new Emprestimo(
        idValido,
        alunoIdValido,
        livroIdValido,
        dataAtual,
        dataAnterior, // Devolução prevista no passado em relação ao empréstimo
        null
      );

      expect(emprestimo.validar()).toBe(false);
    });
  });

  describe('Método finalizarDevolucao()', () => {
    it('deve registrar a data de devolução real com a data/hora atual', () => {
      const emprestimo = new Emprestimo(
        idValido,
        alunoIdValido,
        livroIdValido,
        dataAtual,
        dataDevolucaoValida,
        null
      );

      emprestimo.finalizarDevolucao();

      expect(emprestimo.dataDevolucaoReal).toBeInstanceOf(Date);
    });

    it('deve lançar erro ao tentar finalizar um empréstimo que já foi finalizado', () => {
      const emprestimo = new Emprestimo(
        idValido,
        alunoIdValido,
        livroIdValido,
        dataAtual,
        dataDevolucaoValida,
        new Date()
      );

      expect(() => {
        emprestimo.finalizarDevolucao();
      }).toThrow('Este empréstimo já foi finalizado');
    });
  });

  describe('Método estaAtrasado()', () => {
    it('deve retornar false se o livro foi devolvido no prazo', () => {
      const dataEmprestimo = new Date('2026-08-01');
      const dataPrevista = new Date('2026-08-10');
      const dataDevolucaoReal = new Date('2026-08-05');

      const emprestimo = new Emprestimo(
        idValido,
        alunoIdValido,
        livroIdValido,
        dataEmprestimo,
        dataPrevista,
        dataDevolucaoReal
      );

      expect(emprestimo.estaAtrasado()).toBe(false);
    });

    it('deve retornar true se o livro foi devolvido após a data prevista', () => {
      const dataEmprestimo = new Date('2026-08-01');
      const dataPrevista = new Date('2026-08-10');
      const dataDevolucaoReal = new Date('2026-08-12'); // Atrasou 2 dias

      const emprestimo = new Emprestimo(
        idValido,
        alunoIdValido,
        livroIdValido,
        dataEmprestimo,
        dataPrevista,
        dataDevolucaoReal
      );

      expect(emprestimo.estaAtrasado()).toBe(true);
    });

    it('deve retornar true se o livro ainda não foi devolvido e a data prevista já passou', () => {
      const dataEmprestimo = new Date('2020-01-01');
      const dataPrevista = new Date('2020-01-10'); // Data muito antiga

      const emprestimo = new Emprestimo(
        idValido,
        alunoIdValido,
        livroIdValido,
        dataEmprestimo,
        dataPrevista,
        null
      );

      expect(emprestimo.estaAtrasado()).toBe(true);
    });
  });

  describe('Métodos toJSON() e fromJSON()', () => {
    it('deve serializar corretamente a instância para JSON', () => {
      const emprestimo = new Emprestimo(
        idValido,
        alunoIdValido,
        livroIdValido,
        dataAtual,
        dataDevolucaoValida,
        null
      );

      const json = emprestimo.toJSON();

      expect(json.id).toBe(idValido);
      expect(json.alunoId).toBe(alunoIdValido);
      expect(json.livroId).toBe(livroIdValido);
      expect(json.dataEmprestimo).toBe(dataAtual.toISOString());
      expect(json.dataDevolucaoPrevista).toBe(dataDevolucaoValida.toISOString());
      expect(json.dataDevolucaoReal).toBeNull();
      expect(typeof json.atrasado).toBe('boolean');
    });

    it('deve deserializar corretamente um objeto JSON criando uma instância válida de Emprestimo', () => {
      const dadosJson = {
        id: 'emp-999',
        alunoId: 'aluno-888',
        livroId: 'livro-777',
        dataEmprestimo: '2026-08-01T10:00:00.000Z',
        dataDevolucaoPrevista: '2026-08-08T10:00:00.000Z',
        dataDevolucaoReal: null,
      };

      const emprestimo = Emprestimo.fromJSON(dadosJson);

      expect(emprestimo).toBeInstanceOf(Emprestimo);
      expect(emprestimo.id).toBe('emp-999');
      expect(emprestimo.alunoId).toBe('aluno-888');
      expect(emprestimo.dataEmprestimo).toBeInstanceOf(Date);
    });

    it('deve lançar erro em fromJSON() caso falte algum dado obrigatório', () => {
      const dadosIncompletos = {
        id: 'emp-999',
        // faltando alunoId
        livroId: 'livro-777',
      };

      expect(() => {
        Emprestimo.fromJSON(dadosIncompletos);
      }).toThrow('Dados inválidos!');
    });
  });
});