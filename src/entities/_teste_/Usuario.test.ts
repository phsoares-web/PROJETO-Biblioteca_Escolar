import { Usuario } from '../Usuario'; // Ajuste o caminho de importação conforme a estrutura de pastas

describe('Entidade Usuario', () => {
  const idValido = 'user-123';
  const nomeValido = 'Maria Silva';
  const emailValido = 'maria@email.com';
  const hashValido = '$2b$10$e8.10/24mZ.s5i45g.O7..S/p63hA/l3xO0A9q3a8Z2eXp5Y6z9.'; // Hash simulado de bcrypt

  describe('Criação de Instância e Getters', () => {
    it('deve criar uma instância de Usuario com dados válidos', () => {
      const usuario = new Usuario(idValido, nomeValido, emailValido, hashValido);

      expect(usuario.id).toBe(idValido);
      expect(usuario.nome).toBe(nomeValido);
      expect(usuario.email).toBe(emailValido);
      expect(usuario.senhaHash).toBe(hashValido);
    });
  });

  describe('Setters e Validações', () => {
    let usuario: Usuario;

    beforeEach(() => {
      usuario = new Usuario(idValido, nomeValido, emailValido, hashValido);
    });

    // --- Nome ---
    it('deve atualizar o nome e remover espaços nas extremidades', () => {
      usuario.nome = '  Ana Clara  ';
      expect(usuario.nome).toBe('Ana Clara');
    });

    it('deve lançar erro "Nome Inválido" se o nome tiver menos de 3 caracteres', () => {
      expect(() => {
        usuario.nome = 'An';
      }).toThrow('Nome Inválido');
    });

    // --- E-mail ---
    it('deve formatar o e-mail para letras minúsculas e sem espaços', () => {
      usuario.email = '  MARIA.SILVA@EMAIL.COM  ';
      expect(usuario.email).toBe('maria.silva@email.com');
    });

    it('deve lançar erro "E-mail Inválido" para e-mails sem o símbolo @ ou sem domínio correto', () => {
      expect(() => {
        usuario.email = 'emailinvalido.com';
      }).toThrow('E-mail Inválido');

      expect(() => {
        usuario.email = 'usuario@dominiosemponto';
      }).toThrow('E-mail Inválido');
    });

    // --- Senha Hash ---
    it('deve lançar erro "Hash da senha indisponível" ao passar hash vazio', () => {
      expect(() => {
        usuario.senhaHash = '   ';
      }).toThrow('Hash da senha indisponível');
    });
  });

  describe('Método Estático criar() e Validação de Senha (Assíncrono)', () => {
    it('deve criar um usuário criptografando a senha plana', async () => {
      const senhaPlana = 'senhaSegura123';
      const usuario = await Usuario.criar(idValido, nomeValido, emailValido, senhaPlana);

      expect(usuario).toBeInstanceOf(Usuario);
      expect(usuario.senhaHash).not.toBe(senhaPlana); // A senha gravada deve ser o hash, não a palavra aberta
      expect(usuario.senhaHash.length).toBeGreaterThan(0);
    });

    it('deve validar a senha digitada corretamente usando validarSenha()', async () => {
      const senhaPlana = 'minhaSenhaExata';
      const usuario = await Usuario.criar(idValido, nomeValido, emailValido, senhaPlana);

      const senhaCorreta = await usuario.validarSenha('minhaSenhaExata');
      const senhaIncorreta = await usuario.validarSenha('senhaErrada');

      expect(senhaCorreta).toBe(true);
      expect(senhaIncorreta).toBe(false);
    });

    it('deve lançar erro ao tentar criar um usuário com senha plana vazia', async () => {
      await expect(
        Usuario.criar(idValido, nomeValido, emailValido, '')
      ).rejects.toThrow('Senha inválida.');
    });
  });

  describe('Métodos toJSON(), validar() e fromJSON()', () => {
    it('deve retornar apenas id, nome e email no toJSON() (ocultando a senha por segurança)', () => {
      const usuario = new Usuario(idValido, nomeValido, emailValido, hashValido);
      const json = usuario.toJSON();

      expect(json).toEqual({
        id: idValido,
        nome: nomeValido,
        email: emailValido,
      });
      expect(json).not.toHaveProperty('senhaHash');
    });

    it('deve validar a integridade dos dados através do método validar()', () => {
      const usuarioValido = new Usuario(idValido, nomeValido, emailValido, hashValido);
      expect(usuarioValido.validar()).toBe(true);
    });

    it('deve reinstanciar o usuário corretamente a partir de fromJSON()', () => {
      const dados = {
        id: 'usr-999',
        nome: 'Carlos Eduardo',
        email: 'carlos@email.com',
        senhaHash: '$2b$10$hashSimuladoAqui',
      };

      const usuario = Usuario.fromJSON(dados);

      expect(usuario).toBeInstanceOf(Usuario);
      expect(usuario.id).toBe('usr-999');
      expect(usuario.nome).toBe('Carlos Eduardo');
    });

    it('deve lançar erro no fromJSON() caso faltem campos obrigatórios', () => {
      const dadosIncompletos = {
        id: 'usr-999',
        nome: 'Carlos Eduardo',
        // sem email e sem senhaHash
      };

      expect(() => {
        Usuario.fromJSON(dadosIncompletos);
      }).toThrow('Campos Indisponíveis');
    });
  });
});