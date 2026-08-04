import { Aluno } from '../Aluno';

const idValido = '1';
const nomeValido = 'João Silva';
const matriculaValida = '12345';

describe('Entidade Aluno', () => {
  describe('Criação de instâncias e Getters', () => {
    it('deve criar um aluno com dados válidos', () => {
      const aluno = new Aluno(idValido, nomeValido, matriculaValida);

      expect(aluno.id).toBe(idValido);
      expect(aluno.nome).toBe(nomeValido);
      expect(aluno.matricula).toBe(matriculaValida);
    });
  });

  describe('Validação do Nome (Setter)', () => {
    it('deve permitir nomes com 3 ou mais caracteres', () => {
      expect(() => new Aluno(idValido, 'Ana', matriculaValida)).not.toThrow();
    });

    it('deve lançar "Nome inválido!" se o nome tiver menos de 3 caracteres', () => {
      expect(() => {
        new Aluno(idValido, '', matriculaValida);
      }).toThrow('Nome inválido!');
    });

    it('deve remover espaços em branco no início e no fim do nome', () => {
      const aluno = new Aluno(idValido, '  Maria Clara  ', matriculaValida);

      expect(aluno.nome).toBe('Maria Clara');
    });
  });
});