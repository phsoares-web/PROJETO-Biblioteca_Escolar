// Empréstimos são exclusivos para usuários sem matrícula, ou seja, bibliotecários.

import { Router } from "express";
import { randomUUID } from "crypto";
import { Emprestimo } from "../entities/Emprestimo";
import { EmprestimoRepository } from "../models/EmprestimoRepository";
import { AlunoRepository } from "../models/AlunoRepository";
import { LivroRepository } from "../models/LivroRepository";
import { UsuarioRepository } from "../models/UsuarioRepository";
import { autenticar } from "../middlewares/auth";
import { autorizar } from "../middlewares/autorizar";

const router = Router();
const emprestimoRepository = new EmprestimoRepository();
const alunoRepository = new AlunoRepository();
const livroRepository = new LivroRepository();
const usuarioRepository = new UsuarioRepository();

// Busca o usuário logado (pra passar pra view, decidir o que mostrar
// na tela — nav bar, botões etc.). Reaproveitado em toda rota GET.
function buscarUsuarioDaSessao(req: any) {
    return req.session.usuarioId
        ? usuarioRepository.buscarPorId(req.session.usuarioId)
        : null;
}

// Junta cada Emprestimo com o nome do aluno e o título do livro,
// já que a entidade só guarda os IDs (alunoId, livroId).
function enriquecer(emprestimo: Emprestimo) {
    const aluno = alunoRepository.buscarPorId(emprestimo.alunoId);
    const livro = livroRepository.buscarPorId(emprestimo.livroId);

    return {
        ...emprestimo.toJSON(),
        alunoNome: aluno ? aluno.nome : "Aluno não encontrado",
        livroTitulo: livro ? livro.titulo : "Livro não encontrado",
    };
}

router.get("/emprestimos", autenticar, autorizar("bibliotecario"), (req, res) => {
    try {
        const emprestimos = emprestimoRepository.listar().map(enriquecer);
        const usuario = buscarUsuarioDaSessao(req);

        res.render("emprestimos/index", { emprestimos, usuario });
    } catch (error) {
        res.status(500).send("Erro ao listar empréstimos.");
    }
});

router.get("/emprestimos/novo", autenticar, autorizar("bibliotecario"), (req, res) => {
    // O formulário precisa de listas de alunos e livros disponíveis
    // pra montar os <select> na view.
    const alunos = alunoRepository.listar();
    const livros = livroRepository.listar().filter(livro => livro.disponivel);
    const usuario = buscarUsuarioDaSessao(req);

    res.render("emprestimos/form", { alunos, livros, erro: null, usuario });
});

router.post("/emprestimos", autenticar, autorizar("bibliotecario"), (req, res) => {
    try {
        const { alunoId, livroId, dataDevolucaoPrevista } = req.body;
        const agora = new Date();

        const emprestimo = new Emprestimo(
            randomUUID(),
            alunoId,
            livroId,
            agora,
            new Date(dataDevolucaoPrevista),
            null
        );

        // registrarEmprestimo já valida aluno, livro e disponibilidade,
        // e marca o livro como indisponível automaticamente.
        emprestimoRepository.registrarEmprestimo(emprestimo);
        res.redirect("/emprestimos");
    } catch (error: any) {
        const alunos = alunoRepository.listar();
        const livros = livroRepository.listar().filter(livro => livro.disponivel);
        const usuario = buscarUsuarioDaSessao(req);

        res.status(400).render("emprestimos/form", { alunos, livros, erro: error.message, usuario });
    }
});

router.put("/emprestimos/:id/devolver", autenticar, autorizar("bibliotecario"), (req, res) => {
    const id = req.params.id;
    if (!id || Array.isArray(id)) {
        res.status(400).send("ID inválido.");
        return;
    }

    // Marca a data de devolução real e libera o livro (disponivel = true).
    const devolvido = emprestimoRepository.registrarDevolucao(id);
    if (!devolvido) {
        res.status(404).send("Empréstimo não encontrado.");
        return;
    }

    res.redirect("/emprestimos");
});

router.delete("/emprestimos/:id", autenticar, autorizar("bibliotecario"), (req, res) => {
    const id = req.params.id;
    if (!id || Array.isArray(id)) {
        res.status(400).json({ mensagem: "ID inválido." });
        return;
    }

    const removido = emprestimoRepository.remover(id);

    if (!removido) {
        res.status(404).json({ mensagem: "Empréstimo não encontrado." });
        return;
    }

    res.status(200).json({ mensagem: "Empréstimo removido com sucesso." });
});

router.get("/emprestimos/atrasados", autenticar, autorizar("bibliotecario"), (req, res) => {
    const emprestimos = emprestimoRepository.listarAtrasados().map(enriquecer);
    const usuario = buscarUsuarioDaSessao(req);

    res.render("emprestimos/index", { emprestimos, usuario });
});

export default router;