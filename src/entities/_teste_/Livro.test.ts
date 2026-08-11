import { Livro } from '../Livro'; // Ajuste o caminho de importação conforme a estrutura de pastas

describe('Entidade Livro', () => {
  const idValido = '1';
  const tituloValido = 'Dom Casmurro';
  const autorValido = 'Machado de Assis';
  const disponivelValido = true;
  const capaUrlValida = 'https://exemplo.com/capa.jpg';

  describe('Criação de Instância e Getters', () => {
    it('deve criar uma instância de Livro com dados válidos', () => {
      const livro = new Livro(
        idValido,
        tituloValido,
        autorValido,
        disponivelValido,
        capaUrlValida
      );

      expect(livro.id).toBe(idValido);
      expect(livro.titulo).toBe(tituloValido);
      expect(livro.autor).toBe(autorValido);
      expect(livro.disponivel).toBe(disponivelValido);
      expect(livro.capaUrl).toBe(capaUrlValida);
    });

    it('deve permitir criar um livro com capaUrl nula', () => {
      const livro = new Livro(
        idValido,
        tituloValido,
        autorValido,
        disponivelValido,
        null
      );

      expect(livro.capaUrl).toBeNull();
    });
  });

  describe('Setters e Validações', () => {
    let livro: Livro;

    beforeEach(() => {
      livro = new Livro(
        idValido,
        tituloValido,
        autorValido,
        disponivelValido,
        capaUrlValida
      );
    });

    it('deve atualizar o título e remover espaços nas extremidades', () => {
      livro.titulo = '  Memórias Póstumas  ';
      expect(livro.titulo).toBe('Memórias Póstumas');
    });

    it('deve lançar erro "Título inválido!" ao definir título vazio', () => {
      expect(() => {
        livro.titulo = '   ';
      }).toThrow('Título inválido!');
    });

    it('deve atualizar o autor e remover espaços nas extremidades', () => {
      livro.autor = '  Clarice Lispector  ';
      expect(livro.autor).toBe('Clarice Lispector');
    });

    it('deve lançar erro "Autor inválido!" ao definir autor vazio', () => {
      expect(() => {
        livro.autor = '';
      }).toThrow('Autor inválido!');
    });

    it('deve atualizar o status de disponibilidade', () => {
      livro.disponivel = false;
      expect(livro.disponivel).toBe(false);
    });

    it('deve atualizar a capaUrl e remover espaços nas extremidades', () => {
      livro.capaUrl = '  https://exemplo.com/nova-capa.jpg  ';
      expect(livro.capaUrl).toBe('https://exemplo.com/nova-capa.jpg');
    });

    it('deve aceitar null como capaUrl', () => {
      livro.capaUrl = null;
      expect(livro.capaUrl).toBeNull();
    });

    it('deve lançar erro "URL da capa inválida!" ao definir string apenas com espaços', () => {
      expect(() => {
        livro.capaUrl = '   ';
      }).toThrow('URL da capa inválida!');
    });
  });

  describe('Método validar()', () => {
    it('deve retornar true para um livro totalmente válido', () => {
      const livro = new Livro(
        idValido,
        tituloValido,
        autorValido,
        disponivelValido,
        capaUrlValida
      );
      expect(livro.validar()).toBe(true);
    });

    it('deve retornar false se o id estiver vazio', () => {
      const livro = new Livro(
        '',
        tituloValido,
        autorValido,
        disponivelValido,
        capaUrlValida
      );
      expect(livro.validar()).toBe(false);
    });
  });

  describe('Métodos toJSON() e fromJSON()', () => {
    it('deve serializar a classe corretamente com toJSON()', () => {
      const livro = new Livro(
        idValido,
        tituloValido,
        autorValido,
        disponivelValido,
        capaUrlValida
      );

      const json = livro.toJSON();

      expect(json).toEqual({
        id: idValido,
        titulo: tituloValido,
        autor: autorValido,
        disponivel: disponivelValido,
        capaUrl: capaUrlValida,
      });
    });

    it('deve instanciar um Livro corretamente com fromJSON()', () => {
      const dadosJson = {
        id: '10',
        titulo: 'O Alquimista',
        autor: 'Paulo Coelho',
        disponivel: true,
        capaUrl: 'https://exemplo.com/alquimista.jpg',
      };

      const livro = Livro.fromJSON(dadosJson);

      expect(livro).toBeInstanceOf(Livro);
      expect(livro.id).toBe('10');
      expect(livro.titulo).toBe('O Alquimista');
      expect(livro.autor).toBe('Paulo Coelho');
      expect(livro.disponivel).toBe(true);
    });

    it('deve lançar erro ao passar dados incompletos para o fromJSON()', () => {
      const dadosIncompletos = {
        id: '10',
        titulo: 'Livro Sem Autor',
      };

      expect(() => {
        Livro.fromJSON(dadosIncompletos);
      }).toThrow('Dados inválidos para criar um livro');
    });
  });
});