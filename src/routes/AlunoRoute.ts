// src/routes/alunoRoutes.ts
import { Router } from "express";
import { randomUUID } from "crypto";
import { Aluno } from "../entities/Aluno";
import { AlunoRepository } from "../models/AlunoRepository";
import { autenticar } from "../middlewares/auth";
import { autorizar } from "../middlewares/autorizar";

const router = Router();
const alunoRepository = new AlunoRepository();

// Listagem: qualquer papel logado pode ver
router.get("/alunos", autenticar, autorizar("bibliotecario"), (req, res) => {
    try {
        const alunos = alunoRepository.listar();
        res.render("alunos/index", { alunos });
    } catch (error) {
        res.status(500).send("Erro ao listar alunos.");
    }
});

// Escrita: só bibliotecário
router.get("/alunos/novo", autenticar, autorizar("bibliotecario"), (req, res) => {
    res.render("alunos/form", { aluno: null, erro: null });
});

router.get("/alunos/:id/editar", autenticar, autorizar("bibliotecario"), (req, res) => {
    const id = req.params.id;
    if (!id || Array.isArray(id)) {
        res.status(400).send("ID inválido.");
        return;
    }

    const aluno = alunoRepository.buscarPorId(id);
    if (!aluno) {
        res.status(404).send("Aluno não encontrado.");
        return;
    }

    res.render("alunos/form", { aluno, erro: null });
});

router.post("/alunos", autenticar, autorizar("bibliotecario"), (req, res) => {
    try {
        const { nome, matricula } = req.body;
        const aluno = new Aluno(randomUUID(), nome, matricula);
        alunoRepository.criar(aluno);
        res.redirect("/alunos");
    } catch (error: any) {
        res.status(400).render("alunos/form", { aluno: req.body, erro: error.message });
    }
});

router.put("/alunos/:id", autenticar, autorizar("bibliotecario"), (req, res) => {
    const id = req.params.id;
    if (!id || Array.isArray(id)) {
        res.status(400).send("ID inválido.");
        return;
    }

    try {
        const { nome, matricula } = req.body;
        const atualizado = alunoRepository.atualizar(id, { nome, matricula });

        if (!atualizado) {
            res.status(404).send("Aluno não encontrado.");
            return;
        }

        res.redirect("/alunos");
    } catch (error: any) {
        res.status(400).render("alunos/form", { aluno: req.body, erro: error.message });
    }
});

router.delete("/alunos/:id", autenticar, autorizar("bibliotecario"), (req, res) => {
    const id = req.params.id;
    if (!id || Array.isArray(id)) {
        res.status(400).json({ mensagem: "ID inválido." });
        return;
    }

    const removido = alunoRepository.remover(id);

    if (!removido) {
        res.status(404).json({ mensagem: "Aluno não encontrado." });
        return;
    }

    res.status(200).json({ mensagem: "Aluno removido com sucesso." });
});

router.get("/api/alunos/busca", autenticar, (req, res) => {
    const termo = String(req.query.nome ?? "");
    const alunos = alunoRepository.buscarPorNome(termo);
    res.status(200).json(alunos.map(aluno => aluno.toJSON()));
});

export default router;