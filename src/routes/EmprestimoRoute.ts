// src/routes/EmprestimoRoutes.ts
// Rotas de Empréstimo: registra e finaliza empréstimos de livros para
// alunos. A regra de negócio pesada (checar disponibilidade, marcar
// livro como indisponível etc.) já mora no EmprestimoRepository.

import { Router } from "express";
import { randomUUID } from "crypto";
import { Emprestimo } from "../entities/Emprestimo";
import { EmprestimoRepository } from "../models/EmprestimoRepository";
import { AlunoRepository } from "../models/AlunoRepository";
import { LivroRepository } from "../models/LivroRepository";

const router = Router();
const emprestimoRepository = new EmprestimoRepository();
const alunoRepository = new AlunoRepository();
const livroRepository = new LivroRepository();

router.get("/emprestimos", (req, res) => {
    try {
        const emprestimos = emprestimoRepository.listar().map(emprestimo => {
            const aluno = alunoRepository.buscarPorId(emprestimo.alunoId);
            const livro = livroRepository.buscarPorId(emprestimo.livroId);

            return {
                ...emprestimo.toJSON(),
                alunoNome: aluno ? aluno.nome : "Aluno não encontrado",
                livroTitulo: livro ? livro.titulo : "Livro não encontrado",
            };
        });

        res.render("emprestimos/index", { emprestimos });
    } catch (error) {
        res.status(500).send("Erro ao listar empréstimos.");
    }
});

router.get("/emprestimos/atrasados", (req, res) => {
    const emprestimos = emprestimoRepository.listarAtrasados().map(emprestimo => {
        const aluno = alunoRepository.buscarPorId(emprestimo.alunoId);
        const livro = livroRepository.buscarPorId(emprestimo.livroId);

        return {
            ...emprestimo.toJSON(),
            alunoNome: aluno ? aluno.nome : "Aluno não encontrado",
            livroTitulo: livro ? livro.titulo : "Livro não encontrado",
        };
    });

    res.render("emprestimos/index", { emprestimos });
});

router.get("/emprestimos/novo", (req, res) => {
    // O formulário precisa de listas de alunos e livros disponíveis
    // pra montar os <select> na view.
    const alunos = alunoRepository.listar();
    const livros = livroRepository.listar().filter(livro => livro.disponivel);
    res.render("emprestimos/form", { alunos, livros, erro: null });
});

router.post("/emprestimos", (req, res) => {
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
        res.status(400).render("emprestimos/form", { alunos, livros, erro: error.message });
    }
});

router.put("/emprestimos/:id/devolver", (req, res) => {
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

router.delete("/emprestimos/:id", (req, res) => {
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

router.get("/emprestimos/atrasados", (req, res) => {
    const emprestimos = emprestimoRepository.listarAtrasados();
    res.render("emprestimos/index", { emprestimos });
});

export default router;