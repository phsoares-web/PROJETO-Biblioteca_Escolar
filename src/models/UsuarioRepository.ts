import fs from "fs";
import path from "path";
import { Usuario } from "../entities/Usuario";

type UsuarioAtualizavel = Partial<Pick<Usuario, "nome" | "email">>;

export class UsuarioRepository {

    private caminho = path.resolve("dados", "usuarios.json");

    constructor() {
        const pasta = path.dirname(this.caminho);

        if (!fs.existsSync(pasta)) {
            fs.mkdirSync(pasta, { recursive: true });
        }

        if (!fs.existsSync(this.caminho)) {
            fs.writeFileSync(this.caminho, "[]");
        }
    }

    private lerArquivo(): Usuario[] {
        const dados = fs.readFileSync(this.caminho, "utf-8");
        return JSON.parse(dados).map((usuario: any) => Usuario.fromJSON(usuario));
    }

    private salvarArquivo(usuarios: Usuario[]): void {
        fs.writeFileSync(
            this.caminho,
            JSON.stringify(
                usuarios.map(usuario => usuario.paraArmazenamento()),
                null,
                2
            )
        );
    }

    listar(): Usuario[] {
        return this.lerArquivo();
    }

    buscarPorId(id: string): Usuario | undefined {
        return this.lerArquivo().find(
            usuario => usuario.id === id
        );
    }

    buscarPorEmail(email: string): Usuario | undefined {
        return this.lerArquivo().find(
            usuario => usuario.email === email.trim().toLowerCase()
        );
    }

    async criar(id: string, nome: string, email: string, senhaPlana: string): Promise<Usuario> {
        const usuarios = this.lerArquivo();

        if (usuarios.some(u => u.id === id)) {
            throw new Error("Já existe um usuário com este ID.");
        }

        if (usuarios.some(u => u.email === email.trim().toLowerCase())) {
            throw new Error("Já existe um usuário com este e-mail.");
        }

        const usuario = await Usuario.criar(id, nome, email, senhaPlana);

        if (!usuario.validar()) {
            throw new Error("Usuário inválido!");
        }

        usuarios.push(usuario);
        this.salvarArquivo(usuarios);
        return usuario;
    }

    atualizar(id: string, dados: UsuarioAtualizavel): boolean {
        const usuarios = this.lerArquivo();
        const usuario = usuarios.find(u => u.id === id);

        if (!usuario) {
            return false;
        }

        if (dados.email !== undefined) {
            const emailEmUso = usuarios.some(
                u => u.id !== id && u.email === dados.email!.trim().toLowerCase()
            );
            if (emailEmUso) {
                throw new Error("E-mail já pertence a outro usuário.");
            }
        }

        if (dados.nome !== undefined) {
            usuario.nome = dados.nome;
        }

        if (dados.email !== undefined) {
            usuario.email = dados.email;
        }

        this.salvarArquivo(usuarios);
        return true;
    }

    async autenticar(email: string, senhaPlana: string): Promise<Usuario | null> {
        const usuario = this.buscarPorEmail(email);

        if (!usuario) {
            return null;
        }

        const senhaCorreta = await usuario.validarSenha(senhaPlana);
        return senhaCorreta ? usuario : null;
    }

    remover(id: string): boolean {
        const usuarios = this.lerArquivo();
        const indice = usuarios.findIndex(usuario => usuario.id === id);

        if (indice === -1) {
            return false;
        }

        usuarios.splice(indice, 1);
        this.salvarArquivo(usuarios);
        return true;
    }
}